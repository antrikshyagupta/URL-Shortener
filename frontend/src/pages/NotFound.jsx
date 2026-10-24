import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <span className="font-mono text-xs text-indigo tracking-widest font-bold">
        ERROR 404
      </span>
      <h1 className="font-serif text-5xl text-charcoal mt-2 mb-4">
        Route Not Found
      </h1>
      <p className="font-sans text-sm text-charcoal/60 mb-8 leading-relaxed">
        The route or resource you requested does not exist in the index.
      </p>
      <Link
        to="/"
        className="inline-block font-mono text-xs tracking-widest px-8 py-4 bg-charcoal text-cream rounded-full hover:bg-indigo transition-all duration-300 uppercase shadow-md"
      >
        RETURN TO INDEX →
      </Link>
    </div>
  );
}
