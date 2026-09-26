import React from 'react';
import { useApp } from '../../context/AppContext';
import { DbService } from '../../services/dbService';
import { DIGITAL_PRODUCTS_CATALOG } from '../../data/digitalProductsData';
import { 
  BookOpen, 
  FileDown, 
  Sparkles, 
  Bookmark, 
  ArrowRight, 
  Layers, 
  ShieldCheck,
  Award
} from 'lucide-react';

export const LibraryScreen: React.FC = () => {
  const { openNoteReader, addToast, setActiveTab, bookmarks } = useApp();

  const entitlements = DbService.getUserEntitlements();
  // Filter products user has access to, or all previewable books
  const accessibleProducts = DIGITAL_PRODUCTS_CATALOG.filter(p => 
    DbService.hasProductEntitlement(p.id) || entitlements.some(e => e.productId === p.id)
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>मेरो डिजिटल अध्ययन पुस्तकालय (My Study Library)</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          अनलक गरिएका पुस्तकहरू तथा व्यक्तिगत अध्ययन सामग्री
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          तपाईंले खरिद गर्नुभएका डिजिटल पुस्तकहरू, सुरक्षित गरिएका बुँदाहरू र अफलाइन PDF सामग्रीहरू
        </p>
      </div>

      {/* 2. Unlocked Books Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-600" />
          <span>अध्ययनका लागि उपलब्ध पुस्तकहरू ({accessibleProducts.length})</span>
        </h2>

        {accessibleProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">हाल कुनै पुस्तक अनलक गरिएको छैन</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              स्टोरमा गएर आवश्यक डिजिटल पुस्तक वा प्रश्न बैंक अनलक गर्नुहोस्।
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 rounded-xl shadow-xs"
            >
              स्टोर हेर्नुहोस् →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessibleProducts.map(prod => (
              <div 
                key={prod.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    सक्रिय (Active Access)
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2">
                    {prod.titleNe}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prod.descriptionNe}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      openNoteReader(prod.titleNe);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 rounded-xl shadow-xs"
                  >
                    <span>पढ्न सुरु गर्नुहोस् (Read)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {prod.hasPdfDownload && (
                    <button
                      type="button"
                      onClick={() => {
                        addToast(`'${prod.titleNe}' PDF डाउनलोड तयारी गरिँदैछ...`, 'info');
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>PDF</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Bookmarked Topics & Notes */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>सुरक्षित गरिएका अध्ययन सामग्रीहरू (Bookmarks - {bookmarks.length})</span>
          </h2>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className="text-xs font-semibold text-sky-600 hover:underline"
          >
            सबै बुकमार्कहरू →
          </button>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {bookmarks.slice(0, 6).map((bm, bIdx) => (
              <div 
                key={bIdx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between"
              >
                <div className="truncate mr-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{bm.title}</p>
                  <span className="text-xs text-slate-500">{bm.category}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openNoteReader(bm.title)}
                  className="text-xs text-sky-600 hover:underline shrink-0 font-medium"
                >
                  खोल्नुहोस्
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">हालसम्म कुनै पनि नोट बुकमार्क गरिएको छैन।</p>
        )}
      </div>
    </div>
  );
};
