"use client";

interface BookHeaderProps {
  bookTitle: string;
  monthLabel: string;
  editable?: boolean;
  onTitleChange?: (title: string) => void;
  subtitle?: string;
  progressLabel: string;
  progressValue: string;
  progressPercent: number;
}

export function BookHeader({
  bookTitle,
  monthLabel,
  editable = false,
  onTitleChange,
  subtitle,
  progressLabel,
  progressValue,
  progressPercent,
}: BookHeaderProps) {
  return (
    <header className="book-header book-header-compact">
      <div className="book-header-top">
        <div className="book-header-meta">
          <span className="book-header-month">{monthLabel}</span>
          <span className="book-header-dot">·</span>
          <span className="book-header-label">이달의 책</span>
        </div>
        {subtitle && <p className="book-header-sub">{subtitle}</p>}
      </div>

      {editable ? (
        <input
          type="text"
          value={bookTitle}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="책 제목"
          className="book-header-input book-header-input-compact"
          aria-label="이달의 책 제목"
        />
      ) : (
        <p className="book-header-book book-header-book-compact">
          {bookTitle || "책 미정"}
        </p>
      )}

      <div className="book-header-progress book-header-progress-compact">
        <div className="book-header-progress-row">
          <span className="book-header-progress-label">{progressLabel}</span>
          <span className="book-header-progress-value">{progressValue}</span>
        </div>
        <div className="book-header-progress-track">
          <div
            className="book-header-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
