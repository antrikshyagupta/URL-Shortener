import React from 'react';
import Hero from '../components/Hero';

export default function Home() {
  const features = [
    {
      label: 'PROTOCOL CORRECTION',
      title: 'Automatic Normalization',
      desc: 'Never worry about missing http/https prefixes. All links are automatically validated and normalized to valid protocols.',
    },
    {
      label: 'TTL CONTROL',
      title: 'Link Expiration',
      desc: 'Set custom expiration timestamps. Expired links seamlessly resolve to HTTP 410 Gone status codes.',
    },
    {
      label: 'VANITY CODES',
      title: 'Custom Short Aliases',
      desc: 'Replace random strings with memorable, branded vanity slugs ranging from 3 to 30 characters.',
    },
    {
      label: 'TELEMETRY',
      title: 'Real-time Click Tracking',
      desc: 'Detailed analytical inspection showing total redirects, creation timestamps, and active status.',
    },
  ];

  return (
    <div>
      <Hero />

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-widest text-indigo uppercase font-semibold">
            SYSTEM SPECIFICATION
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal mt-2">
            Engineered for reliability.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white border border-[#e5e5e5] hover:border-charcoal transition-all duration-300"
            >
              <span className="font-mono text-[10px] tracking-widest text-indigo uppercase font-bold">
                0{i + 1} // {f.label}
              </span>
              <h3 className="font-serif text-2xl text-charcoal mt-2 mb-3">
                {f.title}
              </h3>
              <p className="font-sans text-sm text-[#171717]/70 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
