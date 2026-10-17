import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Clip, ClipCentre } from '../components/Clip'
import { BookButton } from '../components/Buttons'
import { CLIP } from '../data'

const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`

const skyLook = { bg: CLIP.navy, accent: CLIP.sky, ink: CLIP.paper, rim: CLIP.paper, motif: 'rings' as const }
const tntLook = { bg: CLIP.paper, accent: CLIP.orange, ink: CLIP.black, rim: CLIP.black, motif: 'stripes' as const }

const SIZES = [2, 4, 6, 8, 10, 15, 20]

export function Sport() {
  const reduce = useReducedMotion()
  const [people, setPeople] = useState(6)

  return (
    <section className="section sport" id="sport" aria-labelledby="sport-title">
      <div className="sport-grid">
        <div className="sport-copy">
          <p className="kicker">Sport, on the screens</p>
          <h2 className="section-title sport-title" id="sport-title">
            Sky Sports <span className="amp">&amp;</span> TNT Sports
          </h2>
          <p className="lede">
            Big game coming up? Get a table booked so you’re watching, not peering over heads at the back. Half-time
            pizza till 10pm, a pool table for after, and 25 taps to get through.
          </p>

          <div className="teamsheet">
            <p className="teamsheet-q" id="watching">
              How many of you are watching?
            </p>
            <div className="teamsheet-sizes" role="group" aria-labelledby="watching">
              {SIZES.map((n) => (
                <button key={n} type="button" aria-pressed={people === n} onClick={() => setPeople(n)}>
                  {n}
                </button>
              ))}
            </div>
            <BookButton occasion="match" people={people} tone="sky" size="lg">
              Book a table for {people}
            </BookButton>
            <p className="teamsheet-note">Tell us which match on the next step.</p>
          </div>
        </div>

        <div className="sport-visual">
          <figure className="sport-photo">
            <img
              src={media('pint-at-the-bar.jpg')}
              width={750}
              height={741}
              loading="lazy"
              alt="A pint of pale on the bar, with the screen on the wall and tables of people chatting behind."
            />
          </figure>
          <motion.div
            className="sport-clip sport-clip--a"
            aria-hidden="true"
            initial={reduce ? false : { y: -40, rotate: -30, opacity: 0 }}
            whileInView={{ y: 0, rotate: -8, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          >
            <Clip look={skyLook} top="ON THE SCREENS" bottom="BOOK FOR THE MATCH">
              <ClipCentre text="Sky Sports" look={skyLook} size={21} font="condensed" plate />
            </Clip>
          </motion.div>
          <motion.div
            className="sport-clip sport-clip--b"
            aria-hidden="true"
            initial={reduce ? false : { y: -40, rotate: 30, opacity: 0 }}
            whileInView={{ y: 0, rotate: 7, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.12 }}
          >
            <Clip look={tntLook} top="ON THE SCREENS" bottom="BOOK FOR THE MATCH">
              <ClipCentre text="TNT Sports" look={tntLook} size={21} font="condensed" plate />
            </Clip>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
