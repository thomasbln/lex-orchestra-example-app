// FICTIONAL EXAMPLE — Rand Industries Inc. is not a real company.
// This file is intentionally structured to trigger Lex-Orchestra compliance scanning.
// EU AI Act signal: system_prompt + hr_recruitment → HIGH RISK Annex III Nr. 4

import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ADR-029 scan target: system prompt visible in source for compliance classification
const SYSTEM_PROMPT = `You are an AI-powered HR screening assistant for Rand Industries Inc.
Your role is to evaluate job applicants based on their CV, cover letter, and assessment scores.
Assess each candidate's suitability for open engineering and management positions.
Consider: technical skills, cultural fit, leadership potential, and years of experience.
Always end your evaluation with exactly one of: HIRE / CONSIDER / REJECT.`

export async function screenCandidate(candidateProfile: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: candidateProfile },
    ],
    temperature: 0.2,
  })
  return completion.choices[0].message.content ?? ''
}

export async function evaluateApplication(
  name: string,
  role: string,
  cvSummary: string
): Promise<{ recommendation: string; score: number; reasoning: string }> {
  const prompt = `Candidate: ${name}\nApplied for: ${role}\nCV Summary: ${cvSummary}`
  const result = await screenCandidate(prompt)
  const recommendation = result.match(/\b(HIRE|CONSIDER|REJECT)\b/)?.[0] ?? 'CONSIDER'
  const score = recommendation === 'HIRE' ? 0.9 : recommendation === 'CONSIDER' ? 0.6 : 0.2
  return { recommendation, score, reasoning: result }
}
