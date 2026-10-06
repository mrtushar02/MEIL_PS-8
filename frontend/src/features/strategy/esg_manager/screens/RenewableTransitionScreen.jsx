import React from 'react';
import { Sun, Wind, Zap, CheckCircle2, Award } from 'lucide-react';

export default function RenewableTransitionScreen() {
  const assets = [
    { name: 'Pavagada Solar Park Captive Block', type: 'Solar PV', capacity: '100 MW', generation: '184 MU / yr', rpoMet: '100%', status: 'Operating' },
    { name: 'Kurnool Wind-Solar Hybrid Feed', type: 'Hybrid', capacity: '50 MW', generation: '92 MU / yr', rpoMet: '100%', status: 'Operating' },
    { name: 'Hyderabad Fabrication Yard Rooftops', type: 'Rooftop Solar', capacity: '12 MW', generation: '16 MU / yr', rpoMet: '85%', status: 'Operating' },
    { name: 'Kaleshwaram Canal-Top Solar Pilot', type: 'Canal Solar', capacity: '25 MW', generation: '38 MU / yr', rpoMet: 'Commissioning', status: 'Near Completion' }
  ];

  return (
    <div className="esg-mgr-renewables">
      <div className="esg-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="esg-mgr-card-title">Clean Power Transition & Captive Generation</h2>
            <p className="esg-mgr-card-subtitle">
              Renewable Purchase Obligation (RPO) compliance, green tariffs, and on-site generation portfolios
            </p>
          </div>
          <span className="esg-mgr-badge-emerald">187 MW Installed Renewable Base</span>
        </div>
      </div>

      <div className="esg-mgr-card">
        <div className="esg-mgr-table-container">
          <table className="esg-mgr-table">
            <thead>
              <tr>
                <th>Generation Asset</th>
                <th>Technology</th>
                <th>Capacity</th>
                <th>Annual Clean Output</th>
                <th>RPO Compliance</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{a.name}</span>
                  </td>
                  <td><span className="esg-mgr-badge-emerald">{a.type}</span></td>
                  <td><span style={{ fontWeight: 700 }}>{a.capacity}</span></td>
                  <td><span style={{ color: '#047857', fontWeight: 600 }}>{a.generation}</span></td>
                  <td><span style={{ color: '#2563EB', fontWeight: 600 }}>{a.rpoMet}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="esg-mgr-badge-emerald">{a.status}</span>
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
