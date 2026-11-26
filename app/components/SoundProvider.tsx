"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VolumeX } from "lucide-react";

type SoundName = "hover" | "click" | "chime" | "whoosh";

type SoundApi = {
  /** Voice, music and interface sounds are on. */
  on: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
  /**
   * Speak a line in English. Ambient lines only play when sound is on;
   * pass force for a line the visitor explicitly asked to hear.
   */
  say: (text: string, force?: boolean) => void;
  hush: () => void;
};

const SoundContext = createContext<SoundApi>({
  on: false,
  toggle: () => {},
  play: () => {},
  say: () => {},
  hush: () => {},
});

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

export const useSound = () => useContext(SoundContext);

type Engine = {
  play: (name: SoundName) => void;
  start: () => void;
  stop: () => void;
  /** Lower the music while the avatar is speaking. */
  duck: (down: boolean) => void;
};

/**
 * Builds the whole soundtrack in code with Tone.js: a slow pad, a sparse
 * pentatonic melody and a few interface sounds. Nothing is downloaded, so
 * there is no audio file to license. Loaded only when sound is switched on.
 */
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

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const engine = useRef<Engine | null>(null);
  const loading = useRef(false);

  const hush = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    engine.current?.duck(false);
  }, []);

  const speakNow = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-US";
    u.rate = 1.02;
    u.pitch = 0.92;
    u.onstart = () => engine.current?.duck(true);
    u.onend = u.onerror = () => engine.current?.duck(false);
    synth.speak(u);
  }, []);

  const say = useCallback(
    (text: string, force?: boolean) => {
      if (on || force) speakNow(text);
    },
    [on, speakNow]
  );

  // Voices load asynchronously in some browsers; ask early so the first line is not late.
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.getVoices();
    return () => window.speechSynthesis.cancel();
  }, []);

  const toggle = useCallback(() => {
    if (loading.current) return;
    if (on) {
      engine.current?.stop();
      hush();
      setOn(false);
      return;
    }
    // Speak inside the click itself: browsers only allow speech after a gesture.
    speakNow("Sound is on. Scroll down and I will talk you through my work.");
    loading.current = true;
    (engine.current ? Promise.resolve(engine.current) : createEngine())
      .then((e) => {
        engine.current = e;
        e.start();
        e.duck(window.speechSynthesis?.speaking ?? false);
        setOn(true);
      })
      .catch(() => setOn(false))
      .finally(() => {
        loading.current = false;
      });
  }, [on, hush, speakNow]);

  const play = useCallback(
    (name: SoundName) => {
      if (on) engine.current?.play(name);
    },
    [on]
  );

  // Interface sounds for every link and button, without touching each component.
  useEffect(() => {
    if (!on) return;
    const selector = "a, button, [data-cursor='hover']";
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
  }, [on]);

  // Never keep playing in a background tab.
  useEffect(() => {
    if (!on) return;
    const vis = () => {
      if (document.hidden) engine.current?.stop();
      else engine.current?.start();
    };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [on]);

  const value = useMemo(() => ({ on, toggle, play, say, hush }), [on, toggle, play, say, hush]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function SoundToggle() {
  const { on, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn voice and sound off" : "Turn voice and sound on"}
      className="flex h-10 items-center gap-2 rounded-xl border-[1.5px] border-line-strong px-3 text-[0.95rem] font-medium hover:border-fg transition-colors"
    >
      {on ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="eq-bar w-[3px] rounded-full bg-fg" style={{ animationDelay: `${i * 0.13}s` }} />
          ))}
        </span>
      ) : (
        <VolumeX size={17} aria-hidden />
      )}
      <span className="hidden md:inline">{on ? "Voice on" : "Voice off"}</span>
    </button>
  );
}
