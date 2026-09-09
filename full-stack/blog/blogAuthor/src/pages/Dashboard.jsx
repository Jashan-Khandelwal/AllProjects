import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts?status=all")
      .then((data) => setPosts(data.posts))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function togglePublish(post) {
    try {
      const data = await api.patch(`/posts/${post.id}/publish`, {
        published: !post.published,
      });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? data.post : p)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(post) {
    if (!confirm(`Delete "${post.title}"? Its comments will be deleted too.`))
      return;
    try {
      await api.delete(`/posts/${post.id}`);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Posts</h1>

      {posts.length === 0 ? (
        <p className="mt-4 text-gray-600">
          No posts yet. Create your first one.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between rounded border bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.title}</span>
                  <Badge published={post.published} />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {post.published && post.publishedAt
                    ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                    : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                </p>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <button
                  onClick={() => togglePublish(post)}
                  className="rounded border px-3 py-1 hover:bg-gray-50"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <Link
                  to={`/posts/${post.id}/comments`}
                  className="text-blue-600 hover:underline"
                >
                  Comments
                </Link>
                <button
                  onClick={() => handleDelete(post)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Badge({ published }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${
        published
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
