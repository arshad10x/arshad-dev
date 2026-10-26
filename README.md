# Arshad — Portfolio (Shokunin theme)

React + Vite implementation of the approved Shokunin design: cover, profile,
tools, scroll-of-works, journey and letter (contact) sections, built exactly
to the agreed composition with scroll choreography layered on top.

## Stack

- **React 19 + Vite** — app shell
- **GSAP + ScrollTrigger** — every reveal, parallax and scroll-linked
  animation (letter-cell assembly, ensō stroke-draw, hanging-tag sway,
  pinned horizontal scroll gallery, timeline axis draw, hanko stamp press)
- **Lenis** — smooth-scroll base, wired into GSAP's ticker so ScrollTrigger
  stays in sync
- Plain `<canvas>` for the ambient dust/petal layer — no 3D library needed
  for something this restrained; see "About the 3D question" below

No design decisions were changed from the approved mockups — only motion,
interaction and responsive behavior were added.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

## Structure

```
src/
  components/
    Nav.jsx            sticky nav, fades in on load
    Hero.jsx            cover — name cells assemble, ensō draws, hanko stamps
    Profile.jsx          about — ink-bloom bio reveal, parallax watermark
    Tools.jsx            skills — hanging tags, swaying, shelf draws in
    Works.jsx             projects — pinned horizontal scroll (emakimono)
    Journey.jsx            experience — brush-stroke axis draws on scroll
    Letter.jsx               contact — ruled paper, hanko "seal & send"
    AmbientInk.jsx            subtle drifting dust layer (optional, see below)
  data/content.js        all copy — skills, projects, journey entries
  lib/useLenis.js         Lenis + GSAP ticker wiring
```

Everything is plain CSS per component (`Component.css` next to
`Component.jsx`), using a shared token set defined in `src/index.css`
(`--ink`, `--washi`, `--vermillion`, `--wood`, `--sage`, fonts).

## About the "3D model" question

The approved design is illustrative/flat (ensō brush circle, hand-drawn
lines, wooden tags) rather than built around a literal 3D object, so adding
a Three.js mesh would have been a design change in disguise — exactly what
you asked me not to do. Instead, the "depth" layer is a very low-opacity
canvas of drifting motes behind the whole page (`AmbientInk.jsx`), which
reads as ambient atmosphere rather than a new visual element. It's trivial
to delete (just remove `<AmbientInk />` from `App.jsx`) if you'd rather not
have it, and just as easy to swap for a real Three.js scene later if a
future section calls for one.

## Notes on the animations

- **Lenis + ScrollTrigger** are wired once in `useLenis.js` — every other
  component just registers normal ScrollTrigger instances.
- **Works (horizontal scroll)** uses `gsap.matchMedia`: pinned horizontal
  scroll above 860px, a plain swipeable/snap track below it, so nothing
  fights the user on mobile.
- **Reduced motion**: `useLenis` and `AmbientInk` both check
  `prefers-reduced-motion` and skip their effects entirely when it's set.
  GSAP's scroll-triggered reveals still run but are short and non-parallax,
  so the page stays legible either way.


## Before you deploy

1. **Contact form** — create a free form at formspree.io (or similar), put its
   URL in `.env` as `VITE_FORM_ENDPOINT` (see `.env.example`). Without it the
   form opens the visitor's email app instead of pretending to send.
2. **Fill the `TODO(Arshad)` items in `src/data/content.js`** — real email,
   GitHub/LinkedIn URLs, project `live` / `repo` links and one-line
   `outcome`s, and your Yasham Software role. Links with empty URLs are
   simply not shown.
3. **Share preview** — in `index.html`, make `og:image` an absolute URL on
   your domain once deployed. `public/og-image.png` is the starting image.
4. Run `npm run lint && npm run build`, then test at 375px wide and with
   "reduce motion" turned on in your OS.
