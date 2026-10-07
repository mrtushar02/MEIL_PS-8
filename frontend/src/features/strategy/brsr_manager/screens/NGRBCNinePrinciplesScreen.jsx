import React, { useState } from 'react';
import { Scale, CheckCircle2, Award, Download } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function NGRBCNinePrinciplesScreen() {
  const [selectedP, setSelectedP] = useState('All');

  const principles = [
    { code: 'P1', title: 'Ethics, Transparency & Governance', essential: '8 of 8 Complete', leadership: '4 of 4 Reported', score: '100%', status: 'Filing Ready' },
    { code: 'P2', title: 'Product Safety & Lifecycle Sustainability', essential: '6 of 6 Complete', leadership: '3 of 3 Reported', score: '96%', status: 'Filing Ready' },
    { code: 'P3', title: 'Employee Well-being, Diversity & Safety', essential: '12 of 12 Complete', leadership: '6 of 6 Reported', score: '98%', status: 'Filing Ready' },
    { code: 'P4', title: 'Stakeholder Engagement & Grievance Mechanism', essential: '5 of 5 Complete', leadership: '3 of 3 Reported', score: '94%', status: 'Filing Ready' },
    { code: 'P5', title: 'Human Rights Stewardship & Protection', essential: '6 of 6 Complete', leadership: '2 of 2 Reported', score: '100%', status: 'Filing Ready' },
    { code: 'P6', title: 'Environmental Protection, Energy & Water (Core)', essential: '18 of 18 Complete', leadership: '8 of 8 Reported', score: '95.4%', status: 'PwC Verified' },
    { code: 'P7', title: 'Responsible Public Policy Advocacy', essential: '4 of 4 Complete', leadership: '2 of 2 Reported', score: '100%', status: 'Filing Ready' },
    { code: 'P8', title: 'Inclusive Growth & Community CSR 2% PAT', essential: '8 of 8 Complete', leadership: '4 of 4 Reported', score: '96%', status: 'Filing Ready' },
    { code: 'P9', title: 'Consumer Responsibility, Trust & Fair Practices', essential: '6 of 6 Complete', leadership: '3 of 3 Reported', score: '98%', status: 'Filing Ready' }
  ];

  const filtered = selectedP === 'All' ? principles : principles.filter(p => p.code === selectedP);

  const handleExport = () => {
    exportToCsv('MEIL_NGRBC_9_Principles_Matrix.csv', filtered.map(p => ({
      'Principle Code': p.code,
      'Principle Title': p.title,
      'Essential Indicators Progress': p.essential,
      'Leadership Indicators Progress': p.leadership,
      'Compliance Score': p.score,
      'Assurance Status': p.status
    })));
  };

  return (
    <div className="brsr-mgr-principles">
      <div className="brsr-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="brsr-mgr-card-title">National Guidelines on Responsible Business Conduct (NGRBC 9 Principles)</h2>
            <p className="brsr-mgr-card-subtitle">
              Comprehensive tracking of SEBI Essential Indicators (Mandatory) and Leadership Indicators (Voluntary)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span className="brsr-mgr-badge-blue">All 9 Principles Assured</span>
            <button className="brsr-mgr-btn-primary" onClick={handleExport} style={{ fontSize: '0.8rem' }}>
              <Download size={13} /> Export Matrix
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {['All', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedP(p)}
              style={{
                background: selectedP === p ? '#2563EB' : '#F1F5F9',
                color: selectedP === p ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '8px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {p === 'All' ? 'All Principles' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="brsr-mgr-card">
        <div className="brsr-mgr-table-container">
          <table className="brsr-mgr-table">
            <thead>
              <tr>
                <th>Principle</th>
                <th>Principle Title & Focus</th>
                <th>Essential Indicators</th>
                <th>Leadership Indicators</th>
                <th>Compliance Score</th>
                <th style={{ textAlign: 'right' }}>Assurance Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.code}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563EB' }}>{p.code}</span>
                  </td>
                  <td><span style={{ fontWeight: 700, color: '#0F172A' }}>{p.title}</span></td>
                  <td><span style={{ fontWeight: 600, color: '#047857' }}>{p.essential}</span></td>
                  <td><span style={{ color: '#475569' }}>{p.leadership}</span></td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#2563EB' }}>{p.score}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="brsr-mgr-badge-blue">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {p.status}
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
