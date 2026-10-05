import React, { useState } from 'react';
import {
  Send,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Eye
} from 'lucide-react';
import { INITIAL_SUBMISSIONS } from '../csrData';

export default function CSRSubmissionsScreen({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);

  const filteredSubmissions = submissions.filter((s) =>
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusChip = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'csr-status-chip approved';
      case 'under review':
        return 'csr-status-chip pending';
      case 'correction required':
        return 'csr-status-chip correction-required';
      case 'submitted':
        return 'csr-status-chip submitted';
      default:
        return 'csr-status-chip draft';
    }
  };

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Send size={24} />
            </div>
            <div>
              <div className="csr-pill-tag">GOVERNANCE & APPROVALS</div>
              <h1 className="csr-hero-title">Submissions</h1>
              <p className="csr-hero-subtitle">
                All Projects • All Submission Types • All Statuses
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-primary" onClick={() => alert('Opening Create Submission Dialog (CSR Projects, Beneficiaries, Social Impact)...')}>
              <Plus size={16} />
              + Create Submission
            </button>
          </div>
        </div>
      </div>

      {/* ──── 5 KPI STATS ROW ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Submissions</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>18</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Submitted / Pending</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>10</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Under Review</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>4</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Approved</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>3</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Correction Required</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#EA580C', marginTop: '2px' }}>1</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(234, 88, 12, 0.1)', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} />
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
            placeholder="Search submissions, modules, scopes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ──── SUBMISSIONS TABLE ──── */}
      <div className="csr-table-container">
        <table className="csr-table">
          <thead>
            <tr>
              <th>Submission ID</th>
              <th>Module</th>
              <th>Project / Scope</th>
              <th>Period</th>
              <th>Submitted By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700, color: '#2563EB' }}>{s.id}</td>
                <td style={{ fontWeight: 700, color: '#0F172A' }}>{s.module}</td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{s.scope}</span>
                </td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{s.period}</td>
                <td style={{ fontSize: '12.5px', color: '#1E293B' }}>{s.submitted_by}</td>
                <td style={{ fontSize: '12px', color: '#64748B' }}>{s.date}</td>
                <td>
                  <span className={getStatusChip(s.status)}>{s.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px' }}
                      title="View Details"
                      onClick={() => alert(`Submission ${s.id}:\nModule: ${s.module}\nReviewer: ${s.reviewer}\nApprover: ${s.approver}${s.remarks ? `\nRemarks: ${s.remarks}` : ''}`)}
                    >
                      <Eye size={13} />
                    </button>
                    {s.status === 'Correction Required' && (
                      <button
                        className="csr-btn-primary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        title="Fix & Resubmit"
                        onClick={() => alert(`Opening correction workbench for ${s.id}`)}
                      >
                        Fix
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
