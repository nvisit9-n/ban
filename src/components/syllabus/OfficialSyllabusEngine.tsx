import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_SYLLABI, OfficialSyllabus } from '../../data/officialSyllabi';
import { OFFICIAL_SYLLABUS_VERSIONS } from '../../data/syllabusVersionData';
import { 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Layers, 
  GitCompare, 
  Bookmark, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

export const OfficialSyllabusEngine: React.FC = () => {
  const { setActiveTab, openNoteReader, toggleBookmark, isBookmarked, addToast } = useApp();

  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string>(OFFICIAL_SYLLABI[0]?.id || 'syl-nrb-level-6');
  const [activeViewMode, setActiveViewMode] = useState<'curriculum' | 'version_diff'>('curriculum');
  const [selectedPaperNumber, setSelectedPaperNumber] = useState<number>(1);

  const currentSyllabus = OFFICIAL_SYLLABI.find(s => s.id === selectedSyllabusId) || OFFICIAL_SYLLABI[0];
  const versionRecord = OFFICIAL_SYLLABUS_VERSIONS.find(v => 
    v.institution.toLowerCase().includes(currentSyllabus.institution.toLowerCase().slice(0, 3)) ||
    currentSyllabus.id.includes(v.level)
  ) || OFFICIAL_SYLLABUS_VERSIONS[0];

  const currentPaper = currentSyllabus.papers.find(p => p.paperNumber === selectedPaperNumber) || currentSyllabus.papers[0];

  return (
    <div className="space-y-6">
      {/* 1. Header & Selector Zone */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>आधिकारिक तथा अद्यावधिक परीक्षा पाठ्यक्रम (Official Certified Syllabus)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentSyllabus.titleNepali}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {currentSyllabus.institution} · तह: {currentSyllabus.level} · कुल पूर्णाङ्क: {currentSyllabus.totalMarks} (उत्तीर्णाङ्क: {currentSyllabus.passMarks})
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveViewMode('curriculum')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeViewMode === 'curriculum'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>पाठ्यक्रम संरचना (Curriculum)</span>
            </button>
            <button
              onClick={() => setActiveViewMode('version_diff')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeViewMode === 'version_diff'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>परिवर्तन तुलना (Version Diff)</span>
            </button>
          </div>
        </div>

        {/* Syllabus Dropdown selector & Official metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1.5">पाठ्यक्रम छनोट गर्नुहोस्:</label>
            <select
              value={selectedSyllabusId}
              onChange={(e) => {
                setSelectedSyllabusId(e.target.value);
                setSelectedPaperNumber(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {OFFICIAL_SYLLABI.map(syl => (
                <option key={syl.id} value={syl.id}>
                  {syl.institutionNepali} - {syl.level}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">आधिकारिक स्रोत (Official Gazette):</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
              {versionRecord.officialGazetteRef}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">ऋणात्मक अंक प्रणाली (Negative Marking):</span>
            <p className="font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
              {versionRecord.hasNegativeMarking ? `लागू हुने (प्रत्येक गलत उत्तरमा २०% कट्टा)` : `लागू नहुने`}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Body */}
      {activeViewMode === 'curriculum' ? (
        <div className="space-y-6">
          {/* Paper Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
            {currentSyllabus.papers.map(p => (
              <button
                key={p.paperNumber}
                onClick={() => setSelectedPaperNumber(p.paperNumber)}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-1 ${
                  selectedPaperNumber === p.paperNumber
                    ? 'border-sky-600 text-sky-700 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {p.title} ({p.fullMarks} अङ्क · {p.timeMinutes} मिनेट)
              </button>
            ))}
          </div>

          {/* Paper Details Card */}
          <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-500">परीक्षा ढाँचा (Format):</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1.5">{currentPaper.examFormat}</span>
            </div>
            <div>
              <span className="text-slate-500">पूर्णाङ्क:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1.5">{currentPaper.fullMarks} अङ्क</span>
            </div>
            <div>
              <span className="text-slate-500">उत्तीर्णाङ्क:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1.5">{currentPaper.passMarks} अङ्क</span>
            </div>
            <div>
              <span className="text-slate-500">समय:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1.5">{currentPaper.timeMinutes} मिनेट</span>
            </div>
          </div>

          {/* Sections & Interactive Topic Learning Map */}
          <div className="space-y-6">
            {currentPaper.sections.map((sec, secIdx) => (
              <div 
                key={secIdx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {sec.sectionName}
                  </h3>
                  <span className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    भार: {sec.weightageMarks} अङ्क
                  </span>
                </div>

                {/* Topics in this Section */}
                <div className="space-y-3">
                  {sec.topics.map((topic, topicIdx) => {
                    const bookmarked = isBookmarked('note', `topic-${secIdx}-${topicIdx}`);

                    return (
                      <div 
                        key={topicIdx}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                            {topicIdx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {topic}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              आधिकारिक पाठ्यक्रम खण्ड अनुसार अनिवार्य परीक्षा विषय
                            </p>
                          </div>
                        </div>

                        {/* Connected Action Map */}
                        <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              openNoteReader(topic);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                          >
                            <BookOpen className="w-3 h-3 text-sky-600" />
                            <span>अध्ययन नोट (Study)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('practice');
                              addToast(`'${topic.slice(0, 24)}...' अभ्यास सेट सुरु गरिँदैछ`, 'info');
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 rounded-lg transition-colors"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>५० MCQs अभ्यास</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              toggleBookmark('note', `topic-${secIdx}-${topicIdx}`, topic, currentSyllabus.institutionNepali);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              bookmarked
                                ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/50 dark:border-amber-700'
                                : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700'
                            }`}
                            aria-label="Bookmark Topic"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Version Diff Tab: Compares Current Syllabus vs Previous Version */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <GitCompare className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                पाठ्यक्रम संशोधन विश्लेषण (Curriculum Revision Audit)
              </h2>
              <p className="text-xs text-slate-500">
                साविक (पुरानो) पाठ्यक्रम र हालको अद्यावधिक पाठ्यक्रम बीचको यथार्थ भिन्नता
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {versionRecord.diffFromPreviousVersion.map((diff, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                      diff.changeType === 'ADDED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : diff.changeType === 'MODIFIED'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {diff.changeType === 'ADDED' ? 'थपिएको (ADDED)' : diff.changeType === 'MODIFIED' ? 'परिमार्जित (MODIFIED)' : 'हटाइएको (REMOVED)'}
                    </span>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                      {diff.topicNameNepali}
                    </h4>
                  </div>
                </div>

                {diff.previousSyllabusText && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 pl-3 border-l-2 border-rose-300 dark:border-rose-800">
                    <span className="font-medium text-rose-700 dark:text-rose-400">साविक पाठ्यक्रम: </span>
                    {diff.previousSyllabusText}
                  </div>
                )}

                {diff.currentSyllabusText && (
                  <div className="text-xs text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-emerald-400 dark:border-emerald-600">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">हालको पाठ्यक्रम: </span>
                    {diff.currentSyllabusText}
                  </div>
                )}

                <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg font-medium">
                  परीक्षा प्रभाव: {diff.changeImpactNotice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
