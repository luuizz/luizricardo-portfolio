"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const params = useSearchParams();
  const active = params.get("categoria") ?? "todos";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
          active === "todos"
            ? "border-brand-primary-default bg-brand-primary-default text-black"
            : "border-brand-gray-800 text-brand-gray-500 hover:border-brand-gray-600 hover:text-white",
        )}
      >
        Todos
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/blog?categoria=${c.slug}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
            active === c.slug
              ? "border-brand-primary-default bg-brand-primary-default text-black"
              : "border-brand-gray-800 text-brand-gray-500 hover:border-brand-gray-600 hover:text-white",
          )}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
