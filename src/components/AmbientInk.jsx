import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";
import "./AmbientInk.css";

/**
 * A very subtle layer of drifting dust / falling-petal motes behind the
 * whole page. Pure canvas (no 3D library needed for something this
 * restrained) — purely ambient, never competes with the content.
 * Skipped entirely on reduced-motion or small screens for performance.
 */
export default function AmbientInk() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || window.innerWidth < 720) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let width, height;
    let motes = [];

    const COUNT = 26;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      motes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.6,
        speed: Math.random() * 0.18 + 0.05,
        drift: Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.25 + 0.05,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ede6d6";
      motes.forEach((m) => {
        m.y += m.speed;
        m.x += m.drift;
        if (m.y > height) {
          m.y = -4;
          m.x = Math.random() * width;
        }
        ctx.globalAlpha = m.alpha;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

    // Don't burn battery drawing motes in a background tab.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) tick();
    };

    init();
    tick();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="ambient-ink" ref={canvasRef} aria-hidden="true" />;
}
