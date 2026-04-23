import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import CursorFollower from "./components/CursorFollower";
import SceneBackground from "./components/SceneBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
  title: "Ali Hassan — Senior Full Stack Developer & AI Engineer",
  description:
    "Portfolio of Ali Hassan — Senior Full Stack Developer & AI Engineer. 7+ years building production-grade web, mobile, and AI systems with React, Next.js, NestJS, AWS, and Vapi.",
  keywords: [
    "Ali Hassan",
    "Full Stack Developer",
    "AI Engineer",
    "Next.js",
    "React",
    "NestJS",
    "Vapi",
    "Portfolio",
  ],
  authors: [{ name: "Ali Hassan", url: "https://github.com/AliHa7an" }],
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Ali Hassan — Senior Full Stack Developer & AI Engineer",
    description:
      "7+ years shipping web, mobile, and AI systems for clients across the US, UK, AU and the Middle East.",
    type: "website",
    images: [{ url: "/icon.png" }],
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
        </Providers>
      </body>
    </html>
  );
}
