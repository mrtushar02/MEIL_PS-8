import React from 'react';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  Plus,
  Calendar,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export default function GovOverviewScreen({
  onNavigateTab,
  onOpenAddPolicy,
  onOpenAddRecord
}) {
  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>Governance & Compliance Overview</h1>
            <p>Monitor policies, compliance obligations, control ethics, grievances and disclosures.</p>
          </div>
          <div className="gov-header-controls">
            <select className="gov-select-pill" defaultValue="all-subs">
              <option value="all-subs">🏢 All Subsidiaries</option>
              <option value="infra">MEIL Infrastructure Ltd</option>
              <option value="hydro">MEIL Hydro Division</option>
              <option value="green">MEIL Green Power</option>
            </select>
            <select className="gov-select-pill" defaultValue="fy26-27">
              <option value="fy26-27">📅 FY 2026-27</option>
              <option value="fy25-26">FY 2025-26</option>
            </select>
            <select className="gov-select-pill" defaultValue="all-bu">
              <option value="all-bu">All Business Units</option>
              <option value="bu-trans">Transmission & Substation</option>
              <option value="bu-hydro">Hydro & Tunnels</option>
              <option value="bu-urban">Urban Infrastructure</option>
            </select>
            <button 
              className="gov-btn gov-btn-secondary"
              onClick={onOpenAddPolicy}
            >
              <Plus size={15} />
              Add Policy
            </button>
            <button 
              className="gov-btn gov-btn-primary"
              onClick={onOpenAddRecord}
            >
              <Plus size={15} />
              Add Compliance Record
            </button>
          </div>
        </div>
      </div>

      {/* ──── PRIMARY 4 KPIS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card" onClick={() => onNavigateTab?.('policies')} style={{ cursor: 'pointer' }}>
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Active Policies</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <FileText size={18} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">28</span>
            <span className="gov-kpi-delta gov-delta-positive">
              <TrendingUp size={12} /> +12%
            </span>
          </div>
        </div>

        <div className="gov-kpi-card" onClick={() => onNavigateTab?.('obligations')} style={{ cursor: 'pointer' }}>
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

        <div className="gov-kpi-card" onClick={() => onNavigateTab?.('analytics')} style={{ cursor: 'pointer' }}>
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Compliance Coverage</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-green">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">87%</span>
            <span className="gov-kpi-delta gov-delta-positive">
              <TrendingUp size={12} /> +4%
            </span>
          </div>
        </div>

        <div className="gov-kpi-card" onClick={() => onNavigateTab?.('actions')} style={{ cursor: 'pointer' }}>
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

      {/* ──── SECONDARY 4 KPIS ──── */}
      <div className="gov-kpi-grid-4">
        <div className="gov-kpi-card secondary-kpi" onClick={() => onNavigateTab?.('policies')} style={{ cursor: 'pointer' }}>
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Pending Reviews</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <FileCheck2 size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">14</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi" onClick={() => onNavigateTab?.('ethics')} style={{ cursor: 'pointer' }}>
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Open Cases</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-purple">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">6</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi" onClick={() => onNavigateTab?.('controls')} style={{ cursor: 'pointer' }}>
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Control Exceptions</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-amber">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">5</span>
          </div>
        </div>

        <div className="gov-kpi-card secondary-kpi" onClick={() => onNavigateTab?.('obligations')} style={{ cursor: 'pointer' }}>
          <div className="gov-kpi-top">
            <span className="gov-kpi-label">Upcoming Deadlines</span>
            <div className="gov-kpi-icon-wrap gov-kpi-icon-blue">
              <Calendar size={16} />
            </div>
          </div>
          <div className="gov-kpi-bottom">
            <span className="gov-kpi-value">12</span>
          </div>
        </div>
      </div>

      {/* ──── CHARTS: TREND & DONUT ──── */}
      <div className="gov-charts-grid">
        {/* Compliance Status Trend */}
        <div className="gov-chart-card">
          <div className="gov-card-header">
            <div>
              <h3 className="gov-card-title">Compliance Status Trend</h3>
              <p className="gov-card-subtitle">Monthly trajectory across all operational sites</p>
            </div>
            <div className="gov-legend-row">
              <div className="gov-legend-item">
                <span className="gov-legend-dot" style={{ background: '#2563EB' }} />
                <span>Compliant</span>
              </div>
              <div className="gov-legend-item">
                <span className="gov-legend-dot" style={{ background: '#38BDF8' }} />
                <span>Under Review</span>
              </div>
              <div className="gov-legend-item">
                <span className="gov-legend-dot" style={{ background: '#F59E0B' }} />
                <span>Action Required</span>
              </div>
              <div className="gov-legend-item">
                <span className="gov-legend-dot" style={{ background: '#EF4444' }} />
                <span>Overdue</span>
              </div>
            </div>
          </div>

          <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 540 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="blueLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="520" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="65" x2="520" y2="65" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="110" x2="520" y2="110" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="155" x2="520" y2="155" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="200" x2="520" y2="200" stroke="#CBD5E1" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="18" y="24" fontSize="10" fill="#94A3B8" textAnchor="end">100%</text>
              <text x="18" y="69" fontSize="10" fill="#94A3B8" textAnchor="end">75%</text>
              <text x="18" y="114" fontSize="10" fill="#94A3B8" textAnchor="end">50%</text>
              <text x="18" y="159" fontSize="10" fill="#94A3B8" textAnchor="end">25%</text>
              <text x="18" y="204" fontSize="10" fill="#94A3B8" textAnchor="end">0%</text>

              {/* Month Bars & Trend */}
              {/* Jun */}
              <g transform="translate(60, 0)">
                <rect x="0" y="160" width="10" height="40" fill="#EF4444" rx="2" />
                <rect x="13" y="145" width="10" height="55" fill="#F59E0B" rx="2" />
                <rect x="26" y="130" width="10" height="70" fill="#38BDF8" rx="2" />
                <rect x="39" y="80" width="10" height="120" fill="#2563EB" rx="2" />
                <text x="25" y="216" fontSize="11" fill="#64748B" textAnchor="middle">Jun</text>
              </g>

              {/* Jul */}
              <g transform="translate(145, 0)">
                <rect x="0" y="165" width="10" height="35" fill="#EF4444" rx="2" />
                <rect x="13" y="150" width="10" height="50" fill="#F59E0B" rx="2" />
                <rect x="26" y="135" width="10" height="65" fill="#38BDF8" rx="2" />
                <rect x="39" y="72" width="10" height="128" fill="#2563EB" rx="2" />
                <text x="25" y="216" fontSize="11" fill="#64748B" textAnchor="middle">Jul</text>
              </g>

              {/* Aug */}
              <g transform="translate(230, 0)">
                <rect x="0" y="172" width="10" height="28" fill="#EF4444" rx="2" />
                <rect x="13" y="155" width="10" height="45" fill="#F59E0B" rx="2" />
                <rect x="26" y="140" width="10" height="60" fill="#38BDF8" rx="2" />
                <rect x="39" y="65" width="10" height="135" fill="#2563EB" rx="2" />
                <text x="25" y="216" fontSize="11" fill="#64748B" textAnchor="middle">Aug</text>
              </g>

              {/* Sept */}
              <g transform="translate(315, 0)">
                <rect x="0" y="180" width="10" height="20" fill="#EF4444" rx="2" />
                <rect x="13" y="160" width="10" height="40" fill="#F59E0B" rx="2" />
                <rect x="26" y="145" width="10" height="55" fill="#38BDF8" rx="2" />
                <rect x="39" y="52" width="10" height="148" fill="#2563EB" rx="2" />
                <text x="25" y="216" fontSize="11" fill="#64748B" textAnchor="middle">Sept</text>
              </g>

              {/* Oct */}
              <g transform="translate(400, 0)">
                <rect x="0" y="185" width="10" height="15" fill="#EF4444" rx="2" />
                <rect x="13" y="165" width="10" height="35" fill="#F59E0B" rx="2" />
                <rect x="26" y="150" width="10" height="50" fill="#38BDF8" rx="2" />
                <rect x="39" y="44" width="10" height="156" fill="#2563EB" rx="2" />
                <text x="25" y="216" fontSize="11" fill="#64748B" textAnchor="middle">Oct</text>
              </g>

              {/* Nov */}
              <g transform="translate(485, 0)">
                <rect x="0" y="188" width="10" height="12" fill="#EF4444" rx="2" />
                <rect x="13" y="170" width="10" height="30" fill="#F59E0B" rx="2" />
                <rect x="26" y="155" width="10" height="45" fill="#38BDF8" rx="2" />
                <rect x="39" y="38" width="10" height="162" fill="#2563EB" rx="2" />
                <text x="25" y="216" fontSize="11" fill="#64748B" textAnchor="middle">Nov</text>
              </g>

              {/* Connecting Trend Line */}
              <path 
                d="M 99 80 L 184 72 L 269 65 L 354 52 L 439 44 L 524 38" 
                fill="none" 
                stroke="#2563EB" 
                strokeWidth="2.5" 
              />
              <circle cx="99" cy="80" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="184" cy="72" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="269" cy="65" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="354" cy="52" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="439" cy="44" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              <circle cx="524" cy="38" r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Policy Review Status Donut */}
        <div className="gov-chart-card">
          <div className="gov-card-header">
            <div>
              <h3 className="gov-card-title">Policy Review Status</h3>
              <p className="gov-card-subtitle">Active governance cycle distribution</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                
                {/* Active: 18/28 (64.3%) -> strokeDasharray="153.5 238.7" */}
                <circle 
                  cx="50" cy="50" r="38" fill="none" 
                  stroke="#16A34A" strokeWidth="12" 
                  strokeDasharray="153.5 238.7" 
                  strokeDashoffset="0"
                />

                {/* Due for Review: 6/28 (21.4%) -> strokeDasharray="51.2 238.7" */}
                <circle 
                  cx="50" cy="50" r="38" fill="none" 
                  stroke="#F59E0B" strokeWidth="12" 
                  strokeDasharray="51.2 238.7" 
                  strokeDashoffset="-153.5"
                />

                {/* Overdue: 3/28 (10.7%) -> strokeDasharray="25.5 238.7" */}
                <circle 
                  cx="50" cy="50" r="38" fill="none" 
                  stroke="#EF4444" strokeWidth="12" 
                  strokeDasharray="25.5 238.7" 
                  strokeDashoffset="-204.7"
                />

                {/* Draft: 1/28 (3.6%) -> strokeDasharray="8.6 238.7" */}
                <circle 
                  cx="50" cy="50" r="38" fill="none" 
                  stroke="#94A3B8" strokeWidth="12" 
                  strokeDasharray="8.6 238.7" 
                  strokeDashoffset="-230.2"
                />
              </svg>

              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>28</span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px 16px',
              width: '100%',
              maxWidth: '240px',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }} />
                  Active
                </span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>18</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                  Due for Review
                </span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>6</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                  Overdue
                </span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>3</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94A3B8' }} />
                  Draft
                </span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
