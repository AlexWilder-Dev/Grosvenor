import { motion, useReducedMotion } from 'framer-motion'
import { Clip, ClipCentre } from '../components/Clip'
import { scrollToSection, useOpenBooking } from '../components/Buttons'
import { CLIP, reviews, venue } from '../data'

const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`

const bookLook = { bg: CLIP.paper, accent: CLIP.pink, ink: CLIP.black, rim: CLIP.black, motif: 'band' as const }

export function Hero() {
  const reduce = useReducedMotion()
  const openBooking = useOpenBooking()

  return (
    <header className="hero" id="top">
      <div className="hero-sign">
        <p className="hero-sign-meta">
          <span>
            {venue.street} · London {venue.postcode.split(' ')[0]}
          </span>
          <span>Between Brixton &amp; Stockwell</span>
        </p>
        <h1 className="fascia">
          <span className="fascia-the">The</span>
          <span className="fascia-name">Grosvenor Arms</span>
        </h1>
      </div>

      <div className="hero-body">
        <div className="hero-copy">
          <p className="hero-lines">25 beer and cider taps&nbsp;· pizza till 10pm&nbsp;· Sky &amp; TNT Sports</p>
          <p className="hero-where">
            A mid-Victorian corner pub on a Georgian back street, saved by its neighbours and run by the team behind the Priory Arms.
          </p>
        </div>

        <figure className="hero-photo">
          <div className="hero-frame">
            <img
              src={media('exterior-night.jpg')}
              width={750}
              height={732}
              alt="The Grosvenor Arms at night on Sidney Road: benches out front, warm lamps glowing, and an A-board reading ‘The Grosvenor Arms, open now’."
              fetchPriority="high"
            />
          </div>
          <figcaption>Sidney Road, after dark.</figcaption>

          <motion.button
            type="button"
            className="hero-book"
            onClick={() => openBooking()}
            aria-label="Book a table: bookings of any size, private hire too"
            initial={reduce ? false : { scale: 1.6, rotate: -40, opacity: 0 }}
            animate={{ scale: 1, rotate: -9, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.35 }}
            whileHover={reduce ? undefined : { rotate: -2, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Clip look={bookLook} top="BOOKINGS OF ANY SIZE" bottom="PRIVATE HIRE TOO">
              <ClipCentre text="Book" look={{ ...bookLook, bg: CLIP.pink, ink: CLIP.paper }} size={46} y={98} />
            </Clip>
          </motion.button>
        </figure>

        <div className="hero-extra">
          <div className="hero-jump" aria-label="Jump to">
            <button type="button" onClick={() => scrollToSection('taps')}>
              What’s on tap
            </button>
            <button type="button" onClick={() => scrollToSection('pizza')}>
              Pizza menu
            </button>
            <button type="button" onClick={() => scrollToSection('find-us')}>
              Find us
            </button>
          </div>
          <p className="hero-rating">
            <strong>{venue.rating.score}</strong> from {venue.rating.count} Google reviews
          </p>
          <blockquote className="hero-review">
            <p>“{reviews[1].text}”</p>
            <cite>{reviews[1].source}</cite>
          </blockquote>
        </div>
      </div>
    </header>
  )
}
