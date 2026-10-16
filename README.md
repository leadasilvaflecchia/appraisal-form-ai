# Appraisal Form AI

AI-powered real estate appraisal workflow application built with Next.js, Tailwind CSS, and Lucide icons. Replicates a Uniform Residential Appraisal Report (UAD / Fannie Mae Form 1004) across 4 guided steps with intelligent document extraction.

## Features

- **Form 1 (Page 1)** — Editable property and client details (address, county, APN, appraiser info, intended use/user).
- **Form 2 (Page 2)** — Editable sales comparison approach, cost approach, and reconciliation with final opinion of value.
- **Upload Property Document** — Drag-and-drop PDF/text intake with a 5-step animated AI extraction workflow.
- **Auto-Filled Form** — Review all extracted fields with "AI Extracted" badges, full editability, Save (LocalStorage), and Export (PDF/JSON).
- Modern SaaS UI with white/slate blue tones, responsive grid layout, top navigation, and smooth tab transitions.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuración de API Key para Extracción Real con IA

The app works out-of-the-box with pre-programmed demo data for "9 FRIENDS LN, WESTBURY, NY 11590". To enable **real AI extraction** with OpenAI:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder with your actual OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-real-api-key-here
   ```

3. Restart the dev server (`npm run dev`).

That's it — the `/api/extract` endpoint will now call **gpt-4o-mini** with your document text and return structured JSON mapped to all 26 appraisal form fields.

### How it works

- When `OPENAI_API_KEY` **is present**: the backend sends the document text to OpenAI's Chat Completions API with `response_format: { type: "json_object" }` and a strict system prompt that maps the response to the exact form fields (`propertyAddress`, `city`, `state`, `zipCode`, `county`, `legalDescription`, `apn`, `clientName`, `clientAddress`, `appraiserName`, `licenseNumber`, `effectiveDate`, `contractPrice`, `yearBuilt`, `grossLivingArea`, `bedrooms`, `bathrooms`, `finalOpinionValue`, etc.).
- When `OPENAI_API_KEY` **is NOT present** or the API call fails (quota, network, etc.): the endpoint logs an informational message to the console and safely returns the pre-programmed demo data for "9 FRIENDS LN, WESTBURY, NY 11590" so the visual demo continues to work at 100%.

The extraction summary card in the UI displays a badge indicating whether the data came from **OpenAI gpt-4o-mini** or **Demo Fallback**.

## Tech Stack

- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Lucide React (icons)
- Sonner (toast notifications)
- OpenAI gpt-4o-mini (optional AI extraction)

## Build

```bash
npm run build
```
