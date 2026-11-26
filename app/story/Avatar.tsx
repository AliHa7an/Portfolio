import React from "react";

/**
 * Ali's illustrated avatar. Five aligned poses cut from his greeting
 * animation live in /public/avatar; this stacks them and shows one, so
 * switching pose never flashes while an image loads.
 */
export const POSES = {
  idle: 0,
  waveLow: 1,
  waveHigh: 2,
  present: 3,
  chest: 4,
} as const;

export type Pose = keyof typeof POSES;

/** Width / height of every pose image. */
export const AVATAR_RATIO = 486 / 1004;

export type AvatarProps = {
  pose: Pose;
  /** Time in seconds; drives a gentle breathing sway. */
  t?: number;
  /** Rendered height in px (or any CSS length). */
  height: number | string;
  style?: React.CSSProperties;
  className?: string;
};

export function Avatar({ pose, t = 0, height, style, className }: AvatarProps) {
  const sway = Math.sin(t * 1.5) * 0.6;
  const breathe = 1 + Math.sin(t * 1.9) * 0.006;
  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: "relative",
        height,
        aspectRatio: "486 / 1004",
        transform: `rotate(${sway}deg) scaleY(${breathe})`,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      {(Object.keys(POSES) as Pose[]).map((p) => (
        // Plain <img>: these are small local sprites that must swap instantly.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p}
          src={`/avatar/pose-${POSES[p]}.png`}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: p === pose ? 1 : 0,
            filter:
              "drop-shadow(0 0 1px rgba(255,255,255,0.55)) drop-shadow(0 18px 24px rgba(0,0,0,0.45))",
            userSelect: "none",
          }}
        />
      ))}
    </div>
  );
}

/** Pose for a talking presenter: alternates gestures on a slow beat. */
export function talkingPose(t: number): Pose {
  return Math.floor(t / 1.2) % 3 === 2 ? "chest" : "present";
}

/** Two-frame wave. */
export function wavingPose(t: number): Pose {
  return Math.floor(t * 3.2) % 2 === 0 ? "waveHigh" : "waveLow";
}
