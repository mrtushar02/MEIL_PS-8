import React from 'react';
import { Download, Printer, FileText, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BoardDossierExportScreen() {
  const packs = [
    { title: 'MEIL Board Executive ESG Pack FY25 Q2 (Full Dossier)', format: 'Executive PDF + Presentation', size: '28.4 MB', status: 'Ready for Review' },
    { title: 'Statutory SEBI BRSR Board Approval Resolution Memo', format: 'Formal PDF', size: '3.2 MB', status: 'Approved by CSO' },
    { title: 'PwC Independent ESG Assurance Opinion Memo', format: 'Auditor Signed PDF', size: '4.8 MB', status: 'Unqualified Opinion' }
  ];

  return (
    <div className="exec-bd-dossier">
      <div className="exec-bd-card" style={{ marginBottom: '1.25rem' }}>
        <div className="exec-bd-card-header">
          <div>
            <h2 className="exec-bd-card-title">Board of Directors ESG Dossier & Presentation Packs</h2>
            <p className="exec-bd-card-subtitle">
              Official board documentation packages formatted for quarterly governance reviews, investor conferences, and statutory archives
            </p>
          </div>
          <button className="exec-bd-btn-primary">
            <Download size={14} /> Download Entire Board Pack (.zip)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {packs.map((p, idx) => (
          <div key={idx} className="exec-bd-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="exec-bd-badge-slate">{p.format}</span>
                <span className="exec-bd-badge-slate">{p.status}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.4rem 0' }}>{p.title}</h3>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.5rem' }}>Package Size: {p.size}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
              <button className="exec-bd-btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}>
                <Download size={14} /> Download Pack
              </button>
              <button className="exec-bd-btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                <Printer size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
