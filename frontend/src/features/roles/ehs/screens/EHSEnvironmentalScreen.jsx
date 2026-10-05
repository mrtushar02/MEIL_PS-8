import React, { useState } from 'react';
import {
  Droplet,
  Trash2,
  Wind,
  AlertTriangle,
  Layers,
  FileCheck2,
  X,
  FileText
} from 'lucide-react';

export default function EHSEnvironmentalScreen({
  records = [],
  onCreateRecord,
  onNavigateTab
}) {
  const [activeSubTab, setActiveSubTab] = useState('Water');

  // Environmental records matching image Panel 7
  const envRecords = [
    {
      id: 'ENV-2026-12',
      module: 'Water Usage',
      category: 'Water Withdrawal',
      project: 'Zojila Tunnel',
      period: 'September 2026',
      quantity: '12,480',
      unit: 'KL',
      source: 'Meter Reading',
      status: 'Verified',
      notes: 'ZLD zero liquid discharge confirmed by site effluent treatment telemetry.'
    },
    {
      id: 'ENV-2026-11',
      module: 'Waste Generation',
      category: 'Hazardous Waste',
      project: 'Camp Area',
      period: 'Sep 2026',
      quantity: '3,340',
      unit: 'kg',
      source: 'Weighbridge Manifest',
      status: 'Pending',
      notes: 'Form 10 TSDF transport manifest under review with pollution board.'
    },
    {
      id: 'ENV-2026-10',
      module: 'Effluent Quality',
      category: 'Treated Water',
      project: 'Access Road',
      period: 'Sep 2026',
      quantity: '8.2',
      unit: 'pH',
      source: 'Lab Test Report',
      status: 'Verified',
      notes: 'Total suspended solids & COD well within State Pollution Control limits.'
    },
    {
      id: 'ENV-2026-09',
      module: 'Air Emission',
      category: 'CAAQMS PM10',
      project: 'Main Tunnel',
      period: 'Sep 2026',
      quantity: '42',
      unit: 'µg/m³',
      source: 'Continuous Monitor',
      status: 'Verified',
      notes: 'PM10 well below CPCB industrial standard limit of 100 µg/m³.'
    }
  ];

  const [selectedRecord, setSelectedRecord] = useState(envRecords[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER (Matching Image Panel 7) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Environmental & HSE Data
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Continuous site environmental monitoring, water consumption, and CPCB regulatory telemetry.
            </p>
          </div>
        </div>

        {/* Environmental Sub-Tabs: Water | Waste | Air Emissions | Env. Incidents | Other */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', overflowX: 'auto' }}>
          {[
            { id: 'Water', label: 'Water', icon: Droplet },
            { id: 'Waste', label: 'Waste', icon: Trash2 },
            { id: 'Air Emissions', label: 'Air Emissions', icon: Wind },
            { id: 'Environmental Incidents', label: 'Environmental Incidents', icon: AlertTriangle },
            { id: 'Other', label: 'Other', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  background: isActive ? '#EFF6FF' : '#FFFFFF',
                  color: isActive ? '#2563EB' : '#475569'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (4 Cards in a Row - Matching Image Panel 7) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Water Data</span>
            <Droplet size={14} color="#0284C7" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">96%</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Verified telemetry</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Waste Data</span>
            <Trash2 size={14} color="#D97706" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">88%</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>TSDF manifest linked</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Env. Incidents</span>
            <AlertTriangle size={14} color="#DC2626" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">2</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Contained immediately</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Evidence</span>
            <FileCheck2 size={14} color="#059669" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">92%</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#059669', fontWeight: 700 }}>Audit Proof Complete</span>
          </div>
        </div>
      </div>

      {/* ──── 3. SPLIT MAIN SECTION: TABLE (LEFT 65%) + DETAIL DRAWER (RIGHT 35%) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedRecord ? '1.8fr 1.2fr' : '1fr', gap: '16px' }}>
        {/* Left: Environmental Table */}
        <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Environmental Records Log
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {envRecords.length} records
            </span>
          </div>

          <div className="ehs-table-container">
            <table className="ehs-data-table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Module</th>
                  <th>Project / Site</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {envRecords.map((rec) => {
                  const isSelected = selectedRecord?.id === rec.id;
                  return (
                    <tr 
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      style={{ 
                        background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ fontWeight: 800, color: '#2563EB' }}>{rec.id}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{rec.module}</td>
                      <td style={{ color: '#475569' }}>{rec.project}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{rec.quantity} {rec.unit}</td>
                      <td style={{ fontSize: '12px', color: '#64748B' }}>{rec.period}</td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: rec.status === 'Verified' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                            color: rec.status === 'Verified' ? '#059669' : '#D97706'
                          }}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Environmental Record Detail Drawer Card (Matching Image Panel 7) */}
        {selectedRecord && (
          <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Environmental Record - {selectedRecord.id}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {selectedRecord.project} • {selectedRecord.module}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedRecord(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Record Information */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                <div><span style={{ color: '#64748B' }}>Module:</span> <strong>{selectedRecord.module}</strong></div>
                <div><span style={{ color: '#64748B' }}>Category:</span> <strong>{selectedRecord.category}</strong></div>
                <div><span style={{ color: '#64748B' }}>Project:</span> <strong>{selectedRecord.project}</strong></div>
                <div><span style={{ color: '#64748B' }}>Period:</span> <strong>{selectedRecord.period}</strong></div>
                <div><span style={{ color: '#64748B' }}>Quantity:</span> <strong style={{ color: '#2563EB' }}>{selectedRecord.quantity} {selectedRecord.unit}</strong></div>
                <div><span style={{ color: '#64748B' }}>Source:</span> <strong>{selectedRecord.source}</strong></div>
                <div>
                  <span style={{ color: '#64748B' }}>Status:</span>{' '}
                  <span style={{ color: '#059669', fontWeight: 800 }}>{selectedRecord.status}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Auditor Notes</div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4, background: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                {selectedRecord.notes}
              </p>
            </div>

            {/* Evidence Thumbnails (Matching Image Panel 7) */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Attached Evidence Proof</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '6px 10px', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '26px', height: '32px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={14} color="#EF4444" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '11px' }}>SCADA_Log_Sep.pdf</div>
                    <div style={{ fontSize: '9.5px', color: '#64748B' }}>2.4 MB • Verified</div>
                  </div>
                </div>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '6px 10px', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '26px', height: '32px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={14} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '11px' }}>Calibration_Cert.jpg</div>
                    <div style={{ fontSize: '9.5px', color: '#64748B' }}>1.1 MB • Stamp Hash</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="ehs-btn ehs-btn-outline"
                style={{ padding: '6px 14px', fontSize: '11.5px' }}
                onClick={() => onNavigateTab?.('evidence')}
              >
                Inspect in Evidence Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
