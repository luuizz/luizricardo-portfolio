import React from "react";
import { MarqueeItem } from "@/app/shared/types/types";

type ItemMarqueeProps = MarqueeItem;
export default function ItemMarquee({ title, icon: Icon }: ItemMarqueeProps) {
  return (
    <div className="mx-2 flex items-center gap-2 bg-white/50 px-8 py-4 dark:bg-black/50">
      <div className="flex h-8 w-8 items-center justify-center">
        <Icon className="text-3xl text-black dark:text-white" />
      </div>
      <span className="font-poppins text-lg/short text-black dark:text-white">
        {title}
      </span>
    </div>
  );
}
