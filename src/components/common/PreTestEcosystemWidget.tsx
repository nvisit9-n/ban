import React from 'react';
import { Award, CheckCircle2, Clock, ArrowRight, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PreTestEcosystemWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setActiveTab } = useApp();

  const rules = [
    {
      titleNe: '५० वस्तुगत बहुवैकल्पिक प्रश्न (50 MCQs)',
      descNe: 'प्रत्येक प्रश्नको २ अङ्क, पूर्णाङ्क १०० र उत्तीर्णाङ्क ४० प्रतिशत।'
    },
    {
      titleNe: '४५ मिनेट कडा समयसीमा (45-Minute Timer)',
      descNe: 'समय समाप्त भएपछि स्वचालित रूपमा परीक्षा सबमिट हुने व्यवस्था।'
    },
    {
      titleNe: '२०% ऋणात्मक अङ्क प्रणाली (-20% Negative Marking)',
      descNe: 'प्रत्येक गलत उत्तरबापत ०.४ अङ्क कट्टा हुने वास्तविक परीक्षा नियम।'
    },
    {
      titleNe: 'विस्तृत दफावार विश्लेषण (Detailed Statutory Analytics)',
      descNe: 'परीक्षा सकिएलगत्तै कुन विषयमा कति प्रतिशत शुद्धता आयो तत्काल ग्राफ र प्रतिवेदन।'
    }
  ];

  return (
    <div className={`p-7 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-8 ${className}`}>
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold block mb-1">
            Pre-Test Examination Architecture
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            पूर्वयोग्यता परीक्षा (Pre-Test) इकोसिस्टम
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            नेपाल राष्ट्र बैंक, राष्ट्रिय वाणिज्य बैंक तथा लोक सेवा आयोगको प्रथम चरण परीक्षा ढाँचा हुबहु मिल्ने गरी निर्माण गरिएको सिम्युलेटर।
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('mock-tests')}
          className="px-6 py-3 text-xs font-bold text-white bg-slate-950 dark:bg-sky-600 hover:bg-slate-800 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Award className="w-4 h-4 text-sky-400" />
          <span>लाइभ पूर्वयोग्यता मोक सुरु गर्नुहोस्</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-2 flex flex-col justify-between shadow-2xs"
          >
            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center font-mono font-black text-xs">
                {idx + 1}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {rule.titleNe}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {rule.descNe}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreTestEcosystemWidget;
