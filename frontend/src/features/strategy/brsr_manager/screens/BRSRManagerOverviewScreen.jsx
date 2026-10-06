import React from 'react';
import { Scale, FileCheck, Award, ArrowRight, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

export default function BRSRManagerOverviewScreen({ onNavigate }) {
  const sections = [
    { code: 'Section A', name: 'General Disclosures & Corporate Identity', questions: '24 Mandatory Items', completeness: '100%', status: 'Fully Signed' },
    { code: 'Section B', name: 'Management and Process Disclosures', questions: '18 Mandatory Items', completeness: '100%', status: 'Fully Signed' },
    { code: 'Section C', name: 'Principle-wise Performance (P1 to P9)', questions: '9 Principles (Essential & Leadership)', completeness: '98.2%', status: 'Core Assured' },
    { code: 'BRSR Core', name: 'SEBI Circular 2023 9 Mandatory Indicators', questions: '9 Indicators (P1_E1 to P8_S2)', completeness: '100%', status: 'PwC Verified' }
  ];

  return (
    <div className="brsr-mgr-overview">
      <div className="brsr-mgr-stats-grid">
        <div className="brsr-mgr-stat-card">
          <div className="brsr-mgr-stat-header">
            <span className="brsr-mgr-stat-label">BRSR Completeness</span>
            <FileCheck size={18} color="#2563EB" />
          </div>
          <div className="brsr-mgr-stat-value">98.2%</div>
          <span className="brsr-mgr-stat-subtext">All 9 Principles populated</span>
        </div>

        <div className="brsr-mgr-stat-card">
          <div className="brsr-mgr-stat-header">
            <span className="brsr-mgr-stat-label">BRSR Core Assurance</span>
            <ShieldCheck size={18} color="#059669" />
          </div>
          <div className="brsr-mgr-stat-value" style={{ color: '#059669' }}>100%</div>
          <span className="brsr-mgr-stat-subtext">9 of 9 Core Parameters Ready</span>
        </div>

        <div className="brsr-mgr-stat-card">
          <div className="brsr-mgr-stat-header">
            <span className="brsr-mgr-stat-label">XBRL Taxonomy</span>
            <Award size={18} color="#2563EB" />
          </div>
          <div className="brsr-mgr-stat-value">Valid</div>
          <span className="brsr-mgr-stat-subtext">Zero schema validation errors</span>
        </div>

        <div className="brsr-mgr-stat-card">
          <div className="brsr-mgr-stat-header">
            <span className="brsr-mgr-stat-label">Days to SEBI Filing</span>
            <Scale size={18} color="#D97706" />
          </div>
          <div className="brsr-mgr-stat-value" style={{ color: '#D97706' }}>24 Days</div>
          <span className="brsr-mgr-stat-subtext">Well within statutory deadline</span>
        </div>
      </div>

      <div className="brsr-mgr-card">
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="brsr-mgr-card-title">SEBI BRSR Statutory Sections Architecture</h2>
            <p className="brsr-mgr-card-subtitle">
              Detailed tracking of General, Management, and Principle-wise disclosure packages
            </p>
          </div>
          <button className="brsr-mgr-btn-primary" onClick={() => onNavigate && onNavigate('principles')}>
            Explore NGRBC Principles <ArrowRight size={14} />
          </button>
        </div>

        <div className="brsr-mgr-table-container">
          <table className="brsr-mgr-table">
            <thead>
              <tr>
                <th>Statutory Section</th>
                <th>Section Description</th>
                <th>Mandatory Disclosure Scope</th>
                <th>Completeness</th>
                <th style={{ textAlign: 'right' }}>Filing Readiness</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(s => (
                <tr key={s.code}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563EB' }}>{s.code}</span>
                  </td>
                  <td><span style={{ fontWeight: 700, color: '#0F172A' }}>{s.name}</span></td>
                  <td><span style={{ color: '#475569' }}>{s.questions}</span></td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#059669' }}>{s.completeness}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="brsr-mgr-badge-blue">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {s.status}
                    </span>
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
