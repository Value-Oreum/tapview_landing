import SectionHead from "./SectionHead";
import Reveal from "@/components/motion/Reveal";

const STEPS = [
  {
    n: "1",
    t: "화면의 글을 읽고",
    d: "안드로이드 접근성 기능과 기기 안 글자 인식으로 지금 화면의 글을 읽습니다.",
  },
  {
    n: "2",
    t: "멈추면 맞추고",
    d: "스크롤하는 동안은 원래 화면 그대로. 읽으려고 손을 멈추면 내 설정으로 다시 보여 줍니다.",
  },
  {
    n: "3",
    t: "원래 글 그대로 다시 그립니다",
    d: "글을 새로 만들지 않습니다. 원래 글을 내 눈에 맞는 크기·바탕·또렷함으로 다시 배치합니다.",
  },
];

const DETAILS = [
  {
    q: "개인정보는 어떻게 다루나요?",
    a: "화면 원문과 입력 내용은 기기 밖으로 보내지 않습니다. 서버는 계정, 설정 동기화, 결제, 가족 연결, 복지관 관리만 맡습니다.",
  },
  {
    q: "은행·보안 화면에서는요?",
    a: "보안 키패드와 보안 화면에서는 탭뷰 표시를 끄고 휴대폰 기본 확대 기능을 안내합니다. 금액과 날짜는 원본도 함께 보여 줘 잘못 읽을 위험을 줄입니다.",
  },
  {
    q: "효과는 어떻게 증명하나요?",
    a: "같은 참여자가 '도움 없음 · 휴대폰 기본 확대 · 탭뷰' 세 조건에서 같은 과제를 하도록 비교합니다. 5명 사전 시험 → 30명 비교 → 100명 1~4주 사용 순서로 넓히고, 기본 확대보다 낫지 않으면 방향을 바꿉니다.",
  },
  {
    q: "지금 어디까지 만들었나요?",
    a: "최종 화면 디자인 45개를 확정했고(2026.11.17), 안드로이드 앱을 개발해 내부 테스트 중입니다. 초기 개발을 마치면 바로 구글 플레이·갤럭시 스토어에 등록합니다.",
  },
];

export default function TechSection() {
  return (
    <section id="tech" aria-labelledby="tech-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead
          id="tech-title"
          eyebrow="기술"
          title={"원래 화면은 그대로,\n내 설정으로 다시 그립니다."}
          desc="화면을 바꾸지 않고, 내 눈에 맞는 층을 한 겹 얹습니다. 시력을 재거나 고치는 앱이 아니라, 화면을 읽기 편하게 맞추는 읽기 보조 앱입니다."
        />

        <Reveal as="ol" className="mt-16 grid gap-4 lg:grid-cols-3" stagger={0.14}>
          {STEPS.map((s, i) => (
            <li key={s.n} data-reveal className="relative rounded-[28px] border border-paper/10 bg-paper/[0.03] p-8">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-mint/50 text-[1.0625rem] font-bold text-mint">
                {s.n}
              </span>
              <p className="mt-6 text-[clamp(1.25rem,2vw,1.625rem)] font-semibold tracking-[-0.02em] text-paper">{s.t}</p>
              <p className="mt-3 text-[1.0625rem] leading-[1.65] text-paper/70">{s.d}</p>
              {i < STEPS.length - 1 && (
                <span aria-hidden className="absolute top-1/2 -right-3 hidden h-px w-6 bg-mint/40 lg:block" />
              )}
            </li>
          ))}
        </Reveal>

        <Reveal className="mt-6">
          <div
            data-reveal
            className="flex flex-col gap-6 rounded-[28px] border border-mint/30 bg-gradient-to-r from-forest/60 via-forest/20 to-transparent p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10"
          >
            <div className="max-w-[40rem]">
              <p className="inline-flex items-center gap-2 rounded-full bg-mint/15 px-3.5 py-1.5 text-[0.9375rem] font-semibold text-mint">
                <span aria-hidden className="h-2 w-2 rounded-full bg-mint" />
                특허 출원 중
              </p>
              <p className="mt-4 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.3] font-semibold tracking-[-0.02em] text-paper">
                비교해서 고르면 내 화면이 되는 방법,
                <br />
                특허로 출원했습니다.
              </p>
              <p className="mt-3 text-[1.0625rem] leading-[1.65] text-paper/70">
                비교 화면에서 고른 결과로 화면 표시 설정을 만들고, 사용 상황에 맞춰 적용하는 방법입니다.
              </p>
            </div>
            <dl className="shrink-0 text-[0.9375rem] leading-[1.7] text-paper/60 tabular-nums">
              <div className="flex gap-3">
                <dt>출원번호</dt>
                <dd className="font-semibold text-paper/85">10-2026-0240614</dd>
              </div>
              <div className="flex gap-3">
                <dt>출원일</dt>
                <dd className="font-semibold text-paper/85">2026. 11. 26.</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <div className="mt-14 divide-y divide-paper/10 border-y border-paper/10">
          {DETAILS.map((d) => (
            <details key={d.q} className="group py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[clamp(1.125rem,1.6vw,1.375rem)] font-semibold text-paper">
                {d.q}
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-paper/20 text-paper/70 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 text-[1.0625rem] leading-[1.7] text-paper/70">{d.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
