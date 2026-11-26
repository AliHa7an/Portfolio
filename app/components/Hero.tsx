"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import { useSound, useSpeech } from "./SoundProvider";
import AvatarVideo from "./AvatarVideo";
import { HERO_INTRO } from "../story/content";

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
          <div className="hero-panel relative mx-auto h-[460px] max-w-md overflow-hidden rounded-[2rem] bg-sun sm:h-[540px] lg:h-full lg:min-h-[620px] lg:max-w-none">
            <AvatarVideo
              className="absolute inset-0"
              entrance
              speaking={speaking.active && (speaking.text === HERO_INTRO || (speaking.text ?? "").startsWith("My voice"))}
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 text-on-sun shadow-[0_8px_0_rgba(15,26,58,0.12)] md:inset-x-5 md:bottom-5">
              <p className="text-[0.95rem] font-medium leading-snug">
                {voice ? "Click anywhere and I'll talk you through my work." : "Turn my voice on and I'll talk you through my work."}
              </p>
              <button
                type="button"
                onClick={toggleVoice}
                aria-pressed={voice}
                aria-label={voice ? "Mute my voice" : "Turn my voice on"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-on-sun text-white transition-transform duration-150 ease-out active:scale-95"
              >
                {voice ? <Volume2 size={18} aria-hidden /> : <VolumeX size={18} aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
