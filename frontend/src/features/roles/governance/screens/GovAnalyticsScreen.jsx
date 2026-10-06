import React from 'react';
import {
  Download,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function GovAnalyticsScreen({
  onNavigateTab
}) {
  const handleExport = () => {
    const rows = [
      { Metric: 'Overall Compliance Index', Value: '94.2%', Benchmark: '90.0%', Status: 'Optimal' },
      { Metric: 'Statutory Policies In Force', Value: '10 / 10 Active', Benchmark: '100%', Status: 'Compliant' },
      { Metric: 'Internal Control Effectiveness', Value: '91.8%', Benchmark: '85.0%', Status: 'Effective' },
      { Metric: 'Audit Non-Conformances', Value: '0 Critical / 3 Minor', Benchmark: '0 Critical', Status: 'Under Remediation' },
      { Metric: 'Whistleblower Resolution Rate', Value: '92.5%', Benchmark: '90.0%', Status: 'Timely' },
      { Metric: 'SEBI BRSR Principle 1 Alignment', Value: '100%', Benchmark: '100%', Status: 'Fully Aligned' }
    ];
    exportToCsv('MEIL_Governance_Compliance_Analytics', rows);
  };

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Governance Analytics</h1>
            <p>Analyze compliance status, trends and organizational performance.</p>
          </div>
          <div className="gov-header-controls">
            <select className="gov-select-pill" defaultValue="all">
              <option value="all">🏢 All Subsidiaries</option>
              <option value="infra">MEIL Infrastructure</option>
              <option value="hydro">MEIL Hydro</option>
            </select>
            <select className="gov-select-pill" defaultValue="fy26">
              <option value="fy26">📅 FY 2026-27</option>
              <option value="fy25">FY 2025-26</option>
            </select>
            <button 
              className="gov-btn gov-btn-outline"
              onClick={handleExport}
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 PRIMARY KPIS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Compliance Coverage</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#16A34A' }}>87%</span>
          </div>
        </div>

        <div className="gov-kpi-card">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Open Obligations</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">46</span>
          </div>
        </div>

        <div className="gov-kpi-card">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Control Pass Rate</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#2563EB' }}>82%</span>
          </div>
        </div>

        <div className="gov-kpi-card">
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Overdue Actions</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-red">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value" style={{ color: '#DC2626' }}>7</span>
          </div>
        </div>
      </div>

      {/* ──── 3 CHARTS ROW ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
        {/* Compliance Trend Chart */}
        <div className="gov-chart-card">
          <div className="gov-card-header">
            <div>
              <h3 className="gov-card-title">Compliance Trend</h3>
              <p className="gov-card-subtitle">Monthly trajectory</p>
            </div>
          </div>
          <div style={{ height: '220px', width: '100%' }}>
            <svg viewBox="0 0 320 200" style={{ width: '100%', height: '100%' }}>
              <line x1="20" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="65" x2="300" y2="65" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="110" x2="300" y2="110" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="155" x2="300" y2="155" stroke="#CBD5E1" strokeWidth="1" />

              {/* Monthly grouped bars */}
              {/* Jun */}
              <rect x="40" y="70" width="8" height="85" fill="#2563EB" rx="2" />
              <rect x="50" y="110" width="8" height="45" fill="#38BDF8" rx="2" />
              <rect x="60" y="130" width="8" height="25" fill="#F59E0B" rx="2" />
              <text x="54" y="172" fontSize="10" fill="#64748B" textAnchor="middle">Jun</text>

              {/* Jul */}
              <rect x="95" y="60" width="8" height="95" fill="#2563EB" rx="2" />
              <rect x="105" y="105" width="8" height="50" fill="#38BDF8" rx="2" />
              <rect x="115" y="135" width="8" height="20" fill="#F59E0B" rx="2" />
              <text x="109" y="172" fontSize="10" fill="#64748B" textAnchor="middle">Jul</text>

              {/* Aug */}
              <rect x="150" y="50" width="8" height="105" fill="#2563EB" rx="2" />
              <rect x="160" y="115" width="8" height="40" fill="#38BDF8" rx="2" />
              <rect x="170" y="138" width="8" height="17" fill="#F59E0B" rx="2" />
              <text x="164" y="172" fontSize="10" fill="#64748B" textAnchor="middle">Aug</text>

              {/* Sep */}
              <rect x="205" y="40" width="8" height="115" fill="#2563EB" rx="2" />
              <rect x="215" y="120" width="8" height="35" fill="#38BDF8" rx="2" />
              <rect x="225" y="142" width="8" height="13" fill="#F59E0B" rx="2" />
              <text x="219" y="172" fontSize="10" fill="#64748B" textAnchor="middle">Sep</text>

              {/* Oct */}
              <rect x="260" y="30" width="8" height="125" fill="#2563EB" rx="2" />
              <rect x="270" y="125" width="8" height="30" fill="#38BDF8" rx="2" />
              <rect x="280" y="145" width="8" height="10" fill="#F59E0B" rx="2" />
              <text x="274" y="172" fontSize="10" fill="#64748B" textAnchor="middle">Oct</text>

              {/* Trend line */}
              <path d="M 54 70 L 109 60 L 164 50 L 219 40 L 274 30" fill="none" stroke="#2563EB" strokeWidth="2" />
              <circle cx="54" cy="70" r="3" fill="#FFF" stroke="#2563EB" strokeWidth="2" />
              <circle cx="109" cy="60" r="3" fill="#FFF" stroke="#2563EB" strokeWidth="2" />
              <circle cx="164" cy="50" r="3" fill="#FFF" stroke="#2563EB" strokeWidth="2" />
              <circle cx="219" cy="40" r="3" fill="#FFF" stroke="#2563EB" strokeWidth="2" />
              <circle cx="274" cy="30" r="3" fill="#FFF" stroke="#2563EB" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Obligations by Category Donut */}
        <div className="gov-chart-card">
          <div className="gov-card-header">
            <div>
              <h3 className="gov-card-title">Obligations by Category</h3>
              <p className="gov-card-subtitle">Breakdown of 46 total</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '220px', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {/* Legal: 16/46 (34.8%) -> 83 */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#2563EB" strokeWidth="12" strokeDasharray="83 238.7" strokeDashoffset="0" />
                {/* Regulatory: 12/46 (26.1%) -> 62.3 */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#38BDF8" strokeWidth="12" strokeDasharray="62.3 238.7" strokeDashoffset="-83" />
                {/* ESG: 10/46 (21.7%) -> 51.8 */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#16A34A" strokeWidth="12" strokeDasharray="51.8 238.7" strokeDashoffset="-145.3" />
                {/* Internal: 8/46 (17.4%) -> 41.5 */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="41.5 238.7" strokeDashoffset="-197.1" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>46</span>
                <span style={{ fontSize: '10px', color: '#64748B' }}>Total</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginTop: '12px', fontSize: '11px', width: '100%' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2563EB' }} /> Legal (16)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38BDF8' }} /> Regulatory (12)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A' }} /> ESG (10)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }} /> Internal (8)
              </span>
            </div>
          </div>
        </div>

        {/* Action Aging Bar Chart */}
        <div className="gov-chart-card">
          <div className="gov-card-header">
            <div>
              <h3 className="gov-card-title">Action Aging</h3>
              <p className="gov-card-subtitle">Resolution timeframe</p>
            </div>
          </div>
          <div style={{ height: '220px', width: '100%' }}>
            <svg viewBox="0 0 280 180" style={{ width: '100%', height: '100%' }}>
              <line x1="20" y1="20" x2="260" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="55" x2="260" y2="55" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="90" x2="260" y2="90" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="125" x2="260" y2="125" stroke="#CBD5E1" strokeWidth="1" />

              {/* Bars */}
              {/* 0-7 d: 14 */}
              <rect x="35" y="55" width="22" height="70" fill="#2563EB" rx="3" />
              <text x="46" y="142" fontSize="9.5" fill="#64748B" textAnchor="middle">0-7 d</text>

              {/* 8-30 d: 18 */}
              <rect x="85" y="35" width="22" height="90" fill="#38BDF8" rx="3" />
              <text x="96" y="142" fontSize="9.5" fill="#64748B" textAnchor="middle">8-30 d</text>

              {/* 31-60 d: 9 */}
              <rect x="135" y="80" width="22" height="45" fill="#16A34A" rx="3" />
              <text x="146" y="142" fontSize="9.5" fill="#64748B" textAnchor="middle">31-60 d</text>

              {/* 60+ d: 4 */}
              <rect x="185" y="105" width="22" height="20" fill="#F59E0B" rx="3" />
              <text x="196" y="142" fontSize="9.5" fill="#64748B" textAnchor="middle">60+ d</text>

              {/* Overdue: 7 */}
              <rect x="235" y="90" width="22" height="35" fill="#EF4444" rx="3" />
              <text x="246" y="142" fontSize="9.5" fill="#DC2626" textAnchor="middle" fontWeight="bold">Overdue</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
