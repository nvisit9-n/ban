import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { Target, CheckCircle2, ArrowRight, X, Clock, Calendar, Building2, Award } from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export const PersonalizedOnboardingModal: React.FC<OnboardingProps> = ({ isOpen, onClose, onCompleted }) => {
  const { user, setUser, addToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedOrg, setSelectedOrg] = useState<string>(user?.targetExam || 'NRB');
  const [selectedLevel, setSelectedLevel] = useState<string>('4');
  const [dailyTimeMinutes, setDailyTimeMinutes] = useState<number>(60);
  const [targetDateBS, setTargetDateBS] = useState<string>('');

  if (!isOpen) return null;

  const handleFinish = async () => {
    try {
      const targetExamString = `${selectedOrg} Level ${selectedLevel}`;
      const updated = await DbService.saveStudentProfile({
        targetExam: targetExamString,
      });
      setUser(updated);
      addToast('तपाईंको अध्ययन लक्ष्य सफलतापूर्वक सुरक्षित गरियो!', 'success');
      if (onCompleted) onCompleted();
      onClose();
    } catch {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
              <Building2 className="w-4 h-4" />
              <span>चरण १: संस्था छनोट (Organization)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              तपाईं कुन बैंक वा संस्थाको परीक्षा तयारी गर्दै हुनुहुन्छ?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              यसले तपाईंको ड्यासबोर्डमा सम्बन्धित पाठ्यक्रम र प्रश्नहरू व्यक्तिगत बनाउन मद्दत गर्दछ।
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { id: 'NRB', label: 'नेपाल राष्ट्र बैंक (NRB)', subtitle: 'केन्द्रीय बैंक' },
                { id: 'RBB', label: 'राष्ट्रिय वाणिज्य बैंक (RBB)', subtitle: 'वाणिज्य बैंक' },
                { id: 'ADBL', label: 'कृषि विकास बैंक (ADBL)', subtitle: 'विकास बैंक' },
                { id: 'NBL', label: 'नेपाल बैंक लिमिटेड (NBL)', subtitle: 'प्रथम बैंक' },
                { id: 'LOKSEWA', label: 'लोक सेवा आयोग (PSC)', subtitle: 'निजामती' },
                { id: 'ENTERPRISE', label: 'सार्वजनिक संस्थान', subtitle: 'NTC, NEA, EPF' },
              ].map(org => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => setSelectedOrg(org.id)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    selectedOrg === org.id
                      ? 'border-sky-600 bg-sky-50/60 dark:bg-sky-950/40 dark:border-sky-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{org.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{org.subtitle}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              >
                पछि गर्छु (Skip)
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 rounded-xl shadow-xs"
              >
                <span>अर्को चरण</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
              <Award className="w-4 h-4" />
              <span>चरण २: पद तथा तह (Level / Post)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              तपाईं कुन तहको परीक्षामा प्रतिस्पर्धा गर्दै हुनुहुन्छ?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              पाठ्यक्रमको स्तर अनुसार पूर्वयोग्यता तथा मुख्य लिखित परीक्षाका सामग्रीहरू निर्धारित हुनेछन्।
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { id: '4', title: 'तह ४: सहायक / क्यासियर (Assistant)', desc: 'प्रविणता प्रमाणपत्र / १०+२ न्यूनतम योग्यता' },
                { id: '5', title: 'तह ५: वरिष्ठ सहायक / व्यवसाय सहायक (Sr. Assistant)', desc: 'स्नातक तह (Bachelor) न्यूनतम योग्यता' },
                { id: '6', title: 'तह ६: सहायक निर्देशक / अधिकृत तृतीय (Officer)', desc: 'स्नातकोत्तर तह (Master Degree) न्यूनतम योग्यता' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`w-full p-3.5 text-left rounded-xl border transition-all ${
                    selectedLevel === lvl.id
                      ? 'border-sky-600 bg-sky-50/60 dark:bg-sky-950/40 dark:border-sky-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{lvl.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{lvl.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
              >
                अघिल्लो
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 rounded-xl shadow-xs"
              >
                <span>अर्को चरण</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
              <Clock className="w-4 h-4" />
              <span>चरण ३: दैनिक अध्ययन समय (Daily Goal)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              तपाईं दैनिक कति समय अध्ययन गर्न सक्नुहुन्छ?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              यसले दैनिक अध्ययन मिसन र रिभिजन तालिका व्यवस्थापन गर्न मद्दत गर्नेछ।
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { time: 30, label: '३० मिनेट', note: 'छिटो अभ्यास' },
                { time: 60, label: '१ घण्टा', note: 'मध्यम तयारी' },
                { time: 120, label: '२ घण्टा', note: 'गहन तयारी' },
                { time: 180, label: '३+ घण्टा', note: 'पूर्ण समर्पण' },
              ].map(t => (
                <button
                  key={t.time}
                  type="button"
                  onClick={() => setDailyTimeMinutes(t.time)}
                  className={`p-3 text-center rounded-xl border transition-all ${
                    dailyTimeMinutes === t.time
                      ? 'border-sky-600 bg-sky-50/60 dark:bg-sky-950/40 dark:border-sky-500 font-semibold'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <p className="text-base font-bold text-slate-900 dark:text-white">{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.note}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
              >
                अघिल्लो
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>तयारी सुरु गर्नुहोस्</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
