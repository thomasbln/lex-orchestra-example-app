// FICTIONAL EXAMPLE — Rand Industries Inc. is not a real company.
// Scanner test targets:
//   - pymongo → NOT in signal_map → triggers Gemma4 fallback (nosql_db)
//   - ioredis  → NOT in signal_map → triggers Gemma4 fallback (cache_db)
//   - @neondatabase/serverless → NOT in signal_map → triggers Gemma4 fallback (database)

import { createClient } from '@supabase/supabase-js'

// Candidate data storage — personal data signal
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function storeCandidateResult(
  candidateId: string,
  recommendation: string,
  score: number
) {
  const { error } = await supabase
    .from('candidate_results')
    .insert({ candidate_id: candidateId, recommendation, score })
  if (error) throw error
}

export async function getCandidateHistory(email: string) {
  const { data } = await supabase
    .from('candidate_results')
    .select('*')
    .eq('email', email)
  return data
}
