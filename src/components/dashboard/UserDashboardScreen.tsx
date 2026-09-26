import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { ExamReadinessService } from '../../services/examReadinessService';
import { 
  Target, 
  Flame, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const UserDashboardScreen: React.FC = () => {
  const { user, setActiveTab, openNoteReader, addToast } = useApp();

  const [dailyMission, setDailyMission] = useState(DbService.getDailyMission());
  const [readiness, setReadiness] = useState(ExamReadinessService.calculateReadiness(user));
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [dueRevisionCount, setDueRevisionCount] = useState<number>(0);

  useEffect(() => {
    setDailyMission(DbService.getDailyMission());
    setReadiness(ExamReadinessService.calculateReadiness(user));
    setMistakesCount(DbService.getMistakes().filter(m => !m.isMastered).length);
    setDueRevisionCount(DbService.getDueRevisionItems().length);
  }, [user]);

  const targetExamName = user?.targetExam || 'नेपाल राष्ट्र बैंक (तह ४/६)';

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Target Exam Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>लक्षित परीक्षा: {targetExamName}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            नमस्ते, {user?.name || 'परीक्षार्थी मित्र'}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            आजको अध्ययन योजना, अभ्यास तथ्याङ्क र परीक्षा तयारी प्रगतिको वास्तविक स्थिति
          </p>
        </div>

        {/* Study Streak & XP */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-center min-w-24">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Streak</span>
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
              {user?.streak || 1} दिन
            </p>
          </div>

          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl text-center min-w-24">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-sky-500" />
              <span>Study XP</span>
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
              {user?.xp || 250}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Mission & Preparation Readiness */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Mission (4 points) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  आजको अध्ययन मिसन (Today's Mission)
                </h2>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                प्रगति: {dailyMission.overallProgress}%
              </span>
            </div>

            <div className="space-y-3">
              {dailyMission.tasks.map(task => (
                <div 
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    task.isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        DbService.updateDailyMissionTask(task.id, 1);
                        setDailyMission(DbService.getDailyMission());
                        addToast(`'${task.titleNe}' कार्य सम्पन्न भयो!`, 'success');
                      }}
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs mt-0.5 border transition-colors ${
                        task.isCompleted
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {task.isCompleted && '✓'}
                    </button>
                    <div>
                      <p className={`text-xs font-bold ${task.isCompleted ? 'text-emerald-900 dark:text-emerald-200 line-through' : 'text-slate-900 dark:text-white'}`}>
                        {task.titleNe}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.descriptionNe}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab(task.linkTab)}
                    className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline shrink-0"
                  >
                    <span>सुरु गर्नुहोस्</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Readiness Index */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    तयारी तत्परता सूचक (Preparation Readiness Index)
                  </h3>
                  <p className="text-xs text-slate-500">
                    पारदर्शी सूत्रमा आधारित सिकाइ प्रगति मीटर (नतिजा अनुमान होइन)
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                {readiness.overallReadinessScore}%
              </span>
            </div>

            {/* Formula Breakdown Progress Bars */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>पाठ्यक्रम कभरेज (Syllabus Coverage - ३०% भार):</span>
                  <strong className="text-slate-900 dark:text-white">{readiness.breakdown.syllabusCoveragePercent}%</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: `${readiness.breakdown.syllabusCoveragePercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>अभ्यास शुद्धता (Practice Accuracy - २५% भार):</span>
                  <strong className="text-slate-900 dark:text-white">{readiness.breakdown.practiceAccuracyPercent}%</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${readiness.breakdown.practiceAccuracyPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>मोक टेस्ट नतिजा (Mock Test Performance - २५% भार):</span>
                  <strong className="text-slate-900 dark:text-white">{readiness.breakdown.mockTestAveragePercent}%</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${readiness.breakdown.mockTestAveragePercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>रिभिजन सम्पन्नता (Revision Completion - १०% भार):</span>
                  <strong className="text-slate-900 dark:text-white">{readiness.breakdown.revisionCompletionPercent}%</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${readiness.breakdown.revisionCompletionPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <strong>सिफारिस: </strong>{readiness.suggestedAction}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Review Due, Weak Areas & Shortcuts */}
        <div className="space-y-6">
          {/* Quick Action Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>शीघ्र पहुँच (Quick Study Actions)</span>
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveTab('mistakes')}
                className="w-full p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-left flex items-center justify-between hover:bg-rose-100/50 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-rose-900 dark:text-rose-200">Mistake Book</p>
                  <p className="text-xs text-slate-500">{mistakesCount} त्रुटिहरू सुधार गर्न बाँकी</p>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-500" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('revision')}
                className="w-full p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-left flex items-center justify-between hover:bg-amber-100/50 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Spaced Revision</p>
                  <p className="text-xs text-slate-500">{dueRevisionCount} बुँदाहरू आज दोहोर्याउने</p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mock-tests')}
                className="w-full p-3 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 text-left flex items-center justify-between hover:bg-sky-100/50 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-sky-900 dark:text-sky-200">Pre-Test Mock Exam</p>
                  <p className="text-xs text-slate-500">४५ मिनेट पूर्ण सिमुलेसन</p>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-500" />
              </button>
            </div>
          </div>

          {/* Strong vs Weak Subjects */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>विषयगत सबल तथा सुधार क्षेत्र</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold block mb-1">
                  ✓ बलियो पकड भएका विषयहरू:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-2">
                  {readiness.strongSubjects.map((s, idx) => (
                    <li key={idx}>· {s}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-amber-700 dark:text-amber-400 font-semibold block mb-1">
                  ▲ बढी अभ्यास आवश्यक विषयहरू:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-2">
                  {readiness.weakSubjects.map((w, idx) => (
                    <li key={idx}>· {w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
