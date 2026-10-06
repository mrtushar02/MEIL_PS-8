import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileCheck, UserCheck, Search, Filter, ExternalLink } from 'lucide-react';

export default function GroupAssuranceCenterScreen() {
  const [filterStatus, setFilterStatus] = useState('All');

  const auditPackages = [
    { id: 'AUD-01', scope: 'Scope 1 & 2 GHG Emissions', standard: 'ISAE 3410 / ASAE 3410', samples: '142 of 142 Sites', partner: 'PwC Climate Team', status: 'Assurance Granted', opinion: 'Reasonable Assurance' },
    { id: 'AUD-02', scope: 'Scope 3 Supply Chain Footprint', standard: 'ISO 14064-3', samples: '48 of 60 Suppliers', partner: 'PwC Climate Team', status: 'Assurance Granted', opinion: 'Limited Assurance' },
    { id: 'AUD-03', scope: 'Water Withdrawal & Consumption', standard: 'ISAE 3000 (Revised)', samples: '82 of 88 Meters', partner: 'PwC ESG Assurance', status: 'Assurance Granted', opinion: 'Reasonable Assurance' },
    { id: 'AUD-04', scope: 'Occupational Health & Safety (LTIFR)', standard: 'ISAE 3000 (Revised)', samples: '258 of 258 Logs', partner: 'TUV Nord Auditor', status: 'Assurance Granted', opinion: 'Reasonable Assurance' },
    { id: 'AUD-05', scope: 'Hazardous Waste Manifest & Disposal', standard: 'CPCB Protocol', samples: '184 of 190 Form-10s', partner: 'PwC ESG Assurance', status: 'Under Final Review', opinion: 'Pending Stamp' },
    { id: 'AUD-06', scope: 'CSR 2% PAT Expenditure Compliance', standard: 'ICAI Technical Guide', samples: '100% Transactions', partner: 'Statutory Audit Partner', status: 'Assurance Granted', opinion: 'Reasonable Assurance' }
  ];

  return (
    <div className="group-assurance-center">
      {/* Top Banner */}
      <div className="group-card" style={{ marginBottom: '1.25rem' }}>
        <div className="group-card-header">
          <div>
            <h2 className="group-card-title">Independent Third-Party Assurance Center</h2>
            <p className="group-card-subtitle">
              Engagement partner: PricewaterhouseCoopers (PwC) • SEBI BRSR Core Reasonable & Limited Assurance
            </p>
          </div>
          <span className="group-badge-success" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
            <ShieldCheck size={16} style={{ display: 'inline', marginRight: '0.3rem' }} />
            426 of 472 Evidence Items Verified (90.3% Assured)
          </span>
        </div>

        {/* Assurance Metrics */}
        <div className="group-stats-grid" style={{ marginBottom: 0, marginTop: '1rem' }}>
          <div className="group-stat-card">
            <span className="group-stat-label">Assurance Partner</span>
            <div className="group-stat-value" style={{ fontSize: '1.25rem', color: '#4338CA' }}>PwC ESG India</div>
            <span className="group-stat-subtext">Senior Lead: R. Singhania, FCA</span>
          </div>

          <div className="group-stat-card">
            <span className="group-stat-label">Standards Applied</span>
            <div className="group-stat-value" style={{ fontSize: '1.25rem' }}>ISAE 3410 / 3000</div>
            <span className="group-stat-subtext">SEBI Mandated Global Standard</span>
          </div>

          <div className="group-stat-card">
            <span className="group-stat-label">Materiality Threshold</span>
            <div className="group-stat-value" style={{ fontSize: '1.25rem', color: '#059669' }}>5.0% Scope</div>
            <span className="group-stat-subtext">Actual variance 1.1% (Passed)</span>
          </div>

          <div className="group-stat-card">
            <span className="group-stat-label">Assurance Statement</span>
            <div className="group-stat-value" style={{ fontSize: '1.25rem', color: '#059669' }}>Clean Opinion</div>
            <span className="group-stat-subtext">Unqualified Assurance Memo</span>
          </div>
        </div>
      </div>

      {/* Assurance Packages Table */}
      <div className="group-card">
        <div className="group-card-header">
          <div>
            <h3 className="group-card-title">Assurance Workstreams & Sample Testing</h3>
            <p className="group-card-subtitle">Verification scope by ESG parameter and audit standard</p>
          </div>
        </div>

        <div className="group-table-container">
          <table className="group-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>ESG Assurance Scope</th>
                <th>Standard Applied</th>
                <th>Sample Testing Rate</th>
                <th>Assurance Opinion</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditPackages.map(pkg => (
                <tr key={pkg.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4338CA' }}>{pkg.id}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{pkg.scope}</span>
                  </td>
                  <td>
                    <span className="group-badge-neutral">{pkg.standard}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{pkg.samples}</span>
                  </td>
                  <td>
                    <span className="group-badge-indigo">{pkg.opinion}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={pkg.status === 'Assurance Granted' ? 'group-badge-success' : 'group-badge-warning'}>
                      {pkg.status}
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
