import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { ModalState, Projects } from "@/app/shared/types/types";

type ItemProjectProps = Projects & {
  index: number;
  setModal: Dispatch<SetStateAction<ModalState>>;
};

export default function ItemProject({
  title,
  category,
  url,
  setModal,
  index,
}: ItemProjectProps) {
  return (
    <Link
      href={url ?? "#"}
      className="group flex w-full cursor-pointer items-center justify-between gap-10 border-t border-s-neutral-100 px-8 py-14 transition-opacity duration-300 last:border-b hover:opacity-50 dark:border-s-neutral-900 sm:px-14 md:px-20 xl:px-28"
      target="_blank"
      onMouseEnter={() => setModal({ active: true, index })}
      onMouseLeave={() => setModal({ active: false, index })}
    >
      <h3 className="text-2xl/short text-black transition-transform group-hover:-translate-x-3 dark:text-white lg:text-4xl">
        {title}
      </h3>
      <p className="text-balance text-end text-base/short text-brand-gray-700 transition-transform group-hover:translate-x-3 dark:text-brand-gray-300 md:text-lg">
        {category}
      </p>
    </Link>
  );
}
