/**
 * Shared Homepage V3 motion helpers — mirrors AboutPage reveal language.
 */

export function homepageRevealProps(reduceMotion: boolean | null, delay = 0) {
  if (reduceMotion) {
    return {};
  }

  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    // Generous margin so lower-row cards/steps settle visible before leaving the viewport.
    viewport: { once: true, amount: 0.05, margin: "64px 0px 96px 0px" },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

export function homepageStaggerDelay(index: number, step = 0.06) {
  return Math.min(index, 6) * step;
}
