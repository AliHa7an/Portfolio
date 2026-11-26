"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Everything animated or audio-related waits until the page is readable:
 * it loads on the first scroll or tap, or after a short idle, whichever
 * comes first. The first paint carries only text, CSS and one image.
 */
function useAfterFirstPaint(delay = 2200) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    const timer = window.setTimeout(go, delay);
    window.addEventListener("scroll", go, { once: true, passive: true });
    window.addEventListener("pointerdown", go, { once: true, passive: true });
    window.addEventListener("keydown", go, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", go);
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("keydown", go);
    };
  }, [delay]);
  return ready;
}

const storyPlaceholder = <section id="story" style={{ height: "400vh" }} aria-hidden />;

const Story = dynamic(() => import("./StorySection"), { ssr: false, loading: () => storyPlaceholder });
const Guide = dynamic(() => import("./Guide"), { ssr: false });
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });

export function LazyStory() {
  return useAfterFirstPaint() ? <Story /> : storyPlaceholder;
}

export function LazyExtras() {
  if (!useAfterFirstPaint()) return null;
  return (
    <>
      <Guide />
      <CommandPalette />
    </>
  );
}
