/** Shared timing and copy for the Remotion story and the on-page guide. */

export const STORY_FPS = 30;

export type SceneId =
  | "intro"
  | "numbers"
  | "stack"
  | "ai"
  | "journey"
  | "projects"
  | "cta";

export type Scene = {
  id: SceneId;
  label: string;
  from: number;
  duration: number;
  /** What the avatar says during the scene. */
  line: string;
};

const defs: Omit<Scene, "from">[] = [
  {
    id: "intro",
    label: "Hello",
    duration: 150,
    line: "Hi, I'm Ali Hassan. I build full stack products and AI systems. Here is the short tour.",
  },
  {
    id: "numbers",
    label: "In numbers",
    duration: 150,
    line: "Seven-plus years, six companies, and clients on four continents.",
  },
  {
    id: "stack",
    label: "Stack",
    duration: 180,
    line: "React and Next.js up front. Node, NestJS and Python behind it. AWS and Azure to run it.",
  },
  {
    id: "ai",
    label: "AI",
    duration: 180,
    line: "On the AI side: agents, voice assistants, and automation that runs with no manual steps.",
  },
  {
    id: "journey",
    label: "Journey",
    duration: 210,
    line: "It started in 2018. Today I lead end-to-end builds at FourthD.",
  },
  {
    id: "projects",
    label: "Shipped",
    duration: 180,
    line: "A few things I've shipped, from AI legal help to stadium staffing.",
  },
  {
    id: "cta",
    label: "Next",
    duration: 150,
    line: "That's the short version. Keep scrolling for the detail, or just say hello.",
  },
];

export const SCENES: Scene[] = defs.reduce<Scene[]>((acc, d) => {
  const prev = acc[acc.length - 1];
  acc.push({ ...d, from: prev ? prev.from + prev.duration : 0 });
  return acc;
}, []);

export const STORY_DURATION = SCENES.reduce((n, s) => n + s.duration, 0);

export const STATS = [
  { value: 7, suffix: "+", label: "Years building" },
  { value: 6, suffix: "", label: "Companies" },
  { value: 4, suffix: "", label: "Continents" },
];

export const STACK = [
  { label: "Frontend", items: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "NestJS", "MERN Stack", "Python", "GraphQL"] },
  { label: "Data", items: ["PostgreSQL", "MongoDB", "Supabase", "Redis", "Prisma"] },
  { label: "Cloud", items: ["AWS", "Azure", "Docker", "GitHub Actions", "Vercel"] },
];

export const AI_PILLARS = [
  {
    title: "AI Agents & Voice",
    body: "Vapi voice assistants, OpenAI chatbots and custom sales assistants.",
    proof: "+25% lead qualification",
  },
  {
    title: "AI Automation",
    body: "Scheduled AI workflows that research, write and publish on their own.",
    proof: "Zero manual steps",
  },
  {
    title: "Agentic Development",
    body: "Claude Code, Cursor and OpenAI Codex, with review and tests on every merge.",
    proof: "Reviewed and tested",
  },
];

export const JOURNEY = [
  { year: "2018", company: "ATechSight", note: "Social and payment APIs" },
  { year: "2020", company: "BitSol Technologies", note: "NestJS, GraphQL, AWS" },
  { year: "2021", company: "Creative Heads", note: "Lead on MERN apps" },
  { year: "2022", company: "EdgeLabs", note: "Stripe, Twilio, Auth0" },
  { year: "2023", company: "HCR International", note: "Redis, Docker, flagship apps" },
  { year: "Now", company: "FourthD Inc.", note: "Full stack, mobile and AI" },
];

export const SHIPPED = [
  { title: "Miindset", tag: "AI · Health", color: "#fb7185" },
  { title: "Lisa Law", tag: "AI · Mobile", color: "#8a73ff" },
  { title: "Stadium People", tag: "Marketplace", color: "#34d399" },
  { title: "Log.Fish", tag: "Mobile · AI", color: "#38bdf8" },
  { title: "Careflair", tag: "Healthcare", color: "#ffd166" },
  { title: "Influence Network", tag: "Creator tools", color: "#ff7a45" },
];

/** Lines the floating guide says as each page section scrolls into view. */
export const GUIDE_LINES: Record<string, string> = {
  about: "This is how I work: end to end, from system design to the cloud it runs on.",
  skills: "This is my toolkit. Let me take you through it.",
  services: "You can hire me directly. Websites and stores are a fixed 120 dollars, and I quote AI agents and bots per project.",
  experience: "Six companies since 2018. Each entry shows what I owned and the stack I used.",
  projects: "Real products with real users. The ones with a live link open in a new tab.",
  contact: "That's me. If you have a role or a product in mind, write to me, or message me on WhatsApp.",
};

export const WHATSAPP_NUMBER = "923115427994";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Ask the on-page avatar to say something out loud. */
export function askGuide(text: string, row?: string) {
  window.dispatchEvent(new CustomEvent("guide:say", { detail: { text, row } }));
}

/** What he says when a visitor first interacts with the page. */
export const HERO_INTRO =
  "Hi, I'm Ali Hassan. I build the product, the backend it runs on, and the AI inside it. Scroll down and I will talk you through my work.";

/** Skills table rows, each with the line he speaks about it. */
export const SKILL_GROUPS = [
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
