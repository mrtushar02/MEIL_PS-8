import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building,
  MapPin,
  AlertTriangle,
  Clock,
  Plus,
  FileCheck2,
  ArrowUpRight
} from 'lucide-react';

export default function ProcurementOverviewScreen({
  onNavigateTab,
  onOpenAddSupplier,
  onOpenStartAssessment,
  suppliers = [],
  transactions = []
}) {
  const [reportingPeriod, setReportingPeriod] = useState('September 2026');
  const [businessUnit, setBusinessUnit] = useState('All Units');
  const [supplierCategory, setSupplierCategory] = useState('All Categories');

  const kpis = [
    {
      label: 'Total Suppliers',
      value: '486',
      sub: '+1.2% vs last period',
      deltaType: 'up',
      icon: Users,
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.1)',
      targetTab: 'suppliers'
    },
    {
      label: 'Active Suppliers',
      value: '428',
      sub: '88% active rate',
      deltaType: 'neutral',
      icon: CheckCircle2,
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.1)',
      targetTab: 'suppliers'
    },
    {
      label: 'Procurement Value',
      value: '₹248.6 Cr',
      sub: '+9.4% vs last period',
      deltaType: 'up',
      icon: TrendingUp,
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.1)',
      targetTab: 'procurement'
    },
    {
      label: 'Suppliers ESG Assessed',
      value: '312',
      sub: '64% coverage',
      deltaType: 'neutral',
      icon: ShieldCheck,
      color: '#0284C7',
      bg: 'rgba(2, 132, 199, 0.1)',
      targetTab: 'assessments'
    },
    {
      label: 'MSME / Small Producer',
      value: '142',
      sub: '29% of supplier base',
      deltaType: 'neutral',
      icon: Building,
      color: '#7C3AED',
      bg: 'rgba(124, 58, 237, 0.1)',
      targetTab: 'suppliers'
    },
    {
      label: 'Local Sourcing',
      value: '186',
      sub: '38% within 100km radius',
      deltaType: 'neutral',
      icon: MapPin,
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.1)',
      targetTab: 'procurement'
    },
    {
      label: 'High-Risk Suppliers',
      value: '18',
      sub: '3.7% requires mitigation',
      deltaType: 'down',
      icon: AlertTriangle,
      color: '#DC2626',
      bg: 'rgba(220, 38, 38, 0.1)',
      targetTab: 'risk'
    },
    {
      label: 'Pending Assessments',
      value: '94',
      sub: '19% awaiting submission',
      deltaType: 'neutral',
      icon: Clock,
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.1)',
      targetTab: 'assessments'
    }
  ];

  // Monthly trend data for Jan - Sep
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const trendData = [
    { total: 18, local: 8, msme: 5, esg: 10 },
    { total: 22, local: 10, msme: 7, esg: 14 },
    { total: 25, local: 11, msme: 8, esg: 16 },
    { total: 20, local: 9, msme: 6, esg: 13 },
    { total: 28, local: 13, msme: 9, esg: 19 },
    { total: 32, local: 14, msme: 11, esg: 22 },
    { total: 29, local: 12, msme: 10, esg: 21 },
    { total: 35, local: 16, msme: 12, esg: 26 },
    { total: 42.8, local: 18, msme: 14, esg: 31.2 }
  ];

  const categoryBreakdown = [
    { label: 'Materials', pct: 32, color: '#2563EB' },
    { label: 'Services', pct: 24, color: '#0EA5E9' },
    { label: 'Civil', pct: 18, color: '#10B981' },
    { label: 'Electrical', pct: 12, color: '#F59E0B' },
    { label: 'Mechanical', pct: 8, color: '#8B5CF6' },
    { label: 'Others', pct: 6, color: '#94A3B8' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 1) ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Procurement & Scope
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Monitor suppliers, procurement activity, ESG assessments, value-chain coverage and supplier actions.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="proc-btn proc-btn-blue"
              onClick={onOpenAddSupplier}
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              <Plus size={15} />
              <span>Add Supplier</span>
            </button>
            <button
              type="button"
              className="proc-btn proc-btn-outline"
              onClick={onOpenStartAssessment}
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              <FileCheck2 size={15} color="#2563EB" />
              <span>Start Assessment</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Reporting Period:</span>
            <select
              className="proc-select-control"
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              style={{ fontSize: '12px', padding: '5px 12px', height: '30px' }}
            >
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
              <option value="FY 2026-27 YTD">FY 2026-27 YTD</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Business Unit:</span>
            <select
              className="proc-select-control"
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              style={{ fontSize: '12px', padding: '5px 12px', height: '30px' }}
            >
              <option value="All Units">All Units (6 BUs)</option>
              <option value="Infra - Roads">Infra - Roads & Tunnels</option>
              <option value="Hydro & Irrigation">Hydro & Irrigation</option>
              <option value="Clean Mobility">Clean Mobility (Olectra)</option>
              <option value="City Gas Distribution">City Gas Distribution</option>
              <option value="Power & Transmission">Power & Transmission</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Supplier Category:</span>
            <select
              className="proc-select-control"
              value={supplierCategory}
              onChange={(e) => setSupplierCategory(e.target.value)}
              style={{ fontSize: '12px', padding: '5px 12px', height: '30px' }}
            >
              <option value="All Categories">All Categories</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Materials">Materials</option>
              <option value="Services">Services</option>
              <option value="Logistics">Logistics</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
        </div>
      </div>

      {/* ──── 2. 8 KPI CARDS GRID (Exact 4x2 / 8 Grid) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {kpis.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              className="proc-kpi-card interactive"
              onClick={() => onNavigateTab?.(kpi.targetTab)}
              style={{ cursor: 'pointer' }}
            >
              <div className="proc-kpi-top">
                <span className="proc-kpi-label">{kpi.label}</span>
                <div className="proc-kpi-icon-pill" style={{ background: kpi.bg, color: kpi.color }}>
                  <IconComp size={15} />
                </div>
              </div>
              <div className="proc-kpi-value-row">
                <span className="proc-kpi-value">{kpi.value}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{kpi.sub}</span>
                <ArrowUpRight size={13} color="#94A3B8" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ──── 3. THREE BOTTOM CHARTS / PANELS (Matching Layout in Image) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '14px' }}>
        
        {/* Card 1: Procurement Value Trend */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '12px' }}>
            <div>
              <div className="proc-glass-card-title">Procurement Value Trend</div>
              <div className="proc-glass-card-subtitle">Monthly spend across core BRSR value chain pillars (₹ Cr)</div>
            </div>
            <div className="proc-legend">
              <span className="proc-legend-item"><span className="proc-legend-dot" style={{ background: '#2563EB' }} /> Total</span>
              <span className="proc-legend-item"><span className="proc-legend-dot" style={{ background: '#059669' }} /> Local</span>
              <span className="proc-legend-item"><span className="proc-legend-dot" style={{ background: '#7C3AED' }} /> MSME</span>
              <span className="proc-legend-item"><span className="proc-legend-dot" style={{ background: '#0284C7' }} /> ESG Assessed</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', borderBottom: '1px solid #E2E8F0' }}>
            {trendData.map((d, i) => {
              const maxVal = 45;
              const hTotal = (d.total / maxVal) * 150;
              const hLocal = (d.local / maxVal) * 150;
              const hMsme = (d.msme / maxVal) * 150;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '150px' }}>
                    <div style={{ width: '7px', height: `${hTotal}px`, background: '#2563EB', borderRadius: '3px 3px 0 0' }} title={`Total: ₹${d.total} Cr`} />
                    <div style={{ width: '7px', height: `${hLocal}px`, background: '#059669', borderRadius: '3px 3px 0 0' }} title={`Local: ₹${d.local} Cr`} />
                    <div style={{ width: '7px', height: `${hMsme}px`, background: '#7C3AED', borderRadius: '3px 3px 0 0' }} title={`MSME: ₹${d.msme} Cr`} />
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>{months[i]}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: '#64748B' }}>
            <span>FY 2026-27 Cumulative: <strong>₹248.6 Cr</strong></span>
            <span style={{ color: '#059669', fontWeight: 700 }}>+9.4% YoY Growth</span>
          </div>
        </div>

        {/* Card 2: Supplier ESG Coverage (Donut Chart) */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '12px' }}>
            <div>
              <div className="proc-glass-card-title">Supplier ESG Coverage</div>
              <div className="proc-glass-card-subtitle">SEBI BRSR Core value chain verification</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
            {/* SVG Donut Ring */}
            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '130px', height: '130px', transform: 'rotate(-90deg)' }}>
                {/* Background Track */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
                {/* Assessed (64%) */}
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke="#2563EB" strokeWidth="3.5"
                  strokeDasharray="56.3, 100"
                  strokeDashoffset="0"
                />
                {/* Pending (19%) */}
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke="#F59E0B" strokeWidth="3.5"
                  strokeDasharray="16.7, 100"
                  strokeDashoffset="-56.3"
                />
                {/* Not Assessed (17%) */}
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke="#CBD5E1" strokeWidth="3.5"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-73"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>64%</span>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>Assessed</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div style={{ width: '100%', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />
                  <span style={{ color: '#475569', fontWeight: 600 }}>Assessed</span>
                </span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>312 <span style={{ color: '#64748B', fontWeight: 500 }}>(64%)</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                  <span style={{ color: '#475569', fontWeight: 600 }}>Pending Review</span>
                </span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>94 <span style={{ color: '#64748B', fontWeight: 500 }}>(19%)</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
                  <span style={{ color: '#475569', fontWeight: 600 }}>Not Assessed</span>
                </span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>80 <span style={{ color: '#64748B', fontWeight: 500 }}>(17%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Suppliers by Category */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '12px' }}>
            <div>
              <div className="proc-glass-card-title">Suppliers by Category</div>
              <div className="proc-glass-card-subtitle">Distribution across 486 vendors</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginTop: '6px' }}>
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>{cat.label}</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{cat.pct}%</span>
                </div>
                <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${cat.pct}%`,
                      background: cat.color,
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Primary: Materials (155)</span>
            <button
              type="button"
              onClick={() => onNavigateTab?.('suppliers')}
              style={{ fontSize: '11.5px', fontWeight: 700, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View Directory &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
