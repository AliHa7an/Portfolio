import React from "react";

/**
 * Ali's avatar. Five poses, cut from his high-resolution pose sheet and
 * aligned on the head, live in /public/avatar; this stacks them and shows
 * one, so switching pose never flashes while an image loads.
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
export const AVATAR_RATIO = 459 / 1200;

export type AvatarProps = {
  pose: Pose;
  /** Time in seconds; drives a gentle sway. */
  t?: number;
  /** Rendered height in px (or any CSS length). */
  height: number | string;
  style?: React.CSSProperties;
  className?: string;
};

export function Avatar({ pose, t = 0, height, style, className }: AvatarProps) {
  const sway = Math.sin(t * 1.5) * 0.6;
  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: "relative",
        height,
        aspectRatio: "459 / 1200",
        transform: sway ? `rotate(${sway}deg)` : undefined,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      {(Object.keys(POSES) as Pose[]).map((p) => (
        // Plain <img>: small local sprites that must swap instantly.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p}
          src={`/avatar/pose-${POSES[p]}.webp`}
          alt=""
          width={459}
          height={1200}
          decoding="async"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            visibility: p === pose ? "visible" : "hidden",
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
