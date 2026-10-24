import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email, password);
      login(res.token, res.user || { email });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white border border-[#e5e5e5] rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] tracking-widest text-indigo uppercase font-semibold">
            AUTHENTICATION
          </span>
          <h1 className="font-serif text-3xl text-charcoal mt-1">
            Welcome Back
          </h1>
          <p className="font-sans text-xs text-[#171717]/60 mt-2">
            Access your curated link architecture
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 font-mono text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-charcoal mb-2 tracking-wider">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              placeholder="curator@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl text-charcoal focus:outline-none focus:border-indigo font-sans text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-charcoal mb-2 tracking-wider">
              PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl text-charcoal focus:outline-none focus:border-indigo font-sans text-sm transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full font-mono text-xs tracking-widest py-4 bg-charcoal text-cream rounded-xl hover:bg-indigo disabled:opacity-50 transition-all duration-300 shadow-md uppercase"
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN →'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#f0f0f0] text-center">
          <p className="font-sans text-xs text-[#171717]/60">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo font-semibold hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
