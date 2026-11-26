import type { Metadata, Viewport } from "next";
import { paperlogy } from "./fonts";
import PrefsProvider, { prefsBootScript } from "@/components/providers/PrefsProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tapview.app"),
  title: {
    default: "탭뷰 TapView — 선명하게 보이면, 탭.",
    template: "%s · 탭뷰 TapView",
  },
  description:
    "탭하면, 내 눈에 맞는 화면. 작은 글씨에 멈추는 순간을 줄이는 안드로이드 읽기 보조 앱, 탭뷰. 지금 사전 예약하면 출시 후 1년 무료.",
  applicationName: "TapView",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://tapview.app",
    siteName: "탭뷰 TapView",
    title: "선명하게 보이면, 탭. — 탭뷰 TapView",
    description: "탭하면, 내 눈에 맞는 화면. 첫눈에 탭! 사전 예약하면 출시 후 1년 무료.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/", languages: { ko: "/", ja: "/ja" } },
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
      </body>
    </html>
  );
}
