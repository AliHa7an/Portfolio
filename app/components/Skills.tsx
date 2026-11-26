"use client";

import { Volume2 } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { askGuide } from "../story/content";

const groups = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "React Native", "TypeScript", "Redux", "Tailwind CSS", "Material UI", "SSR and SSG"],
    say: "On the front end I build with React and Next.js, and React Native for mobile apps, all in TypeScript.",
  },
  {
    label: "Backend",
    items: ["Node.js", "NestJS", "Express", "MERN stack", "Python", "FastAPI", "GraphQL", "REST", "Microservices", "Event-driven architecture"],
    say: "On the back end I use Node, NestJS and the MERN stack, with Python and FastAPI where it fits.",
  },
  {
    label: "AI agents and bots",
    items: ["AI agents", "Agentic AI", "AI chatbots", "WhatsApp bots", "Vapi voice assistants", "Custom sales assistants", "OpenAI APIs", "Generative AI features", "Prompt engineering"],
    say: "I build AI agents, chatbots, WhatsApp bots and voice assistants. One sales assistant I built lifted lead qualification by more than twenty five percent.",
  },
  {
    label: "AI automation",
    items: ["AI workflows", "Python automation", "Claude Code GitHub Actions", "Scheduled pipelines", "Webhooks", "Social API automation"],
    say: "I set up AI workflows that run on a schedule and do the work themselves, with no manual steps.",
  },
  {
    label: "AI-assisted development",
    items: ["Claude Code", "Cursor", "OpenAI Codex", "Agentic coding", "Vibe coding", "AI code review"],
    say: "I work with Claude Code, Cursor and Codex every day, and I still review and test everything before it ships.",
  },
  {
    label: "Websites and stores",
    items: ["Portfolio sites", "Business websites", "Shopify", "WooCommerce", "WordPress", "Strapi"],
    say: "I build portfolio sites, business websites, and Shopify and WooCommerce stores.",
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Redis", "Cosmos DB", "DynamoDB", "Prisma", "Sequelize", "Mongoose"],
    say: "For data I use PostgreSQL, MongoDB, Supabase and Redis, and I tune schemas for heavy read traffic.",
  },
  {
    label: "Cloud and DevOps",
    items: ["AWS", "Azure", "Docker", "GitHub Actions", "Azure DevOps", "Vercel", "Cloudflare", "DigitalOcean"],
    say: "I run things on AWS and Azure with Docker, and pipelines that deploy in under fifteen minutes.",
  },
  {
    label: "Integrations",
    items: ["Stripe", "PayPal", "Twilio", "Auth0", "Azure AD", "Apple and Google in-app purchases", "OAuth 2.0"],
    say: "I connect payments with Stripe and PayPal, messaging with Twilio, and single sign-on with Auth0 and Azure AD.",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section bg-surface">
      <div className="container-x">
        <SectionHeader
          title="What I work with"
          description="TypeScript across the stack, Python where it fits, and AI agents, bots and automation built on OpenAI, Vapi and Claude. Press Listen and I'll tell you about any of it."
        />
        <dl>
          {groups.map((g) => (
            <div key={g.label} className="rise grid items-start gap-x-8 gap-y-1 border-t border-line py-5 md:grid-cols-12 md:py-6">
              <dt className="font-display text-xl font-bold tracking-tight md:col-span-4">{g.label}</dt>
              <dd className="text-lg text-fg-soft md:col-span-6">{g.items.join(", ")}</dd>
              <dd className="mt-2 md:col-span-2 md:mt-0 md:justify-self-end">
                <button
                  type="button"
                  onClick={() => askGuide(g.say)}
                  className="btn btn-quiet !gap-2 !px-3 !py-2 !text-[0.95rem]"
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
