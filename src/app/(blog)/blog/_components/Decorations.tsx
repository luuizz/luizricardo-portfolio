// SVG decorative elements for the blog — server-renderable, no JS needed

export function NoiseOverlay({ opacity = 0.025 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="blog-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.7"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#blog-noise)" />
    </svg>
  );
}

export function DotGrid({ className = "" }: { className?: string }) {
  const dots = Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({ row, col })),
  ).flat();
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 160"
      className={`pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {dots.map(({ row, col }) => (
        <circle
          key={`${row}-${col}`}
          cx={col * 20 + 10}
          cy={row * 20 + 10}
          r="1.2"
          fill="#FFD300"
          fillOpacity={0.35}
        />
      ))}
    </svg>
  );
}

export function GradientOrb({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none rounded-full ${className}`}
      style={{
        background: "radial-gradient(circle, rgba(255,211,0,0.12) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

export function YellowUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 260 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
    >
      <path
        d="M2 10 C40 4, 80 14, 120 8 C160 2, 200 12, 258 6"
        stroke="#FFD300"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function DiagonalLines({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={`pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={i}
          x1={i * 20 - 20}
          y1={0}
          x2={i * 20 + 40}
          y2={120}
          stroke="#FFD300"
          strokeOpacity={0.06}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export function CircleDecor({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      <circle cx="100" cy="100" r="98" stroke="#FFD300" strokeOpacity="0.07" strokeWidth="1" />
      <circle cx="100" cy="100" r="72" stroke="#FFD300" strokeOpacity="0.05" strokeWidth="1" />
      <circle cx="100" cy="100" r="48" stroke="#FFD300" strokeOpacity="0.04" strokeWidth="1" />
    </svg>
  );
}
