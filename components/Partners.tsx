
import React from 'react';
import { useLanguage } from '../App';

const Partners: React.FC = () => {
  const { t } = useLanguage();
  // 模拟真实行业客户
  const partnerNames = [
    'Amazon Logistics', 'Zara International', 'Volkswagen Group', 'Walmart Global',
    'Pfizer Health', 'Schneider Electric', 'DHL Express', 'Samsung Electronics'
  ];

  return (
    <section id="partners" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">{t.partners.badge}</p>
          <h2 className="text-4xl font-extrabold text-slate-900">{t.partners.title}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partnerNames.map((p, idx) => (
            <div key={idx} className="bg-white h-28 rounded-2xl flex items-center justify-center p-6 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all border border-slate-100 hover:border-blue-200 hover:shadow-xl group">
              <div className="text-slate-500 font-bold text-center text-sm md:text-base leading-tight group-hover:text-blue-600 transition-colors italic">
                {p}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-tech-gradient rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-80 h-80 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2 blur-[100px]"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-black mb-6 tracking-tight">{t.partners.ctaTitle}</h3>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
              {t.partners.ctaDesc}
            </p>
            <button className="bg-blue-600 text-white font-black px-12 py-5 rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/40 transform hover:scale-105">
              {t.partners.ctaBtn}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
