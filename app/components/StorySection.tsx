"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Pause, Play, RotateCcw } from "lucide-react";
import { PortfolioStory } from "../story/PortfolioStory";
import { SCENES, STORY_DURATION, STORY_FPS } from "../story/content";
import { useTheme } from "next-themes";
import { useSound, useSpeech } from "./SoundProvider";
import AvatarVideo from "./AvatarVideo";

/** Scroll position 0 maps to this frame: the intro is already on screen. */
const FIRST_FRAME = 50;

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
  const frameRef = useRef(-1);
  const speakTimer = useRef<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [touring, setTouring] = useState(false);
  const [progress, setProgress] = useState(0);
  const { play, say, hush } = useSound();
  const dark = useTheme().resolvedTheme === "dark";
  const voiceNow = useSpeech();
  const narrating = voiceNow.active && SCENES.some((s) => s.line === voiceNow.text);
  const touringRef = useRef(false);
  const [near, setNear] = useState(false);

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
      // Start a little way in, so the stage is never empty when it scrolls into view.
      const frame = Math.round(FIRST_FRAME + p * (STORY_DURATION - 1 - FIRST_FRAME));
      if (frame !== frameRef.current) {
        frameRef.current = frame;
        playerRef.current?.seekTo(frame);
      }
      setProgress(p);
      const idx = SCENES.findIndex((s) => frame < s.from + s.duration);
      if (idx !== -1 && idx !== sceneRef.current) {
        sceneRef.current = idx;
        if (p > 0 && p < 1) {
          play("whoosh");
          // He reads each scene aloud. The short delay skips scenes that are
          // only passing by during a fast scroll.
          window.clearTimeout(speakTimer.current);
          speakTimer.current = window.setTimeout(() => say(SCENES[idx].line), touringRef.current ? 0 : 350);
        }
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
  }, [mounted, reduced, near, scrollRange, play, say]);

  const stopTour = useCallback(() => {
    if (tourRef.current) cancelAnimationFrame(tourRef.current);
    tourRef.current = null;
    if (touringRef.current) hush();
    window.clearTimeout(speakTimer.current);
    touringRef.current = false;
    setTouring(false);
  }, [hush]);

  const startTour = useCallback(
    (fromStart: boolean) => {
      const range = scrollRange();
      if (!range) return;
      const startY = fromStart
        ? range.top
        : Math.min(range.top + range.length, Math.max(range.top, window.scrollY));
      const endY = range.top + range.length;
      const fullMs = ((STORY_DURATION - FIRST_FRAME) / STORY_FPS) * 1000;
      const ms = Math.max(400, ((endY - startY) / range.length) * fullMs);
      const t0 = performance.now();
      touringRef.current = true;
      setTouring(true);
      const startP = (startY - range.top) / range.length;
      const startFrame = FIRST_FRAME + startP * (STORY_DURATION - 1 - FIRST_FRAME);
      const first = SCENES.find((s) => startFrame < s.from + s.duration);
      if (first) say(first.line);
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        window.scrollTo({ top: startY + (endY - startY) * k, behavior: "instant" });
        if (k < 1) tourRef.current = requestAnimationFrame(step);
        else stopTour();
      };
      tourRef.current = requestAnimationFrame(step);
    },
    [scrollRange, stopTour, say]
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

  // Mount the player only when the stage is about to come on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const done = progress > 0.985;
  const size = portrait ? { w: 720, h: 1040 } : { w: 1280, h: 720 };

  const stage = mounted && near ? (
    <Player
      key={`${portrait}-${reduced}`}
      ref={playerRef}
      component={PortfolioStory}
      inputProps={{ dark }}
      durationInFrames={STORY_DURATION}
      fps={STORY_FPS}
      compositionWidth={size.w}
      compositionHeight={size.h}
      controls={reduced}
      loop={false}
      autoPlay={false}
      initialFrame={FIRST_FRAME}
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
      style={{ height: reduced ? "auto" : "400vh" }}
    >
      <div
        className={
          reduced
            ? "px-5 py-24 md:px-8"
            : "sticky top-0 flex h-[100svh] flex-col items-center justify-center px-3 pt-20 pb-5 md:px-8 md:pt-24 md:pb-8"
        }
      >
        <div
          className="relative w-full overflow-hidden rounded-[2rem] border-[1.5px] border-line-strong bg-[#f3f4f6] dark:bg-[#0f1326]"
          style={{
            aspectRatio: `${size.w} / ${size.h}`,
            maxWidth: portrait
              ? `min(100%, calc((100svh - 11rem) * ${size.w / size.h}))`
              : `min(1180px, calc((100svh - 12.5rem) * ${size.w / size.h}))`,
          }}
        >
          {stage}
          {/* Ali, on video, standing at the lower left of the stage. */}
          {mounted && near && (
            <AvatarVideo
              speaking={narrating}
              zoom={1.35}
              className={
                portrait
                  ? "absolute bottom-[4.2%] left-[2.8%] h-[19.5%] w-[21%] rounded-b-2xl rounded-t-full"
                  : "absolute bottom-[5.5%] left-[3.4%] h-[52%] w-[15.6%] rounded-b-3xl rounded-t-full"
              }
            />
          )}
        </div>

        {!reduced && (
          <div className="mt-4 flex w-full max-w-[1180px] items-center gap-4 px-1">
            <button
              type="button"
              onClick={() => (touring ? stopTour() : startTour(done))}
              className="btn btn-primary !py-2.5"
            >
              {touring ? <Pause size={15} aria-hidden /> : done ? <RotateCcw size={15} aria-hidden /> : <Play size={15} fill="currentColor" aria-hidden />}
              {touring ? "Pause" : done ? "Replay" : "Play it for me"}
            </button>
            <p className="text-fg-soft">
              {touring ? "Playing. Scroll to take over." : done ? "That is the end of the tour." : "Scroll to play the tour."}
            </p>
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
