import manifest from "./voice.json";

/**
 * His voice. Every line he says on the site was pre-recorded with a neural
 * voice into /public/voice, so he sounds the same in every browser. Each clip
 * comes with a loudness envelope (one digit per 50ms), which is what moves his
 * lips and paces the captions. Lines without a clip fall back to the browser's
 * own speech synthesis.
 */
type Clip = { src: string; d: number; env: string };
const clips = manifest as Record<string, Clip>;

export type SpeechState = {
  /** The line being spoken, or null. */
  text: string | null;
  active: boolean;
  /** Character he has reached in `text`. */
  pos: number;
  /** Loudness right now, 0 to 1. */
  level: number;
};

const idle: SpeechState = { text: null, active: false, pos: 0, level: 0 };
let state = idle;
const listeners = new Set<() => void>();

export const speech = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get: () => state,
  server: () => idle,
};

function set(next: SpeechState) {
  state = next;
  listeners.forEach((l) => l());
}

let audio: HTMLAudioElement | null = null;
let raf = 0;
let timer = 0;
let token = 0;

function el() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
  }
  return audio;
}

/** Call inside the visitor's first click or tap so later clips are allowed to play. */
export function unlockAudio() {
  const a = el();
  if (!a.src) {
    // A few milliseconds of silence is enough to mark the element as user-started.
    a.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
    a.play().catch(() => {});
  }
}

export function stopSpeech() {
  token += 1;
  cancelAnimationFrame(raf);
  window.clearInterval(timer);
  audio?.pause();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (state.active || state.text) set(idle);
}

/** Best available English voice for lines that have no recorded clip. */
function pickVoice(): SpeechSynthesisVoice | null {
  const english = window.speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
  const wanted = [
    /Microsoft (Andrew|Brian|Guy|Ryan|Davis|Christopher).*(Natural|Online)/i,
    /Google UK English Male/i,
    /\b(Daniel|Arthur|Oliver|Aaron|Evan)\b/i,
    /\bMale\b/i,
  ];
  for (const re of wanted) {
    const v = english.find((voice) => re.test(voice.name));
    if (v) return v;
  }
  return english[0] ?? null;
}

function speakWithBrowser(text: string, id: number) {
  if (!("speechSynthesis" in window)) {
    set(idle);
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = v?.lang ?? "en-US";
  u.rate = 1.04;
  u.pitch = 1.05;
  let pos = 0;
  u.onboundary = (e) => {
    pos = e.charIndex;
  };
  const finish = () => {
    if (id !== token) return;
    window.clearInterval(timer);
    set(idle);
  };
  u.onend = finish;
  u.onerror = finish;
  window.clearInterval(timer);
  timer = window.setInterval(() => {
    if (id !== token) return;
    pos = Math.min(text.length, pos + 0.8);
    // No loudness data here, so open and close on a simple rhythm.
    set({ text, active: true, pos, level: 0.45 + 0.4 * Math.abs(Math.sin(pos * 0.9)) });
  }, 50);
  window.speechSynthesis.speak(u);
}

/** Speak a line. Returns false if nothing can speak in this browser. */
export function speak(text: string): boolean {
  stopSpeech();
  const id = (token += 1);
  const clip = clips[text];
  if (!clip) {
    if (!("speechSynthesis" in window)) return false;
    set({ text, active: true, pos: 0, level: 0 });
    speakWithBrowser(text, id);
    return true;
  }

  // Share of the voiced time elapsed at each 50ms step: captions and lips
  // advance only while he is actually making sound.
  const env = Array.from(clip.env, Number);
  const voiced = env.map((v) => (v >= 2 ? 1 : 0));
  const total = Math.max(1, voiced.reduce<number>((a, b) => a + b, 0));
  const cum: number[] = [];
  voiced.reduce<number>((acc, v, i) => (cum[i] = acc + v), 0);

  const a = el();
  a.src = clip.src;
  a.currentTime = 0;
  set({ text, active: true, pos: 0, level: 0 });

  const frame = () => {
    if (id !== token) return;
    const i = Math.min(env.length - 1, Math.floor(a.currentTime / 0.05));
    set({ text, active: true, pos: (text.length * cum[i]) / total, level: env[i] / 9 });
    raf = requestAnimationFrame(frame);
  };
  a.onended = () => {
    if (id !== token) return;
    cancelAnimationFrame(raf);
    set(idle);
  };
  a.onerror = () => {
    if (id !== token) return;
    cancelAnimationFrame(raf);
    speakWithBrowser(text, id);
  };
  a.play()
    .then(() => {
      if (id === token) raf = requestAnimationFrame(frame);
    })
    .catch(() => {
      if (id === token) set(idle);
    });
  return true;
}
