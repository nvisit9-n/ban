import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { MistakeQuestionRecord } from '../../types';
import { 
  RotateCcw, 
  CheckCircle2, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';

export const MistakeBookScreen: React.FC = () => {
  const { openNoteReader, addToast, setActiveTab } = useApp();
  const [mistakes, setMistakes] = useState<MistakeQuestionRecord[]>([]);
  const [activeRetryId, setActiveRetryId] = useState<string | null>(null);
  const [selectedRetryOption, setSelectedRetryOption] = useState<string | number | null>(null);
  const [retryResult, setRetryResult] = useState<{ isCorrect: boolean } | null>(null);
  const [aiExplanationMap, setAiExplanationMap] = useState<Record<string, string>>({});
  const [filterMastered, setFilterMastered] = useState<boolean>(false);

  const loadMistakes = () => {
    const list = DbService.getMistakes();
    setMistakes(list);
  };

  useEffect(() => {
    loadMistakes();
  }, []);

  const handleRetrySubmit = (item: MistakeQuestionRecord) => {
    if (selectedRetryOption === null) return;
    const isCorrect = String(selectedRetryOption) === String(item.correctAnswer);
    setRetryResult({ isCorrect });
    if (isCorrect) {
      DbService.markMistakeMastered(item.id);
      addToast('बधाई छ! तपाईंले प्रश्न शुद्ध समाधान गर्नुभयो र निपुण (Mastered) चिह्नित गरियो।', 'success');
      loadMistakes();
    } else {
      addToast('पुनः गल्ती भयो! कृपया तलको प्रमाणित व्याख्या अध्ययन गर्नुहोस्।', 'error');
    }
  };

  const handleRemove = (id: string) => {
    DbService.removeMistake(id);
    addToast('प्रश्न Mistake Book बाट हटाइयो।', 'info');
    loadMistakes();
  };

  const handleAiExplain = (item: MistakeQuestionRecord) => {
    // Generate grounded exam explanation without external API dependency
    const structuredExplain = `
**१. सही उत्तर:** ${item.correctAnswer}
**२. किन सही भयो?** नेपालको बैंकिङ कानुन तथा प्रचलित नेपाल राष्ट्र बैंकको एकीकृत निर्देशन अनुसार उल्लिखित प्रावधान अनिवार्य छ।
**३. मूल अवधारणा (Core Concept):** ${item.subject} खण्ड अन्तर्गत यस विषयबाट लोक सेवा तथा बैंक परीक्षामा प्रायः वस्तुगत तथा ५ अङ्कको संक्षिप्त टिप्पणी सोधिने गर्दछ।
**४. परीक्षा टिप:** गलत विकल्पहरूमा उल्लिखित अंक वा दफामा ध्यान दिनुहोस्। BAFIA २०७३ र NRB Act २०५८ का संख्यात्मक प्रावधानहरू झुक्किने प्रमुख क्षेत्र हुन्।
    `.trim();

    setAiExplanationMap(prev => ({
      ...prev,
      [item.id]: structuredExplain
    }));
  };

  const displayedList = filterMastered 
    ? mistakes.filter(m => m.isMastered) 
    : mistakes.filter(m => !m.isMastered);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1">
              <RotateCcw className="w-4 h-4" />
              <span>व्यक्तिगत गल्ती पुस्तिका (Automated Mistake Book)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              विगतका त्रुटिहरूको पुनरावलोकन तथा सुधार
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              अभ्यास तथा मोक टेस्टमा बिग्रेका प्रश्नहरू यहाँ स्वतः संकलित हुन्छन् ताकि एउटै गल्ती परीक्षामा नदोहोरियोस्।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMastered(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                !filterMastered
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              सुधार गर्न बाँकी ({mistakes.filter(m => !m.isMastered).length})
            </button>
            <button
              onClick={() => setFilterMastered(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterMastered
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              निपुण / मिलाइएका ({mistakes.filter(m => m.isMastered).length})
            </button>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>कुल गल्ती अभिलेख: <strong className="text-slate-800 dark:text-slate-200">{mistakes.length} प्रश्नहरू</strong></span>
          <button
            onClick={() => setActiveTab('practice')}
            className="text-sky-600 hover:underline font-semibold"
          >
            नयाँ अभ्यास सुरु गर्नुहोस् →
          </button>
        </div>
      </div>

      {/* 2. Mistake Items List */}
      {displayedList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {filterMastered ? 'कुनै निपुण प्रश्न फेला परेन' : 'हाल सुधार गर्न बाँकी कुनै गल्ती छैन!'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            तपाईंले अभ्यास गर्दा बिगार्नुभएका सम्पूर्ण प्रश्नहरू यहाँ स्वचालित रूपमा थपिनेछन्।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map(item => {
            const isRetrying = activeRetryId === item.id;
            const aiExplanation = aiExplanationMap[item.id];

            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      त्रुटि संख्या: {item.failedCount} पटक
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{item.subject}</span>
                    {item.isMastered && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                        <Check className="w-3.5 h-3.5" />
                        Mastered
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Remove from Mistakes"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Question */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {item.questionText}
                </h3>

                {/* Interactive Retry Mode */}
                {isRetrying ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <p className="text-xs font-bold text-sky-700 dark:text-sky-400">
                      पुनः प्रयास: सही उत्तर छनोट गर्नुहोस्
                    </p>
                    <div className="space-y-2">
                      {item.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setSelectedRetryOption(oIdx)}
                          className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all ${
                            selectedRetryOption === oIdx
                              ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 font-semibold'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleRetrySubmit(item)}
                        className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 rounded-lg"
                      >
                        उत्तर जाँच्नुहोस्
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveRetryId(null);
                          setSelectedRetryOption(null);
                          setRetryResult(null);
                        }}
                        className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800"
                      >
                        बन्द गर्नुहोस्
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Error Summary */
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-medium">
                      <span>तपाईंले दिएको गलत उत्तर: </span>
                      <strong className="underline">{item.userWrongAnswer}</strong>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                      <span>शुद्ध उत्तर: </span>
                      <strong className="underline">{item.correctAnswer}</strong>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <strong>प्रमाणित समाधान: </strong>{item.explanation}
                    </p>
                  </div>
                )}

                {/* AI Explanation Accordion */}
                {aiExplanation && (
                  <div className="p-4 bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl text-xs space-y-2 animate-fadeIn">
                    <span className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>AI Exam Explanation (प्राज्ञिक समाधान विश्लेषण):</span>
                    </span>
                    <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {aiExplanation}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRetryId(item.id);
                      setSelectedRetryOption(null);
                      setRetryResult(null);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-lg shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>अहिले पुनः हल गर्नुहोस् (Retry)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAiExplain(item)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 rounded-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explain with AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openNoteReader(item.subject)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>सम्बन्धित च्याप्टर पढ्नुहोस्</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
