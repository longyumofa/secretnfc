
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../App';

const CaseStudies: React.FC = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="cases" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">{t.cases.badge}</h2>
            <p className="text-4xl font-extrabold text-slate-900">{t.cases.title}</p>
          </div>
          <button className="text-slate-600 font-semibold flex items-center hover:text-blue-600">
            {t.cases.viewAll} <ExternalLink className="ml-2 rtl:ml-0 rtl:mr-2 w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {t.cases.items.map((c, idx) => (
            <div key={idx} className="relative group overflow-hidden rounded-3xl">
              <img src={`https://picsum.photos/600/400?random=${idx + 10}`} alt={c.title} className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                <span className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 w-fit">
                  {c.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-blue-400 font-medium">{c.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
