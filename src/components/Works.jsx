import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/content";
import { prefersReducedMotion } from "../lib/motion";
import "./Works.css";

gsap.registerPlugin(ScrollTrigger);

const featured = projects.filter((p) => p.featured);
const more = projects.filter((p) => !p.featured);

const tagsOf = (p) => p.stack.split("・").map((t) => t.trim());

function ProjectLinks({ project }) {
  if (!project.live && !project.repo) return null;
  return (
    <div className="project-links">
      {project.live && (
        <a href={project.live} target="_blank" rel="noopener noreferrer">
          Live demo<span className="sr-only"> of {project.title} (opens in a new tab)</span>
        </a>
      )}
      {project.repo && (
        <a href={project.repo} target="_blank" rel="noopener noreferrer">
          Source code<span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

// Phone-frame strip of screenshots — used when a project has `images`
// and no explicit frame type (or frame === "phone").
function PhoneShots({ images }) {
  return (
    <div className="fstrip-shots">
      {images.map((img) => (
        <div className="phone" key={img.src}>
          <img src={img.src} alt={img.alt || ""} loading="lazy" />
          {img.label && <span className="phone-label">{img.label}</span>}
        </div>
      ))}
    </div>
  );
}

// Single browser-chrome mockup — used when frame === "browser".
// Expects a single image at p.image (or the first of p.images).
function BrowserShot({ src, alt }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <span className="browser-dot" />
        <span className="browser-dot" />
        <span className="browser-dot" />
      </div>
      <div className="browser-screen">
        <img src={src} alt={alt || ""} loading="lazy" />
      </div>
    </div>
  );
}

function FeaturedVisual({ project }) {
  if (project.frame === "browser") {
    const src = project.image || project.images?.[0]?.src;
    if (src) return <BrowserShot src={src} alt={project.title} />;
  }
  if (project.images?.length) return <PhoneShots images={project.images} />;
  return <span className="fstrip-numeral">{project.numeral}</span>;
}

export default function Works() {
  const sectionRef = useRef(null);
  const stripRefs = useRef([]);
  const glyphRefs = useRef([]);
  const bodyRefs = useRef([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      stripRefs.current.forEach((strip, i) => {
        if (!strip) return;
        const glyph = glyphRefs.current[i];
        const body = bodyRefs.current[i];
        const fromSide = i % 2 === 0 ? -36 : 36;
        const trigger = { trigger: strip, start: "top 78%" };

        gsap.fromTo(glyph, { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out", scrollTrigger: trigger });
        gsap.fromTo(body, { opacity: 0, x: fromSide },
          { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", scrollTrigger: trigger });

        // slow drift on the visual as the strip scrolls past
        gsap.to(glyph, {
          yPercent: i % 2 === 0 ? -10 : 10,
          ease: "none",
          scrollTrigger: { trigger: strip, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="works" id="works" ref={sectionRef}>
      <div className="works-header container">
        <div className="eyebrow">
          <span className="mark" />
          <span>絵巻 — Projects</span>
        </div>
        <h2>Selected work</h2>
        <p className="works-hint">
          {featured.length} projects in depth, then {more.length} smaller builds.
        </p>
      </div>

      <div className="works-folio container">
        {featured.map((p, i) => (
          <article
            className={"fstrip" + (i % 2 === 1 ? " fstrip--rev" : "")}
            key={p.title}
            ref={(el) => (stripRefs.current[i] = el)}
          >
            <div
              className="fstrip-glyph"
              aria-hidden="true"
              ref={(el) => (glyphRefs.current[i] = el)}
            >
              <FeaturedVisual project={p} />
            </div>

            <div className="fstrip-body" ref={(el) => (bodyRefs.current[i] = el)}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              {p.role && (
                <p className="fstrip-role">
                  <span>My role</span>
                  <span className="fstrip-role-text">{p.role}</span>
                </p>
              )}
              {p.outcome && (
                <p className="fstrip-role">
                  <span>Result</span>
                  <span className="fstrip-role-text">{p.outcome}</span>
                </p>
              )}
              <ul className="fstrip-stack" aria-label="Built with">
                {tagsOf(p).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <ProjectLinks project={p} />
            </div>
          </article>
        ))}
      </div>

      <div className="works-more container">
        <h3 className="works-more-title">More builds</h3>
        {/* <div className="works-more-grid">
          {more.map((p) => (
            <article className="mcard" key={p.title}>
              {p.image && (
                <div className="mcard-thumb">
                  <img src={p.image} alt="" loading="lazy" />
                </div>
              )}
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
              <ul className="fstrip-stack" aria-label="Built with">
                {tagsOf(p).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <ProjectLinks project={p} />
            </article>
          ))}
        </div> */}
      </div>
    </section>
  );
}