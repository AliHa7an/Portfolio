"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  User,
  Wrench,
  Briefcase,
  FolderOpen,
  Mail,
  Download,
  ExternalLink,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

type IconComponent = React.FC<{ size?: number; className?: string }>;

type Item = {
  label: string;
  sublabel?: string;
  icon: IconComponent;
  action: () => void;
  kbd?: string;
};

function buildItems(): Item[] {
  const scroll = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return [
    { label: "About", sublabel: "Who I am", icon: User, action: scroll("about") },
    { label: "Skills", sublabel: "Tech toolkit", icon: Wrench, action: scroll("skills") },
    { label: "Experience", sublabel: "7 years, 6 teams", icon: Briefcase, action: scroll("experience") },
    { label: "Projects", sublabel: "11 live products", icon: FolderOpen, action: scroll("projects") },
    { label: "Contact", sublabel: "Let's build something", icon: Mail, action: scroll("contact") },
    {
      label: "GitHub",
      sublabel: "github.com/AliHa7an",
      icon: GithubIcon,
      action: () => window.open("https://github.com/AliHa7an", "_blank"),
      kbd: "↗",
    },
    {
      label: "LinkedIn",
      sublabel: "linkedin.com/in/ali-ha7an",
      icon: LinkedinIcon,
      action: () => window.open("https://www.linkedin.com/in/ali-ha7an/", "_blank"),
      kbd: "↗",
    },
    {
      label: "Download Resume",
      sublabel: "Ali_Hassan_Resume.pdf",
      icon: Download,
      action: () => {
        const a = document.createElement("a");
        a.href = "/Ali_Hassan_Resume.pdf";
        a.download = "Ali_Hassan_Resume.pdf";
        a.click();
      },
    },
    {
      label: "Send Email",
      sublabel: "alihexan@gmail.com",
      icon: ExternalLink,
      action: () => (window.location.href = "mailto:alihexan@gmail.com"),
    },
  ];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = buildItems();
  const filtered = query
    ? items.filter(
        (it) =>
          it.label.toLowerCase().includes(query.toLowerCase()) ||
          it.sublabel?.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  // Reset active index when filter changes
  useEffect(() => setActive(0), [query]);

  // Keyboard open/close
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  // Arrow navigation + Enter
  useEffect(() => {
    if (!open) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && filtered[active]) {
        filtered[active].action();
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [open, active, filtered]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
    else setQuery("");
  }, [open]);

  const run = (item: Item) => {
    item.action();
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Trigger hint in navbar — invisible, only keyboard shortcut matters */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed left-1/2 top-[20%] z-[201] w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-line-strong bg-surface/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Search row */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <ArrowUpRight size={16} className="shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search navigation, links, actions…"
                className="flex-1 bg-transparent text-sm text-fg placeholder:text-muted outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-line px-1.5 py-0.5 text-[10px] font-mono text-muted">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <ul className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-muted">
                  No results for &ldquo;{query}&rdquo;
                </li>
              )}
              {filtered.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.03 }}
                >
                  <button
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                      i === active
                        ? "bg-accent/10 text-fg"
                        : "text-fg-soft hover:bg-bg-soft/60"
                    }`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => run(item)}
                    data-cursor="hover"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        i === active
                          ? "border-accent/40 bg-accent/10 text-accent"
                          : "border-line bg-bg-soft/60 text-muted"
                      }`}
                    >
                      <item.icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {item.label}
                      </div>
                      {item.sublabel && (
                        <div className="text-xs text-muted truncate">
                          {item.sublabel}
                        </div>
                      )}
                    </div>
                    {item.kbd && (
                      <span className="text-xs text-muted">{item.kbd}</span>
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>

            {/* Footer hint */}
            <div className="flex items-center gap-4 border-t border-line px-5 py-3">
              <span className="flex items-center gap-1 text-[10px] text-muted font-mono">
                <kbd className="rounded border border-line px-1">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted font-mono">
                <kbd className="rounded border border-line px-1">↵</kbd> open
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted font-mono">
                <kbd className="rounded border border-line px-1">⌘K</kbd> toggle
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
