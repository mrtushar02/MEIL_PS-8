import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSearch,
  Filter,
  Eye,
  ArrowRight,
  TrendingUp,
  CheckSquare,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export default function BUDataValidationScreen({ onOpenSubmission }) {
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedRuleType, setSelectedRuleType] = useState('ALL');

  const validationSummary = {
    recordsReviewed: 142,
    passRate: 97.1,
    warnings: 8,
    blockingErrors: 2
  };

  const validationRules = [
    { id: 'R-01', name: 'Data Completeness', status: 'Passed', count: '100% complete' },
    { id: 'R-02', name: 'Unit Validation', status: 'Passed', count: 'Standard SI Units' },
    { id: 'R-03', name: 'Emission Factor Governed', status: 'Passed', count: 'CEA v19 Baseline' },
    { id: 'R-04', name: 'Calculation Consistency', status: 'Warning', count: '1 check flagged' },
    { id: 'R-05', name: 'Cross-Field Coherence', status: 'Passed', count: 'Balanced' },
    { id: 'R-06', name: 'YoY Variance Threshold', status: 'Warning', count: '2 spikes detected' },
    { id: 'R-07', name: 'Evidence Integrity (SHA-256)', status: 'Passed', count: '14/14 Hashes valid' }
  ];

  const validationIssues = [
    {
      id: 'VAL-089',
      issue: 'Grid Emission Factor Version Mismatch',
      project: 'Tunnel B',
      submissionId: 'SUB-2026-084',
      rule: 'R-03 Emission Factors',
      severity: 'BLOCKING',
      detected: '2 hours ago',
      owner: 'R. Singh (Site Officer)',
      status: 'Open',
      detail: 'Submitted with CEA v18 (0.727 kg CO2e/kWh) instead of mandatory CEA v19 (0.716 kg CO2e/kWh).'
    },
    {
      id: 'VAL-084',
      issue: 'Diesel Invoice Quantity vs Entry Discrepancy',
      project: 'Zojila Tunnel',
      submissionId: 'SUB-2026-091',
      rule: 'R-07 Evidence Linkage',
      severity: 'WARNING',
      detected: '5 hours ago',
      owner: 'Tenzin Dorjey (Site Officer)',
      status: 'In Review',
      detail: 'Invoice shows 12,000 L delivered, site log shows 11,850 L burned. Variance 1.2% within tolerance.'
    },
    {
      id: 'VAL-077',
      issue: 'Water Recycling Rate Exceeds Benchmark',
      project: 'Metro Phase 1',
      submissionId: 'SUB-2026-082',
      rule: 'R-06 YoY Variance',
      severity: 'WARNING',
      detected: '1 day ago',
      owner: 'A. Verma (Site Officer)',
      status: 'Open',
      detail: 'Water recycling reported at 95% vs 87% historical average. Supplementary meter log required.'
    },
    {
      id: 'VAL-071',
      issue: 'Missing Hazmat Waste Disposal Manifest',
      project: 'Tunnel B',
      submissionId: 'SUB-2026-084',
      rule: 'R-01 Data Completeness',
      severity: 'BLOCKING',
      detected: '1 day ago',
      owner: 'R. Singh (Site Officer)',
      status: 'Open',
      detail: 'Mandatory CPCB Form 10 hazardous waste manifest attachment is unattached.'
    },
    {
      id: 'VAL-065',
      issue: 'Renewable Solar Output Ratio Check',
      project: 'Expressway',
      submissionId: 'SUB-2026-048',
      rule: 'R-04 Calculation Consistency',
      severity: 'INFO',
      detected: '2 days ago',
      owner: 'V. Joshi (Site Officer)',
      status: 'Resolved',
      detail: 'Rooftop solar telemetry verified against state discom net metering register.'
    }
  ];

  const filteredIssues = validationIssues.filter(item => {
    if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity) return false;
    return true;
  });

  return (
    <div className="bu-data-validation-screen">
      {/* ── TOP KPI ROW ── */}
      <div className="bu-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Records Reviewed</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
              <FileSearch size={16} />
            </div>
          </div>
          <div className="kpi-value">{validationSummary.recordsReviewed}</div>
          <div className="kpi-delta positive">All 6 sites surveyed</div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Validation Pass Rate</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="kpi-value">{validationSummary.passRate}%</div>
          <div className="kpi-delta positive">+1.8% vs last cycle</div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Active Warnings</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#D97706' }}>0{validationSummary.warnings}</div>
          <div className="kpi-delta neutral">Non-blocking variances</div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Blocking Errors</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
              <XCircle size={16} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#DC2626' }}>0{validationSummary.blockingErrors}</div>
          <div className="kpi-delta negative">Must resolve before approval</div>
        </div>
      </div>

      {/* ── AUTOMATED QUALITY RULES STRIP ── */}
      <div className="bu-card" style={{ marginBottom: '20px', padding: '18px 22px' }}>
        <h3 className="bu-card-title" style={{ fontSize: '15px', marginBottom: '14px' }}>
          Automated Quality Rules Engine Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
          {validationRules.map(rule => (
            <div
              key={rule.id}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', fontWeight: 600 }}>
                  {rule.id}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  {rule.name}
                </span>
                <span style={{ fontSize: '11px', color: '#475569', display: 'block', marginTop: '2px' }}>
                  {rule.count}
                </span>
              </div>
              {rule.status === 'Passed' ? (
                <CheckCircle2 size={18} color="#16A34A" />
              ) : (
                <AlertTriangle size={18} color="#D97706" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── VALIDATION ISSUES TABLE ── */}
      <div className="bu-card">
        <div className="bu-card-header">
          <div>
            <h3 className="bu-card-title">Validation Discrepancies & Flagged Rules</h3>
            <p className="bu-card-subtitle">
              Quality gate violations detected by automated SEBI BRSR rule evaluation engine
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'BLOCKING', 'WARNING', 'INFO'].map(sev => (
              <button
                key={sev}
                className={`bu-segmented-btn ${selectedSeverity === sev ? 'active' : ''}`}
                onClick={() => setSelectedSeverity(sev)}
                style={{ padding: '4px 12px', fontSize: '11px' }}
              >
                <span>{sev}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bu-table-container">
          <table className="bu-table">
            <thead>
              <tr>
                <th>Issue & Rule</th>
                <th>Project</th>
                <th>Submission</th>
                <th>Severity</th>
                <th>Detected</th>
                <th>Owner</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(item => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <span style={{ fontWeight: 700, color: '#0F172A', display: 'block' }}>
                        {item.issue}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{item.rule}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#1E293B' }}>{item.project}</span>
                  </td>
                  <td>
                    <button
                      className="bu-link-btn"
                      onClick={() => onOpenSubmission && onOpenSubmission(item.submissionId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#2563EB',
                        fontFamily: 'monospace',
                        fontWeight: 600
                      }}
                    >
                      {item.submissionId}
                    </button>
                  </td>
                  <td>
                    <span
                      className={
                        item.severity === 'BLOCKING'
                          ? 'bu-badge-danger'
                          : item.severity === 'WARNING'
                          ? 'bu-badge-warning'
                          : 'bu-badge-neutral'
                      }
                      style={{ fontSize: '10px' }}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{item.detected}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{item.owner}</span>
                  </td>
                  <td>
                    <span className="bu-badge-warning" style={{ fontSize: '10px' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="bu-btn bu-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', height: '28px' }}
                      onClick={() => onOpenSubmission && onOpenSubmission(item.submissionId)}
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
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
