'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, cubicBezier } from 'framer-motion'

// ali-v6 — AI tagline reveal. Sits between the bridge section and the
// "Own what's in between" hands section. Pinned scroll choreography:
// four clauses fade + zoom in one after another, key adjectives ("sharper",
// "stronger", "harder to ignore", "what's actually possible") highlighted
// in the v6 mid-teal accent. Same Literata 600 cut as the hero h1 so it
// feels like a typographic continuation rather than a different voice.

const EASE = cubicBezier(0.32, 0, 0.16, 1)

export default function AliAITagline() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Each clause has its own reveal window. They overlap slightly so the
  // last word of one clause is fully crisp before the next starts fading.
  // Scale runs 0.78 → 1, opacity 0 → 1, y 24 → 0 per line.
  const mk = (start: number, end: number) => ({
    opacity: useTransform(scrollYProgress, [start, end], [0, 1], { ease: EASE }),
    scale: useTransform(scrollYProgress, [start, end], [0.78, 1], { ease: EASE }),
    y: useTransform(scrollYProgress, [start, end], [24, 0], { ease: EASE }),
  })

  const line1 = mk(0.08, 0.28) // "AI makes the thinking sharper,"
  const line2 = mk(0.22, 0.42) // "the evidence stronger,"
  const line3 = mk(0.36, 0.58) // "and the conclusions harder to ignore —"
  const line4 = mk(0.52, 0.78) // "at a speed and scale that changes what's actually possible."

  return (
    <section
      ref={sectionRef}
      className="ali-ai-tagline"
      aria-label="AI in strategy execution — tagline"
    >
      <div className="ali-ai-tagline__stage">
        <div className="ali-ai-tagline__eyebrow">— AI in Strategy Execution</div>

        <motion.h2
          className="ali-ai-tagline__line"
          style={{ opacity: line1.opacity, scale: line1.scale, y: line1.y }}
        >
          AI makes the thinking <em>sharper</em>,
        </motion.h2>

        <motion.h2
          className="ali-ai-tagline__line"
          style={{ opacity: line2.opacity, scale: line2.scale, y: line2.y }}
        >
          the evidence <em>stronger</em>,
        </motion.h2>

        <motion.h2
          className="ali-ai-tagline__line"
          style={{ opacity: line3.opacity, scale: line3.scale, y: line3.y }}
        >
          and the conclusions <em>harder to ignore</em> —
        </motion.h2>

        <motion.h2
          className="ali-ai-tagline__line ali-ai-tagline__line--coda"
          style={{ opacity: line4.opacity, scale: line4.scale, y: line4.y }}
        >
          at a speed and scale that changes{' '}
          <em>what&apos;s actually possible.</em>
        </motion.h2>
      </div>
    </section>
  )
}
