/**
 * 포도송이 모양으로 날짜를 행(row) 단위로 배치합니다.
 * 위쪽이 넓고 아래로 갈수록 좁아지는 전형적인 포도알 스티커판 형태.
 */
export function buildGrapeRows(totalDays: number): number[][] {
  if (totalDays <= 0) return [];

  const rows: number[][] = [];
  let day = 1;

  const topWidth = totalDays >= 31 ? 6 : 5;
  let width = topWidth;

  while (day <= totalDays) {
    const remaining = totalDays - day + 1;

    if (remaining <= width) {
      const row: number[] = [];
      for (let i = 0; i < remaining; i++) row.push(day++);
      rows.push(row);
      break;
    }

    const row: number[] = [];
    for (let i = 0; i < width; i++) row.push(day++);
    rows.push(row);

    if (rows.length >= 4 && width > 2) {
      width--;
    }
  }

  return rows;
}
