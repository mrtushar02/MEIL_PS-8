import React, { useState } from 'react';
import {
  Paperclip,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Download,
  Eye,
  Filter,
  X
} from 'lucide-react';

export default function EHSEvidenceScreen({
  evidence = [],
  onUploadEvidence,
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects / Sites');
  const [selectedRange, setSelectedRange] = useState('Date Range 2026');
  const [selectedModule, setSelectedModule] = useState('All Modules');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Evidence records matching image Panel 8
  const evidenceList = [
    {
      id: 'EV-2026-88',
      fileName: 'Incident_Report_INC-2026-05.pdf',
      module: 'Incident Report',
      project: 'Zojila Tunnel',
      format: 'PDF',
      size: '2.4 MB',
      priority: 'High',
      status: 'Uploaded',
      uploadedDate: '28 Sep 2026, 15:24',
      uploadedBy: 'Rajesh Kumar',
      hash: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      id: 'EV-2026-87',
      fileName: 'Inspection_Checklist_INSP-2026-15.pdf',
      module: 'Inspection Checklist',
      project: 'Access Road',
      format: 'PDF',
      size: '1.8 MB',
      priority: 'Medium',
      status: 'Verified',
      uploadedDate: '28 Sep 2026, 12:10',
      uploadedBy: 'Neha Singh',
      hash: 'SHA256: 9e107d9d372bb6826bd81d3542a419d6a3f9e9cf29eb10c92135c4b373fa3002'
    },
    {
      id: 'EV-2026-86',
      fileName: 'Biometric_Attendance_TB-2026-21.xlsx',
      module: 'Training Attendance',
      project: 'Camp Area',
      format: 'XLSX',
      size: '950 KB',
      priority: 'Low',
      status: 'Verified',
      uploadedDate: '27 Sep 2026, 17:00',
      uploadedBy: 'Arvind Patel',
      hash: 'SHA256: 3c9b7e8d12fae498327bc19a3d4f826190beec18471928dfa34190cba7219801'
    },
    {
      id: 'EV-2026-85',
      fileName: 'Effluent_Water_Test_LabReport.jpg',
      module: 'Environmental Data',
      project: 'Main Tunnel',
      format: 'JPG',
      size: '4.2 MB',
      priority: 'High',
      status: 'Uploaded',
      uploadedDate: '25 Sep 2026, 14:15',
      uploadedBy: 'Rahul Mehta',
      hash: 'SHA256: a12bc489f02941df829cb67341ea290192df78192803cbfa89102847190283fa'
    }
  ];

  const [items, setItems] = useState(
    evidence && evidence.length > 0 ? evidence : evidenceList
  );
  const [selectedEv, setSelectedEv] = useState(evidenceList[0]);
  const fileInputRef = React.useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDoc = {
      id: `EV-2026-${String(items.length + 89).padStart(2, '0')}`,
      fileName: file.name,
      module: 'Safety & EHS',
      project: selectedProject !== 'All Projects / Sites' ? selectedProject : 'Zojila Tunnel',
      format: file.name.split('.').pop()?.toUpperCase() || 'PDF',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      priority: 'High',
      status: 'Uploaded',
      uploadedDate: 'Just now',
      uploadedBy: 'EHS Officer',
      hash: `SHA256: ${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`
    };
    const updated = [newDoc, ...items];
    setItems(updated);
    setSelectedEv(newDoc);
    if (onUploadEvidence) onUploadEvidence(newDoc);
    e.target.value = '';
  };

  const handleDownloadEvidence = (ev) => {
    const content = `MEIL ESG EVIDENCE VAULT\nDocument ID: ${ev.id}\nFile: ${ev.fileName}\nModule: ${ev.module || 'EHS'}\nAssurance: SEBI BRSR Core Type 2\nHash: ${ev.hash || 'SHA256-AUTHENTICATED'}\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.fileName || 'evidence'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerifyEvidence = (evId) => {
    setItems(prev => prev.map(ev => ev.id === evId ? { ...ev, status: 'Verified' } : ev));
    setSelectedEv(prev => prev ? { ...prev, status: 'Verified' } : null);
  };

  const filteredItems = items.filter(ev => {
    if (selectedProject !== 'All Projects / Sites' && ev.project !== selectedProject) return false;
    if (selectedModule !== 'All Modules' && ev.module !== selectedModule) return false;
    if (selectedStatus !== 'All Statuses' && ev.status !== selectedStatus) return false;
    return true;
  });

  const totalCount = items.length;
  const pendingCount = items.filter(i => i.status === 'Uploaded' || i.status === 'Pending').length;
  const verifiedCount = items.filter(i => i.status === 'Verified').length;
  const rejectedCount = items.filter(i => i.status === 'Rejected').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 8) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Evidence Management
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Tamper-proof verifiable audit documentation linking safety incidents, audits, and environmental manifests.
            </p>
          </div>
          <button
            type="button"
            className="ehs-btn ehs-btn-blue"
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
          >
            + Upload Evidence
          </button>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <select 
            className="ehs-select-control"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Projects / Sites">All Projects / Sites</option>
            <option value="Zojila Tunnel">Zojila Tunnel</option>
            <option value="Access Road">Access Road</option>
            <option value="Camp Area">Camp Area</option>
            <option value="Main Tunnel">Main Tunnel</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="Date Range 2026">Date Range: Sep 2026</option>
            <option value="Aug 2026">Aug 2026</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Modules">Module: All</option>
            <option value="Incident Report">Incident Report</option>
            <option value="Inspection Checklist">Inspection Checklist</option>
            <option value="Training Attendance">Training Attendance</option>
            <option value="Safety & EHS">Safety & EHS</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Statuses">Status: All</option>
            <option value="Uploaded">Uploaded</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (5 Cards in a Row - Matching Image Panel 8) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Total Evidence</span>
            <Paperclip size={14} color="#2563EB" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{totalCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Cryptographic records</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Pending Review</span>
            <Clock size={14} color="#D97706" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{pendingCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Awaiting sign-off</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Verified</span>
            <CheckCircle2 size={14} color="#059669" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">{verifiedCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#059669', fontWeight: 700 }}>Audit Proof Complete</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Rejected</span>
            <XCircle size={14} color="#DC2626" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#DC2626' }}>{rejectedCount}</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Resubmission required</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Missing</span>
            <AlertTriangle size={14} color="#D97706" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">12</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Pending upload</span>
          </div>
        </div>
      </div>

      {/* ──── 3. SPLIT MAIN SECTION: TABLE (LEFT 65%) + PREVIEW DRAWER (RIGHT 35%) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedEv ? '1.8fr 1.2fr' : '1fr', gap: '16px' }}>
        {/* Left: Evidence Table */}
        <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Evidence Repository
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {filteredItems.length} documents
            </span>
          </div>

          <div className="ehs-table-container">
            <table className="ehs-data-table">
              <thead>
                <tr>
                  <th>Submission ID</th>
                  <th>Module</th>
                  <th>Project / Site</th>
                  <th>Format</th>
                  <th>Size</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((ev) => {
                  const isSelected = selectedEv?.id === ev.id;
                  return (
                    <tr 
                      key={ev.id}
                      onClick={() => setSelectedEv(ev)}
                      style={{ 
                        background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ fontWeight: 800, color: '#2563EB' }}>{ev.id}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{ev.module}</td>
                      <td style={{ color: '#475569' }}>{ev.project}</td>
                      <td style={{ fontSize: '11px', fontWeight: 700 }}>{ev.format}</td>
                      <td style={{ fontSize: '12px', color: '#64748B' }}>{ev.size}</td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: ev.priority === 'High' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                            color: ev.priority === 'High' ? '#D97706' : '#2563EB'
                          }}
                        >
                          {ev.priority}
                        </span>
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: ev.status === 'Verified' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                            color: ev.status === 'Verified' ? '#059669' : '#D97706'
                          }}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="ehs-btn ehs-btn-outline"
                          style={{ padding: '3px 8px', fontSize: '11px', height: '24px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEv(ev);
                          }}
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Evidence Preview Drawer Card (Matching Image Panel 8) */}
        {selectedEv && (
          <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Evidence Preview - {selectedEv.id}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {selectedEv.fileName}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedEv(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Document Thumbnail Preview Container (Matching Image Panel 8) */}
            <div style={{ 
              background: '#F1F5F9', 
              border: '1px solid #CBD5E1', 
              borderRadius: '8px', 
              padding: '16px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              {/* Paper Sheet Preview Mockup */}
              <div style={{
                width: '180px',
                height: '230px',
                background: '#FFFFFF',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative'
              }}>
                {/* Document Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #2563EB', paddingBottom: '6px' }}>
                  <div style={{ width: '40px', height: '6px', background: '#2563EB', borderRadius: '2px' }} />
                  <div style={{ width: '20px', height: '4px', background: '#94A3B8', borderRadius: '2px' }} />
                </div>
                {/* Title Line */}
                <div style={{ width: '75%', height: '8px', background: '#0F172A', borderRadius: '2px', marginTop: '2px' }} />
                <div style={{ width: '45%', height: '5px', background: '#64748B', borderRadius: '2px' }} />

                {/* Content Paragraph lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  <div style={{ width: '100%', height: '3.5px', background: '#CBD5E1', borderRadius: '1px' }} />
                  <div style={{ width: '92%', height: '3.5px', background: '#CBD5E1', borderRadius: '1px' }} />
                  <div style={{ width: '96%', height: '3.5px', background: '#CBD5E1', borderRadius: '1px' }} />
                  <div style={{ width: '84%', height: '3.5px', background: '#CBD5E1', borderRadius: '1px' }} />
                </div>

                {/* Mini Table Mockup */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '3px', padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ flex: 1, height: '4px', background: '#94A3B8', borderRadius: '1px' }} />
                    <div style={{ flex: 1, height: '4px', background: '#94A3B8', borderRadius: '1px' }} />
                    <div style={{ flex: 1, height: '4px', background: '#94A3B8', borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ flex: 1, height: '3px', background: '#E2E8F0', borderRadius: '1px' }} />
                    <div style={{ flex: 1, height: '3px', background: '#E2E8F0', borderRadius: '1px' }} />
                    <div style={{ flex: 1, height: '3px', background: '#E2E8F0', borderRadius: '1px' }} />
                  </div>
                </div>

                {/* Second Paragraph */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                  <div style={{ width: '95%', height: '3.5px', background: '#CBD5E1', borderRadius: '1px' }} />
                  <div style={{ width: '88%', height: '3.5px', background: '#CBD5E1', borderRadius: '1px' }} />
                </div>

                {/* Seal & Signature at Bottom */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px dashed #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6px', fontWeight: 900, color: '#059669' }}>
                    SEAL
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <div style={{ width: '45px', height: '1.5px', background: '#64748B' }} />
                    <div style={{ fontSize: '6.5px', color: '#64748B', fontWeight: 600 }}>Authorized Sign</div>
                  </div>
                </div>
              </div>

              {/* Document details below */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{selectedEv.fileName}</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Size: {selectedEv.size} • Uploaded: {selectedEv.uploadedDate}
                </div>
                <span 
                  style={{ 
                    display: 'inline-block',
                    marginTop: '6px', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    padding: '2px 8px', 
                    borderRadius: '9999px',
                    background: selectedEv.status === 'Verified' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                    color: selectedEv.status === 'Verified' ? '#059669' : '#D97706'
                  }}
                >
                  {selectedEv.status}
                </span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Stamp */}
            <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
              <div style={{ fontWeight: 800, color: '#475569', marginBottom: '2px' }}>Cryptographic Verification</div>
              <div style={{ fontFamily: 'monospace', color: '#64748B', wordBreak: 'break-all', fontSize: '10px' }}>
                {selectedEv.hash}
              </div>
            </div>

            {/* Actions: Download / Verify */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <button 
                type="button" 
                className="ehs-btn ehs-btn-outline"
                style={{ padding: '6px 12px', fontSize: '11.5px' }}
                onClick={() => handleDownloadEvidence(selectedEv)}
              >
                <Download size={13} />
                <span>Download</span>
              </button>

              <button 
                type="button" 
                className="ehs-btn ehs-btn-primary"
                style={{ padding: '6px 14px', fontSize: '11.5px' }}
                onClick={() => handleVerifyEvidence(selectedEv.id)}
              >
                <CheckCircle2 size={13} />
                <span>Verify Proof</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
