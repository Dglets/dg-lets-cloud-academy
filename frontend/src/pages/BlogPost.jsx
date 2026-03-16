import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogAPI } from "../utils/api";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data } = await blogAPI.getOne(id);
        setPost(data);
      } catch {
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) return <div className="pt-16 min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (error || !post) return (
    <div className="pt-16 min-h-screen flex flex-col items-center justify-center text-slate-400 gap-4">
      <p>{error || "Post not found."}</p>
      <Link to="/blog" className="btn-primary text-sm px-4 py-2">← Back to Blog</Link>
    </div>
  );

  return (
    <div className="pt-16">
      <section className="py-16 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block">← Back to Blog</Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">{post.category}</span>
            <span className="text-slate-500 text-xs">
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 leading-snug">{post.title}</h1>
          {post.excerpt && <p className="text-slate-400 text-lg mb-8 leading-relaxed border-l-4 border-blue-500 pl-4">{post.excerpt}</p>}
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
            {post.content}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-700 flex items-center justify-between">
            <Link to="/blog" className="text-blue-400 hover:text-blue-300 text-sm">← Back to Blog</Link>
            <Link to="/enroll" className="btn-primary text-sm px-4 py-2">Enroll Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
