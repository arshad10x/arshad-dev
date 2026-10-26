import { useLayoutEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowRight } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { stampSound } from "../lib/soundManager";
import { contactMeta } from "../data/content";
import { prefersReducedMotion } from "../lib/motion";
import "./Letter.css";

gsap.registerPlugin(ScrollTrigger);

const PILL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
};

export default function Letter() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const metaRefs = useRef([]);
  const ruleRefs = useRef([]);
  const sendRef = useRef(null);
  const rippleRef = useRef(null);
  const sparkRefs = useRef([]);
  // idle | sending | sent | mailto | error
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { clipPath: "inset(0 100% 0 0)", filter: "blur(6px)", opacity: 0.4 },
        {
          clipPath: "inset(0 0% 0 0)",
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      gsap.fromTo(
        metaRefs.current,
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      ruleRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power2.out",
            transformOrigin: "left center",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          }
        );
      });

      gsap.fromTo(
        sendRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const email = useMemo(() => contactMeta.find((r) => r.label === "Email"), []);
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;

  const playSendEffect = () => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline()
      .to(sendRef.current, { scale: 0.96, duration: 0.1, ease: "power2.in" })
      .to(sendRef.current, { scale: 1, duration: 0.3, ease: "elastic.out(1,0.4)" })
      .fromTo(
        rippleRef.current,
        { scaleX: 0.3, opacity: 0.6 },
        { scaleX: 1, opacity: 0, duration: 0.7, ease: "power2.out" },
        "<"
      )
      .fromTo(
        sparkRefs.current,
        { x: 0, y: 0, scale: 0.9, opacity: 1 },
        {
          x: () => gsap.utils.random(-45, 45),
          y: () => gsap.utils.random(-45, 10),
          scale: 0,
          opacity: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: "power2.out",
        },
        "<"
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Honeypot: real visitors never see or fill this field.
    if (data.website) {
      setStatus("sent");
      return;
    }

    if (!endpoint) {
      const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      window.location.href = `mailto:${email?.value}?subject=${subject}&body=${body}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      formRef.current?.reset();
      stampSound();
      playSendEffect();
    } catch {
      setStatus("error");
    }
  };

  const busy = status === "sending";
  const buttonText =
    status === "sending" ? "Sending…" : status === "sent" ? "Message sent" : "Send message";

  return (
    <section className="letter" id="letter" ref={sectionRef}>
      <div className="letter-inner container">
        <div className="eyebrow">
          <span className="mark" />
          <span>Contact</span>
        </div>

        <div className="letter-grid">
          <div className="letter-left">
            <h2 className="letter-title" ref={titleRef}>
              Got something <em>worth building?</em>
              <br />
              Let&rsquo;s talk.
            </h2>
            <p className="letter-sub" ref={subRef}>
              Open for freelance work and new roles — reach out directly, or
              use the form and I&rsquo;ll reply within a day or two.
            </p>

            <div className="letter-meta">
              {contactMeta.map((row, i) => (
                <div
                  className="letter-meta-row"
                  key={row.label}
                  ref={(el) => (metaRefs.current[i] = el)}
                >
                  <span className="k">{row.label}</span>
                  <span className="v">
                    {row.href && <a href={row.href}>{row.value}</a>}
                    {row.value && !row.href && row.value}
                    {row.links && (
                      <span className="letter-pills">
                        {row.links.map((l) => {
                          const Icon = PILL_ICONS[l.label];
                          return (
                            <a
                              key={l.label}
                              className="letter-pill"
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {Icon && <Icon size={14} aria-hidden="true" />}
                              {l.label}
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          );
                        })}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="letter-right">
            <form className="letter-form" ref={formRef} onSubmit={handleSubmit}>
              <div className="letter-field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" autoComplete="name" placeholder="Your name" required />
                <div className="letter-rule" ref={(el) => (ruleRefs.current[0] = el)} />
              </div>
              <div className="letter-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
                <div className="letter-rule" ref={(el) => (ruleRefs.current[1] = el)} />
              </div>
              <div className="letter-field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} placeholder="What are you building?" required />
                <div className="letter-rule" ref={(el) => (ruleRefs.current[2] = el)} />
              </div>

              {/* honeypot — hidden from people and screen readers */}
              <div className="letter-hp" aria-hidden="true">
                <label htmlFor="website">Leave this empty</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <button type="submit" className="letter-send" ref={sendRef} disabled={busy}>
                <span className="letter-send-ripple" ref={rippleRef} />
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="letter-spark" ref={(el) => (sparkRefs.current[i] = el)} />
                ))}
                <span className="letter-send-text">
                  {buttonText}
                  {!busy && <FiArrowRight className="letter-send-arrow" size={16} aria-hidden="true" />}
                </span>
              </button>

              <p
                className={"letter-status" + (status === "error" ? " is-error" : "")}
                role="status"
                aria-live="polite"
              >
                {status === "sent" && "Thanks — I\u2019ll reply within a day or two."}
                {status === "mailto" &&
                  `Your email app should open with the message filled in. If nothing happens, write to ${email?.value}.`}
                {status === "error" &&
                  `That didn\u2019t send. Check your connection and try again, or email ${email?.value}.`}
              </p>
            </form>
          </div>
        </div>
      </div>

      <footer className="letter-footer">
        {/* <span className="letter-footer-seal">匠</span> */}
        <span>Ars10x — Oct 2026</span>
      </footer>
    </section>
  );
}