import SectionHead from "./SectionHead";
import Reveal from "@/components/motion/Reveal";

const STEPS = [
  { when: "2026.11 ~ 2027.02", t: "앱 개발 · 사전 예약", d: "최종 디자인 45화면으로 안드로이드 앱 개발, 실기기 실험, 마켓 등록", now: true },
  { when: "2027.03 ~ 05", t: "복지관 시드 운영", d: "복지관 2~3곳, 휴대폰 기본 확대와 30명 비교" },
  { when: "2027.06 ~ 08", t: "정식 출시", d: "앱 장터 출시, 연간 이용권, 통신사 제휴 협의" },
  { when: "2027.09 ~ 12", t: "기관 패키지", d: "복지관·기관 확대, 원격 일괄 설정" },
  { when: "2028", t: "통신사 · 제휴 앱 · 일본", d: "통신사 부가서비스, 화면 맞춤 SDK, 일본 출시(10월 목표)" },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead
          id="roadmap-title"
          eyebrow="로드맵"
          title={"한 동네 복지관에서,\n바다 건너까지."}
          desc="작게 시작해 효과를 숫자로 확인하고, 그다음에 넓힙니다."
        />
        <Reveal as="ol" className="relative mt-16 grid gap-0 md:grid-cols-5" stagger={0.12}>
          {STEPS.map((s) => (
            <li key={s.when} data-reveal className="relative border-l border-paper/15 pb-10 pl-7 md:border-t md:border-l-0 md:pt-8 md:pr-6 md:pb-0 md:pl-0">
              <span
                aria-hidden
                className={`absolute top-0 -left-[7px] h-3.5 w-3.5 rounded-full md:-top-[7px] md:left-0 ${
                  s.now ? "bg-mint shadow-[0_0_0_6px_rgb(139_242_194/0.18)]" : "bg-paper/40"
                }`}
              />
              <p className={`text-[0.9375rem] font-semibold ${s.now ? "text-mint" : "text-paper/55"}`}>
                {s.when}
                {s.now && <span className="ml-2 rounded-full bg-mint/15 px-2 py-0.5 text-[0.8125rem]">지금</span>}
              </p>
              <p className="mt-2 text-[1.25rem] font-semibold text-paper">{s.t}</p>
              <p className="mt-2 text-[1rem] leading-[1.6] text-paper/65">{s.d}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
