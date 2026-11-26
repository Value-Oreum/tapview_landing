"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFocusText from "@/components/motion/ScrollFocusText";
import PhoneFrame from "./PhoneFrame";
import { BankScreen, PillScreen, SmsScreen } from "./Screens";
import TapChoice from "./TapChoice";
import type { Lang } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SCREENS = [SmsScreen, BankScreen, PillScreen];

const T = {
  ko: {
    eyebrow: "브랜드 스토리",
    title: "탭뷰 브랜드 스토리",
    intro: "어느 날부터,\n작은 화면이 멀어졌습니다.",
    scenes: [
      { time: "아침 8:10", line: "3일이었나, 8일이었나.", sub: "안경을 이마에 올리고,\n폰을 멀리." },
      { time: "점심 12:40", line: "0이 몇 개였더라.", sub: "보내기 전에 한 번 더.\n또 한 번 더." },
      { time: "밤 9:30", line: "하루 한 알? 두 알?", sub: "결국,\n내일 다시 보기로 한다." },
    ],
    stop: "하루에도 몇 번씩,\n멈춥니다.",
    why: "글씨가 작아서가 아니라,\n화면이 내 눈에 맞지 않아서.",
    founder: "이 장면을,\n매일 옆에서 봤습니다.",
    p1: "탭뷰의 대표는 사회복지사입니다. 복지관을 찾는 분들의 병원 예약 문자와 앱 화면을 매번 옆에서 대신 읽어 드렸습니다.",
    p2: "읽어 드리는 건 잠깐이지만, 부탁은 매번 마음에 남습니다. 그리고 그 불편은 마흔 중반부터, 누구에게나 찾아옵니다.",
    close: "그래서 만듭니다.\n누구에게도 부탁하지 않아도 되는 화면을.",
  },
  ja: {
    eyebrow: "ブランドストーリー",
    title: "TapViewのブランドストーリー",
    intro: "ある日から、\n小さな画面が遠くなった。",
    scenes: [
      { time: "朝 8:10", line: "3日だったか、8日だったか。", sub: "メガネをおでこに上げて、\nスマホを遠ざける。" },
      { time: "昼 12:40", line: "ゼロは、いくつだっけ。", sub: "送る前に、もう一度。\nさらに、もう一度。" },
      { time: "夜 21:30", line: "1日1粒？ 2粒？", sub: "結局、\n明日また見ることにする。" },
    ],
    stop: "一日に何度も、\n手が止まる。",
    why: "文字が小さいからではなく、\n画面が自分の目に合っていないから。",
    founder: "この場面を、\n毎日となりで見てきました。",
    p1: "TapViewの代表は社会福祉士です。韓国の福祉館に来られる方の病院の予約メッセージやアプリの画面を、いつもとなりで代わりに読んできました。",
    p2: "読んであげるのは一瞬でも、頼む側の気持ちは毎回残ります。そしてその不便さは、40代半ばから誰にでも訪れます。",
    close: "だから、つくります。\n誰にも頼まなくていい画面を。",
  },
} as const;

/** 브랜드 스토리 — 1인칭 하루 → 하루에도 몇 번씩 멈춘다 → 탭 체험 → 대표 이야기 */
export default function BrandStory({ lang = "ko" }: { lang?: Lang }) {
  const t = T[lang];
  const SCENES = t.scenes.map((s, i) => ({ ...s, Screen: SCREENS[i] }));
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current!;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-scene]", root).forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="story" aria-labelledby="story-title" className="relative">
      {/* 도입 */}
      <div className="px-5 pt-[18vh] pb-[8vh] sm:px-10">
        <div className="mx-auto max-w-[1240px]">
          <p className="text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">{t.eyebrow}</p>
          <h2 id="story-title" className="sr-only">
            {t.title}
          </h2>
          <ScrollFocusText
            text={t.intro}
            className="mt-6 text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.06] font-semibold tracking-[-0.045em] text-paper"
          />
        </div>
      </div>

      {/* 하루 3장면: 데스크톱은 폰 고정, 모바일은 장면마다 폰 */}
      <div className="px-5 sm:px-10">
        <div className="mx-auto grid max-w-[1240px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="sticky top-[max(96px,calc(50vh-min(36vh,340px)))]">
              <PhoneFrame className="mx-auto w-[min(26vw,340px)] max-h-[72vh]">
                {SCENES.map(({ Screen }, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-[opacity,filter] duration-700"
                    style={{ opacity: active === i ? 1 : 0, filter: active === i ? "none" : "blur(8px)" }}
                  >
                    <Screen lang={lang} />
                  </div>
                ))}
              </PhoneFrame>
              <p className="mt-5 text-center text-[0.9375rem] font-semibold text-paper/55">{SCENES[active].time}</p>
            </div>
          </div>

          <div>
            {SCENES.map((s, i) => (
              <article key={i} data-scene className="flex min-h-[100svh] flex-col justify-center py-[10vh] lg:min-h-[105vh]">
                <div className="mb-10 lg:hidden" aria-hidden="true">
                  <PhoneFrame className="mx-auto w-[min(58vw,260px)]">
                    <s.Screen lang={lang} />
                  </PhoneFrame>
                </div>
                <p className="text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">{s.time}</p>
                <ScrollFocusText
                  as="h3"
                  text={s.line}
                  className="mt-5 text-[clamp(2.25rem,5.4vw,4.75rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-paper"
                />
                <ScrollFocusText
                  text={s.sub}
                  start="top 85%"
                  end="center 45%"
                  className="mt-8 text-[clamp(1.5rem,2.8vw,2.5rem)] leading-[1.3] font-light tracking-[-0.03em] text-paper/75"
                />
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* 하루에도 몇 번씩 */}
      <div className="flex min-h-[110svh] items-center px-5 sm:px-10">
        <div className="mx-auto w-full max-w-[1240px]">
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-[1rem] font-semibold text-paper/45" aria-hidden="true">
            <span>8:10</span>
            <span>12:40</span>
            <span>21:30</span>
          </p>
          <ScrollFocusText
            as="h3"
            text={t.stop}
            start="top 80%"
            end="center 50%"
            blur={18}
            className="mt-6 text-[clamp(2.75rem,8.5vw,8rem)] leading-[1.02] font-semibold tracking-[-0.05em] text-paper"
          />
          <ScrollFocusText
            text={t.why}
            start="top 85%"
            end="center 55%"
            className="mt-10 max-w-[38rem] text-[clamp(1.375rem,2.4vw,2rem)] leading-[1.35] font-light text-paper/75"
          />
        </div>
      </div>

      {/* 절정: 직접 탭 */}
      <div className="px-5 py-[16vh] sm:px-10">
        <TapChoice lang={lang} />
      </div>

      {/* 대표 이야기 */}
      <div className="relative overflow-hidden px-5 py-[20vh] sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(60% 50% at 30% 40%, rgb(139 242 194 / 0.07), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[1100px]">
          <ScrollFocusText
            as="h3"
            text={t.founder}
            className="text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.06] font-semibold tracking-[-0.045em] text-paper"
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <ScrollFocusText
              text={t.p1}
              start="top 88%"
              end="center 55%"
              blur={8}
              className="text-[clamp(1.25rem,1.9vw,1.625rem)] leading-[1.6] text-paper/80"
            />
            <ScrollFocusText
              text={t.p2}
              start="top 88%"
              end="center 55%"
              blur={8}
              className="text-[clamp(1.25rem,1.9vw,1.625rem)] leading-[1.6] text-paper/80"
            />
          </div>
          <ScrollFocusText
            as="p"
            text={t.close}
            start="top 85%"
            end="center 50%"
            blur={16}
            className="mt-20 text-[clamp(1.875rem,4.4vw,3.75rem)] leading-[1.15] font-semibold tracking-[-0.04em] text-mint"
          />
        </div>
      </div>
    </section>
  );
}
