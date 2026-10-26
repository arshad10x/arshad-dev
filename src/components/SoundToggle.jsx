import { useEffect, useState } from "react";
import { isSoundEnabled, onSoundChange, toggleSound } from "../lib/soundManager";
import "./SoundToggle.css";

const HINT_AUTO_HIDE_MS = 6000;

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(isSoundEnabled());
  const [showHint, setShowHint] = useState(false);

  useEffect(() => onSoundChange(setEnabled), []);

  // Give the page a beat to settle, then nudge first-time visitors
  // toward the toggle. Dismissed the moment they click it, or on its
  // own after a few seconds either way.
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const openTimer = setTimeout(() => setShowHint(true), 1400);
    const closeTimer = setTimeout(
      () => setShowHint(false),
      1400 + HINT_AUTO_HIDE_MS
    );
    if (prefersReduced) {
      clearTimeout(openTimer);
      return () => clearTimeout(closeTimer);
    }
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleClick = () => {
    toggleSound();
    setShowHint(false);
  };

  return (
    <div className="sound-toggle-wrap">
      <div
        className={"sound-hint" + (showHint ? " is-visible" : "")}
        role="status"
      >
        <span className="sound-hint-jp">音を鳴らす</span>
        <span className="sound-hint-en">try it with sound on</span>
      </div>

      <button
        type="button"
        className={
          "sound-toggle" +
          (enabled ? " is-on" : "") +
          (showHint ? " is-glowing" : "")
        }
        onClick={handleClick}
        aria-pressed={enabled}
        aria-label={enabled ? "Turn sound off" : "Turn sound on"}
        title={enabled ? "Sound on" : "Sound off"}
      >
        <span className="sound-toggle-glyph" aria-hidden="true">音</span>
        <span className="sound-toggle-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
    </div>
  );
}
