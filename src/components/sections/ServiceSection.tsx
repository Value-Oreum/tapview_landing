import SectionHead from "./SectionHead";
import ScreenDemo from "./ScreenDemo";
import Reveal from "@/components/motion/Reveal";

const DIFFS = [
  {
    n: "01",
    t: "숫자 대신, 화면을 고릅니다",
    d: "휴대폰 설정은 '글자 크기 3단계' 같은 숫자를 고르게 합니다. 탭뷰는 두 화면을 보여 주고 편한 쪽만 고르게 합니다.",
  },
  {
    n: "02",
    t: "원래 화면은 그대로",
    d: "앱 화면을 통째로 키우지 않습니다. 원래 화면은 두고, 읽으려고 멈췄을 때 내 설정으로 다시 보여 줍니다.",
  },
  {
    n: "03",
    t: "위젯 한 번으로 전환",
    d: "독서할 때, 밖에서, 자기 전. 상황마다 맞춘 화면을 저장해 두고 홈 화면 위젯 한 번으로 불러옵니다.",
  },
  {
    n: "04",
    t: "가족이 함께 맞춰요",
    d: "자녀가 부모님 화면을 원격으로 다시 맞추고(본인 동의 시), 이용권을 대신 결제하거나 선물할 수 있습니다.",
  },
];

export default function ServiceSection() {
  return (
    <section id="service" aria-labelledby="service-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead
          id="service-title"
          eyebrow="서비스"
          title={"\"1번이 편하세요,\n2번이 편하세요?\""}
          desc="안경원에서 눈앞이 선명해지던 그 질문을 스마트폰 화면으로 옮겼습니다. 두 화면 중 편한 쪽을 두세 번 고르면, 내 눈에 맞는 화면이 완성됩니다. 직접 해 보세요."
        />
        <div className="mt-16">
          <ScreenDemo />
        </div>

        <Reveal className="mt-28">
          <h3 data-reveal className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-[-0.03em] text-paper">
            휴대폰 글자 크기 설정과 무엇이 다른가요?
          </h3>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {DIFFS.map((x) => (
              <li
                key={x.n}
                data-reveal
                className="rounded-[28px] border border-paper/10 bg-paper/[0.03] p-7 sm:p-9"
              >
                <span className="text-[0.9375rem] font-semibold text-mint/80">{x.n}</span>
                <p className="mt-3 text-[clamp(1.25rem,2vw,1.625rem)] font-semibold tracking-[-0.02em] text-paper">{x.t}</p>
                <p className="mt-3 text-[1.0625rem] leading-[1.65] text-paper/70">{x.d}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
