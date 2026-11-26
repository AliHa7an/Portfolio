"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { HERO_INTRO } from "../story/content";

type SoundName = "hover" | "click" | "chime" | "whoosh";

export type SayOptions = {
  /** Speak even if voice is off: the visitor pressed a Listen button. */
  force?: boolean;
  /** Called as each word starts, with its character index (not in every browser). */
  onBoundary?: (charIndex: number) => void;
  /** Called when the line has been spoken in full. */
  onEnd?: () => void;
};

type SoundApi = {
  /** His voice. On by default; starts at the visitor's first click, tap or key press. */
  voice: boolean;
  toggleVoice: () => void;
  /** Background music and interface sounds. Off by default. */
  music: boolean;
  toggleMusic: () => void;
  play: (name: SoundName) => void;
  /** Speak a line in English. Returns false if it will not be spoken. */
  say: (text: string, options?: SayOptions) => boolean;
  hush: () => void;
};

const SoundContext = createContext<SoundApi>({
  voice: true,
  toggleVoice: () => {},
  music: false,
  toggleMusic: () => {},
  play: () => {},
  say: () => false,
  hush: () => {},
});

export const useSound = () => useContext(SoundContext);

/* ─── Voice preference, remembered across visits ─────────────── */

const VOICE_KEY = "voice-off";
const voiceListeners = new Set<() => void>();
const voicePref = {
  subscribe(cb: () => void) {
    voiceListeners.add(cb);
    return () => voiceListeners.delete(cb);
  },
  get() {
    try {
      return window.localStorage.getItem(VOICE_KEY) !== "1";
    } catch {
      return true;
    }
  },
  set(on: boolean) {
    try {
      window.localStorage.setItem(VOICE_KEY, on ? "0" : "1");
    } catch {
      // Storage blocked: the choice lasts for this visit only.
    }
    voiceListeners.forEach((l) => l());
  },
};

/** Best available English voice, preferring a natural male one. */
function pickVoice(): SpeechSynthesisVoice | null {
  const english = window.speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
  const wanted = [
    /Microsoft (Andrew|Brian|Guy|Ryan|Davis|Christopher).*(Natural|Online)/i,
    /Google UK English Male/i,
    /\b(Daniel|Arthur|Oliver|Aaron|Evan)\b/i,
    /Microsoft (Guy|Ryan|David|Mark|George)/i,
    /\bMale\b/i,
    /Google US English/i,
  ];
  for (const re of wanted) {
    const v = english.find((voice) => re.test(voice.name));
    if (v) return v;
  }
  return english[0] ?? null;
}

/* ─── Music and interface sounds (Tone.js, generated in code) ── */

type Engine = {
  play: (name: SoundName) => void;
  start: () => void;
  stop: () => void;
  /** Lower the music while he is speaking. */
  duck: (down: boolean) => void;
};

async function createEngine(): Promise<Engine> {
  const Tone = await import("tone");
  await Tone.start();

  const master = new Tone.Gain(0).toDestination();
  const reverb = new Tone.Reverb({ decay: 7, wet: 0.55 }).connect(master);
  const filter = new Tone.Filter(1400, "lowpass").connect(reverb);

  const pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 2.4, decay: 1, sustain: 0.7, release: 5 },
    volume: -20,
  }).connect(filter);

  const bell = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2,
    modulationIndex: 1.4,
    envelope: { attack: 0.01, decay: 1.6, sustain: 0, release: 2.5 },
    volume: -27,
  }).connect(reverb);

  const chords = [
    ["D3", "A3", "F4", "C5"],
    ["Bb2", "F3", "D4", "A4"],
    ["F3", "C4", "A4", "E5"],
    ["C3", "G3", "E4", "B4"],
  ];
  const scale = ["D5", "F5", "G5", "A5", "C6", "D6"];

  const chordLoop = new Tone.Sequence(
    (time, i) => pad.triggerAttackRelease(chords[i as number], "1m", time),
    [0, 1, 2, 3],
    "1m"
  );
  const bellLoop = new Tone.Loop((time) => {
    if (Math.random() < 0.55) {
      const note = scale[Math.floor(Math.random() * scale.length)];
      bell.triggerAttackRelease(note, "2n", time, 0.4 + Math.random() * 0.4);
    }
  }, "2n");

  const transport = Tone.getTransport();
  transport.bpm.value = 58;

  const blip = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.04 },
    volume: -26,
  }).connect(master);
  const tap = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 3,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
    volume: -18,
  }).connect(master);
  const chime = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.005, decay: 0.5, sustain: 0, release: 0.8 },
    volume: -20,
  }).connect(reverb);
  const noise = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.12, decay: 0.3, sustain: 0, release: 0.1 },
    volume: -30,
  }).connect(new Tone.Filter(900, "bandpass").connect(reverb));

  let lastHover = 0;

  return {
    play(name) {
      const now = Tone.now();
      try {
        if (name === "hover") {
          if (now - lastHover < 0.07) return;
          lastHover = now;
          blip.triggerAttackRelease("A5", 0.04, now);
        } else if (name === "click") {
          tap.triggerAttackRelease("G2", 0.08, now);
        } else if (name === "chime") {
          chime.triggerAttackRelease(["D5", "A5"], 0.3, now);
          chime.triggerAttackRelease(["F5"], 0.3, now + 0.09);
        } else {
          noise.triggerAttackRelease(0.35, now);
        }
      } catch {
        // A note scheduled in the past throws; a missed blip is harmless.
      }
    },
    duck(down) {
      master.gain.rampTo(down ? 0.22 : 0.9, 0.35);
    },
    start() {
      chordLoop.start(0);
      bellLoop.start("1m");
      transport.start();
      master.gain.rampTo(0.9, 1.2);
    },
    stop() {
      master.gain.rampTo(0, 0.5);
      window.setTimeout(() => {
        transport.stop();
        chordLoop.stop();
        bellLoop.stop();
        pad.releaseAll();
      }, 600);
    },
  };
}

/* ─── Provider ───────────────────────────────────────────────── */

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const voice = useSyncExternalStore(voicePref.subscribe, voicePref.get, () => true);
  const [music, setMusic] = useState(false);
  const engine = useRef<Engine | null>(null);
  const loading = useRef(false);
  /** Browsers refuse to speak until the visitor has clicked, tapped or typed. */
  const unlocked = useRef(false);
  const pending = useRef<{ text: string; options?: SayOptions } | null>(null);
  const current = useRef(0);

  const hush = useCallback(() => {
    current.current += 1;
    pending.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    engine.current?.duck(false);
  }, []);

  const speakNow = useCallback((text: string, options?: SayOptions) => {
    if (!("speechSynthesis" in window)) return false;
    const synth = window.speechSynthesis;
    const id = (current.current += 1);
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = v?.lang ?? "en-US";
    u.rate = 1.02;
    u.pitch = 0.92;
    u.onstart = () => engine.current?.duck(true);
    u.onboundary = (e) => {
      if (id === current.current) options?.onBoundary?.(e.charIndex);
    };
    u.onend = () => {
      if (id !== current.current) return;
      engine.current?.duck(false);
      options?.onEnd?.();
    };
    u.onerror = () => {
      if (id === current.current) engine.current?.duck(false);
    };
    synth.speak(u);
    return true;
  }, []);

  const say = useCallback(
    (text: string, options?: SayOptions) => {
      if (!voice && !options?.force) return false;
      if (!("speechSynthesis" in window)) return false;
      if (!unlocked.current && !options?.force) {
        // Keep the latest line; it is spoken at the first click or tap.
        pending.current = { text, options };
        return true;
      }
      unlocked.current = true;
      return speakNow(text, options);
    },
    [voice, speakNow]
  );

  // First click, tap or key press anywhere: that gesture lets the browser speak.
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.getVoices();
    const unlock = () => {
      if (unlocked.current) return;
      unlocked.current = true;
      if (!voicePref.get()) return;
      const waiting = pending.current;
      pending.current = null;
      if (waiting) speakNow(waiting.text, waiting.options);
      else if (window.scrollY < window.innerHeight * 0.6) speakNow(HERO_INTRO);
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      window.speechSynthesis.cancel();
    };
  }, [speakNow]);

  const toggleVoice = useCallback(() => {
    if (voice) {
      hush();
      voicePref.set(false);
    } else {
      voicePref.set(true);
      unlocked.current = true;
      speakNow("My voice is on. Scroll and I will talk you through my work.");
    }
  }, [voice, hush, speakNow]);

  const toggleMusic = useCallback(() => {
    if (loading.current) return;
    if (music) {
      engine.current?.stop();
      setMusic(false);
      return;
    }
    loading.current = true;
    (engine.current ? Promise.resolve(engine.current) : createEngine())
      .then((e) => {
        engine.current = e;
        e.start();
        e.duck(window.speechSynthesis?.speaking ?? false);
        setMusic(true);
      })
      .catch(() => setMusic(false))
      .finally(() => {
        loading.current = false;
      });
  }, [music]);

  const play = useCallback(
    (name: SoundName) => {
      if (music) engine.current?.play(name);
    },
    [music]
  );

  // Interface sounds for every link and button, without touching each component.
  useEffect(() => {
    if (!music) return;
    const selector = "a, button";
    let last: Element | null = null;
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(selector) ?? null;
      if (el && el !== last) engine.current?.play("hover");
      last = el;
    };
    const down = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.(selector)) engine.current?.play("click");
    };
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
    };
  }, [music]);

  // Never keep playing or talking in a background tab.
  useEffect(() => {
    const vis = () => {
      if (document.hidden) {
        hush();
        if (music) engine.current?.stop();
      } else if (music) engine.current?.start();
    };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [music, hush]);

  const value = useMemo(
    () => ({ voice, toggleVoice, music, toggleMusic, play, say, hush }),
    [voice, toggleVoice, music, toggleMusic, play, say, hush]
  );
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

const pill =
  "flex h-10 items-center gap-2 rounded-xl border-[1.5px] border-line-strong px-3 text-[0.95rem] font-medium hover:border-fg transition-colors";

export function SoundToggle() {
  const { voice, toggleVoice, music, toggleMusic } = useSound();
  return (
    <>
      <button
        type="button"
        onClick={toggleVoice}
        aria-pressed={voice}
        aria-label={voice ? "Mute Ali's voice" : "Turn Ali's voice on"}
        className={pill}
      >
        {voice ? <Volume2 size={17} aria-hidden /> : <VolumeX size={17} aria-hidden />}
        <span className="hidden xl:inline">{voice ? "Voice on" : "Voice off"}</span>
      </button>
      <button
        type="button"
        onClick={toggleMusic}
        aria-pressed={music}
        aria-label={music ? "Turn music off" : "Turn music on"}
        className={`${pill} !px-0 w-10 justify-center ${music ? "bg-sun text-on-sun !border-on-sun" : ""}`}
      >
        {music ? (
          <span className="flex h-4 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="eq-bar w-[3px] rounded-full bg-on-sun" style={{ animationDelay: `${i * 0.13}s` }} />
            ))}
          </span>
        ) : (
          <Music size={17} aria-hidden />
        )}
      </button>
    </>
  );
}
