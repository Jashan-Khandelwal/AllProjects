import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuthor from "./components/RequireAuthor";
import App from "./App";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PostForm from "./pages/PostForm";
import PostComments from "./pages/PostComments";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuthor>
                <App />
              </RequireAuthor>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="posts/new" element={<PostForm />} />
            <Route path="posts/:postId/edit" element={<PostForm />} />
            <Route path="posts/:postId/comments" element={<PostComments />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
