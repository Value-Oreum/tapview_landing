# tapview.app

탭뷰(TapView) 소개·사전예약 사이트. Next.js(App Router) + Tailwind v4 + GSAP + Lenis, Vercel 배포.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000  (?slow=1 이면 히어로 등장 연출을 5배 느리게)
npm run build
```

## 소재 스크립트

| 스크립트 | 하는 일 |
|---|---|
| `scripts/subset-fonts.py` | 페이퍼로지(OFL)를 KS 완성형 2,350자로 줄여 `src/app/fonts/`에 woff2 생성 |
| `scripts/split-logo.py` | 로고를 `Tap`/`View` 두 장(흰색)으로 나눠 `public/brand/`에 저장 |
| `scripts/prep-phone.py` | 생성한 폰 사진의 초록 화면을 투명하게 뚫어 `public/hero/phone.webp` 생성 |

## 구조

- `src/components/hero/` — 히어로(Tap|View 알약 창, 흐린 판/선명한 판)
- `src/components/motion/ScrollFocusText.tsx` — 스크롤에 맞춰 흐림→선명
- `src/components/providers/PrefsProvider.tsx` — '글자 크게'·'움직임 줄이기', 부드러운 스크롤

문구 원칙: 시력 '보정·교정·측정·검사', '노안 개선', '최적화'는 쓰지 않는다. 가상 수치를 쓰지 않는다.
