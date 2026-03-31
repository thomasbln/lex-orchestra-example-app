# Lex-Orchestra Example App

> A fictional SaaS starter — used as the default scan target for [Lex-Orchestra](https://github.com/thomasbln/Lex-Orchestra) demos.

This repository simulates a realistic early-stage SaaS application using common third-party services. It is intentionally structured to trigger a meaningful Lex-Orchestra compliance scan.

**Expected scan output:**
- Sub-processors detected: Stripe, OpenAI, Supabase, Postmark, Sentry
- Documents generated: AVV/DPA, TOM, AI Act Manifest, VVT, KI_Policy
- Risk classification: GPAI

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| API | Express |
| Database | PostgreSQL via Supabase |
| Payments | Stripe |
| AI | OpenAI GPT-4o |
| Email | Postmark |
| Monitoring | Sentry |
| Infrastructure | Docker + Docker Compose |

## Quick Start

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

## Project Structure

```
src/
  index.ts        # Express app entrypoint
  ai.ts           # OpenAI integration
  payments.ts     # Stripe integration
  email.ts        # Postmark integration
docker-compose.yml
package.json
.env.example
```

---

## ⚠️ Example data only

This is a fictional example project. All names, addresses, company data, and credentials are fabricated.
No real personal data is contained in this repository.

The HTML pages in `src/app/` display a visible disclaimer banner to make this clear to any visitor.

*Not legal advice. Not a real company. For demonstration purposes only.*
