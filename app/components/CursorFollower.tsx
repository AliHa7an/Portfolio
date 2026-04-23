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
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const rx = useSpring(x, { stiffness: 600, damping: 30, mass: 0.3 });
  const ry = useSpring(y, { stiffness: 600, damping: 30, mass: 0.3 });

  const vx = useVelocity(x);
  const vy = useVelocity(y);

  const speed = useTransform([vx, vy], ([lx, ly]) =>
    Math.sqrt((lx as number) ** 2 + (ly as number) ** 2)
  );
  const rotation = useTransform([vx, vy], ([lx, ly]) =>
    Math.atan2(ly as number, lx as number) * (180 / Math.PI)
  );
  const stretchX = useTransform(speed, [0, 400, 1200], [1, 2.2, 3.5]);
  const stretchY = useTransform(speed, [0, 400, 1200], [1, 0.55, 0.3]);

  // Spring-based visibility so dot fades out smoothly on hover
  const hoverProgress = useSpring(1, { stiffness: 400, damping: 25 });
  const dotScaleX = useTransform(
    [stretchX, hoverProgress],
    ([sx, hp]) => (sx as number) * (hp as number)
  );
  const dotScaleY = useTransform(
    [stretchY, hoverProgress],
    ([sy, hp]) => (sy as number) * (hp as number)
  );

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    hoverProgress.set(hovering ? 0 : 1);
  }, [hovering, hoverProgress]);

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
      setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 800);
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

  return (
    <>
      {/* Dot — instant follow + velocity stretch + direction rotation */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[60] h-2 w-2 rounded-full"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          background: "var(--accent)",
          mixBlendMode: "difference",
          rotate: rotation,
          scaleX: dotScaleX,
          scaleY: dotScaleY,
        }}
      />

      {/* Ring — spring follow + hover expand + click shrink + color shift */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[60] h-9 w-9 rounded-full border"
        style={{
          x: rx,
          y: ry,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: hovering ? "var(--accent-3)" : "var(--accent)",
          mixBlendMode: "difference",
          backgroundColor: hovering
            ? "color-mix(in oklab, var(--accent-3) 18%, transparent)"
            : "transparent",
          transition: "border-color 0.3s ease, background-color 0.3s ease",
        }}
        animate={{ scale: clicking ? 0.75 : hovering ? 2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="pointer-events-none fixed top-0 left-0 z-[59] rounded-full"
            style={{
              x: r.x,
              y: r.y,
              translateX: "-50%",
              translateY: "-50%",
              border: "1px solid var(--accent)",
            }}
            initial={{ width: 8, height: 8, opacity: 0.9 }}
            animate={{ width: 80, height: 80, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
