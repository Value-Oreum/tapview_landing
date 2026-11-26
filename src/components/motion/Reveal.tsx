"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** 안의 [data-reveal] 요소들이 화면에 들어올 때 흐림에서 떠오르며 나타난다(한 번). */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: 28,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.9,
        stagger,
        ease: "expo.out",
        clearProps: "filter,transform,opacity",
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [stagger]);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
