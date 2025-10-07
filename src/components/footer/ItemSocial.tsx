import Link from "next/link";
import React from "react";
import { SocialLink } from "@/app/shared/types/types";

type Props = SocialLink;

export default function ItemSocial({ url, icon: Icon, title }: Props) {
  return (
    <Link
      className="group flex items-center gap-3 px-3 py-1"
      href={url}
      target="_blank"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-default transition-all duration-300 group-hover:bg-brand-gray-200">
        <Icon className={"text-black"} size={14} />
      </div>
      <span className="text-sm/short font-medium text-brand-gray-100 transition-colors duration-300 group-hover:text-brand-primary-default">
        {title}
      </span>
    </Link>
  );
}
