"use client";

import { useEffect, useRef, useState } from "react";

/** Second in talk.mp4 that matches the resting still exactly (mouth closed, hands together). */
const REST_AT = 5;

/**
 * Ali on video. A still of him at rest is always underneath; while he is
 * speaking, real footage of him talking plays on top, starting from that same
 * resting frame so there is no jump. The footage is silent: his voice comes
 * from the site's own recordings.
 */
export default function AvatarVideo({
  speaking,
  entrance = false,
  zoom = 1,
  focusY = 0,
  className = "",
}: {
  speaking: boolean;
  /** Play the sit-to-stand clip once when this first appears. */
  entrance?: boolean;
  /** Scale up from the top centre, to frame his head and chest in small tiles. */
  zoom?: number;
  /** Shift the picture up by this share of its height after zooming. */
  // className must position the box (relative or absolute) and give it a size.
  focusY?: number;
  className?: string;
}) {
  const talk = useRef<HTMLVideoElement>(null);
  const rise = useRef<HTMLVideoElement>(null);
  const [talking, setTalking] = useState(false);
  const [rising, setRising] = useState(false);

  // Entrance: he gets up from the floor, once.
  useEffect(() => {
    if (!entrance) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const v = rise.current;
    if (!v) return;
    let cancelled = false;
    v.play()
      .then(() => {
        if (!cancelled) setRising(true);
      })
      .catch(() => {});
    const done = () => setRising(false);
    v.addEventListener("ended", done);
    return () => {
      cancelled = true;
      v.removeEventListener("ended", done);
    };
  }, [entrance]);

  // Speaking: play the footage; when he stops, fade back to the still and rewind.
  useEffect(() => {
    const v = talk.current;
    if (!v) return;
    if (speaking) {
      let cancelled = false;
      v.play()
        .then(() => {
          if (!cancelled) setTalking(true);
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }
    const t = window.setTimeout(() => {
      v.pause();
      v.currentTime = REST_AT;
    }, 260);
    return () => window.clearTimeout(t);
  }, [speaking]);

  const visibleTalk = speaking && talking;
  const frame: React.CSSProperties = {
    transform: zoom === 1 ? undefined : `translateY(${-focusY * 100}%) scale(${zoom})`,
    transformOrigin: "50% 0%",
  };
  const layer = "absolute inset-0 h-full w-full object-cover object-top";

  return (
    <div className={`overflow-hidden bg-sun ${className}`}>
      <div className="absolute inset-0" style={frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/avatar/v3/rest.webp" alt="" className={layer} draggable={false} />
        <video
          ref={talk}
          src="/avatar/v3/talk.mp4#t=5"
          muted
          playsInline
          loop
          preload="metadata"
          tabIndex={-1}
          aria-hidden
          className={`${layer} transition-opacity duration-200 ease-out`}
          style={{ opacity: visibleTalk ? 1 : 0 }}
        />
        {entrance && (
          <video
            ref={rise}
            src="/avatar/v3/rise.mp4"
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden
            className={`${layer} transition-opacity duration-500 ease-out`}
            style={{ opacity: rising && !visibleTalk ? 1 : 0 }}
          />
        )}
      </div>
    </div>
  );
}
