import SectionHeader from "./SectionHeader";

const groups = [
  { label: "Frontend", items: ["React", "Next.js", "React Native", "TypeScript", "Redux", "Tailwind CSS", "Material UI", "SSR and SSG"] },
  { label: "Backend", items: ["Node.js", "NestJS", "Express", "MERN stack", "Python", "FastAPI", "GraphQL", "REST", "Microservices", "Event-driven architecture"] },
  { label: "AI agents", items: ["Agentic AI", "AI agents", "OpenAI APIs", "Vapi voice AI", "Custom sales assistants", "Chatbots", "Generative AI features", "Prompt engineering"] },
  { label: "AI automation", items: ["AI workflows", "Python automation", "Claude Code GitHub Actions", "Scheduled pipelines", "Webhooks", "Social API automation"] },
  { label: "AI-assisted development", items: ["Claude Code", "Cursor", "OpenAI Codex", "Agentic coding", "Vibe coding", "AI code review"] },
  { label: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Redis", "Cosmos DB", "DynamoDB", "Prisma", "Sequelize", "Mongoose"] },
  { label: "Cloud and DevOps", items: ["AWS", "Azure", "Docker", "GitHub Actions", "Azure DevOps", "Vercel", "Cloudflare", "DigitalOcean"] },
  { label: "Integrations", items: ["Stripe", "PayPal", "Twilio", "Auth0", "Azure AD", "Apple and Google in-app purchases", "OAuth 2.0"] },
];

export default function Skills() {
  return (
    <section id="skills" className="section bg-surface">
      <div className="container-x">
        <SectionHeader
          title="What I work with"
          description="TypeScript across the stack, Python where it fits, and AI agents, voice and automation built on OpenAI, Vapi and Claude."
        />
        <dl>
          {groups.map((g) => (
            <div key={g.label} className="grid gap-x-8 gap-y-1 border-t border-line py-5 md:grid-cols-12 md:py-6">
              <dt className="font-display text-xl font-bold tracking-tight md:col-span-4">{g.label}</dt>
              <dd className="text-lg text-fg-soft md:col-span-8">{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
