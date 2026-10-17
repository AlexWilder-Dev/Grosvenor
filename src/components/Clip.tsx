import { useId, type ReactNode } from 'react'
import type { ClipLook, Motif } from '../data'

// A round keg clip, like the ones in their clip pile: rim, lettered outer ring, artwork in the middle.

type ClipProps = {
  look: ClipLook
  top?: string
  bottom?: string
  children?: ReactNode
  className?: string
  label?: string
}

const ART_R = 64

function spacingFor(text: string, budget: number, size: number) {
  const natural = text.length * size * 0.5
  return Math.max(0.5, Math.min(7, (budget - natural) / Math.max(text.length, 1)))
}

export function Clip({ look, top, bottom, children, className, label }: ClipProps) {
  const id = useId().replace(/:/g, '')
  const topSize = top && top.length > 16 ? 14 : 16
  const bottomSize = bottom && bottom.length > 18 ? 12.5 : 14

  return (
    <svg
      viewBox="0 0 200 200"
      className={className ? `clip ${className}` : 'clip'}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <clipPath id={`art-${id}`}>
          <circle cx="100" cy="100" r={ART_R} />
        </clipPath>
        <path id={`top-${id}`} d="M 23 100 A 77 77 0 0 1 177 100" />
        <path id={`bot-${id}`} d="M 13 100 A 87 87 0 0 0 187 100" />
      </defs>

      <circle cx="100" cy="100" r="99" fill={look.rim} />
      <circle cx="100" cy="100" r="94" fill={look.bg} />

      <g clipPath={`url(#art-${id})`}>
        <circle cx="100" cy="100" r={ART_R} fill={look.bg} />
        <MotifArt motif={look.motif} bg={look.bg} accent={look.accent} ink={look.ink} id={id} />
      </g>
      <circle cx="100" cy="100" r={ART_R} fill="none" stroke={look.ink} strokeWidth="2.5" />

      {top && (
        <text className="clip-arc" fontSize={topSize} fill={look.ink} letterSpacing={spacingFor(top, 200, topSize)}>
          <textPath href={`#top-${id}`} startOffset="50%" textAnchor="middle">
            {top}
          </textPath>
        </text>
      )}
      {bottom && (
        <text
          className="clip-arc"
          fontSize={bottomSize}
          fill={look.ink}
          letterSpacing={spacingFor(bottom, 190, bottomSize)}
        >
          <textPath href={`#bot-${id}`} startOffset="50%" textAnchor="middle">
            {bottom}
          </textPath>
        </text>
      )}
      {top && bottom && (
        <>
          <circle cx="15" cy="100" r="3" fill={look.ink} />
          <circle cx="185" cy="100" r="3" fill={look.ink} />
        </>
      )}

      {children}
    </svg>
  )
}

/* Centre lettering with a halo in the clip's ground colour, so it reads over any artwork. */
export function ClipCentre({
  text,
  look,
  size = 54,
  y = 100,
  font = 'serif',
  plate = false,
}: {
  text: string
  look: ClipLook
  size?: number
  y?: number
  font?: 'serif' | 'condensed'
  plate?: boolean
}) {
  if (plate) {
    return (
      <>
        <circle cx="100" cy="100" r="45" fill={look.bg} stroke={look.ink} strokeWidth="2.5" />
        <text
          x="100"
          y={y}
          className={font === 'serif' ? 'clip-num' : 'clip-cond'}
          fontSize={size}
          textAnchor="middle"
          dominantBaseline="central"
          fill={look.ink}
        >
          {text}
        </text>
      </>
    )
  }
  return (
    <text
      x="100"
      y={y}
      className={font === 'serif' ? 'clip-num' : 'clip-cond'}
      fontSize={size}
      textAnchor="middle"
      dominantBaseline="central"
      fill={look.ink}
      stroke={look.bg}
      strokeWidth={size / 7}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {text}
    </text>
  )
}

function MotifArt({ motif, bg, accent, ink, id }: { motif: Motif; bg: string; accent: string; ink: string; id: string }) {
  switch (motif) {
    case 'band':
      return (
        <>
          <rect x="0" y="76" width="200" height="48" fill={accent} />
          <rect x="0" y="70" width="200" height="3" fill={accent} />
          <rect x="0" y="127" width="200" height="3" fill={accent} />
        </>
      )
    case 'stripes':
      return (
        <>
          <defs>
            <pattern id={`st-${id}`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
              <rect width="10" height="22" fill={accent} />
            </pattern>
          </defs>
          <rect width="200" height="200" fill={`url(#st-${id})`} />
        </>
      )
    case 'sun': {
      const rays = Array.from({ length: 16 }, (_, i) => {
        const a0 = (i / 16) * Math.PI * 2
        const a1 = ((i + 0.5) / 16) * Math.PI * 2
        return `M100 132 L${100 + Math.cos(a0) * 160} ${132 + Math.sin(a0) * 160} L${100 + Math.cos(a1) * 160} ${132 + Math.sin(a1) * 160} Z`
      })
      return (
        <>
          <path d={rays.join(' ')} fill={accent} />
          <circle cx="100" cy="132" r="22" fill={bg} stroke={ink} strokeWidth="2.5" />
        </>
      )
    }
    case 'dots':
      return (
        <>
          {Array.from({ length: 36 }, (_, i) => {
            const col = i % 6
            const row = Math.floor(i / 6)
            return <circle key={i} cx={38 + col * 25 + (row % 2) * 12} cy={38 + row * 25} r="7.5" fill={accent} />
          })}
        </>
      )
    case 'split':
      return (
        <>
          <rect x="0" y="100" width="200" height="100" fill={accent} />
          <path d="M0 100 Q 50 86 100 100 T 200 100 V 104 H 0 Z" fill={ink} />
        </>
      )
    case 'waves':
      return (
        <>
          {[52, 78, 104, 130, 156].map((y) => (
            <path
              key={y}
              d={`M0 ${y} q 16 -12 32 0 t 32 0 t 32 0 t 32 0 t 32 0 t 32 0 t 32 0`}
              fill="none"
              stroke={accent}
              strokeWidth="9"
            />
          ))}
        </>
      )
    case 'chevron':
      return (
        <>
          {[40, 72, 104, 136].map((y) => (
            <path key={y} d={`M20 ${y + 20} L100 ${y - 8} L180 ${y + 20}`} fill="none" stroke={accent} strokeWidth="12" />
          ))}
        </>
      )
    case 'rings':
      return (
        <>
          {[60, 46, 32, 18].map((r, i) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={i % 2 ? ink : accent} strokeWidth="8" />
          ))}
        </>
      )
    case 'shapes':
      return (
        <>
          <rect x="44" y="40" width="46" height="26" rx="13" transform="rotate(-24 67 53)" fill={accent} />
          <circle cx="134" cy="62" r="15" fill={ink} opacity="0.85" />
          <path d="M120 120 l38 8 l-26 30 z" fill={accent} />
          <rect x="54" y="122" width="40" height="22" rx="11" transform="rotate(18 74 133)" fill={ink} opacity="0.85" />
          <circle cx="60" cy="96" r="8" fill={accent} />
        </>
      )
    case 'quarters':
      return (
        <>
          <rect x="0" y="0" width="100" height="100" fill={accent} />
          <rect x="100" y="100" width="100" height="100" fill={accent} />
        </>
      )
  }
}
