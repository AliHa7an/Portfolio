"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-10 w-[68px] items-center rounded-full border border-line-strong bg-surface/50 backdrop-blur-md px-1 transition-colors hover:border-accent"
      data-cursor="hover"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          marginLeft: mounted && isDark ? "auto" : 0,
          background:
            "linear-gradient(135deg, var(--accent), var(--accent-2))",
          boxShadow: "0 0 18px color-mix(in oklab, var(--accent) 55%, transparent)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {mounted && isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={16} className="text-black" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={16} className="text-black" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
