import React from "react";

/**
 * Ali's face with ten mouth shapes, stored side by side in one image
 * (/public/avatar/mouths.webp). Everything above the mouth is identical in
 * every frame, so swapping frames only moves his lips.
 */
const ORDER = ["closed", "smile", "bigsmile", "A", "O", "E", "FV", "MBP", "WQ", "U"] as const;
export type Mouth = (typeof ORDER)[number];

/** Rough letter-to-mouth-shape mapping, enough to read as speech. */
export function mouthFor(ch: string | undefined): Mouth {
  const c = (ch ?? " ").toLowerCase();
  if ("a".includes(c)) return "A";
  if ("o".includes(c)) return "O";
  if ("u".includes(c)) return "U";
  if ("eiy".includes(c)) return "E";
  if ("fv".includes(c)) return "FV";
  if ("mbp".includes(c)) return "MBP";
  if ("wqr".includes(c)) return "WQ";
  if (/[a-z0-9]/.test(c)) return "E";
  return "closed";
}

export function TalkingHead({
  mouth,
  size,
  style,
  className,
}: {
  mouth: Mouth;
  /** Diameter in px. */
  size: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const i = ORDER.indexOf(mouth);
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        backgroundColor: "#ffffff",
        backgroundImage: "url(/avatar/mouths.webp)",
        backgroundRepeat: "no-repeat",
        // Each frame is 5:6; show a square window over the face.
        backgroundSize: `${size * ORDER.length}px ${size * 1.2}px`,
        backgroundPosition: `${-i * size}px ${-size * 0.13}px`,
        ...style,
      }}
    />
  );
}
