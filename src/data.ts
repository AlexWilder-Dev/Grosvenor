// Everything the site says about the pub lives here.

export const venue = {
  name: 'The Grosvenor Arms',
  street: '17 Sidney Road',
  area: 'London',
  postcode: 'SW9 0TP',
  email: 'thegrosvenorarmsbrixton@gmail.com',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=The+Grosvenor+Arms&query_place_id=ChIJiY-tN3AFdkgR17_5Blgj8HM',
  deliveroo: 'https://deliveroo.co.uk/menu/london/stockwell/wilsons-pizzas-at-the-grosvenor-arms',
  rating: { score: '4.6', count: 203 },
  socials: [
    { label: 'Instagram', handle: '@grosvenorarms17', url: 'https://instagram.com/grosvenorarms17' },
    { label: 'Facebook', handle: '/GrosvenorArms17', url: 'https://facebook.com/GrosvenorArms17' },
    { label: 'X', handle: '@GrosvenorArms17', url: 'https://x.com/GrosvenorArms17' },
  ],
  sister: { name: 'The Priory Arms', address: '83 Lansdowne Way, SW8' },
}

// Their own lines, quoted as written.
export const lines = {
  taps: '25 beer and cider taps',
  location: 'Situated between Brixton and Stockwell Tube Stations',
  pizza: 'Fresh pizza served daily til 10pm',
  bookings: "We take bookings of any size plus we're always open to a private hire",
}

export const reviews = [
  { text: 'felt like a pub from yesteryear but with modern twists', source: 'Google review' },
  { text: 'friendly staff, we all had great beers', source: 'Google review' },
]

/* ---------- Hours ---------- */

// Day index: 0 = Monday … 6 = Sunday. Times are minutes after midnight, London time.
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const weekday = { open: 16 * 60, close: 23 * 60 + 30 }
export const HOURS: Record<DayIndex, { open: number; close: number }> = {
  0: weekday,
  1: weekday,
  2: weekday,
  3: weekday,
  4: weekday,
  5: { open: 12 * 60, close: 23 * 60 + 30 },
  6: { open: 12 * 60, close: 22 * 60 + 30 },
}

export const PIZZA_UNTIL = 22 * 60

// Grouped rows for the printed hours table.
export const HOURS_ROWS: { label: string; days: DayIndex[]; text: string }[] = [
  { label: 'Mon – Fri', days: [0, 1, 2, 3, 4], text: '4pm – 11:30pm' },
  { label: 'Saturday', days: [5], text: '12pm – 11:30pm' },
  { label: 'Sunday', days: [6], text: '12pm – 10:30pm' },
]

/* ---------- Pizza ---------- */

export type Pizza = { name: string; toppings: string; price: string; signature?: boolean }

export const pizzas: Pizza[] = [
  { name: 'Margarita', toppings: 'Tomato, fior di latte, parmesan, basil', price: '7.75' },
  { name: 'Veggie', toppings: 'Tomato, fior di latte, mushrooms, courgette, peppers, sweetcorn, onion', price: '8.75' },
  { name: 'Pepperoni', toppings: 'Tomato, fior di latte, spicy salsiccia', price: '9.00' },
  {
    name: 'Quattro Formaggio',
    toppings: "Tomato, fior di latte, goat's cheese, blue cheese, parmesan, caramelised onion",
    price: '9.00',
  },
  { name: 'Parma Ham', toppings: 'Tomato, fior di latte, Parma ham, rocket, parmesan', price: '10.00' },
  { name: 'Cured Meats', toppings: 'Tomato, fior di latte, salami, nduja, jalapeños', price: '10.00' },
  { name: 'Pulled Pork', toppings: 'BBQ sauce, fior di latte, pulled pork, bacon, peppers, onion', price: '10.00' },
  {
    name: 'Honey and Walnut',
    toppings: "Spinach, fior di latte, walnuts, raisins, goat's cheese, parmesan, honey, olive oil",
    price: '10.00',
    signature: true,
  },
  {
    name: "Landlord's Choice",
    toppings: 'Tomato, fior di latte, spicy salsiccia, blue cheese, jalapeños, onion',
    price: '10.50',
  },
  { name: 'Nduja', toppings: 'Butternut squash cream, fior di latte, nduja, blue cheese, onion', price: '10.50' },
]

export const starters = [
  { name: 'Garlic Bread', detail: 'Garlic, parsley, olive oil', price: '4.00' },
  { name: 'Chicken Wings', detail: '6 or 12, choice of sauces', price: '7.50', from: true },
  { name: 'Chilli Olives', detail: '', price: '4.00' },
]

export const dips = {
  price: '1.25',
  items: [
    { name: 'Garlic Mayo' },
    { name: 'BBQ' },
    { name: 'F*** OFF HOT', detail: 'Scotch bonnet tomato, three chillies' },
  ],
}

export const deals = [
  { name: 'Deal 1', items: '1 pizza + garlic bread + soft drink + dip', price: '11.99' },
  { name: 'Deal 2', items: '2 pizzas + garlic bread or wings + 2 soft drinks + dip', price: '18.99' },
]

/* ---------- Tap wall (sample board) ---------- */

export type Family = 'pale' | 'lager' | 'dark' | 'sour' | 'cider'

export const FAMILIES: { id: Family; label: string }[] = [
  { id: 'pale', label: 'Pale & IPA' },
  { id: 'lager', label: 'Lager' },
  { id: 'dark', label: 'Dark' },
  { id: 'sour', label: 'Sour' },
  { id: 'cider', label: 'Cider' },
]

export type Motif = 'band' | 'stripes' | 'sun' | 'dots' | 'split' | 'waves' | 'chevron' | 'rings' | 'shapes' | 'quarters'

export type ClipLook = { bg: string; accent: string; ink: string; rim: string; motif: Motif }

export type Tap = { n: number; brewery: string; style: string; family: Family; look: ClipLook }

// Colours sampled from their own clip pile photo, plus a few to round out a wall.
export const CLIP = {
  yellow: '#EECB12',
  pink: '#E4176A',
  navy: '#173B52',
  green: '#149A4D',
  sea: '#6EC3C4',
  sky: '#9DB8D0',
  red: '#D8352A',
  orange: '#EE7F2A',
  black: '#141210',
  paper: '#F1EDE2',
  purple: '#6E4A9E',
  lime: '#B5D334',
}

const C = CLIP
const look = (bg: string, accent: string, ink: string, rim: string, motif: Motif): ClipLook => ({
  bg,
  accent,
  ink,
  rim,
  motif,
})

// Sample board: breweries seen on their taps, generic styles, laid out mixed like a real back wall.
export const taps: Tap[] = [
  { n: 1, brewery: 'Kernel', style: 'Pale Ale', family: 'pale', look: look(C.paper, C.black, C.black, C.black, 'band') },
  { n: 2, brewery: 'Paulaner', style: 'Helles Lager', family: 'lager', look: look(C.sky, C.navy, C.navy, C.paper, 'rings') },
  { n: 3, brewery: 'Mondo', style: 'DDH Pale', family: 'pale', look: look(C.pink, C.yellow, C.black, C.black, 'sun') },
  { n: 4, brewery: 'Buxton', style: 'Imperial Stout', family: 'dark', look: look(C.black, C.lime, C.paper, C.lime, 'stripes') },
  { n: 5, brewery: 'Lervig', style: 'Hazy IPA', family: 'pale', look: look(C.orange, C.paper, C.black, C.paper, 'waves') },
  { n: 6, brewery: 'Westons', style: 'Medium Dry Cider', family: 'cider', look: look(C.green, C.paper, C.paper, C.paper, 'quarters') },
  { n: 7, brewery: 'Brew By Numbers', style: 'IPA', family: 'pale', look: look(C.navy, C.sea, C.paper, C.sea, 'chevron') },
  { n: 8, brewery: 'Buxton', style: 'Fruited Sour', family: 'sour', look: look(C.purple, C.pink, C.paper, C.pink, 'dots') },
  { n: 9, brewery: 'Mondo', style: 'Pilsner', family: 'lager', look: look(C.yellow, C.black, C.black, C.black, 'split') },
  { n: 10, brewery: 'Kernel', style: 'Export Stout', family: 'dark', look: look(C.paper, C.red, C.black, C.black, 'shapes') },
  { n: 11, brewery: 'Lervig', style: 'Double IPA', family: 'pale', look: look(C.red, C.yellow, C.paper, C.yellow, 'stripes') },
  { n: 12, brewery: 'Brew By Numbers', style: 'Berliner Weisse', family: 'sour', look: look(C.sea, C.paper, C.navy, C.navy, 'dots') },
  { n: 13, brewery: 'Buxton', style: 'Session IPA', family: 'pale', look: look(C.lime, C.navy, C.navy, C.navy, 'rings') },
  { n: 14, brewery: 'Paulaner', style: 'Märzen', family: 'lager', look: look(C.navy, C.yellow, C.paper, C.paper, 'band') },
  { n: 15, brewery: 'Brew By Numbers', style: 'Porter', family: 'dark', look: look(C.orange, C.black, C.black, C.black, 'chevron') },
  { n: 16, brewery: 'Kernel', style: 'IPA', family: 'pale', look: look(C.black, C.paper, C.paper, C.yellow, 'waves') },
  { n: 17, brewery: 'Lervig', style: 'Fruited Sour', family: 'sour', look: look(C.pink, C.sea, C.paper, C.paper, 'shapes') },
  { n: 18, brewery: 'Mondo', style: 'West Coast IPA', family: 'pale', look: look(C.sea, C.orange, C.black, C.black, 'sun') },
  { n: 19, brewery: 'Westons', style: 'Cloudy Cider', family: 'cider', look: look(C.yellow, C.green, C.black, C.green, 'dots') },
  { n: 20, brewery: 'Lervig', style: 'Pilsner', family: 'lager', look: look(C.paper, C.sky, C.navy, C.navy, 'quarters') },
  { n: 21, brewery: 'Brew By Numbers', style: 'Pale Ale', family: 'pale', look: look(C.purple, C.yellow, C.paper, C.yellow, 'split') },
  { n: 22, brewery: 'Mondo', style: 'Oatmeal Stout', family: 'dark', look: look(C.navy, C.pink, C.paper, C.pink, 'shapes') },
  { n: 23, brewery: 'Kernel', style: 'Berliner Weisse', family: 'sour', look: look(C.paper, C.pink, C.black, C.pink, 'stripes') },
  { n: 24, brewery: 'Kernel', style: 'Lager', family: 'lager', look: look(C.red, C.paper, C.paper, C.paper, 'rings') },
  { n: 25, brewery: 'Buxton', style: 'IPA', family: 'pale', look: look(C.green, C.yellow, C.paper, C.yellow, 'band') },
]

/* ---------- Bookings ---------- */

export const OCCASIONS = [
  { id: 'birthday', label: 'Birthday', colour: C.pink, ink: C.paper },
  { id: 'leaving', label: 'Leaving do', colour: C.yellow, ink: C.black },
  { id: 'match', label: 'The match', colour: C.sky, ink: C.navy },
  { id: 'hire', label: 'Private hire', colour: C.orange, ink: C.black },
  { id: 'drinks', label: 'Just drinks', colour: C.paper, ink: C.black },
] as const

export type OccasionId = (typeof OCCASIONS)[number]['id']
