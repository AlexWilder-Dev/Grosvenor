import { motion, useReducedMotion } from 'framer-motion'
import type { ClipLook } from '../data'
import { Clip, ClipCentre } from './Clip'

// The clip that heads each section, hung on the wall at a slight angle.
export function SectionClip({
  look,
  top,
  bottom,
  centre,
  centreSize = 50,
  tilt = -6,
}: {
  look: ClipLook
  top: string
  bottom: string
  centre: string
  centreSize?: number
  tilt?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="section-clip"
      initial={reduce ? false : { rotate: tilt - 24, scale: 0.6, opacity: 0 }}
      whileInView={{ rotate: tilt, scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      style={reduce ? { rotate: tilt } : undefined}
    >
      <Clip look={look} top={top} bottom={bottom}>
        <ClipCentre text={centre} look={look} size={centreSize} plate />
      </Clip>
    </motion.div>
  )
}
