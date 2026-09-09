import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function PostDetail() {
  const { postId } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/posts/${postId}`),
      api.get(`/posts/${postId}/comments`),
    ])
      .then(([postData, commentData]) => {
        setPost(postData.post);
        setComments(commentData.comments);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleDelete(id) {
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return null;

  return (
    <article>
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← All posts
      </Link>
      <h1 className="mt-3 text-3xl font-bold">{post.title}</h1>
      <p className="mt-1 text-sm text-gray-500">
        by {post.author.username} ·{" "}
        {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-6 whitespace-pre-wrap leading-relaxed text-gray-800">
        {post.content}
      </div>

      <section className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>

        {user ? (
          <CommentForm
            postId={postId}
            onAdd={(c) => setComments((prev) => [...prev, c])}
          />
        ) : (
          <p className="mt-4 text-sm text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>{" "}
            to leave a comment.
          </p>
        )}

        <ul className="mt-6 space-y-4">
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
              {user && (user.id === c.author.id || user.role === "AUTHOR") && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function CommentForm({ postId, onAdd }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.post(`/posts/${postId}/comments`, { content });
      onAdd(data.comment);
      setContent("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment…"
        rows={3}
        className="w-full rounded border p-2"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="mt-2 rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {submitting ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
