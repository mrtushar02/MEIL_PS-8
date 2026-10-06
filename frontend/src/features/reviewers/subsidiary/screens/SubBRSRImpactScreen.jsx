import React, { useState } from 'react';
import { Target, Layers, CheckCircle2, Clock, Filter } from 'lucide-react';

export default function SubBRSRImpactScreen() {
  const [selectedPrinciple, setSelectedPrinciple] = useState('All');

  const indicators = [
    { code: 'P1_E1', title: 'Climate Risk Governance', tunnels: '42%', water: '18%', energy: '20%', infra: '20%', total: '100%', status: 'Complete', class: 'sub-badge-success' },
    { code: 'P2_E1', title: 'GHG Emissions Reduction', tunnels: '45%', water: '15%', energy: '25%', infra: '15%', total: '100%', status: 'Verified', class: 'sub-badge-success' },
    { code: 'P6_E2', title: 'Energy Intensity & Mix', tunnels: '32%', water: '8%', energy: '48%', infra: '12%', total: '100%', status: 'Verified', class: 'sub-badge-success' },
    { code: 'P6_E3', title: 'Water Stewardship & Sourcing', tunnels: '18%', water: '55%', energy: '12%', infra: '15%', total: '100%', status: 'Complete', class: 'sub-badge-success' },
    { code: 'P6_E4', title: 'Hazardous Waste Management', tunnels: '28%', water: '22%', energy: '30%', infra: '20%', total: '100%', status: 'In Review', class: 'sub-badge-warning' },
    { code: 'P8_S1', title: 'Workforce Welfare & Diversity', tunnels: '35%', water: '25%', energy: '20%', infra: '20%', total: '100%', status: 'Complete', class: 'sub-badge-success' },
    { code: 'P8_S2', title: 'Occupational Health & Safety', tunnels: '30%', water: '28%', energy: '23%', infra: '25%', total: '100%', status: 'Complete', class: 'sub-badge-success' }
  ];

  return (
    <div className="sub-brsr-impact-screen">
      <div className="sub-card">
        <div className="sub-card-header">
          <div>
            <h2 className="sub-card-title">BRSR Indicator Impact Analysis</h2>
            <p className="sub-card-subtitle">
              How each Business Unit contributes to mandatory SEBI BRSR Core disclosures
            </p>
          </div>
          <span className="sub-badge-purple">9 Principles Mapped</span>
        </div>

        <div className="sub-table-container">
          <table className="sub-table">
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Title</th>
                <th>Tunnels BU</th>
                <th>Water BU</th>
                <th>Energy BU</th>
                <th>Infra BU</th>
                <th>Total</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {indicators.map(ind => (
                <tr key={ind.code}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#7C3AED' }}>
                      {ind.code}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{ind.title}</span>
                  </td>
                  <td><span style={{ fontWeight: 600 }}>{ind.tunnels}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{ind.water}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{ind.energy}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{ind.infra}</span></td>
                  <td><strong>{ind.total}</strong></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={ind.class}>{ind.status}</span>
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
