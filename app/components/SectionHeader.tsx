"use client";

import { Reveal, RevealText } from "./Reveal";

export default function SectionHeader({
  index,
  kicker,
  title,
  description,
}: {
  index: string;
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-14 md:mb-20 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
      <Reveal className="md:col-span-7">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted mb-5">
          <span className="font-mono text-accent">{index}</span>
          <span className="h-px w-12 bg-line-strong" />
          <span>{kicker}</span>
        </div>
        <RevealText
          as="h2"
          text={title}
          className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight font-semibold"
        />
      </Reveal>
      {description && (
        <Reveal delay={0.2} className="md:col-span-5">
          <p className="text-fg-soft text-base md:text-lg leading-relaxed max-w-md md:ml-auto">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
