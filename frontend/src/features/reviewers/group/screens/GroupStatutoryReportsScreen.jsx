import React from 'react';
import { Download, FileText, Printer, FileSpreadsheet, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function GroupStatutoryReportsScreen() {
  const reports = [
    {
      id: 'REP-GRP-01',
      title: 'SEBI BRSR Core Enterprise Dossier FY25 Q2',
      framework: 'SEBI Circular 2021 & 2023',
      format: 'PDF + XBRL',
      size: '24.6 MB',
      description: 'Official mandatory filing format covering Group HQ and all 6 subsidiaries with PwC third-party assurance sign-off.',
      ready: true
    },
    {
      id: 'REP-GRP-02',
      title: 'GHG Inventory Scope 1, Scope 2 & Value Chain Scope 3',
      framework: 'GHG Protocol / ISO 14064',
      format: 'Excel / XLSX Data Pack',
      size: '9.2 MB',
      description: 'Granular asset-level emissions calculations with CEA Baseline v19 emission factors across 258 construction sites.',
      ready: true
    },
    {
      id: 'REP-GRP-03',
      title: 'GRI Standards 2021 Universal & Topic Index',
      framework: 'Global Reporting Initiative (GRI)',
      format: 'PDF',
      size: '14.1 MB',
      description: 'Cross-reference index for GRI 302 (Energy), 303 (Water), 305 (Emissions), 306 (Waste), and 403 (OH&S).',
      ready: true
    },
    {
      id: 'REP-GRP-04',
      title: 'TCFD Climate Scenario Analysis & Governance Pack',
      framework: 'Task Force on Climate Financial Disclosures',
      format: 'Executive PDF',
      size: '18.4 MB',
      description: '1.5°C and 3°C climate trajectory modeling, transition risk exposure, and adaptation capital investments.',
      ready: true
    },
    {
      id: 'REP-GRP-05',
      title: 'MEIL Board Audit Committee ESG Memo',
      framework: 'MCA / SEBI LODR 2015',
      format: 'Confidential PDF',
      size: '4.5 MB',
      description: 'Executive briefing for the Board of Directors, independent director sign-off sheet, and ESG rating agency roadmap.',
      ready: true
    }
  ];

  return (
    <div className="group-statutory-reports-screen">
      <div className="group-card" style={{ marginBottom: '1.25rem' }}>
        <div className="group-card-header">
          <div>
            <h2 className="group-card-title">Statutory Regulatory Filings & Enterprise Disclosures</h2>
            <p className="group-card-subtitle">
              Ready-to-file reporting packages compiled in accordance with SEBI, MCA, GRI, and TCFD mandates
            </p>
          </div>
          <span className="group-badge-indigo">
            <ShieldCheck size={14} style={{ display: 'inline', marginRight: '0.2rem' }} />
            XBRL Validated & Digitally Signed
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {reports.map(r => (
          <div key={r.id} className="group-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span className="group-badge-indigo">{r.framework}</span>
                <span className="group-badge-success">{r.format}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.4rem 0' }}>
                {r.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                {r.description}
              </p>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.75rem' }}>
                File Size: {r.size} • Cryptographically Sealed
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
              <button className="group-btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}>
                <Download size={14} /> Download Filing Pack
              </button>
              <button className="group-btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} title="Preview">
                <ExternalLink size={14} />
              </button>
              <button className="group-btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} title="Print / PDF">
                <Printer size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
