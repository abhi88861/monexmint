import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";

export const metadata = {
  title: "Financial Blog | MonexMint",
  description:
    "Read financial guides on EMI, SIP, investments, tax planning and more.",
};

export default function Blog() {
  return (
    <div style={{ maxWidth: "900px", margin: "80px auto", padding: "0 20px" }}>
      <h1>MonexMint Financial Blog</h1>

      {blogPosts.map((post) => (
        <div key={post.slug} style={{ marginBottom: "40px" }}>
          <h2>
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          <p>{post.description}</p>
          <small>{post.date}</small>
          <hr style={{ marginTop: "20px" }} />
        </div>
      ))}
    </div>
  );
}