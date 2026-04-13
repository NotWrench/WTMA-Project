"use client";

import { cn } from "@/lib/utils";

interface TactileNoiseProps {
  className?: string;
  opacity?: number;
}

export function TactileNoise({ className, opacity = 0.04 }: TactileNoiseProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden",
        className
      )}
      style={{ opacity }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-100 mix-blend-overlay"
      >
        <filter id="tactile-noise">
          <feTurbulence
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
            type="fractalNoise"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect filter="url(#tactile-noise)" height="100%" width="100%" />
      </svg>
    </div>
  );
}
