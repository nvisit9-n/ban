import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_VACANCIES_DATA } from '../../data/vacanciesData';
import { VacancyItem } from '../../types';
import { 
  Building2, 
  Calendar, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const VacancyCenterScreen: React.FC = () => {
  const { setActiveTab, addToast } = useApp();

  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVacancies = OFFICIAL_VACANCIES_DATA.filter(v => {
    const matchesOrg = selectedOrgFilter === 'All' || v.organization === selectedOrgFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      v.postTitleNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.organizationNameNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.level.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOrg && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>आधिकारिक पदपूर्ति तथा विज्ञापन केन्द्र (Official Career & Vacancies)</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          नेपालका बैंक तथा वित्तीय संस्थाका खुला विज्ञापनहरू
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू तथा लोक सेवा आयोग द्वारा प्रकाशित प्रमाणित विज्ञापनहरू, योग्यता तथा दरखास्त मिति
        </p>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'All', label: 'सबै (All)' },
              { id: 'NRB', label: 'नेपाल राष्ट्र बैंक' },
              { id: 'RBB', label: 'राष्ट्रिय वाणिज्य बैंक' },
              { id: 'ADBL', label: 'कृषि विकास बैंक' },
              { id: 'NBL', label: 'नेपाल बैंक' },
              { id: 'PSC', label: 'लोक सेवा आयोग' },
            ].map(org => (
              <button
                key={org.id}
                onClick={() => setSelectedOrgFilter(org.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  selectedOrgFilter === org.id
                    ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {org.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="पद वा तह खोज्नुहोस्..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Vacancies List */}
      <div className="space-y-4">
        {filteredVacancies.map(vac => (
          <div 
            key={vac.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    कुल माग पद संख्या: {vac.totalOpenings}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{vac.organizationNameNe}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {vac.postTitleNe}
                </h2>
                <p className="text-xs text-slate-500">{vac.advertisementNumber}</p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {vac.level}
                </span>
              </div>
            </div>

            {/* Qualifications & Deadlines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block font-medium mb-1">न्यूनतम आवश्यक शैक्षिक योग्यता:</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {vac.minimumQualificationNe}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">प्रकाशित मिति:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{vac.publishedDateBS}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">दरखास्त अन्तिम मिति:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">{vac.applicationDeadlineBS}</strong>
                </div>
                {vac.doubleFeeDeadlineBS && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">दोब्बर दस्तुर म्याद:</span>
                    <strong className="text-slate-700 dark:text-slate-300">{vac.doubleFeeDeadlineBS}</strong>
                  </div>
                )}
                {vac.examDateTentativeBS && (
                  <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">सम्भावित परीक्षा मिति:</span>
                    <strong className="text-sky-700 dark:text-sky-400">{vac.examDateTentativeBS}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
              <a
                href={vac.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-600"
              >
                <span>आधिकारिक सूचना स्रोत (Official Portal)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('learn');
                    addToast(`${vac.postTitleNe} पाठ्यक्रम लोड गरियो`, 'info');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>पाठ्यक्रम हेर्नुहोस्</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('practice');
                    addToast(`${vac.postTitleNe} परीक्षा तयारी सुरु गरियो`, 'success');
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  <span>तयारी सुरु गर्नुहोस्</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
