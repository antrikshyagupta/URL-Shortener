import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative pt-16 pb-24 overflow-hidden">
      {/* Editorial Mesh Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#e5e5e5] bg-white/60 backdrop-blur-sm mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo animate-pulse" />
          <span className="font-mono text-[11px] tracking-widest text-[#171717]/80 uppercase">
            Organic Intelligence • Link Architecture
          </span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-normal leading-[1.1] text-charcoal tracking-tight mb-8">
          Precision links for <br />
          <span className="italic font-normal">thoughtful minds</span>.
        </h1>

        <p className="font-sans text-lg md:text-xl text-[#171717]/70 max-w-2xl mx-auto leading-relaxed mb-12">
          An editorial approach to URL management. Shorten, customize, monitor,
          and expire links with high-contrast precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="w-full sm:w-auto font-mono text-xs tracking-widest px-8 py-4 bg-charcoal text-cream rounded-full hover:bg-indigo hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isAuthenticated ? "OPEN DASHBOARD →" : "CREATE ACCOUNT →"}
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto font-mono text-xs tracking-widest px-8 py-4 border border-[#e5e5e5] bg-white/40 text-charcoal rounded-full hover:bg-white transition-all duration-300"
          >
            EXPLORE ARCHITECTURE
          </a>
        </div>
      </div>

      {/* Wave Layout Architecture */}
      <div className="relative w-full mt-20">
        <svg
          className="w-full h-16 text-[#f3f1ec] fill-current"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path d="M0,32L80,26.7C160,21,320,11,480,16C640,21,800,43,960,48C1120,53,1280,43,1360,37.3L1440,32L1440,60L1360,60C1280,60,1120,60,960,60C800,60,640,60,480,60C320,60,160,60,80,60L0,60Z"></path>
        </svg>
      </div>
    </div>
  );
}
