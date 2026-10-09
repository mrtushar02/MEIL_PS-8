import React from 'react';
import { Award, ShieldCheck, Download, FileText, CheckCircle2, Printer } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';
import { downloadGenericPDF } from '../../../../utils/pdfGenerator';

export default function AssuranceOpinionScreen() {
  const handleDownloadMemo = () => {
    downloadGenericPDF({
      title: 'INDEPENDENT AUDITOR ASSURANCE OPINION STATEMENT',
      filename: 'MEIL_PwC_Assurance_Opinion_Statement.pdf',
      lines: [
        'INDEPENDENT REASONABLE & LIMITED ASSURANCE REPORT',
        'To the Board of Directors & Shareholders of Megha Engineering & Infrastructures Ltd (MEIL)',
        '---------------------------------------------------------------------------------',
        '1. SCOPE OF ASSURANCE ENGAGEMENT',
        'We have conducted our assurance engagement in accordance with the International Standard on Assurance',
        'Engagements (ISAE) 3000 (Revised) and the ICAI Standard on Assurance Engagements (SAE) 3410,',
        'Assurance Engagements on Greenhouse Gas Statements, issued by the Institute of Chartered Accountants of India.',
        '---------------------------------------------------------------------------------',
        '2. VERIFIED STATUTORY GREENHOUSE GAS EMISSIONS (BRSR CORE)',
        '• Scope 1 Direct Emissions Verified: 112,400 tCO2e (Reasonable Assurance)',
        '• Scope 2 Indirect Grid Emissions Verified: 71,850 tCO2e (Reasonable Assurance)',
        '• Calculation Baseline Criteria: GHG Protocol Corporate Standard & CEA CO2 Baseline Database v19',
        '---------------------------------------------------------------------------------',
        '3. UNQUALIFIED CLEAN ASSURANCE CONCLUSION',
        'In our opinion, in all material respects, the Subject Matter Information for FY 2025-26 Q2 has been',
        'prepared in accordance with SEBI BRSR Core criteria and NGRBC guidelines.',
        '---------------------------------------------------------------------------------',
        'Auditor Practitioner: R. Singhania, Senior Partner (Membership #084920), PricewaterhouseCoopers LLP',
        'Digital Signature: Authenticated with DSC Class-3 · ICAI UDIN: 26084920AAAAAB9821'
      ],
      details: { sha256: 'sha256:8891bf2e45a0b3c7d6e5f4a3b2c1d0e9f8a7b6c5' }
    });
  };

  return (
    <div className="audit-usr-opinion">
      <div className="audit-usr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="audit-usr-card-header">
          <div>
            <h2 className="audit-usr-card-title">Independent Assurance Practitioner's Statement</h2>
            <p className="audit-usr-card-subtitle">
              Official engagement opinion issued in terms of ISAE 3410 and ISAE 3000 (Revised) for SEBI BRSR Core disclosures
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="audit-usr-btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => window.print()}>
              <Printer size={14} /> Print Statement
            </button>
            <button className="audit-usr-btn-primary" onClick={handleDownloadMemo}>
              <Download size={14} /> Download Signed Opinion Memo
            </button>
          </div>
        </div>
      </div>

      <div className="audit-usr-card" style={{ background: '#FFFBEB', borderColor: '#FDE68A', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Award size={28} color="#B45309" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#78350F', margin: 0 }}>
              Independent Reasonable & Limited Assurance Report
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 600 }}>
              To the Board of Directors of Megha Engineering and Infrastructures Limited (MEIL)
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>
            We have undertaken a reasonable assurance engagement on the accompanying Scope 1 and Scope 2 Greenhouse Gas (GHG) emissions data, and a limited assurance engagement on selected BRSR Core Indicators of Megha Engineering and Infrastructures Limited for the period ending 30 September 2024.
          </p>
          <p>
            <strong>Auditor Conclusion:</strong> In our opinion, the consolidated Greenhouse Gas statement for Scope 1 (112,400 tCO2e) and Scope 2 (71,850 tCO2e) is prepared, in all material respects, in accordance with the GHG Protocol Corporate Standard and the baseline calculation criteria of the Central Electricity Authority (CEA Baseline v19).
          </p>
          <div style={{ borderTop: '1px solid #FDE68A', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#78350F' }}>For PricewaterhouseCoopers LLP</div>
              <div style={{ fontSize: '0.8rem', color: '#92400E' }}>Chartered Accountants • Firm Reg #012754N</div>
              <div style={{ fontSize: '0.8rem', color: '#92400E' }}>R. Singhania, Partner (Membership #084920)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="audit-usr-badge-amber">
                <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                Signed with Digital Token DSC Class-3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
