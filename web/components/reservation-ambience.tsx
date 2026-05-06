"use client";

import Image from "next/image";
import { ImagePlayer } from "@/components/ui/image-player";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const IMAGES = Array.from({ length: 17 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/images/ambience-${n}.webp`;
});

export function ReservationAmbience() {
  return (
    <HoverBorderGradient
      duration={1.1}
      containerClassName="mb-4 h-[min(320px,44vw)] w-full min-h-[min(320px,44vw)]"
      innerClassName="bg-[#faf8f5]"
    >
      <div className="relative h-full w-full">
        <ImagePlayer
          images={IMAGES}
          interval={650}
          loop
          renderImage={(src, index) => (
            <Image
              key={`${index}-${src}`}
              src={src}
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              className="object-cover object-[center_68%]"
              alt="Ambijent i ponuda restorana Bemata"
              priority={index === 0}
            />
          )}
        />
      </div>
    </HoverBorderGradient>
  );
}
