import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, logout, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold">My Blog</Link>
          <div className="flex items-center gap-4 text-sm">
            {!loading &&
              (user ? (
                <>
                  <span className="text-gray-600">Hi, {user.username}</span>
                  <button onClick={logout} className="rounded bg-gray-900 px-3 py-1 text-white">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Log in</Link>
                  <Link to="/signup" className="rounded bg-gray-900 px-3 py-1 text-white">
                    Sign up
                  </Link>
                </>
              ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
