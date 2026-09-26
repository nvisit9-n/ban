import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { allFiftySets } from '../../data/sangathitDatabase';
import { Question, SubjectCategory, DifficultyLevel, MistakeQuestionRecord } from '../../types';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Bookmark, 
  Flag, 
  Sparkles, 
  Layers, 
  Award, 
  Zap, 
  Filter, 
  ChevronRight,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const PracticeCenterScreen: React.FC = () => {
  const { setActiveTab, toggleBookmark, isBookmarked, addToast, user } = useApp();

  // Mode Selection: 'daily' | 'topic' | 'previous' | 'current'
  const [practiceMode, setPracticeMode] = useState<'daily' | 'topic' | 'previous' | 'current'>('daily');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [isExamMode, setIsExamMode] = useState<boolean>(false); // False = Immediate feedback, True = Test mode

  // Question Pool Resolution
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 });

  // Load questions based on mode and subject filter
  useEffect(() => {
    let pool: any[] = [];
    const sets = allFiftySets || [];
    
    // Flatten questions from verified sets
    sets.slice(0, 10).forEach(s => {
      if (s.questions && Array.isArray(s.questions)) {
        pool.push(...s.questions);
      }
    });

    if (selectedSubject !== 'All') {
      pool = pool.filter(q => q.category === selectedSubject || q.topic === selectedSubject);
    }

    // Shuffle pool for variety
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 20);
    setCurrentQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setSessionScore({ correct: 0, incorrect: 0 });
  }, [practiceMode, selectedSubject]);

  const activeQuestion = currentQuestions[currentIndex];

  const handleSelectOption = (idx: number | string) => {
    if (isSubmitted && !isExamMode) return;
    setSelectedOption(idx);
    if (!isExamMode) {
      // Immediate feedback mode
      setIsSubmitted(true);
      const isCorrect = String(idx) === String(activeQuestion.correctAnswer);
      if (isCorrect) {
        setSessionScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        DbService.updateDailyMissionTask('mission-practice-mcqs', 1);
      } else {
        setSessionScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        // Automatically save into Mistake Book!
        DbService.recordMistake({
          questionId: activeQuestion.id ? String(activeQuestion.id) : `q-${Date.now()}`,
          questionText: activeQuestion.questionNepali || activeQuestion.question,
          options: activeQuestion.options ? activeQuestion.options.map((o: any) => typeof o === 'string' ? o : o.textNepali || o.textEnglish) : [],
          userWrongAnswer: idx,
          correctAnswer: activeQuestion.correctAnswer,
          explanation: activeQuestion.explanationNepali || activeQuestion.explanation || 'सम्बन्धित ऐन तथा निर्देशिका अनुसार शुद्ध समाधान।',
          subject: activeQuestion.category || 'Banking',
          difficulty: activeQuestion.difficulty || 'Medium'
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      addToast('अभ्यास सत्र सम्पन्न भयो! तपाईंको नतिजा सुरक्षित गरिएको छ।', 'success');
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const mistakesCount = DbService.getMistakes().filter(m => !m.isMastered).length;
  const dueRevisionCount = DbService.getDueRevisionItems().length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>डिजिटल प्रश्न बैंक तथा अभ्यास केन्द्र (MCQ Practice Center)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              वस्तुगत बहुवैकल्पिक परीक्षा अभ्यास
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              लोक सेवा आयोग तथा बैंक परीक्षाको ढाँचामा तत्काल समाधान बुँदा र व्याख्या सहितको तयारी
            </p>
          </div>

          {/* Quick Shortcuts: Mistake Book & Spaced Revision */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('mistakes')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mistake Book ({mistakesCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Due Revision ({dueRevisionCount})</span>
            </button>
          </div>
        </div>

        {/* Practice Modes & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'daily', label: 'दैनिक अभ्यास (Daily 20)' },
              { id: 'topic', label: 'विषयगत अभ्यास (Topic-wise)' },
              { id: 'previous', label: 'विगतका प्रश्नहरू (Past Exams)' },
              { id: 'current', label: 'समसामयिक MCQs' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPracticeMode(m.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  practiceMode === m.id
                    ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Feedback Mode Toggle */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>तत्काल व्याख्या (Instant Feedback):</span>
            <button
              type="button"
              onClick={() => setIsExamMode(!isExamMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                !isExamMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  !isExamMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Active MCQ Interactive Stage */}
      {currentQuestions.length > 0 && activeQuestion ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Meta Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                प्रश्न {currentIndex + 1} / {currentQuestions.length}
              </span>
              <span>·</span>
              <span className="font-semibold text-sky-700 dark:text-sky-400">{activeQuestion.category || 'Banking Laws'}</span>
              {activeQuestion.examTag && (
                <>
                  <span>·</span>
                  <span className="text-slate-600 dark:text-slate-400">{activeQuestion.examTag}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="tabular-nums font-semibold text-emerald-600">✓ {sessionScore.correct}</span>
              <span className="tabular-nums font-semibold text-rose-600">✗ {sessionScore.incorrect}</span>
              <button
                type="button"
                onClick={() => {
                  const qId = activeQuestion.id ? String(activeQuestion.id) : `q-${currentIndex}`;
                  toggleBookmark('question', qId, activeQuestion.questionNepali || activeQuestion.question, activeQuestion.category || 'MCQ');
                }}
                className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                aria-label="Bookmark Question"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {activeQuestion.questionNepali || activeQuestion.question}
            </h2>
            {activeQuestion.questionEnglish && (
              <p className="text-xs text-slate-500 mt-1 italic">
                {activeQuestion.questionEnglish}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {(activeQuestion.options || []).map((opt: any, optIdx: number) => {
              const optText = typeof opt === 'string' ? opt : opt.textNepali || opt.textEnglish;
              const optKey = typeof opt === 'object' && opt.key ? opt.key : ['A', 'B', 'C', 'D'][optIdx];
              
              // Answer evaluation logic
              const isChosen = String(selectedOption) === String(optIdx) || String(selectedOption) === String(optKey);
              const isCorrectOption = String(activeQuestion.correctAnswer) === String(optIdx) || String(activeQuestion.correctAnswer) === String(optKey);

              let optionClasses = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60';
              if (isSubmitted && !isExamMode) {
                if (isCorrectOption) {
                  optionClasses = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isChosen && !isCorrectOption) {
                  optionClasses = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                }
              } else if (isChosen) {
                optionClasses = 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-semibold';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(typeof opt === 'object' && opt.key ? opt.key : optIdx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${optionClasses}`}
                >
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSubmitted && !isExamMode && isCorrectOption
                      ? 'bg-emerald-600 text-white'
                      : isSubmitted && !isExamMode && isChosen && !isCorrectOption
                      ? 'bg-rose-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {optKey}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm leading-relaxed">{optText}</span>
                  </div>
                  {isSubmitted && !isExamMode && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && !isExamMode && isChosen && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible in Practice Mode after answer) */}
          {isSubmitted && !isExamMode && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>प्रमाणित व्याख्या एवं परीक्षा बुँदा (High-Yield Solution):</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    addToast('त्रुटि प्रतिवेदन प्रशासकलाई पठाइयो। धन्यवाद!', 'info');
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500"
                >
                  <Flag className="w-3 h-3" />
                  <span>प्रश्न रिपोर्ट</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeQuestion.explanationNepali || activeQuestion.explanation}
              </p>
              {activeQuestion.actSection && (
                <p className="text-xs text-slate-500 font-mono">
                  ऐन दफा सन्दर्भ: {activeQuestion.actSection}
                </p>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {isSubmitted && !isExamMode ? (
              <button
                type="button"
                onClick={handleRetryQuestion}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पुनः प्रयास (Retry)</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 disabled:opacity-40 rounded-xl transition-all shadow-xs"
            >
              <span>{currentIndex === currentQuestions.length - 1 ? 'सत्र सम्पन्न गर्नुहोस्' : 'अर्को प्रश्न (Next)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-sm">यस विषयका लागि प्रश्नहरू लोड हुँदैछन्...</p>
        </div>
      )}
    </div>
  );
};
