import React from 'react';
import { DollarSign, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export default function CapitalAllocationScreen() {
  const allocations = [
    { program: 'Captive Solar & Wind Farm Development', budgeted: '₹ 180 Cr', deployed: '₹ 142 Cr (78%)', roeiTarget: '14.2% IRR', esgPayoff: '-48,500 tCO2e/yr avoided' },
    { program: 'Olectra EV Tipper & Machinery Electrification', budgeted: '₹ 120 Cr', deployed: '₹ 86 Cr (71%)', roeiTarget: '18.1% Operating Savings', esgPayoff: '-22,000 tCO2e/yr diesel offset' },
    { program: 'Sewage Treatment & Zero Liquid Discharge Plants', budgeted: '₹ 65 Cr', deployed: '₹ 58 Cr (89%)', roeiTarget: 'Compliance Mandate', esgPayoff: '68.2% total water circularity' },
    { program: 'Smart IoT Continuous Emissions & Flow Telemetry', budgeted: '₹ 25 Cr', deployed: '₹ 22 Cr (88%)', roeiTarget: 'Real-time Audit Trail', esgPayoff: 'Zero manual estimation error' },
    { program: 'Community Health, Skilling & CSR Schedule VII', budgeted: '₹ 85 Cr', deployed: '₹ 84.6 Cr (99%)', roeiTarget: 'Social License to Operate', esgPayoff: '100% 2% PAT Statutory Delivery' }
  ];

  return (
    <div className="exec-bd-capex">
      <div className="exec-bd-card" style={{ marginBottom: '1.25rem' }}>
        <div className="exec-bd-card-header">
          <div>
            <h2 className="exec-bd-card-title">Sustainable Green Capex & Capital Allocation Portfolio</h2>
            <p className="exec-bd-card-subtitle">
              Return on Sustainability Investment (ROSI) analysis and capital deployment across decarbonization assets
            </p>
          </div>
          <span className="exec-bd-badge-slate">Total Green Capex: ₹ 475 Cr Budgeted</span>
        </div>
      </div>

      <div className="exec-bd-card">
        <div className="exec-bd-table-container">
          <table className="exec-bd-table">
            <thead>
              <tr>
                <th>Green Capital Program</th>
                <th>Budgeted Allocation</th>
                <th>Capital Deployed</th>
                <th>Target Financial ROI / IRR</th>
                <th style={{ textAlign: 'right' }}>Quantified ESG Payoff</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{a.program}</span>
                  </td>
                  <td><span style={{ fontWeight: 600 }}>{a.budgeted}</span></td>
                  <td><span style={{ fontWeight: 700, color: '#047857' }}>{a.deployed}</span></td>
                  <td><span style={{ color: '#2563EB', fontWeight: 600 }}>{a.roeiTarget}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: '#0891B2' }}>{a.esgPayoff}</span>
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
