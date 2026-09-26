import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  CheckCircle2, 
  X, 
  Layers, 
  BookOpen, 
  Sparkles, 
  AlertCircle,
  Building2,
  FileText,
  Clock,
  Download,
  Loader2,
  Table,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  downloadCompleteSyllabusPdf, 
  printCompleteSyllabusFallback,
  PdfGenerationProgress 
} from '../../services/completeSyllabusPdfService';
import { useApp } from '../../context/AppContext';

export interface CompleteSyllabusPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompleteSyllabusPdfModal: React.FC<CompleteSyllabusPdfModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addToast } = useApp();
  const [progress, setProgress] = useState<PdfGenerationProgress>({
    percent: 0,
    stage: '',
    status: 'idle'
  });

  if (!isOpen) return null;

  const isGenerating = progress.status === 'generating';
  const isSuccess = progress.status === 'success';
  const isError = progress.status === 'error';

  const handleDownload = async () => {
    try {
      setProgress({
        percent: 5,
        stage: 'Generating PDF...',
        status: 'generating'
      });

      await downloadCompleteSyllabusPdf((p) => {
        setProgress(p);
      });

      addToast('PDF downloaded successfully. (Banking_Tayari_Nepal_Complete_Syllabus.pdf)', 'success');
    } catch (err: any) {
      console.error('PDF download error:', err);
      setProgress({
        percent: 0,
        stage: 'त्रुटि भयो',
        status: 'error',
        errorMessage: err?.message || 'PDF निर्माणमा समस्या आयो। कृपया प्रिन्ट विकल्प प्रयोग गर्नुहोस्।'
      });
      addToast('PDF प्रत्यक्ष निर्माणमा समस्या आयो। "Print / Save as PDF" प्रयोग गर्नुहोस्।', 'warning');
    }
  };

  const handlePrintFallback = () => {
    try {
      printCompleteSyllabusFallback();
      addToast('प्रिन्ट विन्डो खुल्यो। "Save as PDF" छनोट गर्नुहोस्।', 'info');
    } catch (err) {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-modal-title"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0B2046] via-[#1E3A8A] to-[#0F172A] text-white p-5 sm:p-6 flex items-start justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-sky-400">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-white tracking-wider">
                  A4 FORMAT
                </span>
                <span className="text-xs text-sky-300 font-bold">
                  १० पूर्ण पृष्ठहरू (10 Pages)
                </span>
              </div>
              <h2 id="pdf-modal-title" className="text-lg sm:text-xl font-black text-white mt-1">
                पूर्ण पाठ्यक्रम तथा परीक्षा गाइड PDF
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू तथा लोक सेवा आयोग आधिकारिक पाठ्यक्रम
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200 flex-1">
          
          {/* File Meta Pill Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">फाइलको नाम (File Name):</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 truncate max-w-[260px]">
                Banking_Tayari_Nepal_Complete_Syllabus.pdf
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">कागजको आकार (Paper Size):</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                A4 Portrait (210mm × 297mm)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">नेपाली युनिकोड (Fonts):</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> १००% सुरक्षित Devanagari Unicode
              </span>
            </div>
          </div>

          {/* Included Content Checklist */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              PDF मा समावेश मुख्य खण्डहरू (Included Sections):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200">NRB तह ४ र ६ पाठ्यक्रम</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <Building2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200">RBB तथा NBL तह ४ र ५</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <Building2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200">ADBL तथा संगठित संस्था ५० सेट</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <Building2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200">लोक सेवा आयोग शाखा अधिकृत</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <Table className="w-4 h-4 text-cyan-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200">मौद्रिक नीति र वित्तीय दर तालिका</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <Table className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200">BAFIA बैंक पुँजी वर्गीकरण</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <Table className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200">कर्जा वर्गीकरण र नोक्सानी (NPL)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200">१०-अङ्कको मोडेल उत्तर विधि</span>
              </div>
            </div>
          </div>

          {/* Dynamic Progress / Loading Status Indicator */}
          {isGenerating && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl p-4 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                  Generating PDF… (PDF तयार गरिँदैछ...)
                </span>
                <span className="text-blue-700 dark:text-blue-300 font-mono">
                  {progress.percent}%
                </span>
              </div>
              <div className="w-full bg-blue-100 dark:bg-blue-900/50 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="text-[11px] text-blue-600 dark:text-blue-300 text-center font-medium">
                {progress.stage || 'कृपया केही सेकेन्ड प्रतिक्षा गर्नुहोस्...'}
              </p>
            </div>
          )}

          {/* Success Indicator */}
          {isSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  PDF downloaded successfully.
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  फाइल तपाईंको डिभाइसमा सुरक्षित भएको छ (Banking_Tayari_Nepal_Complete_Syllabus.pdf)।
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {isError && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-800 dark:text-amber-300">
                  प्रत्यक्ष डाउनलोडमा समस्या आएको भए:
                </span>
                <p className="text-amber-700 dark:text-amber-400 mt-0.5">
                  तलको "Print / Save as PDF" बटन थिची सिधै ब्राउजरबाट सुरक्षित गर्न सक्नुहुन्छ।
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Print / Save as PDF Fallback Button */}
          <button
            type="button"
            onClick={handlePrintFallback}
            disabled={isGenerating}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            title="ब्राउजरको प्रिन्ट विन्डो खोली PDF को रूपमा सेभ गर्नुहोस्"
          >
            <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Print / Save as PDF (Fallback)</span>
          </button>

          {/* Primary Download PDF Button */}
          <button
            type="button"
            id="modal-direct-download-pdf-btn"
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF…</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>पुनः डाउनलोड गर्नुहोस् (Download Again)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF (डाउनलोड गर्नुहोस्)</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
