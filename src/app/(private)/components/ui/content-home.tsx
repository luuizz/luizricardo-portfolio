"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ContentDashboardHomeProps {
  showPlaceholders?: boolean;
  children?: React.ReactNode;
}

export default function ContentDashboardHome({
  showPlaceholders = false,
  children,
}: ContentDashboardHomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
    );

    return () => {
      gsap.to(el, { opacity: 0, x: -20, duration: 0.3, ease: "power2.in" });
    };
  }, [pathname]);

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {showPlaceholders ? (
        <>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </>
      ) : (
        children
      )}
    </div>
  );
}
