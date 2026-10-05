import React from 'react';

export default function HRIllustration({ isHovered = false, isSelected = false }) {
  return (
    <div className={`role-character-wrap ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}>
      <svg
        viewBox="0 0 220 190"
        className="character-svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="hrSkinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCE5D8" />
            <stop offset="100%" stopColor="#F2C1A2" />
          </linearGradient>
          <linearGradient id="hrHairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#332421" />
            <stop offset="100%" stopColor="#1C1311" />
          </linearGradient>
          <linearGradient id="hrBlouseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="hrFolderGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <filter id="hrGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Contextual Silhouette: Collaborative People / Team ── */}
        <g opacity="0.22" className="context-team">
          {/* Left Colleague Silhouette */}
          <circle cx="55" cy="98" r="9" fill="#38BDF8" />
          <path d="M 42 128 C 42 114, 52 112, 55 112 C 58 112, 68 114, 68 128 Z" fill="#38BDF8" />
          
          {/* Right Colleague Silhouette */}
          <circle cx="165" cy="98" r="9" fill="#38BDF8" />
          <path d="M 152 128 C 152 114, 162 112, 165 112 C 168 112, 178 114, 178 128 Z" fill="#38BDF8" />

          {/* Connection Arc Nodes */}
          <path d="M 55 98 Q 110 65 165 98" stroke="#7DD3FC" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
        </g>

        {/* Floating atmospheric dots */}
        <circle cx="48" cy="65" r="2.5" fill="#38BDF8" opacity="0.4" className="float-particle-1" />
        <circle cx="172" cy="72" r="3" fill="#60A5FA" opacity="0.4" className="float-particle-2" />

        {/* ── Character Back Hair (Flowing) ── */}
        <path d="M 85 90 C 80 120, 82 145, 92 155 C 95 140, 92 120, 92 100 Z" fill="url(#hrHairGrad)" />
        <path d="M 135 90 C 140 120, 138 145, 128 155 C 125 140, 128 120, 128 100 Z" fill="url(#hrHairGrad)" />

        {/* ── Torso & Attire ── */}
        <g className="character-body">
          {/* Navy / Teal Tailored Blouse */}
          <path d="M 72 175 C 72 138, 90 128, 110 128 C 130 128, 148 138, 148 175 Z" fill="url(#hrBlouseGrad)" />
          
          {/* Inner Collar White Accent */}
          <path d="M 103 128 L 110 142 L 117 128 Z" fill="#FFFFFF" />

          {/* Neck */}
          <rect x="103" y="106" width="14" height="24" rx="4" fill="url(#hrSkinGrad)" />
          <path d="M 104 122 C 107 126, 113 126, 116 122" stroke="#DF9E7B" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Head & Face */}
          <ellipse cx="110" cy="90" rx="19" ry="22" fill="url(#hrSkinGrad)" />
          {/* Ears */}
          <circle cx="91" cy="92" r="4.5" fill="url(#hrSkinGrad)" />
          <circle cx="129" cy="92" r="4.5" fill="url(#hrSkinGrad)" />

          {/* Professional Stylized Hairstyle */}
          <path d="M 88 88 C 88 64, 132 64, 132 88 C 132 80, 128 72, 110 72 C 92 72, 88 80, 88 88 Z" fill="url(#hrHairGrad)" />
          <path d="M 88 84 C 95 86, 106 84, 110 90 C 114 84, 125 86, 132 84 C 131 75, 125 68, 110 68 C 95 68, 89 75, 88 84 Z" fill="url(#hrHairGrad)" />

          {/* Facial Features */}
          {/* Eyes */}
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
          {/* Friendly Smile with rosy cheeks */}
          <path d="M 105 99 Q 110 104 115 99" stroke="#E11D48" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="94" r="3" fill="#FDA4AF" opacity="0.45" />
          <circle cx="122" cy="94" r="3" fill="#FDA4AF" opacity="0.45" />

          {/* ── Arms & Enterprise People Folder / Tablet ── */}
          <g className="character-arms">
            <path d="M 75 146 C 66 156, 74 172, 88 170" stroke="url(#hrBlouseGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M 145 146 C 154 156, 146 172, 132 170" stroke="url(#hrBlouseGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            
            <circle cx="90" cy="170" r="5" fill="url(#hrSkinGrad)" />
            <circle cx="130" cy="170" r="5" fill="url(#hrSkinGrad)" />

            {/* People & Talent Directory Folder */}
            <g transform={isHovered ? "translate(0, -3) scale(1.02)" : "translate(0, 0)"} style={{ transition: 'transform 300ms ease' }}>
              <rect x="88" y="150" width="44" height="32" rx="4" fill="url(#hrFolderGrad)" stroke="#BAE6FD" strokeWidth="1" filter="url(#hrGlow)" />
              {/* Folder Header Tab */}
              <rect x="91" y="147" width="18" height="6" rx="2" fill="#0284C7" />
              {/* Profile Card Mock on Folder */}
              <rect x="92" y="154" width="36" height="24" rx="2" fill="#FFFFFF" opacity="0.95" />
              <circle cx="99" cy="162" r="3.5" fill="#38BDF8" />
              <line x1="106" y1="160" x2="124" y2="160" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="106" y1="165" x2="118" y2="165" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="122" cy="172" r="2" fill="#10B981" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
