"use client";

import type { DayEntry, User } from "@/types/reading";

interface DaySummaryPanelProps {
  day: number;
  users: User[];
  getUserEntry: (userId: string) => DayEntry;
  isToday: boolean;
  isPast: boolean;
  userCount: number;
  checkedCount: number;
  onClose: () => void;
}

export function DaySummaryPanel({
  day,
  users,
  getUserEntry,
  isToday,
  isPast,
  userCount,
  checkedCount,
  onClose,
}: DaySummaryPanelProps) {
  const notesCount = users.filter((u) => getUserEntry(u.id).note.trim()).length;

  return (
    <div className="day-note-panel" role="region" aria-label={`${day}일 독서 현황`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-grape-800">{day}일</span>
          {isToday && (
            <span className="rounded-full bg-grape-600 px-2 py-0.5 text-[10px] font-bold text-white">
              오늘
            </span>
          )}
          <span className="text-sm text-grape-500">
            {checkedCount}/{userCount}명 완료
          </span>
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

      {notesCount > 0 && (
        <p className="mt-2 text-xs font-medium text-grape-500">
          소감 {notesCount}개
        </p>
      )}

      {users.length === 0 ? (
        <p className="mt-3 text-sm text-grape-500">참여자를 먼저 추가해 주세요.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {users.map((user) => {
            const entry = getUserEntry(user.id);
            const note = entry.note.trim();

            return (
              <li
                key={user.id}
                className="rounded-xl border border-grape-100 bg-grape-50/50 px-3 py-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-grape-800">
                    {user.name}
                  </span>
                  <span className="text-xs text-grape-500">
                    {entry.checked ? "완료" : isPast ? "미완료" : "대기 중"}
                  </span>
                </div>
                {note ? (
                  <div className="day-note-view day-note-view-inline mt-2">
                    <p className="day-note-view-text">{note}</p>
                  </div>
                ) : entry.checked ? (
                  <p className="mt-1.5 text-xs text-gray-400">소감 없음</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
