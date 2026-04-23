"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight whichever section is crossing the viewport's middle band
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry currently most "active" (closest to top of band, intersecting)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Fires when section crosses the middle band of the viewport
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="container-x px-5 py-4">
        <nav
          className={`flex items-center justify-between gap-4 rounded-full border px-4 py-2.5 transition-all duration-500 ${
            scrolled
              ? "border-line-strong bg-surface/70 backdrop-blur-2xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.35)]"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link
            href="#top"
            onClick={() => setActiveId("")}
            className="group flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight"
            data-cursor="hover"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface overflow-hidden transition-transform duration-500 group-hover:rotate-360">
              <Image
                src="/icon.png"
                alt="Ali Hassan logo"
                width={36}
                height={36}
                priority
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-accent/0 group-hover:ring-accent/40 transition-colors" />
            </span>
            <span className="hidden sm:inline">
              Ali Hassan<span className="text-accent">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = activeId === l.id;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={`relative px-3.5 py-2 text-sm transition-colors ${
                    active ? "text-fg" : "text-fg-soft hover:text-fg"
                  }`}
                  data-cursor="hover"
                  aria-current={active ? "true" : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full border border-line-strong bg-bg-soft/80 backdrop-blur"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {active && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    {l.label}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/Ali_Hassan_Resume.pdf"
              download="Ali_Hassan_Resume.pdf"
              className="group hidden sm:inline-flex items-center gap-2 rounded-full bg-fg pl-4 pr-1.5 py-1.5 text-xs font-medium text-bg btn-shine"
              data-cursor="hover"
              aria-label="Download Ali Hassan's resume"
            >
              Resume
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-bg text-fg overflow-hidden">
                <Download
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-y-3.5"
                />
                <Download
                  size={13}
                  className="absolute -translate-y-3.5 transition-transform duration-300 group-hover:translate-y-0 text-accent"
                  aria-hidden
                />
              </span>
            </a>
            <ThemeToggle />
            <button
              aria-label="Open menu"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface/60 backdrop-blur"
              onClick={() => setOpen(true)}
              data-cursor="hover"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="absolute inset-x-0 top-0 bg-surface border-b border-line-strong px-6 pt-6 pb-10"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-semibold">
                  Menu
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong"
                  data-cursor="hover"
                >
                  <X size={18} />
                </button>
              </div>
              <ul className="mt-8 flex flex-col gap-1">
                {links.map((l, i) => {
                  const active = activeId === l.id;
                  return (
                    <motion.li
                      key={l.id}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.05 * i, duration: 0.4 }}
                    >
                      <a
                        href={`#${l.id}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 py-3 font-display text-3xl font-medium tracking-tight transition-colors ${
                          active ? "text-fg" : "text-fg-soft"
                        }`}
                      >
                        {active && (
                          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                        )}
                        {l.label}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
              <a
                href="/Ali_Hassan_Resume.pdf"
                download="Ali_Hassan_Resume.pdf"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg btn-shine"
              >
                <Download size={16} />
                Download Resume
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
