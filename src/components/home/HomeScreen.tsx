import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { ExamReadinessService } from '../../services/examReadinessService';
import { OFFICIAL_VACANCIES_DATA } from '../../data/vacanciesData';
import { DIGITAL_PRODUCTS_CATALOG } from '../../data/digitalProductsData';
import { CategoryExamsListPage } from './CategoryExamsListPage';
import { ExamOverviewPage } from './ExamOverviewPage';
import { PhaseTopicsPage } from './PhaseTopicsPage';
import { LessonDetailPage } from './LessonDetailPage';
import { NepalFlagEmblem } from '../common/NepalFlagEmblem';
import { OfficialTrustBadge } from '../common/OfficialTrustBadge';
import { ExamCalendarWidget } from '../common/ExamCalendarWidget';
import { AiSathiSection } from '../common/AiSathiSection';
import { PreTestEcosystemWidget } from '../common/PreTestEcosystemWidget';
import { SpacedRevisionWidget } from '../common/SpacedRevisionWidget';
import { HimalayanContourSvg } from '../common/HimalayanContourSvg';
import { 
  EXAM_CATEGORIES, 
  TARGET_EXAMS_DATA, 
  ExamCategory, 
  TargetExam, 
  ExamPhase, 
  ExamTopicDetail 
} from '../../data/examDrillDownData';
import { 
  Target, 
  BookOpen, 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Flame, 
  TrendingUp, 
  Building2, 
  Calendar,
  FileText,
  RotateCcw,
  Zap
} from 'lucide-react';

type DrillDownLevel = 'home' | 'category' | 'exam' | 'phase' | 'topic';

interface DrillDownState {
  level: DrillDownLevel;
  selectedCategoryId: 'banking' | 'enterprises' | 'loksewa' | null;
  selectedExamId: string | null;
  selectedPhaseId: string | null;
  selectedTopicId: string | null;
}

export const HomeScreen: React.FC = () => {
  const { setActiveTab, openNoteReader, user, openLoginModal, isLoggedIn } = useApp();

  const [drillDown, setDrillDown] = useState<DrillDownState>({
    level: 'home',
    selectedCategoryId: null,
    selectedExamId: null,
    selectedPhaseId: null,
    selectedTopicId: null
  });

  const [dailyMission, setDailyMission] = useState(DbService.getDailyMission());
  const [readiness, setReadiness] = useState(ExamReadinessService.calculateReadiness(user));

  useEffect(() => {
    setDailyMission(DbService.getDailyMission());
    setReadiness(ExamReadinessService.calculateReadiness(user));
  }, [user]);

  // Scroll to top smoothly whenever drill-down navigation occurs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    drillDown.level, 
    drillDown.selectedCategoryId, 
    drillDown.selectedExamId, 
    drillDown.selectedPhaseId, 
    drillDown.selectedTopicId
  ]);

  // Step 1: User selects category
  const handleSelectCategory = (categoryId: 'banking' | 'enterprises' | 'loksewa') => {
    setDrillDown({
      level: 'category',
      selectedCategoryId: categoryId,
      selectedExamId: null,
      selectedPhaseId: null,
      selectedTopicId: null
    });
  };

  // Step 2: User selects exam
  const handleSelectExam = (examId: string) => {
    const exam = TARGET_EXAMS_DATA[examId];
    setDrillDown(prev => ({
      level: 'exam',
      selectedCategoryId: exam?.categoryId || prev.selectedCategoryId || 'banking',
      selectedExamId: examId,
      selectedPhaseId: null,
      selectedTopicId: null
    }));
  };

  // Step 3: Phase drill-down
  const handleSelectPhase = (phaseId: string) => {
    setDrillDown(prev => ({
      ...prev,
      level: 'phase',
      selectedPhaseId: phaseId,
      selectedTopicId: null
    }));
  };

  // Step 4: Topic drill-down
  const handleSelectTopic = (topicId: string) => {
    setDrillDown(prev => ({
      ...prev,
      level: 'topic',
      selectedTopicId: topicId
    }));
  };

  // Back Navigation Handlers
  const handleBackToHome = () => {
    setDrillDown({
      level: 'home',
      selectedCategoryId: null,
      selectedExamId: null,
      selectedPhaseId: null,
      selectedTopicId: null
    });
  };

  const handleBackToCategory = () => {
    setDrillDown(prev => ({
      level: 'category',
      selectedCategoryId: prev.selectedCategoryId || 'banking',
      selectedExamId: null,
      selectedPhaseId: null,
      selectedTopicId: null
    }));
  };

  const handleBackToExam = () => {
    setDrillDown(prev => ({
      ...prev,
      level: 'exam',
      selectedPhaseId: null,
      selectedTopicId: null
    }));
  };

  const handleBackToPhase = () => {
    setDrillDown(prev => ({
      ...prev,
      level: 'phase',
      selectedTopicId: null
    }));
  };

  // Active Data Resolution
  const currentCategory: ExamCategory | undefined = drillDown.selectedCategoryId
    ? EXAM_CATEGORIES[drillDown.selectedCategoryId]
    : undefined;

  const currentExam: TargetExam | undefined = drillDown.selectedExamId 
    ? TARGET_EXAMS_DATA[drillDown.selectedExamId] || TARGET_EXAMS_DATA.nrb
    : undefined;

  const currentPhase: ExamPhase | undefined = currentExam && drillDown.selectedPhaseId
    ? currentExam.phases.find(p => p.id === drillDown.selectedPhaseId) || currentExam.phases[0]
    : undefined;

  const currentTopic: ExamTopicDetail | undefined = currentPhase && drillDown.selectedTopicId
    ? currentPhase.topics.find(t => t.id === drillDown.selectedTopicId) || currentPhase.topics[0]
    : undefined;

  // Level 4: Specific Lesson / Note Detail Page
  if (drillDown.level === 'topic' && currentExam && currentPhase && currentTopic) {
    return (
      <LessonDetailPage
        exam={currentExam}
        phase={currentPhase}
        topic={currentTopic}
        category={currentCategory}
        onBackToPhase={handleBackToPhase}
        onBackToExam={handleBackToExam}
        onBackToCategory={handleBackToCategory}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Level 3: Phase Topics Page
  if (drillDown.level === 'phase' && currentExam && currentPhase) {
    return (
      <PhaseTopicsPage
        exam={currentExam}
        phase={currentPhase}
        category={currentCategory}
        onBackToExam={handleBackToExam}
        onBackToCategory={handleBackToCategory}
        onBackToHome={handleBackToHome}
        onSelectTopic={handleSelectTopic}
      />
    );
  }

  // Level 2: Dedicated Exam Overview Page
  if (drillDown.level === 'exam' && currentExam) {
    return (
      <ExamOverviewPage
        exam={currentExam}
        category={currentCategory}
        onBackToHome={handleBackToHome}
        onBackToCategory={handleBackToCategory}
        onSelectPhase={handleSelectPhase}
      />
    );
  }

  // Level 1: Category Exams List Page
  if (drillDown.level === 'category' && currentCategory) {
    return (
      <CategoryExamsListPage
        category={currentCategory}
        onBackToHome={handleBackToHome}
        onSelectExam={handleSelectExam}
      />
    );
  }

  // Level 0: Signature World-Class Fintech + EdTech Redesigned Home Page
  return (
    <div className="space-y-24 sm:space-y-32 pb-24 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* =========================================================================
          1. HERO — THE SIGNATURE COMPOSITION (~75–80vh)
          Deep Midnight Navy (#060D1D) + Himalayan Topographic Contour + Floating Glass Panel
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-[#060D1D] text-white min-h-[72vh] flex items-center p-8 sm:p-12 lg:p-16 border border-slate-800/80 shadow-2xl">
        
        {/* Subtle Himalayan Topographic Contour Vector & Glowing Constellation Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <svg 
            className="w-full h-full opacity-35" 
            viewBox="0 0 1200 800" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="topo-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#2563EB" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0.05" />
              </linearGradient>
              <radialGradient id="aurora" cx="70%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#0B1B3D" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#060D1D" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Atmosphere */}
            <rect width="1200" height="800" fill="url(#aurora)" />

            {/* Himalayan Mountain Elevation Contours */}
            <path d="M -100 700 Q 200 480 500 560 T 1100 420 T 1400 520" stroke="url(#topo-glow)" strokeWidth="1.5" />
            <path d="M -100 640 Q 250 420 600 500 T 1200 360 T 1400 460" stroke="url(#topo-glow)" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M -100 580 Q 300 360 700 440 T 1300 300 T 1400 400" stroke="url(#topo-glow)" strokeWidth="1.5" />
            <path d="M -100 520 Q 350 300 800 380 T 1400 240" stroke="url(#topo-glow)" strokeWidth="1" />
            <path d="M -100 460 Q 400 240 900 320 T 1400 180" stroke="url(#topo-glow)" strokeWidth="1.8" />
            <path d="M -100 400 Q 450 180 1000 260 T 1400 120" stroke="url(#topo-glow)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Neural Knowledge Network Grid Points */}
            <g stroke="#38BDF8" strokeOpacity="0.2" strokeWidth="0.75">
              <line x1="300" y1="360" x2="450" y2="180" />
              <line x1="450" y1="180" x2="650" y2="240" />
              <line x1="650" y1="240" x2="800" y2="380" />
              <line x1="650" y1="240" x2="900" y2="160" />
              <line x1="900" y1="160" x2="1050" y2="220" />
            </g>

            {/* Constellation Nodes */}
            <circle cx="300" cy="360" r="3.5" fill="#38BDF8" fillOpacity="0.6" />
            <circle cx="450" cy="180" r="4.5" fill="#60A5FA" fillOpacity="0.8" />
            <circle cx="650" cy="240" r="3" fill="#38BDF8" fillOpacity="0.5" />
            <circle cx="800" cy="380" r="4" fill="#C5A059" fillOpacity="0.7" />
            <circle cx="900" cy="160" r="5" fill="#38BDF8" fillOpacity="0.9" />
            <circle cx="1050" cy="220" r="3.5" fill="#60A5FA" fillOpacity="0.6" />
          </svg>
        </div>

        {/* Hero Grid: Typography Left, Floating Intelligence Panel Right */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold, Confident Typography (7 Spans) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Small Label with Official Nepal Double-Pennant Flag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider text-sky-200">
              <NepalFlagEmblem className="w-3.5 h-4.5 drop-shadow-xs shrink-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>नेपालको प्रिमियम बैंकिङ तथा लोक सेवा परीक्षा मञ्च</span>
            </div>

            {/* Signature Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Banking Exam तयारी <br />
                <span className="bg-gradient-to-r from-sky-300 via-white to-amber-200 bg-clip-text text-transparent">
                  अब Smart बनाउनुहोस्।
                </span>
              </h1>
              
              {/* Supporting Line */}
              <p className="text-sm sm:text-base font-medium tracking-wide text-slate-300 pt-2">
                NRB • RBB • ADBL • NBL • Commercial Banks
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('learn')}
                className="flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-[#060D1D] bg-white hover:bg-slate-100 rounded-xl transition-all shadow-xl hover:shadow-white/10 active:scale-95 cursor-pointer"
              >
                <span>तयारी सुरु गर्नुहोस्</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mock-tests')}
                className="flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-md rounded-xl border border-white/15 transition-all active:scale-95 cursor-pointer"
              >
                <Award className="w-4 h-4 text-sky-400" />
                <span>Free Mock Test</span>
              </button>
            </div>

            {/* Trust Line */}
            <div className="pt-4 border-t border-white/10 text-xs font-medium text-slate-400 tracking-wider">
              Real Questions • Smart Practice • Detailed Analysis
            </div>
          </div>

          {/* Right Column: Floating Intelligence Panel (5 Spans) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/[0.06] backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-6 hover:border-white/25 transition-all">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    Your Preparation
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-sky-300">
                  Live Adaptive
                </span>
              </div>

              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-300 font-medium">Overall Progress</span>
                  <span className="text-3xl font-black tracking-tight text-white tabular-nums">
                    {readiness.overallReadinessScore}%
                  </span>
                </div>
                
                {/* Minimal Sleek Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${readiness.overallReadinessScore}%` }}
                  />
                </div>
              </div>

              {/* Subject Breakdowns */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-300">Banking Awareness</span>
                  <strong className="text-white tabular-nums font-bold">84%</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-300">Quantitative & Accounting</span>
                  <strong className="text-white tabular-nums font-bold">61%</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-300">Banking Law & Governance</span>
                  <strong className="text-white tabular-nums font-bold">76%</strong>
                </div>
              </div>

              {/* Smart Recommendation Block */}
              <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300 block">
                  Recommended for you
                </span>
                <p className="text-xs font-semibold text-white">
                  Banking Law (NRB Act २०५८) • 10 Questions
                </p>
                <p className="text-[11px] text-slate-400">
                  Targeted review to boost your weakest 61% accuracy bracket.
                </p>
              </div>

              {/* Continue CTA */}
              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                className="w-full py-3 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PERSONALIZED HOME — FOR ACTIVE & RETURNING LEARNERS
          "Good morning, {name}. Let's continue where you stopped."
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">
              Personalized Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              नमस्ते, {user?.name && user.name !== 'विद्यार्थी' ? user.name : 'परीक्षार्थी मित्र'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Let's continue where you stopped. तपाईंको अध्ययन यात्रा निरन्तर राख्नुहोस्।
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{user?.streak || 1} Day Streak</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Target: {user?.targetExam || 'NRB Level 4'}
            </span>
          </div>
        </div>

        {/* Single Dominant "CONTINUE LEARNING" Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
                Active Chapter
              </span>
              <span className="text-xs text-slate-400">
                नेपाल राष्ट्र बैंक ऐन, २०५८ (दफावार विश्लेषण)
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              अध्याय ४: बैंकको काम, कर्तव्य, अधिकार तथा मौद्रिक सञ्चालन
            </h3>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <span>प्रगति: <strong className="text-white">६८% अध्ययन सम्पन्न</strong></span>
              <span>•</span>
              <span>अन्तिम नतिजा: <strong className="text-emerald-400">८५% शुद्धता</strong></span>
              <span>•</span>
              <span>अनुमानित समय: <strong className="text-slate-200">१५ मिनेट बाँकी</strong></span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => openNoteReader('नेपाल राष्ट्र बैंक ऐन, २०५८')}
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. EXAM SELECTOR — LUXURY HORIZONTAL SELECTOR
          "Choose your target exam"
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">
              Curriculum Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Choose your target exam
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              प्रत्येक संस्थाको विशिष्ट परीक्षा ढाँचा, चरणहरू र आधिकारिक पाठ्यक्रम
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('banks')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>सबै बैंक हब</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Luxury Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              id: 'nrb',
              code: 'NRB',
              nameNe: 'नेपाल राष्ट्र बैंक',
              sub: 'तह ४ सहायक & तह ६ अधिकृत',
              badge: 'केन्द्रीय बैंक',
              color: 'hover:border-sky-500',
              accent: 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
            },
            {
              id: 'rbb',
              code: 'RBB',
              nameNe: 'राष्ट्रिय वाणिज्य बैंक',
              sub: 'तह ४ सहायक/नगद & तह ५',
              badge: 'वाणिज्य बैंक',
              color: 'hover:border-blue-500',
              accent: 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
            },
            {
              id: 'adbl',
              code: 'ADBL',
              nameNe: 'कृषि विकास बैंक',
              sub: 'तह ४ लेखापाल & तह ५ व्यवसाय',
              badge: 'विकास बैंक',
              color: 'hover:border-emerald-500',
              accent: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            },
            {
              id: 'nbl',
              code: 'NBL',
              nameNe: 'नेपाल बैंक लिमिटेड',
              sub: 'तह ३ कनिष्ठ सहायक & तह ४',
              badge: 'प्रथम बैंक',
              color: 'hover:border-amber-500',
              accent: 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
            },
            {
              id: 'commercial',
              code: 'PSC / CORP',
              nameNe: 'लोक सेवा तथा संस्थान',
              sub: 'शाखा अधिकृत, NTC, NEA, CIT',
              badge: 'सार्वजनिक सेवा',
              color: 'hover:border-purple-500',
              accent: 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
            }
          ].map(inst => (
            <div
              key={inst.id}
              onClick={() => {
                if (inst.id in TARGET_EXAMS_DATA) {
                  handleSelectExam(inst.id);
                } else {
                  handleSelectCategory('banking');
                }
              }}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between space-y-4 group ${inst.color}`}
            >
              <div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${inst.accent}`}>
                  {inst.badge}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-3">
                  {inst.code}
                </h3>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {inst.nameNe}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {inst.sub}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-sky-600 transition-colors">
                <span>Explore Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. STORYTELLING STATISTICS (SECTION 15)
          Full-width storytelling with massive typography and generous whitespace
          ========================================================================= */}
      <section className="py-12 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
              १०,०००+
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
              REAL QUESTIONS
            </p>
            <p className="text-xs text-slate-500">
              दफावार कानुनी सन्दर्भ र प्रमाणित व्याख्या सहित
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
              १००+
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
              MOCK TESTS
            </p>
            <p className="text-xs text-slate-500">
              वास्तविक २०% ऋणात्मक अङ्क प्रणाली सहित
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              DAILY
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
              CURRENT AFFAIRS
            </p>
            <p className="text-xs text-slate-500">
              नेपाल राष्ट्र बैंक परिपत्र र आर्थिक सूचकांक
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              ALL MAJOR
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
              BANKING EXAMS
            </p>
            <p className="text-xs text-slate-500">
              NRB, RBB, ADBL, NBL तथा लोक सेवा आयोग
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4.5. LIVE UPCOMING EXAM CALENDAR
          Official exam schedule tracking days remaining and time slots
          ========================================================================= */}
      <section>
        <ExamCalendarWidget />
      </section>

      {/* =========================================================================
          5. SMART PRACTICE — "Practice that adapts to you." (SECTIONS 8 & 9)
          Sophisticated editorial layout showing NEW, WEAK TOPICS, and REVISION
          ========================================================================= */}
      <section className="space-y-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sky-600 block mb-1">
            Intelligent Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Practice that adapts to you.
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            तपाईंको कमजोरी पत्ता लगाई दोहोर्याउने र नयाँ प्रश्न छनोट गर्ने स्वचालित प्राज्ञिक प्रणाली
          </p>
        </div>

        {/* 3 Sophisticated Modes Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Mode 1: NEW */}
          <div className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
                NEW • FRESH MCQS
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                नयाँ वस्तुगत अभ्यास
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Fresh questions selected for you. पछिल्ला परिपत्र, बजेट वक्तव्य र संशोधित कानुनी दफाहरूबाट संकलित नयाँ प्रश्नहरू।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="w-full py-3 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Start Fresh Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode 2: WEAK TOPICS */}
          <div className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase tracking-wider">
                ADAPTIVE WEAK TOPICS
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                कमजोर विषय सुदृढीकरण
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Recommended because your accuracy in Banking Law & Accounting is 54%. बिग्रेका प्रश्नहरूबाट सिफारिस गरिएको अभ्यास।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('mistakes')}
              className="w-full py-3 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Strengthen Weak Areas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode 3: REVISION */}
          <div className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 uppercase tracking-wider">
                SPACED REPETITION
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                स्मरण तालिका (Revision)
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Questions that need another look. वैज्ञानिक अन्तराल अनुसार आज दोहोर्याउनुपर्ने प्रश्नहरू जसले बिर्सने जोखिम हटाउँछ।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('revision')}
              className="w-full py-3 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Review Due Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5.5. SPACED REVISION & MISTAKE WORKBENCH
          Spaced repetition widget preventing forgetting curve
          ========================================================================= */}
      <section>
        <SpacedRevisionWidget />
      </section>

      {/* =========================================================================
          6. MOCK TESTS — "Test yourself under real exam conditions." (SECTION 10)
          ========================================================================= */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-rose-600 block mb-1">
              Examination Simulator
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Test yourself under real exam conditions.
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              ४५ मिनेट, ५०–१०० प्रश्नहरू र २०% ऋणात्मक अंक सहितको वास्तविक परीक्षा हलको अनुभव
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('mock-tests')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>सबै मोक टेस्टहरू</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Flagship Mocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'nrb-mock',
              title: 'NRB Assistant (Level 4)',
              inst: 'नेपाल राष्ट्र बैंक',
              questions: '50 Qs',
              time: '45 Min',
              bestScore: '82/100',
              accuracy: '88%'
            },
            {
              id: 'rbb-mock',
              title: 'RBB Cashier / Assistant',
              inst: 'राष्ट्रिय वाणिज्य बैंक',
              questions: '50 Qs',
              time: '45 Min',
              bestScore: '74/100',
              accuracy: '81%'
            },
            {
              id: 'adbl-mock',
              title: 'ADBL Business Assistant',
              inst: 'कृषि विकास बैंक',
              questions: '50 Qs',
              time: '45 Min',
              bestScore: '78/100',
              accuracy: '84%'
            },
            {
              id: 'nbl-mock',
              title: 'NBL Junior Assistant',
              inst: 'नेपाल बैंक लिमिटेड',
              questions: '50 Qs',
              time: '45 Min',
              bestScore: '71/100',
              accuracy: '79%'
            },
          ].map(mock => (
            <div 
              key={mock.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-5 hover:border-slate-400 dark:hover:border-slate-600 transition-all hover:shadow-lg"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500">
                  {mock.inst}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {mock.title}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>{mock.questions}</span>
                  <span>•</span>
                  <span>{mock.time}</span>
                  <span>•</span>
                  <span className="text-rose-600 font-semibold">-20% Neg</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Benchmark</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{mock.bestScore}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('mock-tests')}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-950 dark:bg-sky-600 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Start Mock</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6.5. PRE-TEST ECOSYSTEM DEEP ARCHITECTURE (SECTION 11)
          Clear simulation standards & passing mark metrics
          ========================================================================= */}
      <section>
        <PreTestEcosystemWidget />
      </section>

      {/* =========================================================================
          6.8. AI SATHI ACADEMIC COMPANION
          Dedicated 24/7 AI tutor section
          ========================================================================= */}
      <section>
        <AiSathiSection />
      </section>

      {/* =========================================================================
          7. CURRENT AFFAIRS — EDITORIAL LAYOUT (SECTION 12)
          1 Large Featured Story + 3 Supporting Stories
          ========================================================================= */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">
              Policy & Gazette Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Current Affairs & Banking Insights
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              मौद्रिक नीति, आर्थिक सर्वेक्षण, नेपाल राष्ट्र बैंकका परिपत्र र परीक्षामा सोधिने समसामयिक विश्लेषण
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('current-affairs')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>सम्पूर्ण समसामयिक</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Large Featured Story (7 Spans) */}
          <div 
            onClick={() => setActiveTab('current-affairs')}
            className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col justify-between space-y-6 cursor-pointer hover:bg-slate-800/90 transition-all border border-slate-800 shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  FEATURED EDITORIAL • मौद्रिक नीति
                </span>
                <span className="text-xs text-slate-400">२०८१ फागुन</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                नेपाल राष्ट्र बैंकको नवीनतम मौद्रिक समीक्षा तथा अनिवार्य नगद अनुपात (CRR) नीतिगत प्रभाव
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                बैंकिङ तरलता व्यवस्थापन, अन्तरबैंक ब्याजदर, नीतिगत दर (Policy Rate) तथा बैंक तथा वित्तीय संस्थाको निक्षेप लागतमा पर्ने असरको परीक्षामुखी विश्लेषण। यस विषयबाट ५ अङ्कको संक्षिप्त टिप्पणी सोधिने प्रबल सम्भावना छ।
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-sky-300">
              <span>विस्तृत परीक्षा बुँदाहरू पढ्नुहोस्</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 3 Supporting Stories (5 Spans) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {[
              {
                category: 'Economy',
                title: 'विदेशी विनिमय सञ्चिति र भुक्तानी सन्तुलन (BOP) को पछिल्लो अवस्था',
                date: 'फागुन १५, २०८१',
                tag: 'आर्थिक सर्वेक्षण'
              },
              {
                category: 'Regulation',
                title: 'सम्पत्ति शुद्धीकरण निवारण (AML/CFT) दोस्रो संशोधन ऐन र बैंकहरूको दायित्व',
                date: 'फागुन १०, २०८१',
                tag: 'कानुनी व्यवस्था'
              },
              {
                category: 'Global',
                title: 'डिजिटल करेन्सी (CBDC) र भर्चुअल बैंकिङ: नेपालका लागि अवसर र जोखिम',
                date: 'फागुन ०५, २०८१',
                tag: 'फिनटेक प्रविधि'
              }
            ].map((story, sIdx) => (
              <div
                key={sIdx}
                onClick={() => setActiveTab('current-affairs')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer space-y-1.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-sky-600 uppercase tracking-wider">{story.category}</span>
                  <span>{story.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {story.title}
                </h4>
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 font-medium">
                  <span>{story.tag}</span>
                  <span className="text-sky-600 font-bold flex items-center gap-1">पढ्नुहोस् →</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. VACANCIES — OPPORTUNITY BOARD (SECTION 13)
          Direct link from vacancy notice to exam preparation
          ========================================================================= */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 block mb-1">
              Active Career Notices
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Official Vacancies & Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              प्रमाणित खुला पदपूर्ति सूचनाहरू र सिधै सम्बन्धित पाठ्यक्रममा तयारी सुरु गर्नुहोस्
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('vacancies')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>सबै पदपूर्ति ({OFFICIAL_VACANCIES_DATA.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFICIAL_VACANCIES_DATA.slice(0, 3).map(vac => (
            <div 
              key={vac.id}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600 uppercase tracking-wider">{vac.organizationNameNe}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">{vac.level}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {vac.postTitleNe}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  माग पद: <strong className="text-slate-900 dark:text-white">{vac.totalOpenings}</strong> • अन्तिम मिति: <strong className="text-emerald-600">{vac.applicationDeadlineBS}</strong>
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="w-full py-2.5 text-xs font-bold text-white bg-slate-950 dark:bg-sky-600 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Prepare for this exam</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. PREMIUM PLAN COMPARISON (SECTION 16)
          Subtle, elegant, non-aggressive comparison of Free vs Premium
          ========================================================================= */}
      <section className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            Elegantly Structured Preparation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Choose how you want to prepare.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            आधारभूत निःशुल्क अभ्यास वा व्यक्तिगत प्रगति ट्र्याकिङ सहितको पूर्ण डिजिटल ग्रन्थहरू
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Standard Plan */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Standard
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">निःशुल्क</span>
                <span className="text-xs text-slate-500">/ आजीवन</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                दैनिक अभ्यास र पाठ्यक्रम बुझ्नका लागि आदर्श खुला स्रोत।
              </p>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">✓ अद्यावधिक परीक्षा पाठ्यक्रम (Syllabus)</li>
                <li className="flex items-center gap-2">✓ दैनिक २० वस्तुगत प्रश्न अभ्यास (Daily MCQs)</li>
                <li className="flex items-center gap-2">✓ आधारभूत नमुना मोक टेस्ट</li>
                <li className="flex items-center gap-2">✓ खुला पदपूर्ति तथा विज्ञापन सूचनाहरू</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="w-full py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              निःशुल्क सुरु गर्नुहोस्
            </button>
          </div>

          {/* Premium Plan - Highlighted with Subtle Champagne Gold */}
          <div className="p-8 rounded-3xl bg-[#060D1D] text-white border border-[#C5A059]/40 space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
              RECOMMENDED
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Full Preparation Pass
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">रू ५०० – ८५०</span>
                <span className="text-xs text-slate-400">/ पुस्तक वा बन्डल</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ५० सेट पूर्ण प्रश्न बैंक, Mistake Book र अफलाइन डाउनलोडयोग्य A4 PDFs।
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2 text-white">✓ ५० सेट पूर्ण पूर्वयोग्यता सिमुलेसन (२,५०० प्रश्न)</li>
                <li className="flex items-center gap-2 text-white">✓ स्वचालित Mistake Book र Spaced Repetition</li>
                <li className="flex items-center gap-2 text-white">✓ उच्च गुणस्तरको प्रिन्ट गर्न मिल्ने A4 PDF डाउनलोड</li>
                <li className="flex items-center gap-2 text-white">✓ विस्तृत दफावार व्याख्या र विषयगत नमुना उत्तर</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className="w-full py-3 text-xs font-bold text-[#060D1D] bg-[#C5A059] hover:bg-[#d6b46e] rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              डिजिटल स्टोर हेर्नुहोस्
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeScreen;
