import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, validate any stored token by fetching the current user.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => clearToken()) // token expired/invalid — discard it
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post(
      "/auth/login",
      { email, password },
      { auth: false },
    );
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function signup(username, email, password) {
    await api.post(
      "/auth/register",
      { username, email, password },
      { auth: false },
    );
    // Register returns no token by design, so log in immediately after.
    return login(email, password);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = { user, loading, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
