import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Clip, ClipCentre } from '../components/Clip'
import { useOpenBooking } from '../components/Buttons'
import { SectionClip } from '../components/SectionClip'
import { CLIP, OCCASIONS, lines, venue, type Motif, type OccasionId } from '../data'
import { INTRO, SIGN_OFF, subjectLead } from '../lib/enquiry'

const OCCASION_ART: Record<OccasionId, { motif: Motif; accent: string; centre: string; bottom: string; tilt: number }> = {
  birthday: { motif: 'dots', accent: CLIP.yellow, centre: 'Cake', bottom: 'ANY SIZE', tilt: -8 },
  leaving: { motif: 'chevron', accent: CLIP.paper, centre: 'Cheers', bottom: 'BRING THE TEAM', tilt: 5 },
  match: { motif: 'rings', accent: CLIP.paper, centre: 'Kick-off', bottom: 'SKY & TNT SPORTS', tilt: -4 },
  hire: { motif: 'band', accent: CLIP.paper, centre: 'Hire', bottom: 'ALWAYS OPEN TO IT', tilt: 7 },
  drinks: { motif: 'waves', accent: CLIP.sea, centre: 'Pints', bottom: 'NO REASON NEEDED', tilt: -6 },
}

const Blank = ({ children }: { children: string }) => <span className="blank">{children}</span>

export function Bookings() {
  const openBooking = useOpenBooking()
  const reduce = useReducedMotion()
  const [picked, setPicked] = useState<OccasionId>('birthday')
  const occasion = OCCASIONS.find((o) => o.id === picked)!

  return (
    <section className="section bookings" id="bookings" aria-labelledby="bookings-title">
      <div className="bookings-grid">
        <div className="bookings-copy">
          <div className="section-head">
            <SectionClip
              look={{ bg: CLIP.pink, accent: CLIP.paper, ink: CLIP.paper, rim: CLIP.paper, motif: 'dots' }}
              top="BOOKINGS"
              bottom="PRIVATE HIRE"
              centre="2–40+"
              centreSize={27}
              tilt={-5}
            />
            <div>
              <p className="kicker">Bookings &amp; private hire</p>
              <h2 className="section-title" id="bookings-title">
                Two of you, or forty-odd
              </h2>
            </div>
          </div>

          <blockquote className="house-line">
            <p>“{lines.bookings}.”</p>
          </blockquote>

          <p className="lede">
            No more back-and-forth over email. Pick the occasion, the numbers, the day and the time, and the booking form
            writes the email for you with every detail in it. You hit send; the team gets it all in one go.
          </p>

          <p className="occasion-prompt" id="occasion-prompt">
            What’s the occasion?
          </p>
          <ul className="occasions" aria-labelledby="occasion-prompt">
            {OCCASIONS.map((o) => {
              const art = OCCASION_ART[o.id]
              const look = { bg: o.colour, accent: art.accent, ink: o.ink, rim: o.ink, motif: art.motif }
              const active = picked === o.id
              return (
                <li key={o.id}>
                  <motion.button
                    type="button"
                    className={active ? 'occasion is-active' : 'occasion'}
                    aria-pressed={active}
                    onClick={() => setPicked(o.id)}
                    animate={{ rotate: active ? 0 : art.tilt, y: active ? -6 : 0, scale: active ? 1.06 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    <Clip look={look} top={o.label.toUpperCase()} bottom={art.bottom}>
                      <ClipCentre text={art.centre} look={look} size={art.centre.length > 6 ? 25 : 31} font="condensed" plate />
                    </Clip>
                    <span className="occasion-label">{o.label}</span>
                  </motion.button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="draft">
          <p className="draft-label">What lands in the pub’s inbox</p>
          <div className="email email--draft" aria-live="polite">
            <dl>
              <div>
                <dt>To</dt>
                <dd>{venue.email}</dd>
              </div>
              <div>
                <dt>Subject</dt>
                <dd>
                  {subjectLead(picked)}: {occasion.label} · <Blank>how many</Blank> · <Blank>date</Blank> ·{' '}
                  <Blank>time</Blank>
                </dd>
              </div>
            </dl>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={picked}
                className="email-body"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <p>Hello Grosvenor Arms,</p>
                <p>{INTRO[picked]}</p>
                <p>
                  Occasion: {occasion.label}
                  <br />
                  Group size: <Blank>how many</Blank>
                  <br />
                  Date: <Blank>pick a day</Blank>
                  <br />
                  Time: <Blank>pick a time</Blank>
                  <br />
                  Name: <Blank>your name</Blank>
                </p>
                <p className="email-sign">{SIGN_OFF}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <button type="button" className="cbtn cbtn--pink cbtn--lg draft-go" onClick={() => openBooking(picked)}>
            Fill in the rest
          </button>
        </div>
      </div>
    </section>
  )
}
