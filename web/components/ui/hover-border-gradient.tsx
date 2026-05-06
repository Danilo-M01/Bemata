"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

const movingMap: Record<Direction, string> = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  LEFT:
    "radial-gradient(16.6% 50% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  BOTTOM:
    "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  RIGHT:
    "radial-gradient(16.2% 50% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
};

const highlight =
  "radial-gradient(75% 180% at 50% 50%, rgba(124, 192, 142, 0.95) 0%, rgba(255, 255, 255, 0) 100%)";

export interface HoverBorderGradientProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children: React.ReactNode;
  containerClassName?: string;
  innerClassName?: string;
  duration?: number;
  clockwise?: boolean;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  innerClassName,
  as: Element = "div",
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = React.useState(false);
  const [direction, setDirection] = React.useState<Direction>("BOTTOM");

  const rotateDirection = React.useCallback(
    (currentDirection: Direction): Direction => {
      const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
      const currentIndex = directions.indexOf(currentDirection);
      const nextIndex = clockwise
        ? (currentIndex - 1 + directions.length) % directions.length
        : (currentIndex + 1) % directions.length;
      return directions[nextIndex]!;
    },
    [clockwise],
  );

  React.useEffect(() => {
    if (hovered) return;
    const interval = setInterval(() => {
      setDirection((prev) => rotateDirection(prev));
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [hovered, duration, rotateDirection]);

  return (
    <Element
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative overflow-visible rounded-2xl transition duration-500",
        containerClassName,
      )}
      {...props}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
        style={{ filter: "blur(2px)" }}
        initial={false}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight, movingMap[direction]]
            : movingMap[direction],
        }}
        transition={{
          ease: "linear",
          duration: hovered ? 0.55 : duration,
        }}
      />
      <div
        className={cn(
          "absolute inset-[3px] z-[2] overflow-hidden rounded-[13px] bg-[#faf8f5]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </Element>
  );
}
