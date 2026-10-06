import React from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default function GapAnalysisScreen() {
  const gaps = [
    { area: 'Supply Chain Scope 3 (Category 1 - Purchased Goods)', requirement: 'SEBI 2025 Value Chain Mandate', status: 'Covered (84.2%)', action: 'Supplier portal onboarded top 500 vendors; ready for 2025 mandate' },
    { area: 'Green Credits & Verified Carbon Offsets', requirement: 'MCA ESG Voluntary Scheme', status: 'In Evaluation', action: 'Draft green credit purchase policy submitted to Board committee' },
    { area: 'Life Cycle Assessment (LCA) Disclosures', requirement: 'Principle 2 Essential Indicator', status: '100% Compliant', action: 'LCA completed for 4 key product & infrastructure construction categories' }
  ];

  return (
    <div className="brsr-mgr-gaps">
      <div className="brsr-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="brsr-mgr-card-header">
          <div>
            <h2 className="brsr-mgr-card-title">Regulatory Gap Analysis & Amendment Impact Desk</h2>
            <p className="brsr-mgr-card-subtitle">
              Preparedness against upcoming SEBI Circular 2025 mandates and global sustainability taxonomy convergence
            </p>
          </div>
          <span className="brsr-mgr-badge-blue">Zero High-Risk Non-Compliance Gaps</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {gaps.map((g, idx) => (
          <div key={idx} className="brsr-mgr-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <div>
                <span className="brsr-mgr-badge-blue" style={{ marginBottom: '0.35rem' }}>{g.requirement}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>{g.area}</h3>
              </div>
              <span className="brsr-mgr-badge-blue">{g.status}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0.4rem 0' }}>
              <strong>Remediation Strategy:</strong> {g.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
