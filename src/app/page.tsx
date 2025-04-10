'use client';
import React, { useState, useEffect } from "react";
import CallToAction from "@/components/sections/cta";
import SectionDiferenciais from "@/components/sections/diferenciais";
import SectionHero from "@/components/sections/hero";
import SectionMarquee from "@/components/sections/marquee";
import SectionProjetos from "@/components/sections/projetos";
import SectionSobre from "@/components/sections/sobre";
import { AnimatePresence } from "motion/react";
import PreloaderAnimation from "@/components/Preloader";

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden'; 
    document.body.style.cursor = 'wait';
  
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'auto'; 
      document.body.style.cursor = 'default';
      window.scrollTo(0, 0);
    }, 2000);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <AnimatePresence mode='wait'>
      {isLoading && <PreloaderAnimation />}
    </AnimatePresence>
      <SectionHero />
      <SectionSobre />
      <SectionMarquee />
      <SectionProjetos />
      <SectionDiferenciais />
      <CallToAction />
    </>
  );
}
