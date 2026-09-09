import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold">Blog Admin</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/posts/new" className="rounded bg-gray-900 px-3 py-1 text-white">
              New post
            </Link>
            <span className="text-gray-600">{user.username}</span>
            <button onClick={logout} className="text-gray-600 hover:underline">
              Log out
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
