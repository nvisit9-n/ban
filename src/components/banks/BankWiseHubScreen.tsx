import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_VACANCIES_DATA } from '../../data/vacanciesData';
import { DIGITAL_PRODUCTS_CATALOG } from '../../data/digitalProductsData';
import { 
  Landmark, 
  Building2, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface BankProfile {
  id: 'NRB' | 'RBB' | 'ADBL' | 'NBL' | 'LOKSEWA';
  nameNe: string;
  nameEn: string;
  taglineNe: string;
  typeNe: string;
  establishedBS: string;
  headquartersNe: string;
  examOverview: {
    phases: string[];
    preTestDuration: string;
    negativeMarking: string;
    targetLevels: string[];
  };
  preparationStrategyNe: string[];
}

const BANK_PROFILES: BankProfile[] = [
  {
    id: 'NRB',
    nameNe: 'नेपाल राष्ट्र बैंक',
    nameEn: 'Nepal Rastra Bank (Central Bank of Nepal)',
    taglineNe: 'केन्द्रीय बैंकिङ, मौद्रिक नीति तथा विदेशी विनिमय नियमन',
    typeNe: 'केन्द्रीय बैंक (Regulator)',
    establishedBS: '२०१३ वैशाख १४',
    headquartersNe: 'बालुवाटार, काठमाडौँ',
    examOverview: {
      phases: ['प्रथम चरण: पूर्वयोग्यता परीक्षा (Pre-Test MCQs)', 'दोस्रो चरण: विषयगत लिखित परीक्षा (Paper II & III)', 'तेस्रो चरण: अन्तर्वार्ता तथा प्रयोगात्मक'],
      preTestDuration: '४५ मिनेट (५० प्रश्नहरू, १०० पूर्णाङ्क)',
      negativeMarking: 'प्रत्येक गलत उत्तरमा २०% अङ्क कट्टा',
      targetLevels: ['तह ४ (सहायक प्रशासन)', 'तह ६ (सहायक निर्देशक - अधिकृत तृतीय)']
    },
    preparationStrategyNe: [
      'नेपाल राष्ट्र बैंक ऐन २०५८ र BAFIA २०७३ का सम्पूर्ण महत्वपूर्ण दफाहरू स्मरण गर्नुहोस्।',
      'पछिल्लो मौद्रिक नीति तथा त्रैमासिक समीक्षाका दरहरू (CRR, SLR, नीतिगत दर) अद्यावधिक राख्नुहोस्।',
      'समष्टिगत अर्थशास्त्र, भुक्तानी सन्तुलन (BOP) र विदेशी विनिमय व्यवस्थापनमा विशेष जोड दिनुहोस्।'
    ]
  },
  {
    id: 'RBB',
    nameNe: 'राष्ट्रिया वाणिज्य बैंक लिमिटेड',
    nameEn: 'Rastriya Banijya Bank Limited',
    taglineNe: 'नेपालको सबैभन्दा ठूलो शाखा सञ्जाल भएको सरकारी वाणिज्य बैंक',
    typeNe: 'क वर्गको वाणिज्य बैंक (Commercial Bank)',
    establishedBS: '२०२२ माघ १०',
    headquartersNe: 'सिंहदरबार प्लाजा, काठमाडौँ',
    examOverview: {
      phases: ['प्रथम चरण: पूर्वयोग्यता परीक्षा (Pre-Test MCQs)', 'दोस्रो चरण: मुख्य लिखित परीक्षा (सेवा सम्बन्धी)', 'तेस्रो चरण: अन्तर्वार्ता'],
      preTestDuration: '४५ मिनेट (५० प्रश्नहरू, १०० पूर्णाङ्क)',
      negativeMarking: '२०% ऋणात्मक अङ्क प्रणाली',
      targetLevels: ['तह ४ (सहायक / सहायक नगद)', 'तह ५ (वरिष्ठ सहायक)', 'तह ६ (अधिकृत)']
    },
    preparationStrategyNe: [
      'निक्षेप संकलन, कर्जा प्रवाह तथा ट्रेड फाइनान्स (LC/BG) का व्यवहारिक पक्ष बुझ्नुहोस्।',
      'लेखा प्रणाली, अनुपात विश्लेषण तथा बैंक हिसाबमा चरणबद्ध समाधान अभ्यास गर्नुहोस्।',
      'ग्राहक सेवा, AML/KYC र बैंकिङ कसूर ऐन २०६४ का प्रावधानहरू विशेष रूपमा पढ्नुहोस्।'
    ]
  },
  {
    id: 'ADBL',
    nameNe: 'कृषि विकास बैंक लिमिटेड',
    nameEn: 'Agricultural Development Bank Limited',
    taglineNe: 'कृषि, ग्रामीण तथा साना व्यवसाय वित्तीय सशक्तिकरण',
    typeNe: 'क वर्गको वाणिज्य बैंक',
    establishedBS: '२०२४ माघ ०७',
    headquartersNe: 'रामशाहपथ, काठमाडौँ',
    examOverview: {
      phases: ['प्रथम चरण: पूर्वयोग्यता परीक्षा', 'दोस्रो चरण: मुख्य लिखित परीक्षा', 'तेस्रो चरण: अन्तर्वार्ता'],
      preTestDuration: '४५ मिनेट (५० प्रश्नहरू)',
      negativeMarking: '२०% ऋणात्मक अङ्क',
      targetLevels: ['तह ४ (लेखापाल)', 'तह ५ (व्यवसाय सहायक)', 'तह ६ (अधिकृत)']
    },
    preparationStrategyNe: [
      'कृषि कर्जा, ग्रामीण वित्त तथा विपन्न वर्ग कर्जाका व्यवस्थाहरू अध्ययन गर्नुहोस्।',
      'कृषि विकास बैंक कर्मचारी सेवा विनियमावली र संगठनात्मक संरचना बुझ्नुहोस्।',
      'नेपालको वित्तीय समावेशीकरण र सहुलियतपूर्ण कर्जाका कार्यविधिहरू पढ्नुहोस्।'
    ]
  },
  {
    id: 'NBL',
    nameNe: 'नेपाल बैंक लिमिटेड',
    nameEn: 'Nepal Bank Limited',
    taglineNe: 'नेपालको पहिलो बैंक (Established 1937 AD)',
    typeNe: 'क वर्गको वाणिज्य बैंक',
    establishedBS: '१९९४ कात्तिक ३०',
    headquartersNe: 'धर्मपथ, काठमाडौँ',
    examOverview: {
      phases: ['प्रथम चरण: पूर्वयोग्यता परीक्षा', 'दोस्रो चरण: लिखित परीक्षा', 'तेस्रो चरण: अन्तर्वार्ता'],
      preTestDuration: '४५ मिनेट (५० प्रश्न)',
      negativeMarking: '२०% ऋणात्मक अङ्क',
      targetLevels: ['तह ३ (कनिष्ठ सहायक / गोल्ड टेष्टर)', 'तह ४ (सहायक)']
    },
    preparationStrategyNe: [
      'नेपालको बैंकिङ इतिहास र नेपाल बैंकको स्थापना सम्बन्धी ऐतिहासिक तथ्यहरू कण्ठ गर्नुहोस्।',
      'गोल्ड टेष्टिङ, धितो मूल्यांकन र काउन्टर अपरेशनका नियमहरू हेर्नुहोस्।',
      'कम्प्युटर फन्डामेन्टल्स र कार्यालय व्यवस्थापनका बुँदाहरू अभ्यास गर्नुहोस्।'
    ]
  },
  {
    id: 'LOKSEWA',
    nameNe: 'लोक सेवा आयोग / संगठित संस्था',
    nameEn: 'Public Service Commission & Public Enterprises',
    taglineNe: 'निजामती सेवा तथा संस्थानहरू (NTC, NEA, EPF, CIT)',
    typeNe: 'संवैधानिक निकाय (Constitutional Body)',
    establishedBS: '२००८ असार ०१',
    headquartersNe: 'अनामनगर, काठमाडौँ',
    examOverview: {
      phases: ['प्रथम चरण: प्रथम पत्र (सामान्य ज्ञान तथा बौद्धिक परीक्षण IQ/GK)', 'दोस्रो चरण: समसामयिक अध्ययन तथा सेवा सम्बन्धी'],
      preTestDuration: '४५ मिनेट देखि १ घण्टा',
      negativeMarking: '२०% ऋणात्मक अङ्क',
      targetLevels: ['खरिदार (तह ४)', 'नायब सुब्बा (तह ५)', 'शाखा अधिकृत (तह ६/७)']
    },
    preparationStrategyNe: [
      'नेपालको संविधान (भाग ३ मौलिक हक, राज्यका निर्देशक सिद्धान्त) विस्तृत रूपमा पढ्नुहोस्।',
      'बजेट प्रणाली, सार्वजनिक वित्त व्यवस्थापन र सुशासनका सिद्धान्तहरूमा ध्यान दिनुहोस्।',
      'दैनिक समसामयिक घटनाक्रम र आर्थिक सूचकांकहरूको तालिका बनाउनुहोस्।'
    ]
  }
];

export const BankWiseHubScreen: React.FC = () => {
  const { setActiveTab, openNoteReader, addToast } = useApp();
  const [selectedBankId, setSelectedBankId] = useState<BankProfile['id']>('NRB');

  const currentBank = BANK_PROFILES.find(b => b.id === selectedBankId) || BANK_PROFILES[0];
  const relatedVacancies = OFFICIAL_VACANCIES_DATA.filter(v => 
    v.organization.toUpperCase() === currentBank.id ||
    (currentBank.id === 'LOKSEWA' && (v.organization === 'PSC' || v.organization === 'NEA'))
  );
  const relatedBooks = DIGITAL_PRODUCTS_CATALOG.filter(p => 
    p.targetInstitutions.includes(currentBank.id)
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
          <Landmark className="w-4 h-4" />
          <span>संस्थागत बैंक-वाइज तयारी केन्द्र (Bank-Wise Preparation Hub)</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          नेपालका प्रमुख बैंक तथा वित्तीय संस्थाहरूको लक्षित तयारी
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          प्रत्येक संस्थाको विशिष्ट परीक्षा संरचना, आधिकारिक पाठ्यक्रम, पदपूर्ति सूचना, अभ्यास सेट र तयारी रणनीति
        </p>

        {/* Bank Selection Tabs */}
        <div className="flex items-center gap-2 pt-6 overflow-x-auto pb-1">
          {BANK_PROFILES.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBankId(b.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedBankId === b.id
                  ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white border-transparent shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{b.nameNe}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Selected Bank Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bank Fast Facts & Strategy */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                {currentBank.typeNe}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                {currentBank.nameNe}
              </h2>
              <p className="text-xs text-slate-500">{currentBank.nameEn}</p>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">स्थापना मिति:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentBank.establishedBS}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">केन्द्रीय कार्यालय:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentBank.headquartersNe}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">ऋणात्मक अंक:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">{currentBank.examOverview.negativeMarking}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('mock-tests');
                  addToast(`${currentBank.nameNe} मोक टेस्ट सुरु गरिँदैछ`, 'info');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 rounded-xl transition-colors shadow-xs"
              >
                <span>मोक टेस्ट दिनुहोस् (Pre-Test Mock)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('practice');
                  addToast(`${currentBank.nameNe} प्रश्न बैंक लोड गरिँदैछ`, 'info');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>वस्तुगत प्रश्नहरू (MCQs)</span>
              </button>
            </div>
          </div>

          {/* High-Scoring Preparation Strategy Card */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>सफलता रणनीति (Preparation Guide)</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {currentBank.preparationStrategyNe.map((strat, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{strat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column (2 Spans): Exam Stages, Vacancies & Books */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exam Structure Stages */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>परीक्षा प्रणाली तथा चरणहरू (Examination Process)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentBank.examOverview.phases.map((phase, pIdx) => (
                <div 
                  key={pIdx}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-xs font-bold text-sky-700 dark:text-sky-400">चरण {pIdx + 1}</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {phase}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                प्रथम चरणको पूर्वयोग्यता परीक्षामा उत्तीर्ण नभई दोस्रो चरणको लिखित परीक्षामा सामेल हुन पाइने छैन।
              </span>
            </div>
          </div>

          {/* Current Vacancies for this Bank */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>खुला पदपूर्ति तथा सूचनाहरू (Latest Vacancies)</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('vacancies')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                सबै हेर्नुहोस् →
              </button>
            </div>

            {relatedVacancies.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">हाल यस संस्थाको नयाँ विज्ञापन वार्षिक पदपूर्ति तालिका अनुसार प्रक्रियामा छ।</p>
            ) : (
              <div className="space-y-3">
                {relatedVacancies.map(vac => (
                  <div 
                    key={vac.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          खुला पद: {vac.totalOpenings}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {vac.postTitleNe}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        दरखास्त अन्तिम मिति: <strong className="text-slate-700 dark:text-slate-300">{vac.applicationDeadlineBS}</strong> (दोब्बर दस्तुर: {vac.doubleFeeDeadlineBS})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('learn');
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg"
                      >
                        पाठ्यक्रम
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('practice');
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-sky-600 rounded-lg hover:bg-slate-800"
                      >
                        तयारी सुरु
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Study Manuals & Books */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>सिफारिस गरिएका पाठ्यसामग्रीहरू (Digital Books & Packs)</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('store')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                स्टोरमा जानुहोस् →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedBooks.map(book => (
                <div 
                  key={book.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {book.titleNe}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {book.descriptionNe}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 line-through">रू {book.originalPriceNpr}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white ml-1.5">रू {book.discountedPriceNpr}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('store')}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      निःशुल्क नमुना हेर्नुहोस् →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
