"use client";

import Image from "next/image";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useSound, useSpeech } from "./SoundProvider";
import { MouthPatch, mouthOf } from "../story/TalkingHead";

const facts = [
  { term: "Now", detail: "Full stack developer at FourthD Inc." },
  { term: "Based in", detail: "Pakistan, working remotely with teams abroad." },
  { term: "Open to", detail: "Senior roles, direct projects, and paid consultation calls." },
];

export default function Hero() {
  const { voice, toggleVoice } = useSound();
  const speaking = useSpeech();

  return (
    <section id="top" className="hero-glow relative z-[2] px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
      <div className="container-x grid items-stretch gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <p className="text-lg text-fg-soft">Ali Hassan, senior full stack and AI engineer</p>
            <h1 className="display mt-5 text-[clamp(2.75rem,6.3vw,5.4rem)]">
              I build the product, the backend it runs on, and the AI inside it.
            </h1>
            <p className="mt-7 max-w-[58ch] text-lg text-fg-soft">
              Seven years of production web, mobile and AI work for clients in the US, the UK, Australia and the
              Middle East. Websites and stores, full stack platforms, and AI agents, chatbots and WhatsApp bots.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#story" className="btn btn-primary">
                <Play size={16} fill="currentColor" aria-hidden />
                Watch the 40-second tour
              </a>
              <a href="#services" className="btn btn-quiet">
                Hire me
              </a>
            </div>
          </div>

          <dl className="mt-12 grid gap-x-8 gap-y-5 border-t border-line-strong pt-6 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.term}>
                <dt className="text-sm text-muted">{f.term}</dt>
                <dd className="mt-1 font-medium leading-snug">{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div className="hero-panel relative mx-auto h-[440px] max-w-md overflow-hidden rounded-[2rem] bg-sun sm:h-[520px] lg:h-full lg:min-h-[600px] lg:max-w-none">
            <div className="absolute left-5 top-5 z-10 max-w-[15rem] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-on-sun shadow-[0_8px_0_rgba(15,26,58,0.12)] md:left-7 md:top-7">
              <p className="text-[0.95rem] font-medium leading-snug">
                {voice
                  ? "Hi, I'm Ali. Click anywhere and I'll talk you through my work."
                  : "Hi, I'm Ali. Turn my voice on and I'll talk you through my work."}
              </p>
              <button
                type="button"
                onClick={toggleVoice}
                aria-pressed={voice}
                className="mt-2.5 inline-flex items-center gap-2 rounded-lg bg-on-sun px-3 py-2 text-sm font-semibold text-white"
              >
                {voice ? <VolumeX size={15} aria-hidden /> : <Volume2 size={15} aria-hidden />}
                {voice ? "Mute my voice" : "Turn my voice on"}
              </button>
            </div>
            <div
              className="hero-figure absolute left-1/2 top-[19%] h-[165%] -translate-x-1/2"
              style={{ aspectRatio: "422 / 1402" }}
            >
              {/* A slight lean with his own voice keeps him from standing like a photo. */}
              <div
                className="relative h-full w-full origin-[50%_60%] transition-transform duration-100 ease-out"
                style={{
                  transform: speaking.active
                    ? `rotate(${(speaking.level - 0.4) * 0.5}deg) translateY(${speaking.level * 2}px)`
                    : undefined,
                }}
              >
                <Image
                  src="/avatar/hero.webp"
                  alt="Ali Hassan's avatar, standing in a charcoal suit and navy tie"
                  width={422}
                  height={1402}
                  priority
                  sizes="(min-width: 1024px) 420px, 320px"
                  className="h-full w-full select-none"
                  draggable={false}
                />
                {speaking.active && mouthOf(speaking, "closed") !== "closed" && (
                  <MouthPatch which="hero" mouth={mouthOf(speaking, "closed")} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
