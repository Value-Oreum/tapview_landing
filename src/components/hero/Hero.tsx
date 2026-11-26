"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PhoneStage from "./PhoneStage";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const HEADLINE = ["선명하게", "보이면,", "탭."];

/**
 * 히어로 — MotionSites 'Wild Pill' 구조를 탭뷰에 맞게 바꿈.
 * Tap|View 사이 가는 선이 알약 창으로 열리고, 그 창 안에서만 폰 화면이 선명하다.
 * 스크롤하면 알약 창이 화면 전체로 커지며 모든 것이 선명해진다.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const sharpRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef<HTMLImageElement>(null);
  const viewRef = useRef<HTMLImageElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0); // 스크롤 확장 진행도 0~1

  useIsoLayoutEffect(() => {
    const hero = heroRef.current!;
    const sharp = sharpRef.current!;
    const pill = pillRef.current!;
    const tap = tapRef.current!;
    const view = viewRef.current!;
    const line = lineRef.current!;
    const bottom = bottomRef.current!;
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const words = gsap.utils.toArray<HTMLElement>("[data-blur-word]", hero);
    const rises = gsap.utils.toArray<HTMLElement>("[data-rise]", hero);
    const ease = gsap.parseEase("power2.inOut");

    /** 선명한 판을 알약 창 모양으로 자르고, 스크롤 진행도만큼 화면 전체로 넓힌다 */
    const syncClip = () => {
      const h = hero.getBoundingClientRect();
      const r = pill.getBoundingClientRect();
      const k = 1 - ease(progress.current);
      const top = (r.top - h.top) * k;
      const left = (r.left - h.left) * k;
      const right = (h.right - r.right) * k;
      const bot = (h.bottom - r.bottom) * k;
      const rad = (Math.min(r.width, r.height) / 2) * k;
      sharp.style.clipPath = `inset(${top}px ${right}px ${bot}px ${left}px round ${rad}px)`;
    };

    const renderScroll = () => {
      const p = ease(progress.current);
      const mobile = window.matchMedia("(max-width: 720px)").matches;
      const dist = mobile ? window.innerHeight * 0.45 : window.innerWidth * 0.42;
      gsap.set(tap, mobile ? { y: -p * dist, x: 0 } : { x: -p * dist, y: 0 });
      gsap.set(view, mobile ? { y: p * dist, x: 0 } : { x: p * dist, y: 0 });
      gsap.set([tap, view], { opacity: 1 - Math.min(1, p * 1.6) });
      gsap.set(pill, { "--ring": 1 - Math.min(1, p * 2.5) });
      gsap.set(bottom, { opacity: 1 - Math.min(1, progress.current * 2.4), y: -progress.current * 40 });
      syncClip();
    };

    const ctx = gsap.context(() => {
      const reduce = prefersReducedMotion();

      // 스크롤: 알약 창이 화면 전체로 (움직임 줄이기면 고정하지 않음)
      if (!reduce) {
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "+=85%",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            progress.current = self.progress;
            renderScroll();
          },
        });
      }

      if (reduce) {
        syncClip();
        return;
      }

      // ── 등장 연출 (약 2.3초) ──
      const mobile = window.matchMedia("(max-width: 720px)").matches;
      // 이전 실행(개발 모드 이중 실행 등)이 남긴 인라인 크기를 지우고 CSS 최종 크기를 잰다
      pill.style.width = "";
      pill.style.height = "";
      const fs = tap.offsetHeight;
      const W = pill.offsetWidth; // CSS 최종 크기
      const H = pill.offsetHeight;
      const st = { w: mobile ? 0 : 0.012 * fs, h: mobile ? 1.5 : 0 };
      const apply = () => {
        pill.style.width = `${st.w}px`;
        pill.style.height = `${st.h}px`;
        syncClip();
      };
      apply();
      gsap.set(lockupRef.current, { "--gap": `${fs * 0.03}px` });
      gsap.set(line, { opacity: 1 });
      gsap.set(words, { filter: "blur(16px)", opacity: 0.12, y: "0.12em" });
      gsap.set(rises, { opacity: 0, y: 28 });
      if (header) gsap.set(header, { yPercent: -140, opacity: 0 });

      const tl = gsap.timeline({
        delay: 0.25,
        onComplete: () => {
          pill.style.width = "";
          pill.style.height = "";
          gsap.set(lockupRef.current, { clearProps: "--gap" });
          gsap.set(words, { clearProps: "filter,transform,opacity" });
          syncClip();
        },
      });
      if (mobile) {
        tl.to(st, { w: W, duration: 0.32, ease: "power2.inOut", onUpdate: apply })
          .to(st, { h: H * 0.1, duration: 0.34, ease: "power2.inOut", onUpdate: apply })
          .to(line, { opacity: 0, duration: 0.34 }, "<")
          .to(st, { h: H * 0.55, duration: 0.56, ease: "power2.inOut", onUpdate: apply })
          .to(st, { h: H, duration: 0.8, ease: "power3.inOut", onUpdate: apply });
      } else {
        tl.to(st, { h: H, duration: 0.32, ease: "power2.inOut", onUpdate: apply })
          .to(st, { w: 0.16 * fs, duration: 0.34, ease: "power2.inOut", onUpdate: apply })
          .to(line, { opacity: 0, duration: 0.34 }, "<")
          .to(st, { w: H, duration: 0.56, ease: "power2.inOut", onUpdate: apply })
          .to(st, { w: W, duration: 0.8, ease: "power3.inOut", onUpdate: apply });
      }
      tl.to(lockupRef.current, { "--gap": `${fs * 0.09}px`, duration: 1.4, ease: "power2.inOut" }, 0.3);
      if (header)
        tl.to(header, { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 1.15);
      tl.to(
        words,
        { filter: "blur(0px)", opacity: 1, y: 0, duration: 1.15, stagger: 0.16, ease: "power3.out" },
        1.25,
      );
      tl.to(rises, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "expo.out" }, 1.45);
      // 점검용: ?slow=1 이면 5배 느리게 재생
      if (new URLSearchParams(location.search).has("slow")) tl.timeScale(0.2);
    }, hero);

    // 사용자가 '움직임 줄이기'를 켜면 바로 최종 상태로
    const onMotion = () => {
      if (!prefersReducedMotion()) return;
      ctx.revert();
      pill.style.width = "";
      pill.style.height = "";
      progress.current = 0;
      gsap.set([tap, view, bottom], { clearProps: "all" });
      syncClip();
    };
    window.addEventListener("tv:motion", onMotion);

    const ro = new ResizeObserver(() => syncClip());
    ro.observe(hero);
    ro.observe(pill);
    window.addEventListener("resize", syncClip);

    return () => {
      window.removeEventListener("tv:motion", onMotion);
      window.removeEventListener("resize", syncClip);
      ro.disconnect();
      ctx.revert();
      pill.style.width = "";
      pill.style.height = "";
    };
  }, []);

  return (
    <section ref={heroRef} id="top" className="hero" aria-label="탭뷰 소개">
      {/* 흐린 판 */}
      <div className="stage stage--blur" aria-hidden="true">
        <PhoneStage priority />
      </div>
      {/* 선명한 판: 알약 창 모양으로만 보인다 */}
      <div ref={sharpRef} className="stage stage--sharp" aria-hidden="true">
        <PhoneStage />
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div ref={lockupRef} className="lockup">
        <img ref={tapRef} src="/brand/logo-tap.png" alt="TapView" width={717} height={537} draggable={false} />
        <div ref={pillRef} className="pill" style={{ ["--ring" as string]: 1 }}>
          <span ref={lineRef} className="pill-line" aria-hidden="true" />
        </div>
        <img ref={viewRef} src="/brand/logo-view.png" alt="" width={887} height={537} draggable={false} />
      </div>

      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 px-5 pb-[max(28px,env(safe-area-inset-bottom))] sm:px-10 sm:pb-12"
      >
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-[36rem]">
            <p
              data-rise
              className="glass mb-4 hidden w-fit items-center gap-2 rounded-full py-1 pr-4 pl-1 text-[0.875rem] text-paper/90 sm:inline-flex"
            >
              <span className="rounded-full bg-tap px-2.5 py-1 text-[0.75rem] font-extrabold text-ink">첫눈에 탭!</span>
              사전 예약하면 출시 후 1년 무료
            </p>
            <h1 className="text-[clamp(2rem,3.8vw,3.5rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-paper">
              {HEADLINE.map((w, i) => (
                <span key={w}>
                  <span data-blur-word className={`blur-word ${i === 2 ? "text-mint" : ""}`}>
                    {w}
                  </span>
                  {i < HEADLINE.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p data-rise className="mt-3 text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.55] text-paper/78">
              두세 번 탭하면, 내 눈에 맞는 화면.
              <span className="hidden sm:inline"> 돋보기 없이, 원래 화면 그대로.</span>
            </p>
          </div>
          <div data-rise className="flex flex-wrap items-center gap-3">
            <a
              href="/reserve"
              className="group inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-paper pr-2 pl-7 text-[1.0625rem] font-extrabold text-forest transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] sm:flex-none"
            >
              사전 예약하기
              <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-paper transition-transform duration-300 group-hover:-rotate-45">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <a
              href="#story"
              className="glass hidden h-14 items-center rounded-full px-6 text-[1.0625rem] font-semibold text-paper/90 transition-colors hover:text-paper sm:inline-flex"
            >
              이야기 보기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
