import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "../../../src/blogPosts";
import BlogPost from "../../../src/BlogPost";

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `https://billveil.com/blog/${post.slug}`,
      publishedTime: post.date,
      authors: ["BillVeil"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.description,
    },
    alternates: { canonical: `https://billveil.com/blog/${post.slug}` },
  };
}

export default function BlogPostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  return <BlogPost post={post} />;
}
