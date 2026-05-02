"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { useRef } from "react";

type Project = {
  title: string;
  blurb: string;
  url: string;
  domain: string;
  tags: string[];
  accent: string;
  category: string;
  hideLink?: boolean;
};

const projects: Project[] = [
  {
    title: "Miindset",
    blurb:
      "Mental well-being product with 24/7 AI-powered support — a comprehensive companion for everyday mental health.",
    url: "",
    domain: "app.miindset.com",
    tags: ["Next.js", "NestJS", "PostgreSQL", "AWS", "AI"],
    accent: "from-rose-500/30 to-orange-400/20",
    category: "AI · Health",
    hideLink: true,
  },
  {
    title: "Lisa Law",
    blurb:
      "AI-powered legal assistant — 24/7 guidance, resources, and ready-to-send notices for everyday users on iOS & Android.",
    url: "https://play.google.com/store/search?q=lisa+law&c=apps",
    domain: "Google Play Store",
    tags: ["React Native", "Node.js", "AI"],
    accent: "from-violet-500/30 to-indigo-400/20",
    category: "AI · Mobile",
  },
  {
    title: "Stadium People Jobs",
    blurb:
      "Event-staffing platform for U.S. stadiums — AI recruitment, mobile shift scheduling, integrated payroll.",
    url: "https://jobs.stadiumpeople.com",
    domain: "jobs.stadiumpeople.com",
    tags: ["React", "Node.js", "AI"],
    accent: "from-emerald-500/30 to-teal-400/20",
    category: "Marketplace",
  },
  {
    title: "Log.Fish",
    blurb:
      "Cross-platform fishing log with one-tap catch logging tied to NOAA conditions and AI-powered insights.",
    url: "https://log.fish",
    domain: "log.fish",
    tags: ["React Native", "Node.js", "NOAA APIs", "AI"],
    accent: "from-sky-500/30 to-cyan-400/20",
    category: "Mobile · AI",
  },
  {
    title: "PNP Community (Careflair)",
    blurb:
      "Australian NDIS directory connecting participants with registered service providers and a community forum. Rebranding to Careflair.",
    url: "https://pnpcommunity.com.au",
    domain: "pnpcommunity.com.au",
    tags: ["Next.js", "NestJS", "PostgreSQL"],
    accent: "from-amber-500/30 to-yellow-400/20",
    category: "Healthcare",
  },
  {
    title: "Seek My Service Admin",
    blurb:
      "Admin interface on the U.S. DoD Defense Travel System (DTA / ROA modules) — managing permissions, profiles, trips, and invoices.",
    url: "",
    domain: "admin-dta.seekmyservice.com",
    tags: ["React", "Node.js", "Enterprise"],
    accent: "from-slate-500/30 to-zinc-400/20",
    category: "Government · Admin",
    hideLink: true,
  },
  {
    title: "Influence Network",
    blurb:
      "Influencer management suite with Chrome extension, React, NestJS, Next.js, PostgreSQL — deployed on AWS Elastic Beanstalk / EC2 / serverless.",
    url: "https://influencenetwork.com/",
    domain: "influencenetwork.com",
    tags: ["React", "NestJS", "Next.js", "AWS"],
    accent: "from-pink-500/30 to-rose-400/20",
    category: "SaaS",
  },
  {
    title: "Vonza",
    blurb:
      "All-in-one platform for creators — courses, digital products, community, funnels, e-commerce, email/SMS, CRM, website builder, AI-powered.",
    url: "https://vonza.com",
    domain: "vonza.com",
    tags: ["Next.js", "Node.js", "AI"],
    accent: "from-fuchsia-500/30 to-purple-400/20",
    category: "Creator SaaS",
  },
  {
    title: "AhoyOnCall",
    blurb:
      "Healthcare communication & telehealth platform for on-demand shifts and provider calls.",
    url: "",
    domain: "ahoyoncall.com",
    tags: ["NestJS", "React", "Twilio"],
    accent: "from-blue-500/30 to-indigo-400/20",
    category: "Healthcare",
    hideLink: true,
  },
  {
    title: "IPGen",
    blurb:
      "Patent lifecycle management platform with social and collaboration features for IP teams.",
    url: "https://ipgen.io/",
    domain: "ipgen.io",
    tags: ["NestJS", "GraphQL", "PostgreSQL"],
    accent: "from-cyan-500/30 to-blue-400/20",
    category: "Legal · SaaS",
  },
  {
    title: "Bosss",
    blurb:
      "Business management and operations solution — workflows, teams, and day-to-day ops in one product.",
    url: "",
    domain: "bosss.com",
    tags: ["Node.js", "MongoDB", "React"],
    accent: "from-orange-500/30 to-amber-400/20",
    category: "Business · SaaS",
    hideLink: true,
  },
];

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-50, 50], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(mx, [-50, 50], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    mx.set(x / 6);
    my.set(y / 6);
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const sharedMotionProps = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] as const },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: { rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: "preserve-3d" as const },
    className: "card-spotlight group relative block rounded-3xl p-7 md:p-8 overflow-hidden",
  };

  const cardInner = (
    <>
      {/* Tinted gradient backdrop */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${p.accent} opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
      />
      {/* Mesh dots */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(var(--line-strong) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 flex h-full flex-col" style={{ transform: "translateZ(40px)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-fg-soft mb-2">
              {p.category}
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight">
              {p.title}
            </h3>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-surface/70 backdrop-blur transition-transform duration-500 ${p.hideLink ? "opacity-40" : "group-hover:rotate-45 group-hover:border-accent group-hover:text-accent"}`}>
            {p.hideLink ? <Lock size={16} /> : <ArrowUpRight size={18} />}
          </div>
        </div>

        <p className="mt-6 text-sm md:text-[15px] text-fg-soft leading-relaxed max-w-md">
          {p.blurb}
        </p>

        <div className="mt-auto pt-8">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-line bg-surface/60 backdrop-blur px-2.5 py-1 text-[11px] font-mono text-fg-soft"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-line">
            <div className="flex items-center gap-2 text-xs text-muted font-mono min-w-0">
              {p.hideLink ? (
                <span className="h-2 w-2 shrink-0 rounded-full bg-muted/50" />
              ) : (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              )}
              <span className="truncate">{p.domain}</span>
            </div>
            {p.hideLink ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted shrink-0">
                <Lock size={11} />
                NDA · Private
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-soft group-hover:text-accent transition-colors shrink-0">
                <span className="relative overflow-hidden">
                  <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                    Visit live
                  </span>
                  <span className="absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-accent">
                    Open site
                  </span>
                </span>
                <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (p.hideLink) {
    return (
      <motion.div ref={ref as React.Ref<HTMLDivElement>} {...sharedMotionProps}>
        {cardInner}
      </motion.div>
    );
  }

  return (
    <motion.a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={p.url}
      target="_blank"
      rel="noopener"
      data-cursor="hover"
      {...sharedMotionProps}
    >
      {cardInner}
    </motion.a>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container-x">
        <SectionHeader
          index="04"
          kicker="Selected work"
          title="Things I've shipped, live in production."
          description="A slice of the projects I've led or built end-to-end. AI products, marketplaces, healthcare platforms, and creator tools — all serving real users today."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
