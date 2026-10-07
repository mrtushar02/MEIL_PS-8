import React, { useState } from 'react';
import { 
  Calendar, 
  Lock, 
  Unlock, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { api } from '../../../services/api';

export default function AdminReportingPeriodsScreen({
  periods = [],
  onRefresh
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0] || null);

  // Fallback canonical periods if empty
  const displayPeriods = periods.length > 0 ? periods : [
    { id: 'period-2025-09', name: 'September 2025', financial_year: '2025-26', start_date: '2025-04-01', end_date: '2025-09-30', is_locked: false, is_active: true, submissions_count: '184 / 258' },
    { id: 'period-2025-03', name: 'March 2025', financial_year: '2024-25', start_date: '2024-10-01', end_date: '2025-03-31', is_locked: true, is_active: false, submissions_count: '258 / 258' },
    { id: 'period-2024-09', name: 'September 2024', financial_year: '2024-25', start_date: '2024-04-01', end_date: '2024-09-30', is_locked: true, is_active: false, submissions_count: '258 / 258' },
    { id: 'period-2024-03', name: 'March 2024', financial_year: '2023-24', start_date: '2023-10-01', end_date: '2024-03-31', is_locked: true, is_active: false, submissions_count: '246 / 258' }
  ];

  const handleToggleLock = async (p) => {
    const isLocking = !p.is_locked;
    const confirmMsg = isLocking
      ? `Permanently LOCK reporting period '${p.name}' for official SEBI BRSR filing? All project submissions will become immutable.`
      : `ADMIN OVERRIDE: Unlock reporting period '${p.name}'? This permits exceptional retroactive data adjustments and will be audited.`;
    
    if (!window.confirm(confirmMsg)) return;

    setIsProcessing(true);
    try {
      if (isLocking) {
        await api.lockReportingPeriod(p.id);
      } else {
        await api.unlockReportingPeriod(p.id);
      }
      onRefresh && onRefresh();
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const activePeriod = displayPeriods.find(p => !p.is_locked) || displayPeriods[0];

  return (
    <div className="admin-reporting-periods-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Reporting Period Management</h2>
          <p>Create, activate, lock and manage regulatory BRSR reporting cycles and immutable filing gates</p>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Period Name</th>
              <th>Financial Year</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Submissions</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayPeriods.map((p) => (
              <tr 
                key={p.id}
                onClick={() => setSelectedPeriod(p)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="#2563EB" />
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{p.name}</span>
                  </div>
                </td>
                <td>FY {p.financial_year}</td>
                <td>{p.start_date}</td>
                <td>{p.end_date}</td>
                <td>
                  <span className={`admin-badge ${!p.is_locked ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {!p.is_locked ? 'Active' : 'Locked'}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: '#334155' }}>
                    {p.submissions_count || '184 / 258'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    type="button" 
                    className={`admin-btn ${p.is_locked ? 'admin-btn-secondary' : 'admin-btn-danger'}`}
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLock(p);
                    }}
                    disabled={isProcessing}
                  >
                    {p.is_locked ? (
                      <><Unlock size={12} /> Unlock</>
                    ) : (
                      <><Lock size={12} /> Lock Period</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Period Overview Timeline Bottom Card */}
      <div className="admin-card" style={{ margin: 0, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Period Overview — {activePeriod?.name || 'September 2025'}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Statutory 5-stage submission & verification progress timeline
            </p>
          </div>
          <span className="admin-badge admin-badge-blue">
            IN PROGRESS (STAGE 3)
          </span>
        </div>

        {/* Timeline Stepper */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', position: 'relative' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(22, 163, 74, 0.08)', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>STAGE 1</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>Open</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>1 Apr 2025</div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(22, 163, 74, 0.08)', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>STAGE 2</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>Data Entry</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Apr – Aug 2025</div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
            <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '700' }}>STAGE 3 (CURRENT)</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>Review</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>September 2025</div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>STAGE 4</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>Group Review</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>October 2025</div>
          </div>

          <div style={{ padding: '14px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>STAGE 5</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>Statutory Lock</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>November 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}
