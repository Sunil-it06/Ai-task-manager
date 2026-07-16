import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/10 ring-1 ring-emerald-400/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="#34D399" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-100">TaskFlow</span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 sm:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs text-slate-400">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-400 transition hover:border-red-400/40 hover:bg-red-400/5 hover:text-red-400"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;