import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "../data/content";
import { prefersReducedMotion } from "../lib/motion";
import "./Journey.css";

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const lineRef = useRef(null);
  const entryRefs = useRef([]);
  const dotRefs = useRef([]);
  const dateRefs = useRef([]);

  // Measure where the dots actually render and feed that to the CSS line,
  // instead of trusting a calc() guess that can drift from container padding.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const positionAxis = () => {
      const firstDot = dotRefs.current.find(Boolean);
      if (!firstDot) return;
      const trackRect = track.getBoundingClientRect();
      const dotRect = firstDot.getBoundingClientRect();
      const x = dotRect.left + dotRect.width / 2 - trackRect.left;
      track.style.setProperty("--axis-x", `${x}px`);
    };

    positionAxis();

    const ro = new ResizeObserver(positionAxis);
    ro.observe(track);
    window.addEventListener("resize", positionAxis);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", positionAxis);
    };
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      // Axis fills downward in one continuous stroke as the section scrolls by
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      entryRefs.current.forEach((el, i) => {
        if (!el) return;
        const dot = dotRefs.current[i];
        const date = dateRefs.current[i];

        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );

        gsap.fromTo(
          date,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            delay: 0.15,
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );

        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            gsap.to(dot, {
              scale: self.isActive ? 1.6 : 1,
              backgroundColor: self.isActive
                ? "var(--vermillion)"
                : "var(--washi)",
              duration: 0.4,
              ease: "power2.out",
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="journey" id="journey" ref={sectionRef}>
      <div className="journey-header container">
        <div className="eyebrow">
          <span className="mark" />
          <span>歩んだ道 — Path walked</span>
        </div>
        <h2>Journey</h2>
      </div>

      <div className="journey-track container" ref={trackRef}>
        <div className="journey-axis-track" aria-hidden="true">
          <div className="journey-axis-fill" ref={lineRef} />
        </div>

        {journey.map((item, i) => (
          <div
            className={"journey-entry" + (item.active ? " is-current" : "")}
            key={item.role}
            ref={(el) => (entryRefs.current[i] = el)}
          >
            <div className="journey-date" ref={(el) => (dateRefs.current[i] = el)}>
              {item.date}
            </div>
            <div className="journey-dot-col">
              <span
                className="journey-dot"
                ref={(el) => (dotRefs.current[i] = el)}
              />
            </div>
            <div className="journey-content">
              <h3>{item.role}</h3>
              <div className="journey-org">{item.org}</div>
              <p>{item.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}