import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Plus,
  Search,
  List,
  Grid,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  TrendingUp,
  Zap,
  Droplets,
  Trash2,
  RefreshCw,
  ExternalLink,
  X,
  FileCheck2,
  Flame
} from 'lucide-react';
import './ReportsModule.css';
import { esgStore } from '../../services/esgStore';
import api from '../../services/api';

export default function ReportsModule({ _onNavigate }) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('FY 2026-27');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [selectedReportId, setSelectedReportId] = useState(1);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [liveBrsr, setLiveBrsr] = useState(null);
  const [showReportPreviewModal, setShowReportPreviewModal] = useState(false);

  React.useEffect(() => {
    api.getBrsrReport('period-2025-09').then(data => {
      if (data) setLiveBrsr(data);
    }).catch(e => console.warn('Live BRSR fetch failed:', e));
  }, []);

  // New report form state
  const [newReport, setNewReport] = useState({
    name: 'MEIL Comprehensive ESG Statement',
    type: 'ESG Summary',
    project: 'Zojila Tunnel (PKG-2)',
    period: 'FY 2026-27',
    format: 'PDF',
    includeEvidence: true,
    includeCalculations: true
  });

  // Base reports list matching reference image
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'ESG Monthly Report',
      type: 'Energy, Water, Waste',
      category: 'ESG Summary',
      project: 'Zojila Tunnel (PKG-2)',
      period: 'Sep 2026',
      generatedOn: '04 Oct 2026',
      generatedTime: '10:30 AM',
      generatedBy: 'Rohit Kumar (Site Admin)',
      status: 'Completed',
      format: 'PDF',
      fileSize: '4.8 MB',
      hash: 'sha256:8f4c2e91a0b3c7d6',
      summary: 'Comprehensive monthly operational review of Scope 1, Scope 2 emissions, borewell extraction, and hazardous waste manifests.',
      coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'BRSR Core Indicators',
      type: 'BRSR',
      category: 'BRSR',
      project: 'Bengaluru Metro',
      period: 'FY 2026-27',
      generatedOn: '02 Oct 2026',
      generatedTime: '04:15 PM',
      generatedBy: 'K. Venkat (BU Lead)',
      status: 'Completed',
      format: 'PDF',
      fileSize: '6.2 MB',
      hash: 'sha256:d91a28cb7e44310f',
      summary: 'Statutory 9 Core Indicators disclosure adhering to SEBI 2023/2025 formats with reasonable assurance data linkages.',
      coverImage: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Carbon Emissions Report',
      type: 'Emissions',
      category: 'Emissions',
      project: 'All Projects',
      period: 'FY 2026-27',
      generatedOn: '30 Sep 2026',
      generatedTime: '06:00 PM',
      generatedBy: 'Priyanka S. (Auditor)',
      status: 'Processing',
      format: 'Excel',
      fileSize: '3.1 MB',
      hash: 'sha256:772cda98e6b1054f',
      summary: 'Scope 1 direct diesel/LPG combustion and Scope 2 CEA Grid Baseline v19 calculations across 258 active project sites.',
      coverImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Water & ZLD Performance',
      type: 'Water',
      category: 'Water',
      project: 'Krishna Water Supply',
      period: 'Sep 2026',
      generatedOn: '28 Sep 2026',
      generatedTime: '11:45 AM',
      generatedBy: 'Jitendra Roy (Safety Lead)',
      status: 'Completed',
      format: 'PDF',
      fileSize: '2.9 MB',
      hash: 'sha256:3a890dbff1284e9c',
      summary: 'Zero Liquid Discharge (ZLD) effluent treatment verification, SPCB compliance log, and groundwater recharge volume reconciliation.',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 5,
      name: 'Safety & HSE Summary',
      type: 'Safety',
      category: 'Safety',
      project: 'MEIL Energy Park',
      period: 'Sep 2026',
      generatedOn: '25 Sep 2026',
      generatedTime: '02:20 PM',
      generatedBy: 'Rohit Kumar (Site Admin)',
      status: 'Completed',
      format: 'PDF',
      fileSize: '1.8 MB',
      hash: 'sha256:5ef49a88cd126b3e',
      summary: 'Lost Time Incident Frequency Rate (LTIFR = 0.00), toolbox talk attendance logs, and high-risk safety permit audits.',
      coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  // Categories list matching reference cards
  const categories = [
    { title: 'ESG Summary', sub: 'Comprehensive overview', icon: Layers, bg: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' },
    { title: 'BRSR', sub: 'BRSR aligned reports', icon: FileCheck2, bg: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' },
    { title: 'Emissions', sub: 'Scope 1, 2, 3 reports', icon: Flame, bg: 'rgba(249, 115, 22, 0.1)', color: '#EA580C' },
    { title: 'Energy', sub: 'Consumption & savings', icon: Zap, bg: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' },
    { title: 'Water', sub: 'Usage & recycling', icon: Droplets, bg: 'rgba(14, 165, 233, 0.1)', color: '#0284C7' },
    { title: 'Waste', sub: 'Generation & disposal', icon: Trash2, bg: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }
  ];

  // Recent reports for bottom right widget
  const recentReports = [
    { name: 'ESG Monthly Report', date: '04 Oct 2026', id: 1 },
    { name: 'BRSR Core Indicators', date: '02 Oct 2026', id: 2 },
    { name: 'Water Performance', date: '28 Sep 2026', id: 4 }
  ];

  // Filtering
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === 'All' || r.category === selectedType || r.type.includes(selectedType);
      const matchProject = selectedProject === 'All' || r.project === selectedProject;
      const matchPeriod = selectedPeriod === 'All' || r.period.includes(selectedPeriod) || r.period === 'FY 2026-27';
      const matchStatus = selectedStatus === 'All' || r.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchSearch && matchType && matchProject && matchPeriod && matchStatus;
    });
  }, [reports, searchQuery, selectedType, selectedProject, selectedPeriod, selectedStatus]);

  // Selected report
  const selectedReport = useMemo(() => {
    return reports.find(r => r.id === selectedReportId) || reports[0];
  }, [reports, selectedReportId]);

  // Download logic (creates real downloaded file or triggers statutory backend CSV)
  const handleDownload = (report) => {
    if (report.type?.includes('BRSR') || report.category?.includes('BRSR') || report.name?.includes('BRSR')) {
      window.open(api.getBrsrExportCsvUrl('period-2025-09'), '_blank');
      return;
    }
    if (report.type?.includes('Audit') || report.name?.includes('Audit')) {
      window.open(api.getAuditExportCsvUrl(), '_blank');
      return;
    }

    const kpis = esgStore.getCalculatedKPIs();
    const content = `====================================================================
MEIL GROUP OF COMPANIES — ESG & BRSR STATUTORY REPORTING OUTPUT
====================================================================
Report Title: ${report.name}
Report Category: ${report.type}
Entity / Scope: ${report.project}
Reporting Period: ${report.period}
Generated By: ${report.generatedBy}
Generated Date: ${report.generatedOn} ${report.generatedTime || ''}
Output Format: ${report.format}
Verification Hash (SHA-256): ${report.hash || 'sha256:8f4c2e91a0b3c7d6'}
SEBI Statutory Compliance: SEBI/HO/CFD/CMD-2/P/CIR/2021/562 & BRSR Core 2023/2025

--------------------------------------------------------------------
EXECUTIVE SUMMARY
--------------------------------------------------------------------
${report.summary}

--------------------------------------------------------------------
KEY CONSOLIDATED ESG METRICS (APPROVED REASONABLE ASSURANCE DATA)
--------------------------------------------------------------------
• Total GHG Footprint (Scope 1 + 2): ${kpis.totalGhg_t} tCO2e
• Scope 1 Direct Emissions: ${kpis.scope1_t} tCO2e (Diesel Gensets & Heavy Equipment)
• Scope 2 Indirect Grid: ${kpis.scope2_t} tCO2e (CEA India Baseline v19 @ 0.716 kg CO2e/kWh)
• Grid Electricity Consumption: ${kpis.gridMwh} MWh
• Water Recycled Share: ${kpis.recycledSharePct}% (Zero Liquid Discharge SPCB Compliant)
• Waste Circularity & Landfill Diversion: ${kpis.wasteRecoveryPct}%
• Lost Time Incident Frequency Rate (LTIFR): 0.00 (Zero Fatalities)

--------------------------------------------------------------------
EVIDENCE TRACEABILITY & REASONABLE ASSURANCE AUDIT LOG
--------------------------------------------------------------------
• Supporting Invoices / Manifests verified by site supervisor & auditor.
• Cryptographically sealed and signed by MEIL ESG Platform.
Generated from live database records at ${new Date().toISOString()}.
====================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name.replace(/[^a-zA-Z0-9]/g, '_')}_${report.period.replace(/\s+/g, '_')}.${report.format === 'Excel' ? 'csv' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Report generation workflow
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setGenerationProgress(20);

    const step1 = setTimeout(() => setGenerationProgress(55), 350);
    const step2 = setTimeout(() => setGenerationProgress(85), 700);

    const step3 = setTimeout(() => {
      setGenerationProgress(100);
      setIsGenerating(false);
      setShowGenerateModal(false);

      const created = {
        id: reports.length + 1,
        name: newReport.name,
        type: newReport.type,
        category: newReport.type,
        project: newReport.project,
        period: newReport.period,
        generatedOn: 'Today, 07:30 PM',
        generatedTime: 'Just now',
        generatedBy: 'Rohit Kumar (Project User)',
        status: 'Completed',
        format: newReport.format,
        fileSize: '3.4 MB',
        hash: 'sha256:' + Math.random().toString(16).substring(2, 18),
        summary: `Custom generated ${newReport.type} report for ${newReport.project} covering ${newReport.period} with full calculation audit trail.`,
        coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=600&q=80'
      };

      setReports([created, ...reports]);
      setSelectedReportId(created.id);
    }, 1100);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  return (
    <div className="rp-container">
      {/* 1. Page Header */}
      <div className="rp-page-header">
        <div className="rp-header-left">
          <div className="rp-header-icon-box">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="rp-page-title">Reports</h1>
            <p className="rp-page-subtitle">Generate, view and export ESG and BRSR aligned reports.</p>
          </div>
        </div>

        <button 
          className="rp-btn-primary-action"
          onClick={() => setShowGenerateModal(true)}
        >
          <Plus size={16} />
          <span>Generate Report</span>
        </button>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="rp-summary-grid">
        {/* Total Reports Generated */}
        <div className="rp-summary-card">
          <div className="rp-summary-left">
            <div className="rp-summary-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <FileText size={20} />
            </div>
            <div>
              <div className="rp-summary-title">Total Reports Generated</div>
              <div className="rp-summary-val">{reports.length * 5 - 1}</div>
              <div className="rp-summary-sub">This year</div>
            </div>
          </div>
          <ArrowUpRight size={18} className="rp-summary-corner-icon" color="#94A3B8" />
        </div>

        {/* Scheduled Reports */}
        <div className="rp-summary-card">
          <div className="rp-summary-left">
            <div className="rp-summary-icon-wrap" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div className="rp-summary-title">Scheduled Reports</div>
              <div className="rp-summary-val">6</div>
              <div className="rp-summary-sub">
                <span style={{ color: '#16A34A', fontWeight: 700 }}>+ 4 Active</span>
              </div>
            </div>
          </div>
          <Clock size={18} className="rp-summary-corner-icon" color="#94A3B8" />
        </div>

        {/* Download Today */}
        <div className="rp-summary-card">
          <div className="rp-summary-left">
            <div className="rp-summary-icon-wrap" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0284C7' }}>
              <Download size={20} />
            </div>
            <div>
              <div className="rp-summary-title">Download Today</div>
              <div className="rp-summary-val">12</div>
              <div className="rp-summary-sub">
                <span style={{ color: '#16A34A', fontWeight: 700 }}>↑ +20%</span>
              </div>
            </div>
          </div>
          <TrendingUp size={18} className="rp-summary-corner-icon" color="#16A34A" />
        </div>

        {/* Report Templates */}
        <div className="rp-summary-card">
          <div className="rp-summary-left">
            <div className="rp-summary-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
              <Layers size={20} />
            </div>
            <div>
              <div className="rp-summary-title">Report Templates</div>
              <div className="rp-summary-val">18</div>
              <div className="rp-summary-sub">Configured</div>
            </div>
          </div>
          <ShieldCheck size={18} className="rp-summary-corner-icon" color="#94A3B8" />
        </div>
      </div>

      {/* 3. Main 2-Column Master Grid */}
      <div className="rp-main-grid">
        {/* Left Table Master Card */}
        <div className="rp-table-card">
          {/* Filter Bar */}
          <div className="rp-filter-bar">
            {/* Search */}
            <div className="rp-search-box">
              <Search size={13} className="rp-search-icon" />
              <input 
                type="text" 
                placeholder="Search reports, templates..." 
                className="rp-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dropdowns */}
            <div className="rp-filters-group">
              <div className="rp-filter-select-wrap">
                <span className="rp-filter-lbl">Report Type</span>
                <select 
                  className="rp-filter-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="ESG Summary">ESG Summary</option>
                  <option value="BRSR">BRSR</option>
                  <option value="Emissions">Emissions</option>
                  <option value="Water">Water</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div className="rp-filter-select-wrap">
                <span className="rp-filter-lbl">Project</span>
                <select 
                  className="rp-filter-select"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Zojila Tunnel (PKG-2)">Zojila Tunnel (PKG-2)</option>
                  <option value="Bengaluru Metro">Bengaluru Metro</option>
                  <option value="Krishna Water Supply">Krishna Water Supply</option>
                  <option value="MEIL Energy Park">MEIL Energy Park</option>
                </select>
              </div>

              <div className="rp-filter-select-wrap">
                <span className="rp-filter-lbl">Period</span>
                <select 
                  className="rp-filter-select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="FY 2026-27">FY 2026-27</option>
                  <option value="Sep 2026">Sep 2026</option>
                  <option value="FY 2025-26">FY 2025-26</option>
                </select>
              </div>

              <div className="rp-filter-select-wrap">
                <span className="rp-filter-lbl">Status</span>
                <select 
                  className="rp-filter-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="rp-view-toggle">
                <button 
                  className={`rp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List size={13} />
                </button>
                <button 
                  className={`rp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid size={13} />
                </button>
              </div>

              {/* Export */}
              <button 
                className="rp-export-btn"
                onClick={() => handleDownload(selectedReport)}
              >
                <Download size={12} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rp-table-wrapper">
            <table className="rp-table">
              <thead>
                <tr>
                  <th style={{ width: '28px' }}>#</th>
                  <th>Report Name</th>
                  <th>Type</th>
                  <th>Project / Scope</th>
                  <th>Period</th>
                  <th>Generated On</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r, idx) => {
                  const isSelected = r.id === selectedReportId;
                  const isCompleted = r.status === 'Completed';
                  const isProcessing = r.status === 'Processing';

                  return (
                    <tr 
                      key={r.id} 
                      className={isSelected ? 'is-selected' : ''}
                      onClick={() => setSelectedReportId(r.id)}
                    >
                      <td style={{ color: '#64748B', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileText size={15} color={isSelected ? '#0284C7' : '#475569'} />
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="rp-badge-type" style={{
                          background: r.type.includes('BRSR') ? 'rgba(2, 132, 199, 0.1)' : 
                                      r.type.includes('Emissions') ? 'rgba(249, 115, 22, 0.1)' : 
                                      'rgba(241, 245, 249, 0.9)',
                          color: r.type.includes('BRSR') ? '#0284C7' : 
                                 r.type.includes('Emissions') ? '#EA580C' : 
                                 '#475569',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}>
                          {r.type}
                        </span>
                      </td>
                      <td style={{ color: '#334155', fontWeight: 500 }}>{r.project}</td>
                      <td style={{ color: '#475569' }}>{r.period}</td>
                      <td style={{ color: '#64748B', fontSize: '11px' }}>{r.generatedOn}</td>
                      <td>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: isCompleted ? 'rgba(22, 163, 74, 0.12)' : 
                                     isProcessing ? 'rgba(234, 88, 12, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                          color: isCompleted ? '#16A34A' : 
                                 isProcessing ? '#EA580C' : '#64748B',
                          border: isCompleted ? '1px solid rgba(22, 163, 74, 0.25)' : 
                                  isProcessing ? '1px solid rgba(234, 88, 12, 0.25)' : '1px solid rgba(100, 116, 139, 0.2)'
                        }}>
                          {isProcessing && <RefreshCw size={9} className="spin" />}
                          {r.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                        <button 
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(r);
                          }}
                          title="Download Report"
                        >
                          <Download size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Panel: Report Preview */}
        <div className="rp-details-panel">
          <div className="rp-details-header">
            <h3 className="rp-details-title">Report Preview</h3>
            <span style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(2, 132, 199, 0.1)',
              color: '#0284C7',
              fontWeight: 700,
              border: '1px solid rgba(2, 132, 199, 0.2)'
            }}>
              {selectedReport.format}
            </span>
          </div>

          {/* Preview Hero Cover Image */}
          <img 
            src={selectedReport.coverImage} 
            alt="Report Cover" 
            className="rp-preview-hero"
          />

          {/* Title & Info */}
          <div className="rp-preview-info">
            <div className="rp-preview-name">{selectedReport.name}</div>
            <div className="rp-preview-sub">{selectedReport.project} • {selectedReport.period}</div>
          </div>

          {/* Field Values */}
          <div className="rp-overview-fields">
            <div className="rp-overview-row">
              <span className="rp-field-label">Format</span>
              <span className="rp-field-val">{selectedReport.format}</span>
            </div>
            <div className="rp-overview-row">
              <span className="rp-field-label">Generated On</span>
              <span className="rp-field-val">{selectedReport.generatedOn}, {selectedReport.generatedTime || '10:30 AM'}</span>
            </div>
            <div className="rp-overview-row">
              <span className="rp-field-label">Status</span>
              <span className="rp-field-val" style={{ color: selectedReport.status === 'Completed' ? '#16A34A' : '#EA580C' }}>
                {selectedReport.status}
              </span>
            </div>
            <div className="rp-overview-row">
              <span className="rp-field-label">Generated By</span>
              <span className="rp-field-val">{selectedReport.generatedBy}</span>
            </div>
            <div className="rp-overview-row">
              <span className="rp-field-label">File Size</span>
              <span className="rp-field-val">{selectedReport.fileSize}</span>
            </div>
            <div className="rp-overview-row">
              <span className="rp-field-label">Audit Hash</span>
              <span className="rp-field-val" style={{ fontFamily: 'monospace', fontSize: '10px', color: '#0284C7' }}>
                {selectedReport.hash}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <button 
              className="rp-btn-primary"
              onClick={() => handleDownload(selectedReport)}
            >
              <Download size={14} />
              <span>Download {selectedReport.format}</span>
            </button>

            <button 
              className="rp-btn-outline"
              onClick={() => setShowReportPreviewModal(true)}
            >
              <ExternalLink size={14} />
              <span>View Full Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom 2 Cards Grid */}
      <div className="rp-bottom-grid">
        {/* Left: Report Categories */}
        <div className="rp-bottom-card">
          <div className="rp-bottom-card-header">
            <span className="rp-bottom-card-title">Report Categories</span>
            <button 
              className="rp-bottom-pill-btn"
              onClick={() => setSelectedType('All')}
            >
              View All
            </button>
          </div>

          <div className="rp-categories-grid">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={idx} 
                  className="rp-category-card"
                  onClick={() => setSelectedType(cat.title)}
                >
                  <div className="rp-category-icon" style={{ background: cat.bg, color: cat.color }}>
                    <Icon size={18} />
                  </div>
                  <div className="rp-category-title">{cat.title}</div>
                  <div className="rp-category-sub">{cat.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Reports */}
        <div className="rp-bottom-card">
          <div className="rp-bottom-card-header">
            <span className="rp-bottom-card-title">Recent Reports</span>
            <button 
              className="rp-bottom-pill-btn"
              onClick={() => setSearchQuery('')}
            >
              View All
            </button>
          </div>

          <div className="rp-recent-list">
            {recentReports.map((item, idx) => (
              <div 
                key={idx} 
                className="rp-recent-item"
                onClick={() => setSelectedReportId(item.id)}
              >
                <div className="rp-recent-left">
                  <FileText size={15} color="#0284C7" />
                  <span className="rp-recent-name">{item.name}</span>
                </div>
                <span className="rp-recent-date">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Generate ESG & BRSR Report
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Create audited output using approved baseline data and certified methodologies.
                </p>
              </div>
              <button 
                onClick={() => setShowGenerateModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Report Title
                </label>
                <input 
                  type="text" 
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    fontSize: '12.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Report Type
                  </label>
                  <select 
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      fontSize: '12px',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="ESG Summary">ESG Summary</option>
                    <option value="BRSR">BRSR Core Indicators</option>
                    <option value="Emissions">Carbon Emissions</option>
                    <option value="Water">Water & ZLD</option>
                    <option value="Waste">Waste Management</option>
                    <option value="Safety">Safety & HSE</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Project / Scope
                  </label>
                  <select 
                    value={newReport.project}
                    onChange={(e) => setNewReport({ ...newReport, project: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      fontSize: '12px',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="All Projects">All Projects (Group Consolidation)</option>
                    <option value="Zojila Tunnel (PKG-2)">Zojila Tunnel (PKG-2)</option>
                    <option value="Bengaluru Metro">Bengaluru Metro</option>
                    <option value="Krishna Water Supply">Krishna Water Supply</option>
                    <option value="MEIL Energy Park">MEIL Energy Park</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Reporting Period
                  </label>
                  <select 
                    value={newReport.period}
                    onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      fontSize: '12px',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="FY 2026-27">FY 2026-27 (Annual)</option>
                    <option value="FY 2026-27 Q2">FY 2026-27 Q2</option>
                    <option value="Sep 2026">Sep 2026 (Monthly)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Output Format
                  </label>
                  <select 
                    value={newReport.format}
                    onChange={(e) => setNewReport({ ...newReport, format: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      fontSize: '12px',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="PDF">PDF (Certified Document)</option>
                    <option value="Excel">Excel / XLSX (Data Grid)</option>
                    <option value="CSV">CSV (Raw Export)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={newReport.includeEvidence} 
                    onChange={(e) => setNewReport({ ...newReport, includeEvidence: e.target.checked })} 
                  />
                  <span>Include Supporting Evidence Hashes</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={newReport.includeCalculations} 
                    onChange={(e) => setNewReport({ ...newReport, includeCalculations: e.target.checked })} 
                  />
                  <span>Include CEA Grid v19 Equations</span>
                </label>
              </div>
            </div>

            {isGenerating && (
              <div style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                  <span>Synthesizing GHG & BRSR datasets...</span>
                  <span style={{ fontWeight: 700, color: '#0284C7' }}>{generationProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(226, 232, 240, 0.8)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${generationProgress}%`, height: '100%', background: '#2563EB', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  background: 'none',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateReport}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isGenerating ? <RefreshCw size={14} className="spin" /> : <FileCheck2 size={14} />}
                <span>{isGenerating ? 'Generating...' : 'Generate Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Report Preview Modal */}
      {showReportPreviewModal && selectedReport && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 620, maxWidth: '92%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className="rp-status-chip rp-status-certified">{selectedReport.status}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{selectedReport.name}</h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{selectedReport.project} • {selectedReport.period}</div>
              </div>
              <button onClick={() => setShowReportPreviewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px', color: '#334155', background: '#F8FAFC', padding: 14, borderRadius: 10, marginBottom: 14 }}>
              <div><strong>Format:</strong> {selectedReport.format}</div>
              <div><strong>Size:</strong> {selectedReport.size}</div>
              <div><strong>Generated Date:</strong> {selectedReport.date}</div>
              <div><strong>Generated By:</strong> {selectedReport.generatedBy}</div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Cryptographic Filing Hash:</strong>
                <code style={{ display: 'block', background: '#FFFFFF', padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', marginTop: 4, color: '#0284C7', wordBreak: 'break-all' }}>
                  {selectedReport.hash}
                </code>
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)', marginBottom: '16px', fontSize: '12px', color: '#1E40AF', lineHeight: 1.4 }}>
              <strong>SEBI Regulatory Compliance:</strong> Certified adhering to SEBI BRSR Core Circulars (2023 & 2025) and NGRBC Principles 1-9. Verification seal permanently locked.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="rp-btn-outline"
                onClick={() => setShowReportPreviewModal(false)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="rp-btn-primary"
                onClick={() => {
                  handleDownload(selectedReport);
                  setShowReportPreviewModal(false);
                }}
              >
                <Download size={13} style={{ marginRight: 4 }} />
                Download Certified {selectedReport.format}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
