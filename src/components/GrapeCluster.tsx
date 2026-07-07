"use client";

import { GrapeSticker } from "./GrapeSticker";
import { buildGrapeRows } from "@/lib/grape-layout";
import {
  canEditDay,
  dayHasAnyNote,
  getDayCheckedCount,
  getDayKeyFromMonth,
  isFutureDay,
  isPastDay,
  isToday,
} from "@/lib/reading-utils";
import type { MonthData } from "@/types/reading";

interface GrapeClusterProps {
  monthKey: string;
  monthData: MonthData;
  totalDays: number;
  userCount: number;
  mode: "overview" | "user";
  getFillRatio: (day: number) => number;
  getHasNote?: (day: number) => boolean;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  onToggleDay?: (day: number) => void;
  readOnly?: boolean;
}

export function GrapeCluster({
  monthKey,
  monthData,
  totalDays,
  userCount,
  mode,
  getFillRatio,
  getHasNote,
  selectedDay,
  onSelectDay,
  onToggleDay,
  readOnly = false,
}: GrapeClusterProps) {
  const rows = buildGrapeRows(totalDays);
  const isOverview = mode === "overview";

  const handleGrapeClick = (day: number) => {
    const dayKey = getDayKeyFromMonth(monthKey, day);
    const isDayToday = canEditDay(dayKey);

    onSelectDay(day);

    if (!readOnly && onToggleDay && isDayToday) {
      onToggleDay(day);
    }
  };

  return (
    <div className="grape-cluster-board mx-auto w-full max-w-[min(100%,22rem)]">
      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 80 56"
          className="grape-stem mb-1 w-[4.5rem] sm:w-20"
          aria-hidden
        >
          <path
            d="M40 52 Q38 34 36 18 Q34 10 30 6"
            fill="none"
            stroke="#a8d5a2"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M36 18 Q22 12 12 20 Q18 24 26 22 Q20 30 28 34"
            fill="#c8e6c4"
            stroke="#a8d5a2"
            strokeWidth="1"
          />
          <path
            d="M36 18 Q50 12 60 20 Q54 24 46 22 Q52 30 44 34"
            fill="#c8e6c4"
            stroke="#a8d5a2"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-[clamp(0.35rem,1.8vw,0.55rem)]">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center justify-center gap-[clamp(0.3rem,1.5vw,0.5rem)]"
          >
            {row.map((day) => {
              const dayKey = getDayKeyFromMonth(monthKey, day);
              const fillRatio = getFillRatio(day);
              const hasNote = getHasNote
                ? getHasNote(day)
                : dayHasAnyNote(monthData, day);

              return (
                <GrapeSticker
                  key={day}
                  day={day}
                  fillRatio={fillRatio}
                  mode={mode}
                  editable={!readOnly && canEditDay(dayKey)}
                  isFuture={isFutureDay(dayKey)}
                  isPast={isPastDay(dayKey)}
                  isToday={isToday(dayKey)}
                  isSelected={selectedDay === day}
                  hasNote={hasNote}
                  checkedCount={
                    isOverview ? getDayCheckedCount(monthData, day) : undefined
                  }
                  totalUsers={isOverview ? userCount : undefined}
                  onClick={() => handleGrapeClick(day)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
