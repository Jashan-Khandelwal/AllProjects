import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostDetail from "./pages/PostDetail";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="posts/:postId" element={<PostDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
