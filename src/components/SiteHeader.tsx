"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePrefs } from "@/components/providers/PrefsProvider";

const LINKS = [
  { href: "#story", label: "브랜드 스토리" },
  { href: "#service", label: "서비스" },
  { href: "#tech", label: "기술" },
  { href: "#institution", label: "기관" },
  { href: "#team", label: "팀" },
];

function Toggle({
  pressed,
  onClick,
  children,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-semibold transition-colors duration-200 ${
        pressed ? "bg-mint text-ink" : "text-paper/80 hover:bg-paper/10 hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}

export default function SiteHeader() {
  const { largeText, reduceMotion, toggleLargeText, toggleReduceMotion } = usePrefs();
  const [open, setOpen] = useState(false);
  const home = usePathname() === "/";
  const links = LINKS.map((l) => ({ ...l, href: home ? l.href : `/${l.href}` }));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header data-site-header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`glass mx-auto flex h-14 max-w-[1240px] items-center justify-between rounded-full pr-2 pl-5 transition-[background-color] duration-300 ${
          scrolled ? "bg-ink/80" : ""
        }`}
      >
        <a href={home ? "#top" : "/"} className="flex items-center" aria-label="탭뷰 처음으로">
          <img src="/brand/logo-white.png" alt="TapView" width={640} height={222} className="h-[22px] w-auto" />
        </a>

        <nav aria-label="주요 메뉴" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-[0.9375rem] font-semibold text-paper/75 transition-colors duration-200 hover:text-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-0.5 md:flex" role="group" aria-label="읽기 편의">
            <Toggle pressed={largeText} onClick={toggleLargeText} label="글자 크게">
              <span aria-hidden className="text-[0.95rem] leading-none font-extrabold">가</span>
              글자 크게
            </Toggle>
            <Toggle pressed={reduceMotion} onClick={toggleReduceMotion} label="움직임 줄이기">
              움직임 줄이기
            </Toggle>
          </div>
          <a
            href="/reserve"
            className="ml-1 inline-flex h-10 items-center rounded-full bg-paper px-5 text-[0.9375rem] font-extrabold text-forest transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            사전 예약
          </a>
          <button
            type="button"
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-paper lg:hidden"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="glass mx-auto mt-2 max-w-[1240px] rounded-[28px] p-5 lg:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-3 py-3 text-[1.25rem] font-semibold text-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-paper/10 pt-4" role="group" aria-label="읽기 편의">
            <Toggle pressed={largeText} onClick={toggleLargeText} label="글자 크게">
              <span aria-hidden className="text-[0.95rem] leading-none font-extrabold">가</span>
              글자 크게
            </Toggle>
            <Toggle pressed={reduceMotion} onClick={toggleReduceMotion} label="움직임 줄이기">
              움직임 줄이기
            </Toggle>
          </div>
        </div>
      )}
    </header>
  );
}
