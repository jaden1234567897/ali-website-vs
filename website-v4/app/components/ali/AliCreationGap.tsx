'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, cubicBezier } from 'framer-motion'

// ali-v4 — "the gap" section, inserted between AliCourseTeaser and
// AliBooking. Inspired by Michelangelo's two-hands composition: a single
// hand asset rendered twice (right side as-is, left side mirrored via
// scaleX(-1)) glides toward the centre as the user scrolls into the
// section, with the headline fading in just before the hands appear.
//
// Asset: drop a transparent-PNG single hand at /public/adam-hand.png.
// Roughly 1500–2000 px wide, no background, soft natural edge. The same
// file is consumed twice — no need for two separate assets unless you
// want the two hands to look distinct.

// Cubic-bezier matching the rest of the v4 transitions (smooth in/out,
// no aggressive snap at either end of the scroll range).
const EASE = cubicBezier(0.32, 0, 0.16, 1)

export default function AliCreationGap() {
  const sectionRef = useRef<HTMLElement>(null)

  // Track scroll progress across the whole section — 0 when the section's
  // top edge first touches the bottom of the viewport, 1 when its bottom
  // edge leaves the top of the viewport. The animations key off this single
  // progress signal so everything stays synchronised.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // ── Headline reveal across the FULL section: starts tiny + faint gray,
  // zooms in and clarifies (darker ink) as the user scrolls. Three layered
  // transforms drive the "emerging into focus" feel:
  //   • scale 0.4 → 1.0 over the full scroll → dramatic zoom-in
  //   • opacity 0.18 → 1.0 in the first third → fades up from barely-there
  //   • color quiet-gray → ink across the first two thirds → "clarifying"
  // All three finish well before the hands meet at 0.92, so the title is
  // fully crisp by the time the hands touch.
  const titleScale = useTransform(scrollYProgress, [0.05, 0.85], [0.4, 1], {
    ease: EASE,
  })
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.38], [0.18, 1], {
    ease: EASE,
  })
  const titleColor = useTransform(
    scrollYProgress,
    [0.05, 0.65],
    ['rgb(154, 154, 154)', 'rgb(13, 13, 13)'],
    { ease: EASE },
  )

  // ── Hands: slide in from off-screen edges and ALMOST touch at the very
  // end of the section. Endpoints land at -3% / 3% (just shy of natural
  // edge position) so the fingertips graze without fully overlapping —
  // matches the iconic Michelangelo composition where the tension comes
  // from the near-touch, not the contact. The input range extends to 0.92
  // so the near-touch moment coincides with the sticky stage releasing —
  // when the hands almost meet, the section ends and the user lands in
  // the next section below.
  const leftHandX = useTransform(scrollYProgress, [0.18, 0.92], ['-100%', '-3%'], {
    ease: EASE,
  })
  const rightHandX = useTransform(scrollYProgress, [0.18, 0.92], ['100%', '3%'], {
    ease: EASE,
  })
  const handsOpacity = useTransform(scrollYProgress, [0.14, 0.34], [0, 1], {
    ease: EASE,
  })

  return (
    <section
      ref={sectionRef}
      className="ali-gap"
      aria-label="The gap between strategy and execution"
    >
      <div className="ali-gap__stage">
        <motion.h2
          className="ali-gap__title"
          style={{
            opacity: titleOpacity,
            scale: titleScale,
            color: titleColor,
          }}
        >
          Own what&apos;s <em>in between.</em>
        </motion.h2>

        {/* Two separate hand assets cropped from the original composition —
            each hand keeps its natural orientation, no mirroring. The
            fresco's cream background dissolves into the cream page via
            mix-blend-mode: multiply in the CSS. */}
        {/* y: '-45%' centers the hand on its own vertical midpoint (-50%)
            AND lifts it an extra 15% of its own height so the fingertips
            align with the SECOND line of the headline ("in between") rather
            than landing below it. Adjust further if the fingertips still
            sit too low or rise above the gold "between" word. */}
        <motion.img
          src="/adam-hand-left.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="ali-gap__hand ali-gap__hand--left"
          style={{ x: leftHandX, y: '-45%', opacity: handsOpacity }}
        />
        <motion.img
          src="/adam-hand-right.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="ali-gap__hand ali-gap__hand--right"
          style={{ x: rightHandX, y: '-45%', opacity: handsOpacity }}
        />
      </div>
    </section>
  )
}
