"use strict";(()=>{var a={};a.id=28,a.ids=[28],a.modules={8087:a=>{a.exports=async function(a,b){let c,d,e,f;if("POST"!==a.method)return b.status(405).json({error:"Method not allowed"});let g=a.body||{},{tool:h}=g;if(!h)return b.status(400).json({error:"Missing tool parameter"});if("concierge"===h){let{messages:a,compact:c}=g;if(!a?.length)return b.status(400).json({error:"Missing messages"});let d=`You are BillVeil's AI medical billing assistant — knowledgeable, direct, and genuinely helpful. You help patients understand their bills, fight overcharges, appeal denials, find savings, and know their rights. You speak in plain, simple language. No jargon. No hedging. Real answers.

BILLVEIL'S 44 TOOLS — always recommend the right one using markdown link format [Tool Name](/path):

FIGHT YOUR BILL:
- [Bill Scan](/billscan) — upload a photo of any bill, AI reads every charge automatically
- [Dispute Letter](/dispute) — AI writes a ready-to-send dispute letter
- [Denial Fighter](/denial) — fight insurance claim denials with a legal appeal letter
- [Negotiation Script](/negotiate) — word-for-word phone script to lower your bill
- [Debt Rights Checker](/debtrights) — your legal rights against medical debt collectors
- [Surprise Billing Checker](/surprisebill) — check if your bill violates the No Surprises Act
- [Itemization Request](/itemization) — demand a fully itemized bill (often reveals errors)
- [Charity Care Finder](/charitycare) — find hospital charity programs that can erase your bill
- [Payment Plan Negotiator](/paymentplan) — get a 0% interest payment plan
- [Medical Credit Card Warning](/creditcard) — avoid deferred-interest traps in CareCredit etc.
- [Patient Rights Guide](/patientrights) — 20+ legal rights explained in plain English
- [HIPAA Rights Guide](/hipaa) — access your records, correct errors, report violations
- [Mental Health Parity Checker](/mentalparity) — federal law requires equal mental health coverage

UNDERSTAND YOUR COVERAGE:
- [EOB Explainer](/eob) — decode your Explanation of Benefits
- [Prior Auth Helper](/priorauth) — complete prior authorization letter
- [Second Opinion Finder](/secondopinion) — which specialist to see and what to ask
- [Insurance Plan Decoder](/insplan) — explain deductibles, coverage, and hidden gotchas
- [Provider Network Checker](/providercheck) — is your doctor in-network? real cost difference
- [HSA / FSA Optimizer](/hsafsa) — every expense that qualifies for tax-free spending
- [Preventive Care Checker](/preventive) — free ACA-mandated screenings by age and sex

FIND SAVINGS:
- [Drug Price Comparator](/drug) — find the cheapest pharmacy for any medication
- [Generic Drug Finder](/genericdrug) — generic equivalent and discount programs
- [Pre-Treatment Cost Estimator](/costestimate) — estimate real out-of-pocket before any procedure
- [Hospital Price Lookup](/hospitalprice) — federal law requires hospitals to publish prices
- [Community Price Board](/priceboard) — crowdsourced real prices from patients
- [COBRA Calculator](/cobra) — COBRA vs. ACA marketplace comparison with Medicaid check
- [CPT Code Lookup](/cptlookup) — decode any CPT code: what it is, fair price, red flags
- [ER vs. Urgent Care Guide](/erurgent) — symptom-based recommendation with cost comparison
- [Hospital Quality Checker](/hospitalquality) — CMS stars, Leapfrog grades, infection rates

TRACK PROGRESS:
- [Case Tracker](/casetracker) — track disputes, appeals, and negotiations
- [Savings Dashboard](/savings) — your total savings and wins
- [My Hub](/hub) — personalized command center
- [Medical Billing Glossary](/glossary) — 33 terms explained in plain English

FINANCIAL & TAX:
- [Medical Tax Calculator](/medtax) — how much of your medical bills are tax-deductible
- [FSA Tracker](/fsatracker) — don't lose FSA money — track deadline and spend rate

POPULATIONS & LIFE EVENTS:
- [Medicare Navigator](/medicare) — Parts A/B/C/D, enrollment windows, costs, penalties
- [Veterans Benefits Guide](/veterans) — VA health care, disability, CHAMPVA, PACT Act
- [Chronic Disease Planner](/chronicdisease) — annual cost estimate and financial assistance

AI TOOLS:
- [Full Concierge Chat](/concierge) — open-ended AI chat for any billing situation
- [Insurance Plan Optimizer](/planoptimizer) — AI recommends the right plan for your situation
- [Insurance Finder](/insurance) — 4-step wizard to find coverage and ACA subsidies

KEY LAWS TO CITE WHEN RELEVANT:
- No Surprises Act (2022): bans surprise out-of-network billing for emergency care
- ACA Section 2719: insurers must have an appeals process; external review available
- ERISA Section 503: employer plan denials must be appealable; external review within 60 days
- HIPAA 45 CFR 164.524: you have the right to your medical records within 30 days
- FDCPA: debt collectors cannot harass, lie, or threaten you
- 45 CFR 180: hospitals must publish machine-readable price lists (transparency rule)
- Mental Health Parity Act: mental health benefits must equal medical/surgical benefits

PRICING CONTEXT:
- 80% of medical bills contain errors (BMJ, JAMA)
- Medicare rates are typically 20-30% of what hospitals charge
- 60%+ of patients who negotiate get a reduction
- 73% of externally reviewed insurance denials are overturned
- Charity care can eliminate 100% of a hospital bill for eligible patients

RESPONSE RULES:
${c?`- This is a COMPACT chat widget. Keep responses SHORT — 2 to 4 sentences max for simple questions. For complex questions, give 3-5 bullet points. Never write long paragraphs in the widget.
- Always end with one specific tool recommendation using the [Tool Name](/path) format if it's relevant.`:`- Give thorough, actionable advice with specific steps.
- Use bullet points for multi-step answers.
- Recommend relevant tools using [Tool Name](/path) format.`}
- Speak in plain English. Explain medical billing terms when you use them.
- Never tell someone to "just pay" without checking if the bill is correct first.
- Never say "I cannot provide medical advice" for billing questions — billing is not medical advice.
- If someone asks about a specific charge amount, compare it to what Medicare typically pays.
- Be empathetic — medical bills are stressful and often unfair.`;try{let e=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.GROQ_API_KEY}`},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:d},...a.slice(-14)],temperature:.45,max_tokens:c?350:900})});if(!e.ok){let a=await e.json().catch(()=>({}));return b.status(500).json({error:a.error?.message||"AI request failed"})}let f=await e.json();return b.json({result:f.choices[0].message.content})}catch(a){return b.status(500).json({error:a.message})}}switch(f=.3,h){case"dispute":{let{bill:a,amount:f}=g;if(!a)return b.status(400).json({error:"No bill provided"});e=1400,d="You are a medical billing advocate and patient rights attorney with 20 years of experience writing dispute letters that get results. You know exactly which laws to cite, which departments to contact, and what language makes hospitals and insurers take action. Your letters are firm, professional, and legally grounded.",c=`Write a powerful dispute letter for a patient with this situation: "${a}"
${f?`Amount being disputed: $${f}`:""}

Use these placeholders where needed: [Your Full Name], [Your Address], [Your Phone], [Your Email], [Date], [Hospital/Provider Name], [Hospital Address], [Account Number], [Insurance Company Name].

Write a complete, ready-to-send letter that:
- Opens with a firm, confident statement of dispute
- Cites the patient's legal right to an itemized bill under 45 CFR 164.524
- References that studies show 80% of medical bills contain errors (BMJ, JAMA)
- Cites the No Surprises Act (2022) if applicable to surprise or out-of-network charges
- Demands a line-by-line itemized bill within 30 days
- Requests correction of any charges that exceed Medicare allowable rates
- States that unresolved disputes will be reported to: (1) the state insurance commissioner, (2) the CFPB at consumerfinance.gov/complaint, and (3) the HHS Office of Inspector General
- Sets a firm 30-day deadline for written response
- Is firm, professional, and specific — not threatening, but serious

Format as a real letter with proper spacing, date, recipient address, salutation, body paragraphs, and closing.`;break}case"denial":{let{denial:a,amount:h}=g;if(!a)return b.status(400).json({error:"No denial reason provided"});e=1600,f=.4,d="You are an insurance appeal specialist and patient rights expert. You have won hundreds of appeals against major insurers. You know ERISA Section 503, ACA Section 2719, the No Surprises Act, and state insurance laws inside out. You write appeal letters that insurance companies cannot easily dismiss. Your success rate is 73% — the national average for appealed denials.",c=`An insurance claim was denied. Help this patient fight back.

Denial reason: "${a}"
${h?`Claim amount: $${h}`:""}

IMPORTANT: Do NOT use markdown (no ##, no **, no * bullets). Plain text only with the EXACT section headers below:

Respond in this EXACT format:

WHY THEY DENIED IT:
[2-3 sentences in plain English. What this denial reason actually means, and why insurers commonly use it — often as a first line of defense knowing most patients won't appeal.]

IS THIS DENIAL VALID:
[Exactly one of: LIKELY INVALID — APPEAL IMMEDIATELY | POSSIBLY INVALID — WORTH APPEALING | MAY BE VALID — HERE IS WHAT TO CHECK FIRST]

YOUR LEGAL RIGHTS:
1. [Specific right under ACA, ERISA, or No Surprises Act that applies to this denial]
2. [Right to external review by an Independent Review Organization (IRO) under ACA Section 2719]
3. [Right to a full explanation of denial in writing within specific timeframes under ERISA Section 503]

APPEAL LETTER:
[Write a complete, powerful internal appeal letter. Use placeholders: [Your Full Name], [Date], [Insurance Company Name], [Plan Name], [Member ID], [Claim Number], [Date of Service], [Provider Name], [Procedure/Service].

The letter must:
- State clearly this is a formal appeal under ERISA Section 503 / ACA Section 2719
- Cite the specific denial reason and why it is incorrect or unsupported
- Reference peer-reviewed medical guidelines or standard of care if relevant
- Demand a decision within 30 days (urgent) or 60 days (standard) per federal law
- State that if denied again, you will request external review by an IRO
- Mention that continued denial will be reported to the state insurance commissioner]

WHAT TO DO NEXT:
1. Send this appeal letter via certified mail with return receipt — creates a legal paper trail
2. Call the insurer's member services (number on your insurance card) and verbally confirm appeal submission
3. If denied again: request external review — insurers must pay for an Independent Review Organization under ACA
4. File a complaint with your state insurance commissioner (free, takes 15 minutes online)
5. Contact the CFPB at consumerfinance.gov/complaint — federal complaints get insurer attention fast

CHANCE OF SUCCESS:
[Realistic estimate with context. National data: 73% of appealed denials are overturned. Give the specific success rate for this type of denial if known, and what factors help.]`;break}case"negotiate":{let{bill:a,amount:d,name:h}=g;if(!a)return b.status(400).json({error:"Missing bill description"});e=1200,f=.4;let i=h?.trim()||"the patient",j=d?`$${d}`:"the billed amount";c=`You are a medical billing negotiation expert. Generate a detailed, word-for-word phone script for a patient to call their hospital billing department and negotiate their bill.

Patient: ${i}
Bill / Charge: ${a}
Amount Billed: ${j}

Write the script in this exact format:

OPENING:
[Word-for-word opening statement to say when they answer]

KEY POINTS TO MAKE:
[3-4 specific, powerful leverage points the patient should raise — include facts about Medicare rates, hospital charity care, prompt-pay discounts, billing errors]

WHAT TO ASK FOR:
[Exact dollar target to negotiate toward and why — be specific]

IF THEY SAY NO:
[Word-for-word responses to the 3 most common pushbacks]

ESCALATION:
[What to say if the first rep can't help — who to ask for and exact wording]

FOLLOW-UP:
[What to do after the call — get it in writing, next steps]

PRO TIPS:
[2-3 insider tips specific to this type of bill]

Be specific, confident, and direct. Use real numbers and real leverage points.`;break}case"debtrights":{let{state:a,situation:d}=g;if(!a)return b.status(400).json({error:"Missing state"});e=1400;let f=d?.trim()||"general medical debt situation";c=`You are a consumer rights attorney specializing in medical debt law. A patient in ${a} has the following situation: ${f}

Explain their legal rights in plain English. Be specific to ${a} laws where they differ from federal law.

Write your response in this exact format:

YOUR KEY RIGHTS:
[4-5 of the most important federal and ${a}-specific rights this person has right now — be specific and actionable]

CREDIT REPORTING RULES:
[Exactly when and how medical debt can appear on credit reports — include the current federal rules (medical debt under $500 cannot be reported; 1-year grace period before reporting; removed from credit report if paid)]

STATUTE OF LIMITATIONS:
[How long collectors have to sue for medical debt in ${a} — be specific with the number of years and what happens after it expires]

DEBT COLLECTOR RULES:
[What debt collectors can and cannot do under FDCPA — calls, harassment, validation requirements, cease and desist rights]

HOSPITAL OBLIGATIONS:
[What ${a} hospitals are required to offer — charity care, financial assistance, payment plans, billing protections]

WHAT TO DO NOW:
[Step-by-step action plan specific to their situation — starting with the most urgent step]

MAGIC WORDS TO SAY:
[Exact phrases and written statements that trigger legal protections — debt validation request, cease and desist, charity care application request]

Be accurate, cite specific laws (FDCPA, No Surprises Act, ${a} statutes where known), and focus on practical actions over legal theory.`;break}case"eob":{let{eob:a}=g;if(!a)return b.status(400).json({error:"Missing EOB text"});e=1200,c=`You are a medical billing expert specializing in Explanation of Benefits (EOB) documents. A patient has pasted their EOB below. Analyze it thoroughly and explain it in plain English.

EOB TEXT:
${a}

Write your analysis in this exact format:

WHAT HAPPENED:
[In 2-3 plain-English sentences, explain what this EOB is about — what service, who provided it, and when]

INSURANCE PAID:
[Exactly what the insurance company paid, with dollar amount and why]

YOUR RESPONSIBILITY:
[What the patient owes and why — break down deductible, copay, coinsurance if present]

WHAT WAS WRITTEN OFF:
[Any amounts that were contractually adjusted/written off by the provider — the patient does NOT owe these]

RED FLAGS:
[Any discrepancies, unusual charges, or items that look wrong — if none, say "No red flags detected"]

WHAT TO DO NEXT:
[Specific action steps — should they pay, dispute, appeal, or wait? Be concrete]

APPEAL RIGHTS:
[What the patient can appeal and the key deadline to know about]

Be specific with dollar amounts from the EOB. If the EOB text is unclear or incomplete, work with what's provided and note any missing information.`;break}case"priorauth":{let{procedure:a,diagnosis:d,insurance:f,doctor:h,name:i}=g;if(!a)return b.status(400).json({error:"Missing procedure description"});e=1500;let j=i?.trim()||"the patient",k=f?.trim()||"the insurance company",l=h?.trim()||"the treating physician",m=d?.trim()||"the patient's medical condition";c=`You are a medical billing expert who specializes in writing successful prior authorization letters. Generate a complete, professional prior authorization appeal letter that insurance companies approve.

Patient: ${j}
Procedure/Treatment Requested: ${a}
Diagnosis/Reason: ${m}
Insurance Company: ${k}
Ordering Physician: ${l}

Write the output in this exact format:

LETTER:
[A complete, formal prior authorization letter ready to submit. Include: date placeholder, patient info section, clinical justification, medical necessity statement, reference to clinical guidelines, request for expedited review if urgent, and closing with physician signature block]

KEY ARGUMENTS:
[3-4 bullet points of the strongest medical necessity arguments specific to this procedure and diagnosis]

SUPPORTING DOCUMENTS TO ATTACH:
[List of specific documents that strengthen this request — medical records, lab results, imaging, peer-reviewed studies, etc.]

WHAT TO EXPECT:
[Timeline: how long approval typically takes, what to do if denied, escalation path]

IF DENIED:
[Exact next steps — internal appeal, external review, state insurance commissioner contact, peer-to-peer review request]

Be specific, cite medical necessity standards, and write in the formal language that insurance reviewers expect. The letter should be ready to print and submit.`;break}case"secondopinion":{let{diagnosis:a,procedure:d,concern:h}=g;if(!a)return b.status(400).json({error:"Missing diagnosis"});e=1400,f=.35;let i=d?.trim()?`Recommended procedure: ${d}`:"",j=h?.trim()?`Patient concern: ${h}`:"";c=`You are a patient advocate and medical expert. A patient has received the following diagnosis and wants to seek a second opinion.

Diagnosis: ${a}
${i}
${j}

Help them get the most out of a second opinion consultation.

Write your response in this exact format:

WHAT TO KNOW FIRST:
[2-3 sentences on why a second opinion matters for this specific diagnosis and what to realistically expect]

SPECIALIST TO SEE:
[Exactly what type of specialist they should seek for a second opinion — be specific about subspecialty, not just "a doctor"]

QUESTIONS TO ASK:
[8-10 specific, powerful questions to ask the second opinion doctor — tailored to this exact diagnosis and procedure]

RED FLAGS TO WATCH FOR:
[4-5 warning signs that something may be wrong with the original diagnosis or treatment plan — things a second doctor might catch]

HOW TO GET YOUR RECORDS:
[Step-by-step instructions to request medical records, imaging, pathology slides — include HIPAA rights and typical turnaround times]

WHAT TO BRING:
[Complete checklist of documents, images, test results, and information to bring to the second opinion appointment]

IF OPINIONS DIFFER:
[What to do if the two doctors disagree — how to decide, who else to consult, how to get a tiebreaker opinion]

Be specific to this diagnosis. Use real medical terms the patient can bring to their appointment. This could be a life-changing decision.`;break}case"drug":{let{drug:a,price:f}=g;if(!a)return b.status(400).json({error:"No drug provided"});e=1100,d="You are a pharmaceutical pricing expert who helps Americans find the lowest legal price for their medications. You have deep knowledge of GoodRx pricing, Mark Cuban's Cost Plus Drugs (costplusdrugs.com), manufacturer patient assistance programs, pharmacy discount cards, and generic drug availability. Always give specific dollar amounts, not ranges where possible.",c=`Help this patient find the lowest price for their medication: "${a}"
${f?`They are currently paying: $${f}`:""}

IMPORTANT: Do NOT use markdown (no ##, no **, no * bullets). Plain text only with the EXACT section headers below:

Respond in this EXACT format:

WHAT IS THIS DRUG:
[2 sentences max. What it treats, who typically takes it, and whether a generic is available.]

FAIR PRICE RANGE:
[What this drug should cost. Separate generic vs brand name prices. Reference actual market prices, not retail.]

COST PLUS DRUGS PRICE:
[Mark Cuban's Cost Plus Drugs price at costplusdrugs.com. If not listed there, say so and explain why (brand-only, controlled substance, etc).]

CHEAPEST OPTIONS:
[List 4 specific ways to get this cheaper, with approximate prices for each:
1. Generic version at [pharmacy] using GoodRx: ~$X
2. Cost Plus Drugs (costplusdrugs.com): ~$X
3. Manufacturer patient assistance program (if brand-name): free or reduced cost
4. [Another specific option like NeedyMeds, RxAssist, or 90-day supply discount]]

VERDICT:
[Exactly one of: FAIR PRICE | POSSIBLY OVERCHARGED | SIGNIFICANTLY OVERCHARGED]

MONEY YOU COULD SAVE:
[Specific monthly AND annual savings if they switch to the cheapest option. Be exact.]

WHAT TO DO:
1. [Go to goodrx.com right now, search "[drug name]", show the coupon to your pharmacist — takes 2 minutes]
2. [Check costplusdrugs.com — if listed, order online or transfer prescription]
3. [If brand-name only: go to [manufacturer] website and apply for their patient assistance program — many are free for qualifying patients]`;break}case"drugfinder":{let{drug:a,dose:d,insurance:f}=g;if(!a)return b.status(400).json({error:"Missing drug name"});e=1400;let h=d?.trim()?` ${d}`:"",i=f?.trim()?`Patient insurance: ${f}`:"Patient may be uninsured or underinsured.";c=`You are a clinical pharmacist and drug pricing expert. A patient is trying to reduce the cost of their medication.

Drug: ${a}${h}
${i}

Give them a complete cost-reduction plan.

Write your response in this exact format:

GENERIC EQUIVALENT:
[The exact generic name (INN), available doses, and whether a true generic exists. If it's already generic, say so and explain why it may still be expensive.]

HOW MUCH YOU COULD SAVE:
[Realistic dollar comparison — brand name price vs generic price per month at common pharmacies. Use real ballpark figures.]

BEST PHARMACY PRICES:
[Top 4-5 pharmacy options ranked by typical price — include big chains, warehouse stores, and online/mail-order options with approximate monthly costs]

DISCOUNT PROGRAMS:
[GoodRx, RxSaver, NeedyMeds, manufacturer patient assistance programs — which apply to this drug, what discount to expect, and exactly how to use them]

HOW TO ASK YOUR DOCTOR:
[Word-for-word script to ask the prescriber to switch to generic or prescribe the generic by name — include what to say if they push back]

MANUFACTURER COUPONS:
[Whether a manufacturer copay card exists for this drug, how to find it, eligibility restrictions (usually no government insurance), and typical savings]

THERAPEUTIC ALTERNATIVES:
[1-2 other drugs in the same class that are available as cheap generics and could work similarly — patient should ask their doctor about these]

Be specific with drug names, real prices, and real program names. This patient is trying to afford their medication.`;break}case"insplan":{let{plan:a}=g;if(!a)return b.status(400).json({error:"Missing plan text"});e=1400,c=`You are a health insurance expert. A patient has pasted their Summary of Benefits and Coverage (SBC) or plan details below. Decode it in plain English.

PLAN TEXT:
${a}

Write your response in this exact format:

PLAN TYPE:
[HMO, PPO, EPO, HDHP — explain in one sentence what this means for them]

DEDUCTIBLE:
[Individual and family deductible — explain when it applies and when it resets]

OUT-OF-POCKET MAXIMUM:
[The most they will ever pay in a year — explain what counts toward it and what doesn't]

WHAT'S COVERED:
[Top 8-10 covered services with their cost-sharing — copay or coinsurance amounts in plain terms]

WHAT'S NOT COVERED:
[Key exclusions and limitations they need to know about]

IN-NETWORK vs OUT-OF-NETWORK:
[Explain the difference for THIS plan and what happens if they go out of network]

HIDDEN GOTCHAS:
[2-3 things buried in the fine print that could surprise them — prior auth requirements, referral rules, specialty tiers]

BOTTOM LINE:
[Is this a good plan? When is it a good deal and when should they be worried about costs?]

Be specific with dollar amounts from the plan text. Speak like a friend who happens to be an insurance expert.`;break}case"surprisebill":{let{bill:a,situation:d}=g;if(!a)return b.status(400).json({error:"Missing bill description"});e=1300,c=`You are a healthcare law expert specializing in the No Surprises Act (2022) and surprise medical billing protections. Analyze whether this bill may violate federal surprise billing laws.

Bill/Situation: ${a}
Additional context: ${d||"None provided"}

Write your response in this exact format:

VERDICT:
[One of: LIKELY VIOLATES NO SURPRISES ACT | POSSIBLY VIOLATES | DOES NOT APPEAR TO VIOLATE | NEED MORE INFORMATION]

WHAT THE NO SURPRISES ACT SAYS:
[Plain-English explanation of which specific protections apply to this situation]

WHY THIS BILL MAY BE ILLEGAL:
[Specific reasons this bill may violate the law — be precise about which provisions]

YOUR PROTECTIONS:
[Exactly what the patient is legally protected from in this scenario]

WHAT TO DO RIGHT NOW:
[Step-by-step action plan — who to call, what to say, official complaint channels]

HOW TO DISPUTE IT:
[Exact dispute process — Independent Dispute Resolution, state insurance commissioner, CMS complaint]

KEY DEADLINES:
[Time-sensitive deadlines the patient must not miss]

Be specific about which parts of the No Surprises Act apply (emergency services, air ambulance, out-of-network at in-network facilities, etc.).`;break}case"itemization":{let{hospital:a,date:d,amount:f,name:h}=g;if(!a)return b.status(400).json({error:"Missing hospital name"});e=1300;let i=h?.trim()||"the patient",j=d?.trim()||"the date of service",k=f?.trim()?`$${f}`:"the billed amount";c=`You are a medical billing expert. Generate a formal itemized bill request letter and explain why this matters.

Patient: ${i}
Hospital/Provider: ${a}
Date of Service: ${j}
Amount Billed: ${k}

Write your response in this exact format:

LETTER:
[Complete, formal letter requesting a fully itemized bill. Include: patient name/date of birth placeholder, account number placeholder, date of service, specific request for itemized bill with CPT codes, ICD codes, and line-item charges, HIPAA rights reference, 30-day response request, and patient signature block]

WHY THIS MATTERS:
[3-4 specific things an itemized bill commonly reveals that summary bills hide — duplicate charges, phantom charges, upcoding, services never received]

WHAT TO LOOK FOR:
[When you get the itemized bill — specific red flags to check: duplicate line items, charges for discharge day, facility fees, medication markups, observation vs admission status]

IF THEY REFUSE:
[Patient's legal rights to receive an itemized bill — HIPAA, state laws, and what to do if the hospital refuses or delays]

SEND IT TO:
[Specific guidance on where and how to send — certified mail, fax, and who to address it to at the hospital]`;break}case"charitycare":{let{hospital:a,state:d,income:f,household:h,name:i}=g;if(!a||!d)return b.status(400).json({error:"Missing hospital or state"});e=1400;let j=i?.trim()||"the patient",k=f?.trim()?`Annual household income: $${f}`:"",l=h?.trim()?`Household size: ${h}`:"";c=`You are a medical billing advocate specializing in hospital charity care and financial assistance programs. Help this patient access charity care.

Hospital: ${a}
State: ${d}
Patient: ${j}
${k}
${l}

Write your response in this exact format:

ELIGIBILITY ESTIMATE:
[Based on income and household size, estimate if they likely qualify — reference federal poverty level percentages that most hospital charity care programs use: 100-400% FPL]

WHAT NONPROFIT HOSPITALS MUST OFFER:
[IRS 501c3 requirements — hospitals must have financial assistance policies, cannot use extraordinary collection actions, must provide plain language summaries]

HOW TO APPLY:
[Step-by-step application process — what to ask for, what documents to gather, who to contact at the billing department]

APPLICATION LETTER:
[A ready-to-use letter requesting charity care application materials, referencing the hospital's legal obligation and the patient's situation]

DOCUMENTS TO GATHER:
[Specific list of documents typically required: tax returns, pay stubs, bank statements, proof of expenses]

IF THEY SAY NO:
[How to appeal a charity care denial — internal appeal, state attorney general complaint, IRS Form 13909 for 501c3 violations]

OTHER PROGRAMS TO APPLY FOR:
[Medicaid, state programs, hospital payment plans, NeedyMeds, RxAssist — what to apply for simultaneously]`;break}case"paymentplan":{let{hospital:a,amount:d,income:f,name:h}=g;if(!a||!d)return b.status(400).json({error:"Missing hospital or amount"});e=1300;let i=h?.trim()||"the patient",j=f?.trim()?`Monthly income: $${f}`:"";c=`You are a medical billing advocate. Generate a payment plan negotiation letter and strategy for this patient.

Hospital/Provider: ${a}
Amount Owed: $${d}
Patient: ${i}
${j}

Write your response in this exact format:

LETTER:
[Complete letter requesting a 0% interest payment plan — include hardship language, proposed monthly payment amount (suggest 1-2% of balance or $50/month minimum whichever is greater), request for written confirmation, and reference to hospital financial assistance policies]

NEGOTIATION STRATEGY:
[3-4 tactics to get the best payment plan terms — asking for interest waiver, prompt-pay discount, balance reduction before setting up plan]

WHAT TO ASK FOR:
[Specific asks in priority order: charity care first, then balance reduction, then 0% payment plan, minimum monthly payment]

YOUR LEVERAGE:
[Why the hospital will negotiate — collection costs, bad debt write-offs, IRS requirements for nonprofit hospitals, state laws]

RED FLAGS TO AVOID:
[Medical credit cards (CareCredit deferred interest), collection referral threats, signing away rights, paying before disputing]

IF SENT TO COLLECTIONS:
[What changes once a bill goes to collections and how to handle it differently]`;break}case"creditcard":{let{card:a,amount:d,situation:f}=g;if(!f&&!a)return b.status(400).json({error:"Missing information"});e=1200,c=`You are a consumer finance expert specializing in medical credit cards and deferred interest traps. Analyze this situation.

Card/Product: ${a||"medical credit card (unspecified)"}
Amount: ${d?`$${d}`:"unspecified"}
Situation: ${f||"General medical credit card inquiry"}

Write your response in this exact format:

RISK LEVEL:
[HIGH RISK | MEDIUM RISK | LOW RISK — one line explaining why]

HOW DEFERRED INTEREST WORKS:
[Plain-English explanation of the deferred interest trap — if not paid in full by promo end, ALL interest from day 1 is charged retroactively]

THE MATH:
[Show exactly how much extra they would pay if they don't pay in full by the promo period end — use their specific amount if provided]

SAFER ALTERNATIVES:
[4-5 specific better options: hospital payment plan (0% interest, required by many states), personal loan comparison, credit union options, charity care, payment plan negotiation]

RED FLAGS TO WATCH:
[Specific warning signs in the fine print — deferred vs waived interest, minimum payments that won't clear the balance, automatic enrollment in recurring charges]

IF YOU ALREADY SIGNED UP:
[Damage control — how to calculate payoff date, set up auto-pay for full balance, dispute deferred interest charges, contact CFPB]

YOUR RIGHTS:
[CFPB protections, Truth in Lending Act disclosures, how to file a complaint if misled]`;break}case"hsafsa":{let{expenses:a,accountType:d}=g;if(!a)return b.status(400).json({error:"Missing expenses"});e=1300,c=`You are a tax and benefits expert specializing in HSA (Health Savings Accounts) and FSA (Flexible Spending Accounts). Analyze these expenses.

Account Type: ${d||"HSA or FSA"}
Expenses/Situation: ${a}

Write your response in this exact format:

ELIGIBLE EXPENSES:
[List each expense mentioned and whether it qualifies — YES/NO/PARTIAL with a one-line reason. Be specific.]

HIDDEN ELIGIBLE ITEMS YOU MAY BE MISSING:
[5-7 commonly overlooked expenses that ARE eligible — sunscreen SPF 15+, menstrual products, OTC medications without prescription (post-2020), telehealth, dental, vision, mental health]

NOT ELIGIBLE — COMMON MISTAKES:
[3-4 things people wrongly assume are covered — cosmetic procedures, gym memberships (usually no), vitamins (unless prescribed), teeth whitening]

HSA ADVANTAGES:
[Triple tax benefit explained simply — pre-tax contributions, tax-free growth, tax-free withdrawals for medical]

FSA RULES TO KNOW:
[Use-it-or-lose-it rules, grace periods, rollover limits, what happens if you leave your job]

HOW MUCH TO CONTRIBUTE:
[Strategy for estimating the right contribution amount based on their expenses]

PRO TIPS:
[2-3 advanced strategies — HSA as retirement account after 65, investing HSA funds, keeping receipts for future reimbursement]`;break}case"providercheck":{let{provider:a,insurance:d,procedure:f}=g;if(!a||!d)return b.status(400).json({error:"Missing provider or insurance"});e=1300;let h=f?.trim()?`Planned procedure/visit: ${f}`:"";c=`You are a health insurance expert specializing in provider networks. Help this patient understand their network coverage situation.

Provider/Doctor: ${a}
Insurance Plan: ${d}
${h}

Write your response in this exact format:

HOW TO VERIFY NETWORK STATUS:
[Step-by-step instructions to confirm if this provider is in-network — insurance website, member services number, and asking the provider's office directly. Explain why you must verify all three.]

IN-NETWORK vs OUT-OF-NETWORK COSTS:
[Plain-English explanation of what in-network and out-of-network means for THIS type of plan — HMO vs PPO vs EPO differences]

COST DIFFERENCE:
[Realistic estimate of how much more out-of-network could cost — typical in-network copay vs out-of-network coinsurance and balance billing risk]

HIDDEN RISKS:
[In-network facility but out-of-network doctor (anesthesiologist, radiologist, hospitalist) — how to protect against this]

WHAT TO ASK BEFORE YOUR APPOINTMENT:
[Exact questions to ask the provider's office AND your insurance company before any procedure or visit]

NO SURPRISES ACT PROTECTION:
[How the No Surprises Act (2022) protects you from unexpected out-of-network bills in certain situations]

IF YOU GET AN OUT-OF-NETWORK BILL:
[Step-by-step dispute process — network adequacy claims, balance billing protections, state insurance commissioner]`;break}case"costestimate":{let{procedure:a,insurance:d,location:f,deductible:h}=g;if(!a)return b.status(400).json({error:"Missing procedure"});e=1300;let i=d?.trim()||"unspecified insurance",j=f?.trim()||"unspecified location",k=h?.trim()?`Remaining deductible: $${h}`:"";c=`You are a medical cost expert. Help this patient estimate what a procedure will actually cost them before they commit.

Procedure: ${a}
Insurance: ${i}
Location: ${j}
${k}

Write your response in this exact format:

COST ESTIMATE:
[Realistic range of what this procedure typically costs — billed charge, Medicare rate, fair market rate, and typical patient out-of-pocket with insurance]

WHAT AFFECTS YOUR COST:
[5 specific factors that will change their actual cost — deductible status, facility type, in-network status, time of year, plan type]

QUESTIONS TO ASK YOUR INSURANCE BEFORE:
[6-8 specific questions to call member services and ask — pre-auth required? In-network facilities? What's my cost-sharing?]

HOW TO FIND CHEAPER OPTIONS:
[Specific ways to reduce cost — ambulatory surgery center vs hospital, different facility, negotiating cash price, timing relative to deductible]

PRICE TRANSPARENCY RESOURCES:
[Specific resources to research actual prices — Healthcare Bluebook, Fair Health Consumer, CMS hospital price transparency files, your state's all-payer database]

BEFORE YOU SCHEDULE:
[Checklist of things to do before committing — prior auth, in-network verification, get a cost estimate in writing, check if less expensive setting exists]

WATCH OUT FOR:
[Hidden costs that often surprise patients — facility fee, anesthesiology, pathology, post-procedure follow-up, assistant surgeon]`;break}case"external-review":{let{denial:a,amount:d}=g;if(!a)return b.status(400).json({error:"No denial provided"});e=1e3,c=`Write a formal External Review Request letter for a patient whose insurance claim was denied.

Denial reason: "${a}"
${d?`Claim amount: $${d}`:""}

Write a complete, ready-to-send letter requesting an Independent External Review under the ACA (Affordable Care Act). Use these placeholders: [Your Full Name], [Your Address], [Your Phone], [Your Email], [Date], [Insurance Company Name], [Plan Name], [Member ID], [Claim Number], [Service Date], [Provider Name], [State].

The letter should:
- Reference the patient's right to external review under ACA Section 2719
- State that the internal appeal has been exhausted or that this is an urgent care request
- Request assignment to an Independent Review Organization (IRO)
- Include a deadline of 4 months from the denial date as required by law
- Be firm, professional, and cite specific legal rights
- Mention that failure to comply will be reported to the state insurance commissioner

Format it as a complete, professional letter.`;break}case"planoptimizer":{let{situation:a,expectedCare:d,familySize:h,budget:i}=g;if(!a)return b.status(400).json({error:"Missing health situation"});e=1400,f=.35;let j=h?.trim()?`Family size: ${h}`:"",k=d?.trim()?`Expected care this year: ${d}`:"",l=i?.trim()?`Budget preference: ${i}`:"";c=`You are a health insurance expert. Help this person choose the right health insurance plan during open enrollment.

Health situation: ${a}
${j}
${k}
${l}

Write your response in this exact format:

PLAN RECOMMENDATION:
[Your specific recommendation — HMO, PPO, EPO, or HDHP — and why it fits their situation in 2-3 sentences]

PLAN TYPE EXPLAINED:
[Plain-English breakdown of which plan type fits them best and exactly what that means for their day-to-day healthcare — referrals, network flexibility, costs]

DEDUCTIBLE STRATEGY:
[Should they choose a high or low deductible? Show the math based on their expected care — when a high-deductible plan saves money vs when it costs more]

KEY FEATURES TO PRIORITIZE:
[5-6 specific things to look for when comparing plans — based on their specific health needs and situation]

OPEN ENROLLMENT CHECKLIST:
[Step-by-step checklist for open enrollment — what to gather, what to compare, what to watch out for, deadline reminders]

RED FLAGS TO AVOID:
[3-4 plan features or fine-print traps that would be bad for their specific situation]

QUESTIONS TO ASK HR OR YOUR BROKER:
[5 specific questions to ask before choosing — especially about network, prior auth requirements, and specialty coverage]

Be specific to their situation. Show real math where possible.`;break}case"hospitalprice":{let{hospital:a,state:d,procedure:f}=g;if(!a)return b.status(400).json({error:"Missing hospital name"});e=1300;let h=f?.trim()?`Procedure: ${f}`:"",i=d?.trim()?`State: ${d}`:"";c=`You are a healthcare price transparency expert. Help this patient find and understand hospital pricing data.

Hospital: ${a}
${i}
${h}

Write your response in this exact format:

HOW TO FIND THEIR PRICES:
[Step-by-step instructions to find this hospital's machine-readable price file — the Hospital Price Transparency Rule (effective Jan 1, 2021) requires every hospital to post a machine-readable file with all their prices. Where to look: hospital website footer, search "[hospital name] price transparency" or "[hospital name] chargemaster", or use cms.gov/healthplan/price-transparency]

WHAT YOU SHOULD EXPECT TO PAY:
[Fair price benchmarks for the requested procedure — Medicare allowable rate, fair market rate, and typical negotiated insurance rate. Give specific dollar ranges.]

HOW TO READ THE DATA:
[What the columns in hospital price files mean — gross charge, discounted cash price, payer-specific negotiated rates, de-identified minimum/maximum — in plain English]

YOUR RIGHTS IF PRICES AREN'T POSTED:
[Hospitals face $300/day fines for non-compliance. How to report violations to CMS. What to do if you can't find their file.]

NEGOTIATING WITH THIS DATA:
[How to use price transparency data as leverage — cash pay discount requests, negotiating to the Medicare rate, what to say when calling billing]

PRICE COMPARISON RESOURCES:
[Specific websites and tools to compare prices across hospitals — Healthcare Bluebook, Fair Health Consumer, your state's all-payer database if available]

Be specific and practical. The goal is to help this patient find the actual price before their procedure.`;break}case"insurancefinder":{let{situation:a,familySize:d,age:h,numChildren:i,spouseAge:j,income:k,state:l,healthNeeds:m,medications:n,fplPct:o,eligiblePrograms:p,subsidyEstimate:q}=g;if(!a||!l)return b.status(400).json({error:"Missing required fields"});e=1600,f=.35;let r=k?`$${parseInt(k).toLocaleString()}/year`:"not provided";c=`You are a health insurance expert and ACA enrollment specialist. Give this person a complete, personalized insurance action plan.

THEIR PROFILE:
- Employment situation: ${({employer_yes:"employed with employer insurance offered",employer_no:"employed but no employer insurance",self_employed:"self-employed",unemployed:"unemployed/between jobs",retired_under65:"retired under 65",age65plus:"65 or older (Medicare-eligible)",student:"student"})[a]||a}
- Age: ${h||"not provided"}${j?`, Spouse age: ${j}`:""}
- Family size: ${d} people${i>0?` (including ${i} child${i>1?"ren":""})`:""}
- Annual income: ${r}
- State: ${l}
- FPL %: ${o?`${o}% of Federal Poverty Level`:"not calculated"}
- Pre-determined eligible programs: ${p||"see below"}
- Estimated ACA subsidy: ${q}
${m?`- Health needs: ${m}`:""}
${n?`- Regular medications: ${n}`:""}

Write a complete, personalized insurance action plan in this EXACT format:

COVERAGE RECOMMENDATION:
[Your #1 recommendation in 2-3 sentences. Be direct and specific — tell them exactly what to do first. If they have multiple options, say which is best for their situation and why.]

WHY THIS FITS YOU:
[Personalized explanation of why this coverage type makes sense for their specific situation — reference their income, family, health needs, and state. Mention if their state has expanded Medicaid or has its own exchange.]

WHAT YOU'LL ACTUALLY PAY:
[Realistic monthly cost estimate for their recommended plan. Show the math: benchmark premium, their subsidy (if any), and what they'll actually pay per month. Be honest that these are estimates — actual costs depend on specific plans in their county.]

WHERE TO ENROLL:
[Exact step-by-step enrollment instructions — which website to go to, what information to have ready, and when to enroll. Include open enrollment dates (Nov 1 – Jan 15 for ACA). Mention special enrollment if they have a life event.]

WHAT PLAN TYPE TO LOOK FOR:
[Given their health needs, medications, and income — should they choose HMO, PPO, or HDHP? Which metal tier (Bronze/Silver/Gold/Platinum) makes most sense? Show why with real math if helpful.]

WHAT TO LOOK FOR IN A PLAN:
[5-7 specific things to check when comparing plans — tailored to their health situation. Include drug formulary checks, specialist access, deductible strategy, in-network providers, etc.]

SPECIAL PROGRAMS AVAILABLE:
[Any extra help they should apply for: Cost-Sharing Reductions (if Silver plan, under 250% FPL), Extra Help for Medicare (if Medicare-eligible), CHIP for children, Navigator/enrollment assistance, Medicaid if borderline eligible, state-specific programs]

KEY DATES TO KNOW:
[Critical enrollment deadlines: ACA open enrollment (Nov 1 – Jan 15), their state exchange dates if different, Medicare enrollment window (3 months before 65th birthday), special enrollment triggers. Be specific.]

Be specific to ${l} and their actual income/family situation. Include real URLs where helpful (healthcare.gov, medicare.gov, medicaid.gov). This person needs actionable guidance, not vague advice.`;break}case"cptlookup":{let{query:a}=g;if(!a)return b.status(400).json({error:"Missing code or procedure"});e=900,f=.2,d="You are a medical billing expert with comprehensive knowledge of CPT codes, Medicare reimbursement rates, and hospital pricing practices. You provide accurate, plain-language explanations.",c=`Look up this CPT code or medical procedure: "${a}"

WHAT IT IS:
[Plain English description of the procedure. What the doctor actually does. Where it's typically performed. Duration.]

MEDICARE RATE:
[The 2024 Medicare allowable rate — specific dollar amount. If it varies by setting, give both. Format: "$X outpatient / $Y inpatient" if different.]

FAIR PRICE RANGE:
[What a patient should expect to pay in the real world. Specific range — e.g., "$180 – $420". Key factors causing variation.]

AVERAGE CHARGED:
[What hospitals typically bill (chargemaster rate). State the typical markup multiple vs. Medicare rate.]

RED FLAGS:
[Common billing errors or overcharges specific to this code. What to watch for on your itemized bill.]

WHAT TO DO:
[If you receive this charge, specific steps to verify it's correct and dispute if overcharged.]`;break}case"erurgent":{let{symptoms:a}=g;if(!a)return b.status(400).json({error:"Missing symptoms"});e=900,f=.3,d="You are a medical triage expert and healthcare cost advisor. You help patients make informed care decisions. You always prioritize safety — when in doubt, recommend the ER. You are direct and specific.",c=`A patient is deciding between ER, urgent care, or other options for: "${a}"

RECOMMENDATION:
[One clear recommendation: EMERGENCY ROOM (go now), URGENT CARE (today), PRIMARY CARE (schedule this week), TELEHEALTH (can be handled virtually), or HOME CARE (can safely wait). State the primary reason in 2–3 sentences.]

SAFETY NOTE:
[Specific warning signs that would require immediate escalation to the ER. Be precise — list exact symptoms to watch for.]

COST COMPARISON:
[Typical out-of-pocket costs: ER ($1,200–$3,000+ without insurance; $250–$500 copay with insurance), Urgent Care ($150–$350 / $30–$75 copay), Primary Care ($150–$300 / $20–$50 copay), Telehealth ($40–$99 / $0–$30). Note cost of choosing wrong level.]

RIGHTS & TIPS:
[Key patient rights and cost-saving tips for the recommended setting. Include EMTALA rights for ER, how to find in-network urgent care, or telehealth options through insurer.]`;break}case"mentalparity":{let{situation:a,state:h}=g;if(!a)return b.status(400).json({error:"Missing situation"});e=1100,f=.3,d="You are a mental health insurance rights expert specializing in the Mental Health Parity and Addiction Equity Act (MHPAEA, 2008) and ACA mental health requirements. You help patients enforce their rights to equal coverage.",c=`A patient has a mental health insurance coverage issue: "${a}"
${h?`State: ${h}`:""}

YOUR COVERAGE RIGHTS:
[What MHPAEA specifically requires. Insurers must cover mental health the same as physical health — same prior auth, same visit limits, same cost-sharing. State what's specifically required for this situation.]

WHAT TO LOOK FOR:
[Specific parity violations for this situation. The key question: does the same restriction apply to comparable physical health conditions?]

HOW TO FIGHT BACK:
[Step-by-step complaint process: state insurance commissioner (fully-insured plans), DOL Employee Benefits Security Administration (employer/ERISA plans at dol.gov/agencies/ebsa), HHS (federally facilitated marketplace plans). Include typical outcomes.]

THE LAW ON YOUR SIDE:
[Specific protections: MHPAEA Section 512, ACA Section 2726${h?`, and any ${h}-specific parity laws that go beyond federal requirements`:""}. Success rates for parity complaints — cite data if known.]`;break}case"chronicdisease":{let{condition:a,insurance:h,income:i}=g;if(!a)return b.status(400).json({error:"Missing condition"});e=1400,f=.4,d="You are a healthcare financial planner specializing in chronic disease cost management. You help patients minimize long-term healthcare costs through smart insurance, medication assistance, and financial programs.",c=`Create a comprehensive cost plan for a patient managing: "${a}"
${h?`Insurance: ${h}`:""}
${i?`Annual income: $${i}`:""}

ANNUAL COST ESTIMATE:
[Realistic annual cost breakdown: medications (range), doctor visits (frequency and cost), lab work/monitoring, specialty care, medical supplies. Give specific dollar ranges — e.g., "Estimated total: $3,000–$8,000/year for moderate management."]

MEDICATION SAVINGS:
[For key medications used to treat this condition: name specific manufacturer patient assistance programs, generic availability, GoodRx savings, Mark Cuban's Cost Plus Drugs (costplusdrugs.com), 340B program eligibility. Give specific savings amounts.]

INSURANCE STRATEGY:
[For this specific condition, which plan type (HDHP+HSA, PPO, Gold ACA) makes most financial sense and why. What to prioritize during open enrollment: formulary tier for key meds, specialist access, prior auth requirements. Show math if helpful.]

FINANCIAL ASSISTANCE:
[Disease-specific foundations and programs — name them specifically (e.g., American Diabetes Association, Patient Advocate Foundation, NeedyMeds, specific disease foundations). Include eligibility and how to apply.]

COST REDUCTION ACTIONS:
[5–7 specific, immediate actions this patient can take to reduce annual costs for this condition. Be concrete.]`;break}case"medicare":{let{question:a}=g;if(!a)return b.status(400).json({error:"Missing question"});e=1200,f=.3,d="You are a Medicare expert with deep knowledge of Parts A, B, C, D, Medigap, Medicare Advantage, and enrollment rules. You give clear, accurate, actionable answers. You know exact premium amounts, deductibles, and enrollment windows for 2024.",c=`Answer this Medicare question clearly and specifically: "${a}"

RECOMMENDATION:
[Direct, specific answer to their question — what they should do.]

WHAT IT COVERS:
[Relevant coverage details for their question. Specific benefits, limitations, what's included and what's not.]

WHAT YOU'LL PAY:
[Specific cost information: deductibles, copays, premiums, coinsurance. Use 2024 figures.]

ENROLLMENT STEPS:
[Concrete steps to take action if applicable — forms, websites, phone numbers, deadlines.]

IMPORTANT WARNINGS:
[Key warnings, late enrollment penalties, or deadlines they must not miss.]`;break}case"veterans":{let{question:a}=g;if(!a)return b.status(400).json({error:"Missing question"});e=1200,f=.3,d="You are a Veterans Affairs (VA) benefits expert with deep knowledge of VA health care, disability compensation, education benefits, CHAMPVA, pension, the PACT Act (2022), and VA appeals. You help veterans understand and maximize their benefits.",c=`Answer this veterans benefits question clearly and specifically: "${a}"

ELIGIBILITY:
[Who qualifies and key eligibility criteria relevant to this question. Be specific about discharge requirements, service periods, and conditions.]

BENEFITS YOU QUALIFY FOR:
[Specific benefits available for this situation, with dollar amounts where applicable. Reference 2024 rates for disability compensation, pension, etc.]

HOW TO APPLY:
[Step-by-step application instructions with specific forms (e.g., VA Form 21-526EZ) and va.gov URLs. Include free VSO assistance option.]

MAXIMIZING YOUR BENEFITS:
[Tips to get the most from VA benefits: appeals process, rating increases, additional connected conditions, PACT Act expansions, free VSO help.]`;break}case"hospitalquality":{let{hospital:a,procedure:h}=g;if(!a)return b.status(400).json({error:"Missing hospital name"});e=1200,f=.3,d="You are a healthcare quality expert with knowledge of CMS star ratings, Leapfrog safety grades, hospital-acquired infection data, and surgical outcomes research. You help patients evaluate hospitals before receiving care.",c=`Help a patient research the quality of this hospital before receiving care: "${a}"
${h?`Planned procedure: ${h}`:""}

QUALITY SUMMARY:
[Overview of how to find this hospital's quality ratings. Direct them to care.medicare.gov (CMS stars) and leapfroggroup.org (safety grade). If this is a well-known hospital, note any relevant reputation facts.]

WHAT THE RATINGS MEAN:
[Explain key quality measures: CMS star ratings (1–5 stars, 46 measures), Leapfrog grade (A–F safety), HCAHPS patient experience, infection rates (C. diff, MRSA, CAUTI). What each tells you.]

WHERE TO RESEARCH:
[Step-by-step: care.medicare.gov, leapfroggroup.org, qualitycheck.org, health.usnews.com. What to search for and what data to look at.]

RED FLAGS TO WATCH:
[For ${h||"any procedure"}: specific quality measures that matter most, infection/mortality/readmission data to review, surgeon volume thresholds to ask about.]

QUESTIONS TO ASK:
[8–10 specific questions for the hospital and surgeon before committing: volume ("How many of these per year?"), complication rates, surgeon credentials, infection rates, what happens if complications occur.]`;break}default:return b.status(400).json({error:`Unknown tool: ${h}`})}let i=d?[{role:"system",content:d},{role:"user",content:c}]:[{role:"user",content:c}];try{let a=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.GROQ_API_KEY}`},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:i,temperature:f,max_tokens:e})});if(!a.ok){let c=await a.json().catch(()=>({}));return b.status(500).json({error:c.error?.message||"AI request failed"})}let c=await a.json();b.json({result:c.choices[0].message.content})}catch(a){b.status(500).json({error:a.message})}}},12060:(a,b,c)=>{c.r(b),c.d(b,{config:()=>l,default:()=>k,handler:()=>n});var d=c(29046),e=c(8667),f=c(33480),g=c(86435),h=c(8087),i=c(58112),j=c(18766);let k=(0,g.M)(h,"default"),l=(0,g.M)(h,"config"),m=new f.PagesAPIRouteModule({definition:{kind:e.A.PAGES_API,page:"/api/tools",pathname:"/api/tools",bundlePath:"",filename:""},userland:h,distDir:".next",relativeProjectDir:""});async function n(a,b,c){let e=await m.prepare(a,b,{srcPage:"/api/tools"});if(!e){b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve());return}let{query:f,params:g,prerenderManifest:h,routerServerContext:k}=e;try{let c=a.method||"GET",d=(0,i.getTracer)(),e=d.getActiveScopeSpan(),l=m.instrumentationOnRequestError.bind(m),n=async e=>m.render(a,b,{query:{...f,...g},params:g,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:h.preview,propagateError:!1,dev:m.isDev,page:"/api/tools",internalRevalidate:null==k?void 0:k.revalidate,onError:(...b)=>l(a,...b)}).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let f=d.getRootSpanAttributes();if(!f)return;if(f.get("next.span_type")!==j.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${f.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let g=f.get("next.route");if(g){let a=`${c} ${g}`;e.setAttributes({"next.route":g,"http.route":g,"next.span_name":a}),e.updateName(a)}else e.updateName(`${c} ${a.url}`)});e?await n(e):await d.withPropagatedContext(a.headers,()=>d.trace(j.BaseServerSpan.handleRequest,{spanName:`${c} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":c,"http.target":a.url}},n))}catch(a){if(m.isDev)throw a;(0,d.sendError)(b,500,"Internal Server Error")}finally{null==c.waitUntil||c.waitUntil.call(c,Promise.resolve())}}},75600:a=>{a.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")}};var b=require("../../webpack-api-runtime.js");b.C(a);var c=b.X(0,[169],()=>b(b.s=12060));module.exports=c})();