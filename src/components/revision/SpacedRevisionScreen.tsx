import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { SpacedRevisionItem } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  HelpCircle, 
  Calendar, 
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';

export const SpacedRevisionScreen: React.FC = () => {
  const { openNoteReader, addToast, setActiveTab } = useApp();
  const [revisionItems, setRevisionItems] = useState<SpacedRevisionItem[]>([]);
  const [filterDueOnly, setFilterDueOnly] = useState<boolean>(true);

  const loadItems = () => {
    const all = DbService.getSpacedRevisionItems();
    setRevisionItems(all);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleRateItem = (id: string, rating: 'hard' | 'good' | 'easy') => {
    DbService.recordRevisionRecall(id, rating);
    const label = rating === 'easy' ? 'सजिलो (७ दिन पछि दोहोर्याइने)' : rating === 'good' ? 'मध्यम (३ दिन पछि दोहोर्याइने)' : 'कठिन (भोलि नै दोहोर्याइने)';
    addToast(`रिभिजन तालिका अद्यावधिक: ${label}`, 'success');
    loadItems();
  };

  const dueItems = revisionItems.filter(item => {
    const nextTime = new Date(item.nextReviewDate).getTime();
    return nextTime <= Date.now();
  });

  const displayedItems = filterDueOnly ? dueItems : revisionItems;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
              <Clock className="w-4 h-4" />
              <span>वैज्ञानिक अन्तराल रिभिजन (Spaced Repetition System)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              स्मरणशक्ति सुदृढीकरण तथा रिभिजन तालिका
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              हर्मन एबिङहासको बिर्सने चक्र (Forgetting Curve) अनुसार स्मरणलाई दीर्घकालीन बनाउने वैज्ञानिक प्रविधि
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterDueOnly(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterDueOnly
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              आज दोहोर्याउनुपर्ने ({dueItems.length})
            </button>
            <button
              onClick={() => setFilterDueOnly(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                !filterDueOnly
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              सम्पूर्ण तालिका ({revisionItems.length})
            </button>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            सक्रिय रिभिजन लक्ष्य: <strong className="text-slate-800 dark:text-slate-200">{dueItems.length} बुँदाहरू आज तयार छन्</strong>
          </span>
          <button
            onClick={() => setActiveTab('practice')}
            className="text-sky-600 hover:underline font-semibold"
          >
            नयाँ प्रश्नहरू अभ्यास गर्नुहोस् →
          </button>
        </div>
      </div>

      {/* 2. Items List */}
      {displayedItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {filterDueOnly ? 'आजका लागि कुनै रिभिजन बाँकी छैन!' : 'रिभिजन सूची रिक्त छ।'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            तपाईंले अभ्यास गरेका प्रश्नहरू र गल्तीहरू स्वचालित रूपमा वैज्ञानिक अन्तरालमा यहाँ प्रस्तुत हुनेछन्।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedItems.map(item => {
            const isDueNow = new Date(item.nextReviewDate).getTime() <= Date.now();

            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      चरण {item.stage} (Stage {item.stage})
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{item.subject}</span>
                    {isDueNow && (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                        Due Today
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    रिभिजन संख्या: {item.reviewCount} पटक
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {item.summary}
                </p>

                {/* Recall Rating Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-500">
                    यस प्रश्नको स्मरण स्तर कस्तो रह्यो?
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRateItem(item.id, 'hard')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                    >
                      कठिन (१ दिन)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRateItem(item.id, 'good')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                    >
                      मध्यम (३ दिन)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRateItem(item.id, 'easy')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                    >
                      सजिलो (७ दिन)
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
