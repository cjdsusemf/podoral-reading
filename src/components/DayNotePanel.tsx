"use client";

interface DayNotePanelProps {
  day: number;
  userName?: string;
  checked: boolean;
  note: string;
  editable: boolean;
  isToday: boolean;
  isPast: boolean;
  onNoteChange: (note: string) => void;
  onClose: () => void;
}

export function DayNotePanel({
  day,
  userName,
  checked,
  note,
  editable,
  isToday,
  isPast,
  onNoteChange,
  onClose,
}: DayNotePanelProps) {
  const trimmedNote = note.trim();
  const hasNote = trimmedNote.length > 0;
  const canWrite = editable && checked;

  return (
    <div className="day-note-panel" role="region" aria-label={`${day}일 소감`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-grape-800">{day}일</span>
          {userName && (
            <span className="text-xs font-medium text-grape-500">{userName}</span>
          )}
          {isToday && (
            <span className="rounded-full bg-grape-600 px-2 py-0.5 text-[10px] font-bold text-white">
              오늘
            </span>
          )}
          {checked && (
            <span className="text-sm text-grape-500">독서 완료</span>
          )}
          {isPast && !checked && (
            <span className="text-xs text-gray-400">미완료</span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-grape-400 transition hover:bg-grape-50"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      {canWrite && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold text-grape-500">오늘의 소감</p>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="오늘 읽은 소감을 적어보세요..."
            rows={4}
            autoFocus={isToday}
            className="w-full resize-none rounded-xl border border-grape-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-grape-400 focus:ring-2 focus:ring-grape-100"
          />
        </div>
      )}

      {!canWrite && hasNote && (
        <div className="day-note-view mt-3">
          <p className="day-note-view-label">독서 소감</p>
          <p className="day-note-view-text">{trimmedNote}</p>
        </div>
      )}

      {!canWrite && !hasNote && checked && (
        <p className="mt-3 rounded-xl bg-grape-50 px-3 py-2.5 text-sm text-gray-400">
          작성한 소감이 없어요
        </p>
      )}

      {!canWrite && !hasNote && !checked && isPast && (
        <p className="mt-3 text-sm text-gray-400">이 날은 독서하지 않았어요</p>
      )}

      {editable && !checked && (
        <p className="mt-3 text-sm text-grape-500">
          포도알을 눌러 오늘 독서를 체크하세요!
        </p>
      )}
    </div>
  );
}
