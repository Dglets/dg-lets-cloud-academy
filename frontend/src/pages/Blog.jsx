import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { blogAPI } from "../utils/api";

const categories = ["All", "AWS Tutorials", "Cloud Tips", "Deployment Guides", "Career Advice"];

const samplePosts = [
  {
    id: "1",
    title: "Getting Started with AWS: A Beginner's Roadmap",
    excerpt: "Everything you need to know to start your AWS journey — from creating your first account to understanding core services.",
    category: "AWS Tutorials",
    createdAt: "2024-07-01T00:00:00Z",
  },
  {
    id: "2",
    title: "S3 + CloudFront: Host a Static Website for Almost Free",
    excerpt: "Step-by-step guide to deploying a static website on Amazon S3 and serving it globally with CloudFront.",
    category: "Deployment Guides",
    createdAt: "2024-07-08T00:00:00Z",
  },
  {
    id: "3",
    title: "5 Cloud Skills That Will Get You Hired in 2025",
    excerpt: "The cloud job market is booming. Here are the five skills hiring managers are looking for right now.",
    category: "Career Advice",
    createdAt: "2024-07-15T00:00:00Z",
  },
  {
    id: "4",
    title: "AWS Lambda vs EC2: When to Use Which",
    excerpt: "Serverless or traditional servers? This guide breaks down the trade-offs so you can make the right architecture decision.",
    category: "Cloud Tips",
    createdAt: "2024-07-22T00:00:00Z",
  },
  {
    id: "5",
    title: "Understanding IAM: Roles, Policies & Best Practices",
    excerpt: "IAM is the backbone of AWS security. Learn how to set it up correctly from day one.",
    category: "AWS Tutorials",
    createdAt: "2024-07-29T00:00:00Z",
  },
  {
    id: "6",
    title: "How to Deploy a Node.js API on AWS Lambda",
    excerpt: "A practical walkthrough of packaging and deploying a Node.js Express API as a serverless Lambda function.",
    category: "Deployment Guides",
    createdAt: "2024-08-05T00:00:00Z",
  },
];

export default function Blog() {
  const [posts, setPosts] = useState(samplePosts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await blogAPI.getAll();
        if (data.length > 0) setPosts(data);
      } catch {
        // Use sample posts as fallback
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">Blog & Resources</span>
            <h1 className="section-title text-5xl mt-2">Cloud Learning Resources</h1>
            <p className="section-subtitle mx-auto mt-3">
              Tutorials, tips, and guides to accelerate your cloud engineering journey.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-slate-400 py-12">Loading posts...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <article key={post.id} className="card hover:border-blue-500/30 transition-colors group flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                      {post.category}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="text-white font-bold text-lg mb-3 group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          )}

          {filtered.length === 0 && !loading && (
            <div className="text-center text-slate-400 py-12">No posts in this category yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
