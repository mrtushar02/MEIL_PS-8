import React from 'react';
import {
  
} from 'lucide-react';

export default function AnalyticsReportsCard({ onNavigateToReports }) {
  const metrics = [
    { title: 'Emission Intensity', value: '0.42', unit: 'tCO₂e/₹Cr', trend: '↓ 4.1%', positive: true },
    { title: 'Renewable Share', value: '35.2', unit: '%', trend: '↑ 6.3%', positive: true },
    { title: 'Water Intensity', value: '1.84', unit: 'KL/MWh', trend: '↓ 2.0%', positive: true },
    { title: 'Waste Recovery', value: '72.6', unit: '%', trend: '↑ 8.5%', positive: true },
  ];

  return (
    <div className="standard-glass-card">
      <div className="card-header-bar" style={{ marginBottom: '14px' }}>
        <h3 className="card-title">Analytics & Reports</h3>
        <button 
          type="button" 
          className="card-view-all-link"
          onClick={() => onNavigateToReports?.()}
        >
          View All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {metrics.map((m, idx) => (
          <div 
            key={idx}
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(248, 250, 252, 0.8)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
              {m.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{
                fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
                fontSize: '18px',
                fontWeight: '800',
                color: '#0F172A',
                lineHeight: 1
              }}>
                {m.value}
              </span>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
                {m.unit}
              </span>
            </div>
            <div style={{
              fontSize: '10.5px',
              fontWeight: '700',
              color: m.positive ? '#16A34A' : '#EF4444'
            }}>
              {m.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
