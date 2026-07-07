export interface User {
  id: string;
  name: string;
}

export interface DayEntry {
  checked: boolean;
  note: string;
}

export interface UserMonthProgress {
  days: Record<string, DayEntry>;
}

export interface MonthData {
  bookTitle: string;
  userProgress: Record<string, UserMonthProgress>;
}

export interface ReadingData {
  users: User[];
  months: Record<string, MonthData>;
}

export type AppTab = "overview" | "admin" | `user:${string}`;

/** @deprecated 이전 단일 사용자 형식 (마이그레이션용) */
export interface LegacyMonthData {
  bookTitle: string;
  days: Record<string, DayEntry>;
}

/** @deprecated 이전 단일 사용자 형식 (마이그레이션용) */
export interface LegacyReadingData {
  months: Record<string, LegacyMonthData>;
}
