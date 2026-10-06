import React from 'react';
import { BarChart3, TrendingDown, Layers, Zap, Flame, Droplets, ArrowUpRight } from 'lucide-react';

export default function GroupAnalyticsScreen() {
  const benchmarks = [
    { name: 'Megha Hydro & Infrastructure', revenue: '₹ 8,400 Cr', scope12: '64,120 t', intensity: '7.63 t / ₹ Cr', renewable: '32%', water: '48.2 m³' },
    { name: 'Megha City Gas & Distribution', revenue: '₹ 4,200 Cr', scope12: '22,450 t', intensity: '5.34 t / ₹ Cr', renewable: '28%', water: '14.1 m³' },
    { name: 'Megha Solar & Clean Energy', revenue: '₹ 3,800 Cr', scope12: '8,920 t', intensity: '2.35 t / ₹ Cr', renewable: '94%', water: '8.4 m³' },
    { name: 'Megha Electric Mobility (Olectra)', revenue: '₹ 2,900 Cr', scope12: '14,210 t', intensity: '4.90 t / ₹ Cr', renewable: '45%', water: '12.8 m³' },
    { name: 'Megha Heavy Engineering', revenue: '₹ 5,100 Cr', scope12: '48,150 t', intensity: '9.44 t / ₹ Cr', renewable: '36%', water: '36.5 m³' },
    { name: 'Megha International Ventures', revenue: '₹ 3,400 Cr', scope12: '26,400 t', intensity: '7.76 t / ₹ Cr', renewable: '22%', water: '29.0 m³' }
  ];

  return (
    <div className="group-analytics-screen">
      <div className="group-card" style={{ marginBottom: '1.25rem' }}>
        <div className="group-card-header">
          <div>
            <h2 className="group-card-title">Cross-Subsidiary ESG Benchmarking & Intensity Analysis</h2>
            <p className="group-card-subtitle">
              Normalized comparative performance against turnover, energy consumption, and natural resource intensity
            </p>
          </div>
          <span className="group-badge-indigo">
            <BarChart3 size={14} style={{ display: 'inline', marginRight: '0.2rem' }} />
            SEBI Normalized Decarbonization Metrics
          </span>
        </div>
      </div>

      <div className="group-card">
        <div className="group-table-container">
          <table className="group-table">
            <thead>
              <tr>
                <th>Subsidiary Entity</th>
                <th>Turnover</th>
                <th>Scope 1+2 Footprint</th>
                <th>Carbon Intensity</th>
                <th>Renewable Energy %</th>
                <th style={{ textAlign: 'right' }}>Water Intensity</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{b.name}</span>
                  </td>
                  <td><span style={{ fontWeight: 600 }}>{b.revenue}</span></td>
                  <td><span style={{ color: '#475569' }}>{b.scope12}</span></td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#4338CA' }}>{b.intensity}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="group-badge-success">{b.renewable}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, color: '#0284C7' }}>{b.water}</span>
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
