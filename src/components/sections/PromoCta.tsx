import Dog from "@/components/Dog";
import ScrollFocusText from "@/components/motion/ScrollFocusText";
import Reveal from "@/components/motion/Reveal";

/** 마지막 CTA — '첫눈에 탭!' 혜택 두 가지 */
export default function PromoCta() {
  return (
    <section id="join" aria-labelledby="join-title" className="relative overflow-hidden px-5 py-[18vh] sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 55% at 50% 30%, rgb(139 242 194 / 0.08), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="mx-auto max-w-[52rem] text-center">
          <p className="inline-flex rounded-full bg-tap px-4 py-1.5 text-[1rem] font-extrabold text-ink">첫눈에 탭!</p>
          <h2 id="join-title" className="mt-6">
            <ScrollFocusText
              as="span"
              text={"먼저 알아본 탭뷰어에게,\n먼저 드립니다."}
              start="top 90%"
              end="top 50%"
              className="block text-[clamp(2.25rem,5.6vw,4.75rem)] leading-[1.08] font-semibold tracking-[-0.045em] text-paper"
            />
          </h2>
        </div>

        <Reveal className="mt-16 grid gap-5 md:grid-cols-2" stagger={0.15}>
          <article data-reveal className="relative flex flex-col rounded-[36px] border border-paper/12 bg-paper/[0.04] p-8 pt-24 sm:p-10 sm:pt-28">
            <Dog pose="gift" motion="hop" className="absolute -top-10 left-6 h-36 w-36 sm:h-40 sm:w-40" />
            <p className="text-[0.9375rem] font-semibold text-mint/80">사전 예약</p>
            <h3 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-paper">첫 눈도장</h3>
            <p className="mt-4 text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.35] font-semibold text-paper">
              출시 후 <span className="text-mint">첫 1년 무료</span>
            </p>
            <p className="mt-2 text-[1.0625rem] text-paper/70">본인과 가족 2명까지. 지금 예약하고 출시 소식을 가장 먼저 받으세요.</p>
            <div className="mt-auto pt-8">
              <a
                href="/reserve"
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-paper text-[1.0625rem] font-extrabold text-forest transition-transform hover:scale-[1.02] sm:w-auto sm:px-8"
              >
                첫 눈도장 찍기
              </a>
            </div>
          </article>

          <article data-reveal className="relative flex flex-col rounded-[36px] border border-mint/30 bg-gradient-to-b from-forest/50 to-paper/[0.02] p-8 pt-24 sm:p-10 sm:pt-28">
            <Dog pose="cape" motion="float" className="absolute -top-12 left-6 h-36 w-36 sm:h-40 sm:w-40" delay={0.15} />
            <p className="text-[0.9375rem] font-semibold text-mint/80">체험단</p>
            <h3 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-paper">평생 눈도장</h3>
            <p className="mt-4 text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.35] font-semibold text-paper">
              함께 만들면 <span className="text-mint">평생 무료</span>
            </p>
            <p className="mt-2 text-[1.0625rem] text-paper/70">
              본인과 가족 2명까지. 출시 전에 먼저 써 보고 의견을 주시는 체험단을 모집합니다.
            </p>
            <div className="mt-auto pt-8">
              <a
                href="/reserve?beta=1"
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full border border-mint/60 text-[1.0625rem] font-extrabold text-mint transition-colors hover:bg-mint hover:text-ink sm:w-auto sm:px-8"
              >
                체험단도 함께 신청
              </a>
            </div>
          </article>
        </Reveal>
        <p className="mt-8 text-center text-[0.9375rem] leading-[1.7] text-paper/50">
          평생 눈도장은 체험단으로 선발되어 정해진 기간 동안 사용하고 의견을 마친 탭뷰어가 대상입니다. 혜택은 출시 때 신청하신 이메일과 문자로 안내합니다.
        </p>
      </div>
    </section>
  );
}
