"use client";
import React from "react";
import { baseSocialLinks } from "@/app/shared/utils/socialBase";
import Button from "@/components/Button";
import Grid from "@/components/grid";
import Image from "next/image";
import { PiGlobe } from "react-icons/pi";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CallToAction() {
  const cvLink = baseSocialLinks.find((link) => link.title === "Curriculum");
  const whatsappLink = baseSocialLinks.find(
    (link) => link.title === "Whatsapp",
  );

  const leftAreaRef = React.useRef<HTMLDivElement>(null);
  const rightAreaRef = React.useRef<HTMLDivElement>(null);
  const globeRef = React.useRef<HTMLDivElement>(null);

  useScrollReveal(leftAreaRef, { direction: "left", duration: 1 });
  useScrollReveal(rightAreaRef, { direction: "right", duration: 1 });
  useScrollReveal(globeRef, { direction: "bottom", duration: 1.2, delay: 0.5 });

  return (
    <section
      className="scroll-mt-header overflow-hidden bg-black py-20 xl:py-28"
      id="contato"
    >
      <Grid className="flex flex-col items-center justify-between gap-10 lg:flex-row">
        <div
          ref={leftAreaRef}
          className="max-w-full flex-1 text-center sm:max-w-[80%] lg:max-w-[36.9375rem] lg:text-left"
        >
          <h2 className="mb-4 text-balance text-4xl/short text-white sm:text-5xl lg:text-6xl">
            Vamos construir algo incrível juntos.
          </h2>
          <p className="mb-10 w-full text-balance text-lg/large text-brand-gray-400 lg:w-96">
            Interfaces responsivas, código limpo e foco total na melhor
            experiência para o usuário.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 md:flex-row lg:justify-start">
            {whatsappLink && (
              <Button
                url={whatsappLink.url}
                icon={whatsappLink.icons.filled}
                variant="filled"
              >
                Entre em contato
              </Button>
            )}
            {cvLink && (
              <Button
                url={cvLink.url}
                icon={cvLink.icons.filled}
                variant="outline"
              >
                Baixe meu CV
              </Button>
            )}
          </div>
        </div>
        <div ref={rightAreaRef} className="relative max-w-[30.5rem] flex-1">
          <div
            ref={globeRef}
            className="absolute -left-12 top-20 hidden h-24 w-24 items-center justify-center rounded-full bg-brand-primary-default dark:bg-white lg:flex"
          >
            <PiGlobe className={"text-black"} size={50} />
          </div>
          <Image
            src="/globe.png"
            alt="Imagem de um globo em wireframe"
            width={488}
            height={488}
          />
        </div>
      </Grid>
    </section>
  );
}
