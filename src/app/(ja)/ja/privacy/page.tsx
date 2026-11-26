import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "TapViewの日本リリースのお知らせ登録・ご相談で取得する個人情報の取扱いについて。",
  alternates: { canonical: "/ja/privacy", languages: { ko: "/privacy", ja: "/ja/privacy" } },
};

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "1. 事業者",
    body: (
      <p>
        TapViewチーム（大韓民国・創業準備中）
        <br />
        お問い合わせ：tapview@tapview.app
      </p>
    ),
  },
  {
    h: "2. 取得する情報",
    body: (
      <ul>
        <li>必須：メールアドレス</li>
        <li>任意：お名前（提携のご相談の場合は会社・団体名）、ご用件、メモ・ご相談内容、ニュース配信の希望</li>
        <li>自動で取得するもの：流入経路（utm）、ブラウザの情報</li>
      </ul>
    ),
  },
  {
    h: "3. 利用目的",
    body: (
      <ul>
        <li>日本でのリリースやテスター募集のお知らせ</li>
        <li>提携・導入のご相談への返信</li>
        <li>開発ニュースの配信（希望された方のみ）</li>
      </ul>
    ),
  },
  {
    h: "4. 保存期間",
    body: (
      <p>
        日本でのリリースのお知らせを終えるまで保存し、遅くとも2029年12月31日までに削除します。ご相談の内容は、返信後1年以内に削除します。同意を撤回された場合は、速やかに削除します。
      </p>
    ),
  },
  {
    h: "5. 第三者への提供",
    body: <p>法令に基づく場合を除き、ご本人の同意なく第三者に提供することはありません。</p>,
  },
  {
    h: "6. 業務の委託と外国での保管",
    body: (
      <>
        <p>受付とご案内のため、次の事業者のサービスを利用しており、個人情報は米国のサーバーに保存されます。</p>
        <ul>
          <li>Google LLC（米国）：受付内容の保存（Googleスプレッドシート）、確認・ご案内メールの送信（Gmail）</li>
          <li>Vercel Inc.（米国）：ウェブサイトの運営と受付内容の送信</li>
        </ul>
        <p>
          米国の個人情報保護制度については、個人情報保護委員会のウェブサイトでご確認いただけます。各事業者は、それぞれのプライバシーポリシーに基づいて個人情報保護の措置を講じています。また、TapViewチームは大韓民国にあり、大韓民国の「個人情報保護法」にも従って取り扱います。
        </p>
      </>
    ),
  },
  {
    h: "7. 安全管理のための措置",
    body: <p>受付データにアクセスできるのは運営メンバーに限り、ウェブサイトとの通信は暗号化（HTTPS）しています。</p>,
  },
  {
    h: "8. 開示・訂正・削除などのご請求",
    body: (
      <p>
        ご自身の情報の開示、訂正、利用停止、削除、同意の撤回をご希望の場合は、tapview@tapview.app までご連絡ください。ご本人であることを確認したうえで、速やかに対応します。ニュース配信は、各メールのご案内からも停止できます。
      </p>
    ),
  },
  {
    h: "9. アクセス解析",
    body: <p>サイト改善のため、Cookieを使わない匿名のアクセス解析と表示速度の計測（Vercel Web Analytics・Speed Insights）を利用しています。</p>,
  },
  {
    h: "10. 改定",
    body: <p>内容を変更する場合は、このページでお知らせします。</p>,
  },
];

export default function JaPrivacyPage() {
  return (
    <>
      <SiteHeader lang="ja" />
      <main className="px-5 pt-36 pb-24 sm:px-10 sm:pt-44">
        <article className="mx-auto max-w-[820px]">
          <h1 className="text-[clamp(2rem,4.4vw,3.25rem)] font-semibold tracking-[-0.03em] text-paper">プライバシーポリシー</h1>
          <p className="mt-4 text-[1.0625rem] leading-[1.7] text-paper/60">
            TapViewチーム（以下「TapView」）は、日本リリースのお知らせ登録と提携のご相談の受付にあたり、個人情報を以下のとおり取り扱います。施行日：2026年11月26日。
          </p>
          <div className="mt-12 grid gap-10 text-[1.0625rem] leading-[1.8] text-paper/80 [&_li]:mt-1 [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_p+ul]:mt-3 [&_ul+p]:mt-3">
            {SECTIONS.map((s) => (
              <section key={s.h}>
                <h2 className="mb-3 text-[1.25rem] font-semibold text-paper">{s.h}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter lang="ja" />
    </>
  );
}
