"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";
import type { Lang } from "@/lib/i18n";

const T = {
  ko: {
    eyebrow: "직접 해 보세요",
    q: "어느 쪽이 더 선명해요?",
    group: "더 선명한 쪽 고르기",
    date: "12월 3일(수)",
    time: "오전 10:30",
    picked: "선택",
    chip: "탭!",
    dog: "엄지를 든 탭뷰 강아지",
    head: "선명하게 보이면, ",
    tap: "탭.",
    a: "이쪽이 더 편하다면, 탭뷰는 이쪽으로 맞춥니다. 고르는 건 언제나 내 눈입니다.",
    b: "고르기만 하면 끝. 탭뷰는 고른 쪽으로 내 화면을 맞춥니다.",
    idle: "편한 쪽을 눌러 보세요.",
  },
  ja: {
    eyebrow: "試してみてください",
    q: "どちらがくっきり見えますか？",
    group: "くっきり見える方を選ぶ",
    date: "12月3日(水)",
    time: "午前10:30",
    picked: "選択",
    chip: "タップ！",
    dog: "親指を立てるTapViewの犬",
    head: "くっきり見えたら、",
    tap: "タップ。",
    a: "こちらが楽なら、TapViewはこちらに合わせます。選ぶのは、いつも自分の目です。",
    b: "選ぶだけでOK。TapViewは選んだ方に、画面を合わせます。",
    idle: "読みやすい方をタップしてください。",
  },
} as const;

/**
 * 스토리의 절정: 방문자가 직접 '더 선명한 쪽'을 탭해 본다 (탭뷰의 핵심 경험).
 * 어느 쪽을 골라도 '고른 쪽으로 맞춘다'는 탭뷰 방식을 그대로 보여 준다.
 */
export default function TapChoice({ lang = "ko" }: { lang?: Lang }) {
  const t = T[lang];
  const [picked, setPicked] = useState<null | "a" | "b">(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const pick = (which: "a" | "b", e: React.MouseEvent<HTMLButtonElement>) => {
    if (picked) return;
    setPicked(which);
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const card = e.currentTarget;
    const chip = root.querySelector<HTMLElement>("[data-tap-chip]");
    const dog = root.querySelector<HTMLElement>("[data-tap-dog]");
    const r = card.getBoundingClientRect();
    const pr = root.getBoundingClientRect();
    const x = (e.clientX || r.left + r.width / 2) - pr.left;
    const y = (e.clientY || r.top + r.height / 2) - pr.top;
    const tl = gsap.timeline();
    tl.fromTo(card, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" });
    if (chip)
      tl.fromTo(
        chip,
        { x, y, xPercent: -50, yPercent: -120, scale: 0, opacity: 1 },
        { scale: 1, duration: 0.45, ease: "back.out(3)" },
        0,
      ).to(chip, { y: y - 30, opacity: 0, duration: 0.5, delay: 0.5 });
    tl.fromTo(
      root.querySelectorAll("[data-tap-sharpen]"),
      { filter: "blur(10px)", opacity: 0.2 },
      { filter: "blur(0px)", opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" },
      0.25,
    );
    if (dog)
      tl.fromTo(
        dog,
        { yPercent: 60, scale: 0.6, opacity: 0, rotate: -8 },
        { yPercent: 0, scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "elastic.out(1,0.55)" },
        0.35,
      ).to(dog, { rotate: 6, duration: 0.16, yoyo: true, repeat: 3, ease: "sine.inOut" });
  };

  const done = picked !== null;

  return (
    <div ref={rootRef} className="relative mx-auto max-w-[980px] text-center">
      <p className="text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">{t.eyebrow}</p>
      <h3 className="mt-4 text-[clamp(2rem,5vw,4rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-paper">
        {t.q}
      </h3>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6" role="group" aria-label={t.group}>
        {(["a", "b"] as const).map((k) => {
          const blurred = k === "a";
          const isPicked = picked === k;
          return (
            <button
              key={k}
              type="button"
              onClick={(e) => pick(k, e)}
              aria-pressed={isPicked}
              disabled={done && !isPicked}
              className={`group relative rounded-[28px] border p-5 text-left transition-[border-color,opacity,transform,background-color] duration-500 sm:p-8 ${
                isPicked
                  ? "border-mint bg-mint/10"
                  : done
                    ? "border-paper/10 opacity-35"
                    : "border-paper/15 bg-paper/[0.04] hover:border-paper/40 hover:bg-paper/[0.07]"
              }`}
            >
              <span className="text-[0.9375rem] font-semibold text-paper/60">{k === "a" ? "1" : "2"}</span>
              <span
                className={`mt-3 block text-[clamp(1.25rem,3.2vw,2.25rem)] leading-[1.25] font-bold text-paper ${
                  blurred && !isPicked ? "blur-[3.5px]" : ""
                } ${blurred ? "" : "tracking-[-0.02em]"}`}
                style={blurred ? { fontSize: "clamp(0.95rem,2.2vw,1.5rem)" } : undefined}
              >
                {t.date}
                <br />
                {t.time}
              </span>
              {isPicked && (
                <span className="absolute top-4 right-4 rounded-full bg-tap px-3 py-1 text-[0.8125rem] font-extrabold text-ink">
                  {t.picked}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <span
        data-tap-chip
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 rounded-full bg-tap px-4 py-1.5 text-[1.125rem] font-extrabold text-ink opacity-0"
      >
        {t.chip}
      </span>

      <div aria-live="polite" className="mt-12 min-h-[11rem] sm:min-h-[9rem]">
        {done ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <img
              data-tap-dog
              src="/dog/dog-thumb.webp"
              alt={t.dog}
              width={320}
              height={320}
              className="h-28 w-28 sm:h-32 sm:w-32"
            />
            <div className="text-center sm:text-left">
              <p data-tap-sharpen className="text-[clamp(1.75rem,4vw,3rem)] leading-[1.15] font-semibold tracking-[-0.035em] text-paper">
                {t.head}
                <span className="text-mint">{t.tap}</span>
              </p>
              <p data-tap-sharpen className="mt-2 text-[1.125rem] text-paper/75">
                {picked === "a" ? t.a : t.b}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-[1.0625rem] text-paper/55">{t.idle}</p>
        )}
      </div>
    </div>
  );
}
