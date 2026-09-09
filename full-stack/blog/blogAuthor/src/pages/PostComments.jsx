import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function PostComments() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/posts/${postId}`),
      api.get(`/posts/${postId}/comments`),
    ])
      .then(([p, c]) => {
        setPost(p.post);
        setComments(c.comments);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleDelete(id) {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-3 text-2xl font-bold">Comments</h1>
      <p className="mt-1 text-sm text-gray-600">on “{post.title}”</p>

      {comments.length === 0 ? (
        <p className="mt-6 text-gray-600">No comments yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded border bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.author.username}</span>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-gray-800">
                {c.content}
              </p>
              <button
                onClick={() => handleDelete(c.id)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
