"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CMDS = [
  {
    cmd: "whoami",
    out: "Ali Hassan  ·  Sr. Full Stack & AI Engineer",
  },
  {
    cmd: "cat .env | grep STATUS",
    out: 'AVAILABLE_FOR_WORK="true"  # open · Q3 2026',
  },
  {
    cmd: "echo $EXPERIENCE",
    out: "7+ yrs  ·  6 companies  ·  11 projects  ·  4 continents",
  },
  {
    cmd: "npm run ship",
    out: "✔  Production build ready",
  },
];

const CHAR_MS = 38;
const POST_CMD_MS = 220;
const POST_OUT_MS = 520;

export default function TerminalWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const started = useRef(false);

  const [lines, setLines] = useState<{ cmd: string; out: string | null }[]>([
    { cmd: "", out: null },
  ]);
  const [blink, setBlink] = useState(true);

  // blinking cursor
  useEffect(() => {
    const iv = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 350;

    CMDS.forEach((item, li) => {
      // type each character
      for (let ci = 1; ci <= item.cmd.length; ci++) {
        const chars = item.cmd.slice(0, ci);
        timers.push(
          setTimeout(() => {
            setLines((prev) => {
              const next = [...prev];
              next[li] = { cmd: chars, out: null };
              return next;
            });
          }, t)
        );
        t += CHAR_MS;
      }

      // reveal output
      t += POST_CMD_MS;
      timers.push(
        setTimeout(() => {
          setLines((prev) => {
            const next = [...prev];
            next[li] = { cmd: item.cmd, out: item.out };
            if (li < CMDS.length - 1) next[li + 1] = { cmd: "", out: null };
            return next;
          });
        }, t)
      );
      t += POST_OUT_MS;
    });

    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const allDone =
    lines.length === CMDS.length && lines[CMDS.length - 1]?.out !== null;

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] font-mono text-xs"
    >
      {/* macOS window chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/8 bg-white/[0.04] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2.5 text-[11px] text-white/25 tracking-wide">
          portfolio — bash
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-5 space-y-2 min-h-[160px]">
        {lines.map((line, i) => (
          <div key={i}>
            <div className="flex items-center gap-2">
              <span className="select-none text-emerald-400/75">❯</span>
              <span className="text-white/85">
                {line.cmd}
                {/* blinking cursor on the active line */}
                {i === lines.length - 1 && line.out === null && (
                  <span
                    className="text-[var(--accent)]"
                    style={{ opacity: blink ? 1 : 0 }}
                  >
                    ▋
                  </span>
                )}
              </span>
            </div>
            {line.out !== null && (
              <div className="pl-5 mt-0.5 text-emerald-400/60">{line.out}</div>
            )}
          </div>
        ))}

        {/* Final idle prompt once all done */}
        {allDone && (
          <div className="flex items-center gap-2">
            <span className="select-none text-emerald-400/75">❯</span>
            <span
              className="text-[var(--accent)]"
              style={{ opacity: blink ? 1 : 0 }}
            >
              ▋
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
