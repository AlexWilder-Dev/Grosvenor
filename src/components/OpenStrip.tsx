import { fmtClock, statusAt, useClock } from '../lib/clock'
import { BookButton, scrollToSection } from './Buttons'

const NAV = [
  { id: 'taps', label: 'Taps' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'sport', label: 'Sport' },
  { id: 'story', label: 'Story' },
  { id: 'find-us', label: 'Find us' },
]

function clearDemoClock() {
  const url = new URL(window.location.href)
  url.searchParams.delete('at')
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function OpenStrip() {
  const now = useClock()
  const status = statusAt(now.day, now.minutes)

  return (
    <div className="strip">
      <div className="strip-inner">
        <p className="strip-status" aria-live="polite">
          <span className={status.open ? 'strip-dot is-open' : 'strip-dot'} aria-hidden="true" />
          <span className="strip-open">{status.label}</span>
          <span className="strip-sep" aria-hidden="true" />
          <span className={status.pizzaOn ? 'strip-pizza' : 'strip-pizza is-off'}>{status.pizzaLabel}</span>
        </p>

        {now.override && (
          <button type="button" className="strip-demo" onClick={clearDemoClock} title="Back to the real time">
            Demo clock · {fmtClock(now)} <span aria-hidden="true">×</span>
          </button>
        )}

        <nav className="strip-nav" aria-label="Sections">
          {NAV.map((item) => (
            <button key={item.id} type="button" onClick={() => scrollToSection(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        <BookButton tone="cream" size="sm" className="strip-book">
          Book
        </BookButton>
      </div>
    </div>
  )
}
