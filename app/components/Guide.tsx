"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Avatar, talkingPose, wavingPose, type Pose } from "../story/Avatar";
import { GUIDE_LINES } from "../story/content";
import { useSound } from "./SoundProvider";

const STORE_KEY = "guide-hidden";
const listeners = new Set<() => void>();

const hiddenStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get() {
    try {
      return window.sessionStorage.getItem(STORE_KEY) === "1";
    } catch {
      return false; // Storage can be blocked; the guide simply starts visible.
    }
  },
  set(v: boolean) {
    try {
      window.sessionStorage.setItem(STORE_KEY, v ? "1" : "0");
    } catch {
      // Ignore: the choice just will not persist.
    }
    listeners.forEach((l) => l());
  },
};

/**
 * Ali's avatar walks the page with the visitor: as each section scrolls into
 * view he waves, then explains it in a speech bubble.
 */
export default function Guide() {
  const [section, setSection] = useState<string | null>(null);
  const hidden = useSyncExternalStore(hiddenStore.subscribe, hiddenStore.get, () => false);

  // Which section is on screen. Stays away over the hero and the story stage.
  useEffect(() => {
    const ids = [...Object.keys(GUIDE_LINES), "story", "top"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSection(e.target.id in GUIDE_LINES ? e.target.id : null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {section && (
        <motion.div
          key="guide"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed bottom-0 left-2 z-40 flex items-end gap-1 md:left-5"
        >
          {hidden ? (
            <button
              type="button"
              onClick={() => hiddenStore.set(false)}
              data-cursor="hover"
              aria-label="Show the guide"
              className="pointer-events-auto mb-4 h-14 w-14 overflow-hidden rounded-full border border-line-strong bg-[radial-gradient(circle_at_50%_30%,#ffffff,#c9c3ff_55%,#8a73ff)] shadow-lg"
            >
              <span className="flex justify-center pt-1">
                <Avatar pose="idle" height={190} />
              </span>
            </button>
          ) : (
            <GuideBody key={section} line={GUIDE_LINES[section]} onHide={() => hiddenStore.set(true)} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Remounted for every section, so the wave and the typing restart cleanly. */
function GuideBody({ line, onHide }: { line: string; onHide: () => void }) {
  const [reduce] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [tick, setTick] = useState(0);
  const chimed = useRef(false);
  const { play } = useSound();

  useEffect(() => {
    if (chimed.current) return;
    chimed.current = true;
    play("chime");
  }, [play]);

  // One 20fps clock for the typewriter, the pose changes and the idle sway.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 50);
    return () => window.clearInterval(id);
  }, [reduce]);

  const t = tick * 0.05;
  const typed = reduce ? line.length : Math.min(line.length, Math.max(0, tick - 12));
  const talking = typed > 0 && typed < line.length;
  let pose: Pose = "idle";
  if (!reduce && tick <= 24) pose = wavingPose(t);
  else if (talking) pose = talkingPose(t);

  return (
    <>
      <div className="relative shrink-0">
        <div
          aria-hidden
          className="absolute -inset-x-8 -top-4 bottom-0 rounded-full bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.28),rgba(138,115,255,0.22)_40%,transparent_70%)]"
        />
        <Avatar pose={pose} t={t} height="clamp(120px, 24vh, 220px)" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.35 }}
        role="status"
        className="pointer-events-auto relative mb-[clamp(72px,15vh,140px)] max-w-[min(62vw,300px)] origin-bottom-left rounded-2xl rounded-bl-sm border border-line-strong bg-surface/95 px-4 py-3 pr-9 text-sm leading-snug text-fg shadow-xl backdrop-blur-xl"
      >
        <span className="sr-only">{line}</span>
        <span aria-hidden>
          {line.slice(0, typed)}
          {talking && <span className="text-accent">▍</span>}
        </span>
        <button
          type="button"
          onClick={onHide}
          data-cursor="hover"
          aria-label="Hide the guide"
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-muted hover:text-fg"
        >
          <X size={13} />
        </button>
      </motion.div>
    </>
  );
}
