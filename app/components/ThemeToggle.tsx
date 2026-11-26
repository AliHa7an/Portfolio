"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Switch between light and dark"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] border-line-strong hover:border-fg transition-colors"
    >
      <Sun size={17} className="hidden dark:block" aria-hidden />
      <Moon size={17} className="dark:hidden" aria-hidden />
    </button>
  );
}
