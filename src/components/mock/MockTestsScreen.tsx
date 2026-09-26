import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { allFiftySets } from '../../data/sangathitDatabase';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Check
} from 'lucide-react';

interface MockSetDefinition {
  id: string;
  titleNe: string;
  institution: string;
  level: string;
  questionCount: number;
  durationMinutes: number;
  negativeMarkingPercent: number;
  descriptionNe: string;
}

const AVAILABLE_MOCK_SETS: MockSetDefinition[] = [
  {
    id: 'mock-nrb-l4-01',
    titleNe: 'नेपाल राष्ट्र बैंक तह ४ (सहायक) पूर्वयोग्यता नमुना परीक्षा - सेट १',
    institution: 'Nepal Rastra Bank (NRB)',
    level: 'तह ४ (Assistant)',
    questionCount: 50,
    durationMinutes: 45,
    negativeMarkingPercent: 20,
    descriptionNe: 'व्यवस्थापन, बैंकिङ ऐन, समष्टिगत अर्थशास्त्र, लेखा र कम्प्युटरका ५० वस्तुगत प्रश्नहरू।'
  },
  {
    id: 'mock-rbb-l4-01',
    titleNe: 'राष्ट्रिय वाणिज्य बैंक तह ४ (सहायक/नगद) पूर्वयोग्यता परीक्षा - सेट १',
    institution: 'Rastriya Banijya Bank (RBB)',
    level: 'तह ४ (Cashier/Assistant)',
    questionCount: 50,
    durationMinutes: 45,
    negativeMarkingPercent: 20,
    descriptionNe: 'लोक सेवा आयोग ढाँचा अनुसार ५० प्रश्नहरू र २०% ऋणात्मक अंक सहितको पूर्ण सिमुलेसन।'
  },
  {
    id: 'mock-adbl-l5-01',
    titleNe: 'कृषि विकास बैंक तह ५ (व्यवसाय सहायक) पूर्वयोग्यता परीक्षा - सेट १',
    institution: 'Agricultural Development Bank (ADBL)',
    level: 'तह ५ (Senior Assistant)',
    questionCount: 50,
    durationMinutes: 45,
    negativeMarkingPercent: 20,
    descriptionNe: 'ग्रामीण वित्त, कृषि कर्जा, सामान्य ज्ञान र सेवा सम्बन्धी ५० बहुवैकल्पिक प्रश्नहरू।'
  },
  {
    id: 'mock-psc-officer-01',
    titleNe: 'लोक सेवा आयोग शाखा अधिकृत / तह ६ पूर्वयोग्यता सामान्य अध्ययन - सेट १',
    institution: 'Public Service Commission (Loksewa)',
    level: 'तह ६ (Officer Level)',
    questionCount: 50,
    durationMinutes: 45,
    negativeMarkingPercent: 20,
    descriptionNe: 'नेपालको संविधान, शासन प्रणाली, समसामयिक विश्व र सार्वजनिक प्रशासन सम्बन्धी प्रश्नहरू।'
  }
];

export const MockTestsScreen: React.FC = () => {
  const { setActiveTab, addToast, user } = useApp();

  const [activeExam, setActiveExam] = useState<MockSetDefinition | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [examResultData, setExamResultData] = useState<any>(null);

  // Load exam questions from verified sets
  const startExam = (mockSet: MockSetDefinition) => {
    setActiveExam(mockSet);
    const sets = allFiftySets || [];
    let pool: any[] = [];
    sets.slice(0, 3).forEach(s => {
      if (s.questions) pool.push(...s.questions);
    });
    const selected = pool.slice(0, mockSet.questionCount);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setMarkedForReview({});
    setSecondsRemaining(mockSet.durationMinutes * 60);
    setIsExamCompleted(false);
    setShowSubmitConfirm(false);
    setExamResultData(null);
  };

  // Countdown timer with auto-submit
  useEffect(() => {
    if (!activeExam || isExamCompleted) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, isExamCompleted]);

  const handleSelectAnswer = (optionIdx: number | string) => {
    if (isExamCompleted) return;
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIdx
    }));
  };

  const toggleReviewCurrent = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  const handleSubmitExam = () => {
    setShowSubmitConfirm(false);
    setIsExamCompleted(true);

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (ans === undefined) {
        unattemptedCount += 1;
      } else if (String(ans) === String(q.correctAnswer)) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
        // Record into Mistake Book!
        DbService.recordMistake({
          questionId: q.id ? String(q.id) : `q-${idx}`,
          questionText: q.questionNepali || q.question,
          options: q.options ? q.options.map((o: any) => typeof o === 'string' ? o : o.textNepali || o.textEnglish) : [],
          userWrongAnswer: ans,
          correctAnswer: q.correctAnswer,
          explanation: q.explanationNepali || q.explanation || 'प्रमाणित समाधान।',
          subject: q.category || 'Mock Exam',
          difficulty: 'Medium'
        });
      }
    });

    const marksPerQuestion = 2; // Standard 2 marks per question in Bank Pre-Tests
    const rawScore = correctCount * marksPerQuestion;
    const negativeDeduction = incorrectCount * (marksPerQuestion * 0.20); // 20% negative marking
    const netMarks = Math.max(0, rawScore - negativeDeduction);
    const accuracy = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

    const result = {
      totalQuestions: questions.length,
      fullMarks: questions.length * marksPerQuestion,
      attemptedCount: correctCount + incorrectCount,
      correctCount,
      incorrectCount,
      unattemptedCount,
      rawScore,
      negativeDeduction: Number(negativeDeduction.toFixed(2)),
      netMarks: Number(netMarks.toFixed(2)),
      accuracy,
      timeUsedSeconds: (activeExam?.durationMinutes || 45) * 60 - secondsRemaining,
      passed: netMarks >= (questions.length * marksPerQuestion * 0.40) // 40% Pass Mark
    };

    setExamResultData(result);

    // Save to user activity log and student history
    DbService.addExamScore({
      userId: user?.id || 'guest',
      userName: user?.name || 'विद्यार्थी',
      userEmail: user?.email || '',
      quizId: activeExam?.id || 'mock-exam',
      quizTitle: activeExam?.titleNe || 'मोक टेस्ट',
      category: activeExam?.institution || 'Banking',
      mode: 'mock',
      score: result.netMarks,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      negativeDeduction: result.negativeDeduction,
      accuracy,
      timeElapsedSeconds: result.timeUsedSeconds,
      timestamp: new Date().toISOString()
    });

    // Update Daily Mission
    DbService.updateDailyMissionTask('mission-practice-mcqs', 20);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // VIEW 1: EXAM SELECTION CATALOG
  // ==========================================
  if (!activeExam) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>राष्ट्रिय स्तरको पूर्ण मोक परीक्षा केन्द्र (Full-Length Mock Test Engine)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            वास्तविक परीक्षा सिमुलेसन (Pre-Test Simulations)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ४५ मिनेट, ५० प्रश्न, लोक सेवा आयोगको २०% ऋणात्मक अङ्क प्रणाली सहितको वास्तविक परीक्षा अभ्यास
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AVAILABLE_MOCK_SETS.map(mSet => (
            <div 
              key={mSet.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-sky-700 dark:text-sky-400">{mSet.institution}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{mSet.level}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {mSet.titleNe}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {mSet.descriptionNe}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400 block">प्रश्न संख्या</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{mSet.questionCount} प्रश्न</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400 block">समय सीमा</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{mSet.durationMinutes} मिनेट</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400 block">ऋणात्मक अंक</span>
                    <strong className="text-rose-600 font-bold">{mSet.negativeMarkingPercent}%</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => startExam(mSet)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 rounded-xl transition-colors shadow-xs"
                >
                  <span>मोक परीक्षा सुरु गर्नुहोस्</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: EXAM RESULT ANALYTICS
  // ==========================================
  if (isExamCompleted && examResultData) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                examResultData.passed
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {examResultData.passed ? 'उत्तीर्ण (PASSED)' : 'अनुत्तीर्ण (NEEDS REVISION)'}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                मोक परीक्षा नतिजा विश्लेषण (Official Performance Report)
              </h1>
              <p className="text-xs text-slate-500 mt-1">{activeExam.titleNe}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">अन्तिम प्राप्त प्राप्ताङ्क:</span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {examResultData.netMarks} <span className="text-sm font-normal text-slate-400">/ {examResultData.fullMarks}</span>
              </p>
            </div>
          </div>

          {/* Metric Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800">
              <span className="text-xs text-emerald-700 dark:text-emerald-400">सही उत्तर (Correct)</span>
              <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 tabular-nums mt-1">
                {examResultData.correctCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-800">
              <span className="text-xs text-rose-700 dark:text-rose-400">गलत उत्तर (Incorrect)</span>
              <p className="text-xl font-bold text-rose-800 dark:text-rose-300 tabular-nums mt-1">
                {examResultData.incorrectCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800">
              <span className="text-xs text-amber-700 dark:text-amber-400">कट्टा अंक (-20%)</span>
              <p className="text-xl font-bold text-amber-800 dark:text-amber-300 tabular-nums mt-1">
                -{examResultData.negativeDeduction}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-800">
              <span className="text-xs text-sky-700 dark:text-sky-400">शुद्धता (Accuracy)</span>
              <p className="text-xl font-bold text-sky-800 dark:text-sky-300 tabular-nums mt-1">
                {examResultData.accuracy}%
              </p>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>प्रणाली सिफारिस (Next Recommended Steps):</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              तपाईंले यस परीक्षामा बिगार्नुभएका <strong>{examResultData.incorrectCount} वटा प्रश्नहरू</strong> तपाईंको Mistake Book मा स्वतः थपिएका छन्। परीक्षा दिनुपूर्व तिनीहरूको शुद्धीकरण गर्नुहोला।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveExam(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:hover:text-slate-100"
            >
              ← अर्को मोक टेस्ट छनोट
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('mistakes')}
                className="px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800"
              >
                Mistake Book मा जानुहोस्
              </button>
              <button
                type="button"
                onClick={() => startExam(activeExam)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-xl shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पुनः परीक्षा दिनुहोस् (Retake)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: ACTIVE FULL-SCREEN EXAM INTERFACE
  // ==========================================
  const activeQuestion = questions[currentIndex];
  const userCurrentChoice = answers[currentIndex];
  const isCurrentMarked = markedForReview[currentIndex];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Test Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {activeExam.titleNe}
          </h2>
          <span className="text-xs text-slate-500">
            प्रश्न {currentIndex + 1} / {questions.length} · २०% ऋणात्मक अङ्क
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-bold text-sm text-slate-800 dark:text-slate-100">
            <Clock className={`w-4 h-4 ${secondsRemaining < 300 ? 'text-rose-600 animate-pulse' : 'text-sky-600'}`} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
          >
            Submit Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Question Card (3 columns) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-sky-700 dark:text-sky-400">
              {activeQuestion?.category || 'सामान्य ज्ञान तथा बैंकिङ'}
            </span>
            <button
              type="button"
              onClick={toggleReviewCurrent}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                isCurrentMarked
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isCurrentMarked ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {activeQuestion?.questionNepali || activeQuestion?.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {(activeQuestion?.options || []).map((opt: any, oIdx: number) => {
              const optText = typeof opt === 'string' ? opt : opt.textNepali || opt.textEnglish;
              const optKey = typeof opt === 'object' && opt.key ? opt.key : ['A', 'B', 'C', 'D'][oIdx];
              const isSelected = String(userCurrentChoice) === String(oIdx) || String(userCurrentChoice) === String(optKey);

              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectAnswer(typeof opt === 'object' && opt.key ? opt.key : oIdx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-sky-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {optKey}
                  </span>
                  <span className="text-sm leading-relaxed">{optText}</span>
                </button>
              );
            })}
          </div>

          {/* Previous / Next Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>अघिल्लो</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white hover:text-sky-600 disabled:opacity-30"
            >
              <span>पछिल्लो</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Palette (1 column): Question Navigator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
            प्रश्न तालिका (Palette)
          </h4>

          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
            {questions.map((_, qIdx) => {
              const isAnswered = answers[qIdx] !== undefined;
              const isMarked = markedForReview[qIdx];
              const isCurrent = currentIndex === qIdx;

              let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
              if (isMarked) {
                btnClass = 'bg-amber-500 text-white font-bold';
              } else if (isAnswered) {
                btnClass = 'bg-emerald-600 text-white font-bold';
              }
              if (isCurrent) {
                btnClass += ' ring-2 ring-sky-500 ring-offset-1';
              }

              return (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => setCurrentIndex(qIdx)}
                  className={`h-8 w-8 rounded-lg text-xs flex items-center justify-center transition-all ${btnClass}`}
                >
                  {qIdx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span>उत्तर दिइएको ({Object.keys(answers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>पुनरावलोकनका लागि ({Object.keys(markedForReview).filter(k => markedForReview[Number(k)]).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span>बाँकी प्रश्नहरू ({questions.length - Object.keys(answers).length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Submission Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              मोक परीक्षा अन्तिम रूपमा बुझाउन चाहनुहुन्छ?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              तपाईंले <strong>{Object.keys(answers).length} / {questions.length} प्रश्नहरू</strong> को उत्तर दिनुभएको छ। बुझाइसकेपछि उत्तरहरू परिवर्तन गर्न पाइने छैन।
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:hover:text-slate-100"
              >
                अझै समय बाँकी छ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                पुष्टि गर्नुहोस् र अन्तिम नतिजा हेर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
