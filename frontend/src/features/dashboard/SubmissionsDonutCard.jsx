import React, { useState } from 'react';

export default function SubmissionsDonutCard({ onNavigateToSubmissions }) {
  const [hoveredStatus, setHoveredStatus] = useState(null);

  const statuses = [
    { id: 'approved', label: 'Approved', count: 10, color: '#16A34A', percent: 50 },
    { id: 'submitted', label: 'Submitted', count: 5, color: '#2563EB', percent: 25 },
    { id: 'in_review', label: 'In Review', count: 2, color: '#F59E0B', percent: 10 },
    { id: 'correction', label: 'Correction Required', count: 2, color: '#EF4444', percent: 10 },
    { id: 'draft', label: 'Draft', count: 1, color: '#94A3B8', percent: 5 },
  ];

  // SVG Circumference for radius 45 is 2 * PI * 45 = 282.74
  const circumference = 282.74;
  let accumulatedOffset = 0;

  return (
    <div className="standard-glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="card-header-bar">
        <h3 className="card-title">Submissions Overview</h3>
        <button 
          type="button" 
          className="card-view-all-link"
          onClick={() => onNavigateToSubmissions?.()}
        >
          View All
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', margin: 'auto 0' }}>
        {/* SVG Donut Ring with Center Total */}
        <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="rgba(226, 232, 240, 0.6)"
              strokeWidth="12"
            />
            {statuses.map((s) => {
              const strokeLength = (s.percent / 100) * (2 * Math.PI * 40);
              const dashOffset = -accumulatedOffset;
              accumulatedOffset += strokeLength;
              const isHovered = hoveredStatus === s.id;

              return (
                <circle
                  key={s.id}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={s.color}
                  strokeWidth={isHovered ? 14 : 12}
                  strokeDasharray={`${strokeLength} ${2 * Math.PI * 40 - strokeLength}`}
                  strokeDashoffset={dashOffset}
                  style={{
                    transition: 'all 200ms ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredStatus(s.id)}
                  onMouseLeave={() => setHoveredStatus(null)}
                />
              );
            })}
          </svg>

          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{
              fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
              fontSize: '22px',
              fontWeight: '800',
              color: '#0F172A',
              lineHeight: 1
            }}>
              20
            </span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
              Total Items
            </span>
          </div>
        </div>

        {/* Legend with Status and Count */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {statuses.map((s) => (
            <div 
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                padding: '2px 4px',
                borderRadius: '6px',
                background: hoveredStatus === s.id ? 'rgba(234, 244, 255, 0.6)' : 'transparent',
                transition: 'background 150ms ease',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredStatus(s.id)}
              onMouseLeave={() => setHoveredStatus(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.color }} />
                <span style={{ color: '#334155', fontWeight: '500' }}>{s.label}</span>
              </div>
              <span style={{ fontWeight: '700', color: '#0F172A' }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
