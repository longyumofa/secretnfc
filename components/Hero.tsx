
import React from 'react';
import { ArrowRight, Box, Zap, ShieldCheck, Factory } from 'lucide-react';
import { useLanguage } from '../App';

const Hero: React.FC = () => {
  const { t, lang } = useLanguage();
  return (
    <section id="about" className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-tech-gradient">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 rtl:left-auto rtl:right-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] rtl:right-auto rtl:left-[-10%] w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-white space-y-10 animate-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl rounded-full px-5 py-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
            <span className="text-blue-300 text-[10px] font-black uppercase tracking-[0.2em]">{t.hero.badge}</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] tracking-tighter">
            {t.hero.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              {t.hero.subtitle}
            </span>
          </h1>
          
          <p className="text-xl text-slate-300/90 max-w-xl leading-relaxed font-medium">
            {t.hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse pt-6">
            <button className="flex items-center justify-center space-x-3 rtl:space-x-reverse bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-black transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/40 group">
              <span className="text-lg">{t.hero.ctaPrimary}</span>
              <ArrowRight className={`w-6 h-6 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
            </button>
            <button className="flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/20 backdrop-blur-md px-10 py-5 rounded-2xl font-black transition-all text-lg">
              <span>{t.hero.ctaSecondary}</span>
            </button>
          </div>

          <div className="flex items-center space-x-12 rtl:space-x-reverse pt-12 border-t border-white/10 w-fit">
            <div className="group text-center">
              <Zap className="text-blue-400 mb-3 group-hover:scale-125 transition-transform mx-auto" size={28} />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">{t.hero.feat1}</span>
            </div>
            <div className="group text-center">
              <Factory className="text-emerald-400 mb-3 group-hover:scale-125 transition-transform mx-auto" size={28} />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">{t.hero.feat2}</span>
            </div>
            <div className="group text-center">
              <ShieldCheck className="text-indigo-400 mb-3 group-hover:scale-125 transition-transform mx-auto" size={28} />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">{t.hero.feat3}</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative perspective-1000 animate-in zoom-in duration-1000">
          <div className="relative z-10 transform rotate-2 hover:rotate-0 transition-all duration-1000 ease-out hover:scale-105">
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60"></div>
             <img 
               src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000" 
               alt="HKBR High-Tech Chip" 
               className="relative rounded-[2rem] shadow-2xl border border-white/10 w-full aspect-square object-cover"
             />
             <div className="absolute -bottom-8 -left-8 rtl:-left-auto rtl:-right-8 bg-white/95 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl flex items-center space-x-6 rtl:space-x-reverse max-w-xs border border-blue-50 animate-bounce-slow">
               <div className="bg-blue-600/10 p-4 rounded-2xl">
                 <Zap className="text-blue-600 w-8 h-8" />
               </div>
               <div>
                 <p className="text-slate-900 font-black text-3xl tracking-tighter">99.9%</p>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{t.hero.statsLabel}</p>
               </div>
             </div>
          </div>
          {/* 装饰环 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-white/5 rounded-full pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-white/5 rounded-full pointer-events-none animate-spin-slow"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
