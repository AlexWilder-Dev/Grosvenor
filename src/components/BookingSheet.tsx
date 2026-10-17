import { motion, useDragControls, useReducedMotion, type PanInfo } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DAY_NAMES, HOURS, OCCASIONS, venue, type DayIndex, type OccasionId } from '../data'
import { fmtTime, realLondonNow } from '../lib/clock'
import { INTRO, SIGN_OFF, subjectLead } from '../lib/enquiry'

type YMD = { y: number; m: number; d: number }

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MAX_SIZE = 41 // 41 reads as "40+"

const utc = (v: YMD) => new Date(Date.UTC(v.y, v.m - 1, v.d))
const dayIndex = (v: YMD) => ((utc(v).getUTCDay() + 6) % 7) as DayIndex
const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate()
const compare = (a: YMD, b: YMD) => a.y - b.y || a.m - b.m || a.d - b.d
const addDays = (v: YMD, n: number): YMD => {
  const t = utc(v)
  t.setUTCDate(t.getUTCDate() + n)
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }
}
const longDate = (v: YMD) => `${DAY_NAMES[dayIndex(v)]} ${v.d} ${MONTHS[v.m - 1]} ${v.y}`
const shortDate = (v: YMD) => `${DAY_NAMES[dayIndex(v)].slice(0, 3)} ${v.d} ${MONTHS[v.m - 1].slice(0, 3)}`
const sizeText = (n: number) => (n >= MAX_SIZE ? '40+' : String(n))

function slotsFor(date: YMD, today: YMD, nowMinutes: number) {
  const hours = HOURS[dayIndex(date)]
  const slots: number[] = []
  for (let t = hours.open; t <= hours.close - 60; t += 30) slots.push(t)
  return compare(date, today) === 0 ? slots.filter((t) => t > nowMinutes) : slots
}

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 900px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

export function BookingSheet() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduce = useReducedMotion()
  const wide = useWide()
  const drag = useDragControls()

  const query = new URLSearchParams(location.search)
  const initial = query.get('occasion')
  const initialSize = Number(query.get('size'))
  const [occasion, setOccasion] = useState<OccasionId | null>(
    OCCASIONS.some((o) => o.id === initial) ? (initial as OccasionId) : null,
  )
  const [size, setSize] = useState(
    initialSize >= 2 ? Math.min(MAX_SIZE, Math.round(initialSize)) : initial === 'hire' ? 20 : 4,
  )
  const now = useMemo(() => realLondonNow(), [])
  const today = now.date
  const lastDay = addDays(today, 365)
  const [month, setMonth] = useState({ y: today.y, m: today.m })
  const [date, setDate] = useState<YMD | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [match, setMatch] = useState('')
  const [notes, setNotes] = useState('')
  const [view, setView] = useState<'form' | 'preview'>('form')
  const [missing, setMissing] = useState<string[]>([])
  const [opened, setOpened] = useState(false)
  const [copied, setCopied] = useState(false)

  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const close = () => {
    if ((location.state as { fromPage?: boolean } | null)?.fromPage) navigate(-1)
    else navigate('/', { replace: true })
  }

  // Lock the page behind and close on Escape.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    titleRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [view])

  const slots = date ? slotsFor(date, today, now.minutes) : []
  useEffect(() => {
    if (time !== null && !slots.includes(time)) setTime(null)
  }, [date])

  const occasionLabel = OCCASIONS.find((o) => o.id === occasion)?.label

  const summary = [
    occasionLabel,
    `${sizeText(size)} people`,
    date ? shortDate(date) : null,
    time !== null ? fmtTime(time) : null,
  ].filter(Boolean) as string[]

  const email = useMemo(() => {
    if (!occasion || !date || time === null) return null
    const subject = `${subjectLead(occasion)}: ${occasionLabel} · ${sizeText(size)} people · ${shortDate(date)} · ${fmtTime(time)}`
    const rows = [
      ['Occasion', occasionLabel],
      ['Group size', `${sizeText(size)} people`],
      ['Date', longDate(date)],
      ['Time', fmtTime(time)],
      ['Name', name.trim()],
      phone.trim() ? ['Phone', phone.trim()] : null,
      occasion === 'match' && match.trim() ? ['Which match', match.trim()] : null,
    ].filter(Boolean) as [string, string][]
    const body = [
      'Hello Grosvenor Arms,',
      '',
      INTRO[occasion],
      '',
      ...rows.map(([k, v]) => `${k}: ${v}`),
      ...(notes.trim() ? ['', 'Anything else:', notes.trim()] : []),
      '',
      'Thanks,',
      name.trim(),
      '',
      SIGN_OFF,
    ].join('\n')
    return { subject, body }
  }, [occasion, occasionLabel, size, date, time, name, phone, match, notes])

  const mailto = email
    ? `mailto:${venue.email}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body.replace(/\n/g, '\r\n'))}`
    : '#'

  const toPreview = () => {
    const gaps: string[] = []
    if (!occasion) gaps.push('occasion')
    if (!date) gaps.push('date')
    if (date && time === null) gaps.push('time')
    if (!name.trim()) gaps.push('name')
    setMissing(gaps)
    if (gaps.length) {
      document.getElementById(`bk-${gaps[0]}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
      if (gaps[0] === 'name') document.getElementById('bk-name-input')?.focus()
      return
    }
    setView('preview')
  }

  const copyText = async () => {
    if (!email) return
    try {
      await navigator.clipboard.writeText(`To: ${venue.email}\nSubject: ${email.subject}\n\n${email.body}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopied(false)
    }
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) close()
  }

  // Calendar grid for the visible month, Monday first.
  const firstDow = dayIndex({ y: month.y, m: month.m, d: 1 })
  const cells: (YMD | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth(month.y, month.m) }, (_, i) => ({ y: month.y, m: month.m, d: i + 1 })),
  ]
  const canPrev = month.y > today.y || (month.y === today.y && month.m > today.m)
  const canNext = month.y < lastDay.y || (month.y === lastDay.y && month.m < lastDay.m)
  const shiftMonth = (by: number) => {
    const m0 = month.m - 1 + by
    setMonth({ y: month.y + Math.floor(m0 / 12), m: ((m0 % 12) + 12) % 12 + 1 })
  }

  const sheetMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : wide
      ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
      : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  const hoursNote = date
    ? `${DAY_NAMES[dayIndex(date)]}: open ${fmtTime(HOURS[dayIndex(date)].open)} – ${fmtTime(HOURS[dayIndex(date)].close)}. Last booking ${fmtTime(HOURS[dayIndex(date)].close - 60)}.`
    : 'Pick a day and we’ll show times within that day’s opening hours.'

  return (
    <div className="sheet-layer">
      <motion.div
        className="sheet-backdrop"
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        {...sheetMotion}
        transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 320, damping: 34 }}
        drag={!wide && !reduce ? 'y' : false}
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={onDragEnd}
      >
        <div className="sheet-grab" onPointerDown={(e) => drag.start(e)} aria-hidden="true">
          <span />
        </div>
        <div className="sheet-top">
          <div>
            <p className="kicker">{view === 'form' ? 'Bookings & private hire' : 'Your enquiry'}</p>
            <h2 id="sheet-title" ref={titleRef} tabIndex={-1}>
              {view === 'form' ? 'Book a table' : 'Here’s your email'}
            </h2>
          </div>
          <button type="button" className="sheet-close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="sheet-body" ref={bodyRef}>
          {view === 'form' ? (
            <div className="bk-form">
              <fieldset id="bk-occasion" className={missing.includes('occasion') ? 'bk-step is-missing' : 'bk-step'}>
                <legend>
                  <span className="bk-num">1</span> What’s it for?
                </legend>
                <div className="bk-occasions">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className="bk-chip"
                      aria-pressed={occasion === o.id}
                      onClick={() => {
                        setOccasion(o.id)
                        setMissing((m) => m.filter((x) => x !== 'occasion'))
                      }}
                      style={{ ['--chip' as string]: o.colour, ['--chip-ink' as string]: o.ink }}
                    >
                      <span className="bk-chip-dot" aria-hidden="true" />
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="bk-step">
                <legend>
                  <span className="bk-num">2</span> {occasion === 'hire' ? 'Roughly how many?' : 'How many of you?'}
                </legend>
                <div className="stepper">
                  <button
                    type="button"
                    onClick={() => setSize((s) => Math.max(2, s - 1))}
                    disabled={size <= 2}
                    aria-label="One fewer"
                  >
                    −
                  </button>
                  <output aria-live="polite">
                    <strong>{sizeText(size)}</strong>
                    <span>people</span>
                  </output>
                  <button
                    type="button"
                    onClick={() => setSize((s) => Math.min(MAX_SIZE, s + 1))}
                    disabled={size >= MAX_SIZE}
                    aria-label="One more"
                  >
                    +
                  </button>
                </div>
                <div className="stepper-quick">
                  {[2, 6, 10, 20, MAX_SIZE].map((n) => (
                    <button key={n} type="button" aria-pressed={size === n} onClick={() => setSize(n)}>
                      {sizeText(n)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset id="bk-date" className={missing.includes('date') ? 'bk-step is-missing' : 'bk-step'}>
                <legend>
                  <span className="bk-num">3</span> Which day?
                </legend>
                <div className="cal">
                  <div className="cal-head">
                    <button type="button" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="Previous month">
                      ‹
                    </button>
                    <strong aria-live="polite">
                      {MONTHS[month.m - 1]} {month.y}
                    </strong>
                    <button type="button" onClick={() => shiftMonth(1)} disabled={!canNext} aria-label="Next month">
                      ›
                    </button>
                  </div>
                  <div className="cal-grid" role="grid">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <span key={i} className="cal-dow" aria-hidden="true">
                        {d}
                      </span>
                    ))}
                    {cells.map((c, i) => {
                      if (!c) return <span key={`x${i}`} />
                      const past = compare(c, today) < 0 || compare(c, lastDay) > 0
                      const isToday = compare(c, today) === 0
                      const noSlots = isToday && slotsFor(c, today, now.minutes).length === 0
                      const selected = date && compare(c, date) === 0
                      return (
                        <button
                          key={c.d}
                          type="button"
                          className={['cal-day', isToday && 'is-today', selected && 'is-selected'].filter(Boolean).join(' ')}
                          disabled={past || noSlots}
                          aria-pressed={!!selected}
                          aria-label={`${longDate(c)}${isToday ? ', today' : ''}`}
                          onClick={() => {
                            setDate(c)
                            setMissing((m) => m.filter((x) => x !== 'date'))
                          }}
                        >
                          {c.d}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </fieldset>

              <fieldset id="bk-time" className={missing.includes('time') ? 'bk-step is-missing' : 'bk-step'}>
                <legend>
                  <span className="bk-num">4</span> What time?
                </legend>
                <p className="bk-note">{hoursNote}</p>
                {date && (
                  <div className="slots">
                    {slots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={time === t}
                        onClick={() => {
                          setTime(t)
                          setMissing((m) => m.filter((x) => x !== 'time'))
                        }}
                      >
                        {fmtTime(t)}
                      </button>
                    ))}
                  </div>
                )}
              </fieldset>

              <fieldset id="bk-name" className={missing.includes('name') ? 'bk-step is-missing' : 'bk-step'}>
                <legend>
                  <span className="bk-num">5</span> Who’s it for?
                </legend>
                <label className="field">
                  <span>Your name</span>
                  <input
                    id="bk-name-input"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (e.target.value.trim()) setMissing((m) => m.filter((x) => x !== 'name'))
                    }}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="field">
                  <span>
                    Mobile <em>optional</em>
                  </span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
                </label>
                {occasion === 'match' && (
                  <label className="field">
                    <span>
                      Which match? <em>optional</em>
                    </span>
                    <input value={match} onChange={(e) => setMatch(e.target.value)} placeholder="Teams, or the competition" />
                  </label>
                )}
                <label className="field">
                  <span>
                    Anything we should know? <em>optional</em>
                  </span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder={
                      occasion === 'hire'
                        ? 'What you’re planning, food, timings'
                        : 'Bringing a cake? Want pizzas for the table?'
                    }
                  />
                </label>
                <p className="bk-note">The team replies to the address you send from.</p>
              </fieldset>
            </div>
          ) : (
            email && (
              <div className="preview">
                <p className="bk-note">
                  Check it over. When you tap send, your email app opens with all of this filled in, ready to go to the pub.
                </p>
                <div className="email">
                  <dl>
                    <div>
                      <dt>To</dt>
                      <dd>{venue.email}</dd>
                    </div>
                    <div>
                      <dt>Subject</dt>
                      <dd>{email.subject}</dd>
                    </div>
                  </dl>
                  <pre>{email.body}</pre>
                </div>
                {opened && (
                  <p className="bk-note bk-note--tip">
                    Email app didn’t open? Copy the text and send it to <strong>{venue.email}</strong>.
                  </p>
                )}
              </div>
            )
          )}
        </div>

        <div className="sheet-foot">
          {view === 'form' ? (
            <>
              <p className="sheet-summary" aria-live="polite">
                {summary.join(' · ')}
                {missing.length > 0 && (
                  <span className="sheet-missing">Still need: {missing.join(', ')}</span>
                )}
              </p>
              <button type="button" className="cbtn cbtn--pink cbtn--lg" onClick={toPreview}>
                Preview email
              </button>
            </>
          ) : (
            <>
              <button type="button" className="text-btn" onClick={() => setView('form')}>
                ‹ Edit
              </button>
              <button type="button" className="text-btn" onClick={copyText}>
                {copied ? 'Copied' : 'Copy text'}
              </button>
              <a className="cbtn cbtn--pink cbtn--lg" href={mailto} onClick={() => setOpened(true)}>
                Send to the pub
              </a>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
