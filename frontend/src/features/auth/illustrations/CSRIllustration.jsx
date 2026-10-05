import React from 'react';

export default function CSRIllustration({ isHovered = false, isSelected = false }) {
  return (
    <div className={`role-character-wrap ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}>
      <svg
        viewBox="0 0 220 190"
        className="character-svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="csrSkinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDECE2" />
            <stop offset="100%" stopColor="#F5C6AA" />
          </linearGradient>
          <linearGradient id="csrHairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E1B10" />
            <stop offset="100%" stopColor="#1B0F09" />
          </linearGradient>
          <linearGradient id="csrTopGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <linearGradient id="csrHeartGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="csrHeartGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Contextual Silhouette: Community Figures & Flourishing Foliage ── */}
        <g opacity="0.22" className="context-community">
          {/* Flourishing leaves */}
          <path d="M 44 110 C 35 90, 54 86, 62 98 C 58 114, 48 114, 44 110 Z" fill="#34D399" />
          <path d="M 176 110 C 185 90, 166 86, 158 98 C 162 114, 172 114, 176 110 Z" fill="#34D399" />
          
          {/* Subtle Community Arc */}
          <path d="M 50 85 Q 110 50 170 85" stroke="#F472B6" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
        </g>

        {/* Floating Heart/Sparkle Particles */}
        <circle cx="45" cy="55" r="2.5" fill="#F472B6" opacity="0.5" className="float-particle-1" />
        <circle cx="175" cy="65" r="3" fill="#38BDF8" opacity="0.4" className="float-particle-2" />

        {/* ── Back Hair ── */}
        <path d="M 86 92 C 80 120, 82 145, 92 155 C 95 140, 92 120, 92 100 Z" fill="url(#csrHairGrad)" />
        <path d="M 134 92 C 140 120, 138 145, 128 155 C 125 140, 128 120, 128 100 Z" fill="url(#csrHairGrad)" />

        {/* ── Torso & Attire ── */}
        <g className="character-body">
          {/* Rose Pink Professional Blouse */}
          <path d="M 72 175 C 72 138, 90 128, 110 128 C 130 128, 148 138, 148 175 Z" fill="url(#csrTopGrad)" />
          
          {/* Elegant White Inner Collar */}
          <path d="M 103 128 L 110 142 L 117 128 Z" fill="#FFFFFF" />

          {/* Neck */}
          <rect x="103" y="106" width="14" height="24" rx="4" fill="url(#csrSkinGrad)" />
          <path d="M 104 122 C 107 126, 113 126, 116 122" stroke="#DF9E7B" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Head & Face */}
          <ellipse cx="110" cy="90" rx="19" ry="22" fill="url(#csrSkinGrad)" />
          {/* Ears */}
          <circle cx="91" cy="92" r="4.5" fill="url(#csrSkinGrad)" />
          <circle cx="129" cy="92" r="4.5" fill="url(#csrSkinGrad)" />

          {/* Flowing Polished Hair */}
          <path d="M 88 88 C 88 64, 132 64, 132 88 C 132 80, 128 72, 110 72 C 92 72, 88 80, 88 88 Z" fill="url(#csrHairGrad)" />
          <path d="M 88 84 C 95 86, 106 84, 110 90 C 114 84, 125 86, 132 84 C 131 75, 125 68, 110 68 C 95 68, 89 75, 88 84 Z" fill="url(#csrHairGrad)" />

          {/* Facial Features */}
          <ellipse cx="104" cy="89" rx="2.2" ry="2.6" fill="#1C1311" />
          <ellipse cx="116" cy="89" rx="2.2" ry="2.6" fill="#1C1311" />
          <circle cx="104.8" cy="88.2" r="0.7" fill="#FFFFFF" />
          <circle cx="116.8" cy="88.2" r="0.7" fill="#FFFFFF" />
          {/* Soft Eyelashes */}
          <path d="M 101 86 Q 104 84 107 86" stroke="#1C1311" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 113 86 Q 116 84 119 86" stroke="#1C1311" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* Eyebrows */}
          <path d="M 101 82 Q 104 80 107 82" stroke="#451A03" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M 113 82 Q 116 80 119 82" stroke="#451A03" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          {/* Nose */}
          <path d="M 110 90 Q 111 94 109 95" stroke="#DF9E7B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* Radiant Community Smile & Cheeks */}
          <path d="M 105 99 Q 110 104 115 99" stroke="#BE185D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="94" r="3.2" fill="#F472B6" opacity="0.45" />
          <circle cx="122" cy="94" r="3.2" fill="#F472B6" opacity="0.45" />

          {/* ── Cupped Hands Gently Holding Glowing Heart ── */}
          <g className="character-arms">
            <path d="M 74 148 C 68 158, 80 172, 98 168" stroke="url(#csrTopGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M 146 148 C 152 158, 140 172, 122 168" stroke="url(#csrTopGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            
            {/* Cupped Hands */}
            <ellipse cx="102" cy="168" rx="6" ry="4" fill="url(#csrSkinGrad)" />
            <ellipse cx="118" cy="168" rx="6" ry="4" fill="url(#csrSkinGrad)" />

            {/* Glowing Radiant Community Heart */}
            <g transform={isHovered ? "translate(0, -4) scale(1.08)" : "translate(0, 0)"} style={{ transition: 'transform 300ms ease', transformOrigin: '110px 158px' }}>
              <path
                d="M 110 165 C 104 158, 96 150, 96 144 C 96 138, 102 134, 107 136 C 109 137, 110 139, 110 139 C 110 139, 111 137, 113 136 C 118 134, 124 138, 124 144 C 124 150, 116 158, 110 165 Z"
                fill="url(#csrHeartGrad)"
                stroke="#FBCFE8"
                strokeWidth="1.2"
                filter="url(#csrHeartGlow)"
              />
              {/* Highlight Sparkle in Heart */}
              <circle cx="104" cy="141" r="1.5" fill="#FFFFFF" opacity="0.9" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
