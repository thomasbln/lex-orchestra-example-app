// FICTIONAL EXAMPLE — Rand Industries Inc. is not a real company.
// EU AI Act signal: decision_logic (score threshold → hire/reject) + personal_data

import { evaluateApplication } from './ai'

interface Candidate {
  id: string
  name: string
  email: string
  appliedRole: string
  cvSummary: string
}

export async function processApplication(candidate: Candidate) {
  const { recommendation, score, reasoning } = await evaluateApplication(
    candidate.name,
    candidate.appliedRole,
    candidate.cvSummary
  )

  // EU AI Act signal: automated decision logic based on score threshold
  if (score > 0.8) {
    hire(candidate)
  } else if (score > 0.5) {
    shortlist(candidate)
  } else {
    reject(candidate)
  }

  return {
    candidateId: candidate.id,
    recommendation,
    score,
    reasoning,
    decidedAt: new Date().toISOString(),
  }
}

function hire(candidate: Candidate): void {
  console.log(`[hiring] HIRE — candidate ${candidate.id}`)
}

function shortlist(candidate: Candidate): void {
  console.log(`[hiring] CONSIDER — shortlisted: ${candidate.id}`)
}

function reject(candidate: Candidate): void {
  console.log(`[hiring] REJECT — candidate ${candidate.id}`)
}

// Fictional candidates (Marvel-adjacent, no real PII)
export const EXAMPLE_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    name: 'Jessica Jones',
    email: 'jessica.jones@example.com',
    appliedRole: 'Senior Security Engineer',
    cvSummary: '8 years security consulting, penetration testing, incident response.',
  },
  {
    id: 'cand-002',
    name: 'Luke Cage',
    email: 'luke.cage@example.com',
    appliedRole: 'Engineering Manager',
    cvSummary: '10 years software engineering, 3 years team lead, distributed systems.',
  },
  {
    id: 'cand-003',
    name: 'Danny Rand',
    email: 'danny.rand@example.com',
    appliedRole: 'Junior Frontend Developer',
    cvSummary: '1 year experience, React, TypeScript, no production projects yet.',
  },
]
