"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Element01 from "@/app/assets/Element";
import Element02 from "@/app/assets/Element02";
import Grid from "@/components/grid";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Slider from "./Slider";
import usePrefersReducedMotion from "@/hooks/usePreferReducedMotion";
import ArrowCta from "@/app/assets/ArrowCta";
import AvatarLogo from "@/app/assets/AvatarLogo";

export default function SectionHero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const areaTextRef = useRef<HTMLDivElement>(null);
  const circleAvatarRef = useRef<HTMLImageElement>(null);
  const circleLogoRef = useRef<SVGSVGElement>(null);
  const areaImagesRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 1024);
    }
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion || !isDesktop) return;
    const elements = [
      { ref: areaTextRef, xFrom: -20 },
      { ref: circleAvatarRef, xFrom: -30 },
      { ref: circleLogoRef, xFrom: 30 },
      { ref: areaImagesRef, xFrom: 30 },
    ];

    const tl = gsap.timeline();

    elements.forEach((el, i) => {
      if (el.ref.current) {
        tl.fromTo(
          el.ref.current,
          { opacity: 0, x: el.xFrom },
          { opacity: 1, x: 0, duration: 1 },
          i === 0 ? "start" : ">-1",
        );
      }
    });
  }, [prefersReducedMotion, isDesktop]);

  return (
    <section className="-mt-28 overflow-hidden bg-black py-40 lg:py-56">
      <Grid>
        <main className="flex flex-col items-center justify-between gap-10 lg:flex-row">
          <div
            className="max-w-full flex-1 text-center sm:max-w-3xl lg:max-w-[645px] lg:text-left"
            ref={areaTextRef}
          >
            <span className="font-poppins text-base/short font-medium tracking-widest text-brand-gray-200">
              Olá, eu sou{" "}
              <strong className="font-semibold text-white">Luiz Ricardo</strong>{" "}
              👋🏻
            </span>

            <h1 className="mb-4 mt-6 text-4xl/short text-brand-gray-100 sm:text-5xl xl:text-6xl">
              Especialista
              <div className="mx-3 inline-flex align-middle">
                <Image
                  className="h-14 w-14"
                  src="/foto_luiz.png"
                  alt="Foto do Luiz Ricardo"
                  width={56}
                  height={56}
                  ref={circleAvatarRef}
                />
                <AvatarLogo className="-ml-2 h-14 w-14" ref={circleLogoRef} />
              </div>
              em Desenvolvimento Front-end
            </h1>
            <p className="mb-10 w-auto text-balance text-lg/large text-brand-gray-500 sm:mb-16 lg:w-[32.5rem]">
              Trabalhei em diversos projetos front-end, desde pequenos websites
              até lojas virtuais. Essa experiência prática me permitiu
              desenvolver habilidades que me ajudam a criar soluções eficientes
              e eficazes.
            </p>

            <Link
              className="group flex items-center justify-center gap-4 p-2 lg:justify-start"
              href="/#contato"
            >
              <span className="!font-poppins text-lg/short font-semibold text-brand-gray-100 underline transition-colors duration-300 group-hover:text-brand-primary-default">
                Vamos conversar?
              </span>
              <ArrowCta className="transition-transform duration-300 group-hover:rotate-180" />
            </Link>
          </div>
          <div
            className="relative max-w-[90%] flex-1 sm:max-w-[480px] xl:max-w-[520px]"
            ref={areaImagesRef}
          >
            <Element01 className="absolute -right-16 bottom-28 z-10 hidden sm:block" />
            <Element02 className="absolute -left-20 top-16 z-10 hidden sm:block" />
            <Slider />
          </div>
        </main>
      </Grid>
    </section>
  );
}
