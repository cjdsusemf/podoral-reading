"use client";

import { formatMonthLabel } from "@/lib/reading-utils";

interface MonthSelectorProps {
  monthKey: string;
  onMonthChange: (key: string) => void;
}

export function MonthSelector({ monthKey, onMonthChange }: MonthSelectorProps) {
  const [year, month] = monthKey.split("-").map(Number);

  const goPrev = () => {
    const d = new Date(year, month - 2, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    onMonthChange(key);
  };

  const goNext = () => {
    const d = new Date(year, month, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    onMonthChange(key);
  };

  return (
    <div className="month-selector">
      <button
        type="button"
        onClick={goPrev}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-grape-600 transition hover:bg-grape-50 active:scale-95"
        aria-label="이전 달"
      >
        ‹
      </button>
      <span className="text-sm font-semibold text-grape-800 sm:text-base">
        {formatMonthLabel(monthKey)}
      </span>
      <button
        type="button"
        onClick={goNext}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-grape-600 transition hover:bg-grape-50 active:scale-95"
        aria-label="다음 달"
      >
        ›
      </button>
    </div>
  );
}
