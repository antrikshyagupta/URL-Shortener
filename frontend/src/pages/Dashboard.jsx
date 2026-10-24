import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import UrlForm from '../components/UrlForm';
import UrlCard from '../components/UrlCard';
import StatsModal from '../components/StatsModal';

export default function Dashboard() {
  const { token, isAuthenticated } = useAuth();
  const [urls, setUrls] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShortCode, setSelectedShortCode] = useState(null);

  const fetchUrls = useCallback(async (page = 1) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.getUrls(page, 10, token);
      setUrls(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch links');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUrls(1);
    }
  }, [isAuthenticated, fetchUrls]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleDelete = async (shortCode) => {
    if (!window.confirm(`Are you sure you want to delete /${shortCode}?`)) return;
    try {
      await api.deleteUrl(shortCode, token);
      // Refresh current page
      fetchUrls(pagination.page);
    } catch (err) {
      alert(err.message || 'Failed to delete URL');
    }
  };

  const handleCreated = () => {
    fetchUrls(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="font-mono text-[10px] tracking-widest text-indigo uppercase font-semibold">
          WORKSPACE
        </span>
        <h1 className="font-serif text-4xl text-charcoal mt-1">
          Link Management Dashboard
        </h1>
        <p className="font-sans text-sm text-[#171717]/60 mt-2">
          Create, analyze, and govern your active short link routes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        <div className="lg:col-span-5">
          <UrlForm onCreated={handleCreated} />
        </div>

        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-charcoal">
              Your Indexed Links
            </h2>
            <span className="font-mono text-xs text-charcoal/50">
              {pagination.total} TOTAL
            </span>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-600 font-mono text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center font-mono text-sm text-charcoal/50 bg-white border border-[#e5e5e5] rounded-2xl">
              Retrieving link inventory...
            </div>
          ) : urls.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#e5e5e5] rounded-2xl">
              <p className="font-serif text-xl text-charcoal mb-2">No links created yet</p>
              <p className="font-sans text-xs text-charcoal/60">
                Use the generator form on the left to create your first short URL.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => (
                <UrlCard
                  key={url._id}
                  url={url}
                  onOpenStats={(code) => setSelectedShortCode(code)}
                  onDelete={handleDelete}
                />
              ))}

              {pagination.totalPages > 1 && (
                <div className="pt-6 flex items-center justify-between font-mono text-xs">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchUrls(pagination.page - 1)}
                    className="px-4 py-2 border border-[#e5e5e5] bg-white rounded-lg hover:border-charcoal disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    ← PREVIOUS
                  </button>
                  <span className="text-charcoal/60">
                    PAGE {pagination.page} OF {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchUrls(pagination.page + 1)}
                    className="px-4 py-2 border border-[#e5e5e5] bg-white rounded-lg hover:border-charcoal disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    NEXT →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedShortCode && (
        <StatsModal
          shortCode={selectedShortCode}
          onClose={() => setSelectedShortCode(null)}
        />
      )}
    </div>
  );
}
