"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Reveal";
import {
  Brain,
  Cloud,
  Code2,
  Database,
  Rocket,
  ShieldCheck,
} from "lucide-react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const dur = 1500;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

const highlights = [
  {
    Icon: Code2,
    title: "Full-Stack Engineering",
    body: "React, Next.js, NestJS, Node, React Native — modular monorepos and clean architecture.",
  },
  {
    Icon: Brain,
    title: "Production AI Systems",
    body: "Vapi voice assistants, OpenAI-powered chatbots, generative AI features that move metrics.",
  },
  {
    Icon: Cloud,
    title: "Cloud Architecture",
    body: "AWS & Azure microservices, infrastructure-as-code, CI/CD that ships in under 15 minutes.",
  },
  {
    Icon: Database,
    title: "Data & APIs",
    body: "PostgreSQL, MongoDB, Redis, GraphQL & REST — schemas tuned for read-heavy workloads.",
  },
  {
    Icon: ShieldCheck,
    title: "Enterprise Auth",
    body: "Auth0 and Azure AD single sign-on, OAuth 2.0 / JWT, hardened against the OWASP top 10.",
  },
  {
    Icon: Rocket,
    title: "Cross-Platform Mobile",
    body: "React Native iOS & Android with in-app subscriptions, TestFlight & Play Console releases.",
  },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <SectionHeader
          index="01"
          kicker="About"
          title="Engineer at the seam of product, AI, and infrastructure."
          description="I work end-to-end — designing systems, shipping the UI, owning the cloud they run on. I prefer real problems with real users over abstractions for their own sake."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-5">
            <div className="rounded-3xl border border-line-strong bg-surface/60 backdrop-blur-xl p-8 md:p-10 sticky top-28">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-display text-5xl font-semibold text-accent">
                    <Counter to={7} suffix="+" />
                  </div>
                  <div className="mt-2 text-sm text-muted uppercase tracking-wider">
                    Years building
                  </div>
                </div>
                <div>
                  <div className="font-display text-5xl font-semibold text-accent-3">
                    <Counter to={6} />
                  </div>
                  <div className="mt-2 text-sm text-muted uppercase tracking-wider">
                    Companies
                  </div>
                </div>
                <div>
                  <div className="font-display text-5xl font-semibold text-accent-2">
                    <Counter to={25} suffix="%" />
                  </div>
                  <div className="mt-2 text-sm text-muted uppercase tracking-wider">
                    Lift in qualified leads
                  </div>
                </div>
                <div>
                  <div className="font-display text-5xl font-semibold">
                    <Counter to={99} suffix=".9%" />
                  </div>
                  <div className="mt-2 text-sm text-muted uppercase tracking-wider">
                    Uptime targets
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-line">
                <p className="text-fg-soft leading-relaxed">
                  Studied Computer Science at{" "}
                  <span className="text-fg under-mark">
                    Quaid-i-Azam University
                  </span>
                  . Now leading distributed teams, integrating Stripe and Twilio,
                  and shipping AI features that customers actually use — not
                  just demo well.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
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
                className="card-spotlight rounded-2xl p-6 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-soft border border-line">
                    <h.Icon
                      size={18}
                      className="text-accent group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="font-mono text-xs text-muted">0{i + 1}</div>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm text-fg-soft leading-relaxed">
                  {h.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
