import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  FileText,
  ShieldCheck,
  Clock,
  AlertCircle,
  AlertTriangle,
  Search,
  Download,
  Plus,
  ChevronDown,
  List,
  LayoutGrid,
  CheckCircle2,
  X,
  UploadCloud,
  FileSpreadsheet,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import './EvidenceVault.css';

// Master Evidence Records matching Reference Screen 3
const INITIAL_EVIDENCE = [
  {
    id: 'ev-01',
    fileName: 'Diesel Challan Aug 2026.pdf',
    fileType: 'pdf',
    relatedRecord: 'Fuel Log #4921',
    project: 'Zojila Tunnel (PKG-2)',
    projectShort: 'Zojila Tunnel',
    module: 'Energy',
    moduleDetail: 'Energy - Fuel & DG',
    docType: 'Invoice',
    docTypeFull: 'Invoice / Challan',
    typeColor: '#0284C7',
    typeBg: 'rgba(2, 132, 199, 0.12)',
    size: '1.2 MB',
    uploadedBy: 'Rohit Kumar',
    uploadedAt: '04 Oct 2026 10:24 AM',
    date: '04 Oct 2026',
    status: 'Verified',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    sha256: '9f8e7d6c5b4a312019e8d7c6b5a43210fe8b2c1a09d3e4f5a6b7c8d9e0f1a2b3',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'Rohit Kumar', time: '04 Oct 2026 10:24 AM', note: 'Original IOCL fuel delivery challan' },
      { action: 'Verified', user: 'K. Venkat (Reviewer)', time: '04 Oct 2026 12:45 PM', note: 'Quantity 4,500 L matched weighbridge receipt' }
    ],
    comments: [
      { user: 'K. Venkat', time: '04 Oct 2026 12:45 PM', text: 'Verified against Fuel Log batch #4921. Scope 1 calculation approved.' }
    ]
  },
  {
    id: 'ev-02',
    fileName: 'Electricity Bill Sep 2026.pdf',
    fileType: 'pdf',
    relatedRecord: 'Grid #801',
    project: 'Bengaluru Metro Phase 3',
    projectShort: 'Bengaluru Metro',
    module: 'Energy',
    moduleDetail: 'Energy - Grid Metering',
    docType: 'Utility Bill',
    docTypeFull: 'Electricity Utility Bill',
    typeColor: '#2563EB',
    typeBg: 'rgba(37, 99, 235, 0.12)',
    size: '2.1 MB',
    uploadedBy: 'K. Venkat',
    uploadedAt: '03 Oct 2026 03:15 PM',
    date: '03 Oct 2026',
    status: 'Pending',
    statusColor: '#D97706',
    statusBg: 'rgba(217, 119, 6, 0.12)',
    sha256: '8f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098f4a2c9e7b1d6f3a',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'K. Venkat', time: '03 Oct 2026 03:15 PM', note: 'BESCOM High Tension 66kV substation bill' }
    ],
    comments: []
  },
  {
    id: 'ev-03',
    fileName: 'Water Meter Reading.jpg',
    fileType: 'img',
    relatedRecord: 'Water #221',
    project: 'Krishna Water Supply',
    projectShort: 'Krishna Water Supply',
    module: 'Water',
    moduleDetail: 'Water - Pumphouse Discharge',
    docType: 'Photo',
    docTypeFull: 'Physical Meter Photo',
    typeColor: '#0891B2',
    typeBg: 'rgba(8, 145, 178, 0.12)',
    size: '0.8 MB',
    uploadedBy: 'Priyanka S.',
    uploadedAt: '02 Oct 2026 11:30 AM',
    date: '02 Oct 2026',
    status: 'Verified',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    sha256: '7e6d5c4b3a21098f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098e',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'Priyanka S.', time: '02 Oct 2026 11:30 AM', note: 'Site inspection flowmeter snapshot' },
      { action: 'Verified', user: 'Suresh Panyam', time: '02 Oct 2026 02:10 PM', note: 'Flow counter reading confirmed' }
    ],
    comments: []
  },
  {
    id: 'ev-04',
    fileName: 'Waste Manifest.pdf',
    fileType: 'pdf',
    relatedRecord: 'Waste #116',
    project: 'Hyderabad Infra Park',
    projectShort: 'Hyderabad Infra Park',
    module: 'Waste',
    moduleDetail: 'Hazardous Waste Form 10',
    docType: 'Manifest',
    docTypeFull: 'Hazardous Waste Manifest',
    typeColor: '#7C3AED',
    typeBg: 'rgba(124, 58, 237, 0.12)',
    size: '1.5 MB',
    uploadedBy: 'Jitendra Roy',
    uploadedAt: '02 Oct 2026 09:12 AM',
    date: '02 Oct 2026',
    status: 'Rejected',
    statusColor: '#DC2626',
    statusBg: 'rgba(220, 38, 38, 0.12)',
    sha256: '6d5c4b3a21098e7f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098f',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'Jitendra Roy', time: '02 Oct 2026 09:12 AM', note: 'TSPCB Form 10 manifest' },
      { action: 'Rejected', user: 'Rohit Kumar (Site Lead)', time: '02 Oct 2026 04:30 PM', note: 'Authorized TSPCB transporter signature missing on copy 3' }
    ],
    comments: [
      { user: 'Rohit Kumar', time: '02 Oct 2026 04:30 PM', text: 'Missing SPCB transporter stamp on Page 2. Please replace with signed copy.' }
    ]
  },
  {
    id: 'ev-05',
    fileName: 'Safety Training Attendance.pdf',
    fileType: 'pdf',
    relatedRecord: 'Safety #77',
    project: 'MEIL Energy Park',
    projectShort: 'MEIL Energy Park',
    module: 'Safety',
    moduleDetail: 'Zero-Harm HSE Induction',
    docType: 'Certificate',
    docTypeFull: 'Training Attendance Sheet',
    typeColor: '#4F46E5',
    typeBg: 'rgba(79, 70, 229, 0.12)',
    size: '0.9 MB',
    uploadedBy: 'Rohit Kumar',
    uploadedAt: '01 Oct 2026 04:45 PM',
    date: '01 Oct 2026',
    status: 'Verified',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    sha256: '5c4b3a21098e7d6f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098g',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'Rohit Kumar', time: '01 Oct 2026 04:45 PM', note: 'Batch of 45 technician HSE training logs' },
      { action: 'Verified', user: 'Jitendra Roy', time: '02 Oct 2026 09:00 AM', note: 'All signatures verified' }
    ],
    comments: []
  },
  {
    id: 'ev-06',
    fileName: 'Solar Generation Log Q2.xlsx',
    fileType: 'sheet',
    relatedRecord: 'Solar #104',
    project: 'MEIL Energy Park',
    projectShort: 'MEIL Energy Park',
    module: 'Energy',
    moduleDetail: 'Renewable Power Yield',
    docType: 'Spreadsheet',
    docTypeFull: 'SCADA Generation Log',
    typeColor: '#16A34A',
    typeBg: 'rgba(22, 163, 74, 0.12)',
    size: '3.4 MB',
    uploadedBy: 'K. Venkat',
    uploadedAt: '29 Sep 2026 11:20 AM',
    date: '29 Sep 2026',
    status: 'Verified',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    sha256: '4b3a21098e7d6f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098h',
    version: 'v1.0',
    history: [
      { action: 'Uploaded', user: 'K. Venkat', time: '29 Sep 2026 11:20 AM', note: 'Exported from Ingeteam SCADA server' }
    ],
    comments: []
  }
];

export default function EvidenceVault() {
  const [evidenceList, setEvidenceList] = useState(INITIAL_EVIDENCE);
  const [selectedId, setSelectedId] = useState('ev-01');
  const [activeTab, setActiveTab] = useState('Details');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Form State for Upload Modal
  const [uploadForm, setUploadForm] = useState({
    fileName: '',
    project: 'Zojila Tunnel (PKG-2)',
    module: 'Energy',
    relatedRecord: 'Fuel Log #4922',
    docType: 'Invoice',
    notes: ''
  });

  const activeDoc = useMemo(() => {
    return evidenceList.find((e) => e.id === selectedId) || evidenceList[0];
  }, [evidenceList, selectedId]);

  // Filtered List
  const filteredList = useMemo(() => {
    return evidenceList.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        e.fileName.toLowerCase().includes(q) ||
        e.relatedRecord.toLowerCase().includes(q) ||
        e.project.toLowerCase().includes(q) ||
        e.uploadedBy.toLowerCase().includes(q);

      const matchesProject = selectedProject === 'All' || e.project.includes(selectedProject);
      const matchesModule = selectedModule === 'All' || e.module === selectedModule;
      const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;

      return matchesSearch && matchesProject && matchesModule && matchesStatus;
    });
  }, [evidenceList, searchQuery, selectedProject, selectedModule, selectedStatus]);

  // Verification Handlers
  const handleVerify = (id) => {
    setEvidenceList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Verified',
          statusColor: '#16A34A',
          statusBg: 'rgba(22, 163, 74, 0.12)',
          history: [
            ...item.history,
            { action: 'Verified', user: 'Rohit Kumar (Site Lead)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Approved under ICAI Assurance standards' }
          ]
        };
      }
      return item;
    }));
  };

  const handleReject = (id) => {
    setEvidenceList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Rejected',
          statusColor: '#DC2626',
          statusBg: 'rgba(220, 38, 38, 0.12)',
          history: [
            ...item.history,
            { action: 'Rejected', user: 'Rohit Kumar (Site Lead)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Flagged for re-upload' }
          ]
        };
      }
      return item;
    }));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setEvidenceList(prev => prev.map(item => {
      if (item.id === activeDoc.id) {
        return {
          ...item,
          comments: [
            ...item.comments,
            { user: 'Rohit Kumar', time: 'Just now', text: newComment.trim() }
          ]
        };
      }
      return item;
    }));
    setNewComment('');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `ev-${Date.now().toString().slice(-4)}`,
      fileName: uploadForm.fileName || 'Site_Assurance_Doc.pdf',
      fileType: uploadForm.fileName.endsWith('.xlsx') ? 'sheet' : uploadForm.fileName.endsWith('.jpg') ? 'img' : 'pdf',
      relatedRecord: uploadForm.relatedRecord || 'ESG Record #501',
      project: uploadForm.project,
      projectShort: uploadForm.project.split(' ')[0],
      module: uploadForm.module,
      moduleDetail: `${uploadForm.module} Supporting Proof`,
      docType: uploadForm.docType,
      docTypeFull: `${uploadForm.docType} Document`,
      typeColor: '#0284C7',
      typeBg: 'rgba(2, 132, 199, 0.12)',
      size: '1.4 MB',
      uploadedBy: 'Rohit Kumar',
      uploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      statusColor: '#D97706',
      statusBg: 'rgba(217, 119, 6, 0.12)',
      sha256: '3a21098e7d6f4a2c9e7b1d6f3a5e8c4b2a9d7f1e3c5a7e6d5c4b3a21098i',
      version: 'v1.0',
      history: [
        { action: 'Uploaded', user: 'Rohit Kumar', time: 'Just now', note: uploadForm.notes || 'Initial document upload' }
      ],
      comments: []
    };

    setEvidenceList(prev => [newDoc, ...prev]);
    setSelectedId(newDoc.id);
    setIsUploadModalOpen(false);
  };

  const handleDownload = (doc) => {
    const content = `MEIL GROUP ESG EVIDENCE ASSURANCE RECORD
File: ${doc.fileName}
Related Record: ${doc.relatedRecord}
Project: ${doc.project}
Module: ${doc.module}
Status: ${doc.status}
SHA-256 Checksum: ${doc.sha256}
Uploaded By: ${doc.uploadedBy} on ${doc.uploadedAt}
ICAI Guidance Note 2024 / SEBI BRSR Assurance Ready`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'File Name', 'Related Record', 'Project', 'Module', 'Type', 'Size', 'Uploaded By', 'Date', 'Status', 'SHA-256'];
    const rows = filteredList.map((e, idx) => [
      idx + 1,
      `"${e.fileName}"`,
      `"${e.relatedRecord}"`,
      `"${e.project}"`,
      `"${e.module}"`,
      `"${e.docType}"`,
      `"${e.size}"`,
      `"${e.uploadedBy}"`,
      `"${e.date}"`,
      `"${e.status}"`,
      `"${e.sha256}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MEIL_Evidence_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const totalCount = evidenceList.length;
  const verifiedCount = evidenceList.filter(e => e.status === 'Verified').length;
  const pendingCount = evidenceList.filter(e => e.status === 'Pending').length;
  const rejectedCount = evidenceList.filter(e => e.status === 'Rejected').length;
  const missingCount = 8; // required by BRSR indicator compliance

  return (
    <div className="ev-container">

      {/* 1. Page Header */}
      <div className="ev-page-header">
        <div className="ev-header-left">
          <div className="ev-header-icon-box">
            <Briefcase size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="ev-page-title">Evidence Management</h1>
            <p className="ev-page-subtitle">
              Upload, manage and verify supporting documents for ESG data submissions.
            </p>
          </div>
        </div>

        <button 
          type="button" 
          className="ev-btn-primary-action"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Plus size={16} strokeWidth={2.6} />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* 2. Top 5 Summary Cards */}
      <div className="ev-summary-grid">
        
        {/* Card 1: Total Evidence */}
        <div className="ev-summary-card" onClick={() => setSelectedStatus('All')}>
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Total Evidence</div>
              <div className="ev-summary-val">{totalCount}</div>
              <div className="ev-summary-sub">Across Active Projects</div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <Layers size={18} color="#0284C7" />
          </div>
        </div>

        {/* Card 2: Verified */}
        <div className="ev-summary-card" onClick={() => setSelectedStatus('Verified')}>
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Verified</div>
              <div className="ev-summary-val">{verifiedCount}</div>
              <div className="ev-summary-sub" style={{ color: '#16A34A', fontWeight: 700 }}>
                {Math.round((verifiedCount / (totalCount || 1)) * 100)}%
              </div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <CheckCircle2 size={18} color="#16A34A" />
          </div>
        </div>

        {/* Card 3: Pending Review */}
        <div className="ev-summary-card" onClick={() => setSelectedStatus('Pending')}>
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <Clock size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Pending Review</div>
              <div className="ev-summary-val">{pendingCount}</div>
              <div className="ev-summary-sub" style={{ color: '#D97706', fontWeight: 700 }}>
                {Math.round((pendingCount / (totalCount || 1)) * 100)}%
              </div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <Clock size={18} color="#F59E0B" />
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div className="ev-summary-card" onClick={() => setSelectedStatus('Rejected')}>
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Rejected</div>
              <div className="ev-summary-val" style={{ color: '#DC2626' }}>{rejectedCount}</div>
              <div className="ev-summary-sub" style={{ color: '#DC2626', fontWeight: 700 }}>
                {Math.round((rejectedCount / (totalCount || 1)) * 100)}%
              </div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <AlertCircle size={18} color="#DC2626" />
          </div>
        </div>

        {/* Card 5: Missing */}
        <div className="ev-summary-card">
          <div className="ev-summary-left">
            <div className="ev-summary-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="ev-summary-title">Missing</div>
              <div className="ev-summary-val">{missingCount}</div>
              <div className="ev-summary-sub" style={{ color: '#D97706', fontWeight: 700 }}>
                Required for Audit
              </div>
            </div>
          </div>
          <div className="ev-summary-corner-icon">
            <AlertTriangle size={18} color="#D97706" />
          </div>
        </div>

      </div>

      {/* 3. Main 2-Column Section */}
      <div className="ev-main-grid">

        {/* ── LEFT MASTER CARD: Table & Filter Bar ──────────────── */}
        <div className="ev-table-card">

          {/* Filter Bar */}
          <div className="ev-filter-bar">
            {/* Search Input */}
            <div className="ev-search-box">
              <Search size={14} className="ev-search-icon" />
              <input
                type="text"
                placeholder="Search evidence, record, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ev-search-input"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="ev-filters-group">
              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">Project</span>
                <select 
                  value={selectedProject} 
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="ev-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Zojila Tunnel">Zojila Tunnel</option>
                  <option value="Bengaluru Metro">Bengaluru Metro</option>
                  <option value="Krishna Water Supply">Krishna Water Supply</option>
                  <option value="MEIL Energy Park">MEIL Energy Park</option>
                  <option value="Hyderabad Infra Park">Hyderabad Infra Park</option>
                </select>
              </div>

              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">Module</span>
                <select 
                  value={selectedModule} 
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="ev-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Energy">Energy</option>
                  <option value="Water">Water</option>
                  <option value="Waste">Waste</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">Status</span>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="ev-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="ev-filter-select-wrap">
                <span className="ev-filter-lbl">Date Range</span>
                <select className="ev-filter-select">
                  <option>Select Date</option>
                  <option>October 2026</option>
                  <option>September 2026</option>
                  <option>FY 2026-27 Q2</option>
                </select>
              </div>

              {/* View Switcher: List vs Grid */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '2px' }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>View</span>
                <div className="ev-view-toggle">
                  <button 
                    type="button" 
                    className={`ev-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={13} />
                  </button>
                  <button 
                    type="button" 
                    className={`ev-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={13} />
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <button 
                type="button" 
                className="ev-export-btn"
                onClick={handleExportCSV}
              >
                <Download size={12} />
                <span>Export</span>
                <ChevronDown size={10} />
              </button>
            </div>
          </div>

          {/* Evidence Table */}
          <div className="ev-table-wrapper">
            <table className="ev-table">
              <thead>
                <tr>
                  <th style={{ width: '20px' }}>#</th>
                  <th style={{ width: '24px' }}>File</th>
                  <th>Name</th>
                  <th>Related Record</th>
                  <th>Project</th>
                  <th>Module</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ width: '24px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((e, idx) => {
                  const isSelected = selectedId === e.id;
                  return (
                    <tr 
                      key={e.id}
                      className={isSelected ? 'is-selected' : ''}
                      onClick={() => setSelectedId(e.id)}
                    >
                      <td style={{ fontWeight: 600, color: '#64748B' }}>{idx + 1}</td>
                      
                      {/* File Icon */}
                      <td>
                        <div className="ev-file-icon" style={{
                          background: e.fileType === 'pdf' ? 'rgba(239, 68, 68, 0.1)' : e.fileType === 'sheet' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                          color: e.fileType === 'pdf' ? '#EF4444' : e.fileType === 'sheet' ? '#16A34A' : '#0284C7'
                        }}>
                          {e.fileType === 'pdf' ? <FileText size={13} /> : e.fileType === 'sheet' ? <FileSpreadsheet size={13} /> : <ImageIcon size={13} />}
                        </div>
                      </td>

                      {/* File Name */}
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>
                        {e.fileName}
                      </td>

                      {/* Related Record */}
                      <td style={{ color: '#0284C7', fontWeight: 600, fontFamily: 'monospace' }}>
                        {e.relatedRecord}
                      </td>

                      {/* Project */}
                      <td style={{ color: '#475569', fontWeight: 500 }}>
                        {e.projectShort}
                      </td>

                      {/* Module */}
                      <td style={{ color: '#334155', fontWeight: 600 }}>
                        {e.module}
                      </td>

                      {/* Type Badge */}
                      <td>
                        <span 
                          className="ev-badge-type"
                          style={{ color: e.typeColor, background: e.typeBg }}
                        >
                          {e.docType}
                        </span>
                      </td>

                      {/* Size */}
                      <td style={{ color: '#64748B' }}>
                        {e.size}
                      </td>

                      {/* Uploaded By */}
                      <td style={{ color: '#334155', fontWeight: 500 }}>
                        {e.uploadedBy}
                      </td>

                      {/* Date */}
                      <td style={{ color: '#64748B' }}>
                        {e.date}
                      </td>

                      {/* Status */}
                      <td>
                        <span 
                          className="ev-badge-type"
                          style={{ color: e.statusColor, background: e.statusBg }}
                        >
                          {e.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleDownload(e);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94A3B8' }}
                          title="Download Evidence File"
                        >
                          <Download size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={12} style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                      No matching evidence files found. Click "+ Upload Evidence" to attach documents.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Evidence Details Panel ───────────────── */}
        <div className="ev-details-panel">
          
          {/* Header */}
          <div className="ev-details-header">
            <div className="ev-details-title-row">
              <h3 className="ev-details-title">Evidence Details</h3>
              <span 
                className="ev-badge-type"
                style={{ color: activeDoc.statusColor, background: activeDoc.statusBg, fontSize: '10px' }}
              >
                {activeDoc.status}
              </span>
            </div>
            <button 
              type="button"
              onClick={() => setSelectedId(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Document Preview Graphic Card */}
          <div className="ev-doc-preview-box">
            <div className="ev-doc-preview-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', background: '#DC2626', borderRadius: '3px', color: '#FFF', fontSize: '9px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A' }}>MEIL OFFICIAL ASSURANCE</span>
              </div>
              <span style={{ fontSize: '9px', color: '#64748B', fontFamily: 'monospace' }}>SHA-256 CHECKED</span>
            </div>
            <div className="ev-doc-preview-lines">
              <div className="ev-doc-line" style={{ width: '70%', background: '#CBD5E1' }} />
              <div className="ev-doc-line" style={{ width: '90%' }} />
              <div className="ev-doc-line" style={{ width: '85%' }} />
              <div className="ev-doc-line" style={{ width: '40%' }} />
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '8.5px', color: '#16A34A', fontWeight: 700 }}>✓ ICAI Guideline 2024 Audit Traceable</span>
              <span style={{ fontSize: '8.5px', color: '#94A3B8' }}>{activeDoc.size}</span>
            </div>
          </div>

          {/* Contextual Tabs */}
          <div className="ev-context-tabs">
            {['Details', 'Preview', 'History', 'Comments'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`ev-context-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'Details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="ev-overview-fields">
                <div className="ev-overview-row">
                  <span className="ev-field-label">File Name</span>
                  <span className="ev-field-val" style={{ color: '#0284C7', wordBreak: 'break-all' }}>{activeDoc.fileName}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Related Record</span>
                  <span className="ev-field-val">{activeDoc.relatedRecord}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Project</span>
                  <span className="ev-field-val">{activeDoc.project}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Module</span>
                  <span className="ev-field-val">{activeDoc.moduleDetail}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Document Type</span>
                  <span className="ev-field-val">{activeDoc.docTypeFull}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Uploaded By</span>
                  <span className="ev-field-val">{activeDoc.uploadedBy}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Uploaded At</span>
                  <span className="ev-field-val">{activeDoc.uploadedAt}</span>
                </div>
                <div className="ev-overview-row">
                  <span className="ev-field-label">Status</span>
                  <span className="ev-field-val" style={{ color: activeDoc.statusColor }}>{activeDoc.status}</span>
                </div>
              </div>

              {/* Actions Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <button 
                  type="button" 
                  className="ev-btn-download"
                  onClick={() => handleDownload(activeDoc)}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>

                {activeDoc.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      type="button"
                      onClick={() => handleVerify(activeDoc.id)}
                      style={{ flex: 1, padding: '7px', background: '#16A34A', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Verify Evidence
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleReject(activeDoc.id)}
                      style={{ flex: 1, padding: '7px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Preview */}
          {activeTab === 'Preview' && (
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.18)', fontSize: '11px' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>Cryptographic Hash & Integrity</div>
              <div style={{ fontFamily: 'monospace', color: '#475569', fontSize: '10px', wordBreak: 'break-all', background: '#F1F5F9', padding: '6px', borderRadius: '4px' }}>
                {activeDoc.sha256}
              </div>
              <div style={{ marginTop: '10px', color: '#64748B' }}>
                Standard: Indian ICAI Standard on Assurance Engagements (SAE 3410).
              </div>
            </div>
          )}

          {/* Tab 3: History */}
          {activeTab === 'History' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {activeDoc.history.map((h, i) => (
                <div key={i} style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.6)', borderRadius: '6px', border: '1px solid rgba(148,163,184,0.12)', fontSize: '10.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0F172A' }}>
                    <span>{h.action}</span>
                    <span style={{ color: '#64748B', fontWeight: 400 }}>{h.time}</span>
                  </div>
                  <div style={{ color: '#475569', marginTop: '2px' }}>{h.user}</div>
                  <div style={{ color: '#64748B', fontSize: '10px', fontStyle: 'italic' }}>{h.note}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Comments */}
          {activeTab === 'Comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
                {activeDoc.comments.map((c, i) => (
                  <div key={i} style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.6)', borderRadius: '6px', border: '1px solid rgba(148,163,184,0.12)', fontSize: '10.5px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{c.user} <span style={{ color: '#94A3B8', fontWeight: 400 }}>• {c.time}</span></div>
                    <div style={{ color: '#334155', marginTop: '2px' }}>{c.text}</div>
                  </div>
                ))}
                {activeDoc.comments.length === 0 && (
                  <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', padding: '12px' }}>
                    No comments yet for this document.
                  </div>
                )}
              </div>

              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <input 
                  type="text" 
                  placeholder="Add verification note..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ flex: 1, padding: '5px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '5px 10px', background: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                  Post
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* 4. Bottom 2 Cards Grid */}
      <div className="ev-bottom-grid">

        {/* Card 1: Evidence Status by Module */}
        <div className="ev-bottom-card">
          <div className="ev-bottom-card-header">
            <span className="ev-bottom-card-title">Evidence Status by Module</span>
            <button type="button" className="ev-bottom-pill-btn">
              View Details
            </button>
          </div>

          <div className="ev-rings-row">
            {[
              { label: 'Energy', pct: 86, color: '#10B981' },
              { label: 'Water', pct: 72, color: '#258BE6' },
              { label: 'Waste', pct: 68, color: '#F59E0B' },
              { label: 'Safety', pct: 90, color: '#10B981' },
              { label: 'Social', pct: 78, color: '#0284C7' },
              { label: 'Governance', pct: 75, color: '#2563EB' }
            ].map((m, idx) => (
              <div key={idx} className="ev-ring-pod">
                <div className="ev-ring-svg-wrap">
                  <svg width="52" height="52" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={m.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${m.pct} 100`}
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <span className="ev-ring-center-txt">{m.pct}%</span>
                </div>
                <span className="ev-ring-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Recent Evidence Activity */}
        <div className="ev-bottom-card">
          <div className="ev-bottom-card-header">
            <span className="ev-bottom-card-title">Recent Evidence Activity</span>
            <button type="button" className="ev-bottom-pill-btn">
              View All
            </button>
          </div>

          <div className="ev-activity-list">
            <div className="ev-activity-item">
              <div className="ev-activity-left">
                <div className="ev-activity-icon" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="ev-activity-title">Diesel Challan verified • Zojila Tunnel (PKG-2)</div>
                  <div className="ev-activity-sub">Verified by K. Venkat (Reviewer)</div>
                </div>
              </div>
              <span className="ev-activity-time">2 hrs ago</span>
            </div>

            <div className="ev-activity-item">
              <div className="ev-activity-left">
                <div className="ev-activity-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                  <UploadCloud size={16} />
                </div>
                <div>
                  <div className="ev-activity-title">New evidence uploaded • Krishna Water Supply</div>
                  <div className="ev-activity-sub">Uploaded by Priyanka S. (EHS Officer)</div>
                </div>
              </div>
              <span className="ev-activity-time">4 hrs ago</span>
            </div>

            <div className="ev-activity-item">
              <div className="ev-activity-left">
                <div className="ev-activity-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
                  <AlertCircle size={16} />
                </div>
                <div>
                  <div className="ev-activity-title">Evidence rejected • Waste Manifest (Missing Sign)</div>
                  <div className="ev-activity-sub">Flagged by Rohit Kumar (Site Lead)</div>
                </div>
              </div>
              <span className="ev-activity-time">1 day ago</span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Liquid Glass Modal: + Upload Evidence */}
      {isUploadModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(24px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadCloud size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Upload Evidence Document</h3>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>Attach supporting verification proof for ESG audit trail</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsUploadModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Document File Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Fuel_Invoice_IOCL_Oct2026.pdf" 
                  value={uploadForm.fileName}
                  onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Project / Site
                  </label>
                  <select 
                    value={uploadForm.project}
                    onChange={(e) => setUploadForm({ ...uploadForm, project: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="Zojila Tunnel (PKG-2)">Zojila Tunnel (PKG-2)</option>
                    <option value="Bengaluru Metro Phase 3">Bengaluru Metro Phase 3</option>
                    <option value="Krishna Water Supply">Krishna Water Supply</option>
                    <option value="MEIL Energy Park">MEIL Energy Park</option>
                    <option value="Hyderabad Infra Park">Hyderabad Infra Park</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    ESG Module
                  </label>
                  <select 
                    value={uploadForm.module}
                    onChange={(e) => setUploadForm({ ...uploadForm, module: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="Energy">Energy (Scope 1 & 2)</option>
                    <option value="Water">Water Withdrawal & ZLD</option>
                    <option value="Waste">Waste Circularity</option>
                    <option value="Safety">Safety & Zero Harm</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Related ESG Record ID
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Fuel Log #4922" 
                    value={uploadForm.relatedRecord}
                    onChange={(e) => setUploadForm({ ...uploadForm, relatedRecord: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Document Type
                  </label>
                  <select 
                    value={uploadForm.docType}
                    onChange={(e) => setUploadForm({ ...uploadForm, docType: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="Invoice">Invoice</option>
                    <option value="Utility Bill">Utility Bill</option>
                    <option value="Photo">Meter Reading Photo</option>
                    <option value="Manifest">Hazardous Manifest</option>
                    <option value="Certificate">Certificate / Audit</option>
                    <option value="Spreadsheet">Spreadsheet / SCADA</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Verification Notes / Source Description
                </label>
                <textarea 
                  rows={2}
                  placeholder="Enter details on calibration date, meter numbers, or weighbridge slip numbers..."
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsUploadModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'transparent', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#475569' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#2563EB', color: '#FFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
export { EvidenceVault };
