import React from 'react';
import { Target, TrendingDown, CheckCircle2, Clock } from 'lucide-react';

export default function ESGTargetsTrackerScreen() {
  const targets = [
    { kpi: 'Scope 1 & 2 Carbon Intensity (tCO2e / ₹ Cr)', base: '24.2 (FY22)', current: '19.8 (FY24)', target2030: '14.0 (-42%)', target2045: '0.0 (Net Zero)', status: 'On Track' },
    { kpi: 'Water Consumption Intensity (m³ / ₹ Cr)', base: '48.2 (FY22)', current: '42.1 (FY24)', target2030: '28.0 (-40%)', target2045: '15.0 (-70%)', status: 'On Track' },
    { kpi: 'Renewable Electricity Fraction (%)', base: '18% (FY22)', current: '38.6% (FY24)', target2030: '65.0%', target2045: '100.0%', status: 'Ahead of Target' },
    { kpi: 'Zero Waste to Landfill Certification (%)', base: '30% (FY22)', current: '62% (FY24)', target2030: '85.0%', target2045: '100.0%', status: 'On Track' },
    { kpi: 'Permanent Women Workforce Ratio (%)', base: '6.4% (FY22)', current: '11.8% (FY24)', target2030: '20.0%', target2045: '35.0%', status: 'In Acceleration' }
  ];

  return (
    <div className="esg-mgr-targets">
      <div className="esg-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="esg-mgr-card-header">
          <div>
            <h2 className="esg-mgr-card-title">Corporate ESG Target Dashboard & Milestone Tracking</h2>
            <p className="esg-mgr-card-subtitle">
              Comparison of baseline vs current achievement against 2030 Interim and 2045 Net Zero milestones
            </p>
          </div>
          <span className="esg-mgr-badge-emerald">All 5 Core Targets On Track</span>
        </div>
      </div>

      <div className="esg-mgr-card">
        <div className="esg-mgr-table-container">
          <table className="esg-mgr-table">
            <thead>
              <tr>
                <th>Strategic KPI Indicator</th>
                <th>FY22 Baseline</th>
                <th>Current (FY24)</th>
                <th>2030 Interim Target</th>
                <th>2045 Net Zero Milestone</th>
                <th style={{ textAlign: 'right' }}>Trajectory Status</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((t, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{t.kpi}</span>
                  </td>
                  <td><span style={{ color: '#64748B' }}>{t.base}</span></td>
                  <td><span style={{ fontWeight: 700, color: '#047857' }}>{t.current}</span></td>
                  <td><span style={{ fontWeight: 600, color: '#2563EB' }}>{t.target2030}</span></td>
                  <td><span style={{ fontWeight: 800, color: '#0F172A' }}>{t.target2045}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="esg-mgr-badge-emerald">{t.status}</span>
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
