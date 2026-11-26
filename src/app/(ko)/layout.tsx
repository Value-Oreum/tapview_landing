import type { Metadata, Viewport } from "next";
import { paperlogy } from "../fonts";
import PrefsProvider, { prefsBootScript } from "@/components/providers/PrefsProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { OG_IMAGE } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tapview.app"),
  title: {
    default: "탭뷰 TapView — 선명하게 보이면, 탭.",
    template: "%s · 탭뷰 TapView",
  },
  description:
    "탭하면, 내 눈에 맞는 화면. 작은 글씨에 멈추는 순간을 줄이는 안드로이드 읽기 보조 앱, 탭뷰. 지금 사전 예약하면 출시 후 1년 무료.",
  applicationName: "TapView",
  keywords: [
    "탭뷰",
    "TapView",
    "노안",
    "작은 글씨",
    "글자 크게",
    "읽기 보조 앱",
    "큰 글씨 앱",
    "시니어 스마트폰",
    "중장년 스마트폰",
    "안드로이드 접근성",
    "복지관 스마트폰 교실",
    "부모님 휴대폰 글씨",
  ],
  authors: [{ name: "탭뷰 팀", url: "https://tapview.app" }],
  creator: "탭뷰 팀",
  publisher: "탭뷰 팀",
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://tapview.app",
    siteName: "탭뷰 TapView",
    title: "선명하게 보이면, 탭. — 탭뷰 TapView",
    description: "탭하면, 내 눈에 맞는 화면. 첫눈에 탭! 사전 예약하면 출시 후 1년 무료.",
    images: [OG_IMAGE.ko],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.ko.url] },
  alternates: { canonical: "/", languages: { ko: "/", ja: "/ja", "x-default": "/" } },
};

export const viewport: Viewport = {
  themeColor: "#060807",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={paperlogy.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsBootScript }} />
      </head>
      <body>
        <PrefsProvider>{children}</PrefsProvider>
        <div className="grain" aria-hidden="true" />
        {/* 방문 통계(쿠키 없음)·실사용 속도 측정 */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
