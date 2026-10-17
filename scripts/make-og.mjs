// One-off: builds public/og.jpg (1200×630 link preview), favicon.svg, favicon-32.png and apple-touch-icon.png.
// Lettering is converted to paths from the site's own fonts so it renders the same everywhere.
// Run with: npm run og
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import sharp from 'sharp'
import opentype from 'opentype.js'

const GREEN = '#0F3B2C'
const GREEN_DEEP = '#0A2A1F'
const CREAM = '#F2E8D0'
const GILT = '#C9A452'
const YELLOW = '#EECB12'
const INK = '#141210'

const loadFont = (path) => {
  const buf = readFileSync(path)
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
}
const serif = loadFont('node_modules/@fontsource/young-serif/files/young-serif-latin-400-normal.woff')
const cond = loadFont('node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff')
const condBold = loadFont('node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff')

function measure(font, text, size, spacing = 0) {
  const scale = size / font.unitsPerEm
  const glyphs = font.stringToGlyphs(text)
  let w = 0
  glyphs.forEach((g, i) => {
    w += g.advanceWidth * scale
    if (i < glyphs.length - 1) w += (font.getKerningValue(g, glyphs[i + 1]) || 0) * scale + spacing
  })
  return w
}

const n2 = (v) => (Math.round(v * 100) / 100).toString()
function pathData(path) {
  return path.commands
    .map((c) => {
      if (c.type === 'M' || c.type === 'L') return `${c.type}${n2(c.x)} ${n2(c.y)}`
      if (c.type === 'Q') return `Q${n2(c.x1)} ${n2(c.y1)} ${n2(c.x)} ${n2(c.y)}`
      if (c.type === 'C') return `C${n2(c.x1)} ${n2(c.y1)} ${n2(c.x2)} ${n2(c.y2)} ${n2(c.x)} ${n2(c.y)}`
      return 'Z'
    })
    .join('')
}

// Text as a single SVG path. anchor: start | middle | end.
function text(font, str, x, y, size, { spacing = 0, anchor = 'start', fill = CREAM } = {}) {
  const scale = size / font.unitsPerEm
  const width = measure(font, str, size, spacing)
  let cx = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
  const glyphs = font.stringToGlyphs(str)
  let d = ''
  glyphs.forEach((g, i) => {
    d += pathData(g.getPath(cx, y, size))
    cx += g.advanceWidth * scale
    if (i < glyphs.length - 1) cx += (font.getKerningValue(g, glyphs[i + 1]) || 0) * scale + spacing
  })
  return `<path d="${d}" fill="${fill}"/>`
}

function fit(font, str, maxWidth, spacingEm = 0) {
  let size = 200
  while (size > 8 && measure(font, str, size, size * spacingEm) > maxWidth) size -= 1
  return size
}

/* ---------- og.jpg ---------- */

const W = 1200
const H = 630
const PANEL = 660
const PAD = 60

const nameSize = fit(serif, 'GROSVENOR', PANEL - PAD * 2, 0.02)
const nameSpacing = nameSize * 0.02
const top = 172

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${PANEL}" height="${H}" fill="${GREEN}"/>
  <rect x="${PAD}" y="${top - 52}" width="${PANEL - PAD * 2}" height="2" fill="${GILT}"/>
  <rect x="${PAD}" y="${top - 46}" width="${PANEL - PAD * 2}" height="2" fill="${GILT}"/>
  ${text(serif, 'THE', PAD, top, 24, { spacing: 10, fill: GILT })}
  ${text(serif, 'GROSVENOR', PAD, top + nameSize * 0.98, nameSize, { spacing: nameSpacing, fill: GILT })}
  ${text(serif, 'ARMS', PAD, top + nameSize * 1.92, nameSize, { spacing: nameSpacing, fill: GILT })}
  <rect x="${PAD}" y="${top + nameSize * 2.14}" width="${PANEL - PAD * 2}" height="2" fill="${GILT}"/>
  <rect x="${PAD}" y="${top + nameSize * 2.14 + 6}" width="${PANEL - PAD * 2}" height="2" fill="${GILT}"/>
  ${text(cond, '25 beer & cider taps · Pizza till 10pm', PAD, 440, 34, { spacing: 0.4 })}
  ${text(cond, 'Sky & TNT Sports · Sidney Road, SW9', PAD, 484, 34, { spacing: 0.4, fill: 'rgba(242,232,208,0.74)' })}
  ${text(condBold, 'BETWEEN BRIXTON & STOCKWELL', PAD, 548, 18, { spacing: 3.2, fill: 'rgba(242,232,208,0.5)' })}

  <g transform="translate(${PANEL} 470) rotate(-8)">
    <circle r="86" fill="${INK}"/>
    <circle r="80" fill="${YELLOW}"/>
    <circle r="54" fill="none" stroke="${INK}" stroke-width="3"/>
    ${text(serif, '25', 0, 14, 52, { anchor: 'middle', fill: INK })}
    ${text(condBold, 'ON TAP', 0, -30, 16, { anchor: 'middle', spacing: 3, fill: INK })}
    ${text(condBold, 'BEER & CIDER', 0, 66, 12, { anchor: 'middle', spacing: 2, fill: INK })}
  </g>
</svg>`

const photo = await sharp('public/media/clip-pile.jpg')
  .extract({ left: 54, top: 0, width: 642, height: 741 })
  .resize(W - PANEL, H, { fit: 'cover' })
  .toBuffer()

await sharp({ create: { width: W, height: H, channels: 3, background: GREEN } })
  .composite([
    { input: photo, left: PANEL, top: 0 },
    { input: Buffer.from(og), left: 0, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true, progressive: true })
  .toFile('public/og.jpg')

const meta = await sharp('public/og.jpg').metadata()
console.log(`og.jpg ${meta.width}×${meta.height}, ${Math.round(statSync('public/og.jpg').size / 1024)}KB`)

/* ---------- Icons: a round clip with the name in its band ---------- */

function clipIcon(size, { square = false } = {}) {
  const c = size / 2
  const r = square ? size * 0.44 : size / 2
  const band = r * 0.42
  const word = 'GROSVENOR'
  const wordSize = fit(serif, word, r * 1.62, 0.02)
  const small = Math.max(6, r * 0.2)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${square ? `<rect width="${size}" height="${size}" fill="${GREEN_DEEP}"/>` : ''}
  <circle cx="${c}" cy="${c}" r="${r}" fill="${CREAM}"/>
  <circle cx="${c}" cy="${c}" r="${r * 0.9}" fill="${GREEN}"/>
  <rect x="${c - r * 0.9}" y="${c - band / 2}" width="${r * 1.8}" height="${band}" fill="${GILT}"/>
  ${text(serif, word, c, c + wordSize * 0.35, wordSize, { anchor: 'middle', spacing: wordSize * 0.02, fill: GREEN_DEEP })}
  ${text(condBold, 'THE', c, c - band / 2 - r * 0.14, small, { anchor: 'middle', spacing: small * 0.25 })}
  ${text(condBold, 'ARMS', c, c + band / 2 + r * 0.14 + small * 0.72, small, { anchor: 'middle', spacing: small * 0.25 })}
</svg>`
}

writeFileSync('public/favicon.svg', clipIcon(64))
await sharp(Buffer.from(clipIcon(64))).resize(32, 32).png().toFile('public/favicon-32.png')
await sharp(Buffer.from(clipIcon(180, { square: true }))).png().toFile('public/apple-touch-icon.png')
console.log('favicon.svg, favicon-32.png, apple-touch-icon.png written')
