import { createContext, useContext, useEffect, useState } from 'react'
import { DAY_SHORT, HOURS, PIZZA_UNTIL, type DayIndex } from '../data'

export type LondonNow = {
  day: DayIndex
  minutes: number
  date: { y: number; m: number; d: number }
  override: boolean
}

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const londonParts = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function realLondonNow(at = new Date()): LondonNow {
  const parts = Object.fromEntries(londonParts.formatToParts(at).map((p) => [p.type, p.value]))
  const day = DAY_KEYS.indexOf(parts.weekday.toLowerCase().slice(0, 3)) as DayIndex
  return {
    day,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    date: { y: Number(parts.year), m: Number(parts.month), d: Number(parts.day) },
    override: false,
  }
}

// ?at=sat-21:45 sets the clock for demos. Read from the real query string or the hash's.
export function readAtParam(): { day: DayIndex; minutes: number } | null {
  const hashQuery = window.location.hash.split('?')[1] ?? ''
  const raw =
    new URLSearchParams(window.location.search).get('at') ?? new URLSearchParams(hashQuery).get('at')
  if (!raw) return null
  const match = raw.trim().toLowerCase().match(/^([a-z]{3})[a-z]*[-_ ]?(\d{1,2}):?(\d{2})$/)
  if (!match) return null
  const day = DAY_KEYS.indexOf(match[1])
  const h = Number(match[2])
  const m = Number(match[3])
  if (day < 0 || h > 23 || m > 59) return null
  return { day: day as DayIndex, minutes: h * 60 + m }
}

function currentNow(): LondonNow {
  const real = realLondonNow()
  const at = readAtParam()
  return at ? { ...real, ...at, override: true } : real
}

export const ClockContext = createContext<LondonNow>(realLondonNow())

export function useClockSource(): LondonNow {
  const [now, setNow] = useState(currentNow)
  useEffect(() => {
    const tick = () => setNow(currentNow())
    const id = window.setInterval(tick, 30_000)
    window.addEventListener('hashchange', tick)
    window.addEventListener('popstate', tick)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('hashchange', tick)
      window.removeEventListener('popstate', tick)
    }
  }, [])
  return now
}

export const useClock = () => useContext(ClockContext)

/* ---------- Formatting ---------- */

export function fmtTime(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  const suffix = h24 >= 12 ? 'pm' : 'am'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, '0')}${suffix}`
}

export function fmtClock(now: LondonNow): string {
  return `${DAY_SHORT[now.day]} ${fmtTime(now.minutes)}`
}

/* ---------- Status ---------- */

export type Status = {
  open: boolean
  label: string
  pizzaOn: boolean
  pizzaLabel: string
}

export function statusAt(day: DayIndex, minutes: number): Status {
  const today = HOURS[day]
  const pizzaOn = minutes < PIZZA_UNTIL
  const pizzaLabel = pizzaOn ? `Pizza till ${fmtTime(PIZZA_UNTIL)}` : 'Kitchen closed'

  if (minutes < today.open) {
    return { open: false, label: `Opens ${fmtTime(today.open)}`, pizzaOn, pizzaLabel }
  }
  if (minutes < today.close) {
    return { open: true, label: `Open till ${fmtTime(today.close)}`, pizzaOn, pizzaLabel }
  }
  const next = HOURS[((day + 1) % 7) as DayIndex]
  return { open: false, label: `Opens ${fmtTime(next.open)} tomorrow`, pizzaOn, pizzaLabel }
}

// Kitchen line for the pizza section, a little chattier than the strip.
export function kitchenLine(now: LondonNow): string {
  const today = HOURS[now.day]
  if (now.minutes >= PIZZA_UNTIL) return 'Kitchen’s closed for tonight. Pizza’s back tomorrow.'
  if (now.minutes < today.open) return `Doors open ${fmtTime(today.open)} today. Pizza till 10pm.`
  const left = PIZZA_UNTIL - now.minutes
  if (left <= 60) return `Kitchen closes at 10pm: ${left} minute${left === 1 ? '' : 's'} left to order.`
  return 'Serving till 10pm tonight.'
}
