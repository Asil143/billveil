export const blogPosts = [
  {
    slug: "how-to-dispute-a-medical-bill",
    title: "How to Dispute a Medical Bill: Step-by-Step Guide (2025)",
    metaTitle: "How to Dispute a Medical Bill — Step-by-Step Guide",
    description: "Medical bill errors affect 1 in 5 bills. Learn exactly how to spot overcharges, write a dispute letter, and get money back — with free tools and scripts.",
    date: "2025-01-10",
    readTime: "9 min read",
    category: "Billing Disputes",
    categoryColor: "#60a5fa",
    intro: "If you've received a medical bill that seems too high, you're not alone — studies show that up to 80% of medical bills contain errors. The good news: hospitals and insurers expect disputes, and you have real leverage. This guide walks you through exactly what to do, step by step.",
    relatedTools: [
      { label: "Generate a Dispute Letter", href: "/?tab=dispute" },
      { label: "Request an Itemized Bill", href: "/?tab=itemization" },
      { label: "Look Up CPT Code Prices", href: "/?tab=cpt" },
    ],
    sections: [
      {
        h2: "Why Medical Bill Errors Are So Common",
        paragraphs: [
          "Medical billing is extraordinarily complex. A single ER visit can generate codes from a dozen different billing departments — the hospital, the ER physician group, the radiologist, the lab. Each codes independently, and mistakes pile up fast.",
          "The most common errors include: duplicate charges (billed twice for the same service), upcoding (billing a more expensive service than what was actually performed), unbundling (splitting a single procedure into separate charges that should be one), and charges for services you never received.",
          "You are legally entitled to an itemized bill that lists every single charge. Start there.",
        ],
      },
      {
        h2: "Step 1: Request an Itemized Bill",
        paragraphs: [
          "Call the hospital billing department and ask for an itemized statement — sometimes called a \"detailed bill\" or \"UB-04 form.\" They are required by law to provide this. If they resist, mention that your state insurance department requires it.",
          "Once you have it, look for: charges you don't recognize, duplicate line items, room charges for days you weren't admitted, \"miscellaneous\" or \"supplies\" fees without description, and any procedure you didn't consent to.",
        ],
        tip: "Pro tip: Cross-reference your itemized bill against your Explanation of Benefits (EOB) from your insurance company. Discrepancies between the two are often where errors hide.",
      },
      {
        h2: "Step 2: Look Up What Each Charge Should Cost",
        paragraphs: [
          "Every procedure has a CPT (Current Procedural Terminology) code — a 5-digit number that identifies exactly what was done. Your itemized bill should list these. Look them up to see what Medicare pays for each code in your area, which is the baseline fair price.",
          "Hospitals must also publicly post their prices under the Hospital Price Transparency Rule (effective 2021). Search for your hospital's \"price transparency\" or \"chargemaster\" page, or use a tool like BillVeil's CPT Code Lookup.",
        ],
        cta: { label: "Look Up CPT Code Prices", href: "/?tab=cpt" },
      },
      {
        h2: "Step 3: Write a Dispute Letter",
        paragraphs: [
          "Once you've identified errors, put your dispute in writing. A written dispute creates a paper trail and is much harder to ignore than a phone call. Your letter should:",
        ],
        bullets: [
          "State your name, account number, and date of service",
          "List each disputed charge by line item and CPT code",
          "Explain specifically why each charge is wrong (\"duplicate,\" \"never received,\" \"upcoded — provider notes show X, not Y\")",
          "Request a written response within 30 days",
          "Cite your state's patient billing dispute rights if applicable",
        ],
        paragraphs2: [
          "Send the letter via certified mail with return receipt, and keep a copy. Email can also work if you need a faster response — just forward to the billing department email and CC the hospital's patient advocate or ombudsman if one exists.",
        ],
        cta: { label: "Generate a Free Dispute Letter", href: "/?tab=dispute", note: "BillVeil writes the letter for you — just paste your bill." },
      },
      {
        h2: "Step 4: Know Your Rights",
        paragraphs: [
          "Federal law gives you important protections. Under the No Surprises Act (2022), out-of-network emergency care charges are capped, and you can dispute surprise bills through an independent dispute resolution process.",
          "Many states have additional protections: some require hospitals to offer charity care before sending accounts to collections, some cap medical debt interest rates, and some prohibit reporting medical debt to credit bureaus for a period of time.",
          "If a bill goes to collections, the Fair Debt Collection Practices Act (FDCPA) protects you from harassment and gives you the right to request debt validation within 30 days.",
        ],
      },
      {
        h2: "Step 5: Escalate If Needed",
        paragraphs: [
          "If the billing department ignores your dispute or refuses to correct errors, escalate. Contact the hospital's patient advocate — most large hospitals have one. File a complaint with your state insurance commissioner (for insurance-related issues) or your state attorney general's consumer protection office.",
          "For bills over $1,000, consider a medical billing advocate. They typically work on contingency (taking 25-35% of what they save you), so there's no upfront cost. They know the system and often get bills reduced significantly.",
        ],
      },
    ],
    faq: [
      { q: "How long do I have to dispute a medical bill?", a: "There's no universal deadline, but act quickly. Most hospitals have a 90-180 day internal dispute window. For insurance claims, your plan's appeal deadline is usually 180 days from the denial notice. For collections, you have 30 days from first contact to request debt validation." },
      { q: "Will disputing a medical bill hurt my credit?", a: "A medical bill can't be reported to credit bureaus until it's at least 365 days past due (as of 2023 federal rules). Disputing before it reaches collections keeps it off your credit entirely. The three major bureaus also agreed to remove medical debt under $500 from credit reports." },
      { q: "What if the hospital refuses to correct the error?", a: "Escalate to the hospital's patient advocate, your state insurance commissioner (if insurance is involved), or the Consumer Financial Protection Bureau (CFPB). For Medicare patients, contact your State Medical Review Organization (QIO)." },
      { q: "Can I dispute a bill I already paid?", a: "Yes. If you can prove an error, you can request a refund even after paying. Send the same type of dispute letter and request reimbursement. It may take 60-90 days, but hospitals do issue refunds for billing errors." },
    ],
  },

  {
    slug: "how-to-appeal-insurance-denial",
    title: "How to Appeal an Insurance Denial: A Complete Guide (2025)",
    metaTitle: "How to Appeal an Insurance Denial — Step-by-Step",
    description: "Insurance denials are reversed 40% of the time on appeal. Learn the exact steps to write a winning appeal letter, what to say, and when to escalate to external review.",
    date: "2025-01-17",
    readTime: "10 min read",
    category: "Insurance Denials",
    categoryColor: "#a78bfa",
    intro: "Getting a claim denied feels like hitting a wall. But here's what insurers don't advertise: about 40% of denied claims are overturned on appeal. The system is designed to make you give up — most people do. This guide shows you exactly how to fight back and win.",
    relatedTools: [
      { label: "Write an Appeal Letter (AI)", href: "/?tab=denial" },
      { label: "Check Mental Health Parity Rights", href: "/?tab=mentalhealthparity" },
      { label: "Prior Authorization Helper", href: "/?tab=priorauth" },
    ],
    sections: [
      {
        h2: "Why Insurers Deny Claims",
        paragraphs: [
          "Insurance companies deny claims for many reasons, not all of them legitimate. Common denial reasons include: \"not medically necessary\" (the most common, and often reversible), \"prior authorization not obtained\" (sometimes waivable in emergencies), \"out-of-network provider\" (capped under the No Surprises Act for emergencies), \"experimental or investigational\" (often incorrect — check FDA approval), and simple administrative errors like wrong codes or missing information.",
          "The first step is understanding which category your denial falls into, because each requires a different response.",
        ],
      },
      {
        h2: "Step 1: Get the Denial in Writing",
        paragraphs: [
          "Your insurer is legally required to send you a written denial notice that explains: the specific reason for denial, the clinical criteria or plan language they relied on, and your right to appeal with a deadline.",
          "If you haven't received this, call and request it in writing immediately. You cannot build an effective appeal without knowing exactly what they objected to.",
        ],
      },
      {
        h2: "Step 2: Understand the Denial Type",
        paragraphs: [
          "\"Not medically necessary\" denials are the most winnable. Your doctor's supporting documentation — clinical notes, test results, treatment history, peer-reviewed literature — is your ammunition. Get a letter of medical necessity from your doctor specifically addressing the insurer's stated criteria.",
          "\"Prior authorization not obtained\" can sometimes be waived retroactively if the situation was urgent or if your provider acted in good faith. The No Surprises Act also restricts surprise PA requirements for emergency care.",
          "\"Experimental\" denials are worth fighting if the treatment has FDA approval or strong peer-reviewed support. Ask your doctor for literature citations and check whether your state has any clinical trial coverage mandates.",
        ],
        tip: "Request your insurer's coverage determination criteria for your specific treatment code. Under ERISA and ACA rules, they're required to give you the clinical criteria they used to make the decision.",
      },
      {
        h2: "Step 3: File an Internal Appeal",
        paragraphs: [
          "Every insurer must offer at least one level of internal appeal. You typically have 180 days from the denial notice to file. Submit your appeal in writing with:",
        ],
        bullets: [
          "Your name, member ID, claim number, and date of service",
          "A clear statement that you are filing a formal appeal",
          "A letter from your doctor explaining medical necessity",
          "Relevant medical records, test results, and treatment history",
          "Peer-reviewed medical literature supporting the treatment",
          "Your insurer's own coverage criteria (show you meet them)",
          "Any relevant prior authorization documentation",
        ],
        paragraphs2: [
          "Send everything certified mail. Keep copies of everything. If you can get your doctor to call the insurer's medical director directly (peer-to-peer review), that often speeds up reversals.",
        ],
        cta: { label: "Write Your Appeal Letter (AI)", href: "/?tab=denial", note: "BillVeil's AI writes a customized appeal based on your denial reason." },
      },
      {
        h2: "Step 4: Request External Review",
        paragraphs: [
          "If your internal appeal is denied, you have the right to an independent external review by a third-party organization that has no financial relationship with your insurer. Under the ACA, this right applies to most private health plans.",
          "External review organizations overturn insurer decisions about 40% of the time for clinical denials. File within 60 days of your final internal denial. Your insurer must tell you how in the denial letter.",
          "For Medicare appeals, the process is slightly different — you can escalate through the Medicare Appeals Council all the way to federal court if needed.",
        ],
      },
      {
        h2: "Step 5: Other Escalation Paths",
        paragraphs: [
          "File a complaint with your state insurance commissioner — insurers take these seriously because commissioners have enforcement power. Your state may also have a patient advocate or insurance ombudsman who can intervene on your behalf for free.",
          "If you have an employer-sponsored plan governed by ERISA, you can ultimately sue in federal court if all appeals are exhausted — though most cases are resolved before that point.",
        ],
      },
    ],
    faq: [
      { q: "How long does an insurance appeal take?", a: "For urgent care (when delay would seriously jeopardize your health), insurers must respond within 72 hours. For non-urgent internal appeals, the limit is 60 days. External reviews typically take 45 days, or 72 hours for urgent cases." },
      { q: "Can my doctor appeal on my behalf?", a: "Yes. Many insurers allow treating physicians to file peer-to-peer appeals directly with the insurer's medical director. This is often faster than the formal written process and has high success rates, especially for 'not medically necessary' denials." },
      { q: "What's the most effective thing I can add to an appeal?", a: "A letter from your treating physician that directly addresses the insurer's stated denial reason using the insurer's own clinical criteria language. Generic letters of medical necessity are much less effective than ones that argue point-by-point against the denial rationale." },
      { q: "Does mental health coverage have special protections?", a: "Yes. The Mental Health Parity and Addiction Equity Act (MHPAEA) requires insurers to cover mental health and substance use disorder treatment at the same level as medical/surgical care. Denials that violate parity are illegal and highly appealable." },
    ],
  },

  {
    slug: "how-to-read-explanation-of-benefits",
    title: "How to Read an Explanation of Benefits (EOB) — What Every Line Means",
    metaTitle: "How to Read an Explanation of Benefits (EOB)",
    description: "Your EOB isn't a bill — but it tells you if you're being charged correctly. Learn what every field means, what red flags to look for, and how to spot errors before you pay.",
    date: "2025-01-24",
    readTime: "7 min read",
    category: "Understanding Your Bills",
    categoryColor: "#34d399",
    intro: "Every time you use your health insurance, your insurer sends an Explanation of Benefits (EOB). It's not a bill — but it tells you exactly what your insurer paid, what you owe, and why. Most people throw these away. That's a mistake. Your EOB is one of the most powerful documents in medical billing disputes.",
    relatedTools: [
      { label: "Decode Your EOB (AI)", href: "/?tab=eob" },
      { label: "Dispute a Medical Bill", href: "/?tab=dispute" },
      { label: "Appeal an Insurance Denial", href: "/?tab=denial" },
    ],
    sections: [
      {
        h2: "What Is an EOB?",
        paragraphs: [
          "An Explanation of Benefits is a statement from your health insurer showing how a claim was processed. Your provider submits a claim after a visit; the insurer processes it and sends you an EOB showing what they paid and what you're responsible for.",
          "You'll get a separate EOB for each provider who billed your insurance — the hospital, the ER physician group, the anesthesiologist, the radiologist — even for the same visit. This is normal and also a common source of confusion.",
        ],
        tip: "Your EOB and the hospital's itemized bill should match. If numbers differ between the two documents, that's a billing error worth investigating.",
      },
      {
        h2: "Key Fields on Your EOB — Explained",
        bullets: [
          "Claim number: The unique ID for this specific claim. Use this when calling your insurer.",
          "Service date: The date(s) care was provided. Should match your records.",
          "Provider name: Who billed for the service. Check this — sometimes bills arrive from providers you don't recognize.",
          "Procedure/service: A description and usually a CPT code. Look up any codes you don't recognize.",
          "Amount billed: What the provider charged. Often much higher than what anyone actually pays.",
          "Discount/adjustment: The negotiated discount your insurer gets — you get this too if you're in-network.",
          "Plan paid: What your insurance paid.",
          "Your responsibility: What you owe. This should match any bill you receive from the provider.",
          "Deductible applied: How much of this claim went toward your annual deductible.",
          "Copay/coinsurance: Your fixed or percentage share of the cost after the deductible.",
          "Out-of-pocket applied: How much of this goes toward your annual out-of-pocket maximum.",
        ],
      },
      {
        h2: "What Red Flags to Look For",
        paragraphs: [
          "Services you don't recognize: If a procedure appears on your EOB that you don't remember having, call your insurer and your provider before paying anything. It may be a billing error, a code mistake, or in rare cases, fraud.",
          "Duplicate services: Seeing the same CPT code twice for the same date? That could be a duplicate charge. Compare against your itemized bill.",
          "Out-of-network flag on an in-network provider: If you saw an in-network doctor and the EOB shows it processed as out-of-network, call your insurer. This is a common error and can mean a much higher bill for you.",
          "Denial with no explanation: Your EOB will show denied claims. Every denial must include a reason code and your appeal rights. If it doesn't, call your insurer.",
        ],
      },
      {
        h2: "When Your Bill Doesn't Match Your EOB",
        paragraphs: [
          "The \"Your Responsibility\" column on your EOB is the maximum you should pay for that claim. If a provider sends you a bill for more than that amount, don't pay without investigating.",
          "Call the billing department and reference your EOB. Ask them to re-submit the claim or explain the discrepancy. Often this is a processing delay — the insurance payment hasn't been posted yet. Other times it's a billing error in your favor.",
        ],
        cta: { label: "Paste Your EOB for AI Analysis", href: "/?tab=eob", note: "BillVeil explains every line and flags anything suspicious." },
      },
      {
        h2: "EOBs for Out-of-Network Care",
        paragraphs: [
          "If you received emergency care from an out-of-network provider, the No Surprises Act (effective January 2022) caps your cost at your in-network cost-sharing level. Your EOB should reflect this. If it doesn't, you may have been overcharged and should dispute it.",
          "For non-emergency out-of-network care, you'll typically pay more. Your EOB will show the \"allowed amount\" — what your insurer considers reasonable for that service — and you pay a percentage of that, plus anything above it if the provider charges more than the allowed amount.",
        ],
      },
    ],
    faq: [
      { q: "How long should I keep my EOBs?", a: "Keep EOBs for at least 3-7 years. They're your primary evidence in billing disputes, for tax purposes (if deducting medical expenses), and as a record of your insurance coverage history." },
      { q: "I got an EOB but no bill yet. Do I owe money?", a: "The EOB shows what you may owe, but wait for the actual bill from your provider before paying. Sometimes the amounts change after insurance adjustments are finalized. Never pay an EOB itself — it's not a bill." },
      { q: "What's the difference between EOB and an EOP?", a: "Explanation of Payment (EOP) is the same thing, just a term used more by providers. An EOB is sent to you (the patient). An EOP is sent to your provider showing the same information from the payer's perspective." },
      { q: "Can I get EOBs online?", a: "Yes — most insurers have online portals where you can view and download EOBs going back 1-3 years. Look for \"Claims\" or \"Claims History\" in your insurer's member portal." },
    ],
  },

  {
    slug: "how-to-negotiate-a-hospital-bill",
    title: "How to Negotiate a Hospital Bill Down (Scripts That Actually Work)",
    metaTitle: "How to Negotiate a Hospital Bill — Scripts That Work",
    description: "Hospitals negotiate bills all the time — most people just don't know to ask. Learn exactly what to say to reduce your bill by 20-80%, with word-for-word scripts.",
    date: "2025-02-03",
    readTime: "8 min read",
    category: "Cost Reduction",
    categoryColor: "#fbbf24",
    intro: "Here's a fact hospitals don't advertise: the price on your bill is almost never the final price. Hospital billing is more like a flea market than a fixed-price store. The chargemaster rate (the list price) is essentially fictional — uninsured patients are routinely charged 2-10x what insured patients pay for the same service. You have more leverage than you think.",
    relatedTools: [
      { label: "Get a Negotiation Script (AI)", href: "/?tab=negotiate" },
      { label: "Find Charity Care Programs", href: "/?tab=charitycare" },
      { label: "Set Up a Payment Plan", href: "/?tab=paymentplan" },
    ],
    sections: [
      {
        h2: "Can You Really Negotiate Hospital Bills?",
        paragraphs: [
          "Yes — and hospitals expect it. Most nonprofit hospitals (which account for about 60% of US hospitals) are legally required to have charity care and financial assistance programs. Even for-profit hospitals routinely settle bills for less than the list price.",
          "Uninsured patients and those in financial hardship have the most leverage. But even insured patients with high deductibles can often negotiate the out-of-pocket portion. The key is knowing what to ask for and who to ask.",
        ],
      },
      {
        h2: "Before You Call: Do Your Research",
        paragraphs: [
          "Know the Medicare rate for your procedure. Medicare rates are the standard benchmark for \"fair\" pricing — they're public, and hospitals accept them as full payment for Medicare patients. Look up the CPT codes on your bill and find the Medicare rate for your area.",
          "Check the hospital's online price list (required by federal law since 2021). Find your procedure and note the \"cash price\" or \"self-pay discount\" — this is often already lower than your chargemaster rate.",
          "Know your household income and family size. If you're under 400% of the federal poverty level, you likely qualify for significant financial assistance. Even at higher incomes, many hospitals will negotiate.",
        ],
        cta: { label: "Look Up Fair Prices for Your Procedures", href: "/?tab=cpt" },
      },
      {
        h2: "Who to Call",
        paragraphs: [
          "Don't call the general billing number — ask specifically to speak with a financial counselor or financial assistance coordinator. This person has actual authority to offer discounts, payment plans, and charity care applications.",
          "If you can't get traction with the financial counselor, ask for the billing manager. For large bills, the hospital's CFO office sometimes handles high-dollar negotiations directly.",
        ],
        tip: "The best time to negotiate is BEFORE you go to collections. Once a bill is with a collection agency, the hospital has already written it off and you lose direct negotiating leverage with the hospital.",
      },
      {
        h2: "Scripts That Work",
        paragraphs: [
          "For asking about financial assistance: \"I'm struggling to pay this bill and I'd like to apply for financial assistance. Can you walk me through your charity care or prompt-pay discount programs?\"",
          "For negotiating a lump-sum settlement: \"I can make a one-time payment of [X amount — aim for 20-40% of the bill] to settle this account today. Can you accept that as payment in full?\"",
          "For referencing Medicare rates: \"I looked up the Medicare reimbursement rate for these CPT codes in my area, and the total comes to [X]. Would you be willing to accept that as full payment?\"",
          "For uninsured patients: \"I don't have insurance. I understand you have a self-pay discount rate — what's the cash price for these services?\"",
          "If you're insured but have a high deductible: \"My insurance left me responsible for [X]. I'm facing financial hardship and I'd like to discuss a settlement or payment arrangement.\"",
        ],
        cta: { label: "Get a Custom Negotiation Script", href: "/?tab=negotiate", note: "Paste your bill and BillVeil generates scripts tailored to your situation." },
      },
      {
        h2: "Common Outcomes",
        bullets: [
          "Prompt-pay discount: 10-30% off if you pay within 30 days",
          "Charity care: 50-100% reduction if you meet income guidelines",
          "Sliding scale adjustment: Reduction based on your income, even without full charity care eligibility",
          "Lump-sum settlement: 40-60% off if you can pay a lump sum",
          "0% payment plan: No interest, no discount, but affordable monthly payments",
        ],
        paragraphs2: [
          "Get any agreement in writing before paying. Ask for a letter stating the settled amount and that it's payment in full. Keep that letter forever.",
        ],
      },
    ],
    faq: [
      { q: "Will negotiating hurt my credit?", a: "As long as the bill hasn't already been sent to collections, negotiating or setting up a payment plan has no negative credit impact. In fact, it prevents the bill from going to collections, which would hurt your credit." },
      { q: "What if I can't afford any amount right now?", a: "Apply for charity care first — you may qualify to have the bill eliminated entirely. If you don't qualify, ask for a $0/month payment plan while you apply. Hospitals cannot send accounts to collections while a financial assistance application is pending." },
      { q: "Do I need a medical billing advocate?", a: "For bills over $5,000, a medical billing advocate can be worth it. They typically take 25-35% of what they save you, so there's no upfront cost. They know the system and often negotiate better outcomes than patients calling on their own." },
      { q: "How low can I realistically negotiate?", a: "It varies widely. Uninsured patients who qualify for charity care sometimes get bills reduced 100%. Insured patients negotiating the out-of-pocket portion typically see 10-40% reductions. Lump-sum settlements on large bills can be 40-70% off the original amount." },
    ],
  },

  {
    slug: "what-is-hospital-charity-care",
    title: "What Is Hospital Charity Care? How to Apply and Get Your Bill Erased",
    metaTitle: "What Is Hospital Charity Care? How to Qualify and Apply",
    description: "Nonprofit hospitals are legally required to offer charity care. Learn what it is, who qualifies (hint: more people than you'd think), and exactly how to apply to get your bill reduced or eliminated.",
    date: "2025-02-14",
    readTime: "7 min read",
    category: "Financial Assistance",
    categoryColor: "#10b981",
    intro: "Millions of Americans are sitting on unpaid medical bills that could legally be reduced to zero — and they don't know it. Nonprofit hospitals (about 60% of US hospitals) are required by the IRS to provide financial assistance as a condition of their tax-exempt status. This program goes by many names — charity care, financial assistance, sliding scale discounts — but it can eliminate your bill entirely if you qualify.",
    relatedTools: [
      { label: "Find Charity Care Programs", href: "/?tab=charitycare" },
      { label: "Get a Payment Plan", href: "/?tab=paymentplan" },
      { label: "Check Patient Rights", href: "/?tab=patientrights" },
    ],
    sections: [
      {
        h2: "What Is Hospital Charity Care?",
        paragraphs: [
          "Charity care is a hospital program that reduces or eliminates medical bills for patients who can't afford to pay. Nonprofit hospitals are required to have these programs and to make them available. For-profit hospitals aren't required to offer charity care, but many have financial assistance programs anyway.",
          "The level of assistance varies by hospital. Some offer 100% forgiveness for patients below a certain income threshold; others offer sliding-scale discounts starting at very low income levels and phasing out at higher incomes.",
        ],
      },
      {
        h2: "Who Qualifies for Charity Care?",
        paragraphs: [
          "Income thresholds vary by hospital, but most nonprofit hospitals must provide free care to patients at or below 200% of the Federal Poverty Level (FPL). Many go further — 300% to 400% of FPL for partial assistance.",
          "In 2025, 200% FPL is approximately: $30,120 for a single person, $40,880 for a family of 2, $51,640 for a family of 3, $62,400 for a family of 4.",
          "Even above these thresholds, many hospitals offer sliding-scale discounts. A family earning 500% FPL might still qualify for a 20-30% reduction. It's always worth applying.",
        ],
        tip: "Income thresholds and discount levels are set by each hospital. Always ask what their specific financial assistance policy is — it must be publicly available by law.",
      },
      {
        h2: "How to Find Out If a Hospital Has Charity Care",
        bullets: [
          "Ask the billing department directly: \"Do you have a financial assistance or charity care program?\"",
          "Search the hospital's website for \"financial assistance\" or \"charity care\"",
          "For nonprofit hospitals, their financial assistance policy is public record — it's reported on IRS Form 990",
          "If you're already in collections, call the hospital directly (not the collector) and ask about assistance programs",
        ],
      },
      {
        h2: "How to Apply",
        paragraphs: [
          "Contact the hospital's financial counselor or patient financial services department. Ask for the financial assistance application and what documentation they need. Typical requirements include:",
        ],
        bullets: [
          "Recent tax return (usually last 1-2 years)",
          "Recent pay stubs (last 1-3 months)",
          "Bank statements (sometimes)",
          "Proof of any other income sources",
          "Government ID",
          "Proof of household size (for families)",
        ],
        paragraphs2: [
          "Submit everything they ask for. Incomplete applications are the #1 reason for denials. If you're self-employed or have irregular income, provide a self-certification of income — most hospitals will accept this.",
          "Important: Hospitals cannot send your bill to collections while a financial assistance application is pending. Submit the application as soon as you receive a bill you can't afford.",
        ],
        cta: { label: "Find Charity Care Programs Near You", href: "/?tab=charitycare" },
      },
      {
        h2: "What to Do If You're Denied",
        paragraphs: [
          "First, understand why. Ask for the specific reason in writing. Common issues: missing documentation, income calculation errors, or not meeting the income threshold.",
          "Appeal the decision in writing. If you believe your income was calculated incorrectly, submit a corrected statement with documentation. If extenuating circumstances exist (job loss, divorce, medical emergency), document those.",
          "Ask about other programs. Even if you don't qualify for full charity care, you may qualify for: a sliding-scale discount, a 0% interest payment plan, or a prompt-pay discount if you can pay a portion now.",
          "Contact your state attorney general if a nonprofit hospital refuses to provide information about financial assistance or denies you without clear justification. Nonprofit hospitals are legally obligated to offer these programs.",
        ],
      },
    ],
    faq: [
      { q: "Can I apply for charity care after a bill goes to collections?", a: "Yes. Call the hospital directly (not the collection agency) and ask about their financial assistance program. Even after a bill is sold to collections, most nonprofit hospitals will work with you on financial assistance, and they can recall the debt from the collector." },
      { q: "Does charity care affect my credit?", a: "Applying for charity care does not affect your credit. If your application is approved and the bill is forgiven, that's the end of it. If you're approved while the bill is in collections, the collection account should be removed." },
      { q: "What's the difference between charity care and writing off a bad debt?", a: "Charity care is proactive — the hospital reduces or eliminates your bill because you qualify based on income. Bad debt is reactive — the hospital writes off a bill they couldn't collect. Charity care is better for you because it won't show on your credit as a collection." },
      { q: "I make a decent income but had an unexpected huge bill. Do I still qualify?", a: "Possibly. Many hospitals consider \"catastrophic\" bills relative to income, not just absolute income levels. A $100,000 bill on a $70,000 salary may still qualify for significant assistance even if your income is above standard thresholds. Ask the financial counselor specifically about hardship assistance." },
    ],
  },

  {
    slug: "cobra-vs-marketplace-insurance",
    title: "COBRA vs Marketplace Insurance: Which Is Cheaper in 2025?",
    metaTitle: "COBRA vs ACA Marketplace Insurance — Which Should You Choose?",
    description: "Just lost your job? You have 60 days to choose between COBRA and ACA marketplace coverage. Here's exactly how to compare costs and which one saves you more money.",
    date: "2025-02-21",
    readTime: "8 min read",
    category: "Insurance Decisions",
    categoryColor: "#f97316",
    intro: "Losing job-based health insurance is stressful. Then you get the COBRA paperwork and the premium is $1,800/month for your family. Is that really your only option? No — you can also enroll in an ACA marketplace plan within 60 days. For most people, the marketplace is dramatically cheaper. But not always. Here's how to decide.",
    relatedTools: [
      { label: "COBRA vs ACA Calculator", href: "/?tab=cobra" },
      { label: "Find a Marketplace Plan", href: "/?tab=insurance" },
      { label: "Estimate Your Subsidy", href: "/?tab=insurance" },
    ],
    sections: [
      {
        h2: "What Is COBRA?",
        paragraphs: [
          "COBRA (Consolidated Omnibus Budget Reconciliation Act) lets you keep your employer's health insurance after leaving a job — but you pay the full premium yourself, including the portion your employer was paying.",
          "Most employers cover 70-85% of health insurance premiums for employees. When you take COBRA, you pay 100% plus a 2% administrative fee. That's why COBRA premiums are so shocking — you were only seeing a fraction of the real cost.",
          "COBRA lasts up to 18 months (36 months in some cases). You keep the exact same plan, doctors, and network you had before.",
        ],
      },
      {
        h2: "What Is the ACA Marketplace?",
        paragraphs: [
          "The ACA Marketplace (healthcare.gov or your state exchange) is where you buy individual health insurance. Plans are sold by private insurers but must meet ACA minimum standards.",
          "The big advantage: if your income is below 400% of the federal poverty level — or in some states, any income — you likely qualify for Premium Tax Credits (subsidies) that significantly reduce your monthly premium. At lower incomes, you may pay $0-100/month for real coverage.",
          "The 60-day window after losing job-based coverage is a Special Enrollment Period, so you can enroll any time (you don't have to wait for Open Enrollment in November).",
        ],
        tip: "If you lost your job and expect a significantly lower income this year, your subsidy calculation is based on your projected income for the whole year — not just what you earned so far. This can mean much larger subsidies than you'd expect.",
      },
      {
        h2: "The Real Cost Comparison",
        paragraphs: [
          "To compare fairly, you need to look beyond the monthly premium. Calculate your total annual cost under each option:",
        ],
        bullets: [
          "Annual premium (premium × 12)",
          "Your expected deductible spend (based on typical healthcare use)",
          "Your expected copay and coinsurance spend",
          "Maximum out-of-pocket exposure (worst case)",
        ],
        paragraphs2: [
          "COBRA wins when: you have ongoing care with specific doctors, you're close to meeting your deductible on your current plan, or you expect significant medical expenses where your existing network matters.",
          "Marketplace wins when: you're healthy and low-utilization, your income qualifies you for subsidies, you don't have ongoing specialist relationships, or you need coverage for more than a few months.",
        ],
        cta: { label: "Calculate COBRA vs Marketplace Side-by-Side", href: "/?tab=cobra", note: "BillVeil calculates your exact break-even point." },
      },
      {
        h2: "Subsidy Estimator (2025 FPL Levels)",
        paragraphs: [
          "Your eligibility for Premium Tax Credits depends on your household income relative to the Federal Poverty Level. In 2025:",
        ],
        bullets: [
          "Below 150% FPL (~$22,590 single): $0/month premium on benchmark plan",
          "150-200% FPL (~$22,590-$30,120 single): Very low premiums, often under $50/month",
          "200-300% FPL (~$30,120-$45,180 single): Moderate subsidies, often 50-70% reduction",
          "300-400% FPL (~$45,180-$60,240 single): Some subsidy, still significant savings over unsubsidized",
          "Above 400% FPL: May still qualify for subsidies in some states; marketplace plan is still usually cheaper than COBRA",
        ],
      },
      {
        h2: "Special Cases: When COBRA Is Better",
        paragraphs: [
          "Mid-year deductible met: If you've already paid $3,000 toward a $3,000 deductible, staying on COBRA means the rest of the year is mostly covered. Switching to marketplace resets your deductible.",
          "Ongoing specialist care: If you're mid-treatment with an out-of-network or hard-to-match specialist, disrupting that relationship can cost more than COBRA's premium difference.",
          "Spouse's qualifying events: Some domestic partner situations have timing complexities — a benefits consultant can help.",
          "Short coverage gap: If you'll have new employer coverage in 1-2 months, COBRA's higher cost may be worth the continuity.",
        ],
      },
      {
        h2: "The 60-Day Decision Window",
        paragraphs: [
          "You have exactly 60 days from losing your employer coverage to elect COBRA or enroll in a marketplace plan. Missing this window means going uninsured until the next Open Enrollment period (November-January).",
          "You don't have to choose immediately. You can wait up to 60 days and then elect COBRA retroactively to cover any services you had during the gap. But marketplace enrollment is not retroactive — coverage starts the 1st of the month after you enroll.",
          "One strategy: enroll in the marketplace immediately. If a major health event happens in the first 60 days, you can still elect COBRA retroactively. If nothing happens, you stay on the marketplace plan.",
        ],
      },
    ],
    faq: [
      { q: "What if I can't afford COBRA or marketplace premiums?", a: "If you've lost income, Medicaid may be an option — eligibility is based on current income and enrolls year-round. Check healthcare.gov or your state's Medicaid office. At very low incomes, Medicaid is free." },
      { q: "Can I switch from COBRA to marketplace mid-year?", a: "COBRA exhaustion (running out of COBRA coverage) is a qualifying life event that lets you enroll in the marketplace. But voluntarily canceling COBRA mid-year is not a qualifying event. So if you elect COBRA, you're generally committed until you lose it." },
      { q: "Are COBRA premiums tax deductible?", a: "COBRA premiums are deductible as medical expenses if you itemize deductions and your total medical expenses exceed 7.5% of your AGI. ACA marketplace premiums may also be deductible, and the Premium Tax Credit reduces them further." },
      { q: "What happens to my HSA if I take COBRA?", a: "Your HSA stays with you and you can continue to use it for eligible expenses. You cannot make new HSA contributions while on COBRA (you need to be enrolled in an HSA-eligible high-deductible health plan to contribute). If your COBRA plan is an HDHP, you can keep contributing." },
    ],
  },
];

export function getPostBySlug(slug) {
  return blogPosts.find(p => p.slug === slug) || null;
}
