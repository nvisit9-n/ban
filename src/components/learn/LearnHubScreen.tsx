import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialSyllabusEngine } from '../syllabus/OfficialSyllabusEngine';
import { DIGITAL_PRODUCTS_CATALOG } from '../../data/digitalProductsData';
import { 
  BookOpen, 
  Layers, 
  Landmark, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Filter, 
  Search,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const LearnHubScreen: React.FC = () => {
  const { setActiveTab, openNoteReader, addToast } = useApp();

  const [activeLearnTab, setActiveLearnTab] = useState<'syllabus' | 'books' | 'subjects'>('syllabus');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  const subjectList = [
    { id: 'All', label: 'सबै विषयहरू' },
    { id: 'banking_law', label: 'बैंकिङ ऐन तथा नियमन', count: 18 },
    { id: 'accounting', label: 'लेखा तथा अनुपात विश्लेषण', count: 12 },
    { id: 'economics', label: 'समष्टिगत अर्थशास्त्र र मौद्रिक नीति', count: 14 },
    { id: 'management', label: 'व्यवस्थापन तथा कार्यालय सञ्चालन', count: 10 },
    { id: 'math_it', label: 'गणित तथा सूचना प्रविधि (IT)', count: 11 },
    { id: 'current', label: 'समसामयिक तथा सामान्य ज्ञान', count: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>केन्द्रीय प्राज्ञिक अध्ययन हब (Academic Learning Hub)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              पाठ्यक्रम, डिजिटल पुस्तकहरू तथा अध्ययन सामग्री
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू तथा लोक सेवा आयोगको अद्यावधिक पाठ्यक्रम र अध्ययन मार्गचित्र
            </p>
          </div>

          {/* Learn Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setActiveLearnTab('syllabus')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeLearnTab === 'syllabus'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>पाठ्यक्रम (Syllabus)</span>
            </button>
            <button
              onClick={() => setActiveLearnTab('books')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeLearnTab === 'books'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>डिजिटल पुस्तकहरू (Books)</span>
            </button>
            <button
              onClick={() => setActiveLearnTab('subjects')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeLearnTab === 'subjects'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>विषयगत क्याटलग (Subjects)</span>
            </button>
          </div>
        </div>

        {/* Bank-Wise Preparation Quick Bar */}
        <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>संस्थागत बैंक-वाइज तयारी केन्द्र हेर्नुहोस्:</span>
          <button
            onClick={() => setActiveTab('banks')}
            className="flex items-center gap-1 text-sky-600 hover:underline font-semibold"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>NRB / RBB / ADBL / NBL तयारी हब →</span>
          </button>
        </div>
      </div>

      {/* 2. Tab Content */}
      {activeLearnTab === 'syllabus' && (
        <OfficialSyllabusEngine />
      )}

      {activeLearnTab === 'books' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIGITAL_PRODUCTS_CATALOG.map(prod => (
              <div 
                key={prod.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {prod.totalChaptersCount} वटा अध्यायहरू
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2 leading-snug">
                    {prod.titleNe}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 italic">{prod.subtitleNe}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {prod.descriptionNe}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      openNoteReader(prod.titleNe);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-xl shadow-xs"
                  >
                    <span>पढ्न सुरु गर्नुहोस्</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('store')}
                    className="text-xs text-sky-600 hover:underline font-semibold"
                  >
                    विवरण / अनलक →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLearnTab === 'subjects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectList.filter(s => s.id !== 'All').map(sub => (
              <div 
                key={sub.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {sub.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {sub.count} वटा प्रमाणित अध्याय तथा परीक्षा नोटहरू
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => openNoteReader(sub.label)}
                    className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <span>अध्यायहरू हेर्नुहोस्</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('practice');
                      addToast(`${sub.label} अभ्यास सुरु गरियो`, 'info');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200"
                  >
                    MCQ अभ्यास
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
