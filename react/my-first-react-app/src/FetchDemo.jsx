import React, { useState, useEffect } from "react";
import { getRequestWithNativeFetch, postRequestWithFetch } from "./apiUtils";
import "./ApiDemo.css";

const FetchDemo = () => {
  const [posts, setPosts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // POST form state
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // 1. Initial Fetch for list
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getRequestWithNativeFetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=8"
        );
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 2. Single Post Fetch with AbortController (Handles Race Conditions)
  useEffect(() => {
    if (!selectedId) return;

    const controller = new AbortController();
    const fetchSinglePost = async () => {
      setSelectedPost(null); // Clear previous post to show loading
      try {
        const data = await getRequestWithNativeFetch(
          `https://jsonplaceholder.typicode.com/posts/${selectedId}`,
          controller.signal
        );
        setSelectedPost(data);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted: User switched posts rapidly.");
        } else {
          setError(err.message);
        }
      }
    };

    fetchSinglePost();

    // CLEANUP: Aborts the fetch if selectedId changes before response arrives
    return () => controller.abort();
  }, [selectedId]);

  // 3. Handle POST Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      const newPost = { title: formTitle, body: formBody, userId: 1 };
      const response = await postRequestWithFetch(
        "https://jsonplaceholder.typicode.com/posts",
        newPost
      );
      console.log("Post successful:", response);
      setPostSuccess(true);
      setFormTitle("");
      setFormBody("");
      setTimeout(() => setPostSuccess(false), 3000); // Hide success msg
    } catch (err) {
      alert("Post failed: " + err.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h3 style={{ padding: "0 15px" }}>Posts List</h3>
        {loading && <div className="loading">Loading...</div>}
        <ul>
          {posts.map((p) => (
            <li
              key={p.id}
              className={`post-item ${selectedId === p.id ? "active" : ""}`}
              onClick={() => setSelectedId(p.id)}
            >
              {p.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="content">
        {/* POST FORM SECTION */}
        <div className="post-form">
          <h3>Create New Post (POST)</h3>
          {postSuccess && (
            <div className="success-msg">
              Post created successfully (logged to console)!
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Body"
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              required
            />
            <button type="submit" disabled={isPosting}>
              {isPosting ? "Sending..." : "Submit Post"}
            </button>
          </form>
        </div>

        <hr />

        {/* DETAILS SECTION */}
        <div className="details">
          <h3>Post Details (GET with Abort)</h3>
          {selectedId && !selectedPost && (
            <div className="loading">Loading post {selectedId}...</div>
          )}
          {selectedPost ? (
            <article>
              <h1>{selectedPost.title}</h1>
              <p>{selectedPost.body}</p>
            </article>
          ) : (
            <p>
              Click a post on the left to see the AbortController in action
              (check Network tab/Console).
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FetchDemo;
