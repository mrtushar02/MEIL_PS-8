import React, { useState } from 'react';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2, ChevronRight, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function SubExceptionsScreen() {
  const [activeTab, setActiveTab] = useState('Critical');

  const exceptions = [
    {
      id: 'EX-SUB-901',
      severity: 'Critical',
      title: 'CPCB Stack Emission Anomaly at Thermal Infra Unit 4',
      bu: 'Energy BU',
      site: 'Ramagundam STPP',
      indicator: 'P6_E2 (Emissions)',
      description: 'Continuous emission monitoring logged PM2.5 at 142 mg/Nm3 exceeding the 100 mg/Nm3 threshold for 4 consecutive hours on Oct 24.',
      timeRemaining: '14 hrs SLA left',
      slaStatus: 'urgent',
      reportedBy: 'Automated IoT Telemetry & BU Reviewer',
      mitigation: 'Low-NOx burner recalibrated, re-test report pending from SPCB approved laboratory.'
    },
    {
      id: 'EX-SUB-902',
      severity: 'High',
      title: 'Unverified Water Withdrawal Meter Drift',
      bu: 'Water BU',
      site: 'Kaleshwaram Lift Irrigation Pkg 2',
      indicator: 'P6_E3 (Water)',
      description: 'Ultrasonic flow meter variance of 18.4% recorded between raw pump log and canal discharge telemetry.',
      timeRemaining: '28 hrs SLA left',
      slaStatus: 'warning',
      reportedBy: 'A. Rao (Water BU Coord)',
      mitigation: 'Physical meter calibration vendor dispatched on Oct 27.'
    },
    {
      id: 'EX-SUB-903',
      severity: 'Medium',
      title: 'Hazardous Waste Manifest Form-10 SPCB Acknowledgment Stamped Copy Awaited',
      bu: 'Infrastructure BU',
      site: 'Ganga Expressway Pkg 3',
      indicator: 'P6_E4 (Waste)',
      description: 'Spent engine lube oil batch #41 dispatched to authorized re-refiner, final stamped copy from UPPCB pending.',
      timeRemaining: '48 hrs SLA left',
      slaStatus: 'normal',
      reportedBy: 'S. Verma (Infra BU Coord)',
      mitigation: 'Transporter acknowledgment uploaded; stamped copy promised by Nov 2.'
    },
    {
      id: 'EX-SUB-904',
      severity: 'Critical',
      title: 'Near-Miss High-Voltage Clearance Breach on Metro Gantry',
      bu: 'Metro BU',
      site: 'Bengaluru Metro Ph 2A',
      indicator: 'P8_S2 (Safety)',
      description: 'Crane boom radius came within 2.1m of 25kV overhead traction wire during night girder launch.',
      timeRemaining: '6 hrs SLA left',
      slaStatus: 'urgent',
      reportedBy: 'K. Patel (Metro BU Coord)',
      mitigation: 'Work stop notice issued, safety briefing held, laser proximity sensors installed.'
    }
  ];

  const filtered = exceptions.filter(ex => {
    if (activeTab === 'All') return true;
    return ex.severity.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="sub-exceptions-screen">
      {/* Top Banner & Stats */}
      <div className="sub-stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="sub-stat-card">
          <div className="sub-stat-header">
            <span className="sub-stat-label">Active Exceptions</span>
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <div className="sub-stat-value" style={{ color: '#EF4444' }}>4</div>
          <span className="sub-stat-subtext">2 Critical, 1 High, 1 Medium</span>
        </div>

        <div className="sub-stat-card">
          <div className="sub-stat-header">
            <span className="sub-stat-label">SLA Risk Index</span>
            <Clock size={18} color="#F59E0B" />
          </div>
          <div className="sub-stat-value" style={{ color: '#D97706' }}>14h Avg</div>
          <span className="sub-stat-subtext">Fastest response rate across MEIL</span>
        </div>

        <div className="sub-stat-card">
          <div className="sub-stat-header">
            <span className="sub-stat-label">Statutory Compliance</span>
            <ShieldAlert size={18} color="#7C3AED" />
          </div>
          <div className="sub-stat-value">98.4%</div>
          <span className="sub-stat-subtext">Within permissible regulatory buffer</span>
        </div>

        <div className="sub-stat-card">
          <div className="sub-stat-header">
            <span className="sub-stat-label">Resolved This Quarter</span>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <div className="sub-stat-value" style={{ color: '#10B981' }}>27</div>
          <span className="sub-stat-subtext">100% audit closure trails archived</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sub-card" style={{ marginBottom: '1.25rem', padding: '0.75rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Critical', 'High', 'Medium', 'All'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sub-btn-outline ${activeTab === tab ? 'sub-btn-primary' : ''}`}
              style={{
                borderRadius: '12px',
                padding: '0.45rem 1rem',
                fontSize: '0.82rem',
                background: activeTab === tab ? '#7C3AED' : '#FFFFFF',
                color: activeTab === tab ? '#FFFFFF' : '#475569',
                borderColor: activeTab === tab ? '#7C3AED' : '#E2E8F0'
              }}
            >
              {tab} Exceptions
            </button>
          ))}
        </div>
      </div>

      {/* Exception Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(ex => (
          <div key={ex.id} className="sub-card" style={{ borderLeft: ex.severity === 'Critical' ? '4px solid #EF4444' : ex.severity === 'High' ? '4px solid #F59E0B' : '4px solid #3B82F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className={ex.severity === 'Critical' ? 'sub-badge-danger' : ex.severity === 'High' ? 'sub-badge-warning' : 'sub-badge-neutral'}>
                    {ex.severity}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>
                    {ex.id}
                  </span>
                  <span className="sub-badge-purple">{ex.indicator}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                    {ex.bu} • {ex.site}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {ex.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: ex.slaStatus === 'urgent' ? '#FEF2F2' : '#FFFBEB', padding: '0.35rem 0.75rem', borderRadius: '10px', border: `1px solid ${ex.slaStatus === 'urgent' ? '#FCA5A5' : '#FDE68A'}` }}>
                <Clock size={14} color={ex.slaStatus === 'urgent' ? '#DC2626' : '#D97706'} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: ex.slaStatus === 'urgent' ? '#DC2626' : '#D97706' }}>
                  {ex.timeRemaining}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: '0.5rem 0' }}>
              {ex.description}
            </p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.75rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Mitigation Action: </span>
                <span style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 500 }}>{ex.mitigation}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="sub-btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                  <MessageSquare size={13} /> Add Note
                </button>
                <button className="sub-btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: '#7C3AED' }}>
                  Resolve & Close <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
