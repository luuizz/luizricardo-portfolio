import CallToAction from "@/components/sections/cta";
import SectionDiferenciais from "@/components/sections/diferenciais";
import SectionHero from "@/components/sections/hero";
import SectionMarquee from "@/components/sections/marquee";
import SectionProjetos from "@/components/sections/projetos";
import SectionSobre from "@/components/sections/sobre";

export default function Home() {
  return (
    <>
      <SectionHero />
      <SectionSobre />
      <SectionMarquee />
      <SectionProjetos />
      <SectionDiferenciais />
      <CallToAction />
    </>
  );
}
