import React from 'react';
import { Download, Printer, FileText, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';
import { downloadGenericPDF } from '../../../../utils/pdfGenerator';
import esgStore from '../../../../services/esgStore';

export default function BoardDossierExportScreen() {
  const packs = [
    { id: 'DP-01', title: 'MEIL Board Executive ESG Pack FY25 Q2 (Full Dossier)', format: 'Executive PDF + Presentation', size: '28.4 MB', status: 'Ready for Review' },
    { id: 'DP-02', title: 'Statutory SEBI BRSR Board Approval Resolution Memo', format: 'Formal PDF', size: '3.2 MB', status: 'Approved by CSO' },
    { id: 'DP-03', title: 'PwC Independent ESG Assurance Opinion Memo', format: 'Auditor Signed PDF', size: '4.8 MB', status: 'Unqualified Opinion' }
  ];

  const handleDownloadEntirePack = () => {
    downloadGenericPDF({
      title: 'MEIL BOARD EXECUTIVE ESG DOSSIER INDEX',
      filename: 'MEIL_Executive_Board_Dossier_Index.pdf',
      lines: [
        'MEGHA ENGINEERING & INFRASTRUCTURES LIMITED — EXECUTIVE BOARD DOSSIER',
        'Official Compilation for the Board of Directors & Statutory Audit Committee',
        '---------------------------------------------------------------------------------',
        '1. Package DP-01: MEIL Board Executive ESG Pack FY25 Q2 (Full Dossier) · 28.4 MB · Ready for Review',
        '2. Package DP-02: Statutory SEBI BRSR Board Approval Resolution Memo · 3.2 MB · Approved by CSO',
        '3. Package DP-03: PwC Independent ESG Assurance Opinion Memo · 4.8 MB · Unqualified Opinion',
        '---------------------------------------------------------------------------------',
        'Attestation Entity: Board ESG Committee & Managing Director',
        'Statutory Mandate: SEBI LODR Regulation 34(3) & BRSR Core Reasonable Assurance',
        'Authentication Status: Board Cryptographically Signed & Timestamped'
      ],
      details: { sha256: 'sha256:91bf78e234c90ab12f45d678e90a12b34c56d78e' }
    });
    esgStore.addAuditLog('EXECUTIVE_DOSSIER_DOWNLOADED', 'Downloaded Full Board Executive ESG Dossier Index', 'EXECUTIVE');
  };

  const handleDownloadPack = (pack) => {
    downloadGenericPDF({
      title: pack.title,
      filename: `${pack.id}_${pack.title.slice(0, 20).replace(/\s+/g, '_')}.pdf`,
      lines: [
        `Dossier Package Code: ${pack.id}`,
        `Document Title: ${pack.title}`,
        `Statutory Format: ${pack.format}`,
        `Package Size: ${pack.size}`,
        `Board Approval Status: ${pack.status}`,
        '---------------------------------------------------------------------------------',
        'STATUTORY EXECUTIVE MEMORANDUM & RESOLUTION',
        'This dossier contains the approved ESG key performance indicators, GHG emissions inventory,',
        'and corporate assurance assessments prepared for the Megha Engineering & Infrastructures Ltd Board.',
        '---------------------------------------------------------------------------------',
        'Governing Standards: SEBI Circular SEBI/HO/CFD/CMD-2/P/CIR/2021/562, ICAI SAE 3410.',
        'Official Seal: Ratified by Managing Director & Board Sustainability Committee.'
      ],
      details: { sha256: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
    });
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
