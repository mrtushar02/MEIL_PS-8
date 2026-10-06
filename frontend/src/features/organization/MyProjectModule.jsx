import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Download,
  Plus,
  CheckCircle2,
  ChevronDown,
  MoreHorizontal,
  FileText,
  List,
  LayoutGrid,
  ExternalLink,
  Edit3,
  X,
  ShieldCheck,
  Paperclip,
  Activity,
  Briefcase,
  Hourglass,
  Layers
} from 'lucide-react';
import './MyProjectModule.css';

// Master 6 Projects Data corresponding directly to the approved UI reference
const MASTER_PROJECTS = [
  {
    id: 'site-102',
    name: 'Zojila Tunnel Project',
    subtitle: 'Jammu & Kashmir',
    code: 'PKG-2',
    bu: 'Infra - Roads',
    location: 'Kargil, J&K',
    fullLocation: 'Kargil, Jammu & Kashmir',
    type: 'Tunnel',
    typeColor: '#0284C7',
    typeBg: 'rgba(2, 132, 199, 0.12)',
    progress: 80,
    dataCompletion: 86,
    status: 'Active',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    startDate: '01 Apr 2022',
    endDate: '31 Mar 2027',
    reportingPeriod: 'FY 2026-27',
    projectLead: 'Rohit Kumar',
    description: 'Construction of Zojila Tunnel for all-weather connectivity between Srinagar and Leh.',
    lat: 34.298,
    lng: 75.485,
    image: '/zojila_tunnel.jpg',
    esgBreakdown: { energy: 86, water: 78, waste: 62, safety: 90 },
    submissions: [
      { module: 'Energy', total: 12, submitted: 8, underReview: 2, approved: 1, pending: 1 },
      { module: 'Water', total: 10, submitted: 6, underReview: 2, approved: 1, pending: 1 },
      { module: 'Waste', total: 8, submitted: 5, underReview: 1, approved: 1, pending: 1 },
      { module: 'Safety', total: 6, submitted: 4, underReview: 1, approved: 1, pending: 0 }
    ],
    deadlines: [
      { task: 'Submit Energy Data', project: 'Zojila Tunnel (PKG-2)', dueDate: '15 Oct 2026', status: 'Pending', statusColor: '#D97706', statusBg: 'rgba(217, 119, 6, 0.12)' },
      { task: 'Water Quality Report', project: 'Krishna Water Supply', dueDate: '20 Oct 2026', status: 'Pending', statusColor: '#D97706', statusBg: 'rgba(217, 119, 6, 0.12)' },
      { task: 'Waste Manifest Upload', project: 'Bengaluru Metro', dueDate: '25 Oct 2026', status: 'In Progress', statusColor: '#2563EB', statusBg: 'rgba(37, 99, 235, 0.12)' },
      { task: 'Monthly Site Submission', project: 'Zojila Tunnel (PKG-2)', dueDate: '31 Oct 2026', status: 'Pending', statusColor: '#D97706', statusBg: 'rgba(217, 119, 6, 0.12)' }
    ]
  },
  {
    id: 'site-blr-m3',
    name: 'Bengaluru Metro Phase 3',
    subtitle: 'Reach 4A & 4B',
    code: 'BLR-M3',
    bu: 'Urban Infra',
    location: 'Bengaluru, KA',
    fullLocation: 'Bengaluru Urban, Karnataka',
    type: 'Metro',
    typeColor: '#7C3AED',
    typeBg: 'rgba(124, 58, 237, 0.12)',
    progress: 60,
    dataCompletion: 62,
    status: 'Active',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    startDate: '15 Jan 2023',
    endDate: '30 Dec 2028',
    reportingPeriod: 'FY 2026-27',
    projectLead: 'M. R. Swamy',
    description: 'Elevated viaducts, underground stations and regenerative braking power systems.',
    lat: 12.9716,
    lng: 77.5946,
    image: '/hyderabad_metro.jpg',
    esgBreakdown: { energy: 65, water: 58, waste: 70, safety: 85 },
    submissions: [
      { module: 'Energy', total: 10, submitted: 6, underReview: 2, approved: 1, pending: 1 },
      { module: 'Water', total: 8, submitted: 4, underReview: 2, approved: 1, pending: 1 },
      { module: 'Waste', total: 6, submitted: 4, underReview: 1, approved: 1, pending: 0 },
      { module: 'Safety', total: 5, submitted: 3, underReview: 1, approved: 1, pending: 0 }
    ],
    deadlines: [
      { task: 'Waste Manifest Upload', project: 'Bengaluru Metro', dueDate: '25 Oct 2026', status: 'In Progress', statusColor: '#2563EB', statusBg: 'rgba(37, 99, 235, 0.12)' }
    ]
  },
  {
    id: 'site-kws-01',
    name: 'Krishna Water Supply',
    subtitle: 'Package 1',
    code: 'KWS-01',
    bu: 'Water Infra',
    location: 'Vijayawada, AP',
    fullLocation: 'Vijayawada, Andhra Pradesh',
    type: 'Water',
    typeColor: '#0284C7',
    typeBg: 'rgba(2, 132, 199, 0.12)',
    progress: 45,
    dataCompletion: 48,
    status: 'On Hold',
    statusColor: '#D97706',
    statusBg: 'rgba(217, 119, 6, 0.12)',
    startDate: '10 Aug 2023',
    endDate: '31 Mar 2026',
    reportingPeriod: 'FY 2026-27',
    projectLead: 'Suresh Panyam',
    description: 'Lift irrigation pumphouse and water grid transmission canal network.',
    lat: 16.5062,
    lng: 80.6480,
    image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80',
    esgBreakdown: { energy: 48, water: 60, waste: 42, safety: 75 },
    submissions: [
      { module: 'Energy', total: 8, submitted: 4, underReview: 1, approved: 1, pending: 2 },
      { module: 'Water', total: 12, submitted: 8, underReview: 2, approved: 1, pending: 1 },
      { module: 'Waste', total: 4, submitted: 2, underReview: 1, approved: 0, pending: 1 },
      { module: 'Safety', total: 4, submitted: 2, underReview: 1, approved: 1, pending: 0 }
    ],
    deadlines: [
      { task: 'Water Quality Report', project: 'Krishna Water Supply', dueDate: '20 Oct 2026', status: 'Pending', statusColor: '#D97706', statusBg: 'rgba(217, 119, 6, 0.12)' }
    ]
  },
  {
    id: 'site-mep-01',
    name: 'MEIL Energy Park',
    subtitle: 'Solar + BESS',
    code: 'MEP-01',
    bu: 'Renewables',
    location: 'Anantapur, AP',
    fullLocation: 'Anantapur Ultra Mega Solar Park, AP',
    type: 'Renewable',
    typeColor: '#16A34A',
    typeBg: 'rgba(22, 163, 74, 0.12)',
    progress: 90,
    dataCompletion: 88,
    status: 'Active',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    startDate: '01 Jun 2021',
    endDate: '31 Oct 2026',
    reportingPeriod: 'FY 2026-27',
    projectLead: 'K. Venkat',
    description: '500 MW solar PV farm with 100 MWh Battery Energy Storage System (BESS).',
    lat: 14.6819,
    lng: 77.6006,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    esgBreakdown: { energy: 95, water: 82, waste: 90, safety: 98 },
    submissions: [
      { module: 'Energy', total: 14, submitted: 12, underReview: 1, approved: 1, pending: 0 },
      { module: 'Water', total: 6, submitted: 5, underReview: 1, approved: 0, pending: 0 },
      { module: 'Waste', total: 5, submitted: 4, underReview: 1, approved: 0, pending: 0 },
      { module: 'Safety', total: 6, submitted: 6, underReview: 0, approved: 0, pending: 0 }
    ],
    deadlines: []
  },
  {
    id: 'site-hip-01',
    name: 'Hyderabad Infra Park',
    subtitle: 'Phase 1',
    code: 'HIP-01',
    bu: 'Real Estate',
    location: 'Hyderabad, TG',
    fullLocation: 'HITEC City, Hyderabad, Telangana',
    type: 'Building',
    typeColor: '#6366F1',
    typeBg: 'rgba(99, 102, 241, 0.12)',
    progress: 30,
    dataCompletion: 35,
    status: 'Planning',
    statusColor: '#64748B',
    statusBg: 'rgba(100, 116, 139, 0.14)',
    startDate: '01 Jan 2024',
    endDate: '31 Dec 2029',
    reportingPeriod: 'FY 2026-27',
    projectLead: 'P. Venkat Reddy',
    description: 'IGBC Platinum certified commercial tower with rainwater harvesting.',
    lat: 17.3850,
    lng: 78.4867,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    esgBreakdown: { energy: 35, water: 40, waste: 25, safety: 70 },
    submissions: [
      { module: 'Energy', total: 6, submitted: 2, underReview: 1, approved: 0, pending: 3 },
      { module: 'Water', total: 5, submitted: 2, underReview: 1, approved: 0, pending: 2 },
      { module: 'Waste', total: 4, submitted: 1, underReview: 0, approved: 0, pending: 3 },
      { module: 'Safety', total: 4, submitted: 2, underReview: 1, approved: 0, pending: 1 }
    ],
    deadlines: []
  },
  {
    id: 'site-wmp-01',
    name: 'Waste Management Plant',
    subtitle: 'Integrated Facility',
    code: 'WMP-01',
    bu: 'Waste Infra',
    location: 'Nagpur, MH',
    fullLocation: 'MIDC Butibori, Nagpur, Maharashtra',
    type: 'Waste',
    typeColor: '#D97706',
    typeBg: 'rgba(217, 119, 6, 0.12)',
    progress: 70,
    dataCompletion: 78,
    status: 'Active',
    statusColor: '#16A34A',
    statusBg: 'rgba(22, 163, 74, 0.12)',
    startDate: '15 Mar 2022',
    endDate: '15 Nov 2026',
    reportingPeriod: 'FY 2026-27',
    projectLead: 'Priyanka S.',
    description: 'Municipal solid waste recycling, composting and refuse-derived fuel (RDF).',
    lat: 21.1458,
    lng: 79.0882,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    esgBreakdown: { energy: 75, water: 70, waste: 94, safety: 88 },
    submissions: [
      { module: 'Energy', total: 8, submitted: 6, underReview: 1, approved: 1, pending: 0 },
      { module: 'Water', total: 7, submitted: 5, underReview: 1, approved: 1, pending: 0 },
      { module: 'Waste', total: 10, submitted: 8, underReview: 1, approved: 1, pending: 0 },
      { module: 'Safety', total: 5, submitted: 4, underReview: 1, approved: 0, pending: 0 }
    ],
    deadlines: []
  }
];

export default function MyProjectModule({ onSelectProject, onNavigateTab }) {
  const [projects] = useState(MASTER_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState('site-102');
  const [activeDetailsTab, setActiveDetailsTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBu, setSelectedBu] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('FY 2026-27');
  const [selectedType, setSelectedType] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [rowMenuOpenId, setRowMenuOpenId] = useState(null);

  // Form states for modals
  const [requestForm, setRequestForm] = useState({
    projectId: 'site-blr-m3',
    role: 'ESG Data Owner',
    reason: 'Assigned as secondary site officer for Reach 4B station telemetry verification.'
  });
  const [requestSuccess, setRequestSuccess] = useState(false);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.bu.toLowerCase().includes(q);

      const matchesBu = selectedBu === 'All' || p.bu === selectedBu;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchesType = selectedType === 'All' || p.type === selectedType;

      return matchesSearch && matchesBu && matchesStatus && matchesType;
    });
  }, [projects, searchQuery, selectedBu, selectedStatus, selectedType]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['#', 'Project Name', 'Code', 'Business Unit', 'Location', 'Type', 'Progress %', 'Data Completion %', 'Status'];
    const rows = filteredProjects.map((p, idx) => [
      idx + 1,
      `"${p.name}"`,
      `"${p.code}"`,
      `"${p.bu}"`,
      `"${p.location}"`,
      `"${p.type}"`,
      `${p.progress}%`,
      `${p.dataCompletion}%`,
      `"${p.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MEIL_Assigned_Projects_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenWorkspace = (project) => {
    onSelectProject?.(project || activeProject);
    onNavigateTab?.('overview');
  };

  return (
    <div className="mp-container">

      {/* 1. Page Header (Pixel-Faithful to Screenshot) */}
      <div className="mp-page-header">
        <div className="mp-header-left">
          <div className="mp-header-icon-box">
            <Briefcase size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="mp-page-title">My Project</h1>
            <p className="mp-page-subtitle">
              Manage your assigned projects, view progress, enter site data and track submissions.
            </p>
          </div>
        </div>

        <button 
          type="button" 
          className="mp-btn-primary-action"
          onClick={() => setIsAssignModalOpen(true)}
        >
          <Plus size={16} strokeWidth={2.6} />
          <span>Assign / Request Project</span>
        </button>
      </div>

      {/* 2. Top 4 Summary Cards (Exact Proportions & Values) */}
      <div className="mp-summary-grid">
        
        {/* Card 1: Total Assigned Projects */}
        <div 
          className="mp-summary-card"
          onClick={() => { setSelectedStatus('All'); setSelectedBu('All'); }}
          title="Click to view all assigned projects"
        >
          <div className="mp-summary-left">
            <div className="mp-summary-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className="mp-summary-title">Total Assigned Projects</div>
              <div className="mp-summary-val">{projects.length}</div>
              <div className="mp-summary-sub">Across 3 Business Units</div>
            </div>
          </div>
          <div className="mp-summary-corner-icon">
            <Layers size={18} color="#0284C7" />
          </div>
        </div>

        {/* Card 2: Data Completion */}
        <div 
          className="mp-summary-card"
          onClick={() => onNavigateTab?.('analytics')}
          title="View ESG Data Completion Analytics"
        >
          <div className="mp-summary-left">
            {/* Circular Ring Miniature (72%) */}
            <div className="mp-summary-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.1)' }}>
              <svg width="38" height="38" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#258BE6"
                  strokeWidth="4.5"
                  strokeDasharray="72 100"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
            </div>
            <div>
              <div className="mp-summary-title">Data Completion</div>
              <div className="mp-summary-val">72%</div>
              <div className="mp-summary-sub">
                <span style={{ 
                  color: '#16A34A', 
                  background: 'rgba(22, 163, 74, 0.1)', 
                  padding: '1px 6px', 
                  borderRadius: '10px', 
                  fontWeight: 700, 
                  fontSize: '10.5px' 
                }}>
                  ↑ 12%
                </span>
                <span>vs last month</span>
              </div>
            </div>
          </div>
          <div className="mp-summary-corner-icon">
            <Activity size={18} color="#0284C7" />
          </div>
        </div>

        {/* Card 3: Pending Submissions */}
        <div 
          className="mp-summary-card"
          onClick={() => onNavigateTab?.('submissions')}
          title="View Pending Submissions"
        >
          <div className="mp-summary-left">
            <div className="mp-summary-icon-wrap" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <FileText size={20} />
            </div>
            <div>
              <div className="mp-summary-title">Pending Submissions</div>
              <div className="mp-summary-val">3</div>
              <div className="mp-summary-sub">Across 2 Projects</div>
            </div>
          </div>
          <div className="mp-summary-corner-icon">
            <Hourglass size={18} color="#F59E0B" />
          </div>
        </div>

        {/* Card 4: Approved Submissions */}
        <div 
          className="mp-summary-card"
          onClick={() => onNavigateTab?.('submissions')}
          title="View Approved Submissions"
        >
          <div className="mp-summary-left">
            <div className="mp-summary-icon-wrap" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="mp-summary-title">Approved Submissions</div>
              <div className="mp-summary-val" style={{ color: '#0F172A' }}>8</div>
              <div className="mp-summary-sub">This reporting period</div>
            </div>
          </div>
          <div className="mp-summary-corner-icon">
            <CheckCircle2 size={18} color="#16A34A" />
          </div>
        </div>

      </div>

      {/* 3. Main 2-Column Section (Left: Table ~68% | Right: Details Panel ~32%) */}
      <div className="mp-main-grid">

        {/* ── LEFT MASTER CARD: Table & Filter Bar ──────────────── */}
        <div className="mp-table-card">

          {/* Filter Bar */}
          <div className="mp-filter-bar">
            {/* Search Input */}
            <div className="mp-search-box">
              <Search size={15} className="mp-search-icon" />
              <input
                type="text"
                placeholder="Search project name, code or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mp-search-input"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="mp-filters-group">
              <div className="mp-filter-select-wrap">
                <span className="mp-filter-lbl">Business Unit</span>
                <select 
                  value={selectedBu} 
                  onChange={(e) => setSelectedBu(e.target.value)}
                  className="mp-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Infra - Roads">Infra - Roads</option>
                  <option value="Urban Infra">Urban Infra</option>
                  <option value="Water Infra">Water Infra</option>
                  <option value="Renewables">Renewables</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Waste Infra">Waste Infra</option>
                </select>
              </div>

              <div className="mp-filter-select-wrap">
                <span className="mp-filter-lbl">Status</span>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mp-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Planning">Planning</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="mp-filter-select-wrap">
                <span className="mp-filter-lbl">Reporting Period</span>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="mp-filter-select"
                >
                  <option value="FY 2026-27">FY 2026-27</option>
                  <option value="FY 2025-26">FY 2025-26</option>
                  <option value="FY 2024-25">FY 2024-25</option>
                </select>
              </div>

              <div className="mp-filter-select-wrap">
                <span className="mp-filter-lbl">Project Type</span>
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="mp-filter-select"
                >
                  <option value="All">All</option>
                  <option value="Tunnel">Tunnel</option>
                  <option value="Metro">Metro</option>
                  <option value="Water">Water</option>
                  <option value="Renewable">Renewable</option>
                  <option value="Building">Building</option>
                  <option value="Waste">Waste</option>
                </select>
              </div>

              {/* View Switcher: List vs Grid */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>View</span>
                <div className="mp-view-toggle">
                  <button 
                    type="button" 
                    className={`mp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                  <button 
                    type="button" 
                    className={`mp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <LayoutGrid size={14} />
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <button 
                type="button" 
                className="mp-export-btn"
                onClick={handleExportCSV}
                title="Export filtered project directory to CSV"
              >
                <Download size={13} />
                <span>Export</span>
                <ChevronDown size={11} />
              </button>
            </div>
          </div>

          {/* Project Table */}
          <div className="mp-table-wrapper">
            <table className="mp-table">
              <thead>
                <tr>
                  <th style={{ width: '22px' }}>#</th>
                  <th>Project / Site Name</th>
                  <th style={{ width: '48px' }}>Code</th>
                  <th style={{ width: '80px' }}>Business Unit</th>
                  <th style={{ width: '85px' }}>Location</th>
                  <th style={{ width: '50px' }}>Type</th>
                  <th style={{ width: '80px' }}>Progress</th>
                  <th style={{ width: '85px' }}>Data Completion</th>
                  <th style={{ width: '55px' }}>Status</th>
                  <th style={{ width: '24px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p, idx) => {
                  const isSelected = selectedProjectId === p.id;
                  return (
                    <tr 
                      key={p.id}
                      className={isSelected ? 'is-selected' : ''}
                      onClick={() => setSelectedProjectId(p.id)}
                    >
                      <td style={{ fontWeight: 600, color: '#64748B' }}>{idx + 1}</td>
                      
                      {/* Project / Site Name with Thumbnail */}
                      <td>
                        <div className="mp-proj-cell">
                          <img 
                            src={p.image} 
                            alt={p.name}
                            className="mp-proj-thumb"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&auto=format&fit=crop&q=80'; }}
                          />
                          <div>
                            <div className="mp-proj-title">{p.name}</div>
                            <div className="mp-proj-sub">{p.subtitle}</div>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td style={{ fontWeight: 600, color: '#1E293B', fontFamily: 'monospace' }}>
                        {p.code}
                      </td>

                      {/* Business Unit */}
                      <td style={{ color: '#475569', fontWeight: 500 }}>
                        {p.bu}
                      </td>

                      {/* Location */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B' }}>
                          <MapPin size={12} color="#0284C7" />
                          <span>{p.location}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td>
                        <span 
                          className="mp-badge-type"
                          style={{ color: p.typeColor, background: p.typeBg }}
                        >
                          {p.type}
                        </span>
                      </td>

                      {/* Execution Progress */}
                      <td>
                        <div className="mp-progress-bar-wrap">
                          <div className="mp-progress-track">
                            <div 
                              className="mp-progress-fill" 
                              style={{ width: `${p.progress}%` }} 
                            />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>{p.progress}%</span>
                        </div>
                      </td>

                      {/* ESG Data Completion (Ring Chart) */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="22" height="22" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              fill="none"
                              stroke={p.dataCompletion >= 75 ? '#10B981' : p.dataCompletion >= 50 ? '#F59E0B' : '#EF4444'}
                              strokeWidth="3"
                              strokeDasharray={`${p.dataCompletion} 100`}
                              strokeLinecap="round"
                              transform="rotate(-90 12 12)"
                            />
                          </svg>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>
                            {p.dataCompletion}%
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <span 
                          className="mp-badge-type"
                          style={{ color: p.statusColor, background: p.statusBg }}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Row Action Menu */}
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRowMenuOpenId(rowMenuOpenId === p.id ? null : p.id);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94A3B8' }}
                        >
                          <MoreHorizontal size={15} />
                        </button>

                        {rowMenuOpenId === p.id && (
                          <div 
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '28px',
                              background: '#FFFFFF',
                              borderRadius: '10px',
                              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
                              border: '1px solid rgba(148, 163, 184, 0.2)',
                              zIndex: 100,
                              minWidth: '150px',
                              padding: '4px',
                              textAlign: 'left'
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRowMenuOpenId(null);
                                handleOpenWorkspace(p);
                              }}
                              style={{ width: '100%', padding: '7px 10px', background: 'none', border: 'none', textAlign: 'left', fontSize: '11.5px', color: '#0F172A', fontWeight: 600, cursor: 'pointer', borderRadius: '6px' }}
                              onMouseEnter={(e) => e.target.style.background = '#F1F5F9'}
                              onMouseLeave={(e) => e.target.style.background = 'none'}
                            >
                              Open Project Workspace
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRowMenuOpenId(null);
                                onNavigateTab?.('data-entry');
                              }}
                              style={{ width: '100%', padding: '7px 10px', background: 'none', border: 'none', textAlign: 'left', fontSize: '11.5px', color: '#0F172A', fontWeight: 500, cursor: 'pointer', borderRadius: '6px' }}
                              onMouseEnter={(e) => e.target.style.background = '#F1F5F9'}
                              onMouseLeave={(e) => e.target.style.background = 'none'}
                            >
                              Enter ESG Data
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRowMenuOpenId(null);
                                onNavigateTab?.('evidence');
                              }}
                              style={{ width: '100%', padding: '7px 10px', background: 'none', border: 'none', textAlign: 'left', fontSize: '11.5px', color: '#0F172A', fontWeight: 500, cursor: 'pointer', borderRadius: '6px' }}
                              onMouseEnter={(e) => e.target.style.background = '#F1F5F9'}
                              onMouseLeave={(e) => e.target.style.background = 'none'}
                            >
                              View Evidence
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={10} style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                      No matching projects found. Try clearing your filters or search term.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Project Details Panel ───────────────── */}
        <div className="mp-details-panel">
          
          {/* Header */}
          <div className="mp-details-header">
            <h3 className="mp-details-title">Project Details</h3>
            <button 
              type="button" 
              className="mp-btn-edit"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit3 size={12} />
              <span>Edit</span>
            </button>
          </div>

          {/* Project Hero Card */}
          <div className="mp-details-hero">
            <img 
              src={activeProject.image} 
              alt={activeProject.name} 
              className="mp-hero-banner-img"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'; }}
            />
            <div className="mp-hero-info">
              <div className="mp-hero-title-row">
                <span className="mp-hero-name">{activeProject.name}</span>
                <span 
                  className="mp-badge-type"
                  style={{ color: activeProject.statusColor, background: activeProject.statusBg, fontSize: '10px' }}
                >
                  {activeProject.status}
                </span>
              </div>
              <div className="mp-hero-sub">
                <span style={{ fontWeight: 600, color: '#334155' }}>{activeProject.code}</span>
                <span>•</span>
                <span>{activeProject.bu}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
                <MapPin size={12} color="#0284C7" />
                <span>{activeProject.fullLocation}</span>
              </div>
            </div>
          </div>

          {/* Contextual Tabs */}
          <div className="mp-context-tabs">
            {['Overview', 'ESG Progress', 'Recent Activity', 'Team', 'Documents'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`mp-context-tab ${activeDetailsTab === tab ? 'active' : ''}`}
                onClick={() => setActiveDetailsTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeDetailsTab === 'Overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="mp-overview-content">
                {/* Left Fields List */}
                <div className="mp-overview-fields">
                  <div className="mp-overview-row">
                    <span className="mp-field-label">Project Code</span>
                    <span className="mp-field-val">{activeProject.code}</span>
                  </div>
                  <div className="mp-overview-row">
                    <span className="mp-field-label">Business Unit</span>
                    <span className="mp-field-val">{activeProject.bu}</span>
                  </div>
                  <div className="mp-overview-row">
                    <span className="mp-field-label">Project Type</span>
                    <span className="mp-field-val">{activeProject.type}</span>
                  </div>
                  <div className="mp-overview-row">
                    <span className="mp-field-label">Start Date</span>
                    <span className="mp-field-val">{activeProject.startDate}</span>
                  </div>
                  <div className="mp-overview-row">
                    <span className="mp-field-label">End Date</span>
                    <span className="mp-field-val">{activeProject.endDate}</span>
                  </div>
                  <div className="mp-overview-row">
                    <span className="mp-field-label">Reporting Period</span>
                    <span className="mp-field-val">{activeProject.reportingPeriod}</span>
                  </div>
                  <div className="mp-overview-row">
                    <span className="mp-field-label">Project Lead</span>
                    <span className="mp-field-val" style={{ color: '#0284C7' }}>{activeProject.projectLead}</span>
                  </div>
                  <div className="mp-overview-row" style={{ flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                    <span className="mp-field-label">Description</span>
                    <span style={{ fontSize: '11px', color: '#475569', lineHeight: 1.35 }}>
                      {activeProject.description}
                    </span>
                  </div>
                </div>

                {/* Right Map Preview Graphic */}
                <div className="mp-map-card">
                  <img 
                    src="/zojila_topo_map.jpg" 
                    alt="Map Preview" 
                    className="mp-map-img"
                  />
                  <div className="mp-map-pin-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#EF4444" stroke="#991B1B" strokeWidth="1">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <div className="mp-map-pin-label">
                        <div>{activeProject.name.split(' ')[0]} {activeProject.name.split(' ')[1] || ''}</div>
                        <div style={{ fontSize: '8px', color: '#64748B' }}>({activeProject.code})</div>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="mp-map-btn"
                    onClick={() => setIsMapModalOpen(true)}
                  >
                    <span>View on Map</span>
                    <ExternalLink size={10} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: ESG Progress */}
          {activeDetailsTab === 'ESG Progress' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Required parameter disclosures for {activeProject.reportingPeriod}:
              </div>
              {[
                { name: 'Energy (Scope 1 & 2)', pct: activeProject.esgBreakdown.energy, color: '#10B981' },
                { name: 'Water & ZLD Recycling', pct: activeProject.esgBreakdown.water, color: '#258BE6' },
                { name: 'Waste Circularity', pct: activeProject.esgBreakdown.waste, color: '#F59E0B' },
                { name: 'Safety & Zero Harm', pct: activeProject.esgBreakdown.safety, color: '#10B981' }
              ].map((item, i) => (
                <div key={i} style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: '#0F172A' }}>
                    <span>{item.name}</span>
                    <span style={{ color: item.color }}>{item.pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '999px', marginTop: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Recent Activity */}
          {activeDetailsTab === 'Recent Activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {[
                { text: 'Fuel Log Batch #HMR-01 verified', time: '25m ago', user: 'Rohit Kumar' },
                { text: '33kV Substation Smart Meter synced', time: '2h ago', user: 'K. Venkat' },
                { text: 'ZLD Effluent water report uploaded', time: 'Yesterday', user: 'Priyanka S.' },
                { text: 'Toolbox signoff sheet attached', time: 'Oct 02', user: 'Jitendra Roy' }
              ].map((act, idx) => (
                <div key={idx} style={{ padding: '7px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(148,163,184,0.12)', fontSize: '11px' }}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{act.text}</div>
                  <div style={{ color: '#64748B', fontSize: '10px', marginTop: '2px' }}>{act.user} • {act.time}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Team */}
          {activeDetailsTab === 'Team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Rohit Kumar', role: 'Site Lead', duty: 'ESG Data Owner', avatar: '/avatar_rohit.jpg' },
                { name: 'K. Venkat', role: 'Plant Mech', duty: 'Energy & Grid Metering', avatar: '/avatar_reviewer.jpg' },
                { name: 'Priyanka S.', role: 'EHS Water', duty: 'ZLD & Effluent Compliance', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80' },
                { name: 'Jitendra Roy', role: 'Safety Lead', duty: 'Zero-Harm HSE Officer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80' }
              ].map((m, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={m.avatar} alt={m.name} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>{m.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{m.role} • {m.duty}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>On Duty</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 5: Documents */}
          {activeDetailsTab === 'Documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { name: 'Zojila_Tunnel_EPC_Charter.pdf', size: '3.4 MB', date: '12 Apr 2022' },
                { name: 'MoEFCC_Environmental_Clearance.pdf', size: '5.1 MB', date: '18 May 2022' },
                { name: 'SPCB_Consent_To_Operate_2026.pdf', size: '1.8 MB', date: '01 Jan 2026' }
              ].map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Paperclip size={13} color="#0284C7" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{doc.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{doc.size} • {doc.date}</div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const content = `MEIL PROJECT REPOSITORY DOCUMENT\nDocument: ${doc.name}\nSize: ${doc.size}\nDate: ${doc.date}\nClassification: Internal Regulatory ESG Record\nVerified by: Project Site HSE Manager`;
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${doc.name}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563EB', fontSize: '11px', fontWeight: 600 }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* 4. Bottom 3 Cards (Pixel-Faithful to Screenshot) */}
      <div className="mp-bottom-grid">

        {/* Card 1 (Bottom Left): Project ESG Progress */}
        <div className="mp-bottom-card">
          <div className="mp-bottom-card-header">
            <span className="mp-bottom-card-title">
              Project ESG Progress ({activeProject.name})
            </span>
            <button 
              type="button" 
              className="mp-bottom-pill-btn"
              onClick={() => onNavigateTab?.('analytics')}
            >
              View Details
            </button>
          </div>

          <div className="mp-rings-row">
            {/* Ring 1: Energy */}
            <div className="mp-ring-pod">
              <div className="mp-ring-svg-wrap">
                <svg width="58" height="58" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeDasharray={`${activeProject.esgBreakdown.energy} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span className="mp-ring-center-txt">{activeProject.esgBreakdown.energy}%</span>
              </div>
              <span className="mp-ring-label">Energy</span>
              <span className="mp-ring-status" style={{ color: '#16A34A' }}>Complete</span>
            </div>

            {/* Ring 2: Water */}
            <div className="mp-ring-pod">
              <div className="mp-ring-svg-wrap">
                <svg width="58" height="58" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#258BE6"
                    strokeWidth="3.5"
                    strokeDasharray={`${activeProject.esgBreakdown.water} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span className="mp-ring-center-txt">{activeProject.esgBreakdown.water}%</span>
              </div>
              <span className="mp-ring-label">Water</span>
              <span className="mp-ring-status" style={{ color: '#2563EB' }}>Complete</span>
            </div>

            {/* Ring 3: Waste */}
            <div className="mp-ring-pod">
              <div className="mp-ring-svg-wrap">
                <svg width="58" height="58" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3.5"
                    strokeDasharray={`${activeProject.esgBreakdown.waste} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span className="mp-ring-center-txt">{activeProject.esgBreakdown.waste}%</span>
              </div>
              <span className="mp-ring-label">Waste</span>
              <span className="mp-ring-status" style={{ color: '#D97706' }}>In Progress</span>
            </div>

            {/* Ring 4: Safety */}
            <div className="mp-ring-pod">
              <div className="mp-ring-svg-wrap">
                <svg width="58" height="58" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeDasharray={`${activeProject.esgBreakdown.safety} 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span className="mp-ring-center-txt">{activeProject.esgBreakdown.safety}%</span>
              </div>
              <span className="mp-ring-label">Safety</span>
              <span className="mp-ring-status" style={{ color: '#16A34A' }}>Complete</span>
            </div>
          </div>
        </div>

        {/* Card 2 (Bottom Center): Submission Status */}
        <div className="mp-bottom-card">
          <div className="mp-bottom-card-header">
            <span className="mp-bottom-card-title">Submission Status</span>
            <button 
              type="button" 
              className="mp-bottom-pill-btn"
              onClick={() => onNavigateTab?.('submissions')}
            >
              View All
            </button>
          </div>

          <table className="mp-compact-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Total</th>
                <th>Submitted</th>
                <th>Under Review</th>
                <th>Approved</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {activeProject.submissions.map((sub, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>{sub.module}</td>
                  <td style={{ fontWeight: 600 }}>{sub.total}</td>
                  <td>
                    <span className="mp-badge-sm" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                      {sub.submitted}
                    </span>
                  </td>
                  <td>
                    <span className="mp-badge-sm" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444' }}>
                      {sub.underReview}
                    </span>
                  </td>
                  <td>
                    <span className="mp-badge-sm" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                      {sub.approved}
                    </span>
                  </td>
                  <td>
                    <span className="mp-badge-sm" style={{ background: sub.pending > 0 ? 'rgba(217, 119, 6, 0.12)' : 'rgba(148, 163, 184, 0.15)', color: sub.pending > 0 ? '#D97706' : '#64748B' }}>
                      {sub.pending}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 3 (Bottom Right): Upcoming Deadlines */}
        <div className="mp-bottom-card">
          <div className="mp-bottom-card-header">
            <span className="mp-bottom-card-title">Upcoming Deadlines</span>
            <button 
              type="button" 
              className="mp-bottom-pill-btn"
              onClick={() => setIsCalendarModalOpen(true)}
            >
              View Calendar
            </button>
          </div>

          <table className="mp-compact-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeProject.deadlines.map((dl, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>{dl.task}</td>
                  <td style={{ color: '#64748B' }}>{dl.project}</td>
                  <td style={{ color: '#475569', fontWeight: 500 }}>{dl.dueDate}</td>
                  <td>
                    <span className="mp-badge-sm" style={{ background: dl.statusBg, color: dl.statusColor }}>
                      {dl.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. Liquid Glass Modal: + Assign / Request Project */}
      {isAssignModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(240,249,255,0.92) 100%)',
            backdropFilter: 'blur(24px)',
            borderRadius: '18px',
            border: '1px solid rgba(255,255,255,0.85)',
            boxShadow: '0 20px 50px rgba(15,23,42,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="#0284C7" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Assign / Request Project Access
                </h3>
              </div>
              <button 
                onClick={() => { setIsAssignModalOpen(false); setRequestSuccess(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {requestSuccess ? (
                <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(22,163,74,0.08)', borderRadius: '12px', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <CheckCircle2 size={32} color="#16A34A" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 800, color: '#166534', fontSize: '15px' }}>Access Request Submitted!</div>
                  <div style={{ fontSize: '12px', color: '#15803D', marginTop: '4px' }}>
                    Your request has been routed to the Business Unit Lead for role authorization.
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Select Project to Request Access:
                    </label>
                    <select
                      value={requestForm.projectId}
                      onChange={(e) => setRequestForm({ ...requestForm, projectId: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: '#FFFFFF', fontSize: '12.5px', outline: 'none' }}
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code} • {p.bu})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Requested Access Role:
                    </label>
                    <select
                      value={requestForm.role}
                      onChange={(e) => setRequestForm({ ...requestForm, role: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: '#FFFFFF', fontSize: '12.5px', outline: 'none' }}
                    >
                      <option value="ESG Data Owner">ESG Data Owner (Full Entry & Evidence)</option>
                      <option value="Site Viewer">Site Viewer (Read-only Telemetry)</option>
                      <option value="EHS Reviewer">EHS Reviewer (Compliance Signoff)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Operational Reason / Duty Assignment:
                    </label>
                    <textarea
                      rows={3}
                      value={requestForm.reason}
                      onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: '#FFFFFF', fontSize: '12px', outline: 'none', resize: 'none' }}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="mp-bottom-pill-btn"
                onClick={() => { setIsAssignModalOpen(false); setRequestSuccess(false); }}
              >
                Close
              </button>
              {!requestSuccess && (
                <button
                  type="button"
                  className="mp-btn-primary-action"
                  onClick={() => setRequestSuccess(true)}
                >
                  Submit Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Liquid Glass Modal: Edit Project Details */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(240,249,255,0.92) 100%)',
            backdropFilter: 'blur(24px)',
            borderRadius: '18px',
            border: '1px solid rgba(255,255,255,0.85)',
            boxShadow: '0 20px 50px rgba(15,23,42,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Edit Project Information: {activeProject.name}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} color="#64748B" />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>Project Description</label>
                <textarea 
                  defaultValue={activeProject.description}
                  rows={3}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', fontSize: '12px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>Project Site Lead</label>
                <input 
                  type="text" 
                  defaultValue={activeProject.projectLead}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', fontSize: '12px' }}
                />
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="mp-bottom-pill-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button type="button" className="mp-btn-primary-action" onClick={() => setIsEditModalOpen(false)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Liquid Glass Modal: View on Map */}
      {isMapModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '680px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(240,249,255,0.92) 100%)',
            backdropFilter: 'blur(24px)',
            borderRadius: '18px',
            border: '1px solid rgba(255,255,255,0.85)',
            boxShadow: '0 20px 50px rgba(15,23,42,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Site Location: {activeProject.name} ({activeProject.code})
                </h3>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  GPS Coordinates: {activeProject.lat}° N, {activeProject.lng}° E • {activeProject.fullLocation}
                </span>
              </div>
              <button onClick={() => setIsMapModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} color="#64748B" />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ width: '100%', height: '320px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.25)', position: 'relative', background: '#E0F2FE' }}>
                <svg width="100%" height="100%" viewBox="0 0 600 320" preserveAspectRatio="none">
                  {/* Topo map simulation */}
                  <rect width="600" height="320" fill="#EBF4FE" />
                  <path d="M 0 80 Q 150 40, 300 90 T 600 70" fill="none" stroke="#BAE6FD" strokeWidth="2" />
                  <path d="M 0 160 Q 180 120, 350 170 T 600 150" fill="none" stroke="#BAE6FD" strokeWidth="2" />
                  <path d="M 0 240 Q 200 200, 400 250 T 600 230" fill="none" stroke="#BAE6FD" strokeWidth="2" />
                  {/* Highway */}
                  <path d="M 50 320 L 300 160 L 550 20" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="6 4" />
                  {/* Project site point */}
                  <circle cx="300" cy="160" r="28" fill="rgba(37, 99, 235, 0.2)" />
                  <circle cx="300" cy="160" r="8" fill="#2563EB" />
                  <text x="300" cy="130" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0F172A">
                    {activeProject.name} ({activeProject.code})
                  </text>
                  <text x="300" cy="205" textAnchor="middle" fontSize="11" fontWeight="600" fill="#475569">
                    Altitude: 3,528m • Sub-Zero Sonamarg-Minamarg Tunnel Portal
                  </text>
                </svg>
              </div>
            </div>
            <div style={{ padding: '12px 22px', borderTop: '1px solid rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="mp-btn-primary-action" onClick={() => setIsMapModalOpen(false)}>Close Map View</button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Deadlines Modal */}
      {isCalendarModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 560, maxWidth: '92%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>BRSR Statutory Calendar</h3>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: 4 }}>SEBI Core & NGRBC Reporting Milestones (FY 2026-27)</div>
              </div>
              <button onClick={() => setIsCalendarModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 18 }}>
              {[
                { date: '15 Oct 2026', title: 'Q2 Energy & GHG Scope 1/2 Telemetry Filing', status: 'Pending Review', color: '#D97706' },
                { date: '20 Oct 2026', title: 'Water Withdrawal & Zero Liquid Discharge Manifest', status: 'Under Verification', color: '#0284C7' },
                { date: '31 Oct 2026', title: 'HSE Safety Affidavits & Lost Time Injury Frequency Rate (LTIFR)', status: 'Approved', color: '#16A34A' },
                { date: '15 Nov 2026', title: 'Scope 3 Upstream Value Chain Procurement ESG Audit', status: 'Upcoming', color: '#64748B' },
                { date: '31 Dec 2026', title: 'Half-Yearly Corporate Sustainability Board Disclosure', status: 'Scheduled', color: '#475569' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>{item.date}</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{item.title}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: item.color, background: `${item.color}15`, padding: '4px 8px', borderRadius: 6 }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="mp-btn-primary-action"
                onClick={() => setIsCalendarModalOpen(false)}
              >
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
