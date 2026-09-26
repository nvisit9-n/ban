import React, { useState } from 'react';
import { Sparkles, Bot, ArrowRight, MessageSquare, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiSathiSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setIsAiAssistantOpen } = useApp();

  const samplePrompts = [
    {
      q: 'नेपाल राष्ट्र बैंक ऐन २०५८ को दफा ४ मा उल्लेखित बैंकका उद्देश्यहरू के-के हुन्?',
      subject: 'Banking Law'
    },
    {
      q: 'अनिवार्य नगद अनुपात (CRR) र वैधानिक तरलता अनुपात (SLR) बीच मुख्य भिन्नता के हो?',
      subject: 'Monetary Economics'
    },
    {
      q: 'बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA २०७३) अनुसार कर्जा असुली सम्बन्धी व्यवस्था बुझाइदिनुहोस्।',
      subject: 'Banking Directives'
    }
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B1B3D] to-slate-950 text-white p-7 sm:p-10 border border-slate-800 shadow-2xl ${className}`}
    >
      {/* Background Subtle Aurora Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-500 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-700 blur-3xl" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: AI Assistant Intro */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI साथी (AI Sathi Study Companion)</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              बैंकिङ्ग अध्ययनमा तत्काल स्पष्टीकरण र प्राज्ञिक उत्तर ढाँचा
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              कुनै पनि कानुनी दफा, लेखा सिद्धान्त, आर्थिक नीति वा समसामयिक घटनामा द्विविधा छ? नेपाल राष्ट्र बैंक परिपत्र र परीक्षा मापदण्ड अनुसार २४/७ विस्तृत स्पष्टीकरण पाउनुहोस्।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAiAssistantOpen(true)}
              className="px-6 py-3 text-xs font-bold text-[#060D1D] bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-sky-600" />
              <span>AI साथीसँग सोध्नुहोस् (Ask AI Sathi)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Bilingual (नेपाली / English) • Real Statutory References
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Prompt Previews */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 block font-bold">
            विद्यार्थीहरूले बारम्बार सोध्ने प्रश्नहरू (Quick Ask):
          </span>

          <div className="space-y-2.5">
            {samplePrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIsAiAssistantOpen(true)}
                className="w-full text-left p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all flex items-start justify-between gap-3 text-xs group cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider block">
                    {item.subject}
                  </span>
                  <p className="text-slate-200 group-hover:text-white line-clamp-2 leading-relaxed font-medium">
                    {item.q}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-300 shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSathiSection;
