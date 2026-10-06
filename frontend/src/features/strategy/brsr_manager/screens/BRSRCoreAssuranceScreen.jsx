import React from 'react';
import { Award, ShieldCheck, CheckCircle2, FileText, Download } from 'lucide-react';

export default function BRSRCoreAssuranceScreen() {
  const coreKpis = [
    { code: 'P1_E1', indicator: 'Greenhouse Gas Scope 1 Direct Emissions', value: '112,400 tCO2e', auditStandard: 'ISAE 3410', assurance: 'Reasonable Assurance', status: 'PwC Verified' },
    { code: 'P2_E1', indicator: 'Greenhouse Gas Scope 2 Grid Emissions', value: '71,850 tCO2e', auditStandard: 'ISAE 3410', assurance: 'Reasonable Assurance', status: 'PwC Verified' },
    { code: 'P6_E2', indicator: 'Energy Intensity & Mix Ratio', value: '38.6% Renewable', auditStandard: 'ISAE 3000', assurance: 'Reasonable Assurance', status: 'PwC Verified' },
    { code: 'P6_E3', indicator: 'Water Withdrawal, Consumption & Intensity', value: '42.1 m³ / ₹ Cr', auditStandard: 'ISAE 3000', assurance: 'Reasonable Assurance', status: 'PwC Verified' },
    { code: 'P6_E4', indicator: 'Hazardous Waste Generated & Disposed', value: '4,280 MT (100% Tracked)', auditStandard: 'ISAE 3000', assurance: 'Reasonable Assurance', status: 'PwC Verified' },
    { code: 'P8_S1', indicator: 'Permanent Women Workforce & Median Pay', value: '1:1 Gender Pay Ratio', auditStandard: 'ISAE 3000', assurance: 'Limited Assurance', status: 'Verified' },
    { code: 'P8_S2', indicator: 'Lost Time Injury Frequency Rate (LTIFR)', value: '0.08 per mn hours', auditStandard: 'ISAE 3000', assurance: 'Reasonable Assurance', status: 'TUV Verified' }
  ];

  return (
    <div className="brsr-mgr-core">
      <div className="brsr-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="brsr-mgr-card-header">
          <div>
            <h2 className="brsr-mgr-card-title">SEBI BRSR Core Mandatory Assurance Indicators (Circular 2023)</h2>
            <p className="brsr-mgr-card-subtitle">
              All 9 quantitative ESG parameters requiring mandatory third-party independent assurance before SEBI filing
            </p>
          </div>
          <span className="brsr-mgr-badge-blue">
            <ShieldCheck size={14} style={{ display: 'inline', marginRight: '0.2rem' }} />
            100% Assurance Signed
          </span>
        </div>
      </div>

      <div className="brsr-mgr-card">
        <div className="brsr-mgr-table-container">
          <table className="brsr-mgr-table">
            <thead>
              <tr>
                <th>Indicator Code</th>
                <th>Core Metric Description</th>
                <th>Group Audited Total</th>
                <th>Assurance Standard</th>
                <th>Assurance Scope</th>
                <th style={{ textAlign: 'right' }}>Auditor Verification</th>
              </tr>
            </thead>
            <tbody>
              {coreKpis.map(k => (
                <tr key={k.code}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563EB' }}>{k.code}</span>
                  </td>
                  <td><span style={{ fontWeight: 700, color: '#0F172A' }}>{k.indicator}</span></td>
                  <td><span style={{ fontWeight: 800, color: '#047857' }}>{k.value}</span></td>
                  <td><span className="brsr-mgr-badge-blue">{k.auditStandard}</span></td>
                  <td><span style={{ color: '#334155', fontWeight: 600 }}>{k.assurance}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="brsr-mgr-badge-blue">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {k.status}
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
