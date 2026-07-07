import type {
  DayEntry,
  LegacyReadingData,
  MonthData,
  ReadingData,
  User,
  UserMonthProgress,
} from "@/types/reading";

const STORAGE_KEY = "podoral-reading-data";

export function getMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getDayKey(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  return `${getMonthKey(date)}-${day}`;
}

export function getTodayKey(): string {
  return getDayKey(new Date());
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  return `${year}년 ${Number(month)}월`;
}

export function isPastDay(dayKey: string): boolean {
  return dayKey < getTodayKey();
}

export function isFutureDay(dayKey: string): boolean {
  return dayKey > getTodayKey();
}

export function isToday(dayKey: string): boolean {
  return dayKey === getTodayKey();
}

export function canEditDay(dayKey: string): boolean {
  return isToday(dayKey);
}

export function generateUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function isLegacyMonth(month: Record<string, unknown>): boolean {
  return "days" in month && !("userProgress" in month);
}

function isLegacyData(raw: unknown): raw is LegacyReadingData {
  if (!raw || typeof raw !== "object") return false;
  const data = raw as Record<string, unknown>;
  if (!data.months || typeof data.months !== "object") return false;
  if ("users" in data) return false;

  const months = data.months as Record<string, Record<string, unknown>>;
  const firstMonth = Object.values(months)[0];
  if (!firstMonth) return true;
  return isLegacyMonth(firstMonth);
}

function normalizeMonthData(
  raw: unknown,
  users: User[]
): MonthData {
  if (!raw || typeof raw !== "object") return createEmptyMonthData();

  const month = raw as Record<string, unknown>;
  const bookTitle = typeof month.bookTitle === "string" ? month.bookTitle : "";

  if (
    month.userProgress &&
    typeof month.userProgress === "object" &&
    !Array.isArray(month.userProgress)
  ) {
    return {
      bookTitle,
      userProgress: month.userProgress as Record<string, UserMonthProgress>,
    };
  }

  if (month.days && typeof month.days === "object" && !Array.isArray(month.days)) {
    const owner =
      users[0] ?? { id: generateUserId(), name: "나" };

    return {
      bookTitle,
      userProgress: {
        [owner.id]: { days: month.days as Record<string, DayEntry> },
      },
    };
  }

  return { bookTitle, userProgress: {} };
}

function normalizeUsers(raw: unknown): User[] {
  if (!Array.isArray(raw)) return [];

  return raw.filter(
    (user): user is User =>
      !!user &&
      typeof user === "object" &&
      typeof user.id === "string" &&
      typeof user.name === "string"
  );
}

function normalizeReadingData(parsed: unknown): ReadingData {
  if (isLegacyData(parsed)) {
    return migrateLegacyData(parsed);
  }

  if (!parsed || typeof parsed !== "object") {
    return { users: [], months: {} };
  }

  let users = normalizeUsers((parsed as ReadingData).users);
  const monthsRaw = (parsed as ReadingData).months;
  const months: Record<string, MonthData> = {};

  if (monthsRaw && typeof monthsRaw === "object") {
    for (const [monthKey, monthRaw] of Object.entries(monthsRaw)) {
      months[monthKey] = normalizeMonthData(monthRaw, users);
    }
  }

  const hasProgressWithoutUsers =
    users.length === 0 &&
    Object.values(months).some(
      (month) => Object.keys(month.userProgress).length > 0
    );

  if (hasProgressWithoutUsers) {
    const defaultUser: User = { id: generateUserId(), name: "나" };
    users = [defaultUser];

    for (const monthKey of Object.keys(months)) {
      const orphanDays = Object.values(months[monthKey].userProgress)[0]?.days;
      months[monthKey] = {
        ...months[monthKey],
        userProgress: orphanDays
          ? { [defaultUser.id]: { days: orphanDays } }
          : {},
      };
    }
  }

  return { users, months };
}

function migrateLegacyData(legacy: LegacyReadingData): ReadingData {
  const defaultUser: User = { id: generateUserId(), name: "나" };
  const months: Record<string, MonthData> = {};

  for (const [monthKey, monthData] of Object.entries(legacy.months)) {
    months[monthKey] = {
      bookTitle: monthData.bookTitle ?? "",
      userProgress: {
        [defaultUser.id]: { days: monthData.days ?? {} },
      },
    };
  }

  return { users: [defaultUser], months };
}

export function createEmptyMonthData(): MonthData {
  return { bookTitle: "", userProgress: {} };
}

export function loadData(): ReadingData {
  if (typeof window === "undefined") {
    return { users: [], months: {} };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { users: [], months: {} };

    const parsed: unknown = JSON.parse(raw);
    const normalized = normalizeReadingData(parsed);
    saveData(normalized);
    return normalized;
  } catch {
    return { users: [], months: {} };
  }
}

export function saveData(data: ReadingData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getMonthData(data: ReadingData, monthKey: string): MonthData {
  const raw = data.months?.[monthKey];
  if (!raw) return createEmptyMonthData();
  return normalizeMonthData(raw, data.users ?? []);
}

function getProgressMap(monthData: MonthData): Record<string, UserMonthProgress> {
  return monthData.userProgress ?? {};
}

export function getDayKeyFromMonth(monthKey: string, day: number): string {
  return `${monthKey}-${String(day).padStart(2, "0")}`;
}

export function getDayEntry(
  progress: UserMonthProgress | undefined,
  day: number
): DayEntry {
  const key = String(day).padStart(2, "0");
  return progress?.days[key] ?? { checked: false, note: "" };
}

export function getUserProgress(
  monthData: MonthData,
  userId: string
): UserMonthProgress {
  return getProgressMap(monthData)[userId] ?? { days: {} };
}

export function getDayFillRatio(
  monthData: MonthData,
  day: number,
  userCount: number
): number {
  if (userCount === 0) return 0;

  const key = String(day).padStart(2, "0");
  let checkedCount = 0;

  for (const progress of Object.values(getProgressMap(monthData))) {
    if (progress.days[key]?.checked) checkedCount++;
  }

  return checkedCount / userCount;
}

export function getDayCheckedCount(
  monthData: MonthData,
  day: number
): number {
  const key = String(day).padStart(2, "0");
  let count = 0;

  for (const progress of Object.values(getProgressMap(monthData))) {
    if (progress.days[key]?.checked) count++;
  }

  return count;
}

export function getUserCheckedCount(
  monthData: MonthData,
  userId: string
): number {
  const progress = getUserProgress(monthData, userId);
  return Object.values(progress.days).filter((d) => d.checked).length;
}

export function getCollectiveProgress(
  monthData: MonthData,
  totalDays: number,
  userCount: number
): { completed: number; total: number; percent: number } {
  if (userCount === 0 || totalDays === 0) {
    return { completed: 0, total: 0, percent: 0 };
  }

  let completed = 0;
  for (const progress of Object.values(getProgressMap(monthData))) {
    completed += Object.values(progress.days).filter((d) => d.checked).length;
  }

  const total = totalDays * userCount;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function dayHasAnyNote(monthData: MonthData, day: number): boolean {
  const key = String(day).padStart(2, "0");
  return Object.values(getProgressMap(monthData)).some(
    (progress) => !!progress.days[key]?.note
  );
}
