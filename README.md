# 포도알 독서

이달의 책을 읽으며 매일 포도알을 채우는 독서 기록 앱입니다.

## 링크

- **배포 주소:** https://podoral-reading.vercel.app
- **GitHub:** https://github.com/cjdsusemf/podoral-reading

## 기능

- 참여자별 탭, 모아보기, 관리 탭
- 모아보기: 참여자 수에 비례해 포도알 부분 채움
- 개인 탭: 오늘 포도알 즉시 채움/해제
- 관리: 이달의 책 설정, 참여자 추가/삭제
- 지난 날짜 클릭 시 소감 보기
- 하단 고정 탭 바, 보라색 포인트 UI

## 로컬 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인합니다.

OneDrive 폴더에서 개발 시 `.next` 캐시 문제가 있을 수 있어 `npm run dev` 전에 `.next` 폴더를 삭제합니다 (`predev` 스크립트가 자동 처리).

## 데이터 저장

현재는 브라우저 `localStorage`에 저장됩니다. 기기·브라우저마다 데이터가 분리됩니다.

여러 사람이 같은 포도알을 공유하려면 Vercel KV 또는 Supabase 연동이 필요합니다.

## 기술 스택

- Next.js 15 (App Router)
- React 19
- TypeScript
- Vercel 배포
