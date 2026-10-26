import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sets up Lenis smooth scrolling and wires it into GSAP's ticker so
 * ScrollTrigger stays in sync. Call once at the app root.
 * Reduced-motion visitors keep native scrolling.
 */
export default function useLenis() {
  // Web fonts change text height after first paint; recompute trigger
  // positions once they land so reveals fire at the right scroll point.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const resize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", resize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      lenis.destroy();
    };
  }, []);
}
