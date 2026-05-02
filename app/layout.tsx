import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import CursorFollower from "./components/CursorFollower";
import SceneBackground from "./components/SceneBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import CommandPalette from "./components/CommandPalette";
import ConsoleEgg from "./components/ConsoleEgg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ali Hassan — Senior Full Stack & AI Engineer",
  description:
    "Ali Hassan — Senior Full Stack & AI Engineer with 7+ years building production web, mobile, and AI systems. Expert in React, Next.js, NestJS, TypeScript, AWS, and Vapi voice AI. Available for senior roles and product engagements.",
  keywords: [
    "Ali Hassan",
    "Full Stack Developer",
    "AI Engineer",
    "Next.js Developer",
    "React Developer",
    "NestJS",
    "TypeScript",
    "Vapi",
    "Node.js",
    "AWS",
    "Portfolio",
    "Remote Developer",
    "Pakistan Developer",
  ],
  authors: [{ name: "Ali Hassan", url: "https://github.com/AliHa7an" }],
  creator: "Ali Hassan",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Ali Hassan — Senior Full Stack & AI Engineer",
    description:
      "7+ years shipping production web, mobile, and AI systems for 6 companies across 4 continents. React · Next.js · NestJS · AWS · OpenAI · Vapi.",
    type: "website",
    images: [{ url: "/icon.png", width: 800, height: 800, alt: "Ali Hassan" }],
  },
  twitter: {
    card: "summary",
    title: "Ali Hassan — Senior Full Stack & AI Engineer",
    description:
      "7+ years shipping production web, mobile, and AI systems. React · Next.js · NestJS · AWS · OpenAI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg text-fg font-sans">
        <Providers>
          <SceneBackground />
          <div className="noise" aria-hidden />
          <CursorFollower />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <BackToTop />
          <CommandPalette />
          <ConsoleEgg />
        </Providers>
      </body>
    </html>
  );
}
