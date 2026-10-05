import React, { useState } from 'react';
import {
  Layers
} from 'lucide-react';

export default function GovBRSRMappingScreen({
  mappings = [],
  onNavigateTab
}) {
  const [pillarFilter, setPillarFilter] = useState('all');

  return (
    <div className="gov-module-root">
      {/* ──── HEADER BAR ──── */}
      <div className="gov-header-bar">
        <div className="gov-header-top">
          <div className="gov-header-title-box">
            <h1>BRSR / ESG Mapping</h1>
            <p>Map governance records to BRSR and ESG indicators.</p>
          </div>
          <div className="gov-header-controls">
            <select 
              className="gov-select-pill"
              value={pillarFilter}
              onChange={(e) => setPillarFilter(e.target.value)}
            >
              <option value="all">All Pillars</option>
              <option value="p1">Principle 1: Ethics, Transparency & Accountability</option>
              <option value="p2">Principle 2: Product Lifecycle Sustainability</option>
              <option value="p3">Principle 3: Employee Wellbeing</option>
              <option value="p8">Principle 8: Inclusive Growth (CSR)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ──── MAPPINGS TABLE ──── */}
      <div className="gov-table-card">
        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Source Records</th>
                <th>Data Availability</th>
                <th>Evidence</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Readiness</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                      <span>{item.indicator}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        color: '#2563EB', 
                        fontWeight: 600, 
                        background: '#EFF6FF', 
                        padding: '2px 8px', 
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        if (item.sourceRecords.includes('POL')) onNavigateTab?.('policies');
                        else if (item.sourceRecords.includes('DSC')) onNavigateTab?.('disclosures');
                        else if (item.sourceRecords.includes('GRV')) onNavigateTab?.('grievances');
                        else onNavigateTab?.('obligations');
                      }}
                    >
                      {item.sourceRecords}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: item.dataAvailability === 'Available' ? '#16A34A' : '#D97706',
                      fontWeight: 600
                    }}>
                      {item.dataAvailability}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: item.evidence === 'Verified' ? '#16A34A' : '#D97706',
                      fontWeight: 500
                    }}>
                      {item.evidence}
                    </span>
                  </td>
                  <td>
                    <span className={`gov-status-chip gov-status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`gov-status-chip gov-status-${item.readiness.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.readiness}
                    </span>
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
