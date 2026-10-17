import { Clip, ClipCentre } from '../components/Clip'
import { ClipLink } from '../components/Buttons'
import { SectionClip } from '../components/SectionClip'
import { CLIP, deals, dips, pizzas, starters, venue } from '../data'
import { kitchenLine, useClock } from '../lib/clock'

const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`

const dealLooks = [
  { bg: CLIP.yellow, accent: CLIP.red, ink: CLIP.black, rim: CLIP.black, motif: 'rings' as const },
  { bg: CLIP.pink, accent: CLIP.paper, ink: CLIP.paper, rim: CLIP.paper, motif: 'dots' as const },
]

export function Pizza() {
  const now = useClock()
  const signature = pizzas.find((p) => p.signature)!
  const kitchenOn = now.minutes < 22 * 60

  return (
    <section className="section pizza" id="pizza" aria-labelledby="pizza-title">
      <div className="pizza-grid">
        <div className="pizza-side">
          <div className="section-head">
            <SectionClip
              look={{ bg: CLIP.red, accent: CLIP.paper, ink: CLIP.paper, rim: CLIP.paper, motif: 'quarters' }}
              top="STONE-BAKED"
              bottom="TILL 10PM DAILY"
              centre={'12″'}
              tilt={6}
            />
            <div>
              <p className="kicker">From the kitchen</p>
              <h2 className="section-title" id="pizza-title">
                Pizza till 10pm, every day
              </h2>
            </div>
          </div>

          <p className="lede">
            Twelve-inch and stone-baked, on dough rested for 24 hours. The house signature is the Honey and Walnut.
          </p>

          <p className={kitchenOn ? 'kitchen-line' : 'kitchen-line is-off'} aria-live="polite">
            <span className="strip-dot is-open" aria-hidden="true" />
            {kitchenLine(now)}
          </p>

          <figure className="signature">
            <div className="signature-photo">
              <img
                src={media('pizza-honey-walnut.jpg')}
                width={750}
                height={747}
                loading="lazy"
                alt="The Honey and Walnut pizza from above: spinach, walnuts, raisins and goat's cheese on a blistered crust."
              />
            </div>
            <figcaption>
              <span className="signature-tag">The signature</span>
              <strong>{signature.name}</strong>
              <span>{signature.toppings}.</span>
              <span className="price">£{signature.price}</span>
            </figcaption>
          </figure>

          <div className="deliveroo">
            <p>
              Staying in? Order for delivery on Deliveroo, where the kitchen is listed as{' '}
              <em>Wilson’s Pizzas at the Grosvenor Arms</em>.
            </p>
            <ClipLink tone="sea" size="md" href={venue.deliveroo} target="_blank" rel="noopener noreferrer">
              Order on Deliveroo <span aria-hidden="true">↗</span>
            </ClipLink>
          </div>
        </div>

        <div className="menu-card">
          <div className="menu-head">
            <h3>Pizzas</h3>
            <p>12-inch · stone-baked · 24-hour dough</p>
          </div>
          <ul className="menu-list">
            {pizzas.map((p) => (
              <li key={p.name} className={p.signature ? 'is-signature' : undefined}>
                <div className="menu-row">
                  <span className="menu-name">
                    {p.name}
                    {p.signature && <span className="menu-flag">Signature</span>}
                  </span>
                  <span className="menu-leader" aria-hidden="true" />
                  <span className="menu-price">£{p.price}</span>
                </div>
                <p className="menu-desc">{p.toppings}</p>
              </li>
            ))}
          </ul>

          <div className="menu-cols">
            <div>
              <h3>Starters</h3>
              <ul className="menu-list menu-list--tight">
                {starters.map((s) => (
                  <li key={s.name}>
                    <div className="menu-row">
                      <span className="menu-name">{s.name}</span>
                      <span className="menu-leader" aria-hidden="true" />
                      <span className="menu-price">
                        {s.from && <small>from </small>}£{s.price}
                      </span>
                    </div>
                    {s.detail && <p className="menu-desc">{s.detail}</p>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>
                Dips <span className="menu-each">£{dips.price} each</span>
              </h3>
              <ul className="menu-list menu-list--tight">
                {dips.items.map((d) => (
                  <li key={d.name}>
                    <div className="menu-row">
                      <span className={d.detail ? 'menu-name menu-hot' : 'menu-name'}>{d.name}</span>
                    </div>
                    {d.detail && <p className="menu-desc">{d.detail}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="deals">
            {deals.map((deal, i) => (
              <div className="deal" key={deal.name}>
                <div className="deal-clip">
                  <Clip look={dealLooks[i]} top={deal.name.toUpperCase()} bottom="MEAL DEAL" label={`${deal.name}, £${deal.price}`}>
                    <ClipCentre text={`£${deal.price}`} look={dealLooks[i]} size={34} font="condensed" plate />
                  </Clip>
                </div>
                <p>{deal.items}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
