import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  IndianRupee,
  Users,
  FolderKanban,
  Target,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { SPEND_TREND_DATA, BENEFICIARIES_TREND_DATA } from '../csrData';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function CSRAnalyticsScreen({
  onNavigateTab,
  onOpenRegisterGrievance
}) {
  const projectCategoryData = [
    { name: 'Education', value: 28, count: 7, color: '#2563EB' },
    { name: 'Health', value: 20, count: 5, color: '#0284C7' },
    { name: 'Livelihood', value: 18, count: 4, color: '#059669' },
    { name: 'Infrastructure', value: 16, count: 4, color: '#D97706' },
    { name: 'Environment', value: 12, count: 3, color: '#8B5CF6' },
    { name: 'Others', value: 6, count: 1, color: '#64748B' }
  ];

  const handleExport = () => {
    const exportRows = projectCategoryData.map(cat => ({
      Category: cat.name,
      Allocation_Percent: `${cat.value}%`,
      Active_Projects: cat.count,
      Reporting_Entity: 'MEIL Group CSR Foundation',
      Statutory_Mandate: 'Companies Act 2013 Sec 135 (2% Net Profit)'
    }));
    exportToCsv('MEIL_CSR_Portfolio_Analytics', exportRows);
  };

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="csr-pill-tag">PORTFOLIO INTELLIGENCE</div>
              <h1 className="csr-hero-title">Analytics</h1>
              <p className="csr-hero-subtitle">
                All Projects • 28 Regions • 5 Categories • Multi-year impact & spend correlation
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-secondary" onClick={onOpenRegisterGrievance || (() => onNavigateTab?.('grievances'))}>
              <Plus size={16} />
              + Register Grievance
            </button>
            <button className="csr-btn-outline" onClick={handleExport}>
              <Download size={15} />
              Export Analytics
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI STATS ROW ──── */}
      <div className="csr-kpi-grid-4">
        {/* CSR Spend */}
        <div className="csr-glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>CSR Spend</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>₹12.6 Cr</div>
            <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpRight size={14} /> +12% vs last yr
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IndianRupee size={20} />
          </div>
        </div>

        {/* Beneficiaries */}
        <div className="csr-glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Beneficiaries</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#DB2777', marginTop: '2px' }}>18,420</div>
            <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpRight size={14} /> +18% vs last yr
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
        </div>

        {/* Active Projects */}
        <div className="csr-glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Active Projects</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>24</div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Across 8 States</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderKanban size={20} />
          </div>
        </div>

        {/* Impact Indicators */}
        <div className="csr-glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Impact Indicators</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7C3AED', marginTop: '2px' }}>48</div>
            <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>82% Evidence Verified</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={20} />
          </div>
        </div>
      </div>

      {/* ──── 3 COLUMN CHARTS ROW (SPEND TREND, BENEFICIARIES TREND, PROJECTS BY CATEGORY) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* Spend Trend */}
        <div className="csr-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>CSR Spend Trend (₹ Cr)</h3>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>Total vs Local vs MSME</p>
            </div>
          </div>

          <div style={{ height: 230, width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%' }}>
              <line x1="30" y1="30" x2="305" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="75" x2="305" y2="75" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="120" x2="305" y2="120" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="150" x2="305" y2="150" stroke="#E2E8F0" strokeWidth="1" />

              {months.map((m, idx) => (
                <text key={m} x={45 + idx * 50} y="168" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="600">
                  {m}
                </text>
              ))}

              {/* Total (Red/Blue line) */}
              <polyline fill="none" stroke="#2563EB" strokeWidth="2.5" points="45,115 95,90 145,55 195,105 245,80 295,80" />
              {/* Local */}
              <polyline fill="none" stroke="#0284C7" strokeWidth="2" points="45,130 95,120 145,105 195,125 245,115 295,105" />
              {/* MSME */}
              <polyline fill="none" stroke="#D97706" strokeWidth="1.8" strokeDasharray="3 3" points="45,145 95,140 145,135 195,145 245,135 295,130" />
            </svg>
          </div>
        </div>

        {/* Beneficiaries Trend */}
        <div className="csr-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Beneficiaries Trend</h3>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>Total, Children & Women Reach</p>
            </div>
          </div>

          <div style={{ height: 230, width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%' }}>
              <line x1="30" y1="30" x2="305" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="75" x2="305" y2="75" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="120" x2="305" y2="120" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="150" x2="305" y2="150" stroke="#E2E8F0" strokeWidth="1" />

              {months.map((m, idx) => (
                <text key={m} x={45 + idx * 50} y="168" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="600">
                  {m}
                </text>
              ))}

              {/* Total Trend */}
              <polyline fill="none" stroke="#2563EB" strokeWidth="2.5" points="45,100 95,85 145,70 195,60 245,45 295,35" />
              {/* Children */}
              <polyline fill="none" stroke="#0284C7" strokeWidth="2" points="45,125 95,115 145,105 195,100 245,90 295,80" />
              {/* Women */}
              <polyline fill="none" stroke="#DB2777" strokeWidth="2" points="45,135 95,125 145,115 195,110 245,102 295,95" />
            </svg>
          </div>
        </div>

        {/* Projects by Category Donut */}
        <div className="csr-glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Projects by Category</h3>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>24 Active Interventions</p>
            </div>
          </div>

          <div style={{ position: 'relative', width: '140px', height: '140px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '140px', height: '140px', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3.6" />
              {/* Education (28%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#2563EB" strokeWidth="3.6" strokeDasharray="28, 100" strokeDashoffset="0" />
              {/* Health (20%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#0284C7" strokeWidth="3.6" strokeDasharray="20, 100" strokeDashoffset="-28" />
              {/* Livelihood (18%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#059669" strokeWidth="3.6" strokeDasharray="18, 100" strokeDashoffset="-48" />
              {/* Infrastructure (16%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#D97706" strokeWidth="3.6" strokeDasharray="16, 100" strokeDashoffset="-66" />
              {/* Environment (12%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="3.6" strokeDasharray="12, 100" strokeDashoffset="-82" />
              {/* Others (6%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#64748B" strokeWidth="3.6" strokeDasharray="6, 100" strokeDashoffset="-94" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>24</div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Total</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', fontSize: '11px', marginTop: '10px' }}>
            {projectCategoryData.map((d) => (
              <span key={d.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#334155' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
