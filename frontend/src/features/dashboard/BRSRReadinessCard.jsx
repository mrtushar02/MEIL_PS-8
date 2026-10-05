import React, { useState } from 'react';
import {
  ShieldCheck,
  Info,
  X
} from 'lucide-react';

export default function BRSRReadinessCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sections = [
    { id: 'sec_a', title: 'Section A — General', percent: 92, color: '#2563EB' },
    { id: 'sec_b', title: 'Section B — Management & Process', percent: 84, color: '#10B981' },
    { id: 'sec_c', title: 'Section C — Principle Performance', percent: 68, color: '#F59E0B' },
    { id: 'sec_core', title: 'BRSR Core (Assurance)', percent: 74, color: '#9333EA' },
  ];

  return (
    <>
      <div className="standard-glass-card">
        <div className="card-header-bar" style={{ marginBottom: '12px' }}>
          <div className="card-heading-group">
            <h3 className="card-title">BRSR Readiness</h3>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
              title="SEBI Circular 2023 & 2025 Readiness Index"
              onClick={() => setIsModalOpen(true)}
            >
              <Info size={14} />
            </button>
          </div>

          <button 
            type="button" 
            className="card-view-all-link"
            onClick={() => setIsModalOpen(true)}
          >
            View Details
          </button>
        </div>

        <div className="brsr-readiness-content">
          {/* Circular Donut Ring */}
          <div className="brsr-donut-wrapper">
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="rgba(226, 232, 240, 0.7)"
                strokeWidth="10"
              />
              {/* Progress Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#2563EB"
                strokeWidth="10"
                strokeDasharray={`${(76 / 100) * (2 * Math.PI * 40)} ${2 * Math.PI * 40}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 600ms ease' }}
              />
            </svg>

            <div className="brsr-donut-inner-text">
              <span className="percent">76%</span>
              <span className="label">Overall Progress</span>
            </div>
          </div>

          {/* Section Progress Rows */}
          <div className="brsr-sections-breakdown">
            {sections.map((sec) => (
              <div key={sec.id} className="brsr-sec-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sec.color }} />
                  <span style={{ color: '#475569', fontWeight: '500' }}>{sec.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '54px', height: '4px', background: 'rgba(226, 232, 240, 0.7)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${sec.percent}%`, height: '100%', background: sec.color, borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontWeight: '700', color: '#0F172A', width: '28px', textAlign: 'right' }}>
                    {sec.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BRSR Readiness Details Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsModalOpen(false);
        }}
        >
          <div style={{
            width: '100%',
            maxWidth: '560px',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 24px 60px rgba(37, 99, 235, 0.16)',
            padding: '24px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#2563EB" />
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    SEBI BRSR Core 9-KPI Assurance Matrix
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
                  Statutory reasonable assurance readiness under SEBI Circulars 2023 & 2025
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {[
                { id: 1, title: '1. GHG Footprint & Turnover Intensity', status: 'Assurance Ready', val: '94%', sub: 'Scope 1 (Diesel/Petrol) + Scope 2 (CEA v19: 0.716 kg/kWh)', tag: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
                { id: 2, title: '2. Water Footprint & ZLD Compliance', status: 'Assurance Ready', val: '88%', sub: 'Recycled KL / Total Withdrawal (87.4% circularity at Kaleshwaram & sites)', tag: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
                { id: 3, title: '3. Energy Footprint & Renewable Share', status: 'In Review', val: '72%', sub: 'Rooftop solar and wheeling power ratio across Olectra and MEIL divisions', tag: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' },
                { id: 4, title: '4. Waste Management & Circularity Index', status: 'Assurance Ready', val: '91%', sub: 'Non-hazardous recycling + NABL hazardous waste manifest verification', tag: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
                { id: 5, title: '5. Employee Safety & Zero Fatalities', status: 'Assurance Ready', val: '98%', sub: 'LTIFR 0.22 per million man-hours (Zero fatalities across 258 sites)', tag: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
                { id: 6, title: '6. Gender Diversity & PwD Inclusion', status: 'Assurance Ready', val: '85%', sub: 'Permanent + EPC contractual female participation and disability policies', tag: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
                { id: 7, title: '7. Median Wage & Gender Pay Parity', status: 'In Review', val: '89%', sub: 'Wage ratios across Grade A-E engineering and technical roles', tag: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' },
                { id: 8, title: '8. Small Towns & Aspirational Districts', status: 'Action Pending', val: '80%', sub: 'Job generation in rural and Tier 2/3 locations (Polavaram & Zojila belt)', tag: '#D97706', bg: 'rgba(217, 119, 6, 0.14)' },
                { id: 9, title: '9. MSME Payments Timeliness (<45 Days)', status: 'Assurance Ready', val: '96%', sub: 'Statutory 45-day vendor payment compliance under MSMED Act 2006', tag: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
              ].map((kpi) => (
                <div 
                  key={kpi.id} 
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(248, 250, 252, 0.88)',
                    borderRadius: '10px',
                    border: '1px solid rgba(226, 232, 240, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A' }}>{kpi.title}</span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: kpi.tag,
                        background: kpi.bg,
                        padding: '1px 6px',
                        borderRadius: '6px'
                      }}>
                        {kpi.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      {kpi.sub}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-heading)',
                    fontVariantNumeric: 'tabular-nums',
                    color: '#0F172A'
                  }}>
                    {kpi.val}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                7 of 9 KPIs Verified for External Assurance (Bureau Veritas)
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="glass-btn glass-btn-primary"
                style={{ padding: '7px 16px', fontSize: '12.5px' }}
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
