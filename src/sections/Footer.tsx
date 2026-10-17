import { BookButton } from '../components/Buttons'
import { venue } from '../data'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-name">
          <p className="fascia fascia--small">
            <span className="fascia-the">The</span>
            <span className="fascia-name">Grosvenor Arms</span>
          </p>
          <p>
            {venue.street}, London {venue.postcode}
          </p>
          <p>
            <a href={`mailto:${venue.email}`}>{venue.email}</a>
          </p>
          <BookButton tone="cream" size="md">
            Book a table
          </BookButton>
        </div>

        <div>
          <h3>Follow along</h3>
          <ul className="footer-links">
            {venue.socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  <span>{s.label}</span> {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Our sister pub</h3>
          <p className="footer-sister">
            <strong>{venue.sister.name}</strong>
            <span>{venue.sister.address}</span>
          </p>
        </div>
      </div>

      <div className="footer-base">
        <p>Tap list shown is a sample board.</p>
        <p>Site by AlexWilder-Dev</p>
      </div>
    </footer>
  )
}
