import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chimeSound } from "../lib/soundManager";
import { prefersReducedMotion } from "../lib/motion";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = ["A", "R", "S", "H", "A", "D"];
// アルシャド (Arushado) — the closest natural katakana rendering of "Arshad"
const LETTERS_JP = ["ア", "ル", "シャ", "ド"];
// left-offset (%) for each ember inside the ensō circle
const EMBER_POSITIONS = ["38%", "47%", "55%", "44%", "60%"];

export default function Hero() {
  const rootRef = useRef(null);
  const letterRefs = useRef([]);
  const flipInnerRef = useRef(null);
  const ensoRef = useRef(null);
  const emberRefs = useRef([]);
  const hankoRef = useRef(null);
  const tategakiRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Reduced motion: show the finished composition, no choreography.
      if (prefersReduced) {
        gsap.set(ensoRef.current, { strokeDashoffset: 140 });
        gsap.set(hankoRef.current, { rotation: -8 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Name cells assemble from a scattered grid position
      letterRefs.current.forEach((el) => {
        gsap.set(el, {
          x: gsap.utils.random(-70, 70),
          y: gsap.utils.random(-50, 60),
          rotation: gsap.utils.random(-25, 25),
          opacity: 0,
        });
      });

      tl.to(letterRefs.current, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "back.out(1.6)",
      })
        .fromTo(
          ensoRef.current,
          { strokeDashoffset: 1400 },
          { strokeDashoffset: 140, duration: 1.6, ease: "power2.inOut" },
          "-=0.5"
        )
        .fromTo(
          hankoRef.current,
          { scale: 0, rotation: -35, opacity: 0 },
          {
            scale: 1,
            rotation: -8,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2.2)",
          },
          "-=1.1"
        )
        .from(
          ".hero-sub, .hero-meta, .hero-cta, .hero-status",
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 },
          "-=0.9"
        );

      // Once assembled, the name quietly flips between English and
      // the katakana rendering of it, like a signature turned over.
      if (!prefersReduced) {
        // Absolute 0 <-> 180 with yoyo, not a relative "+=180" tween —
        // relative values on a repeating timeline only resolve against
        // their *original* cached start/end, so after one cycle it was
        // silently stalling on the English face. yoyo avoids that
        // entirely and loops forever, front/back/front/back…
        const flipTl = gsap.timeline({
          repeat: 1, // flip to Japanese, hold, flip back once, then stop
          yoyo: true,
          repeatDelay: 3.4,
          delay: 2.2,
        });
        flipTl.to(flipInnerRef.current, {
          rotateY: 180,
          duration: 0.9,
          ease: "power3.inOut",
          onStart: chimeSound, // soft chime as the name turns to katakana
        });
      }

      // Embers drifting up inside the ensō — like sparks off a forge,
      // a craftsman's motion rather than a decoration
      if (!prefersReduced) {
        emberRefs.current.forEach((el, i) => {
          if (!el) return;
          const rise = gsap.utils.random(130, 220);
          const drift = gsap.utils.random(-30, 30);
          const dur = gsap.utils.random(4, 6.5);
          gsap.to(el, {
            keyframes: {
              y: [0, -rise],
              x: [0, drift],
              opacity: [0, 0.85, 0.85, 0],
              scale: [0.5, 1, 1, 0.5],
            },
            duration: dur,
            repeat: -1,
            delay: i * 0.9 + gsap.utils.random(0, 1.2),
            ease: "sine.inOut",
          });
        });
      }

      // Ambient vertical text drifts upward as the hero scrolls away
      gsap.to(tategakiRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Gentle scroll-cue pulse
      gsap.to(".hero-scroll-line", {
        scaleY: 0.4,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero-body container">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="mark" />
            <span>Frontend developer</span>
          </div>

          <div className="hero-name-wrap">
            <div className="hero-name-flip">
              <div className="hero-name-inner" ref={flipInnerRef}>
                <div className="hero-name-face hero-name-face--front">
                  <h1 className="hero-name">
                    {LETTERS.map((ch, i) => (
                      <span
                        key={ch + i}
                        ref={(el) => (letterRefs.current[i] = el)}
                        className={
                          "hero-letter" +
                          (i === 3 ? " hero-letter--accent" : "")
                        }
                      >
                        {ch}
                      </span>
                    ))}
                  </h1>
                </div>

                <div className="hero-name-face hero-name-face--back">
                  <h1 className="hero-name hero-name--jp">
                    {LETTERS_JP.map((ch, i) => (
                      <span
                        key={ch + i}
                        className={
                          "hero-letter hero-letter--jp" +
                          (i === 2 ? " hero-letter--accent" : "")
                        }
                      >
                        {ch}
                      </span>
                    ))}
                  </h1>
                  <div className="hero-name-romaji">Arushado</div>
                </div>
              </div>
            </div>

            <svg className="hero-brush" viewBox="0 0 420 30" aria-hidden="true">
              <path
                d="M4 14 Q 90 2, 180 12 T 400 10"
                fill="none"
                stroke="var(--vermillion)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <div className="hero-hanko" ref={hankoRef}>
              <span>匠</span>
            </div>
          </div>

          <p className="hero-sub">
            Frontend developer and QA engineer building React and JavaScript
            interfaces with a craftsman&rsquo;s care, and testing the REST APIs
            behind them: auth, RBAC, negative cases and SQL validation.
          </p>

          <ul className="hero-meta" aria-label="Main stack">
            <li>React</li>
            <li>TypeScript</li>
            <li>Next.js</li>
            <li className="hero-meta-aside">Laravel &amp; SQL on the backend</li>
          </ul>

          <div className="hero-cta">
            <a className="btn btn--fill" href="#works">
              View work
            </a>
            <a className="btn btn--outline" href="#letter">
              Contact
            </a>
          </div>

          <p className="hero-status">
            <span className="status-dot" />
            <span>Open to frontend and QA roles &middot; freelance welcome</span>
          </p>
        </div>

        <div className="hero-art" aria-hidden="true">
          <svg viewBox="0 0 600 600" className="hero-enso">
            <circle
              ref={ensoRef}
              cx="300"
              cy="300"
              r="230"
              fill="none"
              stroke="var(--vermillion)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="1220 1400"
              transform="rotate(-96 300 300)"
            />
          </svg>

          {/* sparks drifting up inside the circle — a craftsman's forge,
              not a static illustration */}
          <div className="hero-embers">
            {EMBER_POSITIONS.map((left, i) => (
              <span
                key={i}
                className="hero-ember"
                style={{ left }}
                ref={(el) => (emberRefs.current[i] = el)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hero-tategaki" ref={tategakiRef}>
        CRAFTED WITH CARE — FRONTEND ENGINEER — 2026
      </div>

      <div className="hero-bottom">
        <div className="hero-scroll">
          <span className="hero-scroll-line" />
          Scroll
        </div>
      </div>
    </section>
  );
}
