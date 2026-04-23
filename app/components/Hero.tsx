"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowDownRight, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { RevealText } from "./Reveal";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const op = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[100svh] flex items-center pt-32 pb-20"
    >
      <div className="container-x px-5 w-full">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 backdrop-blur-md px-3 py-1.5 text-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-fg-soft">
            Available for new projects · Q3 2026
          </span>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: heading */}
          <motion.div style={{ y, opacity: op }} className="lg:col-span-8">
            <h1 className="font-display text-[14vw] sm:text-7xl md:text-8xl lg:text-[8.5rem] leading-[0.92] tracking-tight font-semibold">
              <RevealText text="Senior" as="span" />
              <br />
              <RevealText text="Full Stack" as="span" />
              <span className="block">
                <span className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block gradient-text"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      delay: 0.55,
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    & AI Engineer
                  </motion.span>
                </span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-8 max-w-xl text-base md:text-lg text-fg-soft leading-relaxed"
            >
              I&apos;m{" "}
              <span className="text-fg font-medium">Ali Hassan</span> — 7+ years
              building production-grade web, mobile, and AI systems for clients
              across the US, UK, Australia, and the Middle East. I architect
              microservices, ship Vapi voice assistants, and turn fuzzy ideas
              into reliable software.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-fg pl-5 pr-2 py-2 text-sm font-medium text-bg btn-shine"
                data-cursor="hover"
              >
                See selected work
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg text-fg transition-transform group-hover:rotate-45">
                  <ArrowDownRight size={16} />
                </span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/40 backdrop-blur px-5 py-3 text-sm font-medium hover:border-accent transition-colors"
                data-cursor="hover"
              >
                Let&apos;s talk
              </a>
              <div className="flex items-center gap-2 ml-1">
                {[
                  { Icon: GithubIcon, href: "https://github.com/AliHa7an" },
                  {
                    Icon: LinkedinIcon,
                    href: "https://www.linkedin.com/in/alihexan/",
                  },
                  { Icon: Mail, href: "mailto:alihexan@gmail.com" },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface/40 backdrop-blur hover:border-accent hover:text-accent transition-colors"
                    data-cursor="hover"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Profile card */}
          <motion.div
            style={{ scale }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/30 via-accent-2/15 to-accent-3/30 blur-2xl opacity-70" />
              <div className="relative rounded-[1.75rem] border border-line-strong bg-surface/70 backdrop-blur-xl p-3 overflow-hidden">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-bg-soft">
                  <Image
                    src="/profile.png"
                    alt="Ali Hassan"
                    fill
                    sizes="(min-width: 1024px) 380px, 80vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                        Currently
                      </div>
                      <div className="text-sm font-medium">
                        FourthD Inc.
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] bg-white/10 backdrop-blur px-2 py-1 rounded-full border border-white/15">
                      <MapPin size={12} />
                      Remote · PK
                    </div>
                  </div>
                </div>

                {/* Identity row */}
                <div className="mt-3 px-1 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display text-lg font-semibold leading-none truncate">
                      Ali Hassan
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted leading-none truncate">
                      Senior Full Stack · AI Engineer
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 rounded-full border border-line bg-bg-soft/60 px-2 py-1 text-[10px] font-mono text-fg-soft">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    OPEN
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 px-1 pb-1">
                  {[
                    { k: "7+", v: "Years" },
                    { k: "6", v: "Companies" },
                    { k: "4", v: "Continents" },
                  ].map((s) => (
                    <div
                      key={s.v}
                      className="rounded-xl border border-line bg-bg-soft/60 px-2.5 py-2 text-center"
                    >
                      <div className="font-display text-lg leading-none font-semibold">
                        {s.k}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mt-1">
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating tags */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 top-12 hidden md:flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-xs shadow-xl"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Next.js · NestJS
              </motion.div>
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-72 hidden md:flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-xs shadow-xl"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-3" />
                Vapi · OpenAI
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-16 hidden md:flex items-center gap-3 text-xs text-muted"
        >
          <span className="h-px w-10 bg-line-strong" />
          <span className="uppercase tracking-[0.3em]">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-accent"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
