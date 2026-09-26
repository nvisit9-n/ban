import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { DIGITAL_PRODUCTS_CATALOG } from '../../data/digitalProductsData';
import { DigitalProduct } from '../../types';
import { 
  ShoppingBag, 
  BookOpen, 
  CheckCircle2, 
  FileDown, 
  Sparkles, 
  Lock, 
  Unlock, 
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

export const StoreScreen: React.FC = () => {
  const { openNoteReader, addToast, setActiveTab, user } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [selectedGateway, setSelectedGateway] = useState<'esewa' | 'khalti' | 'connect_ips' | 'manual_bank_transfer'>('esewa');
  const [txnIdInput, setTxnIdInput] = useState<string>('');

  const handleOpenPreview = (prod: DigitalProduct) => {
    setSelectedProduct(prod);
    setShowPreviewModal(true);
  };

  const handleOpenCheckout = (prod: DigitalProduct) => {
    setSelectedProduct(prod);
    setShowCheckoutModal(true);
    setTxnIdInput('');
  };

  const handleCompleteOrder = () => {
    if (!selectedProduct) return;

    if (selectedGateway === 'manual_bank_transfer' && !txnIdInput.trim()) {
      addToast('कृपया भौचर वा ट्रान्ज्याक्सन आइडी उल्लेख गर्नुहोस्।', 'error');
      return;
    }

    // Submit payment order
    const order = DbService.createPaymentOrder({
      userId: user?.id || 'guest',
      userEmail: user?.email || '',
      userName: user?.name || 'विद्यार्थी',
      productId: selectedProduct.id,
      productTitle: selectedProduct.titleNe,
      amountNpr: selectedProduct.discountedPriceNpr,
      gateway: selectedGateway,
      transactionReference: txnIdInput.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`
    });

    DbService.addPaymentVerification({
      userId: user?.id || 'guest',
      userName: user?.name || 'विद्यार्थी',
      userEmail: user?.email || '',
      amount: selectedProduct.discountedPriceNpr,
      gateway: selectedGateway === 'esewa' ? 'esewa' : selectedGateway === 'khalti' ? 'khalti' : 'bank_transfer',
      transactionId: txnIdInput.trim() || order.orderNumber,
      noteTitle: selectedProduct.titleNe
    });

    addToast('भुक्तानी अर्डर सुरक्षित गरियो! प्रशासक प्रमाणीकरणपछि तपाईंको लाइब्रेरीमा उपलब्ध हुनेछ।', 'success');
    setShowCheckoutModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
          <ShoppingBag className="w-4 h-4" />
          <span>डिजिटल प्रकाशन तथा प्रीमियम सामग्री स्टोर (Digital Book Store)</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          प्रमाणित अध्ययन पुस्तक, प्रश्न बैंक र परीक्षा बन्डलहरू
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          निःशुल्क नमुना अध्यायहरू (Free Previews) पढेर मात्र विश्वासका साथ पूर्ण अध्ययन सामग्री खरिद गर्नुहोस्
        </p>
      </div>

      {/* 2. Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DIGITAL_PRODUCTS_CATALOG.map(prod => {
          const hasAccess = DbService.hasProductEntitlement(prod.id);

          return (
            <div 
              key={prod.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {prod.productType === 'digital_book' ? 'डिजिटल पुस्तक' : prod.productType === 'question_bank' ? 'प्रश्न बैंक' : 'प्रीमियम नोट'}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    {hasAccess ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Unlock className="w-3.5 h-3.5" />
                        अनसक
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        प्रीमियम
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {prod.titleNe}
                </h3>
                <p className="text-xs text-slate-500 mt-1 italic">{prod.subtitleNe}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {prod.descriptionNe}
                </p>

                {/* Features List */}
                <div className="pt-3 space-y-1.5 border-t border-slate-100 dark:border-slate-800 mt-3">
                  {prod.featuresNe.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through">रू {prod.originalPriceNpr}</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white ml-2">रू {prod.discountedPriceNpr}</span>
                  </div>
                  {prod.hasPdfDownload && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <FileDown className="w-3 h-3" />
                      PDF समावेश
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(prod)}
                    className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    नमुना हेर्नुहोस्
                  </button>

                  {hasAccess ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab('library')}
                      className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
                    >
                      लाइब्रेरीमा पढ्नुहोस्
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(prod)}
                      className="w-full py-2 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                    >
                      अहिले खरिद गर्नुहोस्
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Free Sample Preview Modal */}
      {showPreviewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-sky-700 dark:text-sky-400">निःशुल्क नमुना अध्याय (Free Sample Preview)</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{selectedProduct.titleNe}</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">नमुना अध्याय १: नेपालको बैंकिङ प्रणाली र विकासक्रम</h4>
              <p className="text-slate-700 dark:text-slate-300">
                नेपालमा आधुनिक बैंकिङको प्रारम्भ वि.सं. १९९४ कात्तिक ३० गते नेपाल बैंक लिमिटेडको स्थापनाबाट भएको हो। केन्द्रीय बैंकको रूपमा नेपाल राष्ट्र बैंक २०१३ वैशाख १४ गते स्थापना भएपछि मौद्रिक नियमन र नोट निष्कासन सुरु भयो...
              </p>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-700 dark:text-amber-400">नमुना अभ्यास प्रश्न:</span>
                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  नेपाल राष्ट्र बैंक ऐन, २०५८ को कुन दफामा बैंकका उद्देश्यहरू स्पष्ट रूपमा किटान गरिएको छ?
                </p>
                <p className="text-slate-500 mt-1">✓ उत्तर: दफा ४ (दफा ५ मा काम, कर्तव्य र अधिकार)</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">बाँकी सम्पूर्ण अध्याय र १२ सय MCQs अनलक गर्न:</span>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleOpenCheckout(selectedProduct);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 rounded-xl"
              >
                रू {selectedProduct.discountedPriceNpr} मा पूर्ण अनलक गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout / Payment Modal */}
      {showCheckoutModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">सुरक्षित भुक्तानी (Secure Checkout)</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedProduct.titleNe}</h3>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-300">भुक्तानी गर्नुपर्ने कुल रकम:</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">रू {selectedProduct.discountedPriceNpr}</span>
            </div>

            {/* Gateway Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">भुक्तानी माध्यम छनोट गर्नुहोस्:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'esewa', label: 'eSewa Mobile Wallet' },
                  { id: 'khalti', label: 'Khalti Digital Wallet' },
                  { id: 'connect_ips', label: 'ConnectIPS' },
                  { id: 'manual_bank_transfer', label: 'Bank QR / Transfer' },
                ].map(gw => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setSelectedGateway(gw.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      selectedGateway === gw.id
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {gw.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction / Voucher ID Input */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                ट्रान्ज्याक्सन आइडी वा भौचर नम्बर:
              </label>
              <input
                type="text"
                value={txnIdInput}
                onChange={(e) => setTxnIdInput(e.target.value)}
                placeholder="उदा: 9841XXXXXX वा eSewa Ref"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                पुष्टि गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
