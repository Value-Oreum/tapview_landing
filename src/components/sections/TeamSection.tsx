import SectionHead from "./SectionHead";
import ScrollFocusText from "@/components/motion/ScrollFocusText";

const TEAM = [
  {
    role: "현장 · 대표",
    line: "대신 읽어 드리던 사람이,\n이제 혼자 읽게 만듭니다.",
    career: "사회복지사 · 복지관 현장 경험",
    does: "현장의 눈으로 화면을 설계하고, 복지관의 문을 엽니다.",
  },
  {
    role: "개발",
    line: "현장에서 나온 불편을,\n가장 빠르게 화면으로.",
    career: "앱 개발 · AX 프로덕트 빌더",
    does: "AI로 빠르게 만들고, 안드로이드 앱으로 완성합니다.",
  },
  {
    role: "그로스",
    line: "15년, 앱을\n사람들 손에 쥐여 준 경험.",
    career: "앱 그로스 마케팅 15년 이상",
    does: "실제 활성 지표를 보며 탭뷰어를 눈덩이처럼 늘립니다.",
  },
  {
    role: "일본 사업",
    line: "다음 화면은,\n일본입니다.",
    career: "일본 IT 개발·사업PM 15년",
    does: "일본 빌드·현지화와 현지 제휴를 맡습니다.",
  },
];

export default function TeamSection() {
  return (
    <section id="team" aria-labelledby="team-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead id="team-title" eyebrow="팀" title={"보는 불편을,\n가장 가까이에서 본 사람들."} />
        <ul className="mt-16 grid gap-4 md:grid-cols-2">
          {TEAM.map((m) => (
            <li key={m.role} className="flex min-h-[19rem] flex-col justify-between rounded-[32px] border border-paper/10 bg-paper/[0.03] p-8 sm:p-10">
              <div>
                <p className="text-[0.9375rem] font-semibold text-mint/80">{m.role}</p>
                <ScrollFocusText
                  as="p"
                  text={m.line}
                  start="top 88%"
                  end="top 55%"
                  className="mt-5 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.25] font-semibold tracking-[-0.03em] text-paper"
                />
              </div>
              <div className="mt-8 border-t border-paper/10 pt-5">
                <p className="text-[1.0625rem] font-semibold text-paper/90">{m.career}</p>
                <p className="mt-1 text-[1rem] text-paper/65">{m.does}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
