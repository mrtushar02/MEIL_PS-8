import React from 'react';

export default function ProjectIllustration({ isHovered = false, isSelected = false }) {
  return (
    <div className={`role-character-wrap ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}>
      <svg
        viewBox="0 0 220 190"
        className="character-svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="projSkinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDDFD0" />
            <stop offset="100%" stopColor="#F3BF9F" />
          </linearGradient>
          <linearGradient id="projHelmetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#EDF4F9" />
            <stop offset="100%" stopColor="#D4E4F0" />
          </linearGradient>
          <linearGradient id="projShirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="projVestGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="projTabletGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="projScreenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <filter id="projSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Contextual Silhouette: Construction Crane & Scaffolding ── */}
        <g opacity="0.22" className="context-crane">
          <path d="M 30 140 L 30 70 L 80 50 L 80 140" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
          <line x1="30" y1="90" x2="80" y2="70" stroke="#93C5FD" strokeWidth="1" />
          <line x1="30" y1="110" x2="80" y2="90" stroke="#93C5FD" strokeWidth="1" />
          <line x1="30" y1="70" x2="180" y2="35" stroke="#60A5FA" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="80" y1="50" x2="180" y2="35" stroke="#60A5FA" strokeWidth="1.5" />
          <line x1="160" y1="42" x2="160" y2="75" stroke="#93C5FD" strokeWidth="1.5" />
          <rect x="154" y="75" width="12" height="10" rx="2" fill="#93C5FD" opacity="0.6" />
        </g>

        {/* ── Floating Atmospheric ESG Sparks ── */}
        <circle cx="45" cy="50" r="3" fill="#60A5FA" opacity="0.4" className="float-particle-1" />
        <circle cx="178" cy="115" r="2.5" fill="#38BDF8" opacity="0.5" className="float-particle-2" />

        {/* ── Torso & Attire ── */}
        <g className="character-body">
          {/* Blue Under-shirt */}
          <path d="M 70 175 C 70 135, 88 126, 110 126 C 132 126, 150 135, 150 175 Z" fill="url(#projShirtGrad)" />
          
          {/* Orange Safety Vest */}
          <path d="M 75 142 L 94 140 L 92 175 L 72 175 Z" fill="url(#projVestGrad)" />
          <path d="M 145 142 L 126 140 L 128 175 L 148 175 Z" fill="url(#projVestGrad)" />
          {/* Reflective Silver Stripes */}
          <path d="M 76 156 L 93 154 L 93 160 L 75 162 Z" fill="#FFFFFF" opacity="0.85" />
          <path d="M 144 156 L 127 154 L 127 160 L 145 162 Z" fill="#FFFFFF" opacity="0.85" />
          
          {/* Neck */}
          <rect x="102" y="105" width="16" height="24" rx="4" fill="url(#projSkinGrad)" />
          <path d="M 102 120 C 106 125, 114 125, 118 120" stroke="#E0A480" strokeWidth="1.5" fill="none" opacity="0.6" />

          {/* Head & Face */}
          <ellipse cx="110" cy="88" rx="21" ry="24" fill="url(#projSkinGrad)" />
          {/* Ears */}
          <circle cx="89" cy="90" r="5" fill="url(#projSkinGrad)" />
          <circle cx="131" cy="90" r="5" fill="url(#projSkinGrad)" />

          {/* Friendly Facial Features */}
          {/* Eyes */}
          <ellipse cx="103" cy="86" rx="2.5" ry="3" fill="#1E293B" />
          <ellipse cx="117" cy="86" rx="2.5" ry="3" fill="#1E293B" />
          <circle cx="104" cy="85" r="0.8" fill="#FFFFFF" />
          <circle cx="118" cy="85" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 99 80 Q 104 78 107 80" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 113 80 Q 116 78 121 80" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Nose */}
          <path d="M 110 88 Q 111 92 108 93" stroke="#D99B77" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          {/* Smile */}
          <path d="M 105 97 Q 110 102 115 97" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* ── Hard Hat (Engineering Helmet) ── */}
          {/* Helmet Brim */}
          <path d="M 82 76 C 82 72, 138 72, 138 76 C 142 77, 142 81, 136 81 L 84 81 C 78 81, 78 77, 82 76 Z" fill="#E2E8F0" />
          {/* Helmet Dome */}
          <path d="M 85 75 C 85 45, 135 45, 135 75 Z" fill="url(#projHelmetGrad)" />
          {/* Central Ridge */}
          <path d="M 108 47 L 112 47 L 113 75 L 107 75 Z" fill="#FFFFFF" opacity="0.7" />
          {/* Red MEIL "M" Monogram Badge */}
          <circle cx="110" cy="62" r="6.5" fill="#EF4444" />
          <path d="M 107 65 L 107 59 L 110 62 L 113 59 L 113 65" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* ── Hands & Digital ESG Tablet ── */}
          <g className="character-arms">
            {/* Left Arm & Sleeve */}
            <path d="M 72 144 C 62 155, 68 170, 85 168" stroke="url(#projShirtGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Right Arm & Sleeve */}
            <path d="M 148 144 C 158 155, 152 170, 135 168" stroke="url(#projShirtGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            
            {/* Hands */}
            <circle cx="88" cy="168" r="6" fill="url(#projSkinGrad)" />
            <circle cx="132" cy="168" r="6" fill="url(#projSkinGrad)" />

            {/* High-tech ESG Site Tablet */}
            <g transform={isHovered ? "translate(0, -3) rotate(-1 110 162)" : "translate(0, 0)"} style={{ transition: 'transform 300ms ease' }}>
              <rect x="85" y="148" width="50" height="34" rx="4" fill="url(#projTabletGrad)" stroke="#64748B" strokeWidth="1" filter="url(#projSoftGlow)" />
              {/* Screen Area */}
              <rect x="88" y="151" width="44" height="28" rx="2" fill="#0C4A6E" />
              {/* Data Bars / Graph on Tablet */}
              <rect x="92" y="168" width="5" height="7" rx="1" fill="#38BDF8" />
              <rect x="99" y="163" width="5" height="12" rx="1" fill="#4ADE80" />
              <rect x="106" y="159" width="5" height="16" rx="1" fill="#38BDF8" />
              <rect x="113" y="165" width="5" height="10" rx="1" fill="#F59E0B" />
              <rect x="120" y="156" width="5" height="19" rx="1" fill="#38BDF8" />
              {/* Pulse Signal Dot */}
              <circle cx="127" cy="154" r="1.5" fill="#4ADE80" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
