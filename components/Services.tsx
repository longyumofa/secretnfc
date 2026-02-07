
import React from 'react';
import { Layers, Database, Tag, Truck, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../App';

const Services: React.FC = () => {
  const { t, lang } = useLanguage();
  
  const icons = [
    <ShoppingBag className="w-8 h-8 text-blue-500" />,
    <Truck className="w-8 h-8 text-indigo-500" />,
    <Tag className="w-8 h-8 text-emerald-500" />,
    <Database className="w-8 h-8 text-orange-500" />
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">{t.services.badge}</h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-6">{t.services.title}</p>
          <p className="text-slate-600 text-lg">
            {t.services.desc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.services.items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group">
              <div className="h-48 overflow-hidden">
                <img src={`https://picsum.photos/400/300?random=${idx}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8 flex-grow">
                <div className="mb-6">{icons[idx]}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
              <div className="px-8 pb-8">
                <button className="text-blue-600 font-bold text-sm flex items-center hover:translate-x-2 transition-transform">
                  {t.services.more} <Layers className={`ml-2 rtl:ml-0 rtl:mr-2 w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
