import type { Metadata, Viewport } from "next";
import { notoJp, paperlogy } from "../../fonts";
import PrefsProvider, { prefsBootScript } from "@/components/providers/PrefsProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { OG_IMAGE } from "@/lib/site";
import "../../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tapview.app"),
  title: {
    default: "TapView",
    template: "%s · TapView",
  },
  description:
    "タップすれば、自分の目に合う画面に。小さな文字で手が止まる瞬間を減らす、Android向けの読みやすさサポートアプリ TapView。日本でのリリース情報をいち早くお届けします。",
  applicationName: "TapView",
  keywords: ["TapView", "タップビュー", "老眼", "小さい文字", "文字を大きく", "読みやすさ", "シニア スマホ", "Android ユーザー補助", "スマホ教室"],
  authors: [{ name: "TapViewチーム", url: "https://tapview.app/ja" }],
  creator: "TapViewチーム",
  publisher: "TapViewチーム",
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://tapview.app/ja",
    siteName: "TapView",
    title: "くっきり見えたら、タップ。— TapView",
    description: "タップすれば、自分の目に合う画面に。日本リリースのお知らせ登録受付中。",
    images: [OG_IMAGE.ja],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.ja.url] },
  alternates: { canonical: "/ja", languages: { ko: "/", ja: "/ja", "x-default": "/" } },
};

export const viewport: Viewport = {
  themeColor: "#060807",
  colorScheme: "dark",
};

export default function JaRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${paperlogy.variable} ${notoJp.variable}`} suppressHydrationWarning>
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
