"use client";

import Image from "next/image";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-line-strong bg-bg/60 backdrop-blur">
      <div className="container-x px-5 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <a
            href="#top"
            className="group flex items-center gap-3 w-fit"
            data-cursor="hover"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface overflow-hidden transition-transform duration-500 group-hover:rotate-360">
              <Image
                src="/icon.png"
                alt="Ali Hassan logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-accent/0 group-hover:ring-accent/40 transition-colors" />
            </span>
            <span className="font-display text-lg font-semibold">
              Ali Hassan<span className="text-accent">.</span>
            </span>
          </a>
          <p className="text-sm text-fg-soft text-center">
            Designed & built end-to-end with{" "}
            <span className="text-fg">Next.js</span>,{" "}
            <span className="text-fg">Framer Motion</span> &{" "}
            <span className="text-fg">Three.js</span>.
          </p>
          <div className="flex items-center md:justify-end gap-2">
            <a
              href="https://github.com/AliHa7an"
              target="_blank"
              rel="noopener"
              data-cursor="hover"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong hover:border-accent hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/alihexan/"
              target="_blank"
              rel="noopener"
              data-cursor="hover"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong hover:border-accent hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={16} />
            </a>
            <a
              href="mailto:alihexan@gmail.com"
              data-cursor="hover"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong hover:border-accent hover:text-accent transition-colors"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted font-mono">
          <span>© {year} Ali Hassan — All rights reserved.</span>
          <span>Crafted in Islamabad, Pakistan.</span>
        </div>
      </div>
    </footer>
  );
}
