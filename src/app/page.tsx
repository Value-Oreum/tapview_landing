import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/hero/Hero";
import BrandStory from "@/components/story/BrandStory";
import FilmSection from "@/components/FilmSection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BrandStory />
        <FilmSection />
        {/* P3: 서비스 데모 · 기술 · 시장 · 기관 · 로드맵 · 팀 · FAQ · 마지막 CTA */}
        <section className="h-[40vh]" aria-hidden="true" />
      </main>
    </>
  );
}
