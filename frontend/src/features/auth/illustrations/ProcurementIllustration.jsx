import React from 'react';

export default function ProcurementIllustration({ isHovered = false, isSelected = false }) {
  return (
    <div className={`role-character-wrap ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}>
      <svg
        viewBox="0 0 220 190"
        className="character-svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="procSkinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDDFD0" />
            <stop offset="100%" stopColor="#F3BF9F" />
          </linearGradient>
          <linearGradient id="procHairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#292524" />
            <stop offset="100%" stopColor="#1C1917" />
          </linearGradient>
          <linearGradient id="procShirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="procBoxGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <filter id="procGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Contextual Silhouette: Floating Supply Crates & Flow Arrows ── */}
        <g opacity="0.22" className="context-supply">
          {/* Background Supply Cube Left */}
          <path d="M 45 92 L 60 84 L 75 92 L 60 100 Z" fill="#93C5FD" />
          <path d="M 45 92 L 60 100 L 60 115 L 45 107 Z" fill="#60A5FA" />
          <path d="M 60 100 L 75 92 L 75 107 L 60 115 Z" fill="#3B82F6" />

          {/* Background Supply Cube Right */}
          <path d="M 155 78 L 168 71 L 181 78 L 168 85 Z" fill="#93C5FD" />
          <path d="M 155 78 L 168 85 L 168 98 L 155 91 Z" fill="#60A5FA" />
          <path d="M 168 85 L 181 78 L 181 91 L 168 98 Z" fill="#3B82F6" />

          {/* Route Arrow Line */}
          <path d="M 60 84 Q 110 50 160 70" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
        </g>

        {/* Ambient floating dots */}
        <circle cx="48" cy="55" r="2.5" fill="#38BDF8" opacity="0.5" className="float-particle-1" />
        <circle cx="175" cy="115" r="3" fill="#60A5FA" opacity="0.4" className="float-particle-2" />

        {/* ── Torso & Attire ── */}
        <g className="character-body">
          {/* Smart Collared Shirt */}
          <path d="M 70 175 C 70 136, 88 126, 110 126 C 132 126, 150 136, 150 175 Z" fill="url(#procShirtGrad)" />
          
          {/* Collar Details */}
          <path d="M 98 126 L 110 138 L 122 126 Z" fill="#FFFFFF" opacity="0.95" />
          <path d="M 109 138 L 109 175" stroke="#0284C7" strokeWidth="1.5" />

          {/* Neck */}
          <rect x="103" y="106" width="14" height="22" rx="4" fill="url(#procSkinGrad)" />
          <path d="M 103 121 C 107 125, 113 125, 117 121" stroke="#E0A480" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Head & Face */}
          <ellipse cx="110" cy="89" rx="20" ry="23" fill="url(#procSkinGrad)" />
          {/* Ears */}
          <circle cx="90" cy="91" r="4.5" fill="url(#procSkinGrad)" />
          <circle cx="130" cy="91" r="4.5" fill="url(#procSkinGrad)" />

          {/* Modern Haircut & Trim Beard */}
          {/* Hair on top */}
          <path d="M 90 85 C 90 65, 130 65, 130 85 C 130 72, 124 67, 110 67 C 96 67, 90 72, 90 85 Z" fill="url(#procHairGrad)" />
          <path d="M 91 80 C 98 77, 108 76, 113 72 C 117 76, 125 77, 129 80 C 128 73, 122 66, 110 66 C 98 66, 92 73, 91 80 Z" fill="url(#procHairGrad)" />
          {/* Trim Professional Beard */}
          <path d="M 92 92 C 92 110, 128 110, 128 92 C 128 104, 124 113, 110 113 C 96 113, 92 104, 92 92 Z" fill="url(#procHairGrad)" opacity="0.85" />

          {/* Facial Features */}
          <ellipse cx="104" cy="87" rx="2.3" ry="2.8" fill="#1C1917" />
          <ellipse cx="116" cy="87" rx="2.3" ry="2.8" fill="#1C1917" />
          <circle cx="104.8" cy="86.2" r="0.8" fill="#FFFFFF" />
          <circle cx="116.8" cy="86.2" r="0.8" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M 100 81 Q 104 79 107 81" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M 113 81 Q 116 79 120 81" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          {/* Nose */}
          <path d="M 110 89 Q 111 93 108 94" stroke="#D99B77" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          {/* Gentle Confident Smile */}
          <path d="M 105 99 Q 110 103 115 99" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />

          {/* ── Arms & Logistics Supply Package ── */}
          <g className="character-arms">
            <path d="M 74 146 C 64 156, 72 172, 86 170" stroke="url(#procShirtGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M 146 146 C 156 156, 148 172, 134 170" stroke="url(#procShirtGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            
            <circle cx="88" cy="170" r="5.5" fill="url(#procSkinGrad)" />
            <circle cx="132" cy="170" r="5.5" fill="url(#procSkinGrad)" />

            {/* Smart Procurement Carton / Box */}
            <g transform={isHovered ? "translate(0, -3) scale(1.03)" : "translate(0, 0)"} style={{ transition: 'transform 300ms ease' }}>
              <rect x="88" y="150" width="44" height="32" rx="4" fill="url(#procBoxGrad)" stroke="#FDE68A" strokeWidth="1" filter="url(#procGlow)" />
              {/* Box Sealing Tape */}
              <rect x="107" y="150" width="6" height="32" fill="#FEF3C7" opacity="0.75" />
              {/* Barcode & Label */}
              <rect x="91" y="154" width="13" height="8" rx="1" fill="#FFFFFF" />
              <line x1="93" y1="156" x2="93" y2="160" stroke="#0F172A" strokeWidth="1" />
              <line x1="95" y1="156" x2="95" y2="160" stroke="#0F172A" strokeWidth="0.8" />
              <line x1="97" y1="156" x2="97" y2="160" stroke="#0F172A" strokeWidth="1.2" />
              <line x1="100" y1="156" x2="100" y2="160" stroke="#0F172A" strokeWidth="0.8" />
              <line x1="102" y1="156" x2="102" y2="160" stroke="#0F172A" strokeWidth="1" />
              {/* Green Verified ESG Procurement Tag */}
              <circle cx="125" cy="158" r="4" fill="#10B981" />
              <path d="M 123 158 L 124.5 159.5 L 127 156.5" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
