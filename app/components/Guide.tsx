"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Avatar, wavingPose } from "../story/Avatar";
import { TalkingHead, mouthFor } from "../story/TalkingHead";
import { GUIDE_LINES, SKILL_GROUPS } from "../story/content";
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

type Line = {
  key: string;
  text: string;
  /** The visitor pressed Listen for this line. */
  asked: boolean;
  /** Skills row he is talking about, highlighted while he speaks. */
  row?: string;
  /** Wave hello before speaking (start of a section). */
  wave?: boolean;
};

const markRow = (label: string | null) =>
  window.dispatchEvent(new CustomEvent("guide:row", { detail: { label } }));

/**
 * Ali walks the page with the visitor. At each section he waves, then a
 * close-up of his face says the line with moving lips. In the skills section
 * he goes on to talk through every row.
 */
export default function Guide() {
  const [line, setLine] = useState<Line | null>(null);
  const section = useRef<string | null>(null);
  const hidden = useSyncExternalStore(hiddenStore.subscribe, hiddenStore.get, () => false);
  const { voice } = useSound();

  // Load the mouth shapes before he first speaks.
  useEffect(() => {
    new Image().src = "/avatar/mouths.webp";
  }, []);

  // Which section is on screen. Stays away over the hero and the story stage.
  useEffect(() => {
    const ids = [...Object.keys(GUIDE_LINES), "story", "top"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          section.current = id;
          markRow(null);
          setLine(id in GUIDE_LINES ? { key: id, text: GUIDE_LINES[id], asked: false, wave: true } : null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // A Listen button anywhere on the page can ask him to say a specific line.
  useEffect(() => {
    let n = 0;
    const onSay = (e: Event) => {
      const { text, row } = (e as CustomEvent<{ text: string; row?: string }>).detail ?? {};
      if (!text) return;
      markRow(row ?? null);
      setLine({ key: `asked-${++n}`, text, asked: true, row });
    };
    window.addEventListener("guide:say", onSay);
    return () => window.removeEventListener("guide:say", onSay);
  }, []);

  // After the skills intro he carries on through each row, as long as his
  // voice is on and the visitor is still in the section.
  const next = useCallback(
    (done: Line): boolean => {
      if (done.asked) {
        markRow(null);
        return false;
      }
      const inSkills = section.current === "skills" && (done.key === "skills" || done.key.startsWith("skill:"));
      if (!inSkills || !voice || hiddenStore.get()) {
        markRow(null);
        return false;
      }
      const i = done.key === "skills" ? 0 : Number(done.key.slice(6)) + 1;
      const group = SKILL_GROUPS[i];
      if (!group) {
        markRow(null);
        return false;
      }
      markRow(group.label);
      setLine({ key: `skill:${i}`, text: group.say, asked: false, row: group.label });
      return true;
    },
    [voice]
  );

  return (
    <AnimatePresence>
      {line && (
        <motion.div
          key="guide"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed bottom-4 left-3 z-40 flex items-end gap-3 md:left-6"
        >
          <GuideBody key={line.key} line={line} quiet={hidden && !line.asked} onQuiet={hiddenStore.set} onDone={next} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GuideBody({
  line,
  quiet,
  onQuiet,
  onDone,
}: {
  line: Line;
  quiet: boolean;
  onQuiet: (v: boolean) => void;
  /** Returns true if another line follows straight away. */
  onDone: (line: Line) => boolean;
}) {
  const text = line.text;
  const [reduce] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [narrow] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  /** tick: 20fps clock. pos: the character he has reached. done: line finished. */
  const [frame, setFrame] = useState({ tick: 0, pos: 0, done: false });
  const [tucked, setTucked] = useState(quiet);
  // Live values for the clock; the render only ever reads `frame`.
  const live = useRef({ tick: 0, pos: 0, voiced: false, spoken: false, doneAt: -1, finished: false });
  const started = useRef(false);
  const { say, hush } = useSound();

  const start = useCallback(
    (force: boolean) => {
      const l = live.current;
      l.tick = 0;
      l.pos = 0;
      l.spoken = false;
      l.doneAt = -1;
      l.finished = false;
      l.voiced = say(text, {
        force,
        // Follow the real speech when the browser reports word boundaries.
        onBoundary: (i) => {
          l.pos = i;
        },
        onEnd: () => {
          l.spoken = true;
        },
      });
    },
    [say, text]
  );

  useEffect(() => {
    if (started.current || quiet) return;
    started.current = true;
    start(line.asked);
  }, [start, quiet, line.asked]);

  // One clock drives the caption, his lips, the wave and the hand-off to the next line.
  useEffect(() => {
    if (tucked) return;
    const id = window.setInterval(() => {
      const l = live.current;
      l.tick += 1;
      l.pos = Math.min(text.length, l.pos + 0.8);
      // Finished when the voice ends, or when the caption has run if there is
      // no voice. The timeout covers browsers that never report the end.
      const done = l.voiced ? l.spoken || l.tick > 30 + text.length * 2.2 : l.pos >= text.length;
      if (done && l.doneAt < 0) l.doneAt = l.tick;
      if (done && !l.finished && l.tick - l.doneAt >= 24) {
        l.finished = true;
        if (!onDone(line)) setTucked(true);
      }
      setFrame({ tick: l.tick, pos: l.pos, done });
    }, 50);
    return () => window.clearInterval(id);
  }, [tucked, text.length, onDone, line]);

  const { tick, pos, done } = frame;
  const head = narrow ? 76 : 104;

  if (tucked) {
    return (
      <button
        type="button"
        onClick={() => {
          onQuiet(false);
          setFrame({ tick: 0, pos: 0, done: false });
          setTucked(false);
          start(true);
        }}
        aria-label="Hear Ali on this section"
        className="pointer-events-auto overflow-hidden rounded-full border-[3px] border-sun shadow-[0_6px_0_rgba(15,26,58,0.18)]"
      >
        <TalkingHead mouth="smile" size={narrow ? 56 : 68} />
      </button>
    );
  }

  const talking = !done && pos > 0;
  const shown = done ? text.length : Math.min(text.length, Math.ceil(pos));
  const mouth = talking ? mouthFor(text[Math.min(text.length - 1, Math.floor(pos))]) : "smile";
  const waving = line.wave && !reduce && tick < 22;

  return (
    <>
      {waving ? (
        <div className="relative shrink-0">
          <div aria-hidden className="absolute left-1/2 top-[10%] aspect-square w-[130%] -translate-x-1/2 rounded-full bg-sun" />
          <Avatar pose={wavingPose(tick * 0.05)} t={tick * 0.05} height={narrow ? 150 : 210} />
        </div>
      ) : (
        <div className="shrink-0 overflow-hidden rounded-full border-[4px] border-sun shadow-[0_8px_0_rgba(15,26,58,0.18)]">
          <TalkingHead mouth={mouth} size={head} />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, x: -8 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.25 }}
        role="status"
        className="pointer-events-auto relative mb-3 max-w-[min(64vw,320px)] origin-bottom-left rounded-2xl rounded-bl-md border-[1.5px] border-fg bg-surface px-4 py-3 pr-9 text-[0.95rem] font-medium leading-snug text-fg"
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden>
          {text.slice(0, shown)}
          {talking && <span>▍</span>}
        </span>
        <button
          type="button"
          onClick={() => {
            onQuiet(true);
            hush();
            markRow(null);
            setTucked(true);
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
