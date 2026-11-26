import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/hero/Hero";
import ScrollFocusText from "@/components/motion/ScrollFocusText";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        {/* P2에서 스토리 무대로 채운다. 지금은 흐림→선명 연출 확인용 첫 장면 */}
        <section id="story" className="relative px-5 py-[22vh] sm:px-10">
          <div className="mx-auto max-w-[1100px]">
            <p className="mb-8 text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">아침 8:10</p>
            <ScrollFocusText
              as="h2"
              text={"3일이었나, 8일이었나."}
              className="text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-paper"
            />
            <ScrollFocusText
              text={"안경을 이마에 올리고,\n폰을 멀리."}
              className="mt-10 text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.25] font-light tracking-[-0.03em] text-paper/80"
            />
          </div>
        </section>
        <section className="h-[60vh]" aria-hidden="true" />
      </main>
    </>
  );
}
