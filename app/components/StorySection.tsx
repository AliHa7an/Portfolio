"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Pause, Play, RotateCcw } from "lucide-react";
import { PortfolioStory } from "../story/PortfolioStory";
import { SCENES, STORY_DURATION, STORY_FPS } from "../story/content";
import { useSound } from "./SoundProvider";

/**
 * A pinned stage. Scrolling through this tall section scrubs a Remotion
 * composition frame by frame, so the page plays like a film under the
 * visitor's control. "Play the tour" scrolls it for them.
 */
export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const playerRef = useRef<PlayerRef>(null);
  const tourRef = useRef<number | null>(null);
  const sceneRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [touring, setTouring] = useState(false);
  const [progress, setProgress] = useState(0);
  const { play } = useSound();

  useEffect(() => {
    const mqP = window.matchMedia("(max-width: 767px)");
    const mqR = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setPortrait(mqP.matches);
      setReduced(mqR.matches);
      setMounted(true);
    };
    sync();
    mqP.addEventListener("change", sync);
    mqR.addEventListener("change", sync);
    return () => {
      mqP.removeEventListener("change", sync);
      mqR.removeEventListener("change", sync);
    };
  }, []);

  const scrollRange = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return null;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return { top, length: Math.max(1, el.offsetHeight - window.innerHeight) };
  }, []);

  // Scroll position -> frame.
  useEffect(() => {
    if (!mounted || reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const range = scrollRange();
      if (!range) return;
      const p = Math.min(1, Math.max(0, (window.scrollY - range.top) / range.length));
      const frame = Math.round(p * (STORY_DURATION - 1));
      playerRef.current?.seekTo(frame);
      setProgress(p);
      const idx = SCENES.findIndex((s) => frame < s.from + s.duration);
      if (idx !== -1 && idx !== sceneRef.current) {
        sceneRef.current = idx;
        if (p > 0 && p < 1) play("whoosh");
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted, reduced, scrollRange, play]);

  const stopTour = useCallback(() => {
    if (tourRef.current) cancelAnimationFrame(tourRef.current);
    tourRef.current = null;
    setTouring(false);
  }, []);

  const startTour = useCallback(
    (fromStart: boolean) => {
      const range = scrollRange();
      if (!range) return;
      const startY = fromStart
        ? range.top
        : Math.min(range.top + range.length, Math.max(range.top, window.scrollY));
      const endY = range.top + range.length;
      const fullMs = (STORY_DURATION / STORY_FPS) * 1000;
      const ms = Math.max(400, ((endY - startY) / range.length) * fullMs);
      const t0 = performance.now();
      setTouring(true);
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        window.scrollTo({ top: startY + (endY - startY) * k, behavior: "instant" });
        if (k < 1) tourRef.current = requestAnimationFrame(step);
        else stopTour();
      };
      tourRef.current = requestAnimationFrame(step);
    },
    [scrollRange, stopTour]
  );

  // Any manual scroll input hands control back to the visitor.
  useEffect(() => {
    if (!touring) return;
    const cancel = () => stopTour();
    const key = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(e.key)) stopTour();
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchmove", cancel, { passive: true });
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
      window.removeEventListener("keydown", key);
    };
  }, [touring, stopTour]);

  useEffect(() => stopTour, [stopTour]);

  const done = progress > 0.985;
  const size = portrait ? { w: 720, h: 1040 } : { w: 1280, h: 720 };

  const stage = mounted ? (
    <Player
      key={`${portrait}-${reduced}`}
      ref={playerRef}
      component={PortfolioStory}
      durationInFrames={STORY_DURATION}
      fps={STORY_FPS}
      compositionWidth={size.w}
      compositionHeight={size.h}
      controls={reduced}
      loop={false}
      autoPlay={false}
      clickToPlay={reduced}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      initiallyMuted
      acknowledgeRemotionLicense
      style={{ width: "100%", height: "100%" }}
    />
  ) : null;

  return (
    <section
      id="story"
      ref={sectionRef}
      aria-label="Animated tour of Ali Hassan's portfolio"
      className="relative z-[2]"
      style={{ height: reduced ? "auto" : "520vh" }}
    >
      <div
        className={
          reduced
            ? "px-5 py-24 md:px-8"
            : "sticky top-0 flex h-[100svh] flex-col items-center justify-center px-3 pt-20 pb-5 md:px-8 md:pt-24 md:pb-8"
        }
      >
        <div
          className="relative w-full overflow-hidden rounded-3xl border border-line-strong bg-[#07070a] shadow-[0_40px_120px_-30px_rgba(255,122,69,0.35)]"
          style={{
            aspectRatio: `${size.w} / ${size.h}`,
            maxWidth: portrait
              ? `min(100%, calc((100svh - 11rem) * ${size.w / size.h}))`
              : `min(1180px, calc((100svh - 12.5rem) * ${size.w / size.h}))`,
          }}
        >
          {stage}
        </div>

        {!reduced && (
          <div className="mt-4 flex w-full max-w-[1180px] items-center justify-between gap-4 px-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              {touring ? "Playing · scroll to take over" : done ? "End of the tour" : "Scroll to play"}
            </p>
            <button
              type="button"
              data-cursor="hover"
              onClick={() => (touring ? stopTour() : startTour(done))}
              className="group inline-flex items-center gap-2 rounded-full bg-fg py-1.5 pl-4 pr-1.5 text-xs font-medium text-bg btn-shine"
            >
              {touring ? "Pause" : done ? "Replay" : "Play the tour"}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg text-fg">
                {touring ? <Pause size={13} /> : done ? <RotateCcw size={13} /> : <Play size={13} />}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* The same story as text, for screen readers and search engines. */}
      <ol className="sr-only">
        {SCENES.map((s) => (
          <li key={s.id}>{s.line}</li>
        ))}
      </ol>
    </section>
  );
}
