import React from 'react';
import { Download, Printer, FileText, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';
import esgStore from '../../../../services/esgStore';

export default function BoardDossierExportScreen() {
  const packs = [
    { id: 'DP-01', title: 'MEIL Board Executive ESG Pack FY25 Q2 (Full Dossier)', format: 'Executive PDF + Presentation', size: '28.4 MB', status: 'Ready for Review' },
    { id: 'DP-02', title: 'Statutory SEBI BRSR Board Approval Resolution Memo', format: 'Formal PDF', size: '3.2 MB', status: 'Approved by CSO' },
    { id: 'DP-03', title: 'PwC Independent ESG Assurance Opinion Memo', format: 'Auditor Signed PDF', size: '4.8 MB', status: 'Unqualified Opinion' }
  ];

  const handleDownloadEntirePack = () => {
    exportToCsv('MEIL_Executive_Board_Dossier_Index.csv', packs.map(p => ({
      'Package Code': p.id,
      'Document Title': p.title,
      'Statutory Format': p.format,
      'Package Size': p.size,
      'Board Approval Status': p.status,
      'Attestation Entity': 'Board ESG Committee & Managing Director'
    })));
    esgStore.addAuditLog('EXECUTIVE_DOSSIER_DOWNLOADED', 'Downloaded Full Board Executive ESG Dossier Index', 'EXECUTIVE');
  };

  const handleDownloadPack = (pack) => {
    exportToCsv(`MEIL_${pack.id}_${pack.title.slice(0, 20).replace(/\s+/g, '_')}.csv`, [
      {
        'Dossier Identifier': pack.id,
        'Dossier Title': pack.title,
        'Release Status': pack.status,
        'Format': pack.format,
        'Generated Date': '07 Oct 2026',
        'Authentication Status': 'Board Cryptographically Signed'
      }
    ]);
  };

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
          <button className="exec-bd-btn-primary" onClick={handleDownloadEntirePack}>
            <Download size={14} /> Download Entire Board Pack Index
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
              <button 
                className="exec-bd-btn-primary" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                onClick={() => handleDownloadPack(p)}
              >
                <Download size={14} /> Download Pack
              </button>
              <button 
                className="exec-bd-btn-outline" 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => window.print()}
                title="Print Executive Cover Sheet"
              >
                <Printer size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
