"use client";
import React, { useState } from "react";
import Grid from "@/components/grid";
import { dadosProjetos } from "@/app/shared/utils/data";
import ItemProject from "./ItemProject";
import ModalProject from "./ModalProject";
import { ModalState } from "@/app/shared/types/types";
import { PiRocketLaunch } from "react-icons/pi";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function SectionProjetos() {
  const [modal, setModal] = useState<ModalState>({ active: false, index: 0 });
  const leftAreaRef = React.useRef<HTMLHeadingElement>(null);
  const rightAreaRef = React.useRef<HTMLDivElement>(null);

  useScrollReveal(leftAreaRef, {
    direction: "left",
    duration: 1.2,
    delay: 0.5,
  });
  useScrollReveal(rightAreaRef, {
    direction: "right",
    duration: 1.2,
    delay: 0.5,
  });

  return (
    <section
      id="projetos"
      className="scroll-mt-header bg-white py-28 dark:bg-black"
    >
      <Grid>
        <div className="mb-10 flex flex-col items-center justify-between gap-8 overflow-hidden text-center md:flex-row md:items-start md:text-left lg:mb-16">
          <h2
            ref={leftAreaRef}
            className="w-auto text-balance text-4xl/short text-brand-gray-900 dark:text-brand-gray-100 sm:w-[28.125rem] sm:text-5xl lg:text-6xl"
          >
            Projetos mais recentes
          </h2>
          <div
            ref={rightAreaRef}
            className="flex flex-col items-center gap-6 md:items-start"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-default/50">
              <PiRocketLaunch className={"dark:fill-black"} size={16} />
            </div>
            <p className="w-full text-base/large text-brand-gray-600 dark:text-brand-gray-200 sm:w-96 xl:text-xl">
              Cada projeto é pensado para gerar impacto real, combinando
              estética, performance e propósito.
            </p>
          </div>
        </div>
        <div className="relative">
          {dadosProjetos.map((item, index) => (
            <ItemProject
              key={index}
              {...item}
              index={index}
              setModal={setModal}
            />
          ))}
        </div>
        <ModalProject modal={modal} projects={dadosProjetos} />
      </Grid>
    </section>
  );
}
