import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills, skillGroups } from "../data/content";
import { prefersReducedMotion } from "../lib/motion";
import "./Tools.css";

gsap.registerPlugin(ScrollTrigger);

const accentByName = Object.fromEntries(skills.map((s) => [s.name, s.accent]));

export default function Tools() {
  const rootRef = useRef(null);
  const groupRefs = useRef([]);
  const ruleRefs = useRef([]);
  const cellGroupRefs = useRef([]); // array of arrays, one per group

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      skillGroups.forEach((group, gi) => {
        const groupEl = groupRefs.current[gi];
        const rule = ruleRefs.current[gi];
        const cells = cellGroupRefs.current[gi] || [];
        if (!groupEl) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: groupEl, start: "top 85%" },
        });

        tl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power2.out", transformOrigin: "left center" }
        ).fromTo(
          cells,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.25"
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="tools" id="tools" ref={rootRef}>
      <div className="tools-header container">
        <div className="eyebrow">
          <span className="mark" />
          <span>道具 — Tools</span>
        </div>
        <h2>Tools of the trade</h2>
        <div className="tools-sub">
          {skills.length} tools, grouped by what they&rsquo;re for
        </div>
      </div>

      <div className="tools-groups container">
        {skillGroups.map((group, gi) => {
          return (
            <div
              className="tgroup"
              key={group.label}
              ref={(el) => (groupRefs.current[gi] = el)}
            >
              <div className="tgroup-label">
                <span>{group.label}</span>
                <span className="tgroup-rule" ref={(el) => (ruleRefs.current[gi] = el)} />
              </div>

              <div className="tgroup-row">
                {group.items.map((name, ci) => {
                  const accent = accentByName[name] || "wood";
                  return (
                    <div
                      className="tcell"
                      key={name}
                      ref={(el) => {
                        if (!cellGroupRefs.current[gi]) cellGroupRefs.current[gi] = [];
                        cellGroupRefs.current[gi][ci] = el;
                      }}
                    >
                      <span className={`mk mk--${accent}`} />
                      <span className="label">{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
