module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const { tool } = body;
  if (!tool) return res.status(400).json({ error: "Missing tool parameter" });

  let prompt, systemMsg, maxTokens, temperature;
  temperature = 0.3;

  switch (tool) {
    case "dispute": {
      const { bill, amount } = body;
      if (!bill) return res.status(400).json({ error: "No bill provided" });
      maxTokens = 1400;
      systemMsg = "You are a medical billing advocate and patient rights attorney with 20 years of experience writing dispute letters that get results. You know exactly which laws to cite, which departments to contact, and what language makes hospitals and insurers take action. Your letters are firm, professional, and legally grounded.";
      prompt = `Write a powerful dispute letter for a patient with this situation: "${bill}"
${amount ? `Amount being disputed: $${amount}` : ""}

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

Format as a real letter with proper spacing, date, recipient address, salutation, body paragraphs, and closing.`;
      break;
    }
    case "denial": {
      const { denial, amount } = body;
      if (!denial) return res.status(400).json({ error: "No denial reason provided" });
      maxTokens = 1600;
      temperature = 0.4;
      systemMsg = "You are an insurance appeal specialist and patient rights expert. You have won hundreds of appeals against major insurers. You know ERISA Section 503, ACA Section 2719, the No Surprises Act, and state insurance laws inside out. You write appeal letters that insurance companies cannot easily dismiss. Your success rate is 73% — the national average for appealed denials.";
      prompt = `An insurance claim was denied. Help this patient fight back.

Denial reason: "${denial}"
${amount ? `Claim amount: $${amount}` : ""}

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
[Realistic estimate with context. National data: 73% of appealed denials are overturned. Give the specific success rate for this type of denial if known, and what factors help.]`;
      break;
    }
    case "negotiate": {
      const { bill, amount, name } = body;
      if (!bill) return res.status(400).json({ error: "Missing bill description" });
      maxTokens = 1200;
      temperature = 0.4;
      const patientName = name?.trim() || "the patient";
      const amountStr = amount ? `$${amount}` : "the billed amount";
      prompt = `You are a medical billing negotiation expert. Generate a detailed, word-for-word phone script for a patient to call their hospital billing department and negotiate their bill.

Patient: ${patientName}
Bill / Charge: ${bill}
Amount Billed: ${amountStr}

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

Be specific, confident, and direct. Use real numbers and real leverage points.`;
      break;
    }
    case "debtrights": {
      const { state, situation } = body;
      if (!state) return res.status(400).json({ error: "Missing state" });
      maxTokens = 1400;
      const situationStr = situation?.trim() || "general medical debt situation";
      prompt = `You are a consumer rights attorney specializing in medical debt law. A patient in ${state} has the following situation: ${situationStr}

Explain their legal rights in plain English. Be specific to ${state} laws where they differ from federal law.

Write your response in this exact format:

YOUR KEY RIGHTS:
[4-5 of the most important federal and ${state}-specific rights this person has right now — be specific and actionable]

CREDIT REPORTING RULES:
[Exactly when and how medical debt can appear on credit reports — include the current federal rules (medical debt under $500 cannot be reported; 1-year grace period before reporting; removed from credit report if paid)]

STATUTE OF LIMITATIONS:
[How long collectors have to sue for medical debt in ${state} — be specific with the number of years and what happens after it expires]

DEBT COLLECTOR RULES:
[What debt collectors can and cannot do under FDCPA — calls, harassment, validation requirements, cease and desist rights]

HOSPITAL OBLIGATIONS:
[What ${state} hospitals are required to offer — charity care, financial assistance, payment plans, billing protections]

WHAT TO DO NOW:
[Step-by-step action plan specific to their situation — starting with the most urgent step]

MAGIC WORDS TO SAY:
[Exact phrases and written statements that trigger legal protections — debt validation request, cease and desist, charity care application request]

Be accurate, cite specific laws (FDCPA, No Surprises Act, ${state} statutes where known), and focus on practical actions over legal theory.`;
      break;
    }
    case "eob": {
      const { eob } = body;
      if (!eob) return res.status(400).json({ error: "Missing EOB text" });
      maxTokens = 1200;
      prompt = `You are a medical billing expert specializing in Explanation of Benefits (EOB) documents. A patient has pasted their EOB below. Analyze it thoroughly and explain it in plain English.

EOB TEXT:
${eob}

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

Be specific with dollar amounts from the EOB. If the EOB text is unclear or incomplete, work with what's provided and note any missing information.`;
      break;
    }
    case "priorauth": {
      const { procedure, diagnosis, insurance, doctor, name } = body;
      if (!procedure) return res.status(400).json({ error: "Missing procedure description" });
      maxTokens = 1500;
      const patientNamePA = name?.trim() || "the patient";
      const insuranceName = insurance?.trim() || "the insurance company";
      const doctorName = doctor?.trim() || "the treating physician";
      const diagnosisStr = diagnosis?.trim() || "the patient's medical condition";
      prompt = `You are a medical billing expert who specializes in writing successful prior authorization letters. Generate a complete, professional prior authorization appeal letter that insurance companies approve.

Patient: ${patientNamePA}
Procedure/Treatment Requested: ${procedure}
Diagnosis/Reason: ${diagnosisStr}
Insurance Company: ${insuranceName}
Ordering Physician: ${doctorName}

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

Be specific, cite medical necessity standards, and write in the formal language that insurance reviewers expect. The letter should be ready to print and submit.`;
      break;
    }
    case "secondopinion": {
      const { diagnosis, procedure, concern } = body;
      if (!diagnosis) return res.status(400).json({ error: "Missing diagnosis" });
      maxTokens = 1400;
      temperature = 0.35;
      const procedureStr = procedure?.trim() ? `Recommended procedure: ${procedure}` : "";
      const concernStr = concern?.trim() ? `Patient concern: ${concern}` : "";
      prompt = `You are a patient advocate and medical expert. A patient has received the following diagnosis and wants to seek a second opinion.

Diagnosis: ${diagnosis}
${procedureStr}
${concernStr}

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

Be specific to this diagnosis. Use real medical terms the patient can bring to their appointment. This could be a life-changing decision.`;
      break;
    }
    case "drug": {
      const { drug, price } = body;
      if (!drug) return res.status(400).json({ error: "No drug provided" });
      maxTokens = 1100;
      systemMsg = "You are a pharmaceutical pricing expert who helps Americans find the lowest legal price for their medications. You have deep knowledge of GoodRx pricing, Mark Cuban's Cost Plus Drugs (costplusdrugs.com), manufacturer patient assistance programs, pharmacy discount cards, and generic drug availability. Always give specific dollar amounts, not ranges where possible.";
      prompt = `Help this patient find the lowest price for their medication: "${drug}"
${price ? `They are currently paying: $${price}` : ""}

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
3. [If brand-name only: go to [manufacturer] website and apply for their patient assistance program — many are free for qualifying patients]`;
      break;
    }
    case "drugfinder": {
      const { drug, dose, insurance } = body;
      if (!drug) return res.status(400).json({ error: "Missing drug name" });
      maxTokens = 1400;
      const doseStr = dose?.trim() ? ` ${dose}` : "";
      const insuranceStr = insurance?.trim() ? `Patient insurance: ${insurance}` : "Patient may be uninsured or underinsured.";
      prompt = `You are a clinical pharmacist and drug pricing expert. A patient is trying to reduce the cost of their medication.

Drug: ${drug}${doseStr}
${insuranceStr}

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

Be specific with drug names, real prices, and real program names. This patient is trying to afford their medication.`;
      break;
    }
    case "insplan": {
      const { plan } = body;
      if (!plan) return res.status(400).json({ error: "Missing plan text" });
      maxTokens = 1400;
      prompt = `You are a health insurance expert. A patient has pasted their Summary of Benefits and Coverage (SBC) or plan details below. Decode it in plain English.

PLAN TEXT:
${plan}

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

Be specific with dollar amounts from the plan text. Speak like a friend who happens to be an insurance expert.`;
      break;
    }
    case "surprisebill": {
      const { bill, situation } = body;
      if (!bill) return res.status(400).json({ error: "Missing bill description" });
      maxTokens = 1300;
      prompt = `You are a healthcare law expert specializing in the No Surprises Act (2022) and surprise medical billing protections. Analyze whether this bill may violate federal surprise billing laws.

Bill/Situation: ${bill}
Additional context: ${situation || "None provided"}

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

Be specific about which parts of the No Surprises Act apply (emergency services, air ambulance, out-of-network at in-network facilities, etc.).`;
      break;
    }
    case "itemization": {
      const { hospital, date, amount, name } = body;
      if (!hospital) return res.status(400).json({ error: "Missing hospital name" });
      maxTokens = 1300;
      const patientNameIT = name?.trim() || "the patient";
      const dateStr = date?.trim() || "the date of service";
      const amountStr = amount?.trim() ? `$${amount}` : "the billed amount";
      prompt = `You are a medical billing expert. Generate a formal itemized bill request letter and explain why this matters.

Patient: ${patientNameIT}
Hospital/Provider: ${hospital}
Date of Service: ${dateStr}
Amount Billed: ${amountStr}

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
[Specific guidance on where and how to send — certified mail, fax, and who to address it to at the hospital]`;
      break;
    }
    case "charitycare": {
      const { hospital, state, income, household, name } = body;
      if (!hospital || !state) return res.status(400).json({ error: "Missing hospital or state" });
      maxTokens = 1400;
      const patientNameCC = name?.trim() || "the patient";
      const incomeStr = income?.trim() ? `Annual household income: $${income}` : "";
      const householdStr = household?.trim() ? `Household size: ${household}` : "";
      prompt = `You are a medical billing advocate specializing in hospital charity care and financial assistance programs. Help this patient access charity care.

Hospital: ${hospital}
State: ${state}
Patient: ${patientNameCC}
${incomeStr}
${householdStr}

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
[Medicaid, state programs, hospital payment plans, NeedyMeds, RxAssist — what to apply for simultaneously]`;
      break;
    }
    case "paymentplan": {
      const { hospital, amount, income, name } = body;
      if (!hospital || !amount) return res.status(400).json({ error: "Missing hospital or amount" });
      maxTokens = 1300;
      const patientNamePP = name?.trim() || "the patient";
      const incomeStr = income?.trim() ? `Monthly income: $${income}` : "";
      prompt = `You are a medical billing advocate. Generate a payment plan negotiation letter and strategy for this patient.

Hospital/Provider: ${hospital}
Amount Owed: $${amount}
Patient: ${patientNamePP}
${incomeStr}

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
[What changes once a bill goes to collections and how to handle it differently]`;
      break;
    }
    case "creditcard": {
      const { card, amount, situation } = body;
      if (!situation && !card) return res.status(400).json({ error: "Missing information" });
      maxTokens = 1200;
      prompt = `You are a consumer finance expert specializing in medical credit cards and deferred interest traps. Analyze this situation.

Card/Product: ${card || "medical credit card (unspecified)"}
Amount: ${amount ? `$${amount}` : "unspecified"}
Situation: ${situation || "General medical credit card inquiry"}

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
[CFPB protections, Truth in Lending Act disclosures, how to file a complaint if misled]`;
      break;
    }
    case "hsafsa": {
      const { expenses, accountType } = body;
      if (!expenses) return res.status(400).json({ error: "Missing expenses" });
      maxTokens = 1300;
      const acct = accountType || "HSA or FSA";
      prompt = `You are a tax and benefits expert specializing in HSA (Health Savings Accounts) and FSA (Flexible Spending Accounts). Analyze these expenses.

Account Type: ${acct}
Expenses/Situation: ${expenses}

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
[2-3 advanced strategies — HSA as retirement account after 65, investing HSA funds, keeping receipts for future reimbursement]`;
      break;
    }
    case "providercheck": {
      const { provider, insurance, procedure } = body;
      if (!provider || !insurance) return res.status(400).json({ error: "Missing provider or insurance" });
      maxTokens = 1300;
      const procedureStr = procedure?.trim() ? `Planned procedure/visit: ${procedure}` : "";
      prompt = `You are a health insurance expert specializing in provider networks. Help this patient understand their network coverage situation.

Provider/Doctor: ${provider}
Insurance Plan: ${insurance}
${procedureStr}

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
[Step-by-step dispute process — network adequacy claims, balance billing protections, state insurance commissioner]`;
      break;
    }
    case "costestimate": {
      const { procedure, insurance, location, deductible } = body;
      if (!procedure) return res.status(400).json({ error: "Missing procedure" });
      maxTokens = 1300;
      const insuranceStr = insurance?.trim() || "unspecified insurance";
      const locationStr = location?.trim() || "unspecified location";
      const deductibleStr = deductible?.trim() ? `Remaining deductible: $${deductible}` : "";
      prompt = `You are a medical cost expert. Help this patient estimate what a procedure will actually cost them before they commit.

Procedure: ${procedure}
Insurance: ${insuranceStr}
Location: ${locationStr}
${deductibleStr}

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
[Hidden costs that often surprise patients — facility fee, anesthesiology, pathology, post-procedure follow-up, assistant surgeon]`;
      break;
    }
    case "external-review": {
      const { denial, amount } = body;
      if (!denial) return res.status(400).json({ error: "No denial provided" });
      maxTokens = 1000;
      prompt = `Write a formal External Review Request letter for a patient whose insurance claim was denied.

Denial reason: "${denial}"
${amount ? `Claim amount: $${amount}` : ""}

Write a complete, ready-to-send letter requesting an Independent External Review under the ACA (Affordable Care Act). Use these placeholders: [Your Full Name], [Your Address], [Your Phone], [Your Email], [Date], [Insurance Company Name], [Plan Name], [Member ID], [Claim Number], [Service Date], [Provider Name], [State].

The letter should:
- Reference the patient's right to external review under ACA Section 2719
- State that the internal appeal has been exhausted or that this is an urgent care request
- Request assignment to an Independent Review Organization (IRO)
- Include a deadline of 4 months from the denial date as required by law
- Be firm, professional, and cite specific legal rights
- Mention that failure to comply will be reported to the state insurance commissioner

Format it as a complete, professional letter.`;
      break;
    }
    default:
      return res.status(400).json({ error: `Unknown tool: ${tool}` });
  }

  const messages = systemMsg
    ? [{ role: "system", content: systemMsg }, { role: "user", content: prompt }]
    : [{ role: "user", content: prompt }];

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(500).json({ error: err.error?.message || "AI request failed" });
    }

    const data = await resp.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
