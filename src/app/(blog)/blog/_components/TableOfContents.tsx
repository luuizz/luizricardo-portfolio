"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "./BlogUtils";
import { List } from "lucide-react";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;
    const targets = headings
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const Inner = () => (
    <ul className="space-y-1.5">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={() => setOpen(false)}
            className={cn(
              "block text-[13px] leading-snug transition-colors duration-150",
              h.level === 2 ? "pl-0" : h.level === 3 ? "pl-3" : "pl-5",
              activeId === h.id
                ? "font-semibold text-brand-primary-default"
                : "text-brand-gray-600 hover:text-brand-gray-200",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <p className="mb-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-gray-600">
            <List className="h-3.5 w-3.5" />
            Neste artigo
          </p>
          <Inner />
        </div>
      </aside>

      {/* Mobile: collapsible pill */}
      <div className="sticky top-[73px] z-30 -mx-4 px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 rounded-xl border border-brand-gray-800 bg-brand-gray-900/95 px-4 py-3 text-sm font-medium text-white backdrop-blur-md"
        >
          <List className="h-4 w-4 text-brand-primary-default" />
          <span className="flex-1 text-left">Índice do artigo</span>
          <span className={cn("text-brand-gray-500 transition-transform", open && "rotate-180")}>
            ↓
          </span>
        </button>
        {open && (
          <div className="rounded-b-xl border border-t-0 border-brand-gray-800 bg-brand-gray-900/95 px-4 pb-4 pt-3 backdrop-blur-md">
            <Inner />
          </div>
        )}
      </div>
    </>
  );
}
