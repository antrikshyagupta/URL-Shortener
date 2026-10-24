import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#fcfbf9]/80 border-b border-[#e5e5e5] transition-all">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-full bg-charcoal text-cream flex items-center justify-center font-mono text-xs font-bold transition-transform group-hover:scale-105">
            //
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-charcoal">
            NomNom
          </span>
        </Link>

        <nav className="flex items-center space-x-8">
          <Link
            to="/"
            className="font-mono text-xs tracking-widest text-[#171717]/70 hover:text-charcoal transition-colors"
          >
            INDEX
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="font-mono text-xs tracking-widest text-[#171717]/70 hover:text-charcoal transition-colors"
              >
                DASHBOARD
              </Link>
              <div className="flex items-center space-x-4 pl-4 border-l border-[#e5e5e5]">
                <span className="font-mono text-xs text-[#171717]/60 hidden sm:inline">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="font-mono text-xs tracking-wider px-4 py-2 border border-charcoal text-charcoal rounded-full hover:bg-charcoal hover:text-cream transition-all duration-300"
                >
                  LOGOUT
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="font-mono text-xs tracking-wider px-4 py-2 text-charcoal hover:text-indigo transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="font-mono text-xs tracking-wider px-5 py-2.5 bg-charcoal text-cream rounded-full hover:bg-indigo hover:shadow-lg transition-all duration-300"
              >
                REGISTER
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
