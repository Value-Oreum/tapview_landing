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
import NotifyCta from "@/components/sections/NotifyCta";
import JsonLd from "@/components/seo/JsonLd";

export default function JaHome() {
  return (
    <>
      <JsonLd lang="ja" />
      <SiteHeader lang="ja" />
      <main>
        <Hero lang="ja" />
        <BrandStory lang="ja" />
        <ServiceSection lang="ja" />
        <FilmSection lang="ja" />
        <TechSection lang="ja" />
        <MarketSection lang="ja" />
        <InstitutionSection lang="ja" />
        <RoadmapSection lang="ja" />
        <TeamSection lang="ja" />
        <FaqSection lang="ja" />
        <NotifyCta />
      </main>
      <SiteFooter lang="ja" />
    </>
  );
}
