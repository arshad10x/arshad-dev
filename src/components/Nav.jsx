import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../lib/motion";
import "./Nav.css";

const LINKS = [
  { id: "profile", label: "About" },
  { id: "tools", label: "Tools" },
  { id: "works", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "letter", label: "Contact" },
];

export default function Nav() {
  const navRef = useRef(null);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.from(navRef.current, {
      y: -24,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
    });
  }, []);

  // Highlight whichever section crosses the middle of the viewport.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setActive("");
    }, { rootMargin: "-45% 0px -50% 0px" });
    if (hero) heroIo.observe(hero);

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      heroIo.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={"nav" + (scrolled ? " is-scrolled" : "")} ref={navRef}>
      <a className="nav-mark" href="#top">
        <span className="nav-seal" aria-hidden="true">匠</span>
        <span className="nav-name">Arshad</span>
      </a>
      <nav aria-label="Primary">
        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={"#" + link.id}
                className={active === link.id ? "is-active" : undefined}
                aria-current={active === link.id ? "location" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
