import type { Metadata, Viewport } from "next";
import { notoJp, paperlogy } from "../../fonts";
import PrefsProvider, { prefsBootScript } from "@/components/providers/PrefsProvider";
import "../../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tapview.app"),
  title: {
    default: "TapView（タップビュー）— くっきり見えたら、タップ。",
    template: "%s · TapView",
  },
  description:
    "タップすれば、自分の目に合う画面に。小さな文字で手が止まる瞬間を減らす、Android向けの読みやすさサポートアプリ TapView。日本でのリリース情報をいち早くお届けします。",
  applicationName: "TapView",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://tapview.app/ja",
    siteName: "TapView",
    title: "くっきり見えたら、タップ。— TapView",
    description: "タップすれば、自分の目に合う画面に。日本リリースのお知らせ登録受付中。",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/ja", languages: { ko: "/", ja: "/ja" } },
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
      </body>
    </html>
  );
}
