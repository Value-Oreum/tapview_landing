"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DogClip } from "@/components/DogMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";
import type { Lang } from "@/lib/i18n";

const T = {
  ko: {
    eyebrow: "홍보영상",
    title: "작은 화면이, 내 편이 됩니다.",
    meta: "1분 12초 · 소리와 함께 보세요",
    aria: "영상 보기 — 탭뷰 홍보영상 (1분 12초, 소리 있음)",
    play: "영상 보기",
    note: "영상 속 인물과 화면은 AI로 만든 가상 이미지입니다.",
  },
  ja: {
    eyebrow: "紹介動画",
    title: "小さな画面が、味方になる。",
    meta: "1分12秒・音声と一緒にご覧ください",
    aria: "動画を見る — TapView紹介動画（1分12秒、音声あり）",
    play: "動画を見る",
    note: "映像に登場する人物や画面は、AIで作成したイメージです。",
  },
} as const;

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const PORTRAIT = "(max-width: 767px) and (orientation: portrait)";
/** 언어별 영상 (일본어판: 내레이션·화면 글자 일본어, 끝은 출시 알림) */
const FILES = {
  ko: { v916: "/film/tapview-film-v2-916-720.mp4", v1080: "/film/tapview-film-v2-1080.mp4", v720: "/film/tapview-film-v2-720.mp4", p: "/film/poster-v2.webp", p916: "/film/poster-v2-916.webp" },
  ja: { v916: "/film/tapview-film-v2-ja-916-720.mp4", v1080: "/film/tapview-film-v2-ja-1080.mp4", v720: "/film/tapview-film-v2-ja-720.mp4", p: "/film/poster-v2-ja.webp", p916: "/film/poster-v2-ja-916.webp" },
} as const;

/** 홍보영상 (72초). 화면에 들어오면 알약 창이 넓어지며 영상 카드가 열린다. 재생은 사용자가 누를 때 소리와 함께. */
export default function FilmSection({ lang = "ko" }: { lang?: Lang }) {
  const t = T[lang];
  const f = FILES[lang];
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clipRef = useRef<gsap.core.Tween | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      clipRef.current = gsap.fromTo(
        wrap,
        { clipPath: "inset(32% 30% 32% 30% round 999px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top 92%", end: "center 55%", scrub: 0.5 },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const on = () => setTimeout(() => play(), 700);
    window.addEventListener("tv:play-film", on);
    return () => window.removeEventListener("tv:play-film", on);
  });

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    // 알약 창이 덜 열린 채 재생되지 않게, 재생하면 바로 다 연다
    const clip = clipRef.current;
    if (clip) {
      clip.scrollTrigger?.kill();
      clip.kill();
      clipRef.current = null;
      if (wrapRef.current) gsap.to(wrapRef.current, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 0.6, ease: "power2.out" });
    }
    v.controls = true;
    v.muted = false;
    void v.play();
    setPlaying(true);
    setStarted(true);
  };

  return (
    <section id="film" aria-labelledby="film-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">{t.eyebrow}</p>
            <h2
              id="film-title"
              className="mt-4 text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-paper"
            >
              {t.title}
            </h2>
          </div>
          <p className="text-[1.0625rem] text-paper/60">{t.meta}</p>
        </div>

        <div className="relative mt-10">
        <DogClip clip="headspin" className="absolute -top-28 right-2 z-10 h-36 w-36 sm:-top-36 sm:-right-6 sm:h-44 sm:w-44" />
        {/* 세로로 든 휴대폰은 9:16 세로판, 나머지는 16:9 가로판 */}
        <div
          ref={wrapRef}
          id="film-player"
          className="relative mx-auto aspect-video overflow-hidden rounded-[28px] bg-ink-2 max-md:portrait:aspect-[9/16]"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            preload="none"
            playsInline
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          >
            <source src={f.v916} type="video/mp4" media={PORTRAIT} />
            <source src={f.v1080} type="video/mp4" media="(min-width: 1024px)" />
            <source src={f.v720} type="video/mp4" />
          </video>
          {!started && (
            <picture>
              <source srcSet={f.p916} media={PORTRAIT} />
              <img
                src={f.p}
                alt=""
                width={1600}
                height={900}
                loading="lazy"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
            </picture>
          )}
          {!playing && (
            <button
              type="button"
              onClick={play}
              className="group absolute inset-0 grid place-items-center bg-gradient-to-t from-ink/60 via-transparent to-transparent"
              aria-label={t.aria}
            >
              <span className="glass inline-flex h-16 items-center gap-3 rounded-full pr-7 pl-2 text-[1.125rem] font-bold text-paper transition-transform duration-300 group-hover:scale-[1.04]">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-paper text-forest">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
                  </svg>
                </span>
                {t.play}
              </span>
            </button>
          )}
        </div>
        </div>
        <p className="mt-4 text-[0.875rem] text-paper/45">{t.note}</p>
      </div>
    </section>
  );
}
