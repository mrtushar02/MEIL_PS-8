import React from 'react';
import { Briefcase, TrendingUp, ShieldCheck, Award, ArrowRight, Download, FileText } from 'lucide-react';

export default function ExecutiveBoardOverviewScreen({ onNavigate }) {
  const highlights = [
    { metric: 'Consolidated Decarbonization YoY', achievement: '-4.2% Emissions Drop', impact: 'Lowered carbon cost liability under prospective carbon credit mechanism', status: 'Positive' },
    { metric: 'Clean Energy & Renewable Transition', achievement: '38.6% of Total Power', impact: '142 GWh captive generation reducing grid operational power bills', status: 'Ahead of Target' },
    { metric: 'Zero Workplace Fatalities', achievement: '0.08 LTIFR (Zero Fatalities)', impact: 'Across 258 construction sites and 62,000 workforce members', status: 'Exemplary' },
    { metric: 'CSR 2% PAT Statutory Delivery', achievement: '₹ 84.6 Cr Fully Disbursed', impact: '100% compliance with Companies Act 2013 Section 135', status: 'Compliant' }
  ];

  return (
    <div className="exec-bd-overview">
      <div className="exec-bd-stats-grid">
        <div className="exec-bd-stat-card">
          <div className="exec-bd-stat-header">
            <span className="exec-bd-stat-label">Enterprise Turnover</span>
            <Briefcase size={18} color="#1E293B" />
          </div>
          <div className="exec-bd-stat-value">₹ 32,800 Cr</div>
          <span className="exec-bd-stat-subtext">+12.4% Revenue Growth</span>
        </div>

        <div className="exec-bd-stat-card">
          <div className="exec-bd-stat-header">
            <span className="exec-bd-stat-label">Carbon Cost Intensity</span>
            <TrendingUp size={18} color="#059669" />
          </div>
          <div className="exec-bd-stat-value" style={{ color: '#059669' }}>5.61 t / ₹ Cr</div>
          <span className="exec-bd-stat-subtext" style={{ color: '#059669' }}>-18.4% vs FY22 Baseline</span>
        </div>

        <div className="exec-bd-stat-card">
          <div className="exec-bd-stat-header">
            <span className="exec-bd-stat-label">Statutory Compliance</span>
            <ShieldCheck size={18} color="#2563EB" />
          </div>
          <div className="exec-bd-stat-value">100% Clean</div>
          <span className="exec-bd-stat-subtext" style={{ color: '#2563EB' }}>Zero Notices or Penalties</span>
        </div>

        <div className="exec-bd-stat-card">
          <div className="exec-bd-stat-header">
            <span className="exec-bd-stat-label">ESG Rating Standing</span>
            <Award size={18} color="#1E293B" />
          </div>
          <div className="exec-bd-stat-value">MSCI: BBB</div>
          <span className="exec-bd-stat-subtext">Projected 'A' by FY25</span>
        </div>
      </div>

      <div className="exec-bd-card">
        <div className="exec-bd-card-header">
          <div>
            <h2 className="exec-bd-card-title">C-Suite & Board Strategic ESG Performance Summary</h2>
            <p className="exec-bd-card-subtitle">
              High-level synthesis for the Board of Directors, Managing Director, and Chief Financial Officer
            </p>
          </div>
          <button className="exec-bd-btn-primary" onClick={() => onNavigate && onNavigate('dossier')}>
            <FileText size={14} /> View Board Pack
          </button>
        </div>

        <div className="exec-bd-table-container">
          <table className="exec-bd-table">
            <thead>
              <tr>
                <th>Strategic Performance Dimension</th>
                <th>Quarterly Key Achievement</th>
                <th>Enterprise Value & Shareholder Impact</th>
                <th style={{ textAlign: 'right' }}>Performance Status</th>
              </tr>
            </thead>
            <tbody>
              {highlights.map((h, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{h.metric}</span>
                  </td>
                  <td><span style={{ fontWeight: 700, color: '#047857' }}>{h.achievement}</span></td>
                  <td><span style={{ color: '#475569' }}>{h.impact}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="exec-bd-badge-slate">{h.status}</span>
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
