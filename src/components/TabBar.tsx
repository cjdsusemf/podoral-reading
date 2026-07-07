"use client";

import type { AppTab, User } from "@/types/reading";

interface TabBarProps {
  users: User[];
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export function TabBar({ users, activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="tab-bar-bottom" role="tablist" aria-label="독서 탭">
      <div className="tab-bar-bottom-inner">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "overview"}
          onClick={() => onTabChange("overview")}
          className={`tab-btn-bottom ${activeTab === "overview" ? "tab-btn-bottom-active" : ""}`}
        >
          <span className="tab-btn-icon">🍇</span>
          <span className="tab-btn-label">모아보기</span>
        </button>

        {users.map((user) => {
          const tab: AppTab = `user:${user.id}`;
          return (
            <button
              key={user.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => onTabChange(tab)}
              className={`tab-btn-bottom ${activeTab === tab ? "tab-btn-bottom-active" : ""}`}
            >
          <span className="tab-btn-icon">·</span>
          <span className="tab-btn-label">{user.name}</span>
            </button>
          );
        })}

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "admin"}
          onClick={() => onTabChange("admin")}
          className={`tab-btn-bottom ${activeTab === "admin" ? "tab-btn-bottom-active" : ""}`}
        >
          <span className="tab-btn-icon">☰</span>
          <span className="tab-btn-label">관리</span>
        </button>
      </div>
    </nav>
  );
}
