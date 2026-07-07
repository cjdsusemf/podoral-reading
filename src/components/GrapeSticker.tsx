"use client";

interface GrapeStickerProps {
  day: number;
  fillRatio: number;
  mode: "overview" | "user";
  editable: boolean;
  isFuture: boolean;
  isPast: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasNote: boolean;
  checkedCount?: number;
  totalUsers?: number;
  onClick: () => void;
}

export function GrapeSticker({
  day,
  fillRatio,
  mode,
  editable,
  isFuture,
  isPast,
  isToday,
  isSelected,
  hasNote,
  checkedCount,
  totalUsers,
  onClick,
}: GrapeStickerProps) {
  const clampedFill = Math.max(0, Math.min(1, fillRatio));
  const isOverview = mode === "overview";
  const isFull = isOverview ? clampedFill >= 1 : clampedFill > 0;
  const isPartial = isOverview && clampedFill > 0 && clampedFill < 1;

  let stateClass = "grape-empty";
  if (isFuture) {
    stateClass = "grape-future";
  } else if (isFull) {
    stateClass = "grape-filled";
  } else if (isPartial) {
    stateClass = "grape-partial";
  } else if (isPast) {
    stateClass = "grape-missed";
  }

  const fillPercent = Math.round(clampedFill * 100);
  const countLabel =
    isOverview &&
    checkedCount !== undefined &&
    totalUsers !== undefined &&
    totalUsers > 0
      ? `${checkedCount}/${totalUsers}명`
      : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isFuture}
      className={[
        "grape-btn",
        stateClass,
        mode === "user" && "grape-btn-personal",
        isToday && "grape-today",
        isSelected && "grape-selected",
        isFull && "animate-pop",
        editable ? "cursor-pointer" : isFuture ? "cursor-not-allowed" : "cursor-default",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={
        isOverview
          ? `${day}일 ${isFull ? "전원 독서 완료" : isPartial ? `${fillPercent}% 완료` : "독서 미완료"}`
          : `${day}일 ${isFull ? "독서 완료" : "독서 미완료"}`
      }
      title={countLabel}
    >
      {isPartial && (
        <span
          className="grape-partial-fill"
          style={{ height: `${fillPercent}%` }}
          aria-hidden
        />
      )}
      {isFull && !isFuture && <span className="grape-shine" aria-hidden />}
      <span className="grape-day-num">{day}</span>
      {hasNote && <span className="grape-note-dot" aria-hidden />}
    </button>
  );
}
