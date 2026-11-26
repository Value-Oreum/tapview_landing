"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PhoneStage from "./PhoneStage";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const HEADLINE = ["선명하게", "보이면,", "탭."];
const ANIM = { wake: "/dog/anim/wake.webp", wave: "/dog/anim/wave-loop.webp" };
const WAKE_SEC = 76 / 15; // 깨어나 손 흔들기 영상 길이 (76프레임, 15fps)

/**
 * 히어로 = 스플래시 로고플레이 (MotionSites 'Wild Pill' 구조를 원형 렌즈로 바꿈).
 * Tap|View 사이 가는 선이 부드럽게 둥근 렌즈로 열리고, 렌즈 안에서 초점이 맞으며 흐린 화면이 선명해진다.
 * 렌즈 가운데의 강아지는 자다가 깨어 벌떡 일어나 손을 흔든다. 스크롤하면 렌즈가 화면 전체로 커진다.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const sharpRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef<HTMLImageElement>(null);
  const viewRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0); // 스크롤 확장 진행도 0~1

  useIsoLayoutEffect(() => {
    const hero = heroRef.current!;
    const sharp = sharpRef.current!;
    const zoom = zoomRef.current!;
    const lockup = lockupRef.current!;
    const lens = lensRef.current!;
    const tap = tapRef.current!;
    const view = viewRef.current!;
    const line = lineRef.current!;
    const bottom = bottomRef.current!;
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const words = gsap.utils.toArray<HTMLElement>("[data-blur-word]", hero);
    const rises = gsap.utils.toArray<HTMLElement>("[data-rise]", hero);
    const stills = hero.querySelectorAll<HTMLImageElement>("[data-dog-still]");
    const anims = hero.querySelectorAll<HTMLImageElement>("[data-dog-anim]");
    const ease = gsap.parseEase("power2.inOut");

    /** 강아지와 확대 기준점을 렌즈 가운데에 맞춘다 */
    const placeDog = () => {
      const h = hero.getBoundingClientRect();
      const lk = lockup.getBoundingClientRect();
      const x = h.width / 2;
      const y = lk.top + lk.height / 2 - h.top;
      hero.style.setProperty("--dog-x", `${x.toFixed(1)}px`);
      hero.style.setProperty("--dog-y", `${y.toFixed(1)}px`);
    };

    /** 선명한 판을 렌즈 모양으로 자르고, 스크롤 진행도만큼 화면 전체로 넓힌다 */
    const syncClip = () => {
      const h = hero.getBoundingClientRect();
      const r = lens.getBoundingClientRect();
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
      gsap.set(lens, { "--ring": 1 - Math.min(1, p * 2.5) });
      gsap.set(zoom, { "--zoom": 1 + 0.06 * (1 - p) });
      gsap.set(bottom, { opacity: 1 - Math.min(1, progress.current * 2.4), y: -progress.current * 40 });
      syncClip();
    };

    const playDog = (src: string) => {
      anims.forEach((img) => {
        img.src = src;
        img.style.opacity = "1";
      });
      stills.forEach((s) => (s.style.opacity = "0"));
    };

    placeDog();

    const ctx = gsap.context(() => {
      const reduce = prefersReducedMotion();

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
        gsap.set(zoom, { "--zoom": 1 });
        syncClip();
        return;
      }

      // 영상 미리 받아 두기 (바꿔 끼울 때 끊기지 않게)
      [ANIM.wake, ANIM.wave].forEach((src) => {
        const im = new Image();
        im.src = src;
      });

      // 이전 실행(개발 모드 이중 실행 등)이 남긴 인라인 크기를 지우고 CSS 최종 크기를 잰다
      lens.style.width = "";
      lens.style.height = "";
      const fs = tap.offsetHeight;
      const D = lens.offsetWidth;
      const st = { w: 1.5, h: 0 };
      const apply = () => {
        lens.style.width = `${st.w}px`;
        lens.style.height = `${st.h}px`;
        syncClip();
      };
      apply();
      gsap.set(lockup, { "--gap": `${fs * 0.04}px` });
      gsap.set(line, { opacity: 0 });
      gsap.set(lens, { "--glare": 0 });
      gsap.set(zoom, { filter: "blur(14px)", "--zoom": 1 });
      gsap.set(words, { filter: "blur(16px)", opacity: 0.12, y: "0.12em" });
      gsap.set(rises, { opacity: 0, y: 28 });
      if (header) gsap.set(header, { yPercent: -140, opacity: 0 });

      const tl = gsap.timeline({
        delay: 0.3,
        onComplete: () => {
          lens.style.width = "";
          lens.style.height = "";
          gsap.set(lockup, { clearProps: "--gap" });
          gsap.set(words, { clearProps: "filter,transform,opacity" });
          gsap.set(zoom, { clearProps: "filter" });
          syncClip();
        },
      });

      // ① 가는 선이 그어지고 → 부드럽게 둥근 렌즈로 (약 1.7초)
      tl.to(line, { opacity: 1, duration: 0.2 }, 0)
        .to(st, { h: D * 0.55, duration: 0.45, ease: "power2.out", onUpdate: apply }, 0)
        .to(st, { w: D, h: D, duration: 1.3, ease: "power3.inOut", onUpdate: apply }, 0.4)
        .to(line, { opacity: 0, duration: 0.55, ease: "power1.out" }, 0.45)
        .to(lockup, { "--gap": `${fs * 0.12}px`, duration: 1.4, ease: "power3.inOut" }, 0.35)
        // ② 렌즈 안에서 초점이 맞는다: 흐림 → 선명, 살짝 확대
        .to(zoom, { filter: "blur(0px)", "--zoom": 1.06, duration: 1.6, ease: "power2.inOut" }, 0.7)
        .to(lens, { "--glare": 1, duration: 0.9, ease: "power1.out" }, 1.2);

      // ③ 강아지: 자는 장면에서 시작하는 영상 → 초점이 맞을 즈음 깨어나 벌떡, 손 흔들기
      tl.add(() => playDog(ANIM.wake), 0.35).add(() => playDog(ANIM.wave), 0.35 + WAKE_SEC);

      // ④ 화면 UI
      if (header) tl.to(header, { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 1.7);
      tl.to(words, { filter: "blur(0px)", opacity: 1, y: 0, duration: 1.15, stagger: 0.16, ease: "power3.out" }, 2.2);
      tl.to(rises, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "expo.out" }, 2.6);

      // 점검용: ?slow=1 이면 5배 느리게 재생 (강아지 영상 속도는 그대로)
      if (new URLSearchParams(location.search).has("slow")) tl.timeScale(0.2);
    }, hero);

    // 사용자가 '움직임 줄이기'를 켜면 바로 최종 상태로
    const onMotion = () => {
      if (!prefersReducedMotion()) return;
      ctx.revert();
      lens.style.width = "";
      lens.style.height = "";
      progress.current = 0;
      gsap.set([tap, view, bottom], { clearProps: "all" });
      gsap.set(zoom, { "--zoom": 1 });
      syncClip();
    };
    window.addEventListener("tv:motion", onMotion);

    const onResize = () => {
      placeDog();
      syncClip();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(hero);
    ro.observe(lens);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("tv:motion", onMotion);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      ctx.revert();
      lens.style.width = "";
      lens.style.height = "";
    };
  }, []);

  return (
    <section ref={heroRef} id="top" className="hero" aria-label="탭뷰 소개">
      {/* 흐린 판 */}
      <div className="stage stage--blur" aria-hidden="true">
        <PhoneStage priority />
      </div>
      {/* 선명한 판: 렌즈 모양으로만 보이고, 안쪽은 살짝 확대 */}
      <div ref={sharpRef} className="stage stage--sharp" aria-hidden="true">
        <div ref={zoomRef} className="lens-zoom">
          <PhoneStage />
        </div>
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div ref={lockupRef} className="lockup">
        <img ref={tapRef} src="/brand/logo-tap.png" alt="TapView" width={717} height={537} draggable={false} />
        <div ref={lensRef} className="lens" style={{ ["--ring" as string]: 1 }}>
          <span ref={lineRef} className="lens-line" aria-hidden="true" />
          <span className="lens-glare" aria-hidden="true" />
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
              브랜드 스토리
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
