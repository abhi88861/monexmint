import { blogPosts } from "@/data/blogPosts";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) return {};

  return {
    title: post.title + " | MonexMint",
    description: post.description,
  };
}

export default function BlogPost({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "900px", margin: "80px auto", padding: "0 20px", lineHeight: "1.8" }}>
      <h1>{post.title}</h1>
      <small>{post.date}</small>
      <hr style={{ margin: "20px 0" }} />
      <p style={{ whiteSpace: "pre-line" }}>{post.content}</p>
    </div>
  );
}