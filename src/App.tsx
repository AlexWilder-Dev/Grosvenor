import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BookingSheet } from './components/BookingSheet'
import { OpenStrip } from './components/OpenStrip'
import { ClockContext, useClockSource } from './lib/clock'
import { restoreOpener } from './lib/focus'
import { Bookings } from './sections/Bookings'
import { FindUs } from './sections/FindUs'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Pizza } from './sections/Pizza'
import { Sport } from './sections/Sport'
import { Story } from './sections/Story'
import { TapWall } from './sections/TapWall'

export function App() {
  const now = useClockSource()
  const location = useLocation()
  const booking = location.pathname === '/book'

  useEffect(() => {
    if (!booking) restoreOpener()
  }, [booking])

  return (
    <MotionConfig reducedMotion="user">
      <ClockContext.Provider value={now}>
        <div className="page" inert={booking ? true : undefined}>
          <OpenStrip />
          <main>
            <Hero />
            <TapWall />
            <Pizza />
            <Bookings />
            <Sport />
            <Story />
            <FindUs />
          </main>
          <Footer />
        </div>
        <AnimatePresence>{booking && <BookingSheet key="book" />}</AnimatePresence>
      </ClockContext.Provider>
    </MotionConfig>
  )
}
