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
  const sealRef = useRef(null);
  const rippleRef = useRef(null);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(navRef.current, { clearProps: "opacity,transform" });
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

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

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (!prefersReducedMotion()) {
      gsap
        .timeline()
        .to(sealRef.current, { scale: 0.9, duration: 0.1, ease: "power2.in" })
        .to(sealRef.current, { scale: 1, duration: 0.35, ease: "elastic.out(1,0.45)" })
        .fromTo(
          rippleRef.current,
          { scale: 0.6, opacity: 0.5 },
          { scale: 2.2, opacity: 0, duration: 0.6, ease: "power2.out" },
          "<"
        );
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={"nav" + (scrolled ? " is-scrolled" : "")} ref={navRef}>
      <a className="nav-mark" href="#top" onClick={handleLogoClick}>
        <span className="nav-seal" ref={sealRef} aria-hidden="true">
          @Arsh10x
          <span className="nav-seal-ripple" ref={rippleRef} />
        </span>
        <span className="sr-only">Arsh10x — back to top</span>
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