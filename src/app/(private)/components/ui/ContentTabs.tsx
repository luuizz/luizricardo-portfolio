"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: React.ReactNode;
}

interface ContentTabsProps {
  tabs: Tab[];
  panels: Record<string, React.ReactNode>;
  defaultTab?: string;
  className?: string;
}

export function ContentTabs({ tabs, panels, defaultTab, className }: ContentTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const [animKey, setAnimKey] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const idx = tabs.findIndex((t) => t.id === active);
    const el = tabRefs.current[idx];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active, tabs]);

  // Measure on mount
  useEffect(() => {
    const idx = tabs.findIndex((t) => t.id === active);
    const el = tabRefs.current[idx];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(id: string) {
    if (id === active) return;
    setActive(id);
    setAnimKey((k) => k + 1);
  }

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {/* Tab bar */}
      <div className="relative border-b">
        <div className="flex">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              onClick={() => handleChange(tab.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors duration-150",
                active === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Sliding indicator */}
        <div
          className="absolute bottom-0 h-0.5 rounded-full bg-primary transition-all duration-200 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      {/* Panel — key forces remount for animation */}
      <div
        key={animKey}
        className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200 pt-5"
      >
        {panels[active]}
      </div>
    </div>
  );
}
