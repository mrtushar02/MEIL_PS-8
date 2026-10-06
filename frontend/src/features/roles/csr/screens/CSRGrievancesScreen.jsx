import React, { useState } from 'react';
import {
  AlertCircle,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X
} from 'lucide-react';
import { INITIAL_GRIEVANCES } from '../csrData';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function CSRGrievancesScreen({
  onNavigateTab,
  onOpenRegisterGrievance
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [grievances, setGrievances] = useState(INITIAL_GRIEVANCES);
  const [viewGrievance, setViewGrievance] = useState(null);

  const filteredGrievances = grievances.filter((g) =>
    g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.community.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityChip = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'csr-status-chip critical';
      case 'high':
        return 'csr-status-chip high';
      case 'medium':
        return 'csr-status-chip warning';
      default:
        return 'csr-status-chip open';
    }
  };

  const getStatusChip = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return 'csr-status-chip completed';
      case 'overdue':
        return 'csr-status-chip critical';
      case 'in progress':
      case 'under review':
        return 'csr-status-chip pending';
      default:
        return 'csr-status-chip open';
    }
  };

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <div className="csr-pill-tag" style={{ color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.25)', background: 'rgba(220, 38, 38, 0.08)' }}>
                COMMUNITY CONCERNS & REDRESSAL (BRSR P4/P5)
              </div>
              <h1 className="csr-hero-title">Community Grievances</h1>
              <p className="csr-hero-subtitle">
                Track community concerns, resolution actions, evidence and time-bound SLA closures.
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-primary" onClick={onOpenRegisterGrievance}>
              <Plus size={16} />
              + Register Grievance
            </button>
          </div>
        </div>
      </div>

      {/* ──── STATS ──── */}
      <div className="csr-kpi-grid-4">
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Open Grievances</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>6</div>
            <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, marginTop: '2px' }}>Active Redressal</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Critical Escalations</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#EA580C', marginTop: '2px' }}>1</div>
            <div style={{ fontSize: '11px', color: '#EA580C', fontWeight: 700, marginTop: '2px' }}>Municipal Sewage Block</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(234, 88, 12, 0.1)', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Resolved Grievances</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>28</div>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>82% Resolved in SLA</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Average SLA</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>4.2 Days</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Resolution Target: 7 Days</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* ──── SEARCH BAR ──── */}
      <div className="csr-filter-bar">
        <div className="csr-search-box">
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            className="csr-search-input"
            placeholder="Search grievances, category, community, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ──── GRIEVANCES TABLE ──── */}
      <div className="csr-table-container">
        <table className="csr-table">
          <thead>
            <tr>
              <th>Grievance ID</th>
              <th>Date</th>
              <th>Project & Community</th>
              <th>Category</th>
              <th>Description & Resolution</th>
              <th>Severity</th>
              <th>Owner</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrievances.map((g) => (
              <tr key={g.id}>
                <td style={{ fontWeight: 700, color: '#2563EB' }}>{g.id}</td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{g.date}</td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{g.project}</div>
                  <div style={{ fontSize: '11.5px', color: '#475569' }}>{g.community}</div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{g.category}</span>
                </td>
                <td>
                  <div style={{ fontSize: '12.5px', color: '#1E293B', maxWidth: '300px' }}>{g.description}</div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>Resolution: {g.resolution}</div>
                </td>
                <td>
                  <span className={getSeverityChip(g.severity)}>{g.severity}</span>
                </td>
                <td style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>{g.owner}</td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{g.due_date}</td>
                <td>
                  <span className={getStatusChip(g.status)}>{g.status}</span>
                </td>
                <td>
                  <button
                    className="csr-btn-outline"
                    style={{ padding: '4px 8px' }}
                    title="View Grievance Dossier"
                    onClick={() => setViewGrievance(g)}
                  >
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Grievance Dossier Modal */}
      {viewGrievance && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setViewGrievance(null)}
        >
          <div
            className="csr-glass-card"
            style={{
              width: '100%',
              maxWidth: '540px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Grievance Dossier: {viewGrievance.id}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {viewGrievance.project} • {viewGrievance.community}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewGrievance(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Description</div>
              <div style={{ fontSize: '13px', color: '#1E293B', marginTop: '4px' }}>{viewGrievance.description}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Severity</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626' }}>{viewGrievance.severity}</div>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Assigned Owner</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{viewGrievance.owner}</div>
              </div>
              <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Due Date</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{viewGrievance.due_date}</div>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#EFF6FF', borderRadius: '10px', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>Resolution Status</div>
              <div style={{ fontSize: '13px', color: '#1E40AF', marginTop: '4px' }}>
                {viewGrievance.resolution || 'Investigation underway by MEIL Site Community Liaison.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="csr-btn-outline"
                onClick={() => setViewGrievance(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="csr-btn-primary"
                onClick={() => {
                  exportToCsv(`Grievance_${viewGrievance.id}.csv`, [viewGrievance]);
                  setViewGrievance(null);
                }}
              >
                Export Dossier CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
