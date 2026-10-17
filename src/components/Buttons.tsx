import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { OccasionId } from '../data'
import { rememberOpener } from '../lib/focus'

// Buttons are stretched clips: a pill with the clip's inner rim ring.

type Tone = 'cream' | 'pink' | 'yellow' | 'sky' | 'sea' | 'ghost' | 'green'

function cls(tone: Tone, size: 'sm' | 'md' | 'lg', extra?: string) {
  return ['cbtn', `cbtn--${tone}`, `cbtn--${size}`, extra].filter(Boolean).join(' ')
}

export function ClipButton({
  tone = 'cream',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; size?: 'sm' | 'md' | 'lg'; children: ReactNode }) {
  return (
    <button type="button" className={cls(tone, size, className)} {...rest}>
      {children}
    </button>
  )
}

export function ClipLink({
  tone = 'cream',
  size = 'md',
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { tone?: Tone; size?: 'sm' | 'md' | 'lg'; children: ReactNode }) {
  return (
    <a className={cls(tone, size, className)} {...rest}>
      {children}
    </a>
  )
}

export function useOpenBooking() {
  const navigate = useNavigate()
  return (occasion?: OccasionId, size?: number) => {
    const params = new URLSearchParams()
    if (occasion) params.set('occasion', occasion)
    if (size) params.set('size', String(size))
    const search = params.toString()
    rememberOpener()
    navigate({ pathname: '/book', search: search ? `?${search}` : '' }, { state: { fromPage: true } })
  }
}

export function BookButton({
  occasion,
  people,
  children = 'Book a table',
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  occasion?: OccasionId
  people?: number
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}) {
  const open = useOpenBooking()
  return (
    <ClipButton onClick={() => open(occasion, people)} {...rest}>
      {children}
    </ClipButton>
  )
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
