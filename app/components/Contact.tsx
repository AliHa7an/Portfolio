"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Reveal";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const channels = [
  {
    Icon: Mail,
    label: "Email",
    value: "alihexan@gmail.com",
    href: "mailto:alihexan@gmail.com",
  },
  {
    Icon: Phone,
    label: "Phone",
    value: "+92 311 542 7994",
    href: "tel:+923115427994",
  },
  {
    Icon: GithubIcon,
    label: "GitHub",
    value: "AliHa7an",
    href: "https://github.com/AliHa7an",
  },
  {
    Icon: LinkedinIcon,
    label: "LinkedIn",
    value: "alihexan",
    href: "https://www.linkedin.com/in/alihexan/",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <SectionHeader
          index="05"
          kicker="Contact"
          title="Have an idea? Let's build it together."
          description="Open to senior full-stack and AI engineer roles, contracting, and ambitious product engagements. Fastest reply by email."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Big CTA card */}
          <Reveal className="lg:col-span-7">
            <a
              href="mailto:alihexan@gmail.com"
              data-cursor="hover"
              onMouseMove={(e) => {
                const r = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                (e.currentTarget as HTMLElement).style.setProperty(
                  "--mx",
                  `${e.clientX - r.left}px`
                );
                (e.currentTarget as HTMLElement).style.setProperty(
                  "--my",
                  `${e.clientY - r.top}px`
                );
              }}
              className="card-spotlight group relative block rounded-3xl p-8 md:p-14 overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 60%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--accent-3) 25%, transparent), transparent 60%)",
                }}
              />
              <div className="relative z-10">
                <div className="text-xs uppercase tracking-[0.3em] text-fg-soft mb-4">
                  Let&apos;s talk
                </div>
                <motion.h3
                  initial={{ opacity: 0.6 }}
                  whileHover={{ letterSpacing: "-0.02em" }}
                  className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[0.95]"
                >
                  alihexan
                  <br />
                  <span className="gradient-text">@gmail.com</span>
                </motion.h3>
                <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 backdrop-blur px-5 py-3 text-sm font-medium group-hover:border-accent transition-colors">
                  Send a message
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:rotate-45"
                  />
                </div>
              </div>
              {/* Floating orb */}
              <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-accent to-accent-3 opacity-20 blur-3xl float-soft" />
            </a>
          </Reveal>

          {/* Channels */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.06}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  data-cursor="hover"
                  onMouseMove={(e) => {
                    const r = (
                      e.currentTarget as HTMLElement
                    ).getBoundingClientRect();
                    (e.currentTarget as HTMLElement).style.setProperty(
                      "--mx",
                      `${e.clientX - r.left}px`
                    );
                    (e.currentTarget as HTMLElement).style.setProperty(
                      "--my",
                      `${e.clientY - r.top}px`
                    );
                  }}
                  className="card-spotlight group block h-full rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-soft border border-line">
                      <c.Icon size={16} className="text-accent" />
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-muted transition-all group-hover:text-accent group-hover:rotate-45"
                    />
                  </div>
                  <div className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">
                    {c.label}
                  </div>
                  <div className="mt-1.5 font-display text-base font-medium break-all">
                    {c.value}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
