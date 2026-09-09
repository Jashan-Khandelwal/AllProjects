import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function PostForm() {
  const { postId } = useParams();
  const isEdit = Boolean(postId);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/posts/${postId}`)
      .then((data) => {
        setTitle(data.post.title);
        setContent(data.post.content);
        setPublished(data.post.published);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/posts/${postId}`, { title, content });
      } else {
        await api.post("/posts", { title, content, published });
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-3 text-2xl font-bold">
        {isEdit ? "Edit post" : "New post"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full rounded border p-2 font-mono text-sm"
          />
        </div>

        {!isEdit && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish immediately
          </label>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create post"}
          </button>
          <Link to="/" className="rounded border px-4 py-2">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
