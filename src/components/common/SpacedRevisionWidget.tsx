import React from 'react';
import { RotateCcw, AlertTriangle, ArrowRight, CheckCircle2, Flame, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SpacedRevisionWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setActiveTab } = useApp();

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 ${className}`}>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
            Retention & Spaced Repetition
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            स्मरण तालिका तथा गल्ती सुधार (Mistake & Revision Book)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            वैज्ञानिक विधिबाट बिर्सने जोखिम हटाउन स्वचालित रूपमा दोहोर्याउनुपर्ने प्रश्नहरूको सूची
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('mistakes')}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Mistake Book
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('revision')}
            className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revision सुरु</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-bold">
            <span>समीक्षा गर्नुपर्ने प्रश्न (Due Today)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900 dark:text-amber-200 tabular-nums">
            १४ प्रश्नहरू
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400">
            विगत ३ दिनमा गलत चिन्ह लागेका विषयगत प्रश्न
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
            <span>स्मरण सुदृढ (Mastered Concepts)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 tabular-nums">
            २४०+ प्रश्नहरू
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            लगातार ३ पटकसम्म सही उत्तर दिइएको
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/70 dark:border-sky-900/40 space-y-1">
          <div className="flex items-center justify-between text-xs text-sky-800 dark:text-sky-300 font-bold">
            <span>दैनिक अध्ययन निरन्तरता (Streak)</span>
            <Flame className="w-4 h-4 text-sky-600 fill-sky-600" />
          </div>
          <p className="text-2xl font-black text-sky-900 dark:text-sky-200 tabular-nums">
            अविच्छिन्न अध्ययन
          </p>
          <p className="text-[11px] text-sky-700 dark:text-sky-400">
            प्रत्येक दिन २० प्रश्न अभ्यास गर्दा स्मरण शक्ति ३ गुणा बढ्छ
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpacedRevisionWidget;
