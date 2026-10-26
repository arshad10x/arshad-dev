import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../lib/motion";
import "./IntroSplash.css";

const SESSION_KEY = "intro-seen";

export default function IntroSplash({ onDone }) {
    const [active, setActive] = useState(() => {
        try {
            return !sessionStorage.getItem(SESSION_KEY);
        } catch {
            return true;
        }
    });

    const rootRef = useRef(null);
    const videoRef = useRef(null);
    const smokeRef = useRef(null);

    useEffect(() => {
        if (!active) {
            onDone?.();
            return undefined;
        }

        try {
            sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
            /* private mode etc — fine to just replay next time */
        }

        document.documentElement.style.overflow = "hidden";

        if (prefersReducedMotion()) {
            document.documentElement.style.overflow = "";
            setActive(false);
            onDone?.();
            return undefined;
        }

        const tl = gsap.timeline({
            defaults: { ease: "sine.inOut" },
            onComplete: () => {
                document.documentElement.style.overflow = "";
                setActive(false);
                onDone?.();
            },
        });

        tl.to({}, { duration: 0.9 })
            .to(
                smokeRef.current,
                { opacity: 0.82, scale: 1.12, x: 20, duration: 1.8 },
                "smoke"
            )
            .to({}, { duration: 0.3 }, "smoke+=1.8")
            .to(rootRef.current, { autoAlpha: 0, duration: 0.8 }, "smoke+=2.1");

        return () => {
            document.documentElement.style.overflow = "";
            tl.kill();
        };
    }, [active, onDone]);

    if (!active) return null;

    return (
        <div className="intro" ref={rootRef} aria-hidden="true">
            <video
                ref={videoRef}
                className="intro-video"
                src="/videos/katana.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
            />

            <svg className="intro-smoke-svg" ref={smokeRef}>
                <filter id="smokeTexture" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.0045 0.007"
                        numOctaves="2"
                        seed="7"
                        stitchTiles="stitch"
                        result="noise"
                    />
                    <feColorMatrix
                        in="noise"
                        type="matrix"
                        values="0 0 0 0 0.86
                    0 0 0 0 0.87
                    0 0 0 0 0.88
                    0 0 0 1.0 -0.15"
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#smokeTexture)" />
            </svg>
        </div>
    );
}