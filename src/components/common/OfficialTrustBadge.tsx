import React from 'react';
import { ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react';

interface OfficialTrustBadgeProps {
  sourceName?: string;
  sourceUrl?: string;
  actSection?: string;
  verifiedYearBS?: string;
  className?: string;
}

/**
 * Official Trust Marker
 * Verifies authenticity back to official statutory references:
 * Nepal Rastra Bank Directives, Acts, or Public Service Commission standards.
 */
export const OfficialTrustBadge: React.FC<OfficialTrustBadgeProps> = ({
  sourceName = 'नेपाल राष्ट्र बैंक ऐन, २०५८ तथा लोक सेवा आयोग',
  sourceUrl,
  actSection,
  verifiedYearBS = '२०८१/८२ अद्यावधिक',
  className = ''
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium ${className}`}
    >
      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-[11px] uppercase tracking-wider">प्रमाणित स्रोत</span>
      </div>

      <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>

      <span className="truncate">
        {sourceName} {actSection ? `(${actSection})` : ''}
      </span>

      <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>

      <span className="text-[11px] text-slate-500 font-mono tabular-nums shrink-0">
        {verifiedYearBS}
      </span>

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 hover:text-sky-700 dark:text-sky-400 ml-1 inline-flex items-center"
          title="आधिकारिक स्रोत कागजात हेर्नुहोस्"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};

export default OfficialTrustBadge;
