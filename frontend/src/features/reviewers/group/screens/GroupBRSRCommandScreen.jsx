import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, FileText, Download, ShieldCheck, Filter } from 'lucide-react';

export default function GroupBRSRCommandScreen() {
  const [selectedPrinciple, setSelectedPrinciple] = useState('All');

  const principles = [
    { id: 'P1', name: 'Ethics, Transparency & Accountability', score: 100, indicators: 8, status: 'Audit Ready' },
    { id: 'P2', name: 'Product Lifecycle Sustainability', score: 96, indicators: 6, status: 'Audit Ready' },
    { id: 'P3', name: 'Employee Well-being & Safety', score: 98, indicators: 14, status: 'Audit Ready' },
    { id: 'P4', name: 'Stakeholder Engagement', score: 94, indicators: 5, status: 'Audit Ready' },
    { id: 'P5', name: 'Human Rights Stewardship', score: 100, indicators: 6, status: 'Audit Ready' },
    { id: 'P6', name: 'Protection & Restoration of Environment', score: 95.4, indicators: 18, status: 'Assurance Ready' },
    { id: 'P7', name: 'Responsible Policy Advocacy', score: 100, indicators: 4, status: 'Audit Ready' },
    { id: 'P8', name: 'Inclusive Growth & Community Development', score: 96, indicators: 9, status: 'Audit Ready' },
    { id: 'P9', name: 'Customer / Client Value & Trust', score: 98, indicators: 6, status: 'Audit Ready' }
  ];

  const coreIndicators = [
    { code: 'P1_E1', title: 'Climate Risk Governance Oversight', principle: 'P1', value: 'Quarterly Board Review', readiness: '100%', assurance: 'Verified' },
    { code: 'P2_E1', title: 'Life Cycle Assessment (LCA) Coverage', principle: 'P2', value: '4 Major Product Categories', readiness: '95%', assurance: 'Verified' },
    { code: 'P6_E1', title: 'Scope 1 Direct GHG Footprint', principle: 'P6', value: '112,400 tCO2e', readiness: '98%', assurance: 'PwC Verified' },
    { code: 'P6_E2', title: 'Scope 2 Grid Electricity GHG', principle: 'P6', value: '71,850 tCO2e', readiness: '99%', assurance: 'PwC Verified' },
    { code: 'P6_E3', title: 'Water Withdrawal & Net Consumption', principle: 'P6', value: '1,420,000 m³', readiness: '94%', assurance: 'PwC Verified' },
    { code: 'P6_E4', title: 'Hazardous Waste Generated & Recycled', principle: 'P6', value: '4,280 MT (100% Manifested)', readiness: '96%', assurance: 'PwC Verified' },
    { code: 'P8_S1', title: 'Workforce Gender Diversity & Pay Ratio', principle: 'P8', value: '1:1 Median Salary Ratio', readiness: '98%', assurance: 'Verified' },
    { code: 'P8_S2', title: 'Lost Time Injury Frequency Rate (LTIFR)', principle: 'P8', value: '0.08 per mn man-hours', readiness: '100%', assurance: 'PwC Verified' }
  ];

  const filteredIndicators = selectedPrinciple === 'All' 
    ? coreIndicators 
    : coreIndicators.filter(i => i.principle === selectedPrinciple);

  return (
    <div className="group-brsr-command-screen">
      {/* Top Banner */}
      <div className="group-card" style={{ marginBottom: '1.25rem' }}>
        <div className="group-card-header">
          <div>
            <h2 className="group-card-title">SEBI BRSR & BRSR Core Enterprise Matrix</h2>
            <p className="group-card-subtitle">
              Comprehensive 9 NGRBC principles verification aligned with SEBI Circulars 2021, 2023, and 2025 mandates
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span className="group-badge-indigo">
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '0.2rem' }} />
              SEBI BRSR Core Assured
            </span>
            <button className="group-btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
              <Download size={14} /> Export SEBI XBRL Pack
            </button>
          </div>
        </div>

        {/* 9 Principles Badges Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
          {principles.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedPrinciple(selectedPrinciple === p.id ? 'All' : p.id)}
              style={{
                background: selectedPrinciple === p.id ? '#EEF2FF' : '#F8FAFC',
                border: selectedPrinciple === p.id ? '2px solid #4338CA' : '1px solid #E2E8F0',
                padding: '0.75rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#4338CA', fontSize: '0.85rem' }}>{p.id}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>{p.score}%</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.35rem', lineHeight: 1.25, fontWeight: 600 }}>
                {p.name.split(' ')[0]} {p.name.split(' ')[1]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Indicators Table */}
      <div className="group-card">
        <div className="group-card-header">
          <div>
            <h3 className="group-card-title">Mandatory SEBI BRSR Core Disclosures</h3>
            <p className="group-card-subtitle">Values consolidated from 6 subsidiaries across 258 construction and industrial sites</p>
          </div>
          <span className="group-badge-success">8 of 8 Core Parameters Ready</span>
        </div>

        <div className="group-table-container">
          <table className="group-table">
            <thead>
              <tr>
                <th>SEBI Code</th>
                <th>Indicator & Metric</th>
                <th>Principle</th>
                <th>Group Consolidated Total</th>
                <th>Data Completeness</th>
                <th style={{ textAlign: 'right' }}>Auditor Sign-off</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndicators.map(ind => (
                <tr key={ind.code}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4338CA' }}>
                      {ind.code}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{ind.title}</span>
                  </td>
                  <td>
                    <span className="group-badge-neutral">{ind.principle}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#1E293B' }}>{ind.value}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '90px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: ind.readiness, height: '100%', background: '#10B981', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{ind.readiness}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="group-badge-success">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {ind.assurance}
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
