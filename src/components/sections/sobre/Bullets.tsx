import React from "react";
import { Bullet } from "@/app/shared/types/types";

type DetailsBullet = Bullet;

export default function Bullets({ icon: Icon, title }: DetailsBullet) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-brand-gray-100 px-4 py-3 dark:border-brand-gray-900">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-default">
        <Icon />
      </div>
      <span className="text-sm/short text-brand-gray-700 dark:text-brand-gray-300">
        {title}
      </span>
    </div>
  );
}
