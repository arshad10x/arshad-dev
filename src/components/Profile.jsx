import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "../data/content";
import { prefersReducedMotion } from "../lib/motion";
import "./Profile.css";

gsap.registerPlugin(ScrollTrigger);

export default function Profile() {
  const rootRef = useRef(null);
  const watermarkRef = useRef(null);
  const statRefs = useRef([]);
  const latticeRefs = useRef([]);
  const kickerRef = useRef(null);
  const bioRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      // Watermark drifts slowly behind everything
      gsap.to(watermarkRef.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Stat callouts rise in with a slight stagger
      gsap.fromTo(
        statRefs.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        }
      );

      // Kumiko lattice draws itself in, line by line. Each shape gets a
      // dasharray matching its own length first, so the dashoffset tween
      // reads as a stroke being drawn rather than just fading in.
      gsap.set(latticeRefs.current, {
        strokeDasharray: (i, el) => el.getTotalLength(),
        strokeDashoffset: (i, el) => el.getTotalLength(),
        opacity: 0,
      });
      gsap.to(latticeRefs.current, {
        opacity: 0.55,
        strokeDashoffset: 0,
        duration: 1,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
      });

      // Pull-quote kicker: ink-bloom reveal
      gsap.fromTo(
        kickerRef.current,
        { clipPath: "inset(0 100% 0 0)", filter: "blur(6px)", opacity: 0.4 },
        {
          clipPath: "inset(0 0% 0 0)",
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: kickerRef.current, start: "top 82%" },
        }
      );

      // Supporting bio fades in just after
      gsap.fromTo(
        bioRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.25,
          ease: "power2.out",
          scrollTrigger: { trigger: bioRef.current, start: "top 80%" },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="profile" id="profile" ref={rootRef}>
      <div className="watermark profile-watermark" ref={watermarkRef} aria-hidden="true">
        自己紹介
      </div>

      <div className="profile-inner container">
        <div className="eyebrow">
          <span className="mark" />
          <span>About</span>
        </div>

        <div className="profile-grid">
          <div className="profile-left">
            <svg
              className="profile-lattice"
              viewBox="0 0 300 340"
              aria-hidden="true"
            >
              <g
                fill="none"
                stroke="var(--vermillion)"
                strokeWidth="1"
              >
                <rect
                  x="4"
                  y="4"
                  width="292"
                  height="332"
                  ref={(el) => (latticeRefs.current[0] = el)}
                />
                <line
                  x1="4"
                  y1="4"
                  x2="296"
                  y2="336"
                  ref={(el) => (latticeRefs.current[1] = el)}
                />
                <line
                  x1="296"
                  y1="4"
                  x2="4"
                  y2="336"
                  ref={(el) => (latticeRefs.current[2] = el)}
                />
                <line
                  x1="150"
                  y1="4"
                  x2="150"
                  y2="336"
                  ref={(el) => (latticeRefs.current[3] = el)}
                />
                <line
                  x1="4"
                  y1="170"
                  x2="296"
                  y2="170"
                  ref={(el) => (latticeRefs.current[4] = el)}
                />
                <circle
                  cx="150"
                  cy="170"
                  r="58"
                  ref={(el) => (latticeRefs.current[5] = el)}
                />
                <circle
                  cx="150"
                  cy="170"
                  r="30"
                  ref={(el) => (latticeRefs.current[6] = el)}
                />
                <rect
                  x="110"
                  y="130"
                  width="80"
                  height="80"
                  transform="rotate(45 150 170)"
                  ref={(el) => (latticeRefs.current[7] = el)}
                />
              </g>
              <g fill="none" stroke="var(--wood)" strokeWidth="0.6">
                <line
                  x1="4"
                  y1="90"
                  x2="150"
                  y2="4"
                  ref={(el) => (latticeRefs.current[8] = el)}
                />
                <line
                  x1="150"
                  y1="4"
                  x2="296"
                  y2="90"
                  ref={(el) => (latticeRefs.current[9] = el)}
                />
                <line
                  x1="296"
                  y1="250"
                  x2="150"
                  y2="336"
                  ref={(el) => (latticeRefs.current[10] = el)}
                />
                <line
                  x1="150"
                  y1="336"
                  x2="4"
                  y2="250"
                  ref={(el) => (latticeRefs.current[11] = el)}
                />
              </g>
            </svg>
          </div>

          <div className="profile-right">
            <p className="profile-kicker" ref={kickerRef}>
              I build frontend systems the way a <em>QA engineer builds trust</em> —
              clean architecture, considered motion, and interfaces tested before
              they&rsquo;re trusted.
            </p>

            <p className="profile-bio" ref={bioRef}>
              Fullstack developer working mainly in React, JavaScript and Flutter,
              with Laravel and SQL on the backend. Started in QA, so testing
              isn&rsquo;t an afterthought — it&rsquo;s built into how I ship. Quick
              to pick up new tools, and used to shaping clean, user-friendly builds
              directly with clients — currently open for freelance work and looking
              for something worth the attention.
            </p>

            <dl className="profile-stats">
              {stats.map((st, i) => (
                <div
                  className="profile-stat"
                  key={st.unit}
                  ref={(el) => (statRefs.current[i] = el)}
                >
                  <dt className="profile-stat-num">
                    {st.num}
                    <small>{st.unit}</small>
                  </dt>
                  <dd className="profile-stat-label">{st.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
