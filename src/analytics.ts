// FICTIONAL EXAMPLE — Rand Industries Inc. is not a real company.
// Extended for Lex-Orchestra ADR-062 live test:
// Tests Gemma4 fallback for analytics/CRM packages NOT in signal_map.py

import Analytics from '@segment/analytics-node'   // analytics — NOT in signal_map → Gemma4 fallback
import * as braintree from 'braintree'             // payment (alt) — None in signal_map → Gemma4 fallback
import { Resend } from 'resend'                    // email — IS in signal_map, should fast-path
import dotenv from 'dotenv'

dotenv.config()

// Segment analytics — tracks hiring funnel events (PII risk: user_id, email)
const analytics = new Analytics({ writeKey: process.env.SEGMENT_WRITE_KEY ?? '' })

// Braintree — alternative payment processor for premium job listings
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID ?? '',
  publicKey: process.env.BRAINTREE_PUBLIC_KEY ?? '',
  privateKey: process.env.BRAINTREE_PRIVATE_KEY ?? '',
})

// Resend — transactional email (rejection/offer letters)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function trackHiringEvent(
  candidateId: string,
  event: 'application_submitted' | 'interview_scheduled' | 'offer_sent' | 'rejected'
): Promise<void> {
  analytics.track({
    userId: candidateId,
    event,
    properties: { timestamp: new Date().toISOString() },
  })
}

export async function sendDecisionEmail(
  to: string,
  decision: 'offer' | 'rejection',
  candidateName: string
): Promise<void> {
  await resend.emails.send({
    from: 'hr@rand-industries.example.com',
    to,
    subject: decision === 'offer' ? 'Offer Letter — Rand Industries' : 'Application Update',
    text: `Dear ${candidateName}, ...`,
  })
}
