"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** 강아지 움직이는 영상(투명 WebP). 움직임 줄이기면 같은 포즈의 정지 그림 */
const CLIPS = {
  wave: { anim: "/dog/anim/wave-loop.webp", still: "/dog/dog-wave.webp" },
  run: { anim: "/dog/anim/run-loop.webp", still: "/dog/dog-run.webp" },
  cheer: { anim: "/dog/anim/cheer-loop.webp", still: "/dog/dog-cheer.webp" },
  sleep: { anim: "/dog/anim/sleep-loop.webp", still: "/dog/dog-sleep.webp" },
  headspin: { anim: "/dog/anim/headspin.webp", still: "/dog/dog-dance.webp" },
} as const;
export type ClipName = keyof typeof CLIPS;

/**
 * 프레임 밖에서 움직이는 강아지 영상. 화면에 들어오면 톡 튀어나오며 재생을 시작한다.
 * 위치·크기는 className(바깥 상자)으로.
 */
export function DogClip({ clip, className = "", delay = 0 }: { clip: ClipName; className?: string; delay?: number }) {
  const ref = useRef<HTMLImageElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.src = CLIPS[clip].still;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, scale: 0.6, y: 30 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => {
          el.src = CLIPS[clip].anim; // 이때부터 재생
          gsap.to(el, { opacity: 1, scale: 1, y: 0, duration: 0.8, delay, ease: "elastic.out(1, 0.55)" });
        },
      });
    }, el);
    return () => ctx.revert();
  }, [clip, delay]);
  return (
    <span className={`pointer-events-none block select-none ${className}`} aria-hidden="true">
      <img ref={ref} alt="" width={400} height={400} draggable={false} className="h-full w-full" />
    </span>
  );
}

/**
 * 상자 윗변 위를 달려 다니는 강아지. 부모 요소(position: relative) 윗변에 올라탄다.
 * 끝에 닿으면 깡충 뛰며 방향을 돌린다.
 */
export function DogWalker({ size = 84, speed = 120, className = "" }: { size?: number; speed?: number; className?: string }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useIsoLayoutEffect(() => {
    const box = boxRef.current;
    const img = imgRef.current;
    if (!box || !img) return;
    if (prefersReducedMotion()) {
      img.src = CLIPS.wave.still;
      return;
    }
    let tl: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      const build = () => {
        tl?.kill();
        const parent = box.parentElement;
        if (!parent) return;
        const span = Math.max(0, parent.clientWidth - size);
        const dur = Math.max(2, span / speed);
        gsap.set(box, { x: span });
        tl = gsap.timeline({ repeat: -1 });
        // 강아지 영상은 왼쪽을 본다 → 왼쪽으로 달리고, 끝에서 뒤집어 오른쪽으로
        tl.set(img, { scaleX: 1 })
          .to(box, { x: 0, duration: dur, ease: "none" })
          .to(img, { y: -14, duration: 0.18, ease: "power2.out" })
          .set(img, { scaleX: -1 })
          .to(img, { y: 0, duration: 0.18, ease: "power2.in" })
          .to(box, { x: span, duration: dur, ease: "none" })
          .to(img, { y: -14, duration: 0.18, ease: "power2.out" })
          .set(img, { scaleX: 1 })
          .to(img, { y: 0, duration: 0.18, ease: "power2.in" });
      };
      ScrollTrigger.create({
        trigger: box.parentElement,
        start: "top 90%",
        once: true,
        onEnter: () => {
          img.src = CLIPS.run.anim;
          build();
        },
      });
      const ro = new ResizeObserver(() => tl && build());
      if (box.parentElement) ro.observe(box.parentElement);
      return () => ro.disconnect();
    }, box);
    return () => {
      tl?.kill();
      ctx.revert();
    };
  }, [size, speed]);
  return (
    <span
      ref={boxRef}
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-[calc(100%-6px)] left-0 block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img ref={imgRef} alt="" width={320} height={320} draggable={false} className="h-full w-full" />
    </span>
  );
}

/**
 * 상자 아래에서 빼꼼 고개를 내밀었다 숨는 강아지. 부모 요소에 overflow-hidden 이 필요 없도록
 * 강아지 자체를 잘라 보여 준다(위쪽 절반만 보이게).
 */
export function DogPeek({
  pose = "dazed",
  size = 110,
  className = "",
}: {
  pose?: "dazed" | "wave" | "heart" | "thumb";
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { y: 0, yPercent: 66 }); // 정지용 translateY(38%)를 픽셀로 더하지 않게 초기화
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, paused: true });
      tl.to(el, { yPercent: 4, duration: 0.55, ease: "back.out(2)" })
        .to(el, { rotate: -8, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, "+=0.3")
        .to(el, { yPercent: 66, duration: 0.4, ease: "power2.in" }, "+=0.8");
      ScrollTrigger.create({ trigger: el.parentElement, start: "top 85%", onEnter: () => tl.play(), onLeaveBack: () => tl.pause() });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-full block overflow-hidden select-none ${className}`}
      style={{ width: size, height: size * 0.62 }}
    >
      <img
        ref={ref}
        src={`/dog/dog-${pose}.webp`}
        alt=""
        width={512}
        height={512}
        draggable={false}
        className="absolute top-0 left-0 w-full"
        style={{ transform: "translateY(8%)", transformOrigin: "50% 100%" }}
      />
    </span>
  );
}
