import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Clip, ClipCentre } from '../components/Clip'
import { SectionClip } from '../components/SectionClip'
import { CLIP, FAMILIES, taps, type Family, type Tap } from '../data'

const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`
const familyLabel = (f: Family) => FAMILIES.find((x) => x.id === f)!.label
const pad = (n: number) => String(n).padStart(2, '0')

function TapClip({ tap, flipped, dimmed, onFlip }: { tap: Tap; flipped: boolean; dimmed: boolean; onFlip: () => void }) {
  const reduce = useReducedMotion()
  const back = { bg: CLIP.paper, accent: tap.look.bg, ink: CLIP.black, rim: tap.look.bg, motif: 'band' as const }
  const words = tap.style.split(' ')
  const lines = tap.style.length > 11 && words.length > 1 ? [words.slice(0, -1).join(' '), words.at(-1)!] : [tap.style]

  return (
    <button
      type="button"
      className={dimmed ? 'tapclip is-dimmed' : 'tapclip'}
      aria-pressed={flipped}
      aria-label={`Tap ${tap.n}: ${tap.brewery}, ${tap.style}`}
      onClick={onFlip}
      tabIndex={dimmed ? -1 : 0}
    >
      <motion.span
        className="tapclip-inner"
        animate={reduce ? undefined : { rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      >
        <span className="tapclip-face" style={reduce ? { opacity: flipped ? 0 : 1 } : undefined}>
          <Clip look={tap.look} top={tap.brewery.toUpperCase()} bottom={familyLabel(tap.family).toUpperCase()}>
            <ClipCentre text={pad(tap.n)} look={tap.look} size={52} />
          </Clip>
        </span>
        <span
          className="tapclip-face tapclip-back"
          style={reduce ? { opacity: flipped ? 1 : 0, transform: 'none' } : undefined}
        >
          <svg viewBox="0 0 200 200" className="clip" aria-hidden="true">
            <circle cx="100" cy="100" r="99" fill={tap.look.bg} />
            <circle cx="100" cy="100" r="88" fill={back.bg} />
            <circle cx="100" cy="100" r="80" fill="none" stroke={tap.look.bg} strokeWidth="2" />
            <text x="100" y="52" className="clip-arc" fontSize="14" textAnchor="middle" fill={CLIP.black} letterSpacing="3">
              TAP {pad(tap.n)}
            </text>
            {lines.map((line, i) => (
              <text
                key={line}
                x="100"
                y={(lines.length === 1 ? 100 : 86) + i * 28}
                className="clip-num"
                fontSize={line.length > 10 ? 22 : 27}
                textAnchor="middle"
                dominantBaseline="central"
                fill={CLIP.black}
              >
                {line}
              </text>
            ))}
            <rect x="40" y="132" width="120" height="26" rx="13" fill={tap.look.bg} />
            <text
              x="100"
              y="145.5"
              className="clip-arc"
              fontSize={tap.brewery.length > 10 ? 12 : 14}
              textAnchor="middle"
              dominantBaseline="central"
              fill={tap.look.ink}
              letterSpacing="1.5"
            >
              {tap.brewery.toUpperCase()}
            </text>
          </svg>
        </span>
      </motion.span>
    </button>
  )
}

export function TapWall() {
  const [filter, setFilter] = useState<Family | 'all'>('all')
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set())
  const wallRef = useRef<HTMLUListElement>(null)
  const reduce = useReducedMotion()

  const ordered = useMemo(() => {
    if (filter === 'all') return taps
    return [...taps.filter((t) => t.family === filter), ...taps.filter((t) => t.family !== filter)]
  }, [filter])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: taps.length }
    for (const t of taps) c[t.family] = (c[t.family] ?? 0) + 1
    return c
  }, [])

  const allFlipped = flipped.size === taps.length

  const choose = (f: Family | 'all') => {
    setFilter(f)
    wallRef.current?.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  const toggle = (n: number) =>
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })

  return (
    <section className="section taps" id="taps" aria-labelledby="taps-title">
      <div className="taps-grid">
        <div className="taps-intro">
          <div className="taps-head">
            <SectionClip
              look={{ bg: CLIP.yellow, accent: CLIP.black, ink: CLIP.black, rim: CLIP.black, motif: 'sun' }}
              top="ON THE TAPS"
              bottom="BEER & CIDER"
              centre="25"
              tilt={-7}
            />
            <div>
              <p className="kicker">The back wall</p>
              <h2 className="section-title taps-title" id="taps-title">
                <span className="taps-count">25</span> on
              </h2>
            </div>
          </div>

          <p className="lede">
            Twenty-five beer and cider taps, from breweries like Kernel, Buxton, Mondo, Lervig and Westons. Tap a clip to
            turn it over.
          </p>

          <div className="chips" role="group" aria-label="Filter the taps">
            <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => choose('all')}>
              All <span>{counts.all}</span>
            </button>
            {FAMILIES.map((f) => (
              <button
                key={f.id}
                type="button"
                className="chip"
                aria-pressed={filter === f.id}
                onClick={() => choose(f.id)}
              >
                {f.label} <span>{counts[f.id]}</span>
              </button>
            ))}
          </div>

          <div className="taps-tools">
            <button
              type="button"
              className="text-btn"
              onClick={() => setFlipped(allFlipped ? new Set() : new Set(taps.map((t) => t.n)))}
            >
              {allFlipped ? 'Turn them all back' : 'Turn them all over'}
            </button>
            <span className="sample-tag" title="Staff would update this board as kegs change">
              Sample board
            </span>
          </div>
        </div>

        <div className="wall-wrap">
          <LayoutGroup>
            <ul className="wall" ref={wallRef} aria-label="Tap list, sample board">
              <AnimatePresence initial={false}>
                {ordered.map((tap) => (
                  <motion.li
                    key={tap.n}
                    layout={reduce ? false : 'position'}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  >
                    <TapClip
                      tap={tap}
                      flipped={flipped.has(tap.n)}
                      dimmed={filter !== 'all' && tap.family !== filter}
                      onFlip={() => toggle(tap.n)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </LayoutGroup>
          <p className="wall-hint" aria-hidden="true">
            Swipe the wall <span>→</span>
          </p>
        </div>

        <figure className="taps-photo">
          <img
            src={media('clip-pile.jpg')}
            width={750}
            height={741}
            loading="lazy"
            alt="A pile of round keg clips from the bar, from a dozen different breweries."
          />
          <figcaption>Clips off the bar. The wall changes as the kegs do.</figcaption>
        </figure>
      </div>
    </section>
  )
}
