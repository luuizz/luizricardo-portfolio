"use client";
import { dadosDiferencial } from "@/app/shared/utils/data";
import Grid from "@/components/grid";
import React, { useRef } from "react";
import CardDiferencial from "./CardDiferencial";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function SectionDiferenciais() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useScrollReveal(titleRef, { direction: "left", duration: 1.2, delay: 0.5 });
  useScrollReveal(paragraphRef, {
    direction: "right",
    duration: 1,
    delay: 0.5,
  });

  return (
    <section
      id="diferenciais"
      className="scroll-mt-header overflow-hidden py-20 md:py-28"
    >
      <Grid>
        <div className="mb-16 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <h2
            ref={titleRef}
            className="text-5xl text-brand-gray-900 dark:text-brand-gray-100 md:text-4xl/short"
          >
            Meus diferenciais
          </h2>

          <p
            ref={paragraphRef}
            className="w-96 text-base/large text-brand-gray-600 dark:text-brand-gray-300"
          >
            <strong className="font-inter text-brand-gray-900 dark:text-brand-gray-100">
              Transformo design
            </strong>{" "}
            em páginas para a web com agilidade, qualidade e{" "}
            <strong className="font-inter text-brand-gray-900 dark:text-brand-gray-100">
              alta perfomance.
            </strong>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {dadosDiferencial.map((item) => (
            <CardDiferencial key={item.id} {...item} />
          ))}
        </div>
      </Grid>
    </section>
  );
}
