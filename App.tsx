
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import PersonalizedPanel from './components/PersonalizedPanel';
import VerificationGuard from './components/VerificationGuard';
import { verifyHkParams, VerificationResult } from './crypto';
import { translations, Language } from './translations';

/**
 * Interface defining the shape of the language context
 */
interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Custom hook to access language settings and translations throughout the app.
 * Exported to satisfy imports in components like Hero, Services, and Contact.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const hasInitialized = useRef(false);

  // Derive translations based on the current language
  const t = (translations as any)[lang] || translations.en;

  useEffect(() => {
    const initApp = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      const query = new URLSearchParams(window.location.search);
      const result = await verifyHkParams(query);
      setVerifyResult(result);
      setIsLoading(false);
    };

    initApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase animate-pulse mb-2">Establishing Secure Link</p>
            <p className="text-slate-600 text-[9px] font-medium tracking-[0.2em] uppercase">Syncing with Remote Audit Server...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-8 selection:bg-blue-500/30">
        <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-4">
          {verifyResult && verifyResult.isValid ? (
            <PersonalizedPanel verifyResult={verifyResult} />
          ) : (
            <VerificationGuard verifyResult={verifyResult} />
          )}
        </div>

        {/* Background Ambience */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-600/5 rounded-full blur-[160px]"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        </div>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
