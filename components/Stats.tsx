
import React from 'react';
import { useLanguage } from '../App';

const Stats: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {t.stats.map((stat, idx) => (
            <div key={idx} className="text-center group border-r rtl:border-r-0 rtl:border-l border-slate-100 last:border-0">
              <p className="text-4xl md:text-5xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                {stat.value}
                <span className="text-xl font-bold ml-1 rtl:mr-1">{stat.suffix}</span>
              </p>
              <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
