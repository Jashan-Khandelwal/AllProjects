import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts")
      .then((data) => setPosts(data.posts))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (posts.length === 0) return <p className="text-gray-600">No posts yet.</p>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="rounded-lg border bg-white p-5">
          <h2 className="text-xl font-semibold">
            <Link to={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            by {post.author.username} ·{" "}
            {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}
          </p>
          <p className="mt-3 text-gray-700">{excerpt(post.content)}</p>
          <Link
            to={`/posts/${post.id}`}
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Read more →
          </Link>
        </article>
      ))}
    </div>
  );
}

function excerpt(text, max = 160) {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}
