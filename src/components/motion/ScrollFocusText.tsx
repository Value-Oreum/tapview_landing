"use client";

import { createElement, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = {
  text: string;
  as?: "p" | "h2" | "h3" | "span" | "div";
  className?: string;
  /** 초점이 맞기 시작/끝나는 지점 (ScrollTrigger start/end) */
  start?: string;
  end?: string;
  blur?: number;
};

/** 스크롤에 맞춰 단어마다 흐림 → 선명. 움직임 줄이기면 처음부터 선명. */
export default function ScrollFocusText({
  text,
  as = "p",
  className,
  start = "top 88%",
  end = "center 52%",
  blur = 12,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll<HTMLElement>("[data-w]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { filter: `blur(${blur}px)`, opacity: 0.14 },
        {
          filter: "blur(0px)",
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start, end, scrub: 0.4 },
        },
      );
    }, el);
    const off = () => prefersReducedMotion() && ctx.revert();
    window.addEventListener("tv:motion", off);
    return () => {
      window.removeEventListener("tv:motion", off);
      ctx.revert();
    };
  }, [text, start, end, blur]);

  const parts = text.split(/(\s+|\n)/);
  return createElement(
    as,
    { ref, className },
    parts.map((p, i) =>
      p === "\n" ? (
        <br key={i} />
      ) : /^\s+$/.test(p) ? (
        p
      ) : (
        <span key={i} data-w className="blur-word">
          {p}
        </span>
      ),
    ),
  );
}
