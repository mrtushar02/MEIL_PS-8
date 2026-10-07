import React, { useState } from 'react';
import { Search, Filter, Download, Database, CheckCircle2 } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function AuditQueryWorkbenchScreen() {
  const [query, setQuery] = useState('');

  const records = [
    { id: 'REC-ING-901', site: 'Zojila Tunnel Site', fuelType: 'Diesel (HSD)', quantity: '42,500 L', calcEmission: '114.19 tCO2e', factorApplied: '2.687 kg/L', auditPassed: 'Yes' },
    { id: 'REC-ING-902', site: 'Rohtang Pass Tunnel Site', fuelType: 'Grid Electricity', quantity: '184,000 kWh', calcEmission: '131.74 tCO2e', factorApplied: '0.716 kg/kWh', auditPassed: 'Yes' },
    { id: 'REC-ING-903', site: 'Ramagundam STPP Unit 4', fuelType: 'Bituminous Coal', quantity: '14,200 MT', calcEmission: '34,220 tCO2e', factorApplied: '2.410 t/MT', auditPassed: 'Yes' },
    { id: 'REC-ING-904', site: 'Kaleshwaram Lift Irrig.', fuelType: 'Canal Raw Water', quantity: '480,000 kL', calcEmission: 'Zero CO2 (Direct)', factorApplied: '1.00 m³/kL', auditPassed: 'Yes' },
    { id: 'REC-ING-905', site: 'Ganga Expressway Pkg 3', fuelType: 'Lube Oil Waste', quantity: '18,400 L', calcEmission: '42.1 tCO2e (Waste)', factorApplied: '2.288 kg/L', auditPassed: 'Yes' }
  ];

  const filtered = records.filter(r => 
    r.id.toLowerCase().includes(query.toLowerCase()) ||
    r.site.toLowerCase().includes(query.toLowerCase()) ||
    r.fuelType.toLowerCase().includes(query.toLowerCase()) ||
    r.factorApplied.toLowerCase().includes(query.toLowerCase())
  );

  const handleExport = () => {
    exportToCsv('MEIL_Auditor_Deep_Query_Records.csv', filtered.map(r => ({
      'Record ID': r.id,
      'Construction Site': r.site,
      'Activity / Fuel Type': r.fuelType,
      'Raw Ingested Quantity': r.quantity,
      'Calculated Emission': r.calcEmission,
      'CEA / Factor Applied': r.factorApplied,
      'Audit Status': r.auditPassed
    })));
  };

  return (
    <div className="esg-ana-workbench">
      <div className="esg-ana-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-ana-card-header">
          <div>
            <h2 className="esg-ana-card-title">Auditor Data Query & Deep Drill-Down Workbench</h2>
            <p className="esg-ana-card-subtitle">
              Interactive granular query tool to inspect raw activity quantities, applied factor hashes, and calculation outputs
            </p>
          </div>
          <button className="esg-ana-btn-primary" onClick={handleExport}>
            <Download size={14} /> Export Query Results (CSV)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.4rem 0.8rem', flex: 1 }}>
            <Search size={16} color="#64748B" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search site, fuel type, activity ID..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem' }}
            />
          </div>
        </div>
      </div>

      <div className="esg-ana-card">
        <div className="esg-ana-table-container">
          <table className="esg-ana-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Construction Site</th>
                <th>Activity / Fuel Type</th>
                <th>Raw Ingested Quantity</th>
                <th>Calculated Emission</th>
                <th>CEA / Factor Applied</th>
                <th style={{ textAlign: 'right' }}>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0891B2' }}>{r.id}</span>
                  </td>
                  <td><span style={{ fontWeight: 600, color: '#0F172A' }}>{r.site}</span></td>
                  <td><span style={{ color: '#475569' }}>{r.fuelType}</span></td>
                  <td><span style={{ fontWeight: 700 }}>{r.quantity}</span></td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#047857' }}>{r.calcEmission}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748B' }}>{r.factorApplied}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="esg-ana-badge-cyan">{r.auditPassed}</span>
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
