import React from 'react';

/**
 * Official MEIL Logo Component
 * Megha Engineering & Infrastructures Ltd.
 * Matches official corporate branding: Red geometric 'M' mark + dark navy 'meil' + company full name.
 */
export function MeilLogo({ className = '', height = 48 }) {
  return (
    <div className={`meil-official-brand ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg
        height={height}
        viewBox="0 0 220 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: `${height}px`, width: 'auto', display: 'block' }}
        aria-label="MEIL - Megha Engineering & Infrastructures Ltd."
      >
        {/* Red Icon Badge */}
        <g id="meil-badge">
          <rect x="0" y="2" width="50" height="50" rx="10" fill="#E31B23" />
          {/* Inner Geometric M Stencil */}
          <path
            d="M12 40V14L19 25L25 15L31 25L38 14V40H32V25L27 34H23L18 25V40H12Z"
            fill="#FFFFFF"
          />
          {/* Subtle tech dots on red badge */}
          <circle cx="15" cy="18" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
          <circle cx="35" cy="18" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
        </g>

        {/* Wordmark: "meil" */}
        <g id="meil-wordmark" fill="#0A2540">
          {/* m */}
          <path
            d="M62 20C64.2 17.5 67.5 16 71.5 16C75.2 16 78 17.8 79.5 20.8C81.8 17.8 85.2 16 89.2 16C95.5 16 99 20 99 27.5V40H92.5V28.5C92.5 24 90.5 22 86.8 22C83 22 80.5 24.2 80.5 29V40H74V28.5C74 24 72 22 68.3 22C64.5 22 62 24.2 62 29V40H55.5V16.8H62V20Z"
          />
          {/* e */}
          <path
            d="M116.5 29.5C116.5 24.5 113.2 21.5 108.5 21.5C103.8 21.5 100.5 24.8 100.2 29.5H116.5ZM100.2 32.5C100.8 37 104 39.8 108.8 39.8C112.5 39.8 115 38 116.2 35.5H122.8C121 41.5 115.8 45 108.5 45C99.8 45 93.5 38.8 93.5 30.5C93.5 22.2 99.8 16 108.5 16C117.5 16 123 22.2 123 31.5V32.5H100.2Z"
          />
          {/* i */}
          <path
            d="M129 10.5C131.5 10.5 133.5 8.5 133.5 6C133.5 3.5 131.5 1.5 129 1.5C126.5 1.5 124.5 3.5 124.5 6C124.5 8.5 126.5 10.5 129 10.5ZM126 16.8H132V40H126V16.8Z"
          />
          {/* l */}
          <path
            d="M138 2H144V40H138V2Z"
          />
        </g>

        {/* Tagline: MEGHA ENGINEERING & INFRASTRUCTURES LTD. */}
        <text
          x="56"
          y="50"
          fill="#475569"
          fontSize="5.8"
          fontFamily="system-ui, -apple-system, 'Inter', 'Segoe UI', sans-serif"
          fontWeight="700"
          letterSpacing="0.08em"
        >
          MEGHA ENGINEERING &amp; INFRASTRUCTURES LTD.
        </text>
      </svg>
    </div>
  );
}

export default MeilLogo;
