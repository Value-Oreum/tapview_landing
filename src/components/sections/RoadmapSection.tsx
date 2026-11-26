"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHead from "./SectionHead";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";
import { MAP_H, MAP_W, PINS, REGION_DOTS } from "./worldMap";
import type { Lang } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Key = keyof typeof PINS;

/** 일정은 모두 예상(계획서 기준). 바뀌면 여기만 고친다 */
type Stop = { key: Key; name: string; when: string; year: string; date: string; d: string; color: string; label: string };
const POS: Record<Key, { color: string; label: string; year: string }> = {
  kr: { color: "#ffd45a", label: "-translate-x-[78%] translate-y-[45%]", year: "2027" },
  jp: { color: "#8bf2c2", label: "-translate-x-[35%] -translate-y-[150%]", year: "2028" },
  eu: { color: "#8bf2c2", label: "-translate-x-[25%] translate-y-[60%]", year: "2029~" },
};
const COPY = {
  ko: {
    eyebrow: "로드맵",
    title: "한국에서 시작해,\n세계로.",
    desc: "한국에서 먼저 출시하고, 일본과 유럽으로 넓혀 갑니다.",
    aria: "한국에서 출시해 일본, 유럽으로 확장하는 지도",
    note: "일정은 현재 계획 기준의 예상이며, 개발·제휴 상황에 따라 바뀔 수 있습니다.",
    stops: [
      { key: "kr", name: "한국", when: "출시", date: "2027년 6월 정식 출시 예정", d: "복지관과 함께 시작해, 전국으로." },
      { key: "jp", name: "일본", when: "확장", date: "2028년 하반기 출시 예상", d: "가장 가까운 초고령 사회로." },
      { key: "eu", name: "유럽", when: "확장", date: "2029년 이후 진출 예상", d: "읽기가 불편한 곳이라면 어디든." },
    ],
  },
  ja: {
    eyebrow: "ロードマップ",
    title: "韓国から始めて、\n世界へ。",
    desc: "まず韓国でリリースし、日本、そしてヨーロッパへと広げていきます。",
    aria: "韓国でリリースし、日本・ヨーロッパへ広げていく地図",
    note: "スケジュールは現時点の計画にもとづく予定で、開発や提携の状況により変わることがあります。",
    stops: [
      { key: "kr", name: "韓国", when: "リリース", date: "2027年6月 正式リリース予定", d: "福祉館と一緒に始め、全国へ。" },
      { key: "jp", name: "日本", when: "展開", date: "2028年下半期 リリース予定", d: "いちばん近い超高齢社会へ。" },
      { key: "eu", name: "ヨーロッパ", when: "展開", date: "2029年以降 進出予定", d: "読みづらさがある場所なら、どこへでも。" },
    ],
  },
} as const;

/** 한국에서 위로 솟았다 내려앉는 곡선 */
function arc(a: readonly number[], b: readonly number[], lift: number) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 - lift;
  return `M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`;
}
const ARCS: Partial<Record<Key, string>> = {
  jp: arc(PINS.kr, PINS.jp, 34),
  eu: arc(PINS.kr, PINS.eu, 118),
};

export default function RoadmapSection({ lang = "ko" }: { lang?: Lang }) {
  const c = COPY[lang];
  const STOPS: Stop[] = c.stops.map((x) => ({ ...x, ...POS[x.key] }));
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const arcLen: Partial<Record<Key, number>> = {};
      for (const k of ["jp", "eu"] as const) {
        const p = el.querySelector(`[data-arc=${k}]`) as SVGPathElement;
        arcLen[k] = p.getTotalLength();
        gsap.set(p, { strokeDasharray: arcLen[k], strokeDashoffset: arcLen[k] });
      }
      gsap.set(q("[data-base]"), { opacity: 0 });
      gsap.set(q("[data-dots], [data-spark]"), { opacity: 0 });
      gsap.set(q("[data-pin]"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
      gsap.set(q("[data-label]"), { opacity: 0, y: 10, filter: "blur(8px)" });
      gsap.set(q("[data-step]"), { opacity: 0.3 });

      const showStop = (k: Key) =>
        gsap
          .timeline()
          .to(q(`[data-pin=${k}]`), { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2.4)" }, 0)
          .to(q(`[data-dots=${k}]`), { opacity: 1, duration: 0.8, ease: "power1.out" }, 0)
          .to(q(`[data-label=${k}]`), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, 0.1)
          .to(q(`[data-step=${k}]`), { opacity: 1, duration: 0.6 }, 0.1);

      const drawArc = (k: "jp" | "eu", duration: number) => {
        const path = el.querySelector(`[data-arc=${k}]`) as SVGPathElement;
        const spark = el.querySelector(`[data-spark=${k}]`) as SVGCircleElement;
        const len = arcLen[k] ?? 0;
        const st = { p: 0 };
        return gsap
          .timeline()
          .set(spark, { opacity: 1 })
          .to(st, {
            p: 1,
            duration,
            ease: "power1.inOut",
            onUpdate: () => {
              path.style.strokeDashoffset = String(len * (1 - st.p));
              const pt = path.getPointAtLength(len * st.p);
              spark.setAttribute("cx", String(pt.x));
              spark.setAttribute("cy", String(pt.y));
            },
          })
          .to(spark, { opacity: 0, duration: 0.3 });
      };

      const tl = gsap
        .timeline({ paused: true })
        .to(q("[data-base]"), { opacity: 1, duration: 1.2, ease: "power1.out" }, 0)
        .add(showStop("kr"), 0.6)
        .add(drawArc("jp", 1.0), 1.5)
        .add(showStop("jp"), 2.4)
        .add(drawArc("eu", 1.7), 2.9)
        .add(showStop("eu"), 4.5);

      ScrollTrigger.create({ trigger: el, start: "top 70%", once: true, onEnter: () => tl.play() });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="overflow-hidden px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead
          id="roadmap-title"
          eyebrow={c.eyebrow}
          title={c.title}
          desc={c.desc}
        />

        <div ref={root} className="mt-14">
          {/* 모바일은 아시아·유럽 쪽을 크게 잘라 보여 준다 */}
          <div className="relative overflow-hidden">
            <div
              className="relative -ml-[66%] w-[175%] md:ml-0 md:w-full"
              style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
            >
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label={c.aria}
              >
                <image data-base href="/world/dots.svg" width={MAP_W} height={MAP_H} />
                {STOPS.map((s) => (
                  <path
                    key={s.key}
                    data-dots={s.key}
                    d={REGION_DOTS[s.key]}
                    stroke={s.color}
                    strokeWidth={3.3}
                    strokeLinecap="round"
                  />
                ))}
                {(["jp", "eu"] as const).map((k) => (
                  <g key={k}>
                    <path data-arc={k} d={ARCS[k]} fill="none" stroke="#8bf2c2" strokeOpacity={0.85} strokeWidth={1.5} strokeLinecap="round" />
                    <circle data-spark={k} r={3.2} fill="#f2f4ef" cx={PINS.kr[0]} cy={PINS.kr[1]} style={{ filter: "drop-shadow(0 0 4px #8bf2c2)" }} />
                  </g>
                ))}
                {STOPS.map((s) => (
                  <g key={s.key} data-pin={s.key}>
                    <circle className="map-pulse" cx={PINS[s.key][0]} cy={PINS[s.key][1]} r={4} fill="none" stroke={s.color} strokeWidth={1.2} />
                    <circle cx={PINS[s.key][0]} cy={PINS[s.key][1]} r={4.2} fill={s.color} style={{ filter: `drop-shadow(0 0 6px ${s.color})` }} />
                  </g>
                ))}
              </svg>

              {STOPS.map((s) => (
                <p
                  key={s.key}
                  data-label={s.key}
                  aria-hidden
                  className="pointer-events-none absolute whitespace-nowrap"
                  style={{ left: `${(PINS[s.key][0] / MAP_W) * 100}%`, top: `${(PINS[s.key][1] / MAP_H) * 100}%` }}
                >
                  <span className={`block ${s.label}`}>
                    <span className="text-[clamp(0.9375rem,1.5vw,1.25rem)] font-semibold text-paper">{s.name}</span>
                    <span className="ml-1.5 text-[clamp(0.8125rem,1.1vw,0.9375rem)] font-semibold tabular-nums" style={{ color: s.color }}>
                      {s.year}
                    </span>
                  </span>
                </p>
              ))}
            </div>
          </div>

          <ol className="mt-10 grid gap-3 md:grid-cols-3">
            {STOPS.map((s, i) => (
              <li key={s.key} data-step={s.key} className="rounded-[24px] border border-paper/10 bg-paper/[0.03] p-6">
                <p className="text-[0.9375rem] font-semibold" style={{ color: s.color }}>
                  {i + 1} · {s.when}
                </p>
                <p className="mt-2 text-[1.375rem] font-semibold tracking-[-0.02em] text-paper">{s.name}</p>
                <p className="mt-1 text-[1rem] font-semibold text-paper/85 tabular-nums">{s.date}</p>
                <p className="mt-1 text-[1rem] leading-[1.6] text-paper/65">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[0.875rem] text-paper/45">{c.note}</p>
        </div>
      </div>
    </section>
  );
}
