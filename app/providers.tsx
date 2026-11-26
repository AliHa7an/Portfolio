"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { SoundProvider } from "./components/SoundProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Eased wheel scrolling on desktop only. Phones keep native scrolling, which
  // is already smooth, and anyone who asks for reduced motion gets none of it.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    let lenis: { destroy: () => void } | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: true, anchors: true });
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SoundProvider>{children}</SoundProvider>
    </ThemeProvider>
  );
}
