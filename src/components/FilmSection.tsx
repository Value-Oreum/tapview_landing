"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DogClip } from "@/components/DogMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** 홍보영상 (72초). 화면에 들어오면 알약 창이 넓어지며 영상 카드가 열린다. 재생은 사용자가 누를 때 소리와 함께. */
export default function FilmSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
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

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.controls = true;
    v.muted = false;
    void v.play();
    setPlaying(true);
  };

  return (
    <section id="film" aria-labelledby="film-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">홍보영상</p>
            <h2
              id="film-title"
              className="mt-4 text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-paper"
            >
              작은 화면이, 내 편이 됩니다.
            </h2>
          </div>
          <p className="text-[1.0625rem] text-paper/60">1분 12초 · 소리와 함께 보세요</p>
        </div>

        <div className="relative mt-10">
        <DogClip clip="headspin" className="absolute -top-28 right-2 z-10 h-36 w-36 sm:-top-36 sm:-right-6 sm:h-44 sm:w-44" />
        <div ref={wrapRef} className="relative aspect-video overflow-hidden rounded-[28px] bg-ink-2">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster="/film/poster.webp"
            preload="none"
            playsInline
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          >
            <source src="/film/tapview-film-1080.mp4" type="video/mp4" media="(min-width: 1024px)" />
            <source src="/film/tapview-film-720.mp4" type="video/mp4" />
          </video>
          {!playing && (
            <button
              type="button"
              onClick={play}
              className="group absolute inset-0 grid place-items-center bg-gradient-to-t from-ink/60 via-transparent to-transparent"
              aria-label="탭뷰 홍보영상 재생 (1분 12초, 소리 있음)"
            >
              <span className="glass inline-flex h-16 items-center gap-3 rounded-full pr-7 pl-2 text-[1.125rem] font-bold text-paper transition-transform duration-300 group-hover:scale-[1.04]">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-paper text-forest">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
                  </svg>
                </span>
                영상 보기
              </span>
            </button>
          )}
        </div>
        </div>
        <p className="mt-4 text-[0.875rem] text-paper/45">영상 속 인물과 화면은 AI로 만든 가상 이미지입니다.</p>
      </div>
    </section>
  );
}
