"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { Reveal } from "./Reveal";

type Group = {
  label: string;
  items: string[];
};

const groups: Group[] = [
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "React Native",
      "TypeScript",
      "Redux",
      "Tailwind CSS",
      "Material UI",
      "SSR / SSG",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "GraphQL",
      "REST",
      "Microservices",
      "Event-Driven",
      "Prisma",
    ],
  },
  {
    label: "Databases",
    items: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Redis",
      "Cosmos DB",
      "DynamoDB",
      "Sequelize",
      "Mongoose",
    ],
  },
  {
    label: "Cloud & DevOps",
    items: [
      "AWS",
      "Azure",
      "Docker",
      "GitHub Actions",
      "Azure DevOps",
      "Vercel",
      "Cloudflare",
      "DigitalOcean",
    ],
  },
  {
    label: "AI",
    items: [
      "OpenAI APIs",
      "Vapi Voice AI",
      "Custom Sales AI",
      "Chatbots",
      "Generative AI",
      "Prompt Engineering",
    ],
  },
  {
    label: "Integrations",
    items: [
      "Stripe",
      "PayPal",
      "Twilio",
      "Auth0",
      "Azure AD",
      "Apple IAP",
      "Google IAP",
      "OAuth 2.0",
    ],
  },
];

const marquee = [
  "React",
  "Next.js",
  "TypeScript",
  "NestJS",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Azure",
  "Docker",
  "Vapi",
  "OpenAI",
  "React Native",
  "Tailwind",
  "Stripe",
  "Auth0",
  "Redis",
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container-x">
        <SectionHeader
          index="02"
          kicker="Toolkit"
          title="Modern stack, picked for what actually ships."
          description="Languages and tools I reach for daily. Deep on TypeScript, the React/Next ecosystem, NestJS on the server, and the Vapi/OpenAI side of the AI stack."
        />

        {/* Marquee */}
        <div className="relative mb-16">
          <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-bg to-transparent z-10 pointer-events-none" />
          <div className="overflow-hidden">
            <div className="flex marquee-track gap-4 whitespace-nowrap py-3">
              {[...marquee, ...marquee].map((m, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 backdrop-blur px-5 py-2 text-sm font-medium"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        i % 3 === 0
                          ? "var(--accent)"
                          : i % 3 === 1
                          ? "var(--accent-2)"
                          : "var(--accent-3)",
                    }}
                  />
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g, gi) => (
            <Reveal key={g.label} delay={gi * 0.05}>
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
                className="card-spotlight rounded-2xl p-6 h-full"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-lg font-semibold">
                    {g.label}
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    {g.items.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it, i) => (
                    <motion.span
                      key={it}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.03 }}
                      className="inline-flex items-center rounded-full border border-line bg-bg-soft/60 px-3 py-1 text-xs text-fg-soft hover:border-accent hover:text-fg transition-colors"
                    >
                      {it}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
