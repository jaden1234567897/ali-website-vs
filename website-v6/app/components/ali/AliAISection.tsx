'use client'

// ali-v5: "AI in Strategy Execution" section. Sits between AliBridge (which
// introduces AI as one of the three pillars) and the gallery / engagements
// below, deep-diving on what AI-augmented strategy work actually produces.
//
// Each of the four frameworks is rendered as an editorial specimen card —
// CSS-only mock visuals (no stock photography) so the section reads as part
// of the site's design system rather than a slide-deck import. Cards use
// the existing --ali-* tokens and the framer-motion stagger pattern
// established by AliTierCards.

import { motion } from 'framer-motion'

type FrameworkId = 'prompts' | 'ogsm' | 'swot' | 'council'

type Framework = {
  id: FrameworkId
  index: string
  title: string
  blurb: string
}

const FRAMEWORKS: Framework[] = [
  {
    id: 'prompts',
    index: '01',
    title: 'Strategy Prompts',
    blurb:
      'Battle-tested prompt templates that turn an AI assistant into a strategy partner — annual planning, diagnostic, board prep.',
  },
  {
    id: 'ogsm',
    index: '02',
    title: 'OGSM',
    blurb:
      'Objective → Goals → Strategies → Measures, generated and stress-tested by AI against your actual operating context.',
  },
  {
    id: 'swot',
    index: '03',
    title: 'SWOT Analysis',
    blurb:
      'AI-augmented SWOTs that surface non-obvious threats and assumption gaps — not the boilerplate quadrant most teams ship.',
  },
  {
    id: 'council',
    index: '04',
    title: 'Advisory Council',
    blurb:
      'Simulated executive panels — AI-personas that pressure-test your strategy from CFO, COO, and board-chair vantage points.',
  },
]

// Per-card mock visual. Pure JSX + CSS-vars — no images, no SVG sprites.
function FrameworkSpecimen({ id }: { id: FrameworkId }) {
  switch (id) {
    case 'prompts':
      return (
        <div className="ali-ai-mock ali-ai-mock--prompts">
          <div className="ali-ai-prompt-line">
            <span className="ali-ai-prompt-caret">›</span>
            <span className="ali-ai-prompt-text">Brief: Q1 strategy review for an 800-FTE entity…</span>
          </div>
          <div className="ali-ai-prompt-line">
            <span className="ali-ai-prompt-caret">›</span>
            <span className="ali-ai-prompt-text">Constraint: legal, regulatory, governance forums…</span>
          </div>
          <div className="ali-ai-prompt-line">
            <span className="ali-ai-prompt-caret">›</span>
            <span className="ali-ai-prompt-text ali-ai-prompt-text--out">Output → OGSM v3, risk register, board pack</span>
          </div>
        </div>
      )
    case 'ogsm':
      return (
        <div className="ali-ai-mock ali-ai-mock--ogsm">
          {[
            { k: 'O', label: 'Objective', sample: 'Become regional gold standard' },
            { k: 'G', label: 'Goals', sample: '3 measurable outcomes by Q4' },
            { k: 'S', label: 'Strategies', sample: '4 strategic bets, owner-named' },
            { k: 'M', label: 'Measures', sample: '12 KPIs · review cadence locked' },
          ].map(row => (
            <div key={row.k} className="ali-ai-ogsm-row">
              <span className="ali-ai-ogsm-key">{row.k}</span>
              <span className="ali-ai-ogsm-label">{row.label}</span>
              <span className="ali-ai-ogsm-sample">{row.sample}</span>
            </div>
          ))}
        </div>
      )
    case 'swot':
      return (
        <div className="ali-ai-mock ali-ai-mock--swot">
          {[
            { k: 'S', tone: 'pos' as const, label: 'Strengths' },
            { k: 'W', tone: 'neg' as const, label: 'Weaknesses' },
            { k: 'O', tone: 'pos' as const, label: 'Opportunities' },
            { k: 'T', tone: 'neg' as const, label: 'Threats' },
          ].map(cell => (
            <div key={cell.k} className={`ali-ai-swot-cell ali-ai-swot-cell--${cell.tone}`}>
              <span className="ali-ai-swot-key">{cell.k}</span>
              <span className="ali-ai-swot-label">{cell.label}</span>
              <span className="ali-ai-swot-bars" aria-hidden="true">
                <span /><span /><span />
              </span>
            </div>
          ))}
        </div>
      )
    case 'council':
      return (
        <div className="ali-ai-mock ali-ai-mock--council">
          {[
            { initials: 'CFO', role: 'Finance' },
            { initials: 'COO', role: 'Operations' },
            { initials: 'BC', role: 'Board Chair' },
            { initials: 'AI', role: 'AI Advisor' },
          ].map(member => (
            <div key={member.initials} className="ali-ai-council-seat">
              <span className="ali-ai-council-avatar" aria-hidden="true">{member.initials}</span>
              <span className="ali-ai-council-role">{member.role}</span>
            </div>
          ))}
        </div>
      )
  }
}

export default function AliAISection() {
  return (
    <section id="ai-in-strategy" className="ali-section ali-ai">
      <div className="ali-container">
        <motion.div
          className="ali-ai-head"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="ali-eyebrow">AI in Strategy Execution</p>
          <h2 className="ali-h2 ali-ai-title">
            AI makes the thinking <em>sharper</em>, the evidence stronger,
            and the conclusions harder to ignore.
          </h2>
          <p className="ali-lede ali-ai-lede">
            At a speed and scale that changes what&apos;s actually possible.
          </p>
        </motion.div>

        <div className="ali-ai-grid">
          {FRAMEWORKS.map((fw, i) => (
            <motion.article
              key={fw.id}
              className="ali-ai-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <header className="ali-ai-card-head">
                <span className="ali-ai-card-index">{fw.index}</span>
                <h3 className="ali-ai-card-title">{fw.title}</h3>
              </header>
              <div className="ali-ai-card-specimen">
                <FrameworkSpecimen id={fw.id} />
              </div>
              <p className="ali-ai-card-blurb">{fw.blurb}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
