import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "../src/AuthContext";
import FloatingChat from "../src/FloatingChat";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  metadataBase: new URL("https://billveil.com"),
  title: {
    default: "BillVeil — See Through Every Medical Bill",
    template: "%s — BillVeil",
  },
  description: "AI-powered tool to analyze medical bills, expose overcharges, and fight insurance denials. Free. No signup required.",
  keywords: ["medical bill", "hospital bill overcharge", "insurance denial", "CPT codes", "medical billing advocate", "dispute medical bill"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "BillVeil",
    title: "BillVeil — See Through Every Medical Bill",
    description: "Paste your medical bill. AI spots overcharges and tells you exactly how to fight back. Free. No signup required.",
    url: "https://billveil.com",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "BillVeil — AI-powered medical bill transparency. 44 free tools to fight overcharges." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@billveil",
    creator: "@billveil",
    title: "BillVeil — See Through Every Medical Bill",
    description: "AI spots overcharges in your medical bill and tells you exactly how to fight back. 44 free tools. No signup.",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://billveil.com/#website",
      "url": "https://billveil.com",
      "name": "BillVeil",
      "description": "AI-powered medical billing transparency tools — free for every American.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://billveil.com/?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://billveil.com/#webapp",
      "name": "BillVeil",
      "url": "https://billveil.com",
      "description": "44 AI-powered tools to understand, fight, and reduce medical bills. Free. No signup required.",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#060912" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <FloatingChat />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
