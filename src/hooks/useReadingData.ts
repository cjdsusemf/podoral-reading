"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppTab, DayEntry, MonthData, ReadingData, User } from "@/types/reading";
import {
  canEditDay,
  generateUserId,
  getCollectiveProgress,
  getDayEntry,
  getDayFillRatio,
  getDayKeyFromMonth,
  getMonthData,
  getMonthKey,
  getUserCheckedCount,
  getUserProgress,
  loadData,
  saveData,
} from "@/lib/reading-utils";

export function useReadingData() {
  const [data, setData] = useState<ReadingData>({ users: [], months: {} });
  const [monthKey, setMonthKey] = useState(getMonthKey());
  const [activeTab, setActiveTab] = useState<AppTab>("overview");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const loaded = loadData();
      setData(loaded);
      setMonthKey(getMonthKey());
      setActiveTab(loaded.users.length > 0 ? "overview" : "admin");
    } catch {
      setData({ users: [], months: {} });
      setActiveTab("admin");
    } finally {
      setHydrated(true);
    }
  }, []);

  const persist = useCallback((next: ReadingData) => {
    setData(next);
    saveData(next);
  }, []);

  const monthData = getMonthData(data, monthKey);
  const userCount = data.users.length;

  const updateMonth = useCallback(
    (updater: (current: MonthData) => MonthData) => {
      const next = {
        ...data,
        months: {
          ...data.months,
          [monthKey]: updater(getMonthData(data, monthKey)),
        },
      };
      persist(next);
    },
    [data, monthKey, persist]
  );

  const setBookTitle = useCallback(
    (bookTitle: string) => {
      updateMonth((current) => ({ ...current, bookTitle }));
    },
    [updateMonth]
  );

  const addUser = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      const user: User = { id: generateUserId(), name: trimmed };
      const next: ReadingData = {
        ...data,
        users: [...data.users, user],
      };
      persist(next);
      setActiveTab(`user:${user.id}`);
      return user;
    },
    [data, persist]
  );

  const removeUser = useCallback(
    (userId: string) => {
      const nextUsers = data.users.filter((u) => u.id !== userId);
      const nextMonths = { ...data.months };

      for (const key of Object.keys(nextMonths)) {
        const progress = { ...nextMonths[key].userProgress };
        delete progress[userId];
        nextMonths[key] = { ...nextMonths[key], userProgress: progress };
      }

      persist({ users: nextUsers, months: nextMonths });

      if (activeTab === `user:${userId}`) {
        setActiveTab(nextUsers.length > 0 ? "overview" : "admin");
      }
    },
    [data, persist, activeTab]
  );

  const toggleUserDay = useCallback(
    (userId: string, day: number) => {
      const dayKey = getDayKeyFromMonth(monthKey, day);
      if (!canEditDay(dayKey)) return;

      updateMonth((current) => {
        const progress = getUserProgress(current, userId);
        const key = String(day).padStart(2, "0");
        const entry = progress.days[key] ?? { checked: false, note: "" };

        return {
          ...current,
          userProgress: {
            ...current.userProgress,
            [userId]: {
              days: {
                ...progress.days,
                [key]: { ...entry, checked: !entry.checked },
              },
            },
          },
        };
      });
    },
    [monthKey, updateMonth]
  );

  const setUserDayNote = useCallback(
    (userId: string, day: number, note: string) => {
      const dayKey = getDayKeyFromMonth(monthKey, day);
      if (!canEditDay(dayKey)) return;

      updateMonth((current) => {
        const progress = getUserProgress(current, userId);
        const key = String(day).padStart(2, "0");
        const entry = progress.days[key] ?? { checked: false, note: "" };

        return {
          ...current,
          userProgress: {
            ...current.userProgress,
            [userId]: {
              days: {
                ...progress.days,
                [key]: { ...entry, note },
              },
            },
          },
        };
      });
    },
    [monthKey, updateMonth]
  );

  const getUserEntry = useCallback(
    (userId: string, day: number): DayEntry => {
      return getDayEntry(getUserProgress(monthData, userId), day);
    },
    [monthData]
  );

  const getFillRatio = useCallback(
    (day: number): number => getDayFillRatio(monthData, day, userCount),
    [monthData, userCount]
  );

  const activeUserId =
    activeTab.startsWith("user:") ? activeTab.slice(5) : null;

  const activeUser = activeUserId
    ? data.users.find((u) => u.id === activeUserId) ?? null
    : null;

  return {
    hydrated,
    data,
    users: data.users,
    monthKey,
    setMonthKey,
    monthData,
    userCount,
    activeTab,
    setActiveTab,
    activeUser,
    activeUserId,
    setBookTitle,
    addUser,
    removeUser,
    toggleUserDay,
    setUserDayNote,
    getUserEntry,
    getFillRatio,
    getUserCheckedCount: (userId: string) =>
      getUserCheckedCount(monthData, userId),
    getCollectiveProgress: (totalDays: number) =>
      getCollectiveProgress(monthData, totalDays, userCount),
  };
}
