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
  skills: "My toolkit. The AI cards are where most of my recent work has been.",
  experience: "Six companies since 2018. Each card shows what I owned and the stack I used.",
  projects: "Real products with real users. The ones with a live link open in a new tab.",
  contact: "That's me. If you have a role or a product in mind, send a message here.",
};
