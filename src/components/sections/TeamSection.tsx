import SectionHead from "./SectionHead";
import { DogWalker } from "@/components/DogMotion";
import ScrollFocusText from "@/components/motion/ScrollFocusText";
import type { Lang } from "@/lib/i18n";

const T = {
  ko: {
    eyebrow: "팀",
    title: "보는 불편을,\n가장 가까이에서 본 사람들.",
    team: [
      {
        role: "현장 · 대표",
        line: "대신 읽어 드리던 사람이,\n이제 혼자 읽게 만듭니다.",
        career: "사회복지사 · 복지관 현장 경험",
        does: "현장의 눈으로 화면을 설계하고, 복지관의 문을 엽니다.",
      },
      {
        role: "개발",
        line: "현장에서 나온 불편을,\n가장 빠르게 화면으로.",
        career: "AX 프로덕트 빌더 · 일본 IT 개발·사업PM 15년",
        does: "AI로 빠르게 만들어 안드로이드 앱으로 완성하고, 일본 빌드·현지화까지 맡습니다.",
      },
      {
        role: "그로스",
        line: "15년, 앱을\n사람들 손에 쥐여 준 경험.",
        career: "앱 그로스 마케팅 15년 이상",
        does: "실제 활성 지표를 보며 탭뷰어를 눈덩이처럼 늘립니다.",
      },
      {
        role: "사업 확대",
        line: "좋은 화면은,\n국경을 넘습니다.",
        career: "IT 소프트웨어 유통·제휴 20년 · 일본 현지 사업",
        does: "20년 IT 소프트웨어 유통과 제휴 확대 경험, 일본 현지 사업 경력 전문가가 함께합니다.",
      },
    ],
    close: "꼭 필요한 기능만 담아 누구나 쓰기 좋게 만들고,\n한국의 선명함을 세계로 수출하겠습니다.",
  },
  ja: {
    eyebrow: "チーム",
    title: "見えにくさを、\nいちばん近くで見てきた人たち。",
    team: [
      {
        role: "現場・代表",
        line: "代わりに読んでいた人が、\nひとりで読める画面をつくります。",
        career: "社会福祉士・福祉館での現場経験",
        does: "現場の目で画面を設計し、福祉館との扉を開きます。",
      },
      {
        role: "開発",
        line: "現場で見つけた不便を、\nいちばん速く画面に。",
        career: "AXプロダクトビルダー・日本でのIT開発・事業PM 15年",
        does: "AIで素早くつくってAndroidアプリに仕上げ、日本版のビルドとローカライズまで担当します。",
      },
      {
        role: "グロース",
        line: "15年間、アプリを\n人の手に届けてきた経験。",
        career: "アプリのグロースマーケティング 15年以上",
        does: "実際のアクティブ指標を見ながら、TapViewのユーザーを雪だるま式に増やします。",
      },
      {
        role: "事業拡大",
        line: "いい画面は、\n国境を越えます。",
        career: "ITソフトウェア流通・提携 20年・日本での現地事業",
        does: "ITソフトウェアの流通と提携の拡大に20年携わってきた専門家と、日本での現地事業の経験者が一緒です。",
      },
    ],
    close: "本当に必要な機能だけを詰めて、誰にでも使いやすく。\n韓国の「くっきり」を、世界へ届けます。",
  },
} as const;

export default function TeamSection({ lang = "ko" }: { lang?: Lang }) {
  const t = T[lang];
  return (
    <section id="team" aria-labelledby="team-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead id="team-title" eyebrow={t.eyebrow} title={t.title} />
        <div className="relative mt-20">
          <DogWalker size={84} />
          <ul className="grid gap-4 md:grid-cols-2">
            {t.team.map((m) => (
              <li
                key={m.role}
                className="flex min-h-[19rem] flex-col justify-between rounded-[32px] border border-paper/10 bg-paper/[0.03] p-8 sm:p-10"
              >
                <div>
                  <p className="text-[0.9375rem] font-semibold text-mint/80">{m.role}</p>
                  <ScrollFocusText
                    as="p"
                    text={m.line}
                    start="top 88%"
                    end="top 55%"
                    className="mt-5 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.25] font-semibold tracking-[-0.03em] text-paper"
                  />
                </div>
                <div className="mt-8 border-t border-paper/10 pt-5">
                  <p className="text-[1.0625rem] font-semibold text-paper/90">{m.career}</p>
                  <p className="mt-1 text-[1rem] text-paper/65">{m.does}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ScrollFocusText
          as="p"
          text={t.close}
          start="top 90%"
          end="top 60%"
          className="mx-auto mt-24 max-w-[22ch] text-center text-[clamp(1.625rem,3.4vw,2.75rem)] leading-[1.3] font-semibold tracking-[-0.03em] text-paper sm:max-w-none"
        />
      </div>
    </section>
  );
}
