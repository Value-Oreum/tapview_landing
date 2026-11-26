"use client";

import { useState } from "react";
import { DogClip } from "@/components/DogMotion";
import PhoneFrame from "@/components/story/PhoneFrame";

type Setting = { size: 0 | 1; dark: 0 | 1; strong: 0 | 1 };

const STEPS = [
  { key: "size", title: "글자 크기", q: "어느 쪽이 편하세요?", a: "지금 크기", b: "크게" },
  { key: "dark", title: "바탕", q: "어느 바탕이 편하세요?", a: "밝은 바탕", b: "어두운 바탕" },
  { key: "strong", title: "또렷함", q: "어느 쪽이 더 또렷해요?", a: "보통", b: "더 또렷하게" },
] as const;

/** 데모 화면 속 문자 (가상의 약국 안내) */
function Sample({ s, mini = false }: { s: Setting; mini?: boolean }) {
  const bg = s.dark ? "#121614" : "#f4f5f2";
  const fg = s.dark ? (s.strong ? "#ffffff" : "#c9cec9") : s.strong ? "#000000" : "#5d625e";
  const bubble = s.dark ? (s.strong ? "#262c28" : "#1e2320") : s.strong ? "#ffffff" : "#e6e8e4";
  const size = s.size ? 7.4 : 4.9;
  return (
    <div
      className="absolute inset-0 transition-[background-color] duration-500"
      style={{ background: bg, color: fg }}
    >
      {!mini && (
        <div className="flex items-center gap-[3cqw] px-[6cqw] pt-[9cqw] text-[5.4cqw] font-semibold" style={{ color: fg }}>
          <span className="grid h-[9cqw] w-[9cqw] place-items-center rounded-full bg-[#2e5b43] text-[4.4cqw] text-white">약</span>
          새봄약국
        </div>
      )}
      <div
        className="mx-[5cqw] rounded-[5cqw] px-[5cqw] py-[4.5cqw] transition-all duration-500"
        style={{
          marginTop: mini ? "8cqw" : "10cqw",
          background: bubble,
          fontSize: `${size}cqw`,
          lineHeight: 1.45,
          fontWeight: s.strong ? 700 : 400,
          boxShadow: s.strong && !s.dark ? "0 0 0 0.5cqw rgba(0,0,0,.12)" : "none",
        }}
      >
        처방약이 준비되었습니다.
        <br />
        오늘 오후 6시까지 받아 가세요.
      </div>
    </div>
  );
}

/** 서비스 섹션의 '내 화면 찾기' 3단계 데모 */
export default function ScreenDemo() {
  const [s, setS] = useState<Setting>({ size: 0, dark: 0, strong: 0 });
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;
  const cur = STEPS[Math.min(step, STEPS.length - 1)];

  const choose = (v: 0 | 1) => {
    setS((prev) => ({ ...prev, [cur.key]: v }));
    setStep((x) => x + 1);
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="relative mx-auto w-[min(62vw,300px)]">
        <PhoneFrame>
          <Sample s={s} />
        </PhoneFrame>
        {done && <DogClip clip="cheer" className="absolute -right-16 -bottom-4 h-32 w-32 sm:-right-24 sm:h-36 sm:w-36" />}
        {done && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-tap px-4 py-1.5 text-[0.9375rem] font-extrabold whitespace-nowrap text-ink">
            내 화면 완성!
          </span>
        )}
      </div>

      <div>
        <ol className="flex gap-2" aria-label="진행 단계">
          {STEPS.map((x, i) => (
            <li
              key={x.key}
              className={`rounded-full px-4 py-2 text-[0.9375rem] font-semibold transition-colors ${
                i < step ? "bg-mint/15 text-mint" : i === step ? "bg-paper text-ink" : "bg-paper/[0.06] text-paper/50"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i + 1}. {x.title}
            </li>
          ))}
        </ol>

        <div aria-live="polite">
          {!done ? (
            <>
              <p className="mt-8 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.25] font-semibold tracking-[-0.03em] text-paper">
                {cur.q}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5">
                {([0, 1] as const).map((v) => {
                  const preview: Setting = { ...s, [cur.key]: v };
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => choose(v)}
                      className="group overflow-hidden rounded-[22px] border border-paper/15 bg-paper/[0.03] text-left transition-[border-color,transform] duration-200 hover:border-mint/70 active:scale-[0.98]"
                    >
                      <div className="relative aspect-[4/3]" style={{ containerType: "inline-size" }}>
                        <Sample s={preview} mini />
                      </div>
                      <span className="flex items-center justify-between px-4 py-3 text-[1rem] font-semibold text-paper">
                        <span>
                          {v + 1}. {v === 0 ? cur.a : cur.b}
                        </span>
                        <span className="text-mint opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                          탭
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="mt-8">
              <p className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.25] font-semibold tracking-[-0.03em] text-paper">
                세 번 탭으로 끝. 이제 이 화면이 <span className="text-mint">내 화면</span>입니다.
              </p>
              <p className="mt-4 text-[1.125rem] leading-[1.6] text-paper/70">
                실제 앱에서는 고른 조합이 기기에 저장되고, 홈 화면 위젯을 한 번 누르면 언제든 이 화면으로 바뀝니다.
              </p>
              <button
                type="button"
                onClick={() => {
                  setS({ size: 0, dark: 0, strong: 0 });
                  setStep(0);
                }}
                className="mt-6 inline-flex h-12 items-center rounded-full border border-paper/20 px-6 text-[1rem] font-semibold text-paper/85 hover:border-paper/50"
              >
                처음부터 다시
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
