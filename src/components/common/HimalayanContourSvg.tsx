import React from 'react';

interface HimalayanContourSvgProps {
  className?: string;
  variant?: 'light' | 'midnight';
}

export const HimalayanContourSvg: React.FC<HimalayanContourSvgProps> = ({
  className = 'w-full h-full',
  variant = 'light'
}) => {
  const isDark = variant === 'midnight';
  const strokePrimary = isDark ? '#38BDF8' : '#0284C7';
  const strokeSecondary = isDark ? '#60A5FA' : '#0369A1';
  const strokeTertiary = isDark ? '#C5A059' : '#0F172A';

  return (
    <svg
      viewBox="0 0 1440 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-sky-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#0284C7' : '#E0F2FE'} stopOpacity={isDark ? '0.18' : '0.4'} />
          <stop offset="100%" stopColor={isDark ? '#0F172A' : '#FFFFFF'} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`grad-mtn-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#38BDF8' : '#0284C7'} stopOpacity={isDark ? '0.12' : '0.08'} />
          <stop offset="100%" stopColor={isDark ? '#060D1D' : '#F8FAFC'} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Atmospheric Sky Backdrop */}
      <rect width="1440" height="380" fill={`url(#grad-sky-${variant})`} />

      {/* Back Himalayan Range (Distant High Peaks: Everest & Lhotse silhouettes) */}
      <path
        d="M0 240 L120 180 L220 210 L340 130 L440 170 L580 90 L710 160 L840 70 L960 140 L1080 100 L1220 170 L1340 120 L1440 180 L1440 380 L0 380 Z"
        fill={`url(#grad-mtn-${variant})`}
        stroke={strokePrimary}
        strokeWidth="1.2"
        strokeOpacity={isDark ? '0.45' : '0.35'}
      />

      {/* Mid Himalayan Ridge (Machapuchare Fishtail Pyramid & Annapurna Massif) */}
      <path
        d="M0 290 L160 220 L280 250 L420 180 L520 220 L660 150 L780 210 L920 130 L1040 190 L1180 150 L1300 210 L1440 160"
        stroke={strokeSecondary}
        strokeWidth="1.5"
        strokeOpacity={isDark ? '0.6' : '0.45'}
        strokeLinejoin="round"
      />

      {/* Topographic Elevation Curves (Subtle Academic Linework) */}
      <path
        d="M-50 320 Q 300 240 720 280 T 1490 220"
        stroke={strokePrimary}
        strokeWidth="1"
        strokeDasharray="4 4"
        strokeOpacity={isDark ? '0.35' : '0.25'}
      />
      <path
        d="M-50 350 Q 360 270 820 310 T 1490 250"
        stroke={strokeTertiary}
        strokeWidth="1"
        strokeOpacity={isDark ? '0.3' : '0.2'}
      />

      {/* Subtle Summit Flag Markers (Machapuchare, Everest, Annapurna) */}
      <g stroke={strokePrimary} strokeWidth="1" opacity={isDark ? '0.8' : '0.6'}>
        <line x1="840" y1="70" x2="840" y2="52" />
        <polygon points="840,52 850,56 840,60" fill={isDark ? '#38BDF8' : '#0284C7'} />

        <line x1="580" y1="90" x2="580" y2="76" />
        <polygon points="580,76 588,80 580,84" fill={isDark ? '#C5A059' : '#C8102E'} />
      </g>
    </svg>
  );
};

export default HimalayanContourSvg;
