import React, { useState } from 'react';
import {
  PlusCircle,
  Lock,
  Filter,
  X,
  FileDown
} from 'lucide-react';

export default function EHSSubmissionsScreen({
  submissions = [],
  onCreateSubmission,
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects / Sites');
  const [selectedRange, setSelectedRange] = useState('Date Range 2026');
  const [selectedModule, setSelectedModule] = useState('All Submissions');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Submissions list matching image Panel 9
  const submissionList = [
    {
      id: 'SUB-2026-18',
      module: 'Safety',
      project: 'Zojila Tunnel',
      period: 'Sep 2026',
      status: 'Under Review',
      submittedOn: '28 Sep 2026',
      submittedBy: 'Rajeshwar K.',
      reviewer: 'Priya Sharma (Group Director HSE)',
      comments: 'Reviewing quarterly incident triage and near-miss resolution ratios prior to DGMS sign-off.'
    },
    {
      id: 'SUB-2026-17',
      module: 'Environmental',
      project: 'Access Road',
      period: 'Sep 2026',
      status: 'Approved',
      submittedOn: '26 Sep 2026',
      submittedBy: 'Rajeshwar K.',
      reviewer: 'State Pollution Control Board',
      comments: 'Zero Liquid Discharge water manifest verified and locked for regulatory compliance.'
    },
    {
      id: 'SUB-2026-16',
      module: 'Training',
      project: 'Camp Area',
      period: 'Sep 2026',
      status: 'Correction Required',
      submittedOn: '24 Sep 2026',
      submittedBy: 'Rajeshwar K.',
      reviewer: 'Statutory Safety Auditor',
      comments: 'Make corrections and resubmit: Biometric logs for 12 contract workers on 18 Sep missing supervisor countersignature.'
    },
    {
      id: 'SUB-2026-15',
      module: 'Inspection',
      project: 'Main Tunnel',
      period: 'Aug 2026',
      status: 'Approved',
      submittedOn: '20 Aug 2026',
      submittedBy: 'Rajeshwar K.',
      reviewer: 'Executive Director HSE',
      comments: 'Monthly underground ventilation and scaffolding inspection approved without reservations.'
    }
  ];

  const [localSubmissions, setLocalSubmissions] = useState(
    submissions && submissions.length > 0 ? submissions : submissionList
  );
  const [selectedSub, setSelectedSub] = useState(submissionList[0]);
  const [drawerTab, setDrawerTab] = useState('Overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    module: 'Safety',
    project: 'Zojila Tunnel',
    period: 'Sep 2026',
    comments: 'Routine monthly EHS filing package with complete audit affidavits'
  });

  const handleResubmit = (subId) => {
    setLocalSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'Under Review', comments: 'Resubmitted with updated contractor affidavits. Awaiting re-audit.' } : s));
    setSelectedSub(prev => prev ? { ...prev, status: 'Under Review', comments: 'Resubmitted with updated contractor affidavits. Awaiting re-audit.' } : null);
  };

  const handleCreateSubmission = (e) => {
    e.preventDefault();
    const created = {
      id: `SUB-2026-${String(localSubmissions.length + 19).padStart(2, '0')}`,
      ...newSub,
      status: 'Under Review',
      submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      submittedBy: 'Rajeshwar K. (Site HSE Lead)',
      reviewer: 'Priya Sharma (Group Director HSE)'
    };
    const updated = [created, ...localSubmissions];
    setLocalSubmissions(updated);
    setSelectedSub(created);
    if (onCreateSubmission) onCreateSubmission(created);
    setIsModalOpen(false);
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["ID,Module,Project,Period,Status,Submitted By,Reviewer",
       ...localSubmissions.map(s => `"${s.id}","${s.module}","${s.project}","${s.period}","${s.status}","${s.submittedBy}","${s.reviewer}"`)
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MEIL_EHS_Submissions_${selectedRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPackage = (sub) => {
    const content = `MEIL GROUP - EHS STATUTORY FILING DOSSIER\nSubmission ID: ${sub.id}\nModule: ${sub.module}\nProject: ${sub.project}\nPeriod: ${sub.period}\nStatus: ${sub.status}\nAuditor Hash: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-MEIL\nAssurance Standard: SEBI BRSR Core Circular 2023 / NGRBC P3\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sub.id}_SEBI_Signed_Package.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubmissions = localSubmissions.filter(sub => {
    if (selectedProject !== 'All Projects / Sites' && sub.project !== selectedProject) return false;
    if (selectedModule !== 'All Submissions' && sub.module !== selectedModule) return false;
    if (selectedStatus !== 'All Statuses' && sub.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & FILTERS BAR (Matching Image Panel 9) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Submissions
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Statutory filings, SEBI BRSR Principle 6 HSE declarations, and CPCB returns.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button" 
              className="ehs-btn ehs-btn-outline"
              onClick={handleExportCsv}
              style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              <FileDown size={14} />
              <span>Export CSV</span>
            </button>
            <button 
              type="button" 
              className="ehs-btn ehs-btn-blue"
              onClick={() => setIsModalOpen(true)}
              style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              <PlusCircle size={14} />
              <span>+ Create Submission</span>
            </button>
          </div>
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
            <option value="All Submissions">Submissions: All</option>
            <option value="Safety">Safety</option>
            <option value="Environmental">Environmental</option>
            <option value="Training">Training</option>
            <option value="Inspection">Inspection</option>
          </select>

          <select 
            className="ehs-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
          >
            <option value="All Statuses">Status: All</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Correction Required">Correction Required</option>
          </select>
        </div>
      </div>

      {/* ──── 2. SPLIT MAIN SECTION: TABLE (LEFT 65%) + DETAIL DRAWER (RIGHT 35%) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedSub ? '1.8fr 1.2fr' : '1fr', gap: '16px' }}>
        {/* Left: Submissions Table */}
        <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Statutory Filings Register
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {filteredSubmissions.length} filings
            </span>
          </div>

          <div className="ehs-table-container">
            <table className="ehs-data-table">
              <thead>
                <tr>
                  <th>Submission ID</th>
                  <th>Module</th>
                  <th>Project / Site</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => {
                  const isSelected = selectedSub?.id === sub.id;
                  return (
                    <tr 
                      key={sub.id}
                      onClick={() => setSelectedSub(sub)}
                      style={{ 
                        background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ fontWeight: 800, color: '#2563EB' }}>{sub.id}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{sub.module}</td>
                      <td style={{ color: '#475569' }}>{sub.project}</td>
                      <td style={{ fontSize: '12px', color: '#64748B' }}>{sub.period}</td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '9999px',
                            background: sub.status === 'Approved' ? 'rgba(16, 185, 129, 0.12)' : sub.status === 'Under Review' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(239, 68, 68, 0.12)',
                            color: sub.status === 'Approved' ? '#059669' : sub.status === 'Under Review' ? '#D97706' : '#DC2626'
                          }}
                        >
                          {sub.status === 'Approved' && <Lock size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />}
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="ehs-btn ehs-btn-outline"
                          style={{ padding: '3px 8px', fontSize: '11px', height: '24px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSub(sub);
                          }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Submission Details Drawer Card (Matching Image Panel 9) */}
        {selectedSub && (
          <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Submission Details - {selectedSub.id}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {selectedSub.project} • {selectedSub.module}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedSub(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              {['Overview', 'Data', 'Evidence', 'Review', 'Timeline'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDrawerTab(tab)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: drawerTab === tab ? '#2563EB' : 'transparent',
                    color: drawerTab === tab ? '#FFFFFF' : '#64748B'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Basic Information */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                <div><span style={{ color: '#64748B' }}>Module:</span> <strong>{selectedSub.module}</strong></div>
                <div><span style={{ color: '#64748B' }}>Project:</span> <strong>{selectedSub.project}</strong></div>
                <div><span style={{ color: '#64748B' }}>Period:</span> <strong>{selectedSub.period}</strong></div>
                <div>
                  <span style={{ color: '#64748B' }}>Status:</span>{' '}
                  <strong style={{ color: selectedSub.status === 'Approved' ? '#059669' : selectedSub.status === 'Under Review' ? '#D97706' : '#DC2626' }}>
                    {selectedSub.status}
                  </strong>
                </div>
                <div><span style={{ color: '#64748B' }}>Submitted On:</span> <strong>{selectedSub.submittedOn}</strong></div>
                <div><span style={{ color: '#64748B' }}>Reviewer:</span> <strong>{selectedSub.reviewer}</strong></div>
              </div>
            </div>

            {/* Redo/Comments (Matching Image Panel 9) */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Redo/Comments</div>
              <div style={{ 
                fontSize: '12px', 
                color: '#475569', 
                margin: 0, 
                lineHeight: 1.4, 
                background: 'rgba(239, 68, 68, 0.04)', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid rgba(239, 68, 68, 0.2)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: 700, marginBottom: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }} />
                  <span>Make corrections and resubmit</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>
                  Ensure subcontractor incident counts and statutory form reports are cross-verified with registered DGMS affidavits before final submission.
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {selectedSub.status === 'Correction Required' ? (
                <button 
                  type="button" 
                  className="ehs-btn ehs-btn-primary"
                  style={{ padding: '6px 14px', fontSize: '11.5px' }}
                  onClick={() => handleResubmit(selectedSub.id)}
                >
                  Make Corrections & Resubmit
                </button>
              ) : (
                <button 
                  type="button" 
                  className="ehs-btn ehs-btn-blue"
                  style={{ padding: '6px 14px', fontSize: '11.5px' }}
                  onClick={() => handleDownloadPackage(selectedSub)}
                >
                  Download Signed Package
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ──── CREATE SUBMISSION MODAL ──── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="ehs-glass-card" style={{ background: '#FFFFFF', maxWidth: '480px', width: '100%', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>Create Statutory Submission</h3>
            <form onSubmit={handleCreateSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Module</label>
                  <select
                    value={newSub.module}
                    onChange={(e) => setNewSub({ ...newSub, module: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="Safety">Safety</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Training">Training</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Project Site</label>
                  <select
                    value={newSub.project}
                    onChange={(e) => setNewSub({ ...newSub, project: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="Zojila Tunnel">Zojila Tunnel</option>
                    <option value="Main Tunnel">Main Tunnel</option>
                    <option value="Access Road">Access Road</option>
                    <option value="Camp Area">Camp Area</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Reporting Period</label>
                <input
                  type="text"
                  required
                  value={newSub.period}
                  onChange={(e) => setNewSub({ ...newSub, period: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Comments / Filing Summary</label>
                <textarea
                  rows="3"
                  value={newSub.comments}
                  onChange={(e) => setNewSub({ ...newSub, comments: e.target.value })}
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
                  Submit Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
