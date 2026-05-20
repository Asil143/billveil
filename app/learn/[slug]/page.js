import { stories } from "../../../src/learnStories";
import LearnStory from "../../../src/LearnStory";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return stories
    .filter(s => s.status === "live")
    .map(s => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const story = stories.find(s => s.slug === params.slug);
  if (!story) return {};
  return {
    title: `Case File: ${story.title}`,
    description: `${story.hook} An illustrative billing scenario showing how to use BillVeil's ${story.toolLabel}.`,
  };
}

export default function StoryPage({ params }) {
  const story = stories.find(s => s.slug === params.slug);
  if (!story || story.status !== "live") notFound();
  return <LearnStory story={story} />;
}
