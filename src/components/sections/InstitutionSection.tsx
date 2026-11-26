import SectionHead from "./SectionHead";
import Reveal from "@/components/motion/Reveal";
import Dog from "@/components/Dog";

const CLASS_STEPS = ["강사 QR로 설치", "7일 무료 체험 시작", "편한 그림 2~3번 탭", "내 화면 완성"];

const FEATURES = [
  { t: "단계별 현황", d: "참여 신청부터 설치, 내 화면 완성, 7일 뒤 다시 사용까지 한 화면에서 봅니다." },
  { t: "도움이 필요한 분만", d: "막힌 분만 추려 보여 줘서, 사회복지사 한 사람이 많은 분을 챙길 수 있습니다." },
  { t: "수업과 실적", d: "강사 화면의 QR·진행 안내, 기관 이용권 발급, 복지관 사업 실적 양식에 맞춘 이용 리포트." },
];

const REGIONS = ["성남", "대구", "충남권"];

export default function InstitutionSection() {
  return (
    <section id="institution" aria-labelledby="inst-title" className="relative overflow-hidden px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead
          id="inst-title"
          eyebrow="복지관 · 기관"
          title={"복지관 교실에서 먼저,\n10분이면 함께 맞춥니다."}
          desc="대표가 사회복지사라서, 가장 먼저 만나는 곳은 복지관입니다. 스마트폰 교실에서 강사·사회복지사와 함께 설치하고, 집에서는 혼자 매일 씁니다."
        />

        <Reveal as="ol" className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4" stagger={0.12}>
          {CLASS_STEPS.map((s, i) => (
            <li key={s} data-reveal className="rounded-[24px] border border-paper/10 bg-paper/[0.03] p-6">
              <span className="text-[0.9375rem] font-semibold text-mint/80">{i + 1}</span>
              <p className="mt-2 text-[1.1875rem] font-semibold text-paper">{s}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <Reveal>
            <h3 data-reveal className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-[-0.03em] text-paper">
              복지관 전용 화면
            </h3>
            <ul className="mt-8 grid gap-6">
              {FEATURES.map((f) => (
                <li key={f.t} data-reveal className="border-l-2 border-mint/40 pl-6">
                  <p className="text-[1.25rem] font-semibold text-paper">{f.t}</p>
                  <p className="mt-2 text-[1.0625rem] leading-[1.65] text-paper/70">{f.d}</p>
                </li>
              ))}
            </ul>
            <p data-reveal className="mt-8 text-[0.9375rem] text-paper/50">
              원격으로 다시 맞추기는 본인이 동의했을 때만 합니다.
            </p>
          </Reveal>

          <Reveal className="relative rounded-[32px] border border-paper/10 bg-gradient-to-b from-forest/40 to-transparent p-8 sm:p-10">
            <p data-reveal className="text-[0.9375rem] font-semibold text-mint/80">협약 추진 중</p>
            <p data-reveal className="mt-3 text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.35] font-semibold tracking-[-0.02em] text-paper">
              성남·대구·충남권 복지관과
              <br />
              협약을 추진하고 있습니다.
            </p>
            <ul data-reveal className="mt-6 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <li key={r} className="rounded-full border border-mint/40 px-4 py-1.5 text-[0.9375rem] font-semibold text-mint">
                  {r}
                </li>
              ))}
            </ul>
            <ul data-reveal className="mt-8 grid gap-2 text-[0.9375rem] leading-[1.6] text-paper/65">
              <li>· (주)뉴로아시스 업무협약 — 복지관·요양시설 현장 실증 (2026.11)</li>
              <li>· 대구보건대학교 안경광학과 — 화면 가독성 설계 자문 협력 (2026.11)</li>
            </ul>
            <a
              data-reveal
              href="/reserve?type=org"
              className="mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-paper pr-2 pl-7 text-[1.0625rem] font-extrabold text-forest transition-transform hover:scale-[1.02]"
            >
              기관 신청하기
              <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-paper" aria-hidden>
                →
              </span>
            </a>
            <Dog pose="heart" motion="wiggle" className="absolute -top-14 right-4 h-28 w-28 sm:right-8 sm:h-32 sm:w-32" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
