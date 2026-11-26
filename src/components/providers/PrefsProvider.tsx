"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

type Prefs = {
  largeText: boolean;
  reduceMotion: boolean; // 사용자가 켠 값 또는 시스템 설정
  toggleLargeText: () => void;
  toggleReduceMotion: () => void;
};

const PrefsContext = createContext<Prefs | null>(null);
const KEY = "tv-prefs";

/** <head>에서 그리기 전에 실행: 저장된 설정을 html 속성으로 먼저 적용 (깜빡임 방지) */
export const prefsBootScript = `try{var p=JSON.parse(localStorage.getItem("${KEY}")||"{}");var d=document.documentElement;if(p.t)d.dataset.text="lg";if(p.m)d.dataset.motion="reduce";}catch(e){}`;

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside PrefsProvider");
  return ctx;
}

/** 움직임을 줄여야 하는지 (사용자 토글 또는 OS 설정) — 컴포넌트 밖에서도 쓰기 위해 분리 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    document.documentElement.dataset.motion === "reduce" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [largeText, setLargeText] = useState(false);
  const [userReduce, setUserReduce] = useState(false);
  const [systemReduce, setSystemReduce] = useState(false);

  // 처음 그린 뒤 저장값 읽기 (html 속성은 boot script가 이미 적용)
  useEffect(() => {
    const d = document.documentElement;
    setLargeText(d.dataset.text === "lg");
    setUserReduce(d.dataset.motion === "reduce");
    // 초대 코드·유입 경로 기억 (?ref=TV-XXXX, utm_*) → 신청 때 함께 보냄
    try {
      const q = new URLSearchParams(location.search);
      const ref = q.get("ref");
      if (ref && /^TV-[A-Z0-9]{4}$/.test(ref)) sessionStorage.setItem("tv-ref", ref);
      const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => q.get(k)).filter(Boolean).join("/");
      if (utm) sessionStorage.setItem("tv-utm", utm);
    } catch {}
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduce(mq.matches);
    const on = (e: MediaQueryListEvent) => setSystemReduce(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const persist = useCallback((t: boolean, m: boolean) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ t: t ? 1 : 0, m: m ? 1 : 0 }));
    } catch {}
  }, []);

  const toggleLargeText = useCallback(() => {
    setLargeText((v) => {
      const next = !v;
      const d = document.documentElement;
      if (next) d.dataset.text = "lg";
      else delete d.dataset.text;
      persist(next, d.dataset.motion === "reduce");
      // 글자 크기가 바뀌면 스크롤 연출 위치를 다시 계산
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return next;
    });
  }, [persist]);

  const toggleReduceMotion = useCallback(() => {
    setUserReduce((v) => {
      const next = !v;
      const d = document.documentElement;
      if (next) d.dataset.motion = "reduce";
      else delete d.dataset.motion;
      persist(d.dataset.text === "lg", next);
      window.dispatchEvent(new CustomEvent("tv:motion"));
      return next;
    });
  }, [persist]);

  const reduceMotion = userReduce || systemReduce;

  // 부드러운 스크롤 (움직임 줄이기면 끔)
  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // 페이지 안 링크(#story 등)도 부드럽게
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: 0 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduceMotion]);

  const value = useMemo(
    () => ({ largeText, reduceMotion, toggleLargeText, toggleReduceMotion }),
    [largeText, reduceMotion, toggleLargeText, toggleReduceMotion],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}
