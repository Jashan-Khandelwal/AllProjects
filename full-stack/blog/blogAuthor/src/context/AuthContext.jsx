import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((data) => {
        // A valid token for a non-author is useless here — drop it.
        if (data.user.role === "AUTHOR") setUser(data.user);
        else clearToken();
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post(
      "/auth/login",
      { email, password },
      { auth: false },
    );

    // Check the role BEFORE storing anything.
    if (data.user.role !== "AUTHOR") {
      throw new Error("That account doesn't have author access.");
    }

    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = { user, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
