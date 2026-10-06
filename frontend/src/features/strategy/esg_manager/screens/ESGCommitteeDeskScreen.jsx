import React from 'react';
import { Users, FileText, Calendar, CheckCircle2, Download } from 'lucide-react';

export default function ESGCommitteeDeskScreen() {
  const meetings = [
    { date: '18 Oct 2024', title: 'Q2 FY25 Board ESG Committee Review', chair: 'Justice (Retd.) K. Rao (Independent Director)', agenda: 'BRSR Core readiness, Scope 3 supply chain baseline, CSR ₹84.6 Cr disbursement', status: 'Completed & Signed' },
    { date: '12 Jul 2024', title: 'Q1 FY25 Board ESG Committee Review', chair: 'Justice (Retd.) K. Rao', agenda: 'GHG v19 recalculation, TCFD scenario analysis, ZLD water recycling compliance', status: 'Minutes Filed' },
    { date: '25 Nov 2024 (Upcoming)', title: 'Special Strategy Session: Hydrogen & CBAM', chair: 'Board Chairman & MD', agenda: 'European CBAM carbon border tax risk mitigation, green fleet expansion capex', status: 'Scheduled' }
  ];

  return (
    <div className="esg-mgr-committee">
      <div className="esg-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="esg-mgr-card-title">Board ESG Committee Governance Desk</h2>
            <p className="esg-mgr-card-subtitle">
              Board oversight meeting records, resolutions, approved sustainability policies, and quarterly briefings
            </p>
          </div>
          <button className="esg-mgr-btn-primary">
            <FileText size={14} /> New Committee Memo
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {meetings.map((m, idx) => (
          <div key={idx} className="esg-mgr-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Calendar size={14} color="#047857" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857' }}>{m.date}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{m.title}</h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Chairperson: {m.chair}</div>
              </div>
              <span className="esg-mgr-badge-emerald">{m.status}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0.5rem 0' }}>
              <strong>Agenda & Resolutions:</strong> {m.agenda}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="esg-mgr-btn-outline" style={{ fontSize: '0.78rem' }}>
                <Download size={13} /> Download Minutes & Board Memo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
