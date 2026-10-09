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
import { MEIL_MEDIA } from '../../../../config/projectMedia';

export default function EHSEnvironmentalScreen({
  records = [],
  onCreateRecord,
  onNavigateTab
}) {
  const [activeSubTab, setActiveSubTab] = useState('Water');

  const defaultEnvRecords = [
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

  const [envRecords, setEnvRecords] = useState(
    records && records.length > 0 ? records : defaultEnvRecords
  );
  const [selectedRecord, setSelectedRecord] = useState(defaultEnvRecords[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRec, setNewRec] = useState({
    module: 'Water Usage',
    category: 'Water Withdrawal',
    project: 'Zojila Tunnel',
    quantity: '5,200',
    unit: 'KL',
    source: 'Digital Flow Meter',
    notes: 'Realtime digital telemetry calibrated and sealed'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const created = {
      id: `ENV-2026-${String(envRecords.length + 13).padStart(2, '0')}`,
      ...newRec,
      period: 'September 2026',
      status: 'Verified'
    };
    const updated = [created, ...envRecords];
    setEnvRecords(updated);
    setSelectedRecord(created);
    if (onCreateRecord) onCreateRecord(created);
    setIsModalOpen(false);
  };

  const handleVerify = (id) => {
    setEnvRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Verified' } : r));
    if (selectedRecord?.id === id) {
      setSelectedRecord(prev => ({ ...prev, status: 'Verified' }));
    }
  };

  const filteredRecords = envRecords.filter(r => {
    if (activeSubTab === 'Water') return (r.module || '').toLowerCase().includes('water') || (r.module || '').toLowerCase().includes('effluent');
    if (activeSubTab === 'Waste') return (r.module || '').toLowerCase().includes('waste');
    if (activeSubTab === 'Air Emissions') return (r.module || '').toLowerCase().includes('air');
    if (activeSubTab === 'Environmental Incidents') return (r.category || '').toLowerCase().includes('incident');
    return true;
  });

  // Dynamic KPIs
  const verifiedCount = envRecords.filter(r => r.status === 'Verified').length;
  const verifiedPct = envRecords.length > 0 ? Math.round((verifiedCount / envRecords.length) * 100) : 92;
  const waterCount = envRecords.filter(r => (r.module || '').toLowerCase().includes('water')).length;
  const wasteCount = envRecords.filter(r => (r.module || '').toLowerCase().includes('waste')).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER (Matching Image Panel 7) ──── */}
      <div className="ehs-glass-card ehs-page-banner" style={{ padding: '18px 24px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Environmental & HSE Data
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Continuous site environmental monitoring, water consumption, and CPCB regulatory telemetry.
            </p>
          </div>
          <button
            type="button"
            className="ehs-btn ehs-btn-blue"
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
          >
            + Log Environmental Record
          </button>
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
            <span className="ehs-kpi-main-val">{waterCount > 0 ? '96%' : '100%'}</span>
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
            <span className="ehs-kpi-main-val">{wasteCount > 0 ? '88%' : '100%'}</span>
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
            <span className="ehs-kpi-main-val">0</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Zero reportable breaches</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Evidence</span>
            <FileCheck2 size={14} color="#059669" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{verifiedPct}%</span>
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
              Environmental Records Log ({activeSubTab})
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {filteredRecords.length} records
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
                {filteredRecords.map((rec) => {
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
                  <span style={{ color: selectedRecord.status === 'Verified' ? '#059669' : '#D97706', fontWeight: 800 }}>{selectedRecord.status}</span>
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

            {/* Attached Evidence Proof */}
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
              </div>
            </div>

            {/* Footer Action */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {selectedRecord.status !== 'Verified' && (
                <button
                  type="button"
                  className="ehs-btn ehs-btn-blue"
                  style={{ padding: '6px 14px', fontSize: '11.5px' }}
                  onClick={() => handleVerify(selectedRecord.id)}
                >
                  Verify Record
                </button>
              )}
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

      {/* ──── INDUSTRIAL FACILITIES & CONTINUOUS CEMS TELEMETRY ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {/* Facility 1: Thermal Power */}
        <div className="ehs-glass-card" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <img 
            src={MEIL_MEDIA.thermalPowerPlant.src} 
            alt={MEIL_MEDIA.thermalPowerPlant.title}
            style={{ width: '130px', height: '90px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
              Online CEMS Stack Monitoring
            </span>
            <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px 0' }}>
              {MEIL_MEDIA.thermalPowerPlant.title}
            </h4>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 6px 0', lineHeight: 1.3 }}>
              Continuous opacity, SOx, NOx telemetry & natural draft cooling tower water recirculation.
            </p>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A' }}>
              ● Compliant with CPCB Emission Standards
            </div>
          </div>
        </div>

        {/* Facility 2: Hydrocarbon Refinery */}
        <div className="ehs-glass-card" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <img 
            src={MEIL_MEDIA.hydrocarbonPlant.src} 
            alt={MEIL_MEDIA.hydrocarbonPlant.title}
            style={{ width: '130px', height: '90px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              Pipeline Leak Detection & VOC
            </span>
            <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '4px 0 2px 0' }}>
              {MEIL_MEDIA.hydrocarbonPlant.title}
            </h4>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 6px 0', lineHeight: 1.3 }}>
              Automated SCADA pipeline pressure telemetry & continuous fugitive hydrocarbon emission control.
            </p>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A' }}>
              ● Zero Unplanned Venting Incidents
            </div>
          </div>
        </div>
      </div>

      {/* ──── LOG ENVIRONMENTAL RECORD MODAL ──── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="ehs-glass-card" style={{ background: '#FFFFFF', maxWidth: '480px', width: '100%', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>Log Environmental Record</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Environmental Module</label>
                <select
                  value={newRec.module}
                  onChange={(e) => setNewRec({ ...newRec, module: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="Water Usage">Water Usage</option>
                  <option value="Waste Generation">Waste Generation</option>
                  <option value="Effluent Quality">Effluent Quality</option>
                  <option value="Air Emission">Air Emission</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Category</label>
                  <input
                    type="text"
                    required
                    value={newRec.category}
                    onChange={(e) => setNewRec({ ...newRec, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Project Site</label>
                  <select
                    value={newRec.project}
                    onChange={(e) => setNewRec({ ...newRec, project: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="Zojila Tunnel">Zojila Tunnel</option>
                    <option value="Main Tunnel">Main Tunnel</option>
                    <option value="Access Road">Access Road</option>
                    <option value="Camp Area">Camp Area</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Quantity</label>
                  <input
                    type="text"
                    required
                    value={newRec.quantity}
                    onChange={(e) => setNewRec({ ...newRec, quantity: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Unit</label>
                  <input
                    type="text"
                    required
                    value={newRec.unit}
                    onChange={(e) => setNewRec({ ...newRec, unit: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Notes / CPCB Standard</label>
                <textarea
                  rows="2"
                  value={newRec.notes}
                  onChange={(e) => setNewRec({ ...newRec, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ehs-btn ehs-btn-outline"
                  style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ehs-btn ehs-btn-blue"
                  style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
