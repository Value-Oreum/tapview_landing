import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NotifyForm from "@/components/reserve/NotifyForm";

export const metadata: Metadata = {
  title: "日本リリースのお知らせ登録",
  description: "TapViewの日本リリース（2028年下半期予定）をいち早くお知らせします。提携・導入のご相談も受け付けています。",
  alternates: { canonical: "/ja/notify" },
  openGraph: { title: "日本リリースのお知らせ登録 · TapView", url: "https://tapview.app/ja/notify", images: [OG_IMAGE.ja] },
};

export default function NotifyPage() {
  return (
    <>
      <SiteHeader lang="ja" />
      <main className="px-5 pt-36 pb-24 sm:px-10 sm:pt-44">
        <div className="mx-auto max-w-[760px]">
          <p className="text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">日本版のお知らせ</p>
          <h1 className="mt-4 text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-paper">
            日本でのリリースを、
            <br />
            いちばん先にお届けします。
          </h1>
          <p className="mt-5 text-[1.125rem] leading-[1.7] text-paper/65">
            TapViewは2027年に韓国でリリースし、日本では2028年下半期のリリースを予定しています。メールアドレスを登録していただくと、日本でのリリースやテスター募集をいち早くお知らせします。提携・導入のご相談もこちらからどうぞ。メールでも受け付けています：{" "}
            <a href="mailto:tapview@tapview.app" className="text-paper underline underline-offset-4">
              tapview@tapview.app
            </a>
          </p>
          <div className="mt-12">
            <NotifyForm />
          </div>
        </div>
      </main>
      <SiteFooter lang="ja" />
    </>
  );
}
