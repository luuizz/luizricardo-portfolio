import React from "react";
import Marquee from "react-fast-marquee";
import ItemMarquee from "./ItemMarquee";
import { dadosMarquee } from "@/app/shared/utils/data";

export default function SectionMarquee() {
  return (
    <section className="bg-brand-primary-default py-6 dark:bg-background">
      <Marquee autoFill={true} speed={20} loop={0}>
        {dadosMarquee.map((item) => (
          <ItemMarquee key={item.id} {...item} />
        ))}
      </Marquee>
    </section>
  );
}
