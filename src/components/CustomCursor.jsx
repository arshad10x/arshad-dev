import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./CustomCursor.css";

// Anything the ring should "wake up" for
const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, .tools-tag, .hero-letter";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Touch devices and reduced-motion get the normal system cursor
    if (!isFinePointer || prefersReduced) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onEnter = () => ring.classList.add("is-active");
    const onLeave = () => ring.classList.remove("is-active");
    const onDown = () => dot.classList.add("is-pressed");
    const onUp = () => dot.classList.remove("is-pressed");

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Delegate hover state instead of binding per-element, so it still
    // works for anything added to the DOM after this effect runs
    const onPointerOver = (e) => {
      if (e.target.closest(INTERACTIVE_SELECTOR)) onEnter();
    };
    const onPointerOut = (e) => {
      if (
        e.target.closest(INTERACTIVE_SELECTOR) &&
        !e.relatedTarget?.closest(INTERACTIVE_SELECTOR)
      ) {
        onLeave();
      }
    };
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);

    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <span className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <span className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
