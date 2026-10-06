import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function StatutoryRiskSummaryScreen() {
  const risks = [
    { risk: 'European Carbon Border Adjustment Mechanism (CBAM)', probability: 'High', financialExposure: '₹ 45 Cr', boardMitigation: 'Long-term low carbon electric arc steel off-take contracts negotiated.' },
    { risk: 'Central Ground Water Authority (CGWA) Abstraction Quota', probability: 'Medium', financialExposure: '₹ 30 Cr', boardMitigation: '100% STP treated effluent recycling in road compaction.' },
    { risk: 'Extreme Weather Induced Himalayan Site Disruption', probability: 'Medium', financialExposure: '₹ 80 Cr', boardMitigation: 'Early warning automated radar warning & dewatering systems deployed.' }
  ];

  return (
    <div className="exec-bd-risks">
      <div className="exec-bd-card" style={{ marginBottom: '1.25rem' }}>
        <div className="exec-bd-card-header">
          <div>
            <h2 className="exec-bd-card-title">Enterprise Climate & Statutory Liability Risk Briefing</h2>
            <p className="exec-bd-card-subtitle">
              Financial quantification of top ESG and environmental compliance risks submitted to Board Audit & Risk Committee
            </p>
          </div>
          <span className="exec-bd-badge-slate">Zero Unmitigated Red Flags</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {risks.map((r, idx) => (
          <div key={idx} className="exec-bd-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <div>
                <span className="exec-bd-badge-slate" style={{ marginBottom: '0.35rem' }}>Exposure: {r.financialExposure}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>{r.risk}</h3>
              </div>
              <span className="exec-bd-badge-slate">Probability: {r.probability}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0.4rem 0' }}>
              <strong>Board Approved Control:</strong> {r.boardMitigation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
