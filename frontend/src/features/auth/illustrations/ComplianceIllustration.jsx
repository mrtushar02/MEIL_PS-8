import React from 'react';

export default function ComplianceIllustration({ isHovered = false, isSelected = false }) {
  return (
    <div className={`role-character-wrap ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}>
      <svg
        viewBox="0 0 220 190"
        className="character-svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="compSkinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDDFD0" />
            <stop offset="100%" stopColor="#F3BF9F" />
          </linearGradient>
          <linearGradient id="compHairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="compSuitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="compTieGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="compShieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <filter id="compGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Contextual Silhouette: Regulatory Scales & Verified Geometry ── */}
        <g opacity="0.22" className="context-compliance">
          {/* Statutory Scales Beam */}
          <line x1="50" y1="75" x2="80" y2="75" stroke="#93C5FD" strokeWidth="1.5" />
          <line x1="65" y1="65" x2="65" y2="85" stroke="#93C5FD" strokeWidth="1.5" />
          <path d="M 50 75 L 45 90 L 55 90 Z" stroke="#93C5FD" strokeWidth="1" fill="none" />
          <path d="M 80 75 L 75 90 L 85 90 Z" stroke="#93C5FD" strokeWidth="1" fill="none" />

          {/* Verification Shield Halo Right */}
          <path d="M 165 70 Q 175 70 178 76 C 178 88, 170 94, 165 98 C 160 94, 152 88, 152 76 Q 155 70 165 70 Z" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
        </g>

        {/* Floating atmospheric dots */}
        <circle cx="48" cy="55" r="2.5" fill="#60A5FA" opacity="0.5" className="float-particle-1" />
        <circle cx="172" cy="115" r="3" fill="#38BDF8" opacity="0.4" className="float-particle-2" />

        {/* ── Torso & Attire (Sharp Business Suit) ── */}
        <g className="character-body">
          {/* Dark Navy Tailored Suit */}
          <path d="M 70 175 C 70 136, 88 126, 110 126 C 132 126, 150 136, 150 175 Z" fill="url(#compSuitGrad)" />
          
          {/* Crisp White Shirt V-shape */}
          <path d="M 98 126 L 110 152 L 122 126 Z" fill="#FFFFFF" />
          
          {/* Royal Blue Silk Necktie */}
          <path d="M 107 132 L 113 132 L 115 156 L 110 164 L 105 156 Z" fill="url(#compTieGrad)" />

          {/* Neck */}
          <rect x="103" y="106" width="14" height="22" rx="4" fill="url(#compSkinGrad)" />
          <path d="M 103 121 C 107 125, 113 125, 117 121" stroke="#E0A480" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Head & Face */}
          <ellipse cx="110" cy="89" rx="20" ry="23" fill="url(#compSkinGrad)" />
          {/* Ears */}
          <circle cx="90" cy="91" r="4.5" fill="url(#compSkinGrad)" />
          <circle cx="130" cy="91" r="4.5" fill="url(#compSkinGrad)" />

          {/* Distinguished Side-parted Hair */}
          <path d="M 90 85 C 90 65, 130 65, 130 85 C 130 72, 124 67, 110 67 C 96 67, 90 72, 90 85 Z" fill="url(#compHairGrad)" />
          <path d="M 91 80 C 98 75, 110 74, 116 72 C 122 75, 126 77, 129 80 C 128 73, 122 66, 110 66 C 98 66, 92 73, 91 80 Z" fill="url(#compHairGrad)" />

          {/* Facial Features */}
          <ellipse cx="104" cy="87" rx="2.3" ry="2.8" fill="#0F172A" />
          <ellipse cx="116" cy="87" rx="2.3" ry="2.8" fill="#0F172A" />
          <circle cx="104.8" cy="86.2" r="0.8" fill="#FFFFFF" />
          <circle cx="116.8" cy="86.2" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 100 81 Q 104 79 107 81" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M 113 81 Q 116 79 120 81" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          {/* Nose */}
          <path d="M 110 89 Q 111 93 108 94" stroke="#D99B77" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          {/* Distinguished Authoritative Smile */}
          <path d="M 105 99 Q 110 103 115 99" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />

          {/* ── Arms & Statutory Disclosure Checklist ── */}
          <g className="character-arms">
            <path d="M 74 146 C 64 156, 72 172, 86 170" stroke="url(#compSuitGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M 146 146 C 156 156, 148 172, 134 170" stroke="url(#compSuitGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            
            <circle cx="88" cy="170" r="5.5" fill="url(#compSkinGrad)" />
            <circle cx="132" cy="170" r="5.5" fill="url(#compSkinGrad)" />

            {/* Official Statutory Audit Clipboard & Shield */}
            <g transform={isHovered ? "translate(0, -3) scale(1.03)" : "translate(0, 0)"} style={{ transition: 'transform 300ms ease' }}>
              <rect x="88" y="150" width="44" height="32" rx="4" fill="#334155" stroke="#94A3B8" strokeWidth="1" filter="url(#compGlow)" />
              {/* Paper Sheet on Clipboard */}
              <rect x="91" y="153" width="38" height="26" rx="2" fill="#FFFFFF" />
              {/* Top Clip */}
              <rect x="104" y="148" width="12" height="4" rx="1.5" fill="#94A3B8" />
              {/* Checklist Lines with Checkmarks */}
              <path d="M 95 160 L 97 162 L 101 158" stroke="#16A34A" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="104" y1="160" x2="122" y2="160" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />

              <path d="M 95 167 L 97 169 L 101 165" stroke="#16A34A" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="104" y1="167" x2="118" y2="167" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />

              {/* Blue Assurance Seal Shield */}
              <g transform="translate(118, 164) scale(0.6)">
                <path d="M 12 0 Q 20 0 24 6 C 24 16, 16 22, 12 24 C 8 22, 0 16, 0 6 Q 4 0 12 0 Z" fill="url(#compShieldGrad)" />
                <path d="M 7 11 L 10 14 L 17 7" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
