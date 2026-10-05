import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Filter,
  DollarSign,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function ProcurementAnalyticsScreen({ onNavigateTab }) {
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedBU, setSelectedBU] = useState('All Business Units');
  const [selectedPeriod, setSelectedPeriod] = useState('Sep 2026');

  const kpis = [
    { label: 'Total Procurement Value', value: '₹248.6 Cr', sub: 'Group-wide total', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)', icon: TrendingUp },
    { label: 'Assessed Spend', value: '₹194.2 Cr', sub: '78% of total spend', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', icon: ShieldCheck },
    { label: 'MSME Spend', value: '₹72.6 Cr', sub: '29% priority sector', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', icon: Building },
    { label: 'ESG Assessed Spend', value: '₹158.2 Cr', sub: '64% BRSR Core verified', color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)', icon: DollarSign }
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const monthlyValues = [18, 22, 25, 20, 28, 32, 29, 35, 42.8];

  const spendCategories = [
    { label: 'Materials', pct: 32, val: '₹79.5 Cr', color: '#2563EB' },
    { label: 'Services', pct: 24, val: '₹59.6 Cr', color: '#0EA5E9' },
    { label: 'Civil', pct: 18, val: '₹44.7 Cr', color: '#10B981' },
    { label: 'Electrical', pct: 12, val: '₹29.8 Cr', color: '#F59E0B' },
    { label: 'Others', pct: 14, val: '₹34.8 Cr', color: '#94A3B8' }
  ];

  const riskDistribution = [
    { label: 'Low', pct: 36, count: 175, color: '#059669' },
    { label: 'Medium', pct: 28, count: 136, color: '#D97706' },
    { label: 'High', pct: 12, count: 58, color: '#EA580C' },
    { label: 'Critical', pct: 6, count: 29, color: '#DC2626' },
    { label: 'Unassessed', pct: 18, count: 88, color: '#94A3B8' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Top Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Procurement Analytics
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Analyze procurement spend, supplier ESG performance and value chain insights.
            </p>
          </div>

          <button
            type="button"
            className="proc-btn proc-btn-outline"
            onClick={() => alert('Exporting Procurement ESG Analytics Report (PDF/Excel)')}
            style={{ padding: '7px 14px', fontSize: '12.5px' }}
          >
            <Download size={14} />
            <span>Report</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <select
            className="proc-select-control"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Suppliers">All Suppliers (486)</option>
            <option value="Top 50">Top 50 Spend Suppliers</option>
            <option value="MSME Only">MSME Only</option>
            <option value="Local Only">Local Sourcing Only</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedBU}
            onChange={(e) => setSelectedBU(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Business Units">All Business Units (6 BUs)</option>
            <option value="Infra - Roads">Infra - Roads & Tunnels</option>
            <option value="Hydro & Irrigation">Hydro & Irrigation</option>
            <option value="Clean Mobility">Clean Mobility</option>
            <option value="Power & Transmission">Power & Transmission</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="Sep 2026">Sep 2026</option>
            <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
            <option value="FY 2026-27 YTD">FY 2026-27 YTD</option>
          </select>
        </div>
      </div>

      {/* ──── 4 KPI Cards Grid ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {kpis.map((k, i) => {
          const IconComp = k.icon;
          return (
            <div key={i} className="proc-kpi-card">
              <div className="proc-kpi-top">
                <span className="proc-kpi-label">{k.label}</span>
                <div className="proc-kpi-icon-pill" style={{ background: k.bg, color: k.color }}>
                  <IconComp size={15} />
                </div>
              </div>
              <span className="proc-kpi-value">{k.value}</span>
              <span className="proc-kpi-sub">{k.sub}</span>
            </div>
          );
        })}
      </div>

      {/* ──── Bottom 3 Panels (Trend, Spend by Category, Risk Donut) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '14px' }}>
        
        {/* Panel 1: Procurement Value Trend */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '16px' }}>
            <div>
              <div className="proc-glass-card-title">Procurement Value Trend</div>
              <div className="proc-glass-card-subtitle">Monthly purchase value across projects (₹ Cr)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
            {monthlyValues.map((v, i) => {
              const h = (v / 45) * 130;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <div
                    style={{
                      width: '18px',
                      height: `${h}px`,
                      background: '#2563EB',
                      borderRadius: '4px 4px 0 0'
                    }}
                    title={`${months[i]}: ₹${v} Cr`}
                  />
                  <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>{months[i]}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: '#64748B' }}>
            <span>FY 26-27 Peak: <strong>₹42.8 Cr (Sep)</strong></span>
            <span style={{ color: '#059669', fontWeight: 700 }}>+9.4% Growth</span>
          </div>
        </div>

        {/* Panel 2: Spend by Category */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '16px' }}>
            <div>
              <div className="proc-glass-card-title">Spend by Category</div>
              <div className="proc-glass-card-subtitle">Value share breakdown</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {spendCategories.map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>{c.label}</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{c.val} ({c.pct}%)</span>
                </div>
                <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${c.pct}%`,
                      background: c.color,
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Supplier Risk Distribution (Donut Chart) */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '16px' }}>
            <div>
              <div className="proc-glass-card-title">Supplier Risk Distribution</div>
              <div className="proc-glass-card-subtitle">Portfolio risk segmentation</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '120px', height: '120px', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                {/* Low 36% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#059669" strokeWidth="4" strokeDasharray="31.6, 100" strokeDashoffset="0" />
                {/* Med 28% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#D97706" strokeWidth="4" strokeDasharray="24.6, 100" strokeDashoffset="-31.6" />
                {/* High 12% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#EA580C" strokeWidth="4" strokeDasharray="10.5, 100" strokeDashoffset="-56.2" />
                {/* Critical 6% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#DC2626" strokeWidth="4" strokeDasharray="5.3, 100" strokeDashoffset="-66.7" />
                {/* Unassessed 18% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#94A3B8" strokeWidth="4" strokeDasharray="15.8, 100" strokeDashoffset="-72" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>486</span>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>Total</span>
              </div>
            </div>

            {/* Risk Legend */}
            <div style={{ width: '100%', marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {riskDistribution.map((rd, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: rd.color }} />
                    <span style={{ color: '#475569', fontWeight: 600 }}>{rd.label}</span>
                  </span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{rd.count} <span style={{ color: '#64748B', fontWeight: 500 }}>({rd.pct}%)</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
