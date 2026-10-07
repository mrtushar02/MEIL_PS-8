import React from 'react';
import { TrendingDown, BarChart2, Layers, Download } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function IntensityModelingScreen() {
  const intensityData = [
    { division: 'Tunnels & Underground Excavation', revenue: '₹ 3,400 Cr', scope1: '14,200 t', scope2: '4,200 t', intensity: '5.41 t / ₹ Cr', waterIntensity: '24.2 m³ / ₹ Cr' },
    { division: 'Water & Lift Irrigation Projects', revenue: '₹ 4,800 Cr', scope1: '8,400 t', scope2: '4,500 t', intensity: '2.68 t / ₹ Cr', waterIntensity: '68.4 m³ / ₹ Cr' },
    { division: 'Thermal & Power Infrastructure', revenue: '₹ 3,200 Cr', scope1: '15,200 t', scope2: '4,300 t', intensity: '6.09 t / ₹ Cr', waterIntensity: '42.1 m³ / ₹ Cr' },
    { division: 'Highways, Bridges & Expressway Packages', revenue: '₹ 5,100 Cr', scope1: '11,400 t', scope2: '1,920 t', intensity: '2.61 t / ₹ Cr', waterIntensity: '18.9 m³ / ₹ Cr' },
    { division: 'Metro Rail & Urban Mass Transit', revenue: '₹ 2,900 Cr', scope1: '6,100 t', scope2: '3,800 t', intensity: '3.41 t / ₹ Cr', waterIntensity: '14.5 m³ / ₹ Cr' }
  ];

  const handleExport = () => {
    exportToCsv('MEIL_Carbon_Intensity_Models.csv', intensityData.map(d => ({
      'Infrastructure Division': d.division,
      'Revenue Turnover': d.revenue,
      'Direct Scope 1': d.scope1,
      'Indirect Scope 2': d.scope2,
      'Carbon Intensity Ratio': d.intensity,
      'Water Intensity Ratio': d.waterIntensity
    })));
  };

  return (
    <div className="esg-ana-intensity">
      <div className="esg-ana-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-ana-card-header">
          <div>
            <h2 className="esg-ana-card-title">Normalized Carbon & Resource Intensity Models</h2>
            <p className="esg-ana-card-subtitle">
              Turnover-adjusted greenhouse gas emissions and water consumption intensity across infrastructure verticals
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span className="esg-ana-badge-cyan">SEBI Core Normalized Metrics</span>
            <button className="esg-ana-btn-primary" onClick={handleExport} style={{ fontSize: '0.8rem' }}>
              <Download size={13} /> Export Intensity Matrix
            </button>
          </div>
        </div>
      </div>

      <div className="esg-ana-card">
        <div className="esg-ana-table-container">
          <table className="esg-ana-table">
            <thead>
              <tr>
                <th>Infrastructure Division</th>
                <th>Revenue Turnover</th>
                <th>Direct Scope 1</th>
                <th>Indirect Scope 2</th>
                <th>Carbon Intensity Ratio</th>
                <th style={{ textAlign: 'right' }}>Water Intensity Ratio</th>
              </tr>
            </thead>
            <tbody>
              {intensityData.map((d, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{d.division}</span>
                  </td>
                  <td><span style={{ fontWeight: 600 }}>{d.revenue}</span></td>
                  <td><span style={{ color: '#475569' }}>{d.scope1}</span></td>
                  <td><span style={{ color: '#475569' }}>{d.scope2}</span></td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0891B2' }}>{d.intensity}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: '#0284C7' }}>{d.waterIntensity}</span>
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
