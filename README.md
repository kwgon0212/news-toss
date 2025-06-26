# 📈 NewsToss

> **AI 기반 맞춤형 주식 뉴스 & 포트폴리오 플랫폼**

🔗 [https://news-toss.vercel.app](https://news-toss.vercel.app)

## 🚀 프로젝트 개요

### 🎯 목적

- **개인화된 투자 정보 제공**: 사용자 투자 성향 기반 뉴스 및 종목 추천
- **통합 포트폴리오**: 수익률, 손익 내역 한눈에 관리
- **실시간 주가/차트 제공**: 고급 차트 및 시세 연동
- **투자 일정 캘린더화**: 배당일, 실적 발표 등 주요 일정 자동 정리

### 🧩 주요 기능

- 🔍 AI 기반 맞춤 뉴스 추천
- 📊 포트폴리오 분석 및 리밸런싱 가이드
- 📈 실시간 TradingView 차트 연동
- 📅 투자 일정 자동 캘린더
- ⭐ 관심 종목 즐겨찾기 및 알림
- 💰 실시간 손익 계산기

## 🛠️ 프론트엔드 기술 스택

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=Zustand&logoColor=white)](https://github.com/pmndrs/zustand)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)](https://sentry.io/)

### ⚙️ 백엔드 연동

- **API Server**: External REST API ([https://news-toss.click](https://news-toss.click))
- **Authentication**: JWT 인증
- **실시간 통신**: Server-Sent Events (SSE)

### 📉 모니터링

- **Sentry 연동**: 프론트 배포 후 사용자 환경의 예기치 못한 오류를 실시간 감지 Slack으로 에러 알림 전송

## 🏗️ 시스템 아키텍처 & 구조

```bash
src/
├── app/                  # App Router Pages
│   ├── (main)/
│   │   ├── calendar/     # 이벤트 / 배당 / IPO / 분할 / 실적 및 챗봇
│   │   ├── news/         # 뉴스 피드
│   │   ├── portfolio/    # 포트폴리오 관리
│   │   └── stock/        # 증권 정보
│   └── signup/           # 회원가입
├── components/
│   ├── ui/               # 버튼 등 기본 UI 컴포넌트
│   ├── animate-ui/       # 애니메이션 UI 컴포넌트
│   └── router/           # 라우팅에 따른 UI 컴포넌트
├── api/                  # API 통신 함수
├── hooks/                # Custom Hooks
├── store/                # Zustand 전역 상태관리
├── type/                 # 타입 정의
└── utils/                # 공통 유틸 함수
```

## ⚡ 성능 최적화 및 트러블 슈팅

### 1. API 병렬 처리 개선

- 기존: `Promise.all()` 사용 시 하나 실패하면 전체 실패
- 개선: `Promise.allSettled()`로 개별 실패 대응

```ts
const results = await Promise.allSettled(apiCalls);
const successful = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);
```

### 2. 페이지 속도 개선 (ISR + 캐싱)

- 문제: 서버 요청 기반 렌더링으로 로딩 지연
- 개선:

  - **ISR 적용**: 뉴스 상세 및 캘린더 페이지 정적 캐싱
  - **TanStack Query**: 클라이언트 캐싱 및 상태 동기화
  - **Vercel 리전**: `ap-northeast-2`로 설정해 응답 속도 단축

⏱ 평균 로딩 속도 **2초 이상 개선**

### 3. CSS 깨짐 (미들웨어 리다이렉트 이슈)

- 문제: middleware가 정적 자원까지 redirect하여 Tailwind 스타일 미적용
- 개선:

```ts
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

### 4. 모달 깨짐 현상

- 문제: 모달이 DOM에 직접 mount되어 overflow/z-index 간섭 발생
- 해결: `ReactDOM.createPortal()`로 `document.body`에 독립 렌더링

### 5. 클라이언트 캐싱 부재로 인한 중복 요청

- 개선: TanStack Query의 캐시 전략 도입으로 동일 요청 중복 제거

## ⏱ 개발 기간

**2025.06.01 \~ 2025.07.01**

Made with ❤️ by [@NewsToss Team](https://news-toss.vercel.app)
