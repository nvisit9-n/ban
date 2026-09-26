import React from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, Home, BookOpen, Search, ArrowRight } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  const { setActiveTab, setIsSearchOpen } = useApp();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-5 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
        <HelpCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">
          त्रुटि ४०४ · पृष्ठ फेला परेन
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          खोजिएको सामग्री फेला परेन
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          तपाईंले खोज्नुभएको अध्ययन पृष्ठ, पाठ्यक्रम वा अध्याय स्थानान्तरण गरिएको हुन सक्छ वा लिङ्क गलत हुन सक्छ।
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>गृहपृष्ठमा जानुहोस् (Go Home)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('learn')}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>पाठ्यक्रम तथा पुस्तकहरू (Learn)</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-all"
        >
          <Search className="w-4 h-4" />
          <span>खोजी गर्नुहोस् (Search)</span>
        </button>
      </div>
    </div>
  );
};
