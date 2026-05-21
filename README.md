<h1 align="center">BillVeil</h1>

<p align="center">
  <strong>See through every medical bill. Fight back. Get your money.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Groq_%2B_Llama_3.3--70b-f54242?style=flat-square" />
  <img src="https://img.shields.io/badge/Stack-Next.js_14-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/Tools-30%2B_AI_Powered-8b5cf6?style=flat-square" />
  <img src="https://img.shields.io/badge/Price-Free._No_Signup.-34d399?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Under_Active_Development-orange?style=flat-square" />
</p>

---

## The Problem

Medical bills are the **#1 cause of personal bankruptcy in the United States.**

- 100 million Americans carry medical debt
- 41% of US adults have debt from medical or dental bills
- The average hospital charges **3–10x the Medicare allowable rate** for the same procedure
- 80% of medical bills contain errors — most go unchallenged because patients don't know the rules
- Insurance denials are reversed **40–60% of the time** when appealed — most people never appeal

The system is designed to be confusing. Hospitals publish "chargemaster" prices that nobody actually pays. Insurance companies issue denials hoping patients give up. Billing departments speak in CPT codes and medical jargon that most people have never heard.

BillVeil is the advocate that most people can't afford to hire.

---

## What BillVeil Does

Drop in your medical bill, a charge code, a denial letter, or just describe your situation. BillVeil uses AI — trained specifically on medical billing law, Medicare rates, the No Surprises Act, ERISA, HIPAA, and hospital negotiation tactics — to tell you:

- What you were actually charged (in plain English)
- What the fair price is (Medicare allowable rate as benchmark)
- Whether you were overcharged
- Exactly what to say to get it reduced
- Which laws protect you and how to use them

**Free. No account required. Available right now.**

---

## 30+ AI-Powered Tools

### Fight Your Bill
| Tool | What It Does |
|------|-------------|
| **Bill Scan** | Upload any bill (PDF/image) — AI extracts every line item and flags overcharges |
| **Dispute Letter** | Generates a legally-grounded dispute letter using Medicare rates and No Surprises Act |
| **Denial Fighter** | Analyzes insurance denial reasons and generates a point-by-point appeal |
| **Negotiation Script** | Word-for-word phone script to negotiate with the billing department |
| **Surprise Billing Checker** | Checks if your bill violates the No Surprises Act (2022) |
| **Debt Rights Checker** | Explains your rights under FDCPA and state medical debt laws |
| **Itemization Request** | Generates a formal itemized bill request (legally required within 30 days) |
| **Charity Care Finder** | Checks if the hospital is required to offer financial assistance |
| **Payment Plan Negotiator** | Script for getting 0% interest payment plans (most hospitals offer, few advertise) |
| **HIPAA Rights Guide** | Explains what you can request and what providers must disclose |
| **Patient Rights Guide** | State-by-state breakdown of patient billing protections |
| **Mental Health Parity Checker** | Checks if mental health coverage is being applied unfairly vs. physical health |

### Understand Your Coverage
| Tool | What It Does |
|------|-------------|
| **EOB Explainer** | Decodes Explanation of Benefits documents in plain English |
| **Prior Auth Helper** | Guides you through the prior authorization process |
| **Insurance Plan Decoder** | Compares deductible, out-of-pocket max, copay, coinsurance in real terms |
| **Provider Network Checker** | Checks if a provider is in-network before your appointment |
| **HSA/FSA Optimizer** | Maximizes your tax-advantaged health accounts |
| **Second Opinion Finder** | Helps find in-network providers for second opinions |
| **Preventive Care Checker** | What screenings your plan must cover at $0 cost |

### Find Savings
| Tool | What It Does |
|------|-------------|
| **Drug Price Comparator** | Compares prices across pharmacies (GoodRx, Cost Plus Drugs, etc.) |
| **Generic Drug Finder** | Finds FDA-approved generic equivalents |
| **Pre-Treatment Cost Estimator** | Estimates your out-of-pocket before a procedure |
| **Hospital Price Lookup** | Uses CMS price transparency data (hospitals required to publish) |

### Track & Manage
| Tool | What It Does |
|------|-------------|
| **Case Tracker** | Track disputes, appeals, and negotiations across multiple bills |
| **Savings Dashboard** | Running total of money saved through BillVeil tools |
| **Medical Tax Calculator** | Calculates deductible medical expenses for tax filing |
| **FSA Tracker** | Tracks FSA balance and deadlines (use-it-or-lose-it) |
| **Medicare Navigator** | Helps Medicare beneficiaries understand their coverage |
| **Veterans Benefits** | VA healthcare benefits and billing rights guide |
| **BillVeil Concierge** | AI assistant for any medical billing question, free-form |

---

## How the AI Works

The core AI is not a generic chatbot. It's prompted as a **medical billing legal advocate** with specific expertise:

```
System role: "You are BillVeil, an expert medical billing advocate with deep knowledge of
CPT codes, Medicare allowable rates, hospital chargemasters, the No Surprises Act (2022),
balance billing protections, and ERISA appeal rights. You give direct, specific, actionable
advice that saves Americans real money. Always reference Medicare rates as the fair price
benchmark. Be specific with dollar amounts."
```

Every analysis returns a structured response:
- **What Is This** — plain English, no jargon
- **Fair Price** — Medicare allowable rate as benchmark
- **Verdict** — FAIR PRICE / POSSIBLY OVERCHARGED / SIGNIFICANTLY OVERCHARGED
- **Why** — specific markup (e.g. "this is 8x the Medicare rate")
- **What To Do** — exact steps, including word-for-word scripts
- **Money You Could Save** — specific dollar estimate

### Bill Scan Pipeline

```
User uploads PDF or image
         │
         ▼
  PDF.js renders to canvas
  (entirely in browser — file never uploaded to any server)
         │
         ▼
  Canvas → JPEG (auto-scaled to stay under Groq's 33M pixel cap)
         │
         ▼
  Groq Vision API (Llama 4 Scout — multimodal)
  Extracts: line items, CPT codes, amounts, provider, dates
         │
         ▼
  Groq (Llama 3.3-70b) analysis pass
  Compares against Medicare rates, flags anomalies
         │
         ▼
  Structured breakdown returned to user
```

**Why client-side rendering?** Your medical bill contains your diagnosis, procedures, insurance ID, and sometimes Social Security details. Rendering in the browser means the raw file never leaves your device. Only the extracted text hits the AI API.

**Why Groq?** Inference speed is 10–50x faster than OpenAI for equivalent models. For a tool where people are stressed about a bill, response time matters.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 |
| AI (Vision) | Groq API — Llama 4 Scout (multimodal) |
| AI (Reasoning) | Groq — Llama 3.3-70b-versatile |
| PDF Rendering | PDF.js (client-side, privacy-first) |
| Auth | Firebase Authentication |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

---

## What's Coming

- [ ] Bill photo upload via phone camera (no PDF needed)
- [ ] Direct dispute letter submission via certified mail API
- [ ] Insurance denial database (track which insurers deny most often, by procedure)
- [ ] Real-time hospital price lookup using CMS transparency data
- [ ] Medicare/Medicaid eligibility screener
- [ ] Spanish language support (40M Spanish speakers in the US)
- [ ] Integration with state insurance commissioner complaint portals

---

## Run Locally

```bash
git clone https://github.com/Asil143/billveil.git
cd billveil
npm install
```

Create `.env.local`:
```
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

```bash
npm run dev
# Open http://localhost:3000
```

---

## Why This Matters

The United States spends $4.5 trillion on healthcare annually — more per capita than any country on earth — yet 100 million Americans carry medical debt. The gap isn't medical access. It's that the billing system is intentionally opaque.

Patients who receive a $15,000 ER bill don't know:
- That the Medicare rate for the same services is $2,800
- That they can legally request an itemized bill in 30 days
- That 80% of bills have errors
- That "financial hardship" applications exist at most hospitals and are rarely advertised
- That the No Surprises Act (2022) makes many of these charges illegal

BillVeil exists to close that knowledge gap. One tool, free, for everyone.

---

## License

MIT
