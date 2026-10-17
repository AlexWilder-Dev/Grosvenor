import { SectionClip } from '../components/SectionClip'
import { CLIP, reviews, venue } from '../data'

const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`

const CHAPTERS = [
  {
    when: 'Mid-Victorian',
    title: 'A corner pub on a Georgian street',
    text: 'Two bars on the corner of Sidney Road: a mid-Victorian local on a street of Georgian houses.',
  },
  {
    when: '1898',
    title: 'The back room',
    text: 'Built on in 1898, the back room went on to host live music four or five nights a week: folk and punk.',
  },
  {
    when: 'July 2014',
    title: 'The doors shut',
    text: 'The Grosvenor closed, and the street lost its local.',
  },
  {
    when: 'Then',
    title: 'The street said no',
    text: 'Locals, CAMRA and Lambeth councillors got it listed as an Asset of Community Value, and kept the case for the pub alive.',
  },
  {
    when: '22 March 2019',
    title: 'Open again',
    text: `Reopened by the team behind ${venue.sister.name}, with the taps back on and the lights back up.`,
  },
  {
    when: '2020',
    title: 'A brewery downstairs, for a while',
    text: 'From 2020 Affinity Brew Co brewed in the cellar. That chapter has closed; the taps now pour guest breweries.',
  },
]

export function Story() {
  return (
    <section className="section story" id="story" aria-labelledby="story-title">
      <div className="story-grid">
        <div className="story-head">
          <div className="section-head">
            <SectionClip
              look={{ bg: CLIP.paper, accent: CLIP.red, ink: CLIP.black, rim: CLIP.black, motif: 'shapes' }}
              top="SAVED BY ITS STREET"
              bottom="REOPENED 22 MARCH"
              centre="2019"
              centreSize={33}
              tilt={5}
            />
            <div>
              <p className="kicker">The story</p>
              <h2 className="section-title" id="story-title">
                The pub its street saved
              </h2>
            </div>
          </div>
          <blockquote className="story-quote">
            <p>“{reviews[0].text}”</p>
            <cite>{reviews[0].source}</cite>
          </blockquote>

          <figure className="story-photo">
            <img
              src={media('grosvenor-gold-clip.jpg')}
              width={750}
              height={744}
              loading="lazy"
              alt="A round Affinity Brew Co clip reading ‘Grosvenor Gold’ propped in the pub window next to a takeaway bottle, with the street outside."
            />
            <figcaption>Grosvenor Gold, from the cellar-brewing days.</figcaption>
          </figure>
        </div>

        <ol className="chapters">
          {CHAPTERS.map((c) => (
            <li key={c.when}>
              <span className="chapter-when">{c.when}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
          <li className="chapter-now">
            <span className="chapter-when">Now</span>
            <h3>Still the street’s pub</h3>
            <p>Twenty-five taps, pizza till 10pm, the match on the screens, and room for your lot.</p>
          </li>
        </ol>
      </div>
    </section>
  )
}
