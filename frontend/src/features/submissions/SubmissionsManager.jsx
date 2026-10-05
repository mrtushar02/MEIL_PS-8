import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Send,
  FileText,
  ShieldCheck,
  Clock,
  AlertCircle,
  Search,
  Download,
  Plus,
  ChevronDown,
  MoreHorizontal,
  List,
  LayoutGrid,
  CheckCircle2,
  X,
  ArrowRight,
  Layers,
  Lock,
  Cpu
} from 'lucide-react';
import api from '../../services/api';
import './SubmissionsManager.css';

const INITIAL_SUBMISSIONS = [
  {
    id: 'SUB-2026-001',
    project: 'Zojila Tunnel (PKG-2)',
    projectShort: 'Zojila Tunnel',
    module: 'Energy',
    period: 'FY 2026-27',
    submittedBy: 'Rohit Kumar',
    submittedOn: '01 Oct 2026',
    submittedOnFull: '01 Oct 2026 11:20 AM',
    status: 'Approved',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    reviewer: 'K. Venkat (BU Reviewer)',
    reviewDue: '03 Oct 2026',
    recordsCount: 14,
    evidenceCount: 6,
    notes: 'DG Genset diesel logs & 33kV substation grid power telemetry complete with weighbridge slips.',
    timeline: [
      { title: 'Submitted by Rohit Kumar', time: '01 Oct 2026, 11:20 AM', desc: 'Batch package with 14 Scope 1 & 2 energy records' },
      { title: 'Under Review • K. Venkat', time: '02 Oct 2026, 09:30 AM', desc: 'Cross-checked against fuel challans & smart meter' },
      { title: 'Approved by K. Venkat', time: '02 Oct 2026, 04:15 PM', desc: 'Approved for Q2 BRSR aggregation' }
    ]
  },
  {
    id: 'SUB-2026-002',
    project: 'Krishna Water Supply',
    projectShort: 'Krishna Water Supply',
    module: 'Water',
    period: 'FY 2026-27',
    submittedBy: 'Priyanka S.',
    submittedOn: '30 Sep 2026',
    submittedOnFull: '30 Sep 2026 02:15 PM',
    status: 'Under Review',
    statusColor: '#D97706',
    statusBg: 'rgba(217, 119, 6, 0.12)',
    reviewer: 'K. Venkat (BU Reviewer)',
    reviewDue: '05 Oct 2026',
    recordsCount: 12,
    evidenceCount: 5,
    notes: 'Pumphouse intake meter readings, water testing laboratory report, and zero liquid discharge logs.',
    timeline: [
      { title: 'Submitted by Priyanka S.', time: '30 Sep 2026, 02:15 PM', desc: 'Monthly pumphouse discharge and water testing logs' },
      { title: 'Under Review • K. Venkat', time: '01 Oct 2026, 10:32 AM', desc: 'Reviewing laboratory compliance against CPCB norms' },
      { title: 'Field verification in progress', time: '03 Oct 2026, 09:12 AM', desc: 'Site visit for flowmeter sensor synchronization' }
    ]
  },
  {
    id: 'SUB-2026-003',
    project: 'Bengaluru Metro Phase 3',
    projectShort: 'Bengaluru Metro',
    module: 'Waste',
    period: 'FY 2026-27',
    submittedBy: 'K. Venkat',
    submittedOn: '28 Sep 2026',
    submittedOnFull: '28 Sep 2026 04:40 PM',
    status: 'Correction',
    statusColor: '#DC2626',
    statusBg: 'rgba(220, 38, 38, 0.12)',
    reviewer: 'Rohit Kumar (Site Lead)',
    reviewDue: '02 Oct 2026',
    recordsCount: 8,
    evidenceCount: 3,
    notes: 'Tunnel muck disposal manifest Form 10 missing authorized signature from registered recycler.',
    timeline: [
      { title: 'Submitted by K. Venkat', time: '28 Sep 2026, 04:40 PM', desc: 'Hazardous waste Form 10 manifests' },
      { title: 'Correction Requested • Rohit Kumar', time: '29 Sep 2026, 11:15 AM', desc: 'Recycler authorization stamp missing on copy 2' }
    ]
  },
  {
    id: 'SUB-2026-004',
    project: 'MEIL Energy Park',
    projectShort: 'MEIL Energy Park',
    module: 'Safety',
    period: 'FY 2026-27',
    submittedBy: 'Jitendra Roy',
    submittedOn: '25 Sep 2026',
    submittedOnFull: '25 Sep 2026 05:00 PM',
    status: 'Approved',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    reviewer: 'Rohit Kumar (Site Lead)',
    reviewDue: '27 Sep 2026',
    recordsCount: 6,
    evidenceCount: 4,
    notes: 'Zero-Harm toolbox induction sheets and safe man-hours certification for 45 technicians.',
    timeline: [
      { title: 'Submitted by Jitendra Roy', time: '25 Sep 2026, 05:00 PM', desc: 'HSE induction and safety checklist' },
      { title: 'Approved by Rohit Kumar', time: '26 Sep 2026, 02:20 PM', desc: 'LTIFR confirmed at 0.00 across 45,000 man-hours' }
    ]
  },
  {
    id: 'SUB-2026-005',
    project: 'Hyderabad Infra Park',
    projectShort: 'Hyderabad Infra Park',
    module: 'Social',
    period: 'FY 2026-27',
    submittedBy: 'Rohit Kumar',
    submittedOn: '20 Sep 2026',
    submittedOnFull: '20 Sep 2026 01:10 PM',
    status: 'Submitted',
    statusColor: '#7C3AED',
    statusBg: 'rgba(124, 58, 237, 0.12)',
    reviewer: 'P. Venkat Reddy',
    reviewDue: '04 Oct 2026',
    recordsCount: 5,
    evidenceCount: 3,
    notes: 'Local community skill development program and wage compliance registers.',
    timeline: [
      { title: 'Submitted by Rohit Kumar', time: '20 Sep 2026, 01:10 PM', desc: 'Skill workshop logs and MSME compliance sheets' }
    ]
  }
];

export default function SubmissionsManager() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [selectedId, setSelectedId] = useState('SUB-2026-002');
  const [activeTab, setActiveTab] = useState('Details');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('FY 2026-27');
  const [viewMode, setViewMode] = useState('list');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Live Backend Submissions Fetch
  const fetchBackendSubmissions = useCallback(async () => {
    try {
      const data = await api.getSubmissions();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(sub => {
          const statusMap = {
            'DRAFT': { label: 'Draft', color: '#64748B', bg: 'rgba(100, 116, 139, 0.12)' },
            'SUBMITTED': { label: 'Submitted', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' },
            'BU_APPROVED': { label: 'BU Approved', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
            'SUBSIDIARY_APPROVED': { label: 'Sub Approved', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
            'LOCKED': { label: 'Locked', color: '#475569', bg: 'rgba(71, 85, 105, 0.15)' },
            'CORRECTION_REQUIRED': { label: 'Correction', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.12)' }
          };
          const meta = statusMap[sub.status] || { label: sub.status, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' };
          const recCount = (sub.fuel_records?.length || 0) + (sub.energy_records?.length || 0) + (sub.water_records?.length || 0) + (sub.waste_records?.length || 0) + (sub.safety_records?.length || 0);
          const prjName = sub.project_id === 'site-101' ? 'Gayatri Pumphouse (Kaleshwaram Lift Irrigation)' : (sub.project_id === 'site-102' ? 'Zojila Tunnel (PKG-2)' : (sub.project_id || 'MEIL Project Site'));
          return {
            id: sub.id,
            project: prjName,
            projectShort: prjName.split(' ')[0],
            module: 'Comprehensive ESG',
            period: sub.reporting_period_id || 'FY 2026-27',
            submittedBy: sub.submitted_by || 'Site Officer',
            submittedOn: sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Oct 2026',
            submittedOnFull: sub.created_at ? new Date(sub.created_at).toLocaleString('en-GB') : '01 Oct 2026 11:20 AM',
            status: meta.label,
            rawStatus: sub.status,
            statusColor: meta.color,
            statusBg: meta.bg,
            reviewer: sub.status === 'BU_APPROVED' ? 'BU Coordinator (Approved)' : (sub.status === 'SUBSIDIARY_APPROVED' ? 'Subsidiary Head (Approved)' : (sub.status === 'LOCKED' ? 'Group CSO (Locked)' : 'K. Venkat (BU Reviewer)')),
            reviewDue: '05 Oct 2026',
            recordsCount: recCount > 0 ? recCount : 12,
            evidenceCount: 4,
            notes: `Official statutory ESG data submission (Version ${sub.version || 1}) for SEBI BRSR consolidation.`,
            timeline: [
              { title: `Submitted by ${sub.submitted_by || 'Site Officer'}`, time: sub.created_at ? new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:20 AM', desc: `Batch package with ${recCount > 0 ? recCount : 12} records` },
              ...(sub.status === 'BU_APPROVED' || sub.status === 'SUBSIDIARY_APPROVED' || sub.status === 'LOCKED' ? [{ title: 'BU Coordinator Approved', time: 'Approved', desc: 'Telemetry & invoice hashes certified' }] : []),
              ...(sub.status === 'SUBSIDIARY_APPROVED' || sub.status === 'LOCKED' ? [{ title: 'Subsidiary Review Approved', time: 'Approved', desc: 'Certified for Group consolidation' }] : []),
              ...(sub.status === 'LOCKED' ? [{ title: 'Group CSO Locked', time: 'Locked', desc: 'Reporting period permanently sealed' }] : [])
            ]
          };
        });
        setSubmissions(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      }
    } catch (err) {
      console.warn('Backend submissions fetch failed, maintaining local state:', err);
    }
  }, []);

  useEffect(() => {
    fetchBackendSubmissions();
  }, [fetchBackendSubmissions]);

  // New Submission Form State
  const [newForm, setNewForm] = useState({
    project: 'Zojila Tunnel (PKG-2)',
    module: 'Energy',
    period: 'FY 2026-27',
    recordsCount: 10,
    evidenceCount: 4,
    notes: ''
  });

  const activeSub = useMemo(() => {
    return submissions.find((s) => s.id === selectedId) || submissions[0];
  }, [submissions, selectedId]);

  // Summary counts computed dynamically
  const summaryCounts = useMemo(() => {
    const total = submissions.length;
    const submitted = submissions.filter(s => s.status === 'Submitted' || s.rawStatus === 'SUBMITTED').length;
    const underReview = submissions.filter(s => s.status === 'Under Review' || s.rawStatus === 'BU_APPROVED' || s.rawStatus === 'SUBSIDIARY_APPROVED').length;
    const approved = submissions.filter(s => s.status === 'Approved' || s.status === 'Locked' || s.rawStatus === 'LOCKED').length;
    const correction = submissions.filter(s => s.status === 'Correction' || s.rawStatus === 'CORRECTION_REQUIRED').length;
    return {
      total: total > 0 ? total : 56,
      submitted: submitted > 0 ? submitted : 28,
      submittedPct: total > 0 ? Math.round((submitted / total) * 100) : 50,
      underReview: underReview > 0 ? underReview : 14,
      underReviewPct: total > 0 ? Math.round((underReview / total) * 100) : 25,
      approved: approved > 0 ? approved : 10,
      approvedPct: total > 0 ? Math.round((approved / total) * 100) : 18,
      correction: correction > 0 ? correction : 4,
      correctionPct: total > 0 ? Math.round((correction / total) * 100) : 7
    };
  }, [submissions]);

  // Filtered List
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        s.id.toLowerCase().includes(q) ||
        s.project.toLowerCase().includes(q) ||
        s.submittedBy.toLowerCase().includes(q);

      const matchesProject = selectedProject === 'All' || s.project.includes(selectedProject);
      const matchesModule = selectedModule === 'All' || s.module === selectedModule;
      const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
      const matchesPeriod = selectedPeriod === 'All' || s.period === selectedPeriod;

      return matchesSearch && matchesProject && matchesModule && matchesStatus && matchesPeriod;
    });
  }, [submissions, searchQuery, selectedProject, selectedModule, selectedStatus, selectedPeriod]);

  // Status Action Handlers with real API integration
  const handleApprove = async (id) => {
    try {
      await api.approveSubmission(id, 'Approved for statutory consolidation');
      await fetchBackendSubmissions();
    } catch {
      setSubmissions(prev => prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'Approved',
            statusColor: '#16A34A',
            statusBg: 'rgba(22, 163, 74, 0.12)',
            timeline: [
              ...s.timeline,
              { title: 'Approved by K. Venkat (Reviewer)', time: 'Just now', desc: 'Submission validated and certified for reporting' }
            ]
          };
        }
        return s;
      }));
    }
  };

  const handleRequestCorrection = async (id) => {
    try {
      await api.rejectSubmission(id, 'Missing supporting laboratory seal. Please re-submit.');
      await fetchBackendSubmissions();
    } catch {
      setSubmissions(prev => prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'Correction',
            statusColor: '#DC2626',
            statusBg: 'rgba(220, 38, 38, 0.12)',
            timeline: [
              ...s.timeline,
              { title: 'Correction Requested • K. Venkat', time: 'Just now', desc: 'Missing supporting laboratory seal. Please re-submit.' }
            ]
          };
        }
        return s;
      }));
    }
  };

  const handleCreateSubmission = async (e) => {
    e.preventDefault();
    try {
      await api.submitMonthlyEsgData({
        project_id: 'site-102',
        reporting_period_id: 'period-2025-09',
        fuel_records: [{ fuel_type: 'Diesel', quantity: 12000.0, unit: 'Litres' }],
        energy_records: [{ energy_source: 'Grid Electricity', quantity_kwh: 85000.0, renewable_kwh: 15000.0 }],
        water_records: [{ source_type: 'Surface Water', withdrawal_kl: 25000.0, recycled_kl: 18000.0, discharged_kl: 2000.0 }],
        waste_records: [{ waste_category: 'Non-Hazardous', quantity_metric_tonnes: 45.0, disposal_route: 'Recycled' }],
        safety_records: [{ safe_man_hours: 180000.0, lost_time_injuries: 0, fatalities: 0, near_misses: 2 }]
      });
      await fetchBackendSubmissions();
      setIsNewModalOpen(false);
    } catch {
      const newSubId = `SUB-2026-00${submissions.length + 1}`;
      const newSubmission = {
        id: newSubId,
        project: newForm.project,
        projectShort: newForm.project.split(' ')[0],
        module: newForm.module,
        period: newForm.period,
        submittedBy: 'Rohit Kumar',
        submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        submittedOnFull: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Submitted',
        statusColor: '#7C3AED',
        statusBg: 'rgba(124, 58, 237, 0.12)',
        reviewer: 'K. Venkat (BU Reviewer)',
        reviewDue: '10 Oct 2026',
        recordsCount: Number(newForm.recordsCount) || 8,
        evidenceCount: Number(newForm.evidenceCount) || 3,
        notes: newForm.notes || 'Monthly site disclosure package.',
        timeline: [
          { title: 'Submitted by Rohit Kumar', time: 'Just now', desc: `Batch package with ${newForm.recordsCount} records` }
        ]
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      setSelectedId(newSubmission.id);
      setIsNewModalOpen(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Submission ID', 'Project / Site', 'Module', 'Period', 'Submitted By', 'Submitted On', 'Status', 'Reviewer'];
    const rows = filteredSubmissions.map((s, idx) => [
      idx + 1,
      `"${s.id}"`,
      `"${s.project}"`,
      `"${s.module}"`,
      `"${s.period}"`,
      `"${s.submittedBy}"`,
      `"${s.submittedOn}"`,
      `"${s.status}"`,
      `"${s.reviewer}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MEIL_Submissions_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sm-container">

      {/* 1. Page Header */}
      <div className="sm-page-header">
        <div className="sm-header-left">
          <div className="sm-header-icon-box">
            <Send size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="sm-page-title">Submissions</h1>
            <p className="sm-page-subtitle">
              Submit ESG data for review and track approval status.
            </p>
          </div>
        </div>

        <button 
          type="button" 
          className="sm-btn-primary-action"
          onClick={() => setIsNewModalOpen(true)}
        >
          <Plus size={16} strokeWidth={2.6} />
          <span>New Submission</span>
        </button>
      </div>

      {/* 2. Top 5 Summary Cards */}
      <div className="sm-summary-grid">
        
        {/* Card 1: Total Submissions */}
        <div className="sm-summary-card" onClick={() => setSelectedStatus('All')}>
          <div className="sm-summary-left">
            <div className="sm-summary-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <FileText size={20} />
            </div>
            <div>
              <div className="sm-summary-title">Total Submissions</div>
              <div className="sm-summary-val">{summaryCounts.total}</div>
              <div className="sm-summary-sub">This reporting period</div>
            </div>
          </div>
          <div className="sm-summary-corner-icon">
            <Layers size={18} color="#0284C7" />
          </div>
        </div>

        {/* Card 2: Submitted */}
        <div className="sm-summary-card" onClick={() => setSelectedStatus('Submitted')}>
          <div className="sm-summary-left">
            <div className="sm-summary-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Send size={20} />
            </div>
            <div>
              <div className="sm-summary-title">Submitted</div>
              <div className="sm-summary-val">{summaryCounts.submitted}</div>
              <div className="sm-summary-sub" style={{ color: '#2563EB', fontWeight: 700 }}>
                {summaryCounts.submittedPct}%
              </div>
            </div>
          </div>
          <div className="sm-summary-corner-icon">
            <Send size={18} color="#2563EB" />
          </div>
        </div>

        {/* Card 3: Under Review */}
        <div className="sm-summary-card" onClick={() => setSelectedStatus('Under Review')}>
          <div className="sm-summary-left">
            <div className="sm-summary-icon-wrap" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <Clock size={20} />
            </div>
            <div>
              <div className="sm-summary-title">Under Review</div>
              <div className="sm-summary-val">{summaryCounts.underReview}</div>
              <div className="sm-summary-sub" style={{ color: '#D97706', fontWeight: 700 }}>
                {summaryCounts.underReviewPct}%
              </div>
            </div>
          </div>
          <div className="sm-summary-corner-icon">
            <Clock size={18} color="#F59E0B" />
          </div>
        </div>

        {/* Card 4: Approved */}
        <div className="sm-summary-card" onClick={() => setSelectedStatus('Approved')}>
          <div className="sm-summary-left">
            <div className="sm-summary-icon-wrap" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="sm-summary-title">Approved</div>
              <div className="sm-summary-val" style={{ color: '#0F172A' }}>{summaryCounts.approved}</div>
              <div className="sm-summary-sub" style={{ color: '#16A34A', fontWeight: 700 }}>
                {summaryCounts.approvedPct}%
              </div>
            </div>
          </div>
          <div className="sm-summary-corner-icon">
            <CheckCircle2 size={18} color="#16A34A" />
          </div>
        </div>

        {/* Card 5: Correction Required */}
        <div className="sm-summary-card" onClick={() => setSelectedStatus('Correction')}>
          <div className="sm-summary-left">
            <div className="sm-summary-icon-wrap" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="sm-summary-title">Correction Required</div>
              <div className="sm-summary-val" style={{ color: '#DC2626' }}>{summaryCounts.correction}</div>
              <div className="sm-summary-sub" style={{ color: '#DC2626', fontWeight: 700 }}>
                {summaryCounts.correctionPct}%
              </div>
            </div>
          </div>
          <div className="sm-summary-corner-icon">
            <AlertCircle size={18} color="#DC2626" />
          </div>
        </div>

      </div>

      {/* 3. Main 2-Column Section */}
      <div className="sm-main-grid">

        {/* ── LEFT MASTER CARD: Table & Filter Bar ──────────────── */}
        <div className="sm-table-card">

          {/* Filter Bar */}
          <div className="sm-filter-bar">
            {/* Search Input */}
            <div className="sm-search-box">
              <Search size={14} className="sm-search-icon" />
              <input
                type="text"
                placeholder="Search submission ID, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm-search-input"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="sm-filters-group">
              <div className="sm-filter-select-wrap">
                <span className="sm-filter-lbl">Project</span>
                <select 
                  value={selectedProject} 
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="sm-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Zojila Tunnel">Zojila Tunnel</option>
                  <option value="Krishna Water Supply">Krishna Water Supply</option>
                  <option value="Bengaluru Metro">Bengaluru Metro</option>
                  <option value="MEIL Energy Park">MEIL Energy Park</option>
                  <option value="Hyderabad Infra Park">Hyderabad Infra Park</option>
                </select>
              </div>

              <div className="sm-filter-select-wrap">
                <span className="sm-filter-lbl">Module</span>
                <select 
                  value={selectedModule} 
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="sm-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Energy">Energy</option>
                  <option value="Water">Water</option>
                  <option value="Waste">Waste</option>
                  <option value="Safety">Safety</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              <div className="sm-filter-select-wrap">
                <span className="sm-filter-lbl">Status</span>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="sm-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Correction">Correction</option>
                  <option value="Submitted">Submitted</option>
                </select>
              </div>

              <div className="sm-filter-select-wrap">
                <span className="sm-filter-lbl">Reporting Period</span>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="sm-filter-select"
                >
                  <option value="FY 2026-27">FY 2026-27</option>
                  <option value="FY 2025-26">FY 2025-26</option>
                </select>
              </div>

              {/* View Switcher: List vs Grid */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '2px' }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>View</span>
                <div className="sm-view-toggle">
                  <button 
                    type="button" 
                    className={`sm-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={13} />
                  </button>
                  <button 
                    type="button" 
                    className={`sm-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={13} />
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <button 
                type="button" 
                className="sm-export-btn"
                onClick={handleExportCSV}
              >
                <Download size={12} />
                <span>Export</span>
                <ChevronDown size={10} />
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="sm-table-wrapper">
            <table className="sm-table">
              <thead>
                <tr>
                  <th style={{ width: '20px' }}>#</th>
                  <th>Submission ID</th>
                  <th>Project / Site</th>
                  <th>Module</th>
                  <th>Period</th>
                  <th>Submitted By</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th style={{ width: '24px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((s, idx) => {
                  const isSelected = selectedId === s.id;
                  return (
                    <tr 
                      key={s.id}
                      className={isSelected ? 'is-selected' : ''}
                      onClick={() => setSelectedId(s.id)}
                    >
                      <td style={{ fontWeight: 600, color: '#64748B' }}>{idx + 1}</td>
                      
                      {/* Submission ID */}
                      <td style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                        {s.id}
                      </td>

                      {/* Project / Site */}
                      <td style={{ fontWeight: 600, color: '#1E293B' }}>
                        {s.project}
                      </td>

                      {/* Module */}
                      <td style={{ color: '#0284C7', fontWeight: 600 }}>
                        {s.module}
                      </td>

                      {/* Period */}
                      <td style={{ color: '#64748B' }}>
                        {s.period}
                      </td>

                      {/* Submitted By */}
                      <td style={{ color: '#334155', fontWeight: 500 }}>
                        {s.submittedBy}
                      </td>

                      {/* Submitted On */}
                      <td style={{ color: '#64748B' }}>
                        {s.submittedOn}
                      </td>

                      {/* Status */}
                      <td>
                        <span 
                          className="sm-badge-type"
                          style={{ color: s.statusColor, background: s.statusBg }}
                        >
                          {s.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(s.id);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94A3B8' }}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                      No matching submissions found. Click "+ New Submission" to submit data for review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Submission Details Panel ───────────────── */}
        <div className="sm-details-panel">
          
          {/* Header */}
          <div className="sm-details-header">
            <h3 className="sm-details-title">Submission Details</h3>
            <span 
              className="sm-badge-type"
              style={{ color: activeSub.statusColor, background: activeSub.statusBg, fontSize: '10.5px' }}
            >
              {activeSub.status}
            </span>
          </div>

          {/* Subtitle Project Card */}
          <div className="sm-sub-hero-card">
            <div className="sm-sub-hero-icon">
              <FileText size={18} />
            </div>
            <div>
              <div className="sm-sub-hero-name">{activeSub.project}</div>
              <div className="sm-sub-hero-sub">{activeSub.module} Module • {activeSub.period}</div>
            </div>
          </div>

          {/* Contextual Tabs */}
          <div className="sm-context-tabs">
            {['Details', 'Review', `Data (${activeSub.recordsCount})`, `Evidence (${activeSub.evidenceCount})`].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`sm-context-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'Details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="sm-overview-fields">
                <div className="sm-overview-row">
                  <span className="sm-field-label">Submission ID</span>
                  <span className="sm-field-val" style={{ fontFamily: 'monospace', color: '#0284C7' }}>{activeSub.id}</span>
                </div>
                <div className="sm-overview-row">
                  <span className="sm-field-label">Project</span>
                  <span className="sm-field-val">{activeSub.projectShort}</span>
                </div>
                <div className="sm-overview-row">
                  <span className="sm-field-label">Module</span>
                  <span className="sm-field-val">{activeSub.module}</span>
                </div>
                <div className="sm-overview-row">
                  <span className="sm-field-label">Reporting Period</span>
                  <span className="sm-field-val">{activeSub.period}</span>
                </div>
                <div className="sm-overview-row">
                  <span className="sm-field-label">Submitted By</span>
                  <span className="sm-field-val">{activeSub.submittedBy}</span>
                </div>
                <div className="sm-overview-row">
                  <span className="sm-field-label">Submitted On</span>
                  <span className="sm-field-val">{activeSub.submittedOnFull}</span>
                </div>
                <div className="sm-overview-row">
                  <span className="sm-field-label">Status</span>
                  <span className="sm-field-val" style={{ color: activeSub.statusColor }}>{activeSub.status}</span>
                </div>
                <div className="sm-overview-row">
                  <span className="sm-field-label">Reviewer</span>
                  <span className="sm-field-val">{activeSub.reviewer}</span>
                </div>
                <div className="sm-overview-row">
                  <span className="sm-field-label">Review Due</span>
                  <span className="sm-field-val" style={{ color: '#D97706' }}>{activeSub.reviewDue}</span>
                </div>
              </div>

              {/* Actions Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <button 
                  type="button" 
                  className="sm-btn-action"
                  onClick={() => alert(`Opening comprehensive audit package for ${activeSub.id}...`)}
                >
                  <span>View Full Details</span>
                  <ArrowRight size={13} />
                </button>

                {activeSub.status === 'Under Review' && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      type="button"
                      onClick={() => handleApprove(activeSub.id)}
                      style={{ flex: 1, padding: '7px', background: '#16A34A', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Approve Package
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleRequestCorrection(activeSub.id)}
                      style={{ flex: 1, padding: '7px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Request Fix
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Review Notes */}
          {activeTab === 'Review' && (
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.18)', fontSize: '11px' }}>
              <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Reviewer Verification Note:</div>
              <div style={{ color: '#475569', lineHeight: 1.4 }}>
                {activeSub.notes}
              </div>
              <div style={{ marginTop: '10px', fontSize: '10px', color: '#64748B' }}>
                Assigned Reviewer: <strong>{activeSub.reviewer}</strong>
              </div>
            </div>
          )}

          {/* Tab 3: Data Records */}
          {activeTab.startsWith('Data') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Batch records included in this submission:
              </div>
              {[
                { title: 'Telemetry Meter Flow #1', qty: '12,450 units', verified: true },
                { title: 'Daily Site Logbook Signoff', qty: 'Batch #28-40', verified: true },
                { title: 'Contractor Secondary Meter', qty: '3,800 units', verified: activeSub.status === 'Approved' }
              ].map((rec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.7)', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{rec.title}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>{rec.qty}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: rec.verified ? '#16A34A' : '#D97706' }}>
                    {rec.verified ? '✓ Validated' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Attached Evidence */}
          {activeTab.startsWith('Evidence') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Supporting verification documents:
              </div>
              {[
                { name: 'Primary_Meter_Invoice.pdf', size: '1.8 MB' },
                { name: 'NABL_Water_Lab_Report.pdf', size: '2.4 MB' },
                { name: 'Calibration_Certificate_2026.pdf', size: '0.9 MB' }
              ].map((doc, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.7)', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                  <span style={{ fontWeight: 600, color: '#0284C7' }}>{doc.name}</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{doc.size}</span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* 4. Bottom 2 Cards Grid */}
      <div className="sm-bottom-grid">

        {/* Card 1: Submission Status by Module */}
        <div className="sm-bottom-card">
          <div className="sm-bottom-card-header">
            <span className="sm-bottom-card-title">Submission Status by Module</span>
            <button type="button" className="sm-bottom-pill-btn">
              View Details
            </button>
          </div>

          <div className="sm-barchart-container">
            <div className="sm-barchart-bars">
              {[
                { module: 'Energy', submitted: 70, review: 40, approved: 80, correction: 15 },
                { module: 'Water', submitted: 55, review: 50, approved: 65, correction: 20 },
                { module: 'Waste', submitted: 45, review: 30, approved: 60, correction: 35 },
                { module: 'Safety', submitted: 85, review: 20, approved: 90, correction: 10 },
                { module: 'Social', submitted: 60, review: 35, approved: 50, correction: 15 },
                { module: 'Governance', submitted: 75, review: 25, approved: 85, correction: 10 }
              ].map((item, idx) => (
                <div key={idx} className="sm-barchart-group">
                  <div className="sm-bar" style={{ height: `${item.submitted}%`, background: '#3B82F6' }} title={`Submitted: ${item.submitted}`} />
                  <div className="sm-bar" style={{ height: `${item.review}%`, background: '#F59E0B' }} title={`Under Review: ${item.review}`} />
                  <div className="sm-bar" style={{ height: `${item.approved}%`, background: '#10B981' }} title={`Approved: ${item.approved}`} />
                  <div className="sm-bar" style={{ height: `${item.correction}%`, background: '#EF4444' }} title={`Correction: ${item.correction}`} />
                </div>
              ))}
            </div>

            <div className="sm-barchart-labels">
              {['Energy', 'Water', 'Waste', 'Safety', 'Social', 'Governance'].map((lbl, i) => (
                <span key={i} className="sm-barchart-lbl">{lbl}</span>
              ))}
            </div>

            <div className="sm-barchart-legend">
              <div className="sm-legend-item">
                <div className="sm-legend-dot" style={{ background: '#3B82F6' }} />
                <span>Submitted</span>
              </div>
              <div className="sm-legend-item">
                <div className="sm-legend-dot" style={{ background: '#F59E0B' }} />
                <span>Under Review</span>
              </div>
              <div className="sm-legend-item">
                <div className="sm-legend-dot" style={{ background: '#10B981' }} />
                <span>Approved</span>
              </div>
              <div className="sm-legend-item">
                <div className="sm-legend-dot" style={{ background: '#EF4444' }} />
                <span>Correction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Submission Timeline */}
        <div className="sm-bottom-card">
          <div className="sm-bottom-card-header">
            <span className="sm-bottom-card-title">Submission Timeline</span>
            <button type="button" className="sm-bottom-pill-btn">
              View All
            </button>
          </div>

          <div className="sm-timeline-list">
            {activeSub.timeline.map((step, idx) => (
              <div key={idx} className="sm-timeline-item">
                <div className="sm-timeline-dot" />
                <div className="sm-timeline-title">{step.title}</div>
                <div className="sm-timeline-time">{step.time}</div>
                <div className="sm-timeline-sub">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Liquid Glass Modal: + New Submission */}
      {isNewModalOpen && (
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
                  <Send size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Create New Submission</h3>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>Bundle verified records and evidence for BU review</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsNewModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Project / Site
                  </label>
                  <select 
                    value={newForm.project}
                    onChange={(e) => setNewForm({ ...newForm, project: e.target.value })}
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
                    value={newForm.module}
                    onChange={(e) => setNewForm({ ...newForm, module: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="Energy">Energy (Scope 1 & 2)</option>
                    <option value="Water">Water Consumption & ZLD</option>
                    <option value="Waste">Waste Circularity</option>
                    <option value="Safety">Safety & Zero Harm</option>
                    <option value="Social">Social & Community</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Reporting Period
                  </label>
                  <select 
                    value={newForm.period}
                    onChange={(e) => setNewForm({ ...newForm, period: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="FY 2026-27">FY 2026-27</option>
                    <option value="FY 2025-26">FY 2025-26</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Number of Attached Records
                  </label>
                  <input 
                    type="number"
                    value={newForm.recordsCount}
                    onChange={(e) => setNewForm({ ...newForm, recordsCount: e.target.value })}
                    min={1}
                    max={50}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Submission Notes for Reviewer
                </label>
                <textarea 
                  rows={2}
                  placeholder="Outline key operational parameters, calibration dates, or meter adjustments..."
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsNewModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'transparent', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#475569' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#2563EB', color: '#FFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
export { SubmissionsManager };
