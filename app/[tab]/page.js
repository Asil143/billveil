import AppShell from "../../src/AppShell";

const TOOL_META = {
  analyzer:      { title: "Bill Analyzer", desc: "Paste any medical bill or CPT code. AI spots overcharges and tells you exactly what to dispute." },
  services:      { title: "All 44 Tools", desc: "Browse all 44 free medical billing tools — dispute letters, drug prices, insurance help, and more." },
  dispute:       { title: "Dispute Letter Generator", desc: "Generate a professional medical bill dispute letter in seconds. Fight overcharges with the right language." },
  drug:          { title: "Drug Price Comparator", desc: "Compare prescription drug prices across pharmacies. Find the cheapest option near you." },
  denial:        { title: "Insurance Denial Fighter", desc: "AI-powered appeal letters for insurance denials. 73% of external appeals succeed — fight back." },
  negotiate:     { title: "Negotiation Script Generator", desc: "Get a word-for-word script to negotiate your hospital bill down. Hospitals routinely discount 20-60%." },
  eob:           { title: "EOB Explainer", desc: "Decode your Explanation of Benefits in plain English. Understand every line item and what you actually owe." },
  priorauth:     { title: "Prior Authorization Helper", desc: "Navigate prior authorization requirements. Get the documentation you need to win approval." },
  debtrights:    { title: "Medical Debt Rights Checker", desc: "Know your rights under the FDCPA and HIPAA. Stop illegal debt collection practices." },
  secondopinion: { title: "Second Opinion Finder", desc: "Find top specialists for a second medical opinion. Get the right diagnosis before expensive treatment." },
  genericdrug:   { title: "Generic Drug Finder", desc: "Find FDA-approved generic alternatives to brand-name drugs. Save up to 80% on prescriptions." },
  insplan:       { title: "Insurance Plan Decoder", desc: "Decode your health insurance plan in plain English. Understand deductibles, copays, and out-of-pocket maxes." },
  surprisebill:  { title: "Surprise Billing Checker", desc: "Check if your bill violates the No Surprises Act. Get up to $10,000 in protections for surprise bills." },
  itemization:   { title: "Itemization Request Letter", desc: "Request an itemized hospital bill. Find the exact charges to dispute." },
  charitycare:   { title: "Charity Care Finder", desc: "Find hospital charity care programs that could eliminate your medical debt entirely." },
  paymentplan:   { title: "Payment Plan Negotiator", desc: "Negotiate a 0% interest payment plan for your medical bills. Most hospitals offer these but won't advertise them." },
  creditcard:    { title: "Medical Credit Card Warning", desc: "Understand the risks of CareCredit and medical credit cards before signing up." },
  hsafsa:        { title: "HSA/FSA Optimizer", desc: "Maximize your HSA and FSA benefits. Get the most tax-free dollars for medical expenses." },
  providercheck: { title: "Provider Network Checker", desc: "Verify if your doctor or hospital is in-network before your appointment." },
  costestimate:  { title: "Pre-Treatment Cost Estimator", desc: "Get a cost estimate before any medical procedure. Compare prices and avoid surprise bills." },
  billscan:      { title: "AI Bill Scanner", desc: "Take a photo of your medical bill. AI extracts and analyzes every charge automatically." },
  casetracker:   { title: "Case Tracker", desc: "Track your medical billing disputes, appeals, and negotiations in one place." },
  savings:       { title: "Savings Dashboard", desc: "Track how much you've saved with BillVeil tools. See your total medical bill reductions." },
  concierge:     { title: "AI Billing Concierge", desc: "Ask anything about your medical bill. AI answers in plain language and guides you to the right tool." },
  planoptimizer: { title: "Insurance Plan Optimizer", desc: "Compare health insurance plans and find the best coverage for your situation." },
  hospitalprice: { title: "Hospital Price Lookup", desc: "Look up real hospital prices under federal price transparency rules. Know before you go." },
  priceboard:    { title: "Community Price Board", desc: "See what others paid for the same procedures. Real prices from real patients." },
  hub:           { title: "My Financial Hub", desc: "Your personal medical finance dashboard. Track spending, savings, and coverage in one place." },
  insurance:     { title: "Insurance Finder", desc: "Find the right health insurance plan. Compare ACA marketplace options, subsidies, and eligibility." },
  profile:       { title: "My Profile", desc: "Manage your BillVeil account, credits, and preferences." },
  cobra:         { title: "COBRA Calculator", desc: "Calculate your COBRA insurance costs and compare to marketplace alternatives." },
  cptlookup:     { title: "CPT Code Lookup", desc: "Look up any CPT medical billing code. Understand what you were charged for and if the price is fair." },
  preventive:    { title: "Preventive Care Checker", desc: "Find out which preventive services are free under your insurance. No cost-sharing required by law." },
  erurgent:      { title: "ER vs. Urgent Care Guide", desc: "Decide between the ER and urgent care. Avoid a $3,000 ER visit for something a $150 urgent care handles." },
  patientrights: { title: "Patient Rights Guide", desc: "Know your patient rights. From billing disputes to HIPAA to the No Surprises Act." },
  hipaa:         { title: "HIPAA Rights Guide", desc: "Understand your HIPAA privacy rights. Request, correct, and control your medical records." },
  mentalparity:  { title: "Mental Health Parity Checker", desc: "Check if your insurer is violating mental health parity laws. Get the coverage you're entitled to." },
  medtax:        { title: "Medical Tax Deduction Calculator", desc: "Calculate your medical expense tax deductions. Maximize your refund with every eligible expense." },
  fsatracker:    { title: "FSA Expense Tracker", desc: "Track your FSA spending and eligible expenses. Never lose tax-free healthcare dollars again." },
  medicare:      { title: "Medicare Navigator", desc: "Navigate Medicare Parts A, B, C, and D. Find the right coverage and avoid enrollment penalties." },
  veterans:      { title: "Veterans Benefits Guide", desc: "Explore VA healthcare benefits, disability compensation, and medical cost coverage for veterans." },
  chronicdisease:{ title: "Chronic Disease Cost Planner", desc: "Plan and manage long-term costs for chronic conditions like diabetes, heart disease, and cancer." },
  glossary:      { title: "Medical Billing Glossary", desc: "Plain-English definitions for every medical billing term. Understand your bills without a dictionary." },
  hospitalquality:{ title: "Hospital Quality Checker", desc: "Compare hospital safety ratings, infection rates, and patient outcomes before choosing where to go." },
};

export async function generateMetadata({ params }) {
  const { tab } = await params;
  const meta = TOOL_META[tab];
  if (!meta) return { title: "BillVeil" };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: { canonical: `https://billveil.com/${tab}` },
    openGraph: {
      title: `${meta.title} — BillVeil`,
      description: meta.desc,
      url: `https://billveil.com/${tab}`,
    },
  };
}

export default function TabPage() {
  return <AppShell />;
}
