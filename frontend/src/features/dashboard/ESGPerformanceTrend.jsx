import React, { useState } from 'react';
import { ChevronDown, Calendar, Filter } from 'lucide-react';

export default function ESGPerformanceTrend() {
  const [activeRange, setActiveRange] = useState('Last 6 Months');
  const [activeMetric, setActiveMetric] = useState('All Parameters');
  const [hoveredIndex, setHoveredIndex] = useState(5); // Default to latest month (Sep)

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  // Normalized trend datasets across 6 months
  // Visual coordinate points mapped to 560 x 180 SVG viewbox
  const data = [
    { month: 'Apr 2026', energy: '42,100 MWh', emissions: '11,200 tCO₂e', water: '118,000 KL', waste: '1,650 MT' },
    { month: 'May 2026', energy: '45,300 MWh', emissions: '11,850 tCO₂e', water: '121,500 KL', waste: '1,720 MT' },
    { month: 'Jun 2026', energy: '46,800 MWh', emissions: '12,100 tCO₂e', water: '122,800 KL', waste: '1,780 MT' },
    { month: 'Jul 2026', energy: '44,200 MWh', emissions: '11,600 tCO₂e', water: '119,400 KL', waste: '1,690 MT' },
    { month: 'Aug 2026', energy: '46,100 MWh', emissions: '12,050 tCO₂e', water: '121,000 KL', waste: '1,750 MT' },
    { month: 'Sep 2026', energy: '48,250 MWh', emissions: '12,480 tCO₂e', water: '125,000 KL', waste: '1,842 MT' },
  ];

  // SVG Paths with smooth curves (viewBox="0 0 600 200")
  // X values for 6 points: 50, 150, 250, 350, 450, 550
  const energyPoints = [
    { x: 50, y: 130 },
    { x: 150, y: 105 },
    { x: 250, y: 95 },
    { x: 350, y: 115 },
    { x: 450, y: 100 },
    { x: 550, y: 78 }
  ];

  const emissionsPoints = [
    { x: 50, y: 155 },
    { x: 150, y: 140 },
    { x: 250, y: 132 },
    { x: 350, y: 145 },
    { x: 450, y: 135 },
    { x: 550, y: 120 }
  ];

  const waterPoints = [
    { x: 50, y: 110 },
    { x: 150, y: 92 },
    { x: 250, y: 85 },
    { x: 350, y: 98 },
    { x: 450, y: 90 },
    { x: 550, y: 68 }
  ];

  const wastePoints = [
    { x: 50, y: 178 },
    { x: 150, y: 172 },
    { x: 250, y: 168 },
    { x: 350, y: 174 },
    { x: 450, y: 170 },
    { x: 550, y: 162 }
  ];

  // Generate cubic bezier SVG path string
  const createSmoothPath = (pts) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpX2 = cpX1;
      d += ` C ${cpX1} ${p0.y}, ${cpX2} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const currentHover = data[hoveredIndex] || data[5];
  const hoverX = energyPoints[hoveredIndex]?.x || 550;

  return (
    <div className="standard-glass-card" style={{ position: 'relative' }}>
      {/* Card Header with controls */}
      <div className="card-header-bar">
        <div className="card-heading-group">
          <h3 className="card-title">ESG Performance Trend</h3>
        </div>

        <div className="card-header-actions">
          <button type="button" className="card-select-pill">
            <Calendar size={13} />
            <span>{activeRange}</span>
            <ChevronDown size={12} />
          </button>

          <button type="button" className="card-select-pill">
            <Filter size={13} />
            <span>{activeMetric}</span>
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Legend Row */}
      <div className="chart-legend-row">
        <div className="legend-badge">
          <div className="legend-dot" style={{ background: '#2563EB' }} />
          <span>Energy (MWh)</span>
        </div>
        <div className="legend-badge">
          <div className="legend-dot" style={{ background: '#16A34A' }} />
          <span>Emissions (tCO₂e)</span>
        </div>
        <div className="legend-badge">
          <div className="legend-dot" style={{ background: '#0284C7' }} />
          <span>Water (KL)</span>
        </div>
        <div className="legend-badge">
          <div className="legend-dot" style={{ background: '#9333EA' }} />
          <span>Waste (MT)</span>
        </div>
      </div>

      {/* Interactive SVG Chart Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '230px', marginTop: '10px' }}>
        <svg 
          viewBox="0 0 600 200" 
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Smooth subtle gradient fills */}
            <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="emissionsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16A34A" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wasteFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis scale */}
          {[40, 80, 120, 160].map((yVal, i) => (
            <g key={i}>
              <line 
                x1="40" 
                y1={yVal} 
                x2="570" 
                y2={yVal} 
                stroke="rgba(226, 232, 240, 0.7)" 
                strokeDasharray="4 4" 
                strokeWidth="1" 
              />
              <text 
                x="32" 
                y={yVal + 3} 
                fill="#94A3B8" 
                fontSize="9.5" 
                textAnchor="end"
                fontFamily="inherit"
              >
                {100 - i * 25}K
              </text>
            </g>
          ))}

          {/* Fill Areas */}
          <path d={`${createSmoothPath(waterPoints)} L 550 190 L 50 190 Z`} fill="url(#waterFill)" />
          <path d={`${createSmoothPath(energyPoints)} L 550 190 L 50 190 Z`} fill="url(#energyFill)" />
          <path d={`${createSmoothPath(emissionsPoints)} L 550 190 L 50 190 Z`} fill="url(#emissionsFill)" />
          <path d={`${createSmoothPath(wastePoints)} L 550 190 L 50 190 Z`} fill="url(#wasteFill)" />

          {/* Main Stroke Lines */}
          <path d={createSmoothPath(waterPoints)} fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" />
          <path d={createSmoothPath(energyPoints)} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <path d={createSmoothPath(emissionsPoints)} fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" />
          <path d={createSmoothPath(wastePoints)} fill="none" stroke="#9333EA" strokeWidth="2.0" strokeLinecap="round" />

          {/* Interactive Crosshair Tracking Line */}
          {hoveredIndex !== null && (
            <line 
              x1={hoverX} 
              y1="20" 
              x2={hoverX} 
              y2="185" 
              stroke="#2563EB" 
              strokeWidth="1.5" 
              strokeDasharray="3 3"
              opacity="0.8"
            />
          )}

          {/* Points & Interactive Hitboxes */}
          {months.map((m, idx) => {
            const x = energyPoints[idx].x;
            const isHovered = hoveredIndex === idx;

            return (
              <g key={m}>
                {/* Dots on Lines */}
                <circle cx={x} cy={waterPoints[idx].y} r={isHovered ? 4.5 : 3} fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
                <circle cx={x} cy={energyPoints[idx].y} r={isHovered ? 5.5 : 3.5} fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
                <circle cx={x} cy={emissionsPoints[idx].y} r={isHovered ? 4.5 : 3} fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" />
                <circle cx={x} cy={wastePoints[idx].y} r={isHovered ? 4 : 2.5} fill="#FFFFFF" stroke="#9333EA" strokeWidth="2" />

                {/* X-Axis Month Label */}
                <text 
                  x={x} 
                  y="196" 
                  fill={isHovered ? '#0F172A' : '#64748B'} 
                  fontSize="11" 
                  fontWeight={isHovered ? '700' : '500'}
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  {m}
                </text>

                {/* Invisible Hover Target Rect */}
                <rect 
                  x={x - 45} 
                  y="10" 
                  width="90" 
                  height="185" 
                  fill="transparent" 
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                />
              </g>
            );
          })}
        </svg>

        {/* Liquid Glass Interactive Tooltip */}
        {hoveredIndex !== null && (
          <div 
            style={{
              position: 'absolute',
              top: '12px',
              left: `${Math.min(Math.max((hoverX / 600) * 100 - 15, 5), 65)}%`,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.98)',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(37, 99, 235, 0.12), inset 0 1px 0 rgba(255, 255, 255, 1)',
              padding: '10px 14px',
              pointerEvents: 'none',
              minWidth: '180px',
              zIndex: 30,
              transition: 'left 150ms ease-out'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A', marginBottom: '6px', letterSpacing: '0.04em' }}>
              {currentHover.month.toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#2563EB', fontWeight: '600' }}>• Energy:</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>{currentHover.energy}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#16A34A', fontWeight: '600' }}>• Emissions:</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>{currentHover.emissions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#0284C7', fontWeight: '600' }}>• Water:</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>{currentHover.water}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9333EA', fontWeight: '600' }}>• Waste:</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>{currentHover.waste}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
