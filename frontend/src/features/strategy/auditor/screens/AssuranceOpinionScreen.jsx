import React from 'react';
import { Award, ShieldCheck, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function AssuranceOpinionScreen() {
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
          <button className="audit-usr-btn-primary">
            <Download size={14} /> Download Signed Opinion Memo (PDF)
          </button>
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
