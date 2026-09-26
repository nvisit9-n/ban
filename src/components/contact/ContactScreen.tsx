import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mail, 
  HelpCircle, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const ContactScreen: React.FC = () => {
  const { addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('कृपया सबै आवश्यक विवरण भर्नुहोस्।', 'error');
      return;
    }
    setSubmitted(true);
    addToast('तपाईंको सन्देश सफलतापूर्वक पठाइयो। हाम्रो सहयोग समूहले छिट्टै सम्पर्क गर्नेछ।', 'success');
  };

  const FAQS = [
    {
      q: 'पाठ्यक्रम कति समयमा अद्यावधिक हुन्छ?',
      a: 'लोक सेवा आयोग तथा सम्बन्धित बैंकहरूको पदपूर्ति समितिले राजपत्र वा आधिकारिक वेबसाइटमा संशोधन सूचना प्रकाशित गर्नासाथ हाम्रो प्राज्ञिक समूहले २४ घण्टाभित्र पाठ्यक्रम अद्यावधिक गर्दछ।'
    },
    {
      q: 'पूर्वयोग्यता परीक्षामा ऋणात्मक अङ्क प्रणाली (Negative Marking) कसरी हिसाब गरिन्छ?',
      a: 'लोक सेवा आयोगको नियम अनुसार प्रत्येक गलत उत्तरमा प्राप्त पूर्णाङ्कको २०% अङ्क कट्टा गरिन्छ। उदाहरणका लागि २ अङ्कको प्रश्न बिग्रिएमा ०.४० अङ्क कुल प्राप्ताङ्कबाट घटाइन्छ।'
    },
    {
      q: 'डिजिटल पुस्तकहरूको PDF अफलाइन डाउनलोड गर्न पाइन्छ?',
      a: 'हो, स्टोरमा PDF सुविधा उल्लेख भएका सम्पूर्ण डिजिटल पुस्तकहरू उच्च गुणस्तरको A4 ढाँचामा डाउनलोड गरी इन्टरनेट बिना पनि अध्ययन गर्न सकिन्छ।'
    },
    {
      q: 'भुक्तानी कसरी गर्ने र अध्ययन सामग्री कहिले सक्रिय हुन्छ?',
      a: 'eSewa, Khalti, ConnectIPS वा सिधै बैंक क्युआर मार्फत भुक्तानी गर्न सकिन्छ। डिजिटल भुक्तानी पश्चात वा प्रशासक प्रमाणीकरणपछि तपाईंको खातामा अध्ययन सामग्री तत्काल उपलब्ध हुन्छ।'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
          <Mail className="w-4 h-4" />
          <span>सहयोग तथा सम्पर्क केन्द्र (Support & Contact)</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          हामीलाई सम्पर्क गर्नुहोस्
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          अध्ययन सामग्री, परीक्षा प्रणाली, प्राविधिक समस्या वा सल्लाह-सुझावका लागि सहयोग डेस्क
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            सन्देश पठाउनुहोस्
          </h2>

          {submitted ? (
            <div className="p-6 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">सन्देश प्राप्त भयो!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                तपाईंको जिज्ञासा हाम्रो प्राज्ञिक तथा प्राविधिक डेस्कमा दर्ता भएको छ।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">पूरा नाम (Full Name) *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="तपाईंको नाम"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">इमेल ठेगाना (Email) *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">विषय (Subject)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="सोधपुछ वा सुझाव"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">विस्तृत सन्देश (Message) *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="तपाईंको प्रश्न वा समस्या यहाँ लेख्नुहोस्..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>सन्देश पठाउनुहोस्</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <span>बारम्बार सोधिने प्रश्नहरू (FAQ)</span>
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, fIdx) => (
              <div key={fIdx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Q: {faq.q}</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Disclaimer & Verification Policy */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>आधिकारिक अस्वीकरण एवं प्रमाणीकरण नीति (Official Disclaimer & Policy)</span>
        </h3>
        <p className="leading-relaxed">
          बैंकिङ तयारी नेपाल (Banking Tayari Nepal) एक स्वतन्त्र प्राज्ञिक परीक्षा तयारी डिजिटल प्लेटफर्म हो। यो प्लेटफर्म नेपाल राष्ट्र बैंक, राष्ट्रिय वाणिज्य बैंक, कृषि विकास बैंक, नेपाल बैंक वा लोक सेवा आयोगको आधिकारिक सरकारी मुखपत्र होइन।
        </p>
        <p className="leading-relaxed">
          यसमा प्रस्तुत गरिएका सम्पूर्ण पाठ्यक्रम, ऐनका दफाहरू र परीक्षामुखी सामग्रीहरू नेपाल कानुन आयोग, नेपाल राजपत्र र सम्बन्धित निकायका आधिकारिक सार्वजनिक स्रोतबाट प्रमाणीकरण गरी परीक्षार्थीहरूको अध्ययन सहजताका लागि संकलन गरिएको हो।
        </p>
      </div>
    </div>
  );
};
