"use client";

import React, { useRef } from "react";
import BadgeIcon from "@/app/assets/BadgeIcon";
import Grid from "@/components/grid";
import Image from "next/image";
import Link from "next/link";
import Bullets from "./Bullets";
import { dadosBullets } from "@/app/shared/utils/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import usePrefersReducedMotion from "@/hooks/usePreferReducedMotion";
import useIsDesktop from "@/hooks/useIsDesktop";

export default function SectionSobre() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const leftAreaRef = useRef<HTMLDivElement>(null);
  const rightAreaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  const disabled = prefersReducedMotion || !isDesktop;

  useScrollReveal(leftAreaRef, { direction: "left", duration: 1, disabled });
  useScrollReveal(rightAreaRef, { direction: "right", duration: 1, disabled });
  useScrollReveal(cardsRef, {
    direction: "bottom",
    duration: 1,
    stagger: 0.2,
    disabled,
  });

  return (
    <section
      id="quem-sou"
      className="scroll-mt-header overflow-hidden bg-white py-16 dark:bg-black sm:py-20 lg:py-28"
    >
      <Grid className="flex flex-col items-center justify-between gap-10 lg:flex-row">
        <div ref={leftAreaRef} className="relative max-w-[29.25rem] flex-1">
          <Image
            src={"/foto-destaque.png"}
            alt="Foto de destaque do Luiz Ricardo"
            width={488}
            height={665}
          />
          <BadgeIcon className="absolute -right-8 top-1/2 hidden -translate-y-1/2 sm:block" />
        </div>
        <div
          ref={rightAreaRef}
          className="max-w-full flex-1 text-center sm:max-w-[80%] lg:max-w-[26.75rem] lg:text-left xl:max-w-[32rem]"
        >
          <h4 className="mb-6 font-inter text-lg/short font-semibold text-black dark:text-white">
            Olá, prazer 👋🏻
          </h4>
          <h2 className="mb-1 text-4xl-short/short text-black dark:text-white">
            Luiz Ricardo
          </h2>
          <h5 className="mb-10 font-inter text-lg/short font-semibold text-black dark:text-white">
            Desenvolvedor Front end
          </h5>
          <p className="mb-6 w-auto text-base/large text-brand-gray-700 dark:text-brand-gray-300 lg:w-[27.125rem]">
            Sou formado em Design Gráfico e trabalho como desenvolvedor
            front-end há 3 anos. Minhas experiências na área de programação me
            fizeram evoluir como profissional, e como consequência do amor pelo
            que faço, desenvolver se tornou meu hobby favorito.
          </p>

          <Link
            className="font-semibold text-brand-gray-800 underline transition-colors duration-300 hover:text-brand-primary-dark dark:text-brand-gray-200"
            href={"https://www.instagram.com/luizricardo.st/"}
            title="Instagram"
            target="_blank"
          >
            @luizricardo.st
          </Link>

          <div className="mt-14 flex flex-wrap justify-center gap-4 lg:justify-start">
            {dadosBullets.map((item) => (
              <Bullets key={item.id} {...item} />
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}
