import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ReserveForm from "@/components/reserve/ReserveForm";
import Dog from "@/components/Dog";

export const metadata: Metadata = {
  title: "사전 예약 · 첫눈에 탭!",
  description: "탭뷰 사전 예약(첫눈도장)하면 출시 후 첫 1년 무료. 체험단(평생 눈도장)으로 함께 만들면 평생 무료. 본인과 가족 2명까지.",
};

const PERKS = [
  {
    dog: "gift" as const,
    motion: "hop" as const,
    tag: "사전 예약",
    name: "첫눈도장",
    big: "출시 후 첫 1년 무료",
    small: "본인과 가족 2명까지",
  },
  {
    dog: "cape" as const,
    motion: "float" as const,
    tag: "체험단",
    name: "평생 눈도장",
    big: "함께 만들면 평생 무료",
    small: "선발 후 정해진 기간 사용·의견을 마친 분",
  },
  {
    dog: "heart" as const,
    motion: "wiggle" as const,
    tag: "가족",
    name: "부모님께 찍어 드리기",
    big: "가족 대리 신청 가능",
    small: "사용하실 분의 동의를 먼저 받아 주세요",
  },
];

export default function ReservePage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden px-5 pt-32 pb-24 sm:px-10 sm:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
          style={{ background: "radial-gradient(60% 60% at 30% 0%, rgb(139 242 194 / 0.09), transparent 70%)" }}
        />
        <div className="relative mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <p className="inline-flex rounded-full bg-tap px-4 py-1.5 text-[1rem] font-extrabold text-ink">첫눈에 탭!</p>
            <h1 className="mt-6 text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.08] font-semibold tracking-[-0.045em] text-paper">
              첫눈도장 찍고,
              <br />
              <span className="text-mint">먼저 만나세요.</span>
            </h1>
            <p className="mt-6 max-w-[36rem] text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.65] text-paper/72">
              사전 예약하신 탭뷰어에게는 출시 후 첫 1년을 무료로 드립니다. 1분이면 끝나요.
            </p>
            <div className="mt-14 sm:mt-20">
              <ReserveForm />
            </div>
          </div>

          <aside aria-label="첫눈에 탭! 혜택" className="lg:pt-48">
            <div className="grid gap-5 lg:sticky lg:top-28">
              {PERKS.map((p, i) => (
                <div key={p.name} className="relative rounded-[30px] border border-paper/12 bg-paper/[0.04] p-7 pr-32">
                  <Dog pose={p.dog} motion={p.motion} delay={i * 0.12} className="absolute top-1/2 right-3 h-28 w-28 -translate-y-1/2" />
                  <p className="text-[0.875rem] font-semibold text-mint/80">{p.tag}</p>
                  <p className="mt-1 text-[1.5rem] font-semibold tracking-[-0.02em] text-paper">{p.name}</p>
                  <p className="mt-3 text-[1.125rem] font-semibold text-paper">{p.big}</p>
                  <p className="mt-1 text-[0.9375rem] text-paper/60">{p.small}</p>
                </div>
              ))}
              <p className="px-2 text-[0.875rem] leading-[1.7] text-paper/45">
                혜택은 출시 때 신청하신 이메일과 문자로 안내합니다. 가격은 연간 9,900원(7일 무료 체험)입니다.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
