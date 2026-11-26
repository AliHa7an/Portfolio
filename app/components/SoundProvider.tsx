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
import { speak, speech, stopSpeech, unlockAudio } from "../story/speech";

type SoundName = "hover" | "click" | "chime" | "whoosh";

export type SayOptions = {
  /** Speak even if voice is off: the visitor pressed a Listen button. */
  force?: boolean;
};

type SoundApi = {
  /** His voice. On by default; starts at the visitor's first click, tap or key press. */
  voice: boolean;
  toggleVoice: () => void;
  /** Soft background music and interface sounds. On by default, kept under the voice. */
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
  music: true,
  toggleMusic: () => {},
  play: () => {},
  say: () => false,
  hush: () => {},
});

export const useSound = () => useContext(SoundContext);

/** Live state of his voice: what he is saying, how far in, how loud. */
export const useSpeech = () => useSyncExternalStore(speech.subscribe, speech.get, speech.server);

/* ─── On/off choices, remembered across visits ───────────────── */

function makePref(key: string) {
  const listeners = new Set<() => void>();
  return {
    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    get() {
      try {
        return window.localStorage.getItem(key) !== "1";
      } catch {
        return true;
      }
    },
    set(on: boolean) {
      try {
        window.localStorage.setItem(key, on ? "0" : "1");
      } catch {
        // Storage blocked: the choice lasts for this visit only.
      }
      listeners.forEach((l) => l());
    },
  };
}

const voicePref = makePref("voice-off");
const musicPref = makePref("music-off");

/* ─── Music and interface sounds (Tone.js, generated in code) ── */

type Engine = {
  play: (name: SoundName) => void;
  start: () => void;
  stop: () => void;
  /** Lower the music while he is speaking. */
  duck: (down: boolean) => void;
};

/** Music sits well under the voice, and drops further while he speaks. */
const LEVEL = 0.34;
const DUCKED = 0.08;

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
      master.gain.rampTo(down ? DUCKED : LEVEL, 0.4);
    },
    start() {
      chordLoop.start(0);
      bellLoop.start("1m");
      transport.start();
      master.gain.rampTo(LEVEL, 2);
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
  const music = useSyncExternalStore(musicPref.subscribe, musicPref.get, () => true);
  const [playing, setPlaying] = useState(false);
  const engine = useRef<Engine | null>(null);
  const loading = useRef(false);
  /** Browsers refuse to make sound until the visitor has clicked, tapped or typed. */
  const unlocked = useRef(false);
  const pending = useRef<string | null>(null);

  const hush = useCallback(() => {
    pending.current = null;
    stopSpeech();
  }, []);

  const say = useCallback(
    (text: string, options?: SayOptions) => {
      if (!voice && !options?.force) return false;
      if (!unlocked.current && !options?.force) {
        // Keep the latest line; it is spoken at the first click or tap.
        pending.current = text;
        return true;
      }
      unlocked.current = true;
      return speak(text);
    },
    [voice]
  );

  const startMusic = useCallback(() => {
    if (loading.current || engine.current) {
      engine.current?.start();
      setPlaying(true);
      return;
    }
    loading.current = true;
    createEngine()
      .then((e) => {
        engine.current = e;
        e.start();
        e.duck(speech.get().active);
        setPlaying(true);
      })
      .catch(() => setPlaying(false))
      .finally(() => {
        loading.current = false;
      });
  }, []);

  // First click, tap or key press anywhere: that gesture lets the browser make sound.
  useEffect(() => {
    const unlock = () => {
      if (unlocked.current) return;
      unlocked.current = true;
      unlockAudio();
      if (voicePref.get()) {
        const waiting = pending.current;
        pending.current = null;
        if (waiting) speak(waiting);
        else if (window.scrollY < window.innerHeight * 0.6) speak(HERO_INTRO);
      }
      if (musicPref.get()) startMusic();
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      stopSpeech();
    };
  }, [startMusic]);

  // The music steps back whenever he speaks.
  useEffect(() => {
    let was = false;
    const stop = speech.subscribe(() => {
      const now = speech.get().active;
      if (now !== was) engine.current?.duck(now);
      was = now;
    });
    return () => {
      stop();
    };
  }, []);

  const toggleVoice = useCallback(() => {
    if (voice) {
      hush();
      voicePref.set(false);
    } else {
      voicePref.set(true);
      unlocked.current = true;
      speak("My voice is on. Scroll and I will talk you through my work.");
    }
  }, [voice, hush]);

  const toggleMusic = useCallback(() => {
    if (music) {
      musicPref.set(false);
      engine.current?.stop();
      setPlaying(false);
    } else {
      musicPref.set(true);
      unlocked.current = true;
      startMusic();
    }
  }, [music, startMusic]);

  const play = useCallback(
    (name: SoundName) => {
      if (playing) engine.current?.play(name);
    },
    [playing]
  );

  // Interface sounds for every link and button, without touching each component.
  useEffect(() => {
    if (!playing) return;
    const selector = "a, button";
    let last: Element | null = null;
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(selector) ?? null;
      if (target && target !== last) engine.current?.play("hover");
      last = target;
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
  }, [playing]);

  // Never keep playing or talking in a background tab.
  useEffect(() => {
    const vis = () => {
      if (document.hidden) {
        hush();
        if (playing) engine.current?.stop();
      } else if (playing) engine.current?.start();
    };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [playing, hush]);

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
        aria-label={music ? "Turn background music off" : "Turn background music on"}
        className={pill}
      >
        {music ? (
          <span className="flex h-4 w-[17px] items-end justify-center gap-[3px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="eq-bar w-[3px] rounded-full bg-fg" style={{ animationDelay: `${i * 0.13}s` }} />
            ))}
          </span>
        ) : (
          <Music size={17} className="opacity-50" aria-hidden />
        )}
        <span className="hidden xl:inline">{music ? "Music on" : "Music off"}</span>
      </button>
    </>
  );
}
