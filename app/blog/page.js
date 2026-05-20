import BlogIndex from "../../src/BlogIndex";

export const metadata = {
  title: "Medical Billing Guides — Free Resources",
  description: "Plain-language guides on disputing medical bills, appealing insurance denials, negotiating hospital bills, and understanding your coverage. Free.",
  openGraph: {
    title: "Medical Billing Guides — BillVeil",
    description: "Step-by-step guides to fighting medical bills, insurance denials, and overcharges. Free from BillVeil.",
    url: "https://billveil.com/blog",
  },
  alternates: { canonical: "https://billveil.com/blog" },
};

export default function BlogPage() {
  return <BlogIndex />;
}
