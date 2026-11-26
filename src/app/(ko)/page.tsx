import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/hero/Hero";
import BrandStory from "@/components/story/BrandStory";
import FilmSection from "@/components/FilmSection";
import ServiceSection from "@/components/sections/ServiceSection";
import TechSection from "@/components/sections/TechSection";
import MarketSection from "@/components/sections/MarketSection";
import InstitutionSection from "@/components/sections/InstitutionSection";
import RoadmapSection from "@/components/sections/RoadmapSection";
import TeamSection from "@/components/sections/TeamSection";
import FaqSection from "@/components/sections/FaqSection";
import PromoCta from "@/components/sections/PromoCta";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BrandStory />
        <ServiceSection />
        <FilmSection />
        <TechSection />
        <MarketSection />
        <InstitutionSection />
        <RoadmapSection />
        <TeamSection />
        <FaqSection />
        <PromoCta />
      </main>
      <SiteFooter />
    </>
  );
}
