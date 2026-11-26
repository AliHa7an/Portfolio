import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { LazyExtras } from "./components/Lazy";

const title = "Ali Hassan, senior full stack and AI engineer";

export const metadata: Metadata = {
  metadataBase: new URL("https://alihexan.com"),
  title,
  description:
    "Ali Hassan builds production web, mobile and AI systems: React, Next.js, NestJS, Python, AI agents and voice assistants. Seven years, six companies, clients on four continents.",
  keywords: [
    "Ali Hassan",
    "Full Stack Developer",
    "AI Engineer",
    "AI Agents",
    "AI Automation",
    "Agentic AI",
    "Claude Code",
    "Python",
    "MERN Stack",
    "Next.js Developer",
    "React Developer",
    "NestJS",
    "TypeScript",
    "Vapi",
    "Node.js",
    "AWS",
    "Remote Developer",
    "Pakistan Developer",
  ],
  authors: [{ name: "Ali Hassan", url: "https://github.com/AliHa7an" }],
  creator: "Ali Hassan",
  icons: {
    icon: [{ url: "/favicon-64.png", type: "image/png", sizes: "64x64" }],
    apple: "/apple-icon-180.png",
  },
  openGraph: {
    title,
    description:
      "Production web, mobile and AI systems. React, Next.js, NestJS, Python, AI agents and voice assistants.",
    type: "website",
    images: [{ url: "/icon.png", width: 800, height: 800, alt: "Ali Hassan" }],
  },
  twitter: {
    card: "summary",
    title,
    description: "Production web, mobile and AI systems. React, Next.js, NestJS, Python, AI agents.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-bg text-fg font-sans">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <LazyExtras />
        </Providers>
      </body>
    </html>
  );
}
