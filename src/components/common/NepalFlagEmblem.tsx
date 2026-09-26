import React from 'react';

interface NepalFlagEmblemProps {
  className?: string;
}

/**
 * Authentic Nepal Double-Pennant Vector Emblem
 * Geometry strictly matching the unique national flag of Nepal:
 * - Two stacked triangular pennants
 * - Crimson red field (#C8102E) with deep blue border (#0B2046)
 * - Crescent moon with 8 rays in upper pennant (#FFFFFF)
 * - 12-rayed sun in lower pennant (#FFFFFF)
 */
export const NepalFlagEmblem: React.FC<NepalFlagEmblemProps> = ({
  className = 'w-5 h-6'
}) => {
  return (
    <svg
      viewBox="0 0 100 125"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="National Flag of Nepal"
    >
      {/* Outer Blue Border (Pennant Polygon) */}
      <polygon
        points="4,4 4,120 72,120 22,66 94,66 4,4"
        fill="#0B2046"
      />
      {/* Inner Crimson Red Field */}
      <polygon
        points="9,11 9,113 65,113 20,62 82,62 9,11"
        fill="#C8102E"
      />

      {/* Upper Pennant: Crescent Moon & Rays */}
      <g transform="translate(24, 38)">
        {/* Crescent Shape */}
        <path
          d="M -10,3 A 14,14 0 0,0 12,3 A 12,12 0 0,1 -8,1 Z"
          fill="#FFFFFF"
        />
        {/* Central Lunar Disc & Rays */}
        <circle cx="1" cy="6" r="3.2" fill="#FFFFFF" />
        <path
          d="M 1,-1 L 1.8,3 L 3.5,0.5 L 3.2,4.5 L 5.5,3 L 4.5,6 L 6.5,5.5 L 4.8,7.5 L -0.8,3 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Lower Pennant: 12-Rayed Sun */}
      <g transform="translate(26, 88)">
        <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
        {/* 12 Triangular Rays */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <polygon
            key={deg}
            points="0,-10 2.2,-5 -2.2,-5"
            fill="#FFFFFF"
            transform={`rotate(${deg})`}
          />
        ))}
      </g>
    </svg>
  );
};

export default NepalFlagEmblem;
