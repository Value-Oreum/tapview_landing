import localFont from "next/font/local";

// Paperlogy (SIL OFL 1.1) — KS X 1001 완성형 2,350자 서브셋. scripts/subset-fonts.py로 다시 만든다.
export const paperlogy = localFont({
  src: [
    { path: "./fonts/Paperlogy-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Paperlogy-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Paperlogy-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Paperlogy-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-paperlogy",
  display: "swap",
  fallback: ["Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", "system-ui", "sans-serif"],
});
