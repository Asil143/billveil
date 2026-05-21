<h1 align="center">
  <br>
  🔍 BillVeil
  <br>
</h1>

<h3 align="center">Drop a bill. Get a full AI breakdown in seconds.</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Groq-Llama_4_Scout-f54242?style=flat-square" />
  <img src="https://img.shields.io/badge/Anthropic-Claude-d97706?style=flat-square" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/Vision-PDF_%2F_Image-8b5cf6?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square" />
</p>

<p align="center">
  Medical bills, utility invoices, restaurant receipts — AI reads them so you don't have to.
  Upload any bill, get a structured breakdown, spot hidden charges instantly.
</p>

---

## What is BillVeil?

BillVeil is an AI-powered bill analyzer. You upload a bill (PDF or image), and it uses computer vision + large language models to:

- Extract every line item with amounts
- Identify overcharges, duplicates, and hidden fees
- Explain charges in plain English
- Flag anything that looks wrong

No more squinting at medical bills or mystery utility charges.

---

## How It Works

```
User uploads PDF/Image
        │
        ▼
  PDF.js renders to canvas
  (client-side, no server upload)
        │
        ▼
  Canvas → JPEG conversion
  (auto-scaled to stay under 33M pixel limit)
        │
        ▼
  Groq Vision API
  (Llama 4 Scout — multimodal, ultra-fast)
        │
        ▼
  Structured extraction
  (line items, totals, dates, provider)
        │
        ▼
  Groq / Claude analysis
  (Llama 3.3-70b or Claude for reasoning)
        │
        ▼
  Clean, readable breakdown
```

The entire PDF rendering pipeline runs **in the browser** — your bill never hits a third-party storage server.

---

## Features

### 📄 Universal Bill Support
- PDF documents (multi-page)
- Images (PNG, JPG, HEIC)
- Handles poor scans and low-contrast documents

### 🧠 Dual AI Pipeline
- **Groq Llama 4 Scout** — multimodal vision model for fast extraction
- **Groq Llama 3.3-70b / Claude** — reasoning model for anomaly detection and explanation

### 🔎 What It Extracts
- Provider name, date, account number
- Every line item and its cost
- Subtotal, taxes, fees, total due
- Due date and payment methods

### ⚠️ Anomaly Detection
- Duplicate charges
- Items billed but not received
- Unusual fee labels
- Totals that don't add up

### 🔒 Privacy-First
- PDF rendering happens client-side in the browser
- No bill data stored after session ends
- Firebase for auth only — not bill storage

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 |
| AI Vision | Groq API (Llama 4 Scout — multimodal) |
| AI Reasoning | Groq (Llama 3.3-70b) + Anthropic Claude |
| PDF Rendering | PDF.js (client-side canvas rendering) |
| Auth | Firebase Authentication |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

---

## Project Structure

```
billveil/
├── app/
│   ├── page.js             ← Landing + upload interface
│   ├── api/
│   │   ├── analyze/        ← Main AI analysis endpoint
│   │   └── extract/        ← Bill extraction pipeline
│   └── about/              ← How it works
├── src/
│   └── components/         ← Upload UI, results display
├── public/                 ← Static assets
└── server.js               ← Express server (for Procfile/Railway)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- [Groq API key](https://console.groq.com) (free tier available)
- [Anthropic API key](https://console.anthropic.com) (optional — Groq fallback works)
- Firebase project (for auth)

### Setup

```bash
git clone https://github.com/Asil143/billveil.git
cd billveil
npm install
```

Create `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and upload any bill.

---

## Key Engineering Decisions

**Why client-side PDF rendering?**
PDFs can contain sensitive financial data. Rendering in the browser via PDF.js means the raw file never leaves the user's machine — only the extracted JPEG gets sent to the AI API.

**Why Groq over OpenAI vision?**
Groq's inference speed is 10–50x faster than OpenAI for equivalent models. For a bill analyzer where users expect near-instant results, this matters a lot.

**Why dual models?**
Scout handles the visual extraction (reading the actual pixels). A text-optimized model then does the reasoning pass — flagging anomalies and generating the explanation. This separation makes the pipeline more accurate than a single model doing both.

---

## License

MIT

---

<p align="center">
  Drop any bill. Understand it instantly.
</p>
