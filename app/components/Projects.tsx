import { ArrowUpRight, Lock } from "lucide-react";
import SectionHeader from "./SectionHeader";

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

export default function Projects() {
  return (
    <section id="projects" className="section bg-surface dark:border-y dark:border-line">
      <div className="container-x">
        <SectionHeader
          title="Selected work"
          description="Products with real users: AI assistants, marketplaces, healthcare platforms and creator tools."
        />
        <ul>
          {projects.map((p) => {
            const live = !p.hideLink && p.url;
            const body = (
              <>
                <div className="md:col-span-4">
                  <h3 className="display text-3xl decoration-sun decoration-[5px] underline-offset-[6px] group-hover:underline md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-muted">{p.category.replace(/ · /g, ", ")}</p>
                </div>
                <div className="md:col-span-6">
                  <p className="max-w-[58ch]">{p.blurb.replace(/ — /g, ": ")}</p>
                  <p className="mt-3 text-muted">{p.tags.join(", ")}</p>
                </div>
                <p className="flex items-start gap-1.5 font-medium md:col-span-2 md:justify-end">
                  {live ? (
                    <>
                      Open site <ArrowUpRight size={18} className="mt-0.5 shrink-0" aria-hidden />
                    </>
                  ) : (
                    <span className="flex items-start gap-1.5 font-normal text-muted">
                      <Lock size={15} className="mt-1 shrink-0" aria-hidden /> Private, under NDA
                    </span>
                  )}
                </p>
              </>
            );
            const row = "group grid transition-[padding] duration-200 hover:md:pl-3 gap-x-8 gap-y-3 border-t border-line-strong py-7 md:grid-cols-12 md:py-9";
            return (
              <li key={p.title} className="rise">
                {live ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className={row}>
                    {body}
                  </a>
                ) : (
                  <div className={row}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
