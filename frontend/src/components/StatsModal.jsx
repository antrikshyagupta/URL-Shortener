import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function StatsModal({ shortCode, onClose }) {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await api.getUrlStats(shortCode, token);
        if (isMounted) setStats(res.data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load stats');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [shortCode, token]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#e5e5e5] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 font-mono text-xs w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center hover:bg-charcoal hover:text-cream transition-all"
        >
          ✕
        </button>

        <span className="font-mono text-[10px] tracking-widest text-indigo uppercase font-semibold">
          ANALYTICS & METRICS
        </span>
        <h3 className="font-serif text-3xl text-charcoal mb-6 mt-1">
          Link Statistics
        </h3>

        {loading && (
          <div className="py-12 text-center font-mono text-sm text-charcoal/60">
            Fetching metrics...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 font-mono text-sm mb-4">
            {error}
          </div>
        )}

        {stats && (
          <div className="space-y-4">
            <div className="p-4 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl flex items-center justify-between">
              <span className="font-mono text-xs text-charcoal/70">TOTAL CLICKS</span>
              <span className="font-mono text-2xl font-bold text-indigo">
                {stats.totalClicks}
              </span>
            </div>

            <div className="p-4 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl">
              <div className="font-mono text-xs text-charcoal/70 mb-1">SHORT CODE</div>
              <div className="font-mono text-sm text-charcoal font-semibold">
                /{stats.shortCode}
              </div>
            </div>

            <div className="p-4 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl">
              <div className="font-mono text-xs text-charcoal/70 mb-1">DESTINATION URL</div>
              <div className="font-sans text-sm text-charcoal break-all">
                {stats.originalUrl}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl">
                <div className="font-mono text-[11px] text-charcoal/70 mb-1">CREATED AT</div>
                <div className="font-mono text-xs text-charcoal">
                  {new Date(stats.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="p-4 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl">
                <div className="font-mono text-[11px] text-charcoal/70 mb-1">STATUS</div>
                <div className="font-mono text-xs">
                  {stats.isExpired ? (
                    <span className="text-red-600 font-semibold">EXPIRED</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">ACTIVE</span>
                  )}
                </div>
              </div>
            </div>

            {stats.expiresAt && (
              <div className="p-4 bg-[#fcfbf9] border border-[#e5e5e5] rounded-xl">
                <div className="font-mono text-[11px] text-charcoal/70 mb-1">EXPIRES AT</div>
                <div className="font-mono text-xs text-charcoal">
                  {new Date(stats.expiresAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-[#f0f0f0]">
          <button
            onClick={onClose}
            className="w-full font-mono text-xs tracking-widest py-3 border border-charcoal text-charcoal rounded-xl hover:bg-charcoal hover:text-cream transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
