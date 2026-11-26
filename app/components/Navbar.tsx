"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SoundToggle } from "./SoundProvider";

const links = [
  { id: "story", label: "Tour" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mark the section crossing the middle of the screen.
  useEffect(() => {
    const els = ["top", ...links.map((l) => l.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? "bg-bg/92 backdrop-blur border-b border-line" : "border-b border-transparent"
      }`}
    >
      <nav className="container-x flex items-center justify-between gap-4 px-5 py-3 md:px-8" aria-label="Main">
        <a href="#top" className="font-display text-xl font-bold tracking-tight">
          Ali Hassan
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={`text-[0.95rem] transition-colors hover:text-fg ${
                  active === l.id ? "text-fg font-semibold underline decoration-sun decoration-[3px] underline-offset-[7px]" : "text-fg-soft"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <ThemeToggle />
          <a href="/Ali_Hassan_Resume.pdf" download className="btn btn-primary hidden !py-2.5 md:inline-flex">
            Download résumé
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] border-line-strong lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="container-x px-5 pb-6 lg:hidden">
          {links.map((l) => (
            <li key={l.id} className="border-t border-line">
              <a href={`#${l.id}`} onClick={() => setOpen(false)} className="display block py-3 text-3xl">
                {l.label}
              </a>
            </li>
          ))}
          <li className="border-t border-line pt-5 md:hidden">
            <a href="/Ali_Hassan_Resume.pdf" download className="btn btn-primary">
              Download résumé
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
