import { useState } from 'react'
import { ClipLink } from '../components/Buttons'
import { SectionClip } from '../components/SectionClip'
import { CLIP, HOURS_ROWS, venue } from '../data'
import { statusAt, useClock } from '../lib/clock'

const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`

export function FindUs() {
  const now = useClock()
  const status = statusAt(now.day, now.minutes)
  const [copied, setCopied] = useState(false)

  const copyPostcode = async () => {
    try {
      await navigator.clipboard.writeText(`${venue.name}, ${venue.street}, London ${venue.postcode}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="section find" id="find-us" aria-labelledby="find-title">
      <div className="find-grid">
        <div className="find-copy">
          <div className="section-head">
            <SectionClip
              look={{ bg: CLIP.green, accent: CLIP.paper, ink: CLIP.paper, rim: CLIP.paper, motif: 'split' }}
              top="17 SIDNEY ROAD"
              bottom="BRIXTON · STOCKWELL"
              centre="SW9"
              centreSize={38}
              tilt={-6}
            />
            <div>
              <p className="kicker">Find us</p>
              <h2 className="section-title" id="find-title">
                Down Sidney Road, between two stations
              </h2>
            </div>
          </div>

          <address className="address">
            <span>{venue.name}</span>
            <span>{venue.street}</span>
            <span>London {venue.postcode}</span>
          </address>

          <div className="find-actions">
            <ClipLink tone="cream" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
              Directions in Google Maps <span aria-hidden="true">↗</span>
            </ClipLink>
            <button type="button" className="text-btn" onClick={copyPostcode}>
              {copied ? 'Address copied' : 'Copy the address'}
            </button>
          </div>

          <div className="line-diagram" role="img" aria-label="The pub sits between Stockwell station, on the Victoria and Northern lines, and Brixton station, on the Victoria line.">
            <div className="ld-stop">
              <span className="ld-dot" />
              <strong>Stockwell</strong>
              <span className="ld-lines">
                <i className="ld-victoria">Victoria</i>
                <i className="ld-northern">Northern</i>
              </span>
            </div>
            <div className="ld-track" aria-hidden="true">
              <span className="ld-pub">
                <svg viewBox="0 0 40 40" width="40" height="40">
                  <circle cx="20" cy="20" r="19" fill={CLIP.paper} />
                  <circle cx="20" cy="20" r="15" fill={CLIP.pink} />
                  <rect x="4" y="16" width="32" height="8" fill={CLIP.paper} />
                </svg>
                <em>The Grosvenor</em>
              </span>
            </div>
            <div className="ld-stop">
              <span className="ld-dot" />
              <strong>Brixton</strong>
              <span className="ld-lines">
                <i className="ld-victoria">Victoria</i>
              </span>
            </div>
          </div>

          <p className="find-tip">
            Sidney Road is a quiet residential street, so it’s easy to walk past. Look for the corner building with a few
            tables out front under the awning.
          </p>
        </div>

        <div className="find-side">
          <div className="hours">
            <div className="hours-head">
              <h3>Opening hours</h3>
              <span className={status.open ? 'hours-now is-open' : 'hours-now'}>{status.label}</span>
            </div>
            <table>
              <tbody>
                {HOURS_ROWS.map((row) => (
                  <tr key={row.label} className={row.days.includes(now.day) ? 'is-today' : undefined}>
                    <th scope="row">
                      {row.label}
                      {row.days.includes(now.day) && <span className="today-tag">Today</span>}
                    </th>
                    <td>{row.text}</td>
                  </tr>
                ))}
                <tr className="hours-pizza">
                  <th scope="row">Pizza</th>
                  <td>till 10pm, daily</td>
                </tr>
              </tbody>
            </table>
            <ul className="facilities">
              <li>Sky Sports &amp; TNT Sports</li>
              <li>Pool table</li>
              <li>A few outside tables under an awning</li>
            </ul>
          </div>

          <figure className="find-photo">
            <img
              src={media('outside-table.jpg')}
              width={750}
              height={744}
              loading="lazy"
              alt="A hazy pint on one of the outside tables in the evening sun, with the street behind."
            />
            <figcaption>Outside tables, for when the sun’s out.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
