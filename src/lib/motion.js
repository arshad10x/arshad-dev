// One place to ask "should this page animate?" so every component
// respects the visitor's reduced-motion setting the same way.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
