// Single source of truth for design tokens. Edit here, re-render.

export const colors = {
  bg: '#FBFCFF',
  bloomInner: '#DCE9FF',
  ink: '#0B1220',
  muted: '#8794AE',
  accent: '#22D3EE',
  guide: 'rgba(199, 212, 239, 0.45)',
} as const;

export const type = {
  // Vertical (1080×1920) targets — generous because the canvas is tall.
  headlineXL: 132,
  headline: 104,
  body: 64,
  pill: 56,
  cta: 56,
  trackingHeadline: '-0.025em',
  trackingBody: '-0.01em',
  leadingTight: 1.05,
  leadingBody: 1.15,
} as const;

export const motion = {
  springSoft: {damping: 200, stiffness: 80, mass: 1},
  springSnap: {damping: 160, stiffness: 140, mass: 0.9},
  entryFrames: 24,
  exitFrames: 12,
  revealFrames: 18,
  pillStagger: 4,
} as const;

export const layout = {
  width: 1080,
  height: 1920,
  fps: 30,
  totalFrames: 810,
  safePad: 80,
} as const;

export const beats = {
  hook: {from: 0, duration: 120},
  reframe: {from: 120, duration: 150},
  capabilities: {from: 270, duration: 270},
  vision: {from: 540, duration: 150},
  cta: {from: 690, duration: 120},
} as const;
