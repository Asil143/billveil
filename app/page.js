import Landing from "../src/Landing";

export const metadata = {
  title: "BillVeil — See Through Every Medical Bill",
  description: "AI-powered tool to analyze medical bills, expose overcharges, and fight insurance denials. Free. No signup required.",
  alternates: { canonical: "https://billveil.com" },
};

export default function HomePage() {
  return <Landing />;
}
