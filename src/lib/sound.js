// Tiny Web Audio sound designer. Everything here is synthesized at
// runtime — no audio files to source, license or download, and nothing
// to add to the bundle size.

function noiseBuffer(ctx, duration = 0.05) {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  return buffer;
}

/** A soft, low wood-block "tock" — the hanko seal pressing down. */
export function playStamp(ctx, { volume = 0.4 } = {}) {
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.12);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(volume, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(oscGain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.22);

  // a touch of noise for the transient "press"
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx, 0.04);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 1200;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.35, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
  noise.start(now);
}

/** A small two-note chime — used when the name flips to Japanese. */
export function playChime(ctx, { volume = 0.28 } = {}) {
  if (!ctx) return;
  const now = ctx.currentTime;

  [660, 990].forEach((freq, i) => {
    const start = now + i * 0.06;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume * (i === 0 ? 1 : 0.6), start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1);
  });
}

/**
 * A very quiet, slowly breathing ambient drone — three detuned sines
 * through a lowpass filter, with a slow LFO on the cutoff so it never
 * sits perfectly still. Returns a stop() function.
 */
export function startAmbient(ctx, { volume = 0.035 } = {}) {
  if (!ctx) return () => {};
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(volume, now + 2.5);
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.connect(master);

  const oscillators = [110, 110 * 1.005, 165].map((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(filter);
    osc.start(now);
    return osc;
  });

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 220;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start(now);

  return function stop() {
    const stopTime = ctx.currentTime;
    master.gain.cancelScheduledValues(stopTime);
    master.gain.setValueAtTime(master.gain.value, stopTime);
    master.gain.linearRampToValueAtTime(0, stopTime + 0.8);
    oscillators.forEach((osc) => osc.stop(stopTime + 0.9));
    lfo.stop(stopTime + 0.9);
  };
}
