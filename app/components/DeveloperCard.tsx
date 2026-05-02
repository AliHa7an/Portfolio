"use client";

import { motion } from "framer-motion";

// Tiny span helpers for syntax colouring — no external lib needed
const Kw = ({ children }: { children: string }) => (
  <span className="text-violet-400">{children}</span>
);
const Var = ({ children }: { children: string }) => (
  <span className="text-sky-300">{children}</span>
);
const Key = ({ children }: { children: string }) => (
  <span className="text-sky-200/80">{children}</span>
);
const Str = ({ children }: { children: string }) => (
  <span className="text-emerald-400">{children}</span>
);
const Num = ({ children }: { children: string }) => (
  <span className="text-amber-300">{children}</span>
);
const Bool = ({ children }: { children: string }) => (
  <span className="text-orange-400">{children}</span>
);
const Cm = ({ children }: { children: string }) => (
  <span className="text-white/25 italic">{children}</span>
);
const Op = ({ children }: { children: string }) => (
  <span className="text-white/40">{children}</span>
);

const LINE_DELAY = 0.055;

function CLine({
  children,
  indent = 0,
  i,
}: {
  children: React.ReactNode;
  indent?: number;
  i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, delay: i * LINE_DELAY }}
      className="flex gap-4 leading-6"
    >
      <span className="select-none w-4 text-right text-white/15 shrink-0">
        {i + 1}
      </span>
      <span style={{ paddingLeft: indent * 16 }}>{children}</span>
    </motion.div>
  );
}

export default function DeveloperCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-white/8 bg-white/[0.03]">
        <div className="flex items-center gap-2 border-r border-white/8 bg-white/[0.04] px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-sky-400/60" />
          <span className="text-[11px] font-mono text-white/40">
            developer.ts
          </span>
        </div>
        <span className="px-4 text-[11px] font-mono text-white/20">
          Ali Hassan Portfolio
        </span>
      </div>

      {/* Code */}
      <div className="p-5 font-mono text-[12px] text-white/80 space-y-0">
        <CLine i={0}>
          <Cm>{"// Contact me — I'm open to senior roles & product engagements"}</Cm>
        </CLine>

        <CLine i={1}>
          <Kw>const</Kw> <Var>{" ali"}</Var> <Op>{"= {"}</Op>
        </CLine>

        <CLine i={2} indent={1}>
          <Key>name</Key>
          <Op>{"    : "}</Op>
          <Str>{'"Ali Hassan"'}</Str>
          <Op>,</Op>
        </CLine>

        <CLine i={3} indent={1}>
          <Key>role</Key>
          <Op>{"    : "}</Op>
          <Str>{'"Sr. Full Stack & AI Engineer"'}</Str>
          <Op>,</Op>
        </CLine>

        <CLine i={4} indent={1}>
          <Key>years</Key>
          <Op>{"   : "}</Op>
          <Num>7</Num>
          <Op>,</Op>
          <Cm>{"  // of production experience"}</Cm>
        </CLine>

        <CLine i={5} indent={1}>
          <Key>open</Key>
          <Op>{"    : "}</Op>
          <Bool>true</Bool>
          <Op>,</Op>
          <Cm>{"  // available Q3 2026"}</Cm>
        </CLine>

        <CLine i={6} indent={1}>
          <Key>stack</Key>
          <Op>{"   : {"}</Op>
        </CLine>

        <CLine i={7} indent={2}>
          <Key>fe</Key>
          <Op>{"    : "}</Op>
          <Op>{"["}</Op>
          <Str>"React"</Str>
          <Op>, </Op>
          <Str>"Next.js"</Str>
          <Op>, </Op>
          <Str>"TypeScript"</Str>
          <Op>{"],"}</Op>
        </CLine>

        <CLine i={8} indent={2}>
          <Key>be</Key>
          <Op>{"    : "}</Op>
          <Op>{"["}</Op>
          <Str>"NestJS"</Str>
          <Op>, </Op>
          <Str>"Node.js"</Str>
          <Op>, </Op>
          <Str>"GraphQL"</Str>
          <Op>{"],"}</Op>
        </CLine>

        <CLine i={9} indent={2}>
          <Key>cloud</Key>
          <Op>{" : "}</Op>
          <Op>{"["}</Op>
          <Str>"AWS"</Str>
          <Op>, </Op>
          <Str>"Azure"</Str>
          <Op>, </Op>
          <Str>"Docker"</Str>
          <Op>{"],"}</Op>
        </CLine>

        <CLine i={10} indent={2}>
          <Key>ai</Key>
          <Op>{"    : "}</Op>
          <Op>{"["}</Op>
          <Str>"OpenAI"</Str>
          <Op>, </Op>
          <Str>"Vapi"</Str>
          <Op>, </Op>
          <Str>"LLMs"</Str>
          <Op>{"],"}</Op>
        </CLine>

        <CLine i={11} indent={1}>
          <Op>{"}"}</Op>
          <Op>,</Op>
        </CLine>

        <CLine i={12} indent={1}>
          <Key>email</Key>
          <Op>{"   : "}</Op>
          <Str>{'"alihexan@gmail.com"'}</Str>
          <Op>,</Op>
        </CLine>

        <CLine i={13}>
          <Op>{"}"}</Op>{" "}
          <Kw>satisfies</Kw> <Var>Developer</Var>
        </CLine>
      </div>
    </div>
  );
}
