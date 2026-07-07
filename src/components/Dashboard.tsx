"use client";

import { useEffect, useRef, useState } from "react";
import { BookHeader } from "./BookHeader";
import { MonthSelector } from "./MonthSelector";
import { GrapeCluster } from "./GrapeCluster";
import { DayNotePanel } from "./DayNotePanel";
import { DaySummaryPanel } from "./DaySummaryPanel";
import { TabBar } from "./TabBar";
import { AdminPanel } from "./AdminPanel";
import { useReadingData } from "@/hooks/useReadingData";
import {
  canEditDay,
  formatMonthLabel,
  getDayCheckedCount,
  getDayKeyFromMonth,
  getDaysInMonth,
  getTodayKey,
  isToday,
} from "@/lib/reading-utils";

export function Dashboard() {
  const {
    hydrated,
    users,
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
    getUserCheckedCount,
    getCollectiveProgress,
  } = useReadingData();

  const todayKey = getTodayKey();
  const todayDay = Number(todayKey.split("-")[2]);
  const isCurrentMonth = monthKey === todayKey.slice(0, 7);

  const [selectedDay, setSelectedDay] = useState<number | null>(
    isCurrentMonth ? todayDay : null
  );
  const dayPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCurrentMonth) {
      setSelectedDay(todayDay);
    } else {
      setSelectedDay(null);
    }
  }, [monthKey, isCurrentMonth, todayDay]);

  useEffect(() => {
    if (selectedDay && dayPanelRef.current) {
      dayPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedDay, activeTab]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center">
        <div className="text-grape-400">불러오는 중...</div>
      </div>
    );
  }

  const [year, month] = monthKey.split("-").map(Number);
  const totalDays = getDaysInMonth(year, month);
  const monthLabel = formatMonthLabel(monthKey);
  const collective = getCollectiveProgress(totalDays);

  const selectedDayKey = selectedDay
    ? getDayKeyFromMonth(monthKey, selectedDay)
    : null;

  const isOverview = activeTab === "overview";
  const isAdmin = activeTab === "admin";
  const isUserTab = activeUserId !== null;

  const userCheckedCount = activeUserId
    ? getUserCheckedCount(activeUserId)
    : 0;
  const userProgressPercent =
    totalDays > 0 ? Math.round((userCheckedCount / totalDays) * 100) : 0;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container">
        <div className="app-header app-header-compact">
          <span className="app-header-icon-inline">🍇</span>
          <h2 className="app-header-title">포도알 독서</h2>
        </div>

        {!isAdmin && (
          <>
            {isOverview && (
              <BookHeader
                bookTitle={monthData.bookTitle}
                monthLabel={monthLabel}
                progressLabel="우리 독서"
                progressValue={`${collective.percent}%`}
                progressPercent={collective.percent}
              />
            )}

            {isUserTab && activeUser && (
              <BookHeader
                bookTitle={monthData.bookTitle}
                monthLabel={monthLabel}
                subtitle={`${activeUser.name}님`}
                progressLabel="내 독서"
                progressValue={`${userCheckedCount}/${totalDays}일`}
                progressPercent={userProgressPercent}
              />
            )}

            <MonthSelector monthKey={monthKey} onMonthChange={setMonthKey} />

            {isCurrentMonth && isUserTab && (
              <div className="info-banner info-banner-compact">
                오늘은 체크, 지난 날은 눌러 소감을 볼 수 있어요
              </div>
            )}

            {userCount === 0 && (
              <div className="info-banner info-banner-compact">
                아래 관리 탭에서 참여자를 추가해 주세요
              </div>
            )}

            <section className="grape-section">
              <h3 className="grape-section-title">
                {isOverview
                  ? "우리 포도알"
                  : `${activeUser?.name ?? ""}님의 포도알`}
              </h3>

              <GrapeCluster
                monthKey={monthKey}
                monthData={monthData}
                totalDays={totalDays}
                userCount={userCount}
                mode={isOverview ? "overview" : "user"}
                getFillRatio={
                  isOverview
                    ? getFillRatio
                    : (day) =>
                        activeUserId && getUserEntry(activeUserId, day).checked
                          ? 1
                          : 0
                }
                getHasNote={
                  isUserTab && activeUserId
                    ? (day) => !!getUserEntry(activeUserId, day).note
                    : undefined
                }
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                onToggleDay={
                  isUserTab && activeUserId
                    ? (day) => toggleUserDay(activeUserId, day)
                    : undefined
                }
                readOnly={isOverview || userCount === 0}
              />

              <div className="grape-legend">
                {isOverview ? (
                  <>
                    <span className="grape-legend-item">
                      <span className="legend-dot legend-empty" />
                      미완료
                    </span>
                    <span className="grape-legend-item">
                      <span className="legend-dot legend-partial" />
                      일부
                    </span>
                    <span className="grape-legend-item">
                      <span className="legend-dot legend-full" />
                      전원
                    </span>
                  </>
                ) : (
                  <>
                    <span className="grape-legend-item">
                      <span className="legend-dot legend-empty" />
                      미완료
                    </span>
                    <span className="grape-legend-item">
                      <span className="legend-dot legend-full" />
                      완료
                    </span>
                  </>
                )}
                <span className="grape-legend-item">
                  <span className="legend-dot legend-today" />
                  오늘
                </span>
                <span className="grape-legend-item">
                  <span className="legend-dot legend-note" />
                  소감
                </span>
              </div>
            </section>

            {selectedDay && selectedDayKey && isOverview && (
              <div ref={dayPanelRef}>
                <DaySummaryPanel
                  day={selectedDay}
                  users={users}
                  getUserEntry={(userId) => getUserEntry(userId, selectedDay)}
                  isToday={isToday(selectedDayKey)}
                  isPast={selectedDayKey < todayKey}
                  userCount={userCount}
                  checkedCount={getDayCheckedCount(monthData, selectedDay)}
                  onClose={() => setSelectedDay(null)}
                />
              </div>
            )}

            {selectedDay &&
              selectedDayKey &&
              isUserTab &&
              activeUserId &&
              activeUser && (
                <div ref={dayPanelRef}>
                  <DayNotePanel
                    day={selectedDay}
                    userName={activeUser.name}
                    checked={getUserEntry(activeUserId, selectedDay).checked}
                    note={getUserEntry(activeUserId, selectedDay).note}
                    editable={canEditDay(selectedDayKey)}
                    isToday={isToday(selectedDayKey)}
                    isPast={selectedDayKey < todayKey}
                    onNoteChange={(note) =>
                      setUserDayNote(activeUserId, selectedDay, note)
                    }
                    onClose={() => setSelectedDay(null)}
                  />
                </div>
              )}
          </>
        )}

        {isAdmin && (
          <AdminPanel
            users={users}
            bookTitle={monthData.bookTitle}
            monthLabel={monthLabel}
            onBookTitleChange={setBookTitle}
            onAddUser={addUser}
            onRemoveUser={removeUser}
          />
        )}
      </div>

      <TabBar users={users} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
