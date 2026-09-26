import React from 'react';
import { Calendar, Clock, ArrowRight, Building2, Landmark, Scale, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface ExamCalendarItem {
  id: string;
  examCode: string;
  organizationNe: string;
  levelNe: string;
  stageNe: string;
  dateBS: string;
  timeNe: string;
  adNumberNe: string;
  daysRemainingApprox: number;
  badgeType: 'urgent' | 'upcoming' | 'announced';
  syllabusTabExamId?: string;
}

export const EXAM_CALENDAR_ITEMS: ExamCalendarItem[] = [
  {
    id: 'cal-nrb-l4',
    examCode: 'NRB L-4',
    organizationNe: 'नेपाल राष्ट्र बैंक',
    levelNe: 'सहायक (प्रशासन) - तह ४',
    stageNe: 'प्रथम चरण (पूर्वयोग्यता परीक्षा)',
    dateBS: '२०८२ जेठ १७ गते',
    timeNe: 'बिहान ८:०० बजे',
    adNumberNe: 'विज्ञापन नं. ०२/२०८१/८२',
    daysRemainingApprox: 54,
    badgeType: 'upcoming',
    syllabusTabExamId: 'nrb'
  },
  {
    id: 'cal-rbb-l4',
    examCode: 'RBB L-4',
    organizationNe: 'राष्ट्रिय वाणिज्य बैंक लिमिटेड',
    levelNe: 'सहायक / नगद - तह ४',
    stageNe: 'प्रथम चरण (पूर्वयोग्यता परीक्षा)',
    dateBS: '२०८२ असार ०७ गते',
    timeNe: 'दिनको २:०० बजे',
    adNumberNe: 'विज्ञापन नं. ०३/२०८१/८२',
    daysRemainingApprox: 75,
    badgeType: 'upcoming',
    syllabusTabExamId: 'rbb'
  },
  {
    id: 'cal-adbl-l5',
    examCode: 'ADBL L-5',
    organizationNe: 'कृषि विकास बैंक लिमिटेड',
    levelNe: 'व्यवसाय सहायक - तह ५',
    stageNe: 'लिखित परीक्षा (प्रथम पत्र)',
    dateBS: '२०८२ असार २८ गते',
    timeNe: 'बिहान ८:०० बजे',
    adNumberNe: 'सूचना नं. ०४/२०८१/८२',
    daysRemainingApprox: 96,
    badgeType: 'announced',
    syllabusTabExamId: 'adbl'
  },
  {
    id: 'cal-psc-officer',
    examCode: 'PSC Off',
    organizationNe: 'लोक सेवा आयोग',
    levelNe: 'शाखा अधिकृत (अप्राविधिक)',
    stageNe: 'प्रथम चरण (सामान्य ज्ञान र सीप परीक्षण)',
    dateBS: '२०८२ जेठ २४ गते',
    timeNe: 'बिहान ११:०० बजे',
    adNumberNe: 'रा.प.तृतीय श्रेणी',
    daysRemainingApprox: 61,
    badgeType: 'upcoming',
    syllabusTabExamId: 'loksewa'
  }
];

export const ExamCalendarWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setActiveTab } = useApp();

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              आगामी परीक्षा क्यालेन्डर (Exam Calendar)
            </h3>
            <p className="text-xs text-slate-500">
              लोक सेवा आयोग तथा बैंकहरूद्वारा निर्धारित परीक्षा मितिहरू
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('vacancies')}
          className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 cursor-pointer"
        >
          <span>सबै हेर्नुहोस्</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Calendar Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {EXAM_CALENDAR_ITEMS.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-3 hover:border-sky-500/50 transition-all hover:shadow-xs group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-[11px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  {item.examCode}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                  ~{item.daysRemainingApprox} दिन बाँकी
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                {item.organizationNe}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                {item.levelNe}
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {item.stageNe}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span className="tabular-nums">{item.dateBS}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                className="text-[11px] font-bold text-sky-600 group-hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 cursor-pointer"
              >
                <span>तयारी</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamCalendarWidget;
