import SectionHeader from "./SectionHeader";

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
  return (
    <section id="experience" className="section">
      <div className="container-x">
        <SectionHeader
          title="Where I've worked"
          description="Six companies since 2018, most recent first."
        />
        <ol>
          {jobs.map((j) => (
            <li key={j.company + j.period} className="rise grid gap-x-8 gap-y-3 border-t border-line-strong py-8 md:grid-cols-12 md:py-10">
              <div className="md:col-span-4">
                <p className="font-medium">{j.period.replace(" — ", " to ")}</p>
                <p className="text-fg-soft">{j.location}</p>
              </div>
              <div className="md:col-span-8">
                <h3 className="display text-3xl md:text-4xl">{j.company}</h3>
                <p className="mt-2 text-lg text-fg-soft">{j.role.replace(" · ", ", ").replace("Part-Time", "part-time")}</p>
                <ul className="mt-5 max-w-[68ch] list-disc space-y-2 pl-5 marker:text-muted">
                  {j.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="mt-5 text-muted">{j.stack.join(", ")}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
