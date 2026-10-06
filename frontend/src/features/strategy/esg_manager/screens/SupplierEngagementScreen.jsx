import React from 'react';
import { Truck, CheckCircle2, AlertTriangle, ShieldCheck, Search, Filter } from 'lucide-react';

export default function SupplierEngagementScreen() {
  const suppliers = [
    { name: 'Tata Steel Limited', category: 'Reinforcement Steel', scope: 'Scope 3 Category 1', rating: 'A (Leader)', decarbonizationScore: '88%', audited: 'Yes' },
    { name: 'UltraTech Cement Ltd', category: 'Portland Pozzolana Cement', scope: 'Scope 3 Category 1', rating: 'A (Leader)', decarbonizationScore: '84%', audited: 'Yes' },
    { name: 'Jindal Steel & Power', category: 'Structural Steel', scope: 'Scope 3 Category 1', rating: 'B (Developing)', decarbonizationScore: '72%', audited: 'Yes' },
    { name: 'Bharat Petroleum (BPCL)', category: 'High Speed Diesel', scope: 'Scope 1 Fuel', rating: 'A (Leader)', decarbonizationScore: '80%', audited: 'Yes' },
    { name: 'TransIndia Freight Logistics', category: 'Heavy Equipment Transport', scope: 'Scope 3 Category 4', rating: 'C (Needs Rework)', decarbonizationScore: '54%', audited: 'In Review' }
  ];

  return (
    <div className="esg-mgr-suppliers">
      <div className="esg-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="esg-mgr-card-title">Scope 3 Value Chain & Supplier ESG Ratings</h2>
            <p className="esg-mgr-card-subtitle">
              Audited upstream supply chain carbon footprints, supplier Code of Conduct sign-offs, and green procurement ratings
            </p>
          </div>
          <span className="esg-mgr-badge-emerald">Top 500 Vendors Scored</span>
        </div>
      </div>

      <div className="esg-mgr-card">
        <div className="esg-mgr-table-container">
          <table className="esg-mgr-table">
            <thead>
              <tr>
                <th>Key Supplier Entity</th>
                <th>Material / Service</th>
                <th>GHG Scope Category</th>
                <th>ESG Rating</th>
                <th>Decarbonization Index</th>
                <th style={{ textAlign: 'right' }}>Third-Party Verification</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.name}</span>
                  </td>
                  <td><span style={{ color: '#475569' }}>{s.category}</span></td>
                  <td><span className="esg-mgr-badge-emerald">{s.scope}</span></td>
                  <td><span style={{ fontWeight: 800, color: s.rating.startsWith('A') ? '#047857' : '#D97706' }}>{s.rating}</span></td>
                  <td><span style={{ fontWeight: 700 }}>{s.decarbonizationScore}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={s.audited === 'Yes' ? 'esg-mgr-badge-emerald' : 'esg-mgr-badge-neutral'}>{s.audited}</span>
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
