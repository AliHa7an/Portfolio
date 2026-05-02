"use client";

import { useEffect } from "react";

export default function ConsoleEgg() {
  useEffect(() => {
    const s = [
      "color: #ff7a45; font-size: 18px; font-weight: 700; font-family: monospace",
      "color: #8a73ff; font-size: 12px; font-family: monospace",
      "color: #ffd166; font-size: 11px; font-family: monospace",
      "color: #8a73ff; font-size: 11px; font-family: monospace",
      "color: #c8c8d2; font-size: 11px; font-family: monospace",
      "color: #c8c8d2; font-size: 11px; font-family: monospace",
    ];
    console.log(
      "%c👋 Hey developer!\n" +
        "%c  Noticed you peeking at the source — respect.\n\n" +
        "%c  Built with  Next.js 16 · React 19 · Framer Motion · Three.js\n" +
        "%c  Designed & coded by Ali Hassan\n\n" +
        "%c  → github.com/AliHa7an\n" +
        "%c  → alihexan@gmail.com\n",
      s[0], s[1], s[2], s[3], s[4], s[5]
    );
  }, []);

  return null;
}
