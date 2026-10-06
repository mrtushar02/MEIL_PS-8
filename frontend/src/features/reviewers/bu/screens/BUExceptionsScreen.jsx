import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  FileX,
  Calculator,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export default function BUExceptionsScreen({ submissions = [], onOpenSubmission }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Canonical exceptions aligned with reference panel 7
  const exceptionsData = [
    {
      id: 'EXC-2026-044',
      project: 'Zojila Tunnel',
      submissionId: 'SUB-2026-091',
      category: 'Missing Evidence',
      type: 'Evidence',
      severity: 'HIGH',
      detected: '2 hours ago',
      dueDate: 'Tomorrow',
      status: 'OPEN',
      details: 'Scope 1 Diesel invoice missing for generator run log (GEN-04)'
    },
    {
      id: 'EXC-2026-039',
      project: 'Tunnel B',
      submissionId: 'SUB-2026-084',
      category: 'Calculation Error',
      type: 'Calculation',
      severity: 'HIGH',
      detected: '1 day ago',
      dueDate: 'Tomorrow',
      status: 'OPEN',
      details: 'Grid emission factor used CEA v18 (0.727) instead of mandatory v19 (0.716)'
    },
    {
      id: 'EXC-2026-032',
      project: 'Gayatri Project',
      submissionId: 'SUB-2026-087',
      category: 'SLA Breach',
      type: 'SLA',
      severity: 'MEDIUM',
      detected: '20h ago',
      dueDate: '6h left',
      status: 'OPEN',
      details: 'Submission review SLA at 75% elapsed without BU approval'
    },
    {
      id: 'EXC-2026-025',
      project: 'Metro Phase 1',
      submissionId: 'SUB-2026-082',
      category: 'Validation Failed',
      type: 'Validation',
      severity: 'MEDIUM',
      detected: '1 day ago',
      dueDate: '1d',
      status: 'OPEN',
      details: 'Water recycling volume exceeds input raw intake by 12% without explanation'
    },
    {
      id: 'EXC-2026-017',
      project: 'River Link',
      submissionId: 'SUB-2026-058',
      category: 'Evidence Mismatch',
      type: 'Evidence',
      severity: 'LOW',
      detected: '2 days ago',
      dueDate: '2d',
      status: 'OPEN',
      details: 'Hazmat waste disposal certificate vendor GSTIN does not match master registry'
    },
    {
      id: 'EXC-2026-009',
      project: 'Expressway',
      submissionId: 'SUB-2026-048',
      category: 'Calculation Error',
      type: 'Calculation',
      severity: 'CRITICAL',
      detected: '3 hours ago',
      dueDate: 'Today',
      status: 'OPEN',
      details: 'Scope 2 electricity MWh entered without unit conversion factor'
    }
  ];

  // SLA Management Data aligned with panel 7
  const slaData = [
    {
      project: 'Zojila Tunnel',
      submissionId: 'SUB-2026-091',
      dueDate: '30 Sep 2026',
      remaining: '16h',
      status: 'Healthy',
      progress: 68
    },
    {
      project: 'Gayatri Project',
      submissionId: 'SUB-2026-087',
      dueDate: '30 Sep 2026',
      remaining: '6h',
      status: 'At Risk',
      progress: 88
    },
    {
      project: 'Tunnel B',
      submissionId: 'SUB-2026-084',
      dueDate: '28 Sep 2026',
      remaining: '-2h',
      status: 'Overdue',
      progress: 100
    },
    {
      project: 'River Link',
      submissionId: 'SUB-2026-058',
      dueDate: '1 Oct 2026',
      remaining: '1d',
      status: 'Healthy',
      progress: 45
    }
  ];

  const filterTabs = [
    { key: 'All', label: 'All', count: exceptionsData.length },
    { key: 'Critical', label: 'Critical', count: 1 },
    { key: 'High', label: 'High', count: 2 },
    { key: 'Medium', label: 'Medium', count: 2 },
    { key: 'SLA', label: 'SLA', count: 1 },
    { key: 'Evidence', label: 'Evidence', count: 2 },
    { key: 'Validation', label: 'Validation', count: 1 },
    { key: 'Calculation', label: 'Calculation', count: 2 }
  ];

  const filteredExceptions = exceptionsData.filter(exc => {
    if (activeTab === 'Critical' && exc.severity !== 'CRITICAL') return false;
    if (activeTab === 'High' && exc.severity !== 'HIGH') return false;
    if (activeTab === 'Medium' && exc.severity !== 'MEDIUM') return false;
    if (activeTab === 'SLA' && exc.type !== 'SLA') return false;
    if (activeTab === 'Evidence' && exc.type !== 'Evidence') return false;
    if (activeTab === 'Validation' && exc.type !== 'Validation') return false;
    if (activeTab === 'Calculation' && exc.type !== 'Calculation') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        exc.id.toLowerCase().includes(q) ||
        exc.project.toLowerCase().includes(q) ||
        exc.submissionId.toLowerCase().includes(q) ||
        exc.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bu-exceptions-screen">
      {/* Top Severity / Category Pills */}
      <div className="bu-tabs-scroll-row">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            className={`bu-segmented-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.label}</span>
            <span className="count-bubble">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Main Exceptions Table Card */}
      <div className="bu-card" style={{ marginTop: '16px' }}>
        <div className="bu-card-header">
          <div>
            <h3 className="bu-card-title">Exceptions & Non-Conformance Log</h3>
            <p className="bu-card-subtitle">
              Automated data quality flags, missing documents, calculation discrepancies, and SLA risks
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="bu-badge-neutral" style={{ fontSize: '11px' }}>
              Showing {filteredExceptions.length} active exceptions
            </span>
          </div>
        </div>

        <div className="bu-table-container">
          <table className="bu-table">
            <thead>
              <tr>
                <th>Exception ID</th>
                <th>Project</th>
                <th>Sub. ID</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Detected</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExceptions.map(exc => (
                <tr key={exc.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1E293B' }}>
                      {exc.id}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{exc.project}</span>
                  </td>
                  <td>
                    <button
                      className="bu-link-btn"
                      onClick={() => onOpenSubmission && onOpenSubmission(exc.submissionId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#2563EB',
                        fontFamily: 'monospace',
                        fontWeight: 600
                      }}
                    >
                      {exc.submissionId}
                    </button>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: '#475569' }}>{exc.category}</span>
                  </td>
                  <td>
                    <span
                      className={
                        exc.severity === 'CRITICAL' || exc.severity === 'HIGH'
                          ? 'bu-badge-danger'
                          : exc.severity === 'MEDIUM'
                          ? 'bu-badge-warning'
                          : 'bu-badge-neutral'
                      }
                      style={{ fontSize: '10px', letterSpacing: '0.05em' }}
                    >
                      {exc.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{exc.detected}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: exc.dueDate.includes('Today') || exc.dueDate.includes('6h') ? '#DC2626' : '#475569'
                      }}
                    >
                      {exc.dueDate}
                    </span>
                  </td>
                  <td>
                    <span className="bu-badge-warning" style={{ fontSize: '10px' }}>
                      {exc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="bu-btn bu-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', height: '28px' }}
                      onClick={() => onOpenSubmission && onOpenSubmission(exc.submissionId)}
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA Management Section */}
      <div className="bu-card" style={{ marginTop: '20px' }}>
        <div className="bu-card-header">
          <div>
            <h3 className="bu-card-title">SLA Management</h3>
            <p className="bu-card-subtitle">
              Project submission turnaround time tracking against SEBI 72-hour review commitment
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="bu-badge-neutral">Standard SLA: 72 Hours</span>
          </div>
        </div>

        <div className="bu-table-container">
          <table className="bu-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Submission</th>
                <th>Due Date</th>
                <th>Remaining</th>
                <th>Progress</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Review Action</th>
              </tr>
            </thead>
            <tbody>
              {slaData.map(item => (
                <tr key={item.submissionId}>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{item.project}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: '#2563EB', fontWeight: 600 }}>
                      {item.submissionId}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{item.dueDate}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color:
                          item.status === 'Overdue'
                            ? '#DC2626'
                            : item.status === 'At Risk'
                            ? '#D97706'
                            : '#16A34A'
                      }}
                    >
                      {item.remaining}
                    </span>
                  </td>
                  <td style={{ width: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          background: '#E2E8F0',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${item.progress}%`,
                            height: '100%',
                            background:
                              item.status === 'Overdue'
                                ? '#DC2626'
                                : item.status === 'At Risk'
                                ? '#F59E0B'
                                : '#10B981',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B', minWidth: '28px' }}>
                        {item.progress}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={
                        item.status === 'Healthy'
                          ? 'bu-badge-success'
                          : item.status === 'At Risk'
                          ? 'bu-badge-warning'
                          : 'bu-badge-danger'
                      }
                      style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {item.status === 'Healthy' ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="bu-btn bu-btn-primary"
                      style={{ padding: '4px 12px', fontSize: '11px', height: '28px' }}
                      onClick={() => onOpenSubmission && onOpenSubmission(item.submissionId)}
                    >
                      <span>Review Now</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
