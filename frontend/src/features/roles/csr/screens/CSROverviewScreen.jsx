import React, { useState } from 'react';
import {
  FolderKanban,
  Users,
  IndianRupee,
  Target,
  MapPin,
  Compass,
  AlertCircle,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { SPEND_TREND_DATA, INITIAL_BENEFICIARIES_DATA } from '../csrData';

const DONUT_COLORS = ['#2563EB', '#0284C7', '#059669', '#D97706', '#8B5CF6', '#64748B'];

export default function CSROverviewScreen({
  projects = [],
  communities = [],
  grievances = [],
  onNavigateTab,
  onOpenCreateProject,
  onOpenLogActivity,
  reportingPeriod = 'September 2026'
}) {
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('All Subsidiaries');
  const [selectedPeriod, setSelectedPeriod] = useState(reportingPeriod);
  const [selectedCategory, setSelectedCategory] = useState('All Program Categories');

  const activeProjectsCount = projects.filter(p => p.status === 'Active').length || projects.length;
  const totalBeneficiaries = projects.reduce((acc, p) => acc + (p.beneficiaries || 0), 0) || 18420;
  const totalSpendCr = (projects.reduce((acc, p) => acc + (p.spend_cr || 0), 0) || 12.6).toFixed(1);
  const impactCoverage = Math.round((projects.filter(p => p.impact_status === 'Achieved' || p.impact_status === 'On Track').length / (projects.length || 1)) * 100) || 76;
  const communitiesCount = communities.length || 62;
  const openGrievancesCount = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed').length || 6;
  const criticalGrievancesCount = grievances.filter(g => g.severity?.toLowerCase() === 'critical').length || 1;

  const donutData = INITIAL_BENEFICIARIES_DATA.by_category.map((item, idx) => ({
    name: item.category,
    value: item.pct,
    count: item.count,
    color: DONUT_COLORS[idx % DONUT_COLORS.length]
  }));

  // SVG Line Chart coordinates calculation for 6 points
  // Width: 460, Height: 200, Margin left: 40, bottom: 30
  const pointsTotal = [
    { x: 50, y: 140, v: 1.8 },
    { x: 120, y: 110, v: 2.1 },
    { x: 190, y: 70, v: 2.4 },
    { x: 260, y: 130, v: 1.9 },
    { x: 330, y: 100, v: 2.2 },
    { x: 400, y: 100, v: 2.2 }
  ];

  const pointsLocal = [
    { x: 50, y: 160, v: 1.1 },
    { x: 120, y: 145, v: 1.3 },
    { x: 190, y: 130, v: 1.5 },
    { x: 260, y: 155, v: 1.2 },
    { x: 330, y: 140, v: 1.4 },
    { x: 400, y: 130, v: 1.5 }
  ];

  const pointsMsme = [
    { x: 50, y: 180, v: 0.5 },
    { x: 120, y: 175, v: 0.6 },
    { x: 190, y: 170, v: 0.7 },
    { x: 260, y: 180, v: 0.5 },
    { x: 330, y: 170, v: 0.7 },
    { x: 400, y: 165, v: 0.8 }
  ];

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge">
              <FolderKanban size={24} />
            </div>
            <div>
              <div className="csr-pill-tag">MEIL GROUP CSR & BRSR CORE</div>
              <h1 className="csr-hero-title">CSR & Community Overview</h1>
              <p className="csr-hero-subtitle">
                Monitor CSR projects, community outreach, beneficiaries, impact and compliance across all subsidiaries.
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <select
              className="csr-select-control"
              value={selectedSubsidiary}
              onChange={(e) => setSelectedSubsidiary(e.target.value)}
            >
              <option>All Subsidiaries</option>
              <option>MEIL Infrastructure Ltd</option>
              <option>Olectra Greentech</option>
              <option>Megha City Gas</option>
              <option>Icomm Tele Ltd</option>
            </select>

            <select
              className="csr-select-control"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option>September 2026</option>
              <option>August 2026</option>
              <option>July 2026</option>
              <option>Q1 FY26-27</option>
            </select>

            <select
              className="csr-select-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Program Categories</option>
              <option>Education</option>
              <option>Health</option>
              <option>Livelihood</option>
              <option>Community Infra</option>
              <option>Environment</option>
            </select>

            <button className="csr-btn-primary" onClick={onOpenCreateProject}>
              <Plus size={16} />
              + Create CSR Project
            </button>

            <button className="csr-btn-secondary" onClick={onOpenLogActivity}>
              <Plus size={16} />
              + Log Activity
            </button>
          </div>
        </div>
      </div>

      {/* ──── PRIMARY KPI CARDS (4 COLUMNS) ──── */}
      <div className="csr-kpi-grid-4">
        {/* Active CSR Projects */}
        <div className="csr-kpi-card" onClick={() => onNavigateTab?.('projects')} style={{ cursor: 'pointer' }}>
          <div className="csr-kpi-header">
            <span className="csr-kpi-title">Active CSR Projects</span>
            <div className="csr-kpi-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <FolderKanban size={18} />
            </div>
          </div>
          <div className="csr-kpi-val">{activeProjectsCount}</div>
          <div className="csr-kpi-trend positive">
            <ArrowUpRight size={14} /> +20% vs last period
          </div>
        </div>

        {/* Total Beneficiaries */}
        <div className="csr-kpi-card" onClick={() => onNavigateTab?.('beneficiaries')} style={{ cursor: 'pointer' }}>
          <div className="csr-kpi-header">
            <span className="csr-kpi-title">Total Beneficiaries</span>
            <div className="csr-kpi-icon-wrap" style={{ background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="csr-kpi-val">{totalBeneficiaries.toLocaleString()}</div>
          <div className="csr-kpi-trend positive">
            <ArrowUpRight size={14} /> +12% vs last period
          </div>
        </div>

        {/* CSR Spend */}
        <div className="csr-kpi-card" onClick={() => onNavigateTab?.('analytics')} style={{ cursor: 'pointer' }}>
          <div className="csr-kpi-header">
            <span className="csr-kpi-title">CSR Spend</span>
            <div className="csr-kpi-icon-wrap" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="csr-kpi-val">₹{totalSpendCr} Cr</div>
          <div className="csr-kpi-trend negative">
            <ArrowDownRight size={14} /> -5% vs last period
          </div>
        </div>

        {/* Impact Coverage */}
        <div className="csr-kpi-card" onClick={() => onNavigateTab?.('social-impact')} style={{ cursor: 'pointer' }}>
          <div className="csr-kpi-header">
            <span className="csr-kpi-title">Impact Coverage</span>
            <div className="csr-kpi-icon-wrap" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>
              <Target size={18} />
            </div>
          </div>
          <div className="csr-kpi-val">{impactCoverage}%</div>
          <div className="csr-kpi-trend positive">
            <ArrowUpRight size={14} /> +8% vs last period
          </div>
        </div>
      </div>

      {/* ──── SECONDARY KPI CARDS (4 COLUMNS) ──── */}
      <div className="csr-kpi-grid-4">
        {/* Communities Reached */}
        <div className="csr-kpi-card" onClick={() => onNavigateTab?.('community')} style={{ cursor: 'pointer' }}>
          <div className="csr-kpi-header">
            <span className="csr-kpi-title">Communities Reached</span>
            <div className="csr-kpi-icon-wrap" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}>
              <MapPin size={18} />
            </div>
          </div>
          <div className="csr-kpi-val">{communitiesCount}</div>
          <div className="csr-kpi-trend neutral">Across Operational Regions</div>
        </div>

        {/* Local Area Coverage */}
        <div className="csr-kpi-card">
          <div className="csr-kpi-header">
            <span className="csr-kpi-title">Local Area Coverage</span>
            <div className="csr-kpi-icon-wrap" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0D9488' }}>
              <Compass size={18} />
            </div>
          </div>
          <div className="csr-kpi-val">48%</div>
          <div className="csr-kpi-trend neutral">Within 50km Project Buffer</div>
        </div>

        {/* Open Grievances */}
        <div className="csr-kpi-card" onClick={() => onNavigateTab?.('grievances')} style={{ cursor: 'pointer' }}>
          <div className="csr-kpi-header">
            <span className="csr-kpi-title">Open Grievances</span>
            <div className="csr-kpi-icon-wrap" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="csr-kpi-val">{openGrievancesCount}</div>
          <div className="csr-kpi-trend negative">{criticalGrievancesCount} Critical Escalation</div>
        </div>

        {/* Pending Actions */}
        <div className="csr-kpi-card" onClick={() => onNavigateTab?.('actions')} style={{ cursor: 'pointer' }}>
          <div className="csr-kpi-header">
            <span className="csr-kpi-title">Pending Actions</span>
            <div className="csr-kpi-icon-wrap" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="csr-kpi-val">{Math.max(1, openGrievancesCount + 2)}</div>
          <div className="csr-kpi-trend neutral">Time-bound SLA Tasks</div>
        </div>
      </div>

      {/* ──── CHARTS ROW (SPEND TREND & BENEFICIARIES DONUT) ──── */}
      <div className="csr-kpi-grid-2">
        {/* CSR Spend Trend */}
        <div className="csr-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>CSR Spend Trend (₹ Cr)</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Monthly disbursement across FY26-27</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563EB' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} /> Total Spend
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284C7' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284C7' }} /> Local Spend
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#D97706' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706' }} /> MSME Spend
              </span>
            </div>
          </div>

          <div style={{ height: 260, width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 460 220" style={{ width: '100%', height: '100%' }}>
              {/* Horizontal Grid lines */}
              <line x1="40" y1="40" x2="440" y2="40" stroke="#F1F5F9" strokeWidth="1" />
              <text x="25" y="44" fill="#94A3B8" fontSize="10" textAnchor="end">3.0</text>

              <line x1="40" y1="90" x2="440" y2="90" stroke="#F1F5F9" strokeWidth="1" />
              <text x="25" y="94" fill="#94A3B8" fontSize="10" textAnchor="end">2.0</text>

              <line x1="40" y1="140" x2="440" y2="140" stroke="#F1F5F9" strokeWidth="1" />
              <text x="25" y="144" fill="#94A3B8" fontSize="10" textAnchor="end">1.0</text>

              <line x1="40" y1="190" x2="440" y2="190" stroke="#E2E8F0" strokeWidth="1" />
              <text x="25" y="194" fill="#94A3B8" fontSize="10" textAnchor="end">0.0</text>

              {/* Month X Labels */}
              {months.map((m, idx) => (
                <text key={m} x={50 + idx * 70} y="210" fill="#64748B" fontSize="11" textAnchor="middle" fontWeight="600">
                  {m}
                </text>
              ))}

              {/* Line 1: Total Spend (Blue) */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                points="50,140 120,110 190,70 260,130 330,100 400,100"
              />
              {pointsTotal.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
              ))}

              {/* Line 2: Local Spend (Cyan) */}
              <polyline
                fill="none"
                stroke="#0284C7"
                strokeWidth="2.5"
                points="50,160 120,145 190,130 260,155 330,140 400,130"
              />
              {pointsLocal.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#0284C7" />
              ))}

              {/* Line 3: MSME Spend (Orange dashed) */}
              <polyline
                fill="none"
                stroke="#D97706"
                strokeWidth="2"
                strokeDasharray="4 4"
                points="50,180 120,175 190,170 260,180 330,170 400,165"
              />
              {pointsMsme.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#D97706" />
              ))}
            </svg>
          </div>
        </div>

        {/* Beneficiaries by Category */}
        <div className="csr-glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Beneficiaries by Category</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Distribution of 18,420 validated individuals</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 260 }}>
            {/* SVG Donut Chart */}
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '160px', height: '160px', transform: 'rotate(-90deg)' }}>
                {/* Background */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3.6" />
                {/* Education (28%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#2563EB" strokeWidth="3.6" strokeDasharray="28, 100" strokeDashoffset="0" />
                {/* Health (22%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#0284C7" strokeWidth="3.6" strokeDasharray="22, 100" strokeDashoffset="-28" />
                {/* Livelihood (16%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#059669" strokeWidth="3.6" strokeDasharray="16, 100" strokeDashoffset="-50" />
                {/* Community Infra (14%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#D97706" strokeWidth="3.6" strokeDasharray="14, 100" strokeDashoffset="-66" />
                {/* Environment (10%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="3.6" strokeDasharray="10, 100" strokeDashoffset="-80" />
                {/* Others (8%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#64748B" strokeWidth="3.6" strokeDasharray="8, 100" strokeDashoffset="-90" />
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

            {/* Legend List */}
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {donutData.map((d) => (
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
