import React, { useState } from 'react';
import { Database, Search, Filter, ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function EmissionFactorStudioScreen() {
  const [searchTerm, setSearchTerm] = useState('');

  const factors = [
    { code: 'EF-GRID-01', name: 'Indian National Grid Average', value: '0.716', unit: 'kg CO2e / kWh', authority: 'Central Electricity Authority (CEA) v19', year: '2024', status: 'Official Baseline' },
    { code: 'EF-DIESEL-01', name: 'High Speed Diesel (HSD) Combustion', value: '2.687', unit: 'kg CO2e / Liter', authority: 'IPCC AR6 Guidelines', year: '2023', status: 'Official Baseline' },
    { code: 'EF-PETROL-01', name: 'Motor Spirit (Petrol) Combustion', value: '2.314', unit: 'kg CO2e / Liter', authority: 'IPCC AR6 Guidelines', year: '2023', status: 'Official Baseline' },
    { code: 'EF-LPG-01', name: 'Liquefied Petroleum Gas (LPG)', value: '1.512', unit: 'kg CO2e / kg', authority: 'IPCC AR6 Guidelines', year: '2023', status: 'Official Baseline' },
    { code: 'EF-STEEL-01', name: 'Primary Blast Furnace Steel', value: '1.850', unit: 't CO2e / MT', authority: 'WorldSteel EPD Database', year: '2024', status: 'Value Chain' },
    { code: 'EF-CEMENT-01', name: 'Portland Slag Cement (PSC)', value: '0.510', unit: 't CO2e / MT', authority: 'CII Sohrabji Godrej Green Centre', year: '2024', status: 'Value Chain' }
  ];

  const filtered = factors.filter(f => 
    f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv('MEIL_Emission_Factor_Master.csv', filtered.map(f => ({
      'Factor Code': f.code,
      'Activity Description': f.name,
      'Factor Value': f.value,
      'Standard Unit': f.unit,
      'Authoritative Source': f.authority,
      'Year': f.year,
      'Status': f.status
    })));
  };

  return (
    <div className="esg-ana-factors">
      <div className="esg-ana-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-ana-card-header">
          <div>
            <h2 className="esg-ana-card-title">Emission Factor Master Database & Version Registry</h2>
            <p className="esg-ana-card-subtitle">
              Centralized library of audited emission coefficients mapped to GHG Protocol Scope 1, 2, and 3 activities
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span className="esg-ana-badge-cyan">
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '0.2rem' }} />
              CEA Baseline v19 Verified
            </span>
            <button className="esg-ana-btn-primary" onClick={handleExport} style={{ fontSize: '0.8rem' }}>
              <Download size={13} /> Export Factors
            </button>
          </div>
        </div>

        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.4rem 0.8rem' }}>
          <Search size={15} color="#64748B" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search emission factor code, activity, or regulatory authority..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
          />
        </div>
      </div>

      <div className="esg-ana-card">
        <div className="esg-ana-table-container">
          <table className="esg-ana-table">
            <thead>
              <tr>
                <th>Factor Code</th>
                <th>Activity Description</th>
                <th>Factor Value</th>
                <th>Standard Unit</th>
                <th>Authoritative Source</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.code}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0891B2' }}>{f.code}</span>
                  </td>
                  <td><span style={{ fontWeight: 700, color: '#0F172A' }}>{f.name}</span></td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#047857' }}>{f.value}</span>
                  </td>
                  <td><span style={{ color: '#475569' }}>{f.unit}</span></td>
                  <td><span style={{ fontSize: '0.8rem', color: '#334155' }}>{f.authority} ({f.year})</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="esg-ana-badge-cyan">{f.status}</span>
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
