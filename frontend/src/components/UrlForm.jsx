import React, { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function UrlForm({ onCreated }) {
  const { token } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = { originalUrl };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();

      const res = await api.shortenUrl(payload, token);
      setSuccess(`Created: ${res.data.shortCode}`);
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresAt('');
      if (onCreated) onCreated(res.data);
    } catch (err) {
      setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0f0f0]">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-indigo uppercase font-semibold">
            LINK GENERATOR
          </span>
          <h2 className="font-serif text-2xl text-charcoal">Shorten New Link</h2>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-mono">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-mono">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-xs text-charcoal mb-2 tracking-wider">
            DESTINATION URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="https://example.com/very-long-editorial-link"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl text-charcoal placeholder-[#171717]/30 focus:outline-none focus:border-indigo transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-charcoal mb-2 tracking-wider">
              CUSTOM ALIAS (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. reading-list"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl text-charcoal placeholder-[#171717]/30 focus:outline-none focus:border-indigo transition-colors font-mono text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-charcoal mb-2 tracking-wider">
              EXPIRATION TIMESTAMP (OPTIONAL)
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl text-charcoal placeholder-[#171717]/30 focus:outline-none focus:border-indigo transition-colors font-mono text-sm"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full font-mono text-xs tracking-widest py-4 bg-charcoal text-cream rounded-xl hover:bg-indigo disabled:opacity-50 transition-all duration-300 uppercase shadow-md"
          >
            {loading ? 'SHORTENING...' : 'GENERATE SHORT URL →'}
          </button>
        </div>
      </form>
    </div>
  );
}
