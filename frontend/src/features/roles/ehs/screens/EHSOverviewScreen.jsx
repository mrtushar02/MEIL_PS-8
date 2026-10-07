import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export default function EHSOverviewScreen({
  overview,
  incidents = [],
  onNavigateTab,
  onOpenReportIncidentModal,
  onOpenIncidentDetail
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects / Sites');
  const [selectedPeriod, setSelectedPeriod] = useState('September 2026');
  const [selectedBU, setSelectedBU] = useState('Infra - Roads');

  // Actions Required list matching reference image
  const actionItems = [
    {
      id: 1,
      title: 'Critical incident requires review',
      severity: 'Critical',
      badgeColor: '#DC2626',
      badgeBg: 'rgba(239, 68, 68, 0.12)',
      targetTab: 'incidents'
    },
    {
      id: 2,
      title: 'Inspection due tomorrow',
      severity: 'High',
      badgeColor: '#D97706',
      badgeBg: 'rgba(245, 158, 11, 0.14)',
      targetTab: 'inspections'
    },
    {
      id: 3,
      title: 'Corrective action overdue',
      severity: 'Critical',
      badgeColor: '#DC2626',
      badgeBg: 'rgba(239, 68, 68, 0.12)',
      targetTab: 'corrective-actions'
    },
    {
      id: 4,
      title: 'Mandatory training pending',
      severity: 'Critical',
      badgeColor: '#DC2626',
      badgeBg: 'rgba(239, 68, 68, 0.12)',
      targetTab: 'training'
    },
    {
      id: 5,
      title: 'Environmental record missing',
      severity: 'Medium',
      badgeColor: '#2563EB',
      badgeBg: 'rgba(37, 99, 235, 0.12)',
      targetTab: 'environmental'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 1) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Title with Shield Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                EHS & Safety Overview
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                Continuous real-time safety telemetry & incident mitigation tracking across all active project sites.
              </p>
            </div>
          </div>

          {/* Right Progress Ring */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '48px', height: '48px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '48px', height: '48px', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="3.2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.2"
                  strokeDasharray="76, 100"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>
                76%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Overall Module Completion</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Audit Readiness: 94%</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <select 
            className="ehs-select-control"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '32px' }}
          >
            <option value="All Projects / Sites">All Projects / Sites (258+ Sites)</option>
            <option value="Zojila Tunnel Project">Zojila Tunnel Project</option>
            <option value="Hyderabad Metro Phase 2 Extension">Hyderabad Metro Phase 2 Extension</option>
            <option value="Olectra EV Mega Plant - Phase 1">Olectra EV Mega Plant - Phase 1</option>
            <option value="Polavaram Dam Project">Polavaram Dam Project</option>
            <option value="Megha Gas CGD Network - Krishna">Megha Gas CGD Network - Krishna</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '32px' }}
          >
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
            <option value="FY 2026-27 YTD">FY 2026-27 YTD</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedBU}
            onChange={(e) => setSelectedBU(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '32px' }}
          >
            <option value="Infra - Roads">Infra - Roads & Tunnels</option>
            <option value="Hydro & Irrigation">Hydro & Irrigation (Polavaram)</option>
            <option value="Clean Mobility">Clean Mobility (Olectra)</option>
            <option value="City Gas Distribution">City Gas Distribution (Megha Gas)</option>
            <option value="Urban Rail Metro">Urban Rail (Hyderabad Metro)</option>
          </select>
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (6 In a Row - Dynamically Calculated) ──── */}
      <div className="ehs-kpi-grid">
        {/* Total Incidents */}
        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('incidents')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Total Incidents</span>
            <div className="ehs-kpi-icon-pill" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
              <ShieldAlert size={14} />
            </div>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">
              {incidents && incidents.length > 0 ? incidents.length : (overview?.total_incidents ?? 12)}
            </span>
          </div>
          <div className="ehs-kpi-subtext">
            <span className="ehs-trend-up">▼ -8.5%</span>
            <span>vs prev month</span>
          </div>
        </div>

        {/* High-Risk Incidents */}
        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('incidents')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">High-Risk Incidents</span>
            <div className="ehs-kpi-icon-pill" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
              <AlertTriangle size={14} />
            </div>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">
              {incidents && incidents.length > 0 
                ? incidents.filter(i => (i.severity || '').toLowerCase() === 'high' || (i.severity || '').toLowerCase() === 'critical').length 
                : (overview?.high_risk_incidents ?? 3)}
            </span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>{incidents?.filter(i => (i.status || '').toLowerCase().includes('progress') || (i.status || '').toLowerCase().includes('review')).length || 2} Under Investigation</span>
          </div>
        </div>

        {/* Lost Time Injuries */}
        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('safety')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Lost Time Injuries</span>
            <div className="ehs-kpi-icon-pill" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
              <Clock size={14} />
            </div>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">
              {incidents && incidents.length > 0
                ? incidents.filter(i => i.lti || i.lost_time_injury || (i.type || '').toLowerCase().includes('lti')).length
                : (overview?.lost_time_injuries ?? 1)}
            </span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Resolved with RTW</span>
          </div>
        </div>

        {/* Training Coverage */}
        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('training')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Training Coverage</span>
            <div className="ehs-kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
              <CheckCircle2 size={14} />
            </div>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{overview?.training_coverage ? `${overview.training_coverage}%` : '92%'}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span className="ehs-trend-up">▲ +3.2%</span>
            <span>Target: &gt;90%</span>
          </div>
        </div>

        {/* Inspection Completion */}
        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('inspections')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Inspection Completion</span>
            <div className="ehs-kpi-icon-pill" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <FileCheck2 size={14} />
            </div>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{overview?.inspection_completion ? `${overview.inspection_completion}%` : '87%'}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>21 of 24 completed</span>
          </div>
        </div>

        {/* Overdue Actions */}
        <div className="ehs-kpi-card interactive" onClick={() => onNavigateTab?.('corrective-actions')}>
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Overdue Actions</span>
            <div className="ehs-kpi-icon-pill" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
              <AlertTriangle size={14} />
            </div>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{overview?.corrective_actions_overdue ?? 5}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#DC2626', fontWeight: 700 }}>Requires Attention</span>
          </div>
        </div>
      </div>

      {/* ──── 3. SPLIT MAIN SECTION: TREND CHART (LEFT) + ACTION REQUIRED (RIGHT) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '16px' }}>
        {/* Left: Safety Incident Trend */}
        <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Safety Incident Trend
              </h3>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                Monthly distribution of incidents, near-misses, and lost-time injuries.
              </p>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11.5px', color: '#475569' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} /> Incidents
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} /> Near Miss
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} /> LTI
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} /> Fatality
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg viewBox="0 0 700 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Horizontal Grid lines */}
              <line x1="40" y1="20" x2="680" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="65" x2="680" y2="65" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="110" x2="680" y2="110" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="155" x2="680" y2="155" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="190" x2="680" y2="190" stroke="#CBD5E1" strokeWidth="1" />

              {/* Y Axis labels */}
              <text x="25" y="24" fontSize="10" fill="#94A3B8" textAnchor="end">30</text>
              <text x="25" y="69" fontSize="10" fill="#94A3B8" textAnchor="end">20</text>
              <text x="25" y="114" fontSize="10" fill="#94A3B8" textAnchor="end">10</text>
              <text x="25" y="159" fontSize="10" fill="#94A3B8" textAnchor="end">5</text>
              <text x="25" y="193" fontSize="10" fill="#94A3B8" textAnchor="end">0</text>

              {/* Near Miss Curve (Green, High) */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  50,110  105,95  165,80  220,90  275,70  330,60  385,50  440,65  495,55  550,45  605,40  660,35
                "
              />
              {/* Incidents Curve (Blue) */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  50,150  105,140  165,130  220,135  275,120  330,125  385,115  440,130  495,120  550,110  605,105  660,95
                "
              />
              {/* LTI Curve (Orange, Low) */}
              <polyline
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="
                  50,180  105,175  165,180  220,185  275,180  330,175  385,180  440,175  495,180  550,185  605,180  660,185
                "
              />
              {/* Fatality Curve (Red, Flat at 0) */}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
                points="
                  50,190  105,190  165,190  220,190  275,190  330,190  385,190  440,190  495,190  550,190  605,190  660,190
                "
              />

              {/* X Axis Months */}
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                <text key={m} x={50 + idx * 55} y="208" fontSize="10.5" fill="#64748B" textAnchor="middle">
                  {m}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Action Required (6) */}
        <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Action Required (6)
            </h3>
            <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: '#F1F5F9', color: '#64748B' }}>
              DAY FORMAT
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {actionItems.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span 
                    style={{ 
                      fontSize: '10.5px', 
                      fontWeight: 800, 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      color: item.badgeColor, 
                      background: item.badgeBg,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.severity}
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </span>
                </div>

                <button 
                  type="button"
                  className="ehs-btn ehs-btn-outline"
                  style={{ padding: '3px 10px', fontSize: '11px', height: '26px' }}
                  onClick={() => onNavigateTab?.(item.targetTab)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
