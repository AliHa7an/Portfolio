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
          className="pointer-events-none fixed bottom-0 left-3 z-40 flex items-end md:left-6"
        >
          <GuideBody
            key={section}
            line={GUIDE_LINES[section]}
            quiet={hidden}
            onQuiet={hiddenStore.set}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Remounted for every section. He steps in, says his line, then tucks away
 * into a small button so he never sits on top of what you are reading.
 */
function GuideBody({
  line,
  quiet,
  onQuiet,
}: {
  line: string;
  quiet: boolean;
  onQuiet: (v: boolean) => void;
}) {
  const [reduce] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const end = 12 + line.length + 70;
  const [tick, setTick] = useState(quiet ? end : 0);
  const chimed = useRef(false);
  const { play } = useSound();
  const speaking = tick < end;

  useEffect(() => {
    if (chimed.current || quiet) return;
    chimed.current = true;
    play("chime");
  }, [play, quiet]);

  // One 20fps clock for the typewriter, the pose changes and the idle sway.
  useEffect(() => {
    if (!speaking) return;
    const id = window.setInterval(() => setTick((n) => n + (reduce ? 4 : 1)), 50);
    return () => window.clearInterval(id);
  }, [speaking, reduce]);

  if (!speaking) {
    return (
      <button
        type="button"
        onClick={() => {
          onQuiet(false);
          setTick(0);
        }}
        aria-label="Hear about this section"
        className="pointer-events-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-[1.5px] border-fg bg-sun"
      >
        <span className="flex justify-center pt-1.5">
          <Avatar pose="idle" height={210} plain />
        </span>
      </button>
    );
  }

  const t = tick * 0.05;
  const typed = reduce ? line.length : Math.min(line.length, Math.max(0, tick - 12));
  const talking = typed > 0 && typed < line.length;
  let pose: Pose = "idle";
  if (!reduce && tick <= 24) pose = wavingPose(t);
  else if (talking) pose = talkingPose(t);

  return (
    <>
      <div className="relative shrink-0">
        <div aria-hidden className="absolute left-1/2 top-[12%] aspect-square w-[150%] -translate-x-1/2 rounded-full bg-sun" />
        <Avatar pose={pose} t={reduce ? 0 : t} height="clamp(120px, 24vh, 220px)" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        role="status"
        className="pointer-events-auto relative mb-[clamp(72px,15vh,140px)] ml-3 max-w-[min(62vw,300px)] origin-bottom-left rounded-2xl rounded-bl-md border-[1.5px] border-fg bg-surface px-4 py-3 pr-9 text-[0.95rem] font-medium leading-snug text-fg"
      >
        <span className="sr-only">{line}</span>
        <span aria-hidden>
          {line.slice(0, typed)}
          {talking && <span>▍</span>}
        </span>
        <button
          type="button"
          onClick={() => {
            onQuiet(true);
            setTick(end);
          }}
          aria-label="Stop the guide"
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-muted hover:text-fg"
        >
          <X size={13} />
        </button>
      </motion.div>
    </>
  );
}
