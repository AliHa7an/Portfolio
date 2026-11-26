"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Avatar, type Pose } from "../story/Avatar";

const facts = [
  { term: "Now", detail: "Full stack developer at FourthD Inc." },
  { term: "Based in", detail: "Pakistan, working remotely with teams abroad." },
  { term: "Open to", detail: "Senior full stack and AI engineering roles, fully remote." },
];

export default function Hero() {
  // He waves once when the page opens, and again whenever you point at him.
  const [waving, setWaving] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!waving) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 300);
    const stop = window.setTimeout(() => setWaving(false), 2700);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [waving]);

  const pose: Pose = waving ? (tick % 2 ? "waveLow" : "waveHigh") : "idle";

  return (
    <section id="top" className="relative z-[2] px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
      <div className="container-x grid items-stretch gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <p className="text-lg text-fg-soft">Ali Hassan, senior full stack and AI engineer</p>
            <h1 className="display mt-5 text-[clamp(2.75rem,6.3vw,5.4rem)]">
              I build the product, the backend it runs on, and the AI inside it.
            </h1>
            <p className="mt-7 max-w-[58ch] text-lg text-fg-soft">
              Seven years of production web, mobile and AI work for clients in the US, the UK, Australia and the
              Middle East. React and Next.js up front, Node, NestJS and Python behind, with agents and voice
              assistants on top.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#story" className="btn btn-primary">
                <Play size={16} fill="currentColor" aria-hidden />
                Watch the 40-second tour
              </a>
              <a href="#projects" className="btn btn-quiet">
                See the work
              </a>
            </div>
          </div>

          <dl className="mt-12 grid gap-x-8 gap-y-5 border-t border-line-strong pt-6 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.term}>
                <dt className="text-sm text-muted">{f.term}</dt>
                <dd className="mt-1 font-medium leading-snug">{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div
            className="relative mx-auto h-[420px] max-w-md overflow-hidden rounded-[2rem] bg-sun sm:h-[520px] lg:h-full lg:min-h-[600px] lg:max-w-none"
            onPointerEnter={() => {
              setTick(0);
              setWaving(true);
            }}
          >
            <p className="absolute left-5 top-5 z-10 max-w-[13.5rem] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[0.95rem] font-medium leading-snug text-on-sun shadow-[0_8px_0_rgba(15,26,58,0.12)] md:left-7 md:top-7">
              Hi, I&apos;m Ali. Scroll down and I&apos;ll walk you through my work.
            </p>
            <div className="absolute inset-x-0 top-[14%] flex justify-center">
              <Avatar pose={pose} height="clamp(640px, 78vw, 900px)" plain />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
