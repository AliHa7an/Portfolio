"use client";

import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AVATAR_RATIO, Avatar, talkingPose, wavingPose, type Pose } from "./Avatar";
import {
  AI_PILLARS,
  JOURNEY,
  SCENES,
  SHIPPED,
  STACK,
  STATS,
  STORY_DURATION,
  type Scene,
} from "./content";

const C = {
  bg: "#07070a",
  surface: "#12121b",
  line: "rgba(244,244,247,0.12)",
  fg: "#f4f4f7",
  soft: "#c8c8d2",
  muted: "#7d7d8a",
  a1: "#ff7a45",
  a2: "#ffd166",
  a3: "#8a73ff",
};

const DISPLAY = "var(--font-display), system-ui, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function useLayout() {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return { width, height, portrait, pick: <T,>(l: T, p: T) => (portrait ? p : l) };
}

/** Spring that starts at `delay` frames into the current sequence. */
function usePop(delay: number, damping = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 } });
}

/** Fades a whole scene in at its start and out at its end. */
function SceneShell({ scene, wide, children }: { scene: Scene; wide?: boolean; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const { pick } = useLayout();
  const isLast = scene.from + scene.duration >= STORY_DURATION;
  const inP = interpolate(frame, [0, 14], [0, 1], clamp);
  const outP = isLast ? 1 : interpolate(frame, [scene.duration - 12, scene.duration], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity: inP * outP,
        transform: `translateY(${(1 - inP) * 30 - (1 - outP) * 30}px)`,
        padding: pick(wide ? "96px 72px 176px" : "96px 72px 176px 236px", "118px 40px 268px"),
        display: "flex",
        flexDirection: "column",
        justifyContent: pick("center", wide ? "center" : "flex-start"),
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  const { pick } = useLayout();
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: pick(18, 20),
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: C.a1,
        marginBottom: pick(18, 12),
      }}
    >
      {children}
    </div>
  );
}

function Heading({ children, delay = 4 }: { children: string; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pick } = useLayout();
  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontWeight: 600,
        fontSize: pick(58, 46),
        lineHeight: 1.04,
        letterSpacing: "-0.02em",
        color: C.fg,
        marginBottom: pick(34, 24),
      }}
    >
      {children.split(" ").map((w, i) => {
        const p = spring({ frame: frame - delay - i * 3, fps, config: { damping: 16 } });
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.26em", verticalAlign: "bottom" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
}

/* ─── Scenes ─────────────────────────────────────────────── */

function Intro({ scene }: { scene: Scene }) {
  const { pick, portrait } = useLayout();
  const sub = usePop(34);
  const chips = ["Full Stack", "AI Agents", "Automation", "Voice AI"];
  return (
    <SceneShell scene={scene} wide>
      <div
        style={{
          marginLeft: pick(470, 0),
          marginTop: pick(-30, 350),
          textAlign: portrait ? "center" : "left",
        }}
      >
        <Kicker>Portfolio · the short tour</Kicker>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: pick(124, 104),
            lineHeight: 0.94,
            letterSpacing: "-0.035em",
            color: C.fg,
          }}
        >
          <Word delay={8}>Ali</Word>{" "}
          <Word delay={14} gradient>
            Hassan
          </Word>
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: DISPLAY,
            fontSize: pick(34, 32),
            color: C.soft,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 16}px)`,
          }}
        >
          Senior Full Stack &amp; AI Engineer
        </div>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: portrait ? "center" : "flex-start",
          }}
        >
          {chips.map((c, i) => (
            <Chip key={c} delay={50 + i * 6}>
              {c}
            </Chip>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}

function Word({ children, delay, gradient }: { children: string; delay: number; gradient?: boolean }) {
  const p = usePop(delay, 13);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.08em" }}>
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${(1 - p) * 105}%)`,
          ...(gradient
            ? {
                backgroundImage: `linear-gradient(110deg, ${C.a1}, ${C.a2} 50%, ${C.a3})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }
            : null),
        }}
      >
        {children}
      </span>
    </span>
  );
}

function Chip({ children, delay, accent }: { children: React.ReactNode; delay: number; accent?: string }) {
  const p = usePop(delay, 12);
  const { pick } = useLayout();
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: pick("10px 18px", "11px 18px"),
        borderRadius: 999,
        border: `1px solid ${C.line}`,
        background: "rgba(255,255,255,0.045)",
        color: C.fg,
        fontSize: pick(21, 23),
        fontWeight: 500,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px) scale(${0.86 + p * 0.14})`,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 8, background: accent ?? C.a1 }} />
      {children}
    </span>
  );
}

function Numbers({ scene }: { scene: Scene }) {
  const frame = useCurrentFrame();
  const { pick, portrait } = useLayout();
  const places = ["United States", "United Kingdom", "Australia", "Middle East"];
  return (
    <SceneShell scene={scene}>
      <Kicker>02 · In numbers</Kicker>
      <Heading>Built for clients around the world.</Heading>
      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: pick(22, 16) }}>
        {STATS.map((s, i) => {
          const delay = 18 + i * 9;
          const p = spring({ frame: frame - delay, fps: 30, config: { damping: 15 } });
          const n = Math.round(interpolate(frame, [delay, delay + 28], [0, s.value], { ...clamp, easing: Easing.out(Easing.cubic) }));
          const accent = [C.a1, C.a2, C.a3][i];
          return (
            <div
              key={s.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: portrait ? "row" : "column",
                alignItems: portrait ? "center" : "flex-start",
                gap: portrait ? 26 : 4,
                padding: pick("26px 30px", "10px 26px"),
                borderRadius: 26,
                border: `1px solid ${C.line}`,
                background: `linear-gradient(160deg, ${accent}22, ${C.surface} 55%)`,
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: pick(116, 78),
                  lineHeight: 1,
                  color: accent,
                  minWidth: portrait ? 150 : undefined,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {n}
                {s.suffix}
              </div>
              <div style={{ fontSize: pick(26, 28), color: C.soft }}>{s.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: pick(26, 20), display: "flex", flexWrap: "wrap", gap: pick(12, 10) }}>
        {places.map((p, i) => (
          <Chip key={p} delay={62 + i * 6} accent={C.a2}>
            {p}
          </Chip>
        ))}
      </div>
    </SceneShell>
  );
}

function Stack({ scene }: { scene: Scene }) {
  const { pick, portrait } = useLayout();
  const accents = [C.a1, C.a3, C.a2, "#38bdf8"];
  return (
    <SceneShell scene={scene}>
      <Kicker>03 · Stack</Kicker>
      <Heading>My everyday stack.</Heading>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: portrait ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: pick(18, 16),
        }}
      >
        {STACK.map((g, gi) => (
          <StackColumn key={g.label} group={g} delay={16 + gi * 14} accent={accents[gi]} />
        ))}
      </div>
    </SceneShell>
  );
}

function StackColumn({
  group,
  delay,
  accent,
}: {
  group: (typeof STACK)[number];
  delay: number;
  accent: string;
}) {
  const p = usePop(delay);
  const frame = useCurrentFrame();
  const { pick, portrait } = useLayout();
  const items = portrait ? group.items.slice(0, 4) : group.items;
  return (
    <div
      style={{
        padding: pick("22px 22px 24px", "16px 18px 18px"),
        borderRadius: 24,
        border: `1px solid ${C.line}`,
        background: C.surface,
        opacity: p,
        transform: `translateY(${(1 - p) * 46}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: pick(16, 12) }}>
        <span style={{ width: 12, height: 12, borderRadius: 4, background: accent }} />
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: pick(26, 27), color: C.fg }}>{group.label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: pick(9, 8) }}>
        {items.map((it, i) => {
          const q = spring({ frame: frame - delay - 10 - i * 5, fps: 30, config: { damping: 14 } });
          return (
            <div
              key={it}
              style={{
                fontSize: pick(20, 22),
                color: C.soft,
                padding: "6px 12px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                borderLeft: `3px solid ${accent}`,
                opacity: q,
                transform: `translateX(${(1 - q) * -24}px)`,
                whiteSpace: "nowrap",
              }}
            >
              {it}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Ai({ scene }: { scene: Scene }) {
  const frame = useCurrentFrame();
  const { pick, portrait } = useLayout();
  const accents = [C.a1, C.a2, C.a3];
  return (
    <SceneShell scene={scene}>
      <Kicker>04 · AI</Kicker>
      <Heading>{portrait ? "AI in production." : "AI that runs in production."}</Heading>
      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: pick(20, 14) }}>
        {AI_PILLARS.map((a, i) => {
          const delay = 18 + i * 16;
          const p = spring({ frame: frame - delay, fps: 30, config: { damping: 14 } });
          const pulse = 0.5 + 0.5 * Math.sin((frame - delay) / 9);
          return (
            <div
              key={a.title}
              style={{
                flex: 1,
                position: "relative",
                padding: pick("26px 26px 24px", "16px 22px 16px"),
                borderRadius: 26,
                border: `1px solid ${accents[i]}55`,
                background: `linear-gradient(170deg, ${accents[i]}1f, ${C.surface} 60%)`,
                boxShadow: `0 0 ${30 + pulse * 30}px ${accents[i]}22`,
                opacity: p,
                transform: `translateY(${(1 - p) * 50}px) rotate(${(1 - p) * (i - 1) * 4}deg)`,
              }}
            >
              <div style={{ display: portrait ? "none" : "flex", gap: 6, marginBottom: 18, alignItems: "flex-end", height: 26 }}>
                {[0, 1, 2, 3, 4].map((b) => (
                  <span
                    key={b}
                    style={{
                      width: 6,
                      borderRadius: 3,
                      background: accents[i],
                      height: 8 + Math.abs(Math.sin((frame + b * 7 + i * 11) / 6)) * 18,
                    }}
                  />
                ))}
              </div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: pick(27, 28), color: C.fg, marginBottom: pick(10, 6) }}>
                {a.title}
              </div>
              <div style={{ fontSize: pick(20, 21), lineHeight: 1.3, color: C.soft }}>{a.body}</div>
              <div
                style={{
                  marginTop: pick(18, 10),
                  display: "inline-block",
                  fontFamily: MONO,
                  fontSize: pick(17, 18),
                  color: accents[i],
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: `1px solid ${accents[i]}66`,
                }}
              >
                {a.proof}
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
}

function Journey({ scene }: { scene: Scene }) {
  const frame = useCurrentFrame();
  const { portrait } = useLayout();
  const draw = interpolate(frame, [16, 130], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const n = JOURNEY.length;
  return (
    <SceneShell scene={scene}>
      <Kicker>05 · Journey</Kicker>
      <Heading>Six companies since 2018.</Heading>
      {portrait ? (
        <div style={{ position: "relative", paddingLeft: 44 }}>
          <div style={{ position: "absolute", left: 13, top: 14, bottom: 14, width: 4, borderRadius: 4, background: C.line }} />
          <div
            style={{
              position: "absolute",
              left: 13,
              top: 14,
              width: 4,
              borderRadius: 4,
              height: `calc(${draw * 100}% - 28px)`,
              background: `linear-gradient(${C.a1}, ${C.a3})`,
            }}
          />
          {JOURNEY.map((j, i) => {
            const on = spring({ frame: frame - 16 - (i / (n - 1)) * 114, fps: 30, config: { damping: 12 } });
            const last = i === n - 1;
            return (
              <div key={j.company} style={{ position: "relative", height: 76, opacity: 0.25 + on * 0.75 }}>
                <span
                  style={{
                    position: "absolute",
                    left: -44,
                    top: 4,
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    background: last ? C.a1 : C.bg,
                    border: `4px solid ${last ? C.a2 : C.a3}`,
                    transform: `scale(${0.4 + on * 0.6})`,
                  }}
                />
                <span style={{ fontFamily: MONO, fontSize: 20, color: C.a2, marginRight: 14 }}>{j.year}</span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 28, color: C.fg }}>{j.company}</span>
                <div style={{ fontSize: 21, color: C.muted, marginTop: 2 }}>{j.note}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ position: "relative", height: 250, marginTop: 6 }}>
          <div style={{ position: "absolute", left: "5%", right: "5%", top: 56, height: 4, borderRadius: 4, background: C.line }} />
          <div
            style={{
              position: "absolute",
              left: "5%",
              top: 56,
              height: 4,
              borderRadius: 4,
              width: `${draw * 90}%`,
              background: `linear-gradient(90deg, ${C.a1}, ${C.a2}, ${C.a3})`,
              boxShadow: `0 0 18px ${C.a1}`,
            }}
          />
          {JOURNEY.map((j, i) => {
            const on = spring({ frame: frame - 16 - (i / (n - 1)) * 114, fps: 30, config: { damping: 12 } });
            const last = i === n - 1;
            return (
              <div
                key={j.company}
                style={{
                  position: "absolute",
                  left: `${5 + (i / (n - 1)) * 90}%`,
                  top: 0,
                  width: 164,
                  marginLeft: -82,
                  textAlign: "center",
                  opacity: 0.2 + on * 0.8,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 20, color: C.a2, height: 36 }}>{j.year}</div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    margin: "7px auto 0",
                    borderRadius: 30,
                    background: last ? C.a1 : C.bg,
                    border: `4px solid ${last ? C.a2 : C.a3}`,
                    transform: `scale(${0.3 + on * 0.7})`,
                    boxShadow: last ? `0 0 26px ${C.a1}` : "none",
                  }}
                />
                <div
                  style={{
                    marginTop: 20,
                    fontFamily: DISPLAY,
                    fontWeight: 600,
                    fontSize: 21,
                    lineHeight: 1.12,
                    color: C.fg,
                    transform: `translateY(${(1 - on) * 16}px)`,
                  }}
                >
                  {j.company}
                </div>
                <div style={{ marginTop: 8, fontSize: 17, lineHeight: 1.25, color: C.muted }}>{j.note}</div>
              </div>
            );
          })}
        </div>
      )}
    </SceneShell>
  );
}

function Projects({ scene }: { scene: Scene }) {
  const frame = useCurrentFrame();
  const { pick, portrait } = useLayout();
  return (
    <SceneShell scene={scene}>
      <Kicker>06 · Shipped</Kicker>
      <Heading>Products with real users.</Heading>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: portrait ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: pick(18, 14),
        }}
      >
        {SHIPPED.map((s, i) => {
          const p = spring({ frame: frame - 16 - i * 8, fps: 30, config: { damping: 13 } });
          const float = Math.sin((frame + i * 20) / 22) * 4;
          return (
            <div
              key={s.title}
              style={{
                position: "relative",
                overflow: "hidden",
                padding: pick("22px 24px", "20px 20px"),
                height: pick(128, 138),
                borderRadius: 24,
                border: `1px solid ${C.line}`,
                background: `linear-gradient(135deg, ${s.color}33, ${C.surface} 65%)`,
                opacity: p,
                transform: `translateY(${(1 - p) * 70 + float}px) rotate(${(1 - p) * (i % 2 ? 6 : -6)}deg) scale(${0.8 + p * 0.2})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -30,
                  bottom: -40,
                  width: 130,
                  height: 130,
                  borderRadius: 130,
                  background: s.color,
                  opacity: 0.18,
                  filter: "blur(6px)",
                }}
              />
              <div style={{ fontFamily: MONO, fontSize: pick(16, 17), letterSpacing: "0.14em", textTransform: "uppercase", color: s.color }}>
                {s.tag}
              </div>
              <div style={{ marginTop: 10, fontFamily: DISPLAY, fontWeight: 600, fontSize: pick(32, 29), lineHeight: 1.08, color: C.fg }}>
                {s.title}
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
}

function Cta({ scene }: { scene: Scene }) {
  const frame = useCurrentFrame();
  const { pick } = useLayout();
  const p = usePop(30);
  const arrow = Math.sin(frame / 7) * 8;
  return (
    <SceneShell scene={scene}>
      <div style={{ textAlign: "center" }}>
        <Kicker>07 · Next</Kicker>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: pick(104, 84),
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: C.fg,
          }}
        >
          <Word delay={6}>Let&apos;s</Word> <Word delay={11}>build</Word>{" "}
          <Word delay={16} gradient>
            something.
          </Word>
        </div>
        <div
          style={{
            marginTop: 34,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 30px",
            borderRadius: 999,
            background: C.fg,
            color: C.bg,
            fontSize: pick(28, 28),
            fontWeight: 600,
            opacity: p,
            transform: `scale(${0.8 + p * 0.2})`,
          }}
        >
          alihexan@gmail.com
        </div>
        <div style={{ marginTop: 30, fontFamily: MONO, fontSize: pick(19, 21), color: C.muted, opacity: p }}>
          Keep scrolling for the full portfolio
          <span style={{ display: "inline-block", marginLeft: 12, color: C.a1, transform: `translateY(${arrow}px)` }}>↓</span>
        </div>
      </div>
    </SceneShell>
  );
}

/* ─── Persistent layers ──────────────────────────────────── */

function Backdrop() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const blobs = [
    { c: C.a1, x: 0.15, y: 0.2, r: 0.5, s: 0.011 },
    { c: C.a3, x: 0.85, y: 0.3, r: 0.55, s: 0.008 },
    { c: C.a2, x: 0.6, y: 0.95, r: 0.42, s: 0.013 },
  ];
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {blobs.map((b, i) => {
        const size = Math.max(width, height) * b.r;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              left: width * b.x - size / 2 + Math.sin(frame * b.s + i) * 90,
              top: height * b.y - size / 2 + Math.cos(frame * b.s * 1.3 + i) * 70,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${b.c}40 0%, transparent 65%)`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${-frame * 0.4}px ${-frame * 0.25}px`,
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 78%)",
        }}
      />
    </AbsoluteFill>
  );
}

function TopBar() {
  const frame = useCurrentFrame();
  const { pick, portrait } = useLayout();
  const idx = Math.max(0, SCENES.findIndex((s) => frame < s.from + s.duration));
  return (
    <div
      style={{
        position: "absolute",
        top: pick(34, 36),
        left: pick(72, 40),
        right: pick(72, 40),
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {SCENES.map((s, i) => {
        const fill = interpolate(frame, [s.from, s.from + s.duration], [0, 1], clamp);
        return (
          <div key={s.id} style={{ flex: 1 }}>
            <div style={{ height: 5, borderRadius: 5, background: C.line, overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.a1}, ${C.a2})` }} />
            </div>
            <div
              style={{
                marginTop: 9,
                fontFamily: MONO,
                fontSize: pick(14, 15),
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: i === idx ? C.fg : C.muted,
                whiteSpace: "nowrap",
                overflow: portrait ? "visible" : "hidden",
                visibility: portrait && i !== idx ? "hidden" : "visible",
                direction: portrait && i > 4 ? "rtl" : "ltr",
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** The avatar and its speech bubble, visible across every scene. */
function Narrator() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { pick, portrait } = useLayout();
  const t = frame / fps;

  const scene = SCENES.find((s) => frame < s.from + s.duration) ?? SCENES[SCENES.length - 1];
  const local = frame - scene.from;
  const chars = Math.floor(interpolate(local, [10, 10 + scene.line.length * 0.95], [0, scene.line.length], clamp));
  const talking = chars > 0 && chars < scene.line.length;
  const bubbleIn = interpolate(local, [4, 14], [0, 1], clamp);
  const bubbleOut =
    scene.from + scene.duration >= STORY_DURATION
      ? 1
      : interpolate(local, [scene.duration - 10, scene.duration], [1, 0], clamp);

  // Centre-stage for the intro, then steps back into the corner.
  const settle = interpolate(frame, [118, 150], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const bigH = pick(500, 330);
  const smallH = pick(330, 232);
  const h = interpolate(settle, [0, 1], [bigH, smallH]);
  const w = h * AVATAR_RATIO;
  const bigX = portrait ? (width - bigH * AVATAR_RATIO) / 2 : 150;
  const bigY = pick(120, 96);
  const smallX = pick(52, 20);
  const smallY = height - smallH - pick(30, 20);
  const x = interpolate(settle, [0, 1], [bigX, smallX]);
  const y = interpolate(settle, [0, 1], [bigY, smallY]);
  const enter = spring({ frame, fps, config: { damping: 14 } });

  let pose: Pose = "idle";
  if (scene.id === "intro") {
    pose = frame < 12 ? "idle" : frame < 84 ? wavingPose(t) : frame < 118 ? "chest" : "idle";
  } else if (scene.id === "cta" && local > 70) {
    pose = wavingPose(t);
  } else if (talking) {
    pose = talkingPose(local / fps);
  }

  const bubbleLeft = pick(236, smallX + smallH * AVATAR_RATIO + 12);

  return (
    <>
      {/* Spotlight so the dark suit reads against the dark stage */}
      <div
        style={{
          position: "absolute",
          left: x - w * 0.55,
          top: y - h * 0.06,
          width: w * 2.1,
          height: h * 1.12,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.2) 0%, ${C.a3}33 38%, transparent 68%)`,
          opacity: enter,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - w * 0.15,
          top: y + h - h * 0.035,
          width: w * 1.3,
          height: h * 0.06,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)",
          opacity: enter,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 40}px)`,
        }}
      >
        <Avatar pose={pose} t={t} height={h} />
      </div>

      <div
        style={{
          position: "absolute",
          left: bubbleLeft,
          right: pick(72, 24),
          bottom: pick(40, 44),
          minHeight: pick(96, 150),
          display: "flex",
          alignItems: "center",
          padding: pick("18px 28px", "16px 20px"),
          borderRadius: 26,
          borderBottomLeftRadius: 6,
          border: `1px solid ${C.line}`,
          background: "rgba(18,18,27,0.86)",
          color: C.fg,
          fontSize: pick(27, 26),
          lineHeight: 1.3,
          opacity: bubbleIn * bubbleOut,
          transform: `translateY(${(1 - bubbleIn) * 14}px)`,
        }}
      >
        <span>
          {scene.line.slice(0, chars)}
          <span style={{ opacity: talking && frame % 16 < 8 ? 1 : 0, color: C.a1 }}>▍</span>
        </span>
      </div>
    </>
  );
}

export function PortfolioStory() {
  const scenes: Record<string, React.FC<{ scene: Scene }>> = {
    intro: Intro,
    numbers: Numbers,
    stack: Stack,
    ai: Ai,
    journey: Journey,
    projects: Projects,
    cta: Cta,
  };
  return (
    <AbsoluteFill style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <Backdrop />
      {SCENES.map((s) => {
        const Comp = scenes[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration}>
            <Comp scene={s} />
          </Sequence>
        );
      })}
      <TopBar />
      <Narrator />
    </AbsoluteFill>
  );
}
