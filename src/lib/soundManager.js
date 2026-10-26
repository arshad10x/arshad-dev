// A small singleton that owns the one AudioContext the whole site shares,
// plus the on/off state. Kept outside React so any component (Hero's
// flip, Letter's send-stamp, the toggle button) can just import it and
// call a function — no provider wiring, no prop drilling.
//
// Browsers block audio until a user gesture, so the AudioContext is only
// ever created inside enable(), which is only ever called from a click.

import { playStamp, playChime, startAmbient } from "./sound";

let ctx = null;
let enabled = false;
let stopAmbientFn = null;
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(enabled));
}

export function isSoundEnabled() {
  return enabled;
}

export function onSoundChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function enableSound() {
  if (enabled) return;
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return; // not supported, stay silent
    ctx = new AudioContextClass();
  }
  if (ctx.state === "suspended") ctx.resume();
  enabled = true;
  stopAmbientFn = startAmbient(ctx);
  notify();
}

export function disableSound() {
  if (!enabled) return;
  enabled = false;
  stopAmbientFn?.();
  stopAmbientFn = null;
  notify();
}

export function toggleSound() {
  if (enabled) disableSound();
  else enableSound();
}

export function stampSound() {
  if (enabled && ctx) playStamp(ctx);
}

export function chimeSound() {
  if (enabled && ctx) playChime(ctx);
}
