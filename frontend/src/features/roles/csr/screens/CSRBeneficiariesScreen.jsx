import React, { useState } from 'react';
import {
  Users,
  Plus,
  Upload,
  Download
} from 'lucide-react';
import { INITIAL_BENEFICIARIES_DATA } from '../csrData';

const DIST_COLORS = ['#2563EB', '#DB2777', '#0284C7', '#059669', '#D97706', '#8B5CF6'];

export default function CSRBeneficiariesScreen({ onNavigateTab: _onNavigateTab }) {
  const data = INITIAL_BENEFICIARIES_DATA;

  const barCategories = [
    { name: 'Education', count: 5200, height: 180 },
    { name: 'Health', count: 4100, height: 142 },
    { name: 'Livelihood', count: 3600, height: 125 },
    { name: 'Infra', count: 2400, height: 83 },
    { name: 'Environment', count: 1800, height: 62 },
    { name: 'Others', count: 1320, height: 46 }
  ];

  const pieData = data.distribution.map((d, i) => ({
    name: d.group,
    value: d.pct,
    count: d.count,
    color: DIST_COLORS[i % DIST_COLORS.length]
  }));

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="csr-pill-tag" style={{ color: '#DB2777', borderColor: 'rgba(219, 39, 119, 0.25)', background: 'rgba(219, 39, 119, 0.08)' }}>
                SOCIAL INCLUSION & REACH
              </div>
              <h1 className="csr-hero-title">Beneficiaries</h1>
              <p className="csr-hero-subtitle">
                Track beneficiary reach, demographic distribution and participation across CSR programs.
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-primary" onClick={() => alert('Opening Add Beneficiary Group Dialog...')}>
              <Plus size={16} />
              + Add Beneficiary Group
            </button>
            <button className="csr-btn-outline" onClick={() => alert('Importing Beneficiary Logs...')}>
              <Upload size={15} />
              Import
            </button>
            <button className="csr-btn-outline" onClick={() => alert('Exporting Beneficiary Audit Report...')}>
              <Download size={15} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── TOP KPI STATS (4 CARDS: TOTAL, FEMALE, MALE, OTHER) ──── */}
      <div className="csr-kpi-grid-4">
        {/* Total */}
        <div className="csr-glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Beneficiaries</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              {data.total.toLocaleString()}
            </div>
            <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>
              100% Verified
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
        </div>

        {/* Female */}
        <div className="csr-glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Female</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#DB2777', marginTop: '2px' }}>
              {data.female.pct}% <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>({data.female.count.toLocaleString()})</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
              Women SHG & Maternal Care
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
        </div>

        {/* Male */}
        <div className="csr-glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Male</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>
              {data.male.pct}% <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>({data.male.count.toLocaleString()})</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
              Vocational Skills & Farmers
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
        </div>

        {/* Other */}
        <div className="csr-glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Other</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#8B5CF6', marginTop: '2px' }}>
              {data.other.pct}% <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>({data.other.count})</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
              Inclusive Community Outreach
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* ──── CHARTS: BAR (BY CATEGORY) + DONUT (DISTRIBUTION) ──── */}
      <div className="csr-kpi-grid-2">
        {/* Left: Beneficiaries by Category Bar Chart */}
        <div className="csr-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Beneficiaries by Category</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Headcount across major CSR intervention areas</p>
            </div>
          </div>

          <div style={{ height: 260, width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 460 220" style={{ width: '100%', height: '100%' }}>
              {/* Y Axis Grid lines */}
              <line x1="45" y1="30" x2="440" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <text x="35" y="34" fill="#94A3B8" fontSize="10" textAnchor="end">6000</text>

              <line x1="45" y1="80" x2="440" y2="80" stroke="#F1F5F9" strokeWidth="1" />
              <text x="35" y="84" fill="#94A3B8" fontSize="10" textAnchor="end">4000</text>

              <line x1="45" y1="130" x2="440" y2="130" stroke="#F1F5F9" strokeWidth="1" />
              <text x="35" y="134" fill="#94A3B8" fontSize="10" textAnchor="end">2000</text>

              <line x1="45" y1="180" x2="440" y2="180" stroke="#E2E8F0" strokeWidth="1" />
              <text x="35" y="184" fill="#94A3B8" fontSize="10" textAnchor="end">0</text>

              {/* Bars */}
              {barCategories.map((cat, idx) => {
                const x = 60 + idx * 62;
                const barH = (cat.count / 6000) * 150;
                const y = 180 - barH;
                return (
                  <g key={cat.name}>
                    {/* Top value */}
                    <text x={x + 18} y={y - 6} fill="#1E293B" fontSize="10.5" fontWeight="700" textAnchor="middle">
                      {cat.count.toLocaleString()}
                    </text>
                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width="36"
                      height={barH}
                      fill="#3B82F6"
                      rx="5"
                    />
                    {/* Category Label */}
                    <text x={x + 18} y="202" fill="#64748B" fontSize="10.5" fontWeight="600" textAnchor="middle">
                      {cat.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Beneficiary Distribution Donut Chart */}
        <div className="csr-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Beneficiary Distribution</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Demographic split of vulnerable target groups</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 260 }}>
            {/* SVG Donut Chart */}
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '160px', height: '160px', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3.6" />
                {/* Children (34%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#2563EB" strokeWidth="3.6" strokeDasharray="34, 100" strokeDashoffset="0" />
                {/* Women (28%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#DB2777" strokeWidth="3.6" strokeDasharray="28, 100" strokeDashoffset="-34" />
                {/* Youth (16%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#0284C7" strokeWidth="3.6" strokeDasharray="16, 100" strokeDashoffset="-62" />
                {/* Farmers (12%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#059669" strokeWidth="3.6" strokeDasharray="12, 100" strokeDashoffset="-78" />
                {/* Elderly (6%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#D97706" strokeWidth="3.6" strokeDasharray="6, 100" strokeDashoffset="-90" />
                {/* PwD (4%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="3.6" strokeDasharray="4, 100" strokeDashoffset="-96" />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>18,420</div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Total</div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pieData.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                    <span style={{ color: '#334155', fontWeight: 600 }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
