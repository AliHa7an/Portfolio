import React from "react";
import type { SpeechState } from "./speech";

/**
 * Ali's face with ten mouth shapes, stored side by side in one image
 * (/public/avatar/mouths.webp). Everything above the mouth is identical in
 * every frame, so swapping frames only moves his lips.
 */
export const MOUTHS = ["closed", "smile", "bigsmile", "A", "O", "E", "FV", "MBP", "WQ", "U"] as const;
export type Mouth = (typeof MOUTHS)[number];

/** Rough letter-to-mouth-shape mapping, enough to read as speech. */
export function mouthFor(ch: string | undefined): Mouth {
  const c = (ch ?? " ").toLowerCase();
  if (c === "a") return "A";
  if (c === "o") return "O";
  if (c === "u") return "U";
  if ("eiy".includes(c)) return "E";
  if ("fv".includes(c)) return "FV";
  if ("mbp".includes(c)) return "MBP";
  if ("wqr".includes(c)) return "WQ";
  if (/[a-z0-9]/.test(c)) return "E";
  return "closed";
}

/** Mouth shape for the live voice: closed in the gaps, shaped by the letter otherwise. */
export function mouthOf(s: SpeechState, resting: Mouth = "smile"): Mouth {
  if (!s.active || !s.text) return resting;
  if (s.level < 0.16) return "closed";
  const m = mouthFor(s.text[Math.min(s.text.length - 1, Math.floor(s.pos))]);
  return m === "closed" ? (s.level > 0.55 ? "A" : "E") : m;
}

export function TalkingHead({
  mouth,
  size,
  energy = 0,
  style,
  className,
}: {
  mouth: Mouth;
  /** Diameter in px. */
  size: number;
  /** Loudness 0 to 1: he nods very slightly with his own voice. */
  energy?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const i = MOUTHS.indexOf(mouth);
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size * 1.2,
          marginTop: -size * 0.13,
          backgroundImage: "url(/avatar/mouths.webp)",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${size * MOUTHS.length}px ${size * 1.2}px`,
          backgroundPosition: `${-i * size}px 0`,
          transform: `translateY(${energy * size * 0.018}px) scale(${1 + energy * 0.012})`,
          transformOrigin: "50% 70%",
          transition: "transform 0.09s ease-out",
        }}
      />
    </div>
  );
}

/**
 * The same mouth shapes fitted onto the face of a full-body image, as a small
 * patch laid over it. Box values are percentages of the image.
 */
export const MOUTH_PATCH = {
  0: { x: 42.702, y: 9.25, w: 21.133, h: 6.417 },
  3: { x: 43.791, y: 9.583, w: 19.39, h: 5.917 },
  4: { x: 43.573, y: 9.167, w: 19.826, h: 6.0 },
  hero: { x: 42.891, y: 8.631, w: 27.014, h: 6.419 },
} as const;

export function MouthPatch({ which, mouth }: { which: keyof typeof MOUTH_PATCH; mouth: Mouth }) {
  const box = MOUTH_PATCH[which];
  const i = MOUTHS.indexOf(mouth);
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.w}%`,
        height: `${box.h}%`,
        backgroundImage: `url(/avatar/mouth-${which}.webp)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${MOUTHS.length * 100}% 100%`,
        backgroundPosition: `${(i / (MOUTHS.length - 1)) * 100}% 0`,
      }}
    />
  );
}
