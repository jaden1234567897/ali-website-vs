'use client'

// Pricing-style tier cards — 2nd-branch replacement for both the 3D books
// shelf (AliCoreProducts) and the 3D magazine teaser (AliCourseTeaser).
// Four comparable columns: Advisory / Materials / 1:1 / Course Bundle.
// Each column carries its own engagement model, feature list, status tag,
// and decisive CTA — designed for conversion rather than visual flair.

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowUpRight } from 'lucide-react'

type Tier = {
  id: string
  eyebrow: string
  title: string
  tagline: string
  tag: string
  tagTone: 'neutral' | 'gold' | 'dot'
  features: string[]
  cta: { label: string; href?: string; type?: 'link' | 'email' }
  highlight?: boolean
  variant: 'light' | 'dark'
}

const TIERS: Tier[] = [
  {
    id: 'advisory',
    eyebrow: 'VOL. 01',
    title: 'Strategy Execution Advisory',
    tagline: 'Two decades inside the strategy-to-execution gap.',
    tag: 'BY ENGAGEMENT',
    tagTone: 'neutral',
    features: [
      'Strategy Function Design & Activation',
      'Strategy Execution Governance Design',
      'Annual Planning Accelerator',
    ],
    cta: { label: 'Read about Ali', href: '#about' },
    variant: 'light',
  },
  {
    id: 'ai-tools',
    eyebrow: 'VOL. 02',
    title: 'AI-powered tools and frameworks',
    tagline:
      'An AI-powered toolkit built specifically for the various challenges within the annual planning cycle.',
    tag: 'AI · TOOLKIT',
    tagTone: 'gold',
    features: [
      'Strategy execution-specific AI playbook',
      'Your AI Advisory board',
    ],
    cta: { label: 'Explore the toolkit', href: '#materials' },
    variant: 'light',
  },
  {
    id: 'course',
    eyebrow: 'VOL. 03',
    title: 'From Strategy to Execution',
    tagline: 'A self-paced course with AI built in.',
    tag: '● COMING SOON · 2026',
    tagTone: 'dot',
    features: [
      '6 modules, each built around a real execution challenge',
      'Battle-tested frameworks you can deploy immediately',
      'Built-in AI guidance at every module — not generic, execution-specific',
    ],
    cta: { label: 'Join the waitlist', href: '#course' },
    variant: 'light',
  },
]

export default function AliTierCards() {
  return (
    <section id="products" className="ali-section ali-tiers">
      <div className="ali-container" style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="ali-eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>
            Engagements
          </p>
          <h2 className="ali-h2" style={{ maxWidth: 760, margin: '0 auto 16px' }}>
            Three ways to <em>close the gap</em>
          </h2>
          <p className="ali-lede" style={{ margin: '0 auto 64px', maxWidth: 640 }}>
            Choose the engagement that matches the work in front of you — from
            a single work session to more expanded engagements tailored to
            your needs.
          </p>
        </motion.div>

        <div className="ali-tiers-grid">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <TierCard tier={tier} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TierCard({ tier }: { tier: Tier }) {
  const isDark = tier.variant === 'dark'
  const isHighlight = !!tier.highlight

  return (
    <div
      className={[
        'ali-tier',
        isDark ? 'ali-tier--dark' : 'ali-tier--light',
        isHighlight ? 'ali-tier--highlight' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isHighlight && <div className="ali-tier-pin">MOST CHOSEN</div>}

      <div className="ali-tier-head">
        <div className={`ali-tier-eyebrow ali-tier-eyebrow--${tier.tagTone}`}>
          {tier.eyebrow}
        </div>
        <h3 className="ali-tier-title">{tier.title}</h3>
        <p className="ali-tier-tagline">{tier.tagline}</p>
      </div>

      <ul className="ali-tier-features">
        {tier.features.map(f => (
          <li key={f}>
            <Check size={15} strokeWidth={2.5} className="ali-tier-check" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="ali-tier-foot">
        <div className={`ali-tier-tag ali-tier-tag--${tier.tagTone}`}>{tier.tag}</div>
        {tier.cta.type === 'email' ? (
          <CourseEmailForm />
        ) : (
          <a className="ali-tier-cta" href={tier.cta.href}>
            <span>{tier.cta.label}</span>
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </a>
        )}
      </div>
    </div>
  )
}

function CourseEmailForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return submitted ? (
    <div className="ali-tier-submitted">You're on the list. We'll email you when it opens.</div>
  ) : (
    <form
      className="ali-tier-email"
      onSubmit={e => {
        e.preventDefault()
        if (email && email.includes('@')) setSubmitted(true)
      }}
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button type="submit">
        Notify Me <ArrowUpRight size={14} strokeWidth={2.5} />
      </button>
    </form>
  )
}
