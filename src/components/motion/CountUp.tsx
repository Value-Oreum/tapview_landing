"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** 화면에 들어오면 0에서 목표 숫자까지 올라가며 흐림→선명. 최종 값은 처음부터 HTML에 들어 있다. */
export default function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => Math.round(n).toLocaleString("ko-KR");

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.fromTo(
        obj,
        { v: 0 },
        {
          v: value,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = fmt(obj.v);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
      gsap.fromTo(el, { filter: "blur(10px)" }, { filter: "blur(0px)", duration: 1.4, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    }, el);
    return () => {
      ctx.revert();
      el.textContent = fmt(value);
    };
  }, [value]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {fmt(value)}
    </span>
  );
}
