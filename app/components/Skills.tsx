"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { SKILL_GROUPS, askGuide } from "../story/content";

export default function Skills() {
  // The row he is currently talking about.
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onRow = (e: Event) => {
      const label = (e as CustomEvent<{ label: string | null }>).detail?.label ?? null;
      setActive(label);
      if (!label) return;
      // Keep the row he is talking about on screen, without moving it if it already is.
      const row = document.querySelector<HTMLElement>(`[data-skill="${label}"]`);
      const r = row?.getBoundingClientRect();
      if (r && (r.top < 90 || r.bottom > window.innerHeight - 140)) {
        row?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    };
    window.addEventListener("guide:row", onRow);
    return () => window.removeEventListener("guide:row", onRow);
  }, []);

  return (
    <section id="skills" className="section bg-surface">
      <div className="container-x">
        <SectionHeader
          title="What I work with"
          description="TypeScript across the stack, Python where it fits, and AI agents, bots and automation built on OpenAI, Vapi and Claude. I'll talk you through each row, or press Listen on the one you care about."
        />
        <dl>
          {SKILL_GROUPS.map((g) => (
            <div
              key={g.label}
              data-skill={g.label}
              className={`rise grid items-start gap-x-8 gap-y-1 border-t border-line px-3 py-5 transition-colors duration-300 md:-mx-3 md:grid-cols-12 md:py-6 ${
                active === g.label ? "bg-sun text-on-sun" : ""
              }`}
            >
              <dt className="font-display text-xl font-bold tracking-tight md:col-span-4">{g.label}</dt>
              <dd className={`text-lg md:col-span-6 ${active === g.label ? "" : "text-fg-soft"}`}>
                {g.items.join(", ")}
              </dd>
              <dd className="mt-2 md:col-span-2 md:mt-0 md:justify-self-end">
                <button
                  type="button"
                  onClick={() => askGuide(g.say, g.label)}
                  className={`btn btn-quiet !gap-2 !px-3 !py-2 !text-[0.95rem] ${active === g.label ? "!border-on-sun" : ""}`}
                  aria-label={`Listen to Ali on ${g.label}`}
                >
                  <Volume2 size={16} aria-hidden />
                  Listen
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
