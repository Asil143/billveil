export default function manifest() {
  return {
    name: "BillVeil — Medical Bill Transparency",
    short_name: "BillVeil",
    description: "44 free AI tools to fight medical billing. Find overcharges, appeal denials, reduce drug costs.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050810",
    theme_color: "#10b981",
    categories: ["health", "finance", "medical"],
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
      {
        src: "/logo192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Analyze My Bill",
        short_name: "Analyze",
        description: "Paste a medical bill and find overcharges instantly",
        url: "/analyzer",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Fight a Denial",
        short_name: "Appeal",
        description: "AI writes your insurance appeal letter",
        url: "/denial",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Find Charity Care",
        short_name: "Charity",
        description: "Find programs that can erase your bill",
        url: "/charitycare",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
    ],
  };
}
