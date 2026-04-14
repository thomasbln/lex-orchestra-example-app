// FICTIONAL EXAMPLE — Rand Industries Inc. is not a real company.
// Extended for Lex-Orchestra ADR-062 live test:
// Tests Gemma4 fallback detection for packages NOT in signal_map.py

import { MongoClient } from 'mongodb'           // nosql_db — NOT in signal_map → Gemma4 fallback
import { createClient } from 'redis'             // cache_db — NOT in signal_map → Gemma4 fallback
import { Client } from '@elastic/elasticsearch'  // search_db — NOT in signal_map → Gemma4 fallback
import dotenv from 'dotenv'

dotenv.config()

// MongoDB — candidate profiles (PII: name, email, cv_text)
const mongo = new MongoClient(process.env.MONGODB_URI ?? 'mongodb://localhost:27017')
export const candidatesDb = mongo.db('rand_industries').collection('candidates')

// Redis — session cache + rate limiting
export const cache = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' })

// Elasticsearch — CV full-text search index
export const search = new Client({ node: process.env.ES_URL ?? 'http://localhost:9200' })

export async function storeCandidateProfile(
  candidateId: string,
  profile: { name: string; email: string; cvText: string }
): Promise<void> {
  // PII stored in MongoDB — triggers DSGVO Art. 25 signal
  await candidatesDb.insertOne({ _id: candidateId, ...profile, createdAt: new Date() })

  // Index in Elasticsearch for semantic search
  await search.index({
    index: 'candidates',
    id: candidateId,
    document: { cvText: profile.cvText },  // PII-reduced: no name/email in index
  })

  // Cache session
  await cache.set(`candidate:${candidateId}`, JSON.stringify({ name: profile.name }), { EX: 3600 })
}
