import type { ReactNode } from "react";

/** Simple, readable layout for legal pages (privacy policy, data deletion). */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-28 pt-36 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
      <div className="mt-12 space-y-10 text-[17px] leading-relaxed text-fg-soft [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_strong]:text-fg [&_ul]:mt-3 [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
