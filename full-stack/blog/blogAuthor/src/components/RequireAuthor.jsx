import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuthor({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-8">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
