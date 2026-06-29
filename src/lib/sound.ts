let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(freq: number, startTime: number, duration: number, gainValue = 0.08) {
  const audio = getCtx();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** Short ascending chime — module/streak/level-up celebration. */
export function playChime() {
  const audio = getCtx();
  const t = audio.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => tone(freq, t + i * 0.09, 0.35));
}

/** Tiny click for status changes / card flips. */
export function playTick() {
  const audio = getCtx();
  tone(880, audio.currentTime, 0.08, 0.05);
}
