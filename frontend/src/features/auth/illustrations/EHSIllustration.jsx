import React from 'react';

export default function EHSIllustration({ isHovered = false, isSelected = false }) {
  return (
    <div className={`role-character-wrap ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}>
      <svg
        viewBox="0 0 220 190"
        className="character-svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="ehsSkinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDDFD0" />
            <stop offset="100%" stopColor="#F3BF9F" />
          </linearGradient>
          <linearGradient id="ehsHelmetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="ehsVestGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="ehsShieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="ehsEcoGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
          <filter id="ehsSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Contextual Silhouette: Eco Halo & Environmental Leaves ── */}
        <g opacity="0.25" className="context-eco">
          <circle cx="110" cy="90" r="62" stroke="#6EE7B7" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
          {/* Floating Leaf Left */}
          <path d="M 40 100 C 35 85, 52 82, 58 92 C 55 105, 45 105, 40 100 Z" fill="#10B981" />
          {/* Floating Leaf Right */}
          <path d="M 180 92 C 185 77, 168 74, 162 84 C 165 97, 175 97, 180 92 Z" fill="#10B981" />
        </g>

        {/* Ambient Floating Sparks */}
        <circle cx="50" cy="55" r="2.5" fill="#34D399" opacity="0.5" className="float-particle-1" />
        <circle cx="170" cy="120" r="3" fill="#10B981" opacity="0.4" className="float-particle-2" />

        {/* ── Torso & Attire ── */}
        <g className="character-body">
          {/* Base Shirt */}
          <path d="M 68 175 C 68 135, 88 126, 110 126 C 132 126, 152 135, 152 175 Z" fill="#047857" />
          
          {/* Neon Safety Vest */}
          <path d="M 74 140 L 95 138 L 93 175 L 72 175 Z" fill="url(#ehsVestGrad)" />
          <path d="M 146 140 L 125 138 L 127 175 L 148 175 Z" fill="url(#ehsVestGrad)" />
          {/* Silver Reflective Bands */}
          <rect x="74" y="154" width="20" height="5" fill="#FFFFFF" opacity="0.9" />
          <rect x="126" y="154" width="20" height="5" fill="#FFFFFF" opacity="0.9" />

          {/* Neck */}
          <rect x="102" y="105" width="16" height="24" rx="4" fill="url(#ehsSkinGrad)" />
          <path d="M 102 120 C 106 125, 114 125, 118 120" stroke="#E0A480" strokeWidth="1.5" fill="none" opacity="0.6" />

          {/* Head & Face */}
          <ellipse cx="110" cy="88" rx="21" ry="24" fill="url(#ehsSkinGrad)" />
          {/* Ears */}
          <circle cx="89" cy="90" r="5" fill="url(#ehsSkinGrad)" />
          <circle cx="131" cy="90" r="5" fill="url(#ehsSkinGrad)" />

          {/* Friendly Facial Features */}
          <ellipse cx="103" cy="86" rx="2.5" ry="3" fill="#1E293B" />
          <ellipse cx="117" cy="86" rx="2.5" ry="3" fill="#1E293B" />
          <circle cx="104" cy="85" r="0.8" fill="#FFFFFF" />
          <circle cx="118" cy="85" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 99 80 Q 104 78 107 80" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 113 80 Q 116 78 121 80" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Nose */}
          <path d="M 110 88 Q 111 92 108 93" stroke="#D99B77" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          {/* Confident, reassuring smile */}
          <path d="M 104 97 Q 110 103 116 97" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* ── Safety Helmet with Red MEIL Monogram ── */}
          <path d="M 82 76 C 82 72, 138 72, 138 76 C 142 77, 142 81, 136 81 L 84 81 C 78 81, 78 77, 82 76 Z" fill="#E2E8F0" />
          <path d="M 85 75 C 85 45, 135 45, 135 75 Z" fill="url(#ehsHelmetGrad)" />
          <path d="M 108 47 L 112 47 L 113 75 L 107 75 Z" fill="#FFFFFF" opacity="0.7" />
          {/* Red MEIL "M" Monogram Badge */}
          <circle cx="110" cy="62" r="6.5" fill="#EF4444" />
          <path d="M 107 65 L 107 59 L 110 62 L 113 59 L 113 65" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* ── Arms & Glowing Eco Safety Shield ── */}
          <g className="character-arms">
            <path d="M 72 144 C 62 155, 68 170, 85 168" stroke="#047857" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M 148 144 C 158 155, 152 170, 135 168" stroke="#047857" strokeWidth="12" strokeLinecap="round" fill="none" />
            
            <circle cx="88" cy="168" r="6" fill="url(#ehsSkinGrad)" />
            <circle cx="132" cy="168" r="6" fill="url(#ehsSkinGrad)" />

            {/* Protective Eco Safety Shield */}
            <g transform={isHovered ? "translate(0, -4) scale(1.04)" : "translate(0, 0)"} style={{ transition: 'transform 300ms ease' }}>
              <path
                d="M 110 138 Q 128 138 134 148 C 134 168, 120 180, 110 186 C 100 180, 86 168, 86 148 Q 92 138 110 138 Z"
                fill="url(#ehsShieldGrad)"
                stroke="#6EE7B7"
                strokeWidth="1.5"
                filter="url(#ehsSoftGlow)"
              />
              {/* Inner Shield Rim */}
              <path
                d="M 110 142 Q 124 142 129 150 C 129 165, 118 175, 110 179 C 102 175, 91 165, 91 150 Q 96 142 110 142 Z"
                fill="none"
                stroke="#A7F3D0"
                strokeWidth="1"
                opacity="0.7"
              />
              {/* White Eco Leaf Symbol on Shield */}
              <path
                d="M 110 150 C 117 150, 122 156, 120 165 C 113 165, 108 159, 110 150 Z"
                fill="#FFFFFF"
              />
              <path
                d="M 110 150 C 105 156, 107 165, 120 165"
                stroke="#047857"
                strokeWidth="1"
                fill="none"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
