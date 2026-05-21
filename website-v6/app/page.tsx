import { CalendarClock } from 'lucide-react'
import CoinField from './components/CoinField'
import AliNav from './components/ali/AliNav'
// ali-v6: AliNovaTransition removed — the Strategy POV zoom is gone.
// Coins now finish their hero butterfly choreography and the page flows
// straight into AliBridge with no pinned-zoom interruption.
import AliBridge from './components/ali/AliBridge'
// ali-v6: new AI tagline reveal section sits right after AliBridge.
import AliAITagline from './components/ali/AliAITagline'
// ali-v6: AliCreationGap moved up — it now lives right above AliAbout so
// "Own what's in between" reads as the emotional pivot into the personal
// introduction rather than a closing beat before booking.
import AliCreationGap from './components/ali/AliCreationGap'
import AliAbout from './components/ali/AliAbout'
import AliTierCards from './components/ali/AliTierCards'
import AliCourseTeaser from './components/ali/AliCourseTeaser'
import AliCurvedAI from './components/ali/AliCurvedAI'
import AliFlowTestimonials from './components/ali/AliFlowTestimonials'
import AliBooking from './components/ali/AliBooking'
import AliCinematicFooter from './components/ali/AliCinematicFooter'
import AliWhatsAppFloat from './components/ali/AliWhatsAppFloat'

export const frameCache: (ImageBitmap | null)[] = Array.from({ length: 193 }, () => null)

export default function Home() {
  return (
    <div className="ali-site site-shell">
      {/* Hero — 3D coin field + butterfly motion (untouched) */}
      <CoinField />

      <AliNav />

      <main id="top">
        <div className="hero-scroll-stage">
          <section className="hero-section nova-hero" aria-label="Ali Al-Ali hero">
            <div className="hero-copy nova-hero-title">
              <h1>
                Where <em>Strategy</em>
                <br />
                Meets Execution.
              </h1>
            </div>

            <aside className="nova-hero-aside">
              <p>
                We align strategy,
                <br />
                governance, and
                <br />
                execution that delivers.
              </p>
              <a className="primary-action nova-start" href="#book">
                <CalendarClock size={16} />
                Let&apos;s Start
              </a>
            </aside>
          </section>
        </div>

        {/* ali-v6: Bridge follows the hero directly. The 3 coins complete
            their butterfly motion at the end of the hero scroll and the
            bridge section's own coin scene takes over from there. */}
        <AliBridge />

        {/* ali-v6: AI tagline reveal — four-clause scroll-driven type. */}
        <AliAITagline />

        {/* ali-v6: "Own what's in between" — two hands reaching. Moved up
            from below the course teaser so it pivots straight into About. */}
        <AliCreationGap />

        {/* About Ali — cinematic pinned reveal */}
        <AliAbout />

        {/* ali-v6 "services" slot — the 3-tier engagement grid. */}
        <AliTierCards />

        {/* ali-v6 "flip card" slot — the course teaser with the dark VOL.04
            tier card on the right. */}
        <AliCourseTeaser />

        {/* Curved AI screenshot slider — gallery of real outputs. */}
        <AliCurvedAI />

        <AliFlowTestimonials />

        <AliBooking />
      </main>

      {/* Cinematic curtain-reveal footer with magnetic pills */}
      <AliCinematicFooter />
      <AliWhatsAppFloat />
    </div>
  )
}
