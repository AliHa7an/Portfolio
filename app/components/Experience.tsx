"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Reveal";

type Job = {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  stack: string[];
};

const jobs: Job[] = [
  {
    company: "FourthD Inc.",
    role: "Full Stack Developer",
    period: "Jul 2023 — Present",
    location: "Remote",
    bullets: [
      "Lead end-to-end development of scalable web and mobile platforms — owning architecture across diverse client engagements.",
      "Built generative AI features and Vapi-powered conversational bots; custom AI sales assistants lifted lead qualification by 25%+.",
      "Architected microservices in NestJS, Node, TypeScript & Express for modular, independently deployable services.",
      "Cut deployment time from hours to under 15 minutes via Azure DevOps and GitHub Actions pipelines.",
      "Shipped React Native apps to iOS & Android with in-app subscriptions through TestFlight and Play Console.",
    ],
    stack: ["Next.js", "NestJS", "Vapi", "Azure", "AWS", "React Native"],
  },
  {
    company: "HCR International (formerly EdgeLabs)",
    role: "Full Stack Developer",
    period: "Mar 2023 — Oct 2023",
    location: "Remote",
    bullets: [
      "Delivered full-stack web and mobile apps in React, Next.js, React Native (Expo), NestJS, and Node.",
      "Cut API response times 35% with Redis caching and standardized environments via Docker.",
      "Operated services on AWS (EC2, S3, RDS, Lambda) and DigitalOcean; frontends on Vercel and Cloudflare Pages.",
      "Led flagship products including app.miindset.com and influence.network.",
    ],
    stack: ["React", "NestJS", "AWS", "Redis", "Docker", "Cloudflare"],
  },
  {
    company: "EdgeLabs",
    role: "Full Stack Developer",
    period: "Apr 2022 — Mar 2023",
    location: "Remote",
    bullets: [
      "Delivered end-to-end projects in React, Next.js, and NestJS with clean architecture for maintainability.",
      "Built REST and GraphQL APIs against MongoDB, PostgreSQL, and MySQL with Mongoose and Sequelize.",
      "Integrated Stripe for payments and Twilio for SMS / voice; Auth0 + Azure AD for enterprise auth.",
    ],
    stack: ["GraphQL", "PostgreSQL", "MongoDB", "Stripe", "Twilio", "Auth0"],
  },
  {
    company: "Creative Heads",
    role: "Full Stack Developer · Part-Time",
    period: "May 2021 — Apr 2023",
    location: "Remote",
    bullets: [
      "Lead Developer on MERN stack apps, owning frontend and backend with strong test coverage via SonarCloud.",
      "Configured AWS infrastructure and integrated Zoho tools for CRM and business workflows.",
    ],
    stack: ["MongoDB", "Express", "React", "Node.js", "AWS", "Zoho"],
  },
  {
    company: "BitSol Technologies",
    role: "Full Stack Developer",
    period: "Jun 2020 — Apr 2022",
    location: "Islamabad, PK",
    bullets: [
      "Built production apps in Node, NestJS, and React; designed GraphQL APIs for improved data fetching.",
      "Tuned MongoDB and PostgreSQL schemas for read-heavy workloads; configured AWS autoscaling.",
      "Shipped client products: ipgen.io, ahoyoncall.com, and bosss.com.",
    ],
    stack: ["NestJS", "GraphQL", "PostgreSQL", "MongoDB", "AWS"],
  },
  {
    company: "ATechSight",
    role: "Full Stack Developer · Part-Time",
    period: "Jul 2018 — Jun 2020",
    location: "Remote",
    bullets: [
      "Integrated Facebook, Instagram, and Stripe APIs for social auth, media ingestion, and secure payments.",
      "Delivered robust API layers with retry logic supporting app.getspectacle.com.",
    ],
    stack: ["Node.js", "Stripe", "Facebook API", "Instagram API"],
  },
];

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="section">
      <div className="container-x">
        <SectionHeader
          index="03"
          kicker="Experience"
          title="Seven years, six teams, one throughline."
          description="From Islamabad to fully distributed roles for clients across four continents — building, leading, and shipping production software."
        />

        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-line-strong/60" />
          <motion.div
            style={{ height: lineH }}
            className="absolute left-4 md:left-1/2 top-0 w-px bg-linear-to-b from-accent via-accent-2 to-accent-3"
          />

          <ul className="space-y-12 md:space-y-20">
            {jobs.map((job, i) => {
              const left = i % 2 === 0;
              return (
                <li key={job.company} className="relative">
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10"
                  >
                    {i === 0 ? (
                      <span className="relative flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-bg border-2 border-emerald-500 shadow-[0_0_0_4px_color-mix(in_oklab,#22c55e_18%,transparent)]" />
                      </span>
                    ) : (
                      <span className="block h-4 w-4 rounded-full bg-bg border-2 border-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_18%,transparent)]" />
                    )}
                  </motion.div>

                  <div
                    className={`pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${
                      left ? "" : "md:[&>*:first-child]:order-2"
                    }`}
                  >
                    <div
                      className={`hidden md:block ${
                        left ? "md:text-right md:pr-12" : "md:pl-12"
                      }`}
                    >
                      <div className="font-mono text-xs text-accent tracking-wider mb-2">
                        {job.period}
                      </div>
                      <div className="text-sm text-muted">{job.location}</div>
                    </div>
                    <Reveal
                      delay={0.05 * i}
                      className={left ? "md:pl-12" : "md:pr-12 md:text-right"}
                    >
                      <div
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
                        className="card-spotlight rounded-2xl p-6 md:p-8 text-left"
                      >
                        <div className="md:hidden font-mono text-xs text-accent mb-2 tracking-wider">
                          {job.period} · {job.location}
                        </div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-display text-xl md:text-2xl font-semibold">
                            {job.company}
                          </h3>
                          {i === 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-emerald-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Current
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-fg-soft">
                          {job.role}
                        </div>
                        <ul className="mt-5 space-y-3">
                          {job.bullets.map((b, bi) => (
                            <li
                              key={bi}
                              className="flex gap-3 text-sm text-fg-soft leading-relaxed"
                            >
                              <span className="mt-2 inline-block h-1 w-1 rounded-full bg-accent shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {job.stack.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center rounded-full border border-line bg-bg-soft/60 px-2.5 py-1 text-[11px] text-fg-soft"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
