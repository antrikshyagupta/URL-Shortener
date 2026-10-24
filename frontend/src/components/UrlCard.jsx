import React, { useState } from 'react';

export default function UrlCard({ url, onOpenStats, onDelete }) {
  const [copied, setCopied] = useState(false);
  const isExpired = url.expiresAt && new Date(url.expiresAt) <= new Date();
  const shortUrl = `${window.location.origin}/api/urls/${url.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 relative group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-sm px-3 py-1 bg-indigo-50 text-indigo rounded-lg font-semibold">
            /{url.shortCode}
          </span>
          {isExpired ? (
            <span className="font-mono text-[10px] px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
              EXPIRED (410)
            </span>
          ) : (
            <span className="font-mono text-[10px] px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">
              ACTIVE
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs text-charcoal/60">
            CLICKS: <strong className="text-charcoal font-bold">{url.clicks ?? 0}</strong>
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-mono text-[#171717]/40 mb-1">ORIGINAL DESTINATION</div>
        <p className="text-sm font-sans text-charcoal truncate" title={url.originalUrl}>
          {url.originalUrl}
        </p>
      </div>

      {url.expiresAt && (
        <div className="text-xs font-mono text-[#171717]/50 mb-4">
          TTL Expiry: {new Date(url.expiresAt).toLocaleString()}
        </div>
      )}

      <div className="pt-4 border-t border-[#f5f5f5] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="font-mono text-xs px-3 py-1.5 border border-[#e5e5e5] rounded-lg hover:border-charcoal hover:bg-charcoal hover:text-cream transition-all"
          >
            {copied ? 'COPIED!' : 'COPY LINK'}
          </button>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs px-3 py-1.5 border border-[#e5e5e5] rounded-lg hover:border-indigo hover:text-indigo transition-all"
          >
            VISIT ↗
          </a>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenStats(url.shortCode)}
            className="font-mono text-xs px-3 py-1.5 bg-indigo-50 text-indigo rounded-lg hover:bg-indigo hover:text-white transition-all"
          >
            STATS
          </button>
          <button
            onClick={() => onDelete(url.shortCode)}
            className="font-mono text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}
