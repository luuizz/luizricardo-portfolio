"use client";
import React, { useRef } from "react";
import { Diferencial } from "@/app/shared/types/types";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type CardDiferencialProps = Diferencial;

export default function CardDiferencial({
  icon: Icon,
  description,
  title,
}: CardDiferencialProps) {
  const cardsRef = useRef<HTMLDivElement>(null);
  useScrollReveal(cardsRef, { direction: "bottom", duration: 1, stagger: 1 });

  return (
    <div
      ref={cardsRef}
      className="rounded-lg border bg-brand-gray-100 p-8 dark:bg-[#161313]"
    >
      <Icon
        className="fill-white text-[40px] text-white"
        width={40}
        height={40}
      />
      <h3 className="my-4 text-xl/short text-brand-gray-900 dark:text-brand-gray-100">
        {title}
      </h3>
      <p className="text-base/large text-brand-gray-600 dark:text-brand-gray-300">
        {description}
      </p>
    </div>
  );
}
