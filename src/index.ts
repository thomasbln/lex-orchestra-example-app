import express from 'express'
import Stripe from 'stripe'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/node'
import * as postmark from 'postmark'
import dotenv from 'dotenv'

dotenv.config()

// Sentry monitoring
Sentry.init({ dsn: process.env.SENTRY_DSN })

// Stripe payments
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Postmark email
const emailClient = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN!)

const app = express()
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Create payment intent
app.post('/api/payments/intent', async (req, res) => {
  const { amount, currency = 'eur' } = req.body
  const intent = await stripe.paymentIntents.create({ amount, currency })
  res.json({ clientSecret: intent.client_secret })
})

// AI chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: message }],
  })
  res.json({ reply: completion.choices[0].message.content })
})

// Save user data
app.post('/api/users', async (req, res) => {
  const { email, name } = req.body
  const { data, error } = await supabase
    .from('users')
    .insert({ email, name })
    .select()
  if (error) return res.status(400).json({ error })
  res.json({ user: data[0] })
})

// Send welcome email
app.post('/api/email/welcome', async (req, res) => {
  const { to, name } = req.body
  await emailClient.sendEmail({
    From: process.env.FROM_EMAIL!,
    To: to,
    Subject: 'Welcome!',
    TextBody: `Hi ${name}, welcome to the app.`,
  })
  res.json({ sent: true })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
