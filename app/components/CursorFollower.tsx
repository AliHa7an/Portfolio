"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

export default function CursorFollower() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  // Fast spring — ring catches up almost instantly, matching native cursor feel
  const rx = useSpring(x, { stiffness: 1200, damping: 28, mass: 0.08 });
  const ry = useSpring(y, { stiffness: 1200, damping: 28, mass: 0.08 });

  const vx = useVelocity(x);
  const vy = useVelocity(y);

  const speed = useTransform([vx, vy], ([lx, ly]) =>
    Math.sqrt((lx as number) ** 2 + (ly as number) ** 2)
  );
  const rotation = useTransform([vx, vy], ([lx, ly]) =>
    Math.atan2(ly as number, lx as number) * (180 / Math.PI)
  );
  const stretchX = useTransform(speed, [0, 300, 900], [1, 1.7, 2.6]);
  const stretchY = useTransform(speed, [0, 300, 900], [1, 0.65, 0.42]);

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      setEnabled(false);
      return;
    }

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const enter = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('a, button, [data-cursor="hover"]'))
        setHovering(true);
    };
    const leave = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('a, button, [data-cursor="hover"]'))
        setHovering(false);
    };
    const down = (e: MouseEvent) => {
      setClicking(true);
      const id = ++nextId.current;
      setRipples((p) => [...p, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 700);
    };
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", enter);
    window.addEventListener("mouseout", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", enter);
      window.removeEventListener("mouseout", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  // Ring glow: accent on default, accent-3 on hover — CSS transition handles the blend
  const ringGlow = hovering
    ? "0 0 0 1.5px var(--accent-3), 0 0 20px 6px color-mix(in oklab, var(--accent-3) 30%, transparent)"
    : "0 0 0 1.5px var(--accent), 0 0 14px 3px color-mix(in oklab, var(--accent) 22%, transparent)";

  return (
    <>
      {/* Inner dot — instant follow, velocity stretch, double glow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          background: "var(--accent)",
          rotate: rotation,
          scaleX: stretchX,
          scaleY: stretchY,
          // Tight bright core + wider soft halo
          boxShadow:
            "0 0 3px 1px var(--accent), 0 0 10px 4px color-mix(in oklab, var(--accent) 60%, transparent)",
        }}
        animate={{ opacity: hovering ? 0 : 1 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
      />

      {/* Outer ring — glowing border, expands on hover, shrinks on click */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full"
        style={{
          x: rx,
          y: ry,
          translateX: "-50%",
          translateY: "-50%",
          // box-shadow draws the visible ring + ambient glow — background stays transparent
          boxShadow: ringGlow,
          backgroundColor: hovering
            ? "color-mix(in oklab, var(--accent-3) 8%, transparent)"
            : "transparent",
          transition: "box-shadow 0.22s ease, background-color 0.22s ease",
        }}
        initial={{ width: 38, height: 38, opacity: 0.8 }}
        animate={{
          width: clicking ? 26 : hovering ? 62 : 38,
          height: clicking ? 26 : hovering ? 62 : 38,
          opacity: clicking ? 0.3 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
      />

      {/* Click ripples — glowing ring that expands and fades */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="pointer-events-none fixed top-0 left-0 z-[9997] rounded-full"
            style={{
              x: r.x,
              y: r.y,
              translateX: "-50%",
              translateY: "-50%",
              boxShadow: "0 0 0 1px var(--accent)",
            }}
            initial={{ width: 8, height: 8, opacity: 0.8 }}
            animate={{ width: 68, height: 68, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
