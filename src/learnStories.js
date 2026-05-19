export const stories = [

  // ─── LIVE STORIES ────────────────────────────────────────────────────────────

  {
    slug: "surprise-billing",
    status: "live",
    emoji: "🚨",
    color: "#f87171",
    category: "Bills & Charges",
    character: { name: "Asil", age: 28, role: "Software Engineer" },
    title: "The $2,500 Bill From a Doctor Asil Never Met",
    hook: "He chose an in-network hospital. His bill was anything but.",
    tool: "surprisebill",
    toolLabel: "Surprise Billing Checker",
    savingsTag: "Saved $2,350",
    tags: ["ER Visit", "Out-of-Network", "No Surprises Act"],
    story: {
      scene: {
        heading: "The bill arrives",
        body: [
          "Asil, 28, woke up one morning with the worst headache of his life — the kind that makes you afraid. He drove to the nearest hospital, an in-network facility under his Cigna plan, and spent four hours in the ER. Tests came back fine. Migraine. He went home relieved.",
          "Three weeks later, a $2,500 bill arrived from \"Southwest Anesthesia Group.\" He had never met an anesthesiologist. He hadn't had surgery. He didn't even know anesthesiologists were involved in migraine treatment.",
        ],
      },
      confusion: {
        heading: "Wait — what is this charge?",
        body: [
          "Asil's first instinct was panic. Then anger. He had specifically chosen an in-network hospital. He had paid his $150 ER copay. The explanation of benefits said his insurer covered the visit.",
          "\"I chose a hospital. I didn't choose any individual doctor. How is it my fault that whoever happened to walk into my room is out-of-network?\"",
        ],
      },
      education: {
        heading: "What is surprise billing?",
        body: [
          "Surprise billing happens when a provider inside an in-network facility — an anesthesiologist, radiologist, ER physician, or surgical assistant — is personally out-of-network, even though the hospital itself is in-network. You never chose them. You never consented to their rates. They were just there.",
          "For decades, hospitals got away with this. Then Congress passed the No Surprises Act in 2022. Under the NSA, out-of-network providers at in-network facilities cannot bill you more than your in-network cost-sharing for ER and most facility-based care. The $2,500 bill was a federal law violation.",
        ],
      },
      steps: {
        heading: "How Asil fought back",
        items: [
          "He opened BillVeil's Surprise Billing Checker and described his situation: ER visit, in-network hospital, separate bill from an anesthesiologist he never chose.",
          "The tool confirmed: this is a No Surprises Act violation. He was legally owed protection.",
          "He got a dispute letter citing the specific NSA provision, addressed to Southwest Anesthesia Group with a CC to his insurer.",
          "He also filed a complaint at the federal No Surprises Help Desk (1-800-985-3059) — a step most people skip.",
          "He sent everything via certified mail and kept a copy of every document.",
        ],
      },
      outcome: {
        heading: "The result",
        body: "Six weeks after sending the dispute, Southwest Anesthesia Group withdrew the $2,500 bill entirely. Asil paid only his in-network ER copay: $150. He had no idea he had federal law on his side until he checked.",
        highlight: "$2,350 saved",
      },
    },
  },

  {
    slug: "denied-claim-appeal",
    status: "live",
    emoji: "⚔️",
    color: "#60a5fa",
    category: "Insurance",
    character: { name: "Maria", age: 52, role: "High School Teacher" },
    title: "Maria's MRI Was \"Not Medically Necessary\" — Her Doctor Disagreed",
    hook: "Insurance denied her claim. She appealed. She won.",
    tool: "denial",
    toolLabel: "Denial Fighter",
    savingsTag: "Saved $2,800",
    tags: ["Claim Denial", "Appeal", "MRI"],
    story: {
      scene: {
        heading: "The denial letter",
        body: [
          "Maria, 52, had been dealing with chronic lower back pain for eight months. Her doctor ordered an MRI to check for a herniated disc. Two weeks later, an EOB arrived: her insurance had denied the claim. \"Service not medically necessary.\" No MRI. No explanation beyond four words.",
          "Her doctor was furious. He had documented eight months of treatment, failed physical therapy, and worsening symptoms. None of that seemed to matter.",
        ],
      },
      confusion: {
        heading: "Can an insurance company really overrule my doctor?",
        body: [
          "\"My doctor has treated me for eight months. He went to medical school. He examined me. How can an insurance company — who has never met me — decide what I medically need?\"",
          "Maria almost just accepted it. She figured insurance companies always win. Most people do.",
        ],
      },
      education: {
        heading: "What 'not medically necessary' really means",
        body: [
          "\"Not medically necessary\" is the most common claim denial reason — and it's frequently wrong or improperly applied. Insurers use it to cut costs, often automatically, without a physician ever reviewing your specific case.",
          "What most people don't know: you have a legal right to appeal every denial. There are two levels. An internal appeal asks the same insurer to review its decision. An external appeal goes to an independent third party — not affiliated with the insurer — who makes a binding final decision. Under the ACA, insurers must respond to urgent internal appeals within 72 hours.",
        ],
      },
      steps: {
        heading: "How Maria fought back",
        items: [
          "Maria used BillVeil's Denial Fighter and entered her denial reason and procedure.",
          "She got a customized appeal letter citing her insurer's own published medical necessity criteria for MRI — criteria her situation clearly met.",
          "Her doctor added a supporting letter documenting eight months of failed conservative treatment.",
          "She filed the internal appeal with both documents. The insurer had 30 days to respond.",
          "They approved it on day 18.",
        ],
      },
      outcome: {
        heading: "The result",
        body: "MRI approved. Maria had her scan within the week — it confirmed a herniated disc at L4-L5, which changed her treatment plan entirely. The appeal letter took 25 minutes to write with BillVeil's help.",
        highlight: "$2,800 saved",
      },
    },
  },

  {
    slug: "negotiate-hospital-bill",
    status: "live",
    emoji: "💬",
    color: "#34d399",
    category: "Bills & Charges",
    character: { name: "David", age: 34, role: "Freelance Designer" },
    title: "David Got a $14,200 ER Bill With $800 in His Account",
    hook: "Uninsured. Appendicitis. He paid $1,900.",
    tool: "negotiate",
    toolLabel: "Negotiation Script",
    savingsTag: "Saved $12,300",
    tags: ["Uninsured", "Hospital Bill", "Negotiation", "Charity Care"],
    story: {
      scene: {
        heading: "Emergency at 2am",
        body: [
          "David, 34, a freelance graphic designer, went to the ER at 2am with severe abdominal pain. Appendicitis. Emergency surgery. Two days in the hospital. When he was discharged, he felt physically better — until the bill arrived: $14,200.",
          "He was uninsured. He had $800 in his checking account. He stared at the bill for a long time.",
        ],
      },
      confusion: {
        heading: "Is this number even real?",
        body: [
          "\"I can't pay $14,200. But if I ignore it, won't they send it to collections and destroy my credit? Can I negotiate with a hospital like a normal person? Or is the number just... fixed?\"",
          "David assumed hospital bills were non-negotiable facts of life, like taxes. He was wrong.",
        ],
      },
      education: {
        heading: "Hospital bills are not real prices",
        body: [
          "Hospitals generate bills from what's called the \"chargemaster\" — an internal price list with markups of 3x to 10x the actual cost of care. Insurance companies negotiate these down automatically. Uninsured patients, who have no one negotiating for them, get handed the full inflated number.",
          "Most non-profit hospitals — roughly 60% of all US hospitals — are legally required under the ACA to have Financial Assistance Programs (charity care) for patients below certain income thresholds. The hospital is required to have this policy publicly posted, but almost never tells patients about it at discharge.",
        ],
      },
      steps: {
        heading: "How David negotiated",
        items: [
          "He used BillVeil's Negotiation Script, describing his situation: uninsured, $14,200 bill, freelance income of about $38,000/year.",
          "The script told him to call the hospital's financial counselor directly — not the main billing hotline.",
          "He asked specifically about their Financial Assistance Program. At 200% FPL for a single person, he qualified for 80% reduction.",
          "He applied for charity care with 3 documents: last year's tax return, two months of bank statements, and a hardship letter from the script.",
          "His charity care application reduced the bill to $2,840. He then negotiated the remaining balance down with a lump-sum offer.",
          "The hospital accepted $1,900 with a zero-interest payment plan.",
        ],
      },
      outcome: {
        heading: "The result",
        body: "$14,200 became $1,900. David pays $100 per month with no interest. The phone call took 40 minutes. The application took one afternoon. Total savings: $12,300.",
        highlight: "$12,300 saved",
      },
    },
  },

  {
    slug: "eob-explained",
    status: "live",
    emoji: "📄",
    color: "#a78bfa",
    category: "Insurance",
    character: { name: "Sarah", age: 41, role: "Marketing Manager" },
    title: "Sarah's EOB Said One Thing. The Hospital Billed Another.",
    hook: "She was being overcharged by $490. She didn't know until she looked.",
    tool: "eob",
    toolLabel: "EOB Explainer",
    savingsTag: "Saved $490",
    tags: ["EOB", "Billing Error", "Knee Surgery"],
    story: {
      scene: {
        heading: "A document that made no sense",
        body: [
          "Sarah, 41, had knee surgery. It went well. Then came a document in the mail: the Explanation of Benefits. It showed four numbers that didn't add up to anything she understood: Billed $11,400 | Plan Paid $4,200 | Adjustment $5,800 | Your Responsibility $1,400.",
          "Then a separate bill arrived from the hospital for $1,890. Which number was right? What was she actually supposed to pay?",
        ],
      },
      confusion: {
        heading: "Why does it say $11,400 if I owe $1,400?",
        body: [
          "\"What does 'adjustment' even mean? If the hospital billed $11,400, did they expect anyone to actually pay that? And why is their bill to me $490 more than what my EOB says I owe?\"",
          "Sarah had good insurance. She wasn't in financial trouble. She was just completely in the dark about how any of this worked.",
        ],
      },
      education: {
        heading: "An EOB is not a bill",
        body: [
          "An Explanation of Benefits is a summary of how your insurance processed a claim — not a request for payment. The \"billed amount\" is the hospital's fictional list price; no one pays this. The \"adjustment\" is the negotiated discount your insurer locked in — money that simply disappears. \"Plan paid\" is what your insurer covered. \"Your responsibility\" is your actual out-of-pocket.",
          "The critical rule: if the hospital sends you a bill for more than your EOB's \"your responsibility\" amount, they are billing you in error. You do not owe the difference. This happens more often than hospitals will admit.",
        ],
      },
      steps: {
        heading: "What Sarah did",
        items: [
          "She used BillVeil's EOB Explainer and pasted the key lines from her EOB.",
          "The tool broke down each number in plain English and flagged the discrepancy: her EOB showed $1,400 owed; the hospital was billing $1,890.",
          "She called the hospital billing department and said specifically: \"My Explanation of Benefits shows my patient responsibility as $1,400. Your bill shows $1,890. Can you explain the $490 difference?\"",
          "There was a pause. Then: \"Let me look into that.\" They corrected it within the same call.",
        ],
      },
      outcome: {
        heading: "The result",
        body: "Sarah paid $1,400 — her actual responsibility per her EOB. Not the $1,890 the hospital had initially demanded. The correction took a 12-minute phone call. She also finally understands what an EOB is.",
        highlight: "$490 saved",
      },
    },
  },

  {
    slug: "medical-debt-collectors",
    status: "live",
    emoji: "📞",
    color: "#fb923c",
    category: "Debt & Rights",
    character: { name: "Carlos", age: 29, role: "Gig Economy Driver" },
    title: "Collections Called Carlos. He Didn't Know He Had Rights.",
    hook: "A $3,200 ER debt. Collectors threatening his credit. He settled for $1,200.",
    tool: "debtrights",
    toolLabel: "Debt Rights Checker",
    savingsTag: "Saved $2,000",
    tags: ["Medical Debt", "Collections", "FDCPA", "Settlement"],
    story: {
      scene: {
        heading: "The calls start",
        body: [
          "Carlos, 29, broke his arm in a fall and went to the ER. The $3,200 bill arrived, and he kept putting it aside. Six months later, a debt collector called: \"This is Alliance Medical Collections. You owe $3,200. If you don't pay today, we will report this to all three credit bureaus.\"",
          "Carlos panicked. He answered one call and agreed to a $300 payment he couldn't afford, hoping it would make them stop.",
        ],
      },
      confusion: {
        heading: "Do I have any rights at all?",
        body: [
          "\"If I don't pay the full $3,200, will this ruin my credit forever? Can they actually sue me over a medical bill? I feel like I have no options — just pay or be destroyed.\"",
          "Carlos didn't know that medical debt has special rules — or that collectors have legal limits on what they can do and say.",
        ],
      },
      education: {
        heading: "Medical debt collectors have strict legal limits",
        body: [
          "Under the Fair Debt Collection Practices Act (FDCPA), collectors cannot: threaten actions they can't take, call before 8am or after 9pm, lie about the amount owed, or report a debt to credit bureaus without proper notice. As of 2023, medical debts under $500 cannot be reported to credit bureaus at all — and debts over $500 must be at least a year old before reporting.",
          "Every debt also has a statute of limitations — the window during which a collector can successfully sue you. After that window (usually 3-6 years depending on state), the debt is \"time-barred.\" They can still try to collect, but a court won't enforce it.",
        ],
      },
      steps: {
        heading: "What Carlos did",
        items: [
          "He used BillVeil's Debt Rights Checker. His $3,200 ER debt from 14 months ago: within the statute of limitations in his state (4 years), but the collectors had made threats they couldn't legally make.",
          "He got a Debt Validation Letter — a legal request demanding the collector prove the debt is his and the amount is accurate. Under the FDCPA, all collection activity must stop until they respond.",
          "He sent it via certified mail. The threatening calls stopped immediately.",
          "After validation, he made a settlement offer: $1,200 as a lump sum. He got the acceptance in writing before sending a single dollar.",
          "He paid $1,200. The debt was marked satisfied.",
        ],
      },
      outcome: {
        heading: "The result",
        body: "Carlos paid $1,200 on a $3,200 debt — 37 cents on the dollar. His credit score was unaffected. The key was knowing his rights before picking up the phone.",
        highlight: "$2,000 saved",
      },
    },
  },

  {
    slug: "charity-care",
    status: "live",
    emoji: "🤝",
    color: "#2dd4bf",
    category: "Assistance",
    character: { name: "Lisa", age: 38, role: "Home Health Aide" },
    title: "Lisa's $9,800 Hospital Bill Became $0. Nobody Told Her She Could Do This.",
    hook: "Federal law required the hospital to offer free care. They never mentioned it.",
    tool: "charitycare",
    toolLabel: "Charity Care Finder",
    savingsTag: "Saved $9,800",
    tags: ["Charity Care", "Financial Assistance", "ACA", "Low Income"],
    story: {
      scene: {
        heading: "A bill she couldn't think about",
        body: [
          "Lisa, 38, a single mother of two working part-time as a home health aide in Memphis, earned $28,000 a year. When her appendix ruptured, she had no choice — emergency surgery, three days in the hospital. When she was discharged, she was handed a $9,800 bill.",
          "She put it in a drawer. Every few weeks she'd look at it, feel the dread, and put it back. She had no savings. She didn't know what else to do.",
        ],
      },
      confusion: {
        heading: "Am I just supposed to go into medical debt?",
        body: [
          "\"I can't pay $9,800. But I don't want it sent to collections. I don't want to file bankruptcy. What options do I actually have? Is there any help for people like me, or is this just what happens?\"",
          "Lisa had no idea that the hospital was legally required to help her. Nobody told her.",
        ],
      },
      education: {
        heading: "Every non-profit hospital must offer charity care",
        body: [
          "Under the Affordable Care Act, every non-profit hospital — approximately 60% of all US hospitals — is required by federal law to maintain a Financial Assistance Program, commonly called charity care. These programs reduce or eliminate bills for patients who qualify based on income and family size.",
          "Most programs cover patients earning up to 200-400% of the Federal Poverty Level. For Lisa — a family of 3 earning $28,000/year — she was at 78% of the FPL. She would have qualified at virtually any hospital in the country. The hospital is legally required to post this policy. They are not required to tell you about it.",
        ],
      },
      steps: {
        heading: "What Lisa did",
        items: [
          "She found BillVeil's Charity Care Finder and entered her hospital name and annual income.",
          "The tool confirmed: her hospital had a charity care program with an income threshold of 300% FPL for her family size. She qualified easily.",
          "She got a checklist of required documents: two recent pay stubs, one month of bank statements, proof of household size.",
          "She called the hospital's financial counselor (not the billing department) and said: \"I'd like to apply for financial assistance.\" That's the phrase that opens the door.",
          "She applied within the hospital's 240-day billing window — a federal requirement that gives patients time to apply.",
          "Three weeks later, she received an approval letter.",
        ],
      },
      outcome: {
        heading: "The result",
        body: "$9,800 fully forgiven under charity care. Lisa owes nothing. She just needed someone to tell her this option existed. It has existed since 2010.",
        highlight: "$9,800 saved",
      },
    },
  },

  {
    slug: "generic-drug-savings",
    status: "live",
    emoji: "💊",
    color: "#38bdf8",
    category: "Drugs",
    character: { name: "Jennifer", age: 48, role: "Office Administrator" },
    title: "Jennifer Paid $340 a Month for a Drug With a $35 Equivalent",
    hook: "Her pharmacist said 'that's just what it costs.' It wasn't.",
    tool: "genericdrug",
    toolLabel: "Generic Drug Finder",
    savingsTag: "Saves $3,660/year",
    tags: ["Prescription Drugs", "Biosimilar", "Rheumatoid Arthritis", "Humira"],
    story: {
      scene: {
        heading: "The monthly shock at the pharmacy",
        body: [
          "Jennifer, 48, was diagnosed with rheumatoid arthritis two years ago. Her doctor prescribed Humira — a biologic injection that had become the standard of care for her condition. She picked it up at the pharmacy: $340 per month, even with insurance.",
          "Her plan had high cost-sharing for specialty drugs. Her pharmacist shrugged. \"That's just what biologics cost.\" Jennifer went home and started quietly budgeting around it.",
        ],
      },
      confusion: {
        heading: "Is $340 a month really just... my life now?",
        body: [
          "\"I need this medication. My doctor prescribed it. My insurance covers it, sort of. Is there any alternative, or do I just pay $4,080 a year forever?\"",
          "Jennifer had never heard the word \"biosimilar.\" She assumed brand-name biologics had no generic equivalent.",
        ],
      },
      education: {
        heading: "Biosimilars: the generics that nobody talks about",
        body: [
          "FDA-approved biosimilars are the biological equivalent of generic drugs — different manufacturer, same active ingredient, same clinical effect, dramatically lower price. As of 2024, Humira has more than a dozen FDA-approved biosimilars including Hadlima, Cyltezo, and Hyrimoz, priced 70-85% lower.",
          "Beyond biosimilars, most major drug manufacturers run Patient Assistance Programs for income-qualified patients that can reduce costs to zero. And prescription discount apps like GoodRx or Cost Plus can sometimes beat even insurance pricing for generics.",
        ],
      },
      steps: {
        heading: "What Jennifer did",
        items: [
          "She used BillVeil's Generic Drug Finder and entered: Humira 40mg, rheumatoid arthritis, her specific insurance plan.",
          "The tool returned 4 FDA-approved biosimilars, all clinically equivalent. Her plan covered Hadlima at a $35/month specialty tier.",
          "It also flagged AbbVie's myAbbVie Assist program — for income-qualified patients, Humira can cost $0/month through the manufacturer directly.",
          "She brought the biosimilar list to her rheumatologist at her next visit. Her doctor confirmed Hadlima was appropriate for her condition and wrote a new prescription.",
          "She switched at her next refill cycle.",
        ],
      },
      outcome: {
        heading: "The result",
        body: "$340/month became $35/month. Jennifer saves $3,660 every year — for the same therapeutic effect, from an FDA-approved medication her own doctor approved. It took one conversation and one new prescription.",
        highlight: "$3,660/year saved",
      },
    },
  },

  // ─── COMING SOON ─────────────────────────────────────────────────────────────

  { slug: "bill-analyzer", status: "coming-soon", emoji: "⚡", color: "#10b981", category: "Bills & Charges", character: { name: "Mark", age: 45, role: "Construction Foreman" }, title: "The 5-Minute Check That Found $1,100 in Overcharges on Mark's Lab Bill", hook: "He almost paid it without looking.", tool: "analyzer", toolLabel: "Bill Analyzer", tags: ["Lab Bill", "Overcharge", "CPT Codes"] },

  { slug: "bill-scan", status: "coming-soon", emoji: "📷", color: "#f59e0b", category: "Bills & Charges", character: { name: "Emma", age: 31, role: "Nurse" }, title: "Emma's Camera Caught a $600 Billing Error Her Eyes Missed", hook: "She knew bills had errors. She just didn't know how to find them.", tool: "billscan", toolLabel: "Bill Scanner", tags: ["Bill Scan", "Billing Error", "OCR"] },

  { slug: "dispute-letter", status: "coming-soon", emoji: "✉️", color: "#f87171", category: "Bills & Charges", character: { name: "Alex", age: 37, role: "Teacher" }, title: "The Letter That Got Alex's $3,800 Radiology Bill Cut in Half", hook: "One certified letter. Two weeks. $1,900 saved.", tool: "dispute", toolLabel: "Dispute Letter Generator", tags: ["Dispute", "Radiology", "Letter"] },

  { slug: "drug-comparator", status: "coming-soon", emoji: "🔬", color: "#a78bfa", category: "Drugs", character: { name: "Phil", age: 55, role: "Accountant" }, title: "Phil's Two Prescriptions Were Interacting — and He Was Overpaying for Both", hook: "His pharmacist never mentioned it. BillVeil did.", tool: "drug", toolLabel: "Drug Comparator", tags: ["Drug Interaction", "Prescription", "Cost Comparison"] },

  { slug: "prior-auth", status: "coming-soon", emoji: "⏳", color: "#60a5fa", category: "Insurance", character: { name: "Kevin", age: 42, role: "Warehouse Manager" }, title: "Kevin's Surgery Was Delayed 6 Weeks Because of Prior Authorization", hook: "He didn't know he could fight it — or how.", tool: "priorauth", toolLabel: "Prior Auth Helper", tags: ["Prior Authorization", "Surgery Delay", "Appeal"] },

  { slug: "insurance-plan-decoder", status: "coming-soon", emoji: "📋", color: "#34d399", category: "Insurance", character: { name: "Angela", age: 26, role: "Graphic Designer" }, title: "Angela Picked the Wrong Plan — Because Nobody Explained What the Words Meant", hook: "Deductible. Out-of-pocket max. Coinsurance. Finally explained.", tool: "insplan", toolLabel: "Insurance Plan Decoder", tags: ["Open Enrollment", "Deductible", "Coinsurance"] },

  { slug: "itemization-request", status: "coming-soon", emoji: "🔎", color: "#f87171", category: "Bills & Charges", character: { name: "Amy", age: 44, role: "HR Specialist" }, title: "Amy Found 8 Fake Line Items on Her Hospital Bill by Requesting One Document", hook: "Hospitals bill for items never delivered. Requesting the itemized bill reveals them.", tool: "itemization", toolLabel: "Itemization Request", tags: ["Hospital Bill", "Itemized Bill", "Billing Fraud"] },

  { slug: "payment-plan", status: "coming-soon", emoji: "📅", color: "#2dd4bf", category: "Bills & Charges", character: { name: "Ben", age: 33, role: "Restaurant Manager" }, title: "The Hospital Wanted $600/Month. Ben Got $150/Month With No Interest.", hook: "Most hospitals will negotiate payment plans. Most patients never ask.", tool: "paymentplan", toolLabel: "Payment Plan Negotiator", tags: ["Payment Plan", "Hospital Bill", "Negotiation"] },

  { slug: "medical-credit-card", status: "coming-soon", emoji: "💳", color: "#ef4444", category: "Debt & Rights", character: { name: "Linda", age: 39, role: "Salon Owner" }, title: "The Medical Credit Card Trap That Cost Linda $2,400 in Surprise Interest", hook: "She thought it was interest-free. It was deferred interest.", tool: "creditcard", toolLabel: "Medical Credit Card Warning", tags: ["CareCredit", "Deferred Interest", "Medical Debt"] },

  { slug: "hsa-fsa-optimizer", status: "coming-soon", emoji: "💰", color: "#10b981", category: "Insurance", character: { name: "Anna", age: 34, role: "Software Developer" }, title: "Anna's HSA Saved Her $1,400 in Taxes — Without Changing a Single Doctor", hook: "She had an HSA for two years and didn't know how to use it.", tool: "hsafsa", toolLabel: "HSA/FSA Optimizer", tags: ["HSA", "FSA", "Tax Savings"] },

  { slug: "provider-network", status: "coming-soon", emoji: "🏥", color: "#60a5fa", category: "Insurance", character: { name: "Mike", age: 48, role: "Sales Manager" }, title: "Mike's Favorite Doctor Was Out-of-Network — and It Cost Him $3,000", hook: "One phone call before the appointment would have changed everything.", tool: "providercheck", toolLabel: "Provider Network Checker", tags: ["In-Network", "Out-of-Network", "Provider Check"] },

  { slug: "cost-estimator", status: "coming-soon", emoji: "🧮", color: "#34d399", category: "Bills & Charges", character: { name: "Tom", age: 52, role: "Electrician" }, title: "Before His Knee Surgery, Tom Got Every Price in Writing", hook: "He called three hospitals. The prices ranged from $8,200 to $31,000.", tool: "costestimate", toolLabel: "Cost Estimator", tags: ["Price Transparency", "Surgery Cost", "Comparison"] },

  { slug: "case-tracker", status: "coming-soon", emoji: "📁", color: "#a78bfa", category: "Bills & Charges", character: { name: "Rebecca", age: 41, role: "Paralegal" }, title: "Rebecca Had 3 Open Disputes at Once. Organizing Them Won Her All Three.", hook: "Disputes die when you lose track of them. She didn't lose track.", tool: "casetracker", toolLabel: "Case Tracker", tags: ["Case Management", "Dispute Tracking", "Multiple Bills"] },

  { slug: "insurance-plan-optimizer", status: "coming-soon", emoji: "📊", color: "#f59e0b", category: "Insurance", character: { name: "Kevin", age: 38, role: "Nurse Practitioner" }, title: "Kevin Picked the Plan That Looked Cheapest — and Paid $4,200 Extra", hook: "A low premium is not the same as low cost.", tool: "planoptimizer", toolLabel: "Insurance Plan Optimizer", tags: ["Open Enrollment", "Plan Comparison", "Premiums"] },

  { slug: "hospital-price-lookup", status: "coming-soon", emoji: "🔍", color: "#38bdf8", category: "Bills & Charges", character: { name: "Dan", age: 61, role: "Retired Firefighter" }, title: "Dan Called 4 Hospitals Before His Hip Replacement. He Saved $8,000.", hook: "By law, every hospital must publish their prices. Almost nobody checks them.", tool: "hospitalprice", toolLabel: "Hospital Price Lookup", tags: ["Price Transparency", "Hospital Comparison", "Hip Replacement"] },

  { slug: "community-price-board", status: "coming-soon", emoji: "🌐", color: "#34d399", category: "Bills & Charges", character: { name: "Patricia", age: 47, role: "Dental Hygienist" }, title: "Patricia Checked the Community Board and Found She Was Paying 3x the Fair Price", hook: "Real people, real prices. What your neighbors actually paid.", tool: "priceboard", toolLabel: "Community Price Board", tags: ["Price Comparison", "Community", "MRI"] },

  { slug: "insurance-finder", status: "coming-soon", emoji: "🛡️", color: "#10b981", category: "Insurance", character: { name: "Nicole", age: 29, role: "Barista" }, title: "After Losing Her Job, Nicole Found $180/Month Coverage in 48 Hours", hook: "COBRA wasn't her only option. She just didn't know the others existed.", tool: "insurance", toolLabel: "Insurance Finder", tags: ["Marketplace", "COBRA", "Job Loss", "ACA"] },

  { slug: "cobra-calculator", status: "coming-soon", emoji: "📉", color: "#f87171", category: "Insurance", character: { name: "Jake", age: 35, role: "Marketing Director" }, title: "Jake Paid $780/Month for COBRA When Marketplace Coverage Was $220", hook: "He assumed COBRA was the safe choice. He was paying $6,720 too much.", tool: "cobra", toolLabel: "COBRA Calculator", tags: ["COBRA", "Job Loss", "Cost Comparison"] },

  { slug: "cpt-code-lookup", status: "coming-soon", emoji: "🔢", color: "#a78bfa", category: "Bills & Charges", character: { name: "Robert", age: 50, role: "High School Principal" }, title: "Robert's Bill Said CPT 99215 — $450. Was That Fair?", hook: "Every charge on your bill has a code. Every code has a fair price.", tool: "cptlookup", toolLabel: "CPT Code Lookup", tags: ["CPT Codes", "Office Visit", "Billing Codes"] },

  { slug: "preventive-care", status: "coming-soon", emoji: "🩺", color: "#2dd4bf", category: "Insurance", character: { name: "Sandra", age: 54, role: "Librarian" }, title: "The Free Screening Sandra Almost Skipped Found Her Pre-Cancer", hook: "Under the ACA, preventive care is 100% covered. Most people skip it anyway.", tool: "preventive", toolLabel: "Preventive Care Checker", tags: ["Preventive Care", "Free Screenings", "ACA", "Cancer"] },

  { slug: "er-vs-urgent-care", status: "coming-soon", emoji: "🚑", color: "#f87171", category: "Bills & Charges", character: { name: "Tom", age: 28, role: "College Student" }, title: "Tom's Sore Throat Cost $2,400 at the ER. Urgent Care Would Have Been $120.", hook: "The wrong door can cost you thousands.", tool: "erurgent", toolLabel: "ER vs Urgent Care Guide", tags: ["ER", "Urgent Care", "Cost Comparison"] },

  { slug: "patient-rights", status: "coming-soon", emoji: "📜", color: "#60a5fa", category: "Debt & Rights", character: { name: "Marcus", age: 44, role: "Truck Driver" }, title: "The Rights Every Patient Has — That Nobody Ever Tells You", hook: "You can dispute any bill. You can request any record. You have more power than you think.", tool: "patientrights", toolLabel: "Patient Rights Guide", tags: ["Patient Rights", "Billing", "Medical Records"] },

  { slug: "hipaa-rights", status: "coming-soon", emoji: "🔒", color: "#a78bfa", category: "Debt & Rights", character: { name: "Rachel", age: 36, role: "Teacher" }, title: "Rachel's Medical Records Were Shared With Her Employer. That Was Illegal.", hook: "HIPAA gives you rights most people don't know they have.", tool: "hipaa", toolLabel: "HIPAA Rights Guide", tags: ["HIPAA", "Privacy", "Medical Records"] },

  { slug: "mental-health-parity", status: "coming-soon", emoji: "🧠", color: "#60a5fa", category: "Insurance", character: { name: "Daniel", age: 31, role: "Engineer" }, title: "Daniel's Therapy Was Capped at 10 Sessions. His Physical Therapy Wasn't.", hook: "Federal law says mental health must be covered equally. His insurer was breaking it.", tool: "mentalparity", toolLabel: "Mental Health Parity Checker", tags: ["Mental Health", "Parity Law", "Insurance Denial"] },

  { slug: "medical-tax", status: "coming-soon", emoji: "🧾", color: "#34d399", category: "Assistance", character: { name: "John", age: 58, role: "Restaurant Owner" }, title: "The $2,800 Medical Tax Deduction John Almost Missed", hook: "If your medical expenses exceed 7.5% of income, you can deduct them. Most people never check.", tool: "medtax", toolLabel: "Medical Tax Calculator", tags: ["Tax Deduction", "Medical Expenses", "IRS"] },

  { slug: "fsa-tracker", status: "coming-soon", emoji: "⏰", color: "#f59e0b", category: "Insurance", character: { name: "Linda", age: 43, role: "Project Manager" }, title: "Linda Lost $800 in Unspent FSA Funds. The Year After, She Lost $0.", hook: "FSA money expires. Most people find out too late.", tool: "fsatracker", toolLabel: "FSA Tracker", tags: ["FSA", "Use It or Lose It", "Benefits"] },

  { slug: "medicare-navigator", status: "coming-soon", emoji: "👴", color: "#60a5fa", category: "Insurance", character: { name: "Dorothy", age: 65, role: "Retired Teacher" }, title: "Dorothy's First Year on Medicare: What Nobody Explained to Her", hook: "Parts A, B, C, D, Medigap — she turned 65 with no idea what any of it meant.", tool: "medicare", toolLabel: "Medicare Navigator", tags: ["Medicare", "Part D", "Enrollment", "Medigap"] },

  { slug: "veterans-benefits", status: "coming-soon", emoji: "🎖️", color: "#10b981", category: "Assistance", character: { name: "Marcus", age: 47, role: "Army Veteran" }, title: "Marcus Had Full VA Coverage for 10 Years — He Just Didn't Know It", hook: "Millions of veterans qualify for VA healthcare and never claim it.", tool: "veterans", toolLabel: "Veterans Benefits Guide", tags: ["VA Benefits", "Veterans", "Healthcare Coverage"] },

  { slug: "chronic-disease", status: "coming-soon", emoji: "💙", color: "#38bdf8", category: "Assistance", character: { name: "Rachel", age: 42, role: "Kindergarten Teacher" }, title: "How Rachel Manages Type 2 Diabetes Without Going Broke", hook: "Chronic illness doesn't have to mean chronic financial stress.", tool: "chronicdisease", toolLabel: "Chronic Disease Planner", tags: ["Diabetes", "Chronic Illness", "Long-Term Planning"] },

  { slug: "medical-glossary", status: "coming-soon", emoji: "📚", color: "#a78bfa", category: "Bills & Charges", character: { name: "Ben", age: 27, role: "First-Time Patient" }, title: "The Glossary That Made Ben's Hospital Bill Finally Make Sense", hook: "Deductible. Coinsurance. Allowed amount. It's a language. Here's the dictionary.", tool: "glossary", toolLabel: "Medical Glossary", tags: ["Medical Terms", "Glossary", "Education"] },

  { slug: "hospital-quality", status: "coming-soon", emoji: "⭐", color: "#f59e0b", category: "Bills & Charges", character: { name: "Christine", age: 63, role: "Retired Nurse" }, title: "What Christine Checked Before Trusting a Hospital With Her Heart Surgery", hook: "Not all hospitals are equal. The data is public. Almost nobody looks at it.", tool: "hospitalquality", toolLabel: "Hospital Quality Checker", tags: ["Hospital Quality", "Patient Safety", "Ratings"] },

  { slug: "second-opinion", status: "coming-soon", emoji: "🔄", color: "#34d399", category: "Insurance", character: { name: "Jessica", age: 39, role: "Yoga Instructor" }, title: "Jessica Was Told She Needed Back Surgery. A Second Opinion Said Otherwise.", hook: "The second doctor cost $200. The surgery would have cost her spine.", tool: "secondopinion", toolLabel: "Second Opinion Finder", tags: ["Second Opinion", "Surgery", "Back Pain"] },

  { slug: "savings-dashboard", status: "coming-soon", emoji: "📈", color: "#10b981", category: "Bills & Charges", character: { name: "Sophie", age: 35, role: "Dental Hygienist" }, title: "Sophie's BillVeil Dashboard: $8,400 Saved Across 6 Disputes in One Year", hook: "Tracking your wins makes the next fight easier.", tool: "savings", toolLabel: "Savings Dashboard", tags: ["Savings Tracking", "Dashboard", "Multiple Disputes"] },

  { slug: "concierge", status: "coming-soon", emoji: "🤖", color: "#a78bfa", category: "Bills & Charges", character: { name: "Ashley", age: 24, role: "Recent Graduate" }, title: "Ashley Had a $4,000 Bill and Had No Idea Where to Even Start", hook: "Sometimes you don't know which tool you need. The AI figures it out for you.", tool: "concierge", toolLabel: "AI Concierge", tags: ["AI", "Guidance", "First Time"] },

];
