import { DogClip } from "@/components/DogMotion";
import type { Lang } from "@/lib/i18n";

const T = {
  ko: {
    tagline: "선명하게 보이면, 탭.",
    team: "탭뷰 팀 (예비창업)",
    nav: "하단 메뉴",
    links: [
      { href: "/reserve", label: "사전 예약" },
      { href: "/reserve?type=org", label: "기관 신청" },
      { href: "/contact", label: "문의하기" },
      { href: "/ja", label: "日本語", lang: "ja" },
    ],
    privacy: { href: "/privacy", label: "개인정보처리방침" },
    legal: [
      "특허 출원 중 · 출원번호 10-2026-0240614 (2026. 11. 26.)",
      "탭뷰는 의료기기가 아닌 화면 읽기 보조 앱입니다.",
      "이 사이트의 글, 디자인, 이미지, 캐릭터, 영상의 저작권은 탭뷰 팀에 있습니다. 허락 없이 복제·배포·변형하거나 다른 곳에 쓸 수 없습니다.",
    ],
    copy: "© 2026 탭뷰 TapView. All rights reserved.",
  },
  ja: {
    tagline: "くっきり見えたら、タップ。",
    team: "TapViewチーム（韓国・創業準備中）",
    nav: "フッターメニュー",
    links: [
      { href: "/ja/notify", label: "お知らせ登録" },
      { href: "/ja/notify?type=partner", label: "提携のご相談" },
      { href: "/", label: "한국어", lang: "ko" },
    ],
    privacy: { href: "/ja/privacy", label: "プライバシーポリシー" },
    legal: [
      "特許出願中（韓国）・出願番号 10-2026-0240614（2026年11月26日）",
      "TapViewは医療機器ではなく、画面の読みやすさをサポートするアプリです。",
      "このサイトの文章・デザイン・画像・キャラクター・映像の著作権は、TapViewチームに帰属します。許可なく複製・配布・改変したり、他の目的で使用したりすることはできません。",
    ],
    copy: "© 2026 TapView. All rights reserved.",
  },
} as const;

export default function SiteFooter({ lang = "ko" }: { lang?: Lang }) {
  const t = T[lang];
  return (
    <footer className="relative border-t border-paper/10 px-5 pt-14 pb-[max(40px,env(safe-area-inset-bottom))] sm:px-10">
      <DogClip clip="sleep" className="absolute -top-[74px] right-6 h-24 w-24 sm:right-16 sm:h-28 sm:w-28 sm:-top-[86px]" />
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <img src="/brand/logo-white.png" alt="TapView" width={640} height={222} className="h-7 w-auto" />
          <p className="mt-4 text-[1.0625rem] text-paper/70">{t.tagline}</p>
          <p className="mt-6 text-[0.9375rem] leading-[1.8] text-paper/50">
            {t.team}
            <br />
            <a href="mailto:tapview@tapview.app" className="underline-offset-4 hover:text-paper hover:underline">
              tapview@tapview.app
            </a>
          </p>
        </div>
        <nav aria-label={t.nav} className="flex flex-wrap gap-x-6 gap-y-3 text-[0.9375rem] text-paper/65">
          {t.links.map((l) => (
            <a key={l.href} href={l.href} lang={"lang" in l ? l.lang : undefined} className="hover:text-paper">
              {l.label}
            </a>
          ))}
          <a href={t.privacy.href} className="font-semibold text-paper/85 hover:text-paper">
            {t.privacy.label}
          </a>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-[1240px] space-y-1.5 border-t border-paper/10 pt-6 text-[0.8125rem] leading-[1.7] text-paper/40">
        {t.legal.map((x) => (
          <p key={x}>{x}</p>
        ))}
        <p className="text-paper/55">{t.copy}</p>
      </div>
    </footer>
  );
}
