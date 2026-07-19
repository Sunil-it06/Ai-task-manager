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
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-110">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L4 14H10L9 22L18 10H12L13 2Z" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tighter text-white">TaskFlow</span>
              <p className="text-[10px] text-emerald-400 -mt-1 font-mono">ASYNC ENGINE</p>
            </div>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-sm text-slate-400">{user.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-700 hover:border-red-500/50 hover:bg-red-500/5 text-slate-400 hover:text-red-400 transition-all duration-200 text-sm font-medium"
              >
                <span>Sign Out</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4V7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;