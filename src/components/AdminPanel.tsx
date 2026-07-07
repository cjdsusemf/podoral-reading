"use client";

import { useState } from "react";
import type { User } from "@/types/reading";

interface AdminPanelProps {
  users: User[];
  bookTitle: string;
  monthLabel: string;
  onBookTitleChange: (title: string) => void;
  onAddUser: (name: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function AdminPanel({
  users,
  bookTitle,
  monthLabel,
  onBookTitleChange,
  onAddUser,
  onRemoveUser,
}: AdminPanelProps) {
  const [newUserName, setNewUserName] = useState("");

  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    onAddUser(newUserName.trim());
    setNewUserName("");
  };

  return (
    <div className="admin-panel">
      <section className="admin-section">
        <h3 className="admin-section-title">📚 {monthLabel} 이달의 책</h3>
        <p className="admin-section-desc">
          모두가 함께 읽을 책을 정해 주세요.
        </p>
        <input
          type="text"
          value={bookTitle}
          onChange={(e) => onBookTitleChange(e.target.value)}
          placeholder="책 제목을 입력하세요"
          className="admin-input"
          aria-label="이달의 책 제목"
        />
      </section>

      <section className="admin-section">
        <h3 className="admin-section-title">👥 참여자 관리</h3>
        <p className="admin-section-desc">
          독서에 참여할 사람을 추가하세요. 각자 탭에서 오늘 독서를 체크할 수 있어요.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
            placeholder="이름 입력"
            className="admin-input flex-1"
            aria-label="새 참여자 이름"
          />
          <button
            type="button"
            onClick={handleAddUser}
            disabled={!newUserName.trim()}
            className="admin-add-btn"
          >
            추가
          </button>
        </div>

        {users.length === 0 ? (
          <p className="mt-4 rounded-xl bg-grape-50 px-4 py-3 text-sm text-grape-600">
            아직 참여자가 없어요. 위에서 이름을 추가해 주세요.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between rounded-xl border border-grape-100 bg-white px-4 py-3"
              >
                <span className="font-medium text-grape-800">{user.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveUser(user.id)}
                  className="rounded-lg px-2 py-1 text-xs text-red-500 transition hover:bg-red-50"
                  aria-label={`${user.name} 삭제`}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
