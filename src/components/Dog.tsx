"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type DogPose = "gift" | "cheer" | "heart" | "thumb" | "cape" | "dance" | "run" | "wave" | "dazed" | "jump" | "sleep";
export type DogMotion = "float" | "wiggle" | "hop" | "bounce" | "dash";

const ALT: Record<DogPose, string> = {
  gift: "선물상자를 든 탭뷰 강아지",
  cheer: "응원하는 탭뷰 강아지",
  heart: "하트를 만드는 탭뷰 강아지",
  thumb: "엄지를 든 탭뷰 강아지",
  cape: "망토를 두른 탭뷰 강아지",
  dance: "춤추는 탭뷰 강아지",
  run: "달려가는 탭뷰 강아지",
  wave: "손을 흔드는 탭뷰 강아지",
  dazed: "깜짝 놀란 탭뷰 강아지",
  jump: "뛰어오르는 탭뷰 강아지",
  sleep: "자는 탭뷰 강아지",
};

/**
 * 움직이는 강아지 오브제. 화면에 들어오면 튀어 오르며 등장하고, 이후 동작(motion)을 반복한다.
 * 장식이면 decorative(기본)로 두어 화면 읽기 프로그램이 건너뛴다.
 */
export default function Dog({
  pose,
  motion = "float",
  className = "",
  decorative = true,
  delay = 0,
}: {
  pose: DogPose;
  motion?: DogMotion;
  className?: string;
  decorative?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLImageElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const loop = () => {
        switch (motion) {
          case "float":
            return gsap.to(el, { y: -10, rotate: 2, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
          case "wiggle":
            return gsap.to(el, { rotate: 6, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 90%" });
          case "hop":
            return gsap
              .timeline({ repeat: -1, repeatDelay: 1.4 })
              .to(el, { scaleY: 0.9, scaleX: 1.06, duration: 0.14, transformOrigin: "50% 100%", ease: "power2.out" })
              .to(el, { y: -18, scaleY: 1.05, scaleX: 0.97, duration: 0.24, ease: "power2.out" })
              .to(el, { y: 0, scaleY: 1, scaleX: 1, duration: 0.22, ease: "power2.in" })
              .to(el, { scaleY: 0.94, scaleX: 1.04, duration: 0.08, yoyo: true, repeat: 1 });
          case "bounce":
            return gsap.to(el, { y: -6, scale: 1.03, duration: 0.45, yoyo: true, repeat: -1, ease: "power1.inOut", transformOrigin: "50% 100%" });
          case "dash":
            return gsap.to(el, { x: 8, duration: 0.35, yoyo: true, repeat: -1, ease: "power1.inOut" });
        }
      };
      gsap.fromTo(
        el,
        { y: 40, scale: 0.6, opacity: 0, rotate: -8 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          delay,
          ease: "elastic.out(1, 0.55)",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onComplete: () => {
            loop();
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [motion, delay]);

  // 위치·크기는 바깥 상자(className)가, 움직임은 안쪽 그림이 맡는다 (GSAP transform이 배치용 translate를 덮지 않게)
  return (
    <span className={`pointer-events-none block select-none ${className}`} aria-hidden={decorative || undefined}>
      <img
        ref={ref}
        src={`/dog/dog-${pose}.webp`}
        alt={decorative ? "" : ALT[pose]}
        width={512}
        height={512}
        draggable={false}
        className="h-full w-full"
      />
    </span>
  );
}
