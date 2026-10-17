import type { OccasionId } from '../data'

// Wording shared by the booking sheet and the preview on the page, so both say the same thing.

export const INTRO: Record<OccasionId, string> = {
  birthday: "I'd like to book a table for a birthday.",
  leaving: "I'd like to book for a leaving do.",
  match: "I'd like to book a table for the match.",
  hire: "I'd like to ask about private hire.",
  drinks: "I'd like to book a table.",
}

export const subjectLead = (occasion: OccasionId) =>
  occasion === 'hire' ? 'Private hire enquiry' : 'Booking enquiry'

export const SIGN_OFF = '(Sent from the booking form on the Grosvenor Arms website)'
