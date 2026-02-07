
import React from 'react';
import { Settings, Cpu, Layers, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../App';

const Production: React.FC = () => {
  const { t } = useLanguage();
  
  const icons = [
    <Settings className="w-10 h-10 text-blue-500" />,
    <Cpu className="w-10 h-10 text-indigo-500" />,
    <Layers className="w-10 h-10 text-emerald-500" />,
    <CheckCircle2 className="w-10 h-10 text-blue-600" />
  ];

  return (
    <section id="production" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">{t.production.badge}</h2>
              <p className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{t.production.title}</p>
              <p className="text-slate-600 text-lg leading-relaxed">
                {t.production.desc}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {t.production.steps.map((step, idx) => (
                <div key={idx} className="group p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {icons[idx]}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=1000" 
                 alt="RFID Production Line" 
                 className="w-full aspect-[4/5] object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
            </div>
            {/* 浮动标签 */}
            <div className="absolute top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-blue-50 z-20 max-w-[240px] animate-bounce-slow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800">ISO 9001认证</span>
              </div>
              <p className="text-xs text-slate-500">所有的生产流程均符合国际质量管理标准，确保出货合格率 100%。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Production;
