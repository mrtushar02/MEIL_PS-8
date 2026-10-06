import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  Upload,
  Download,
  Eye,
  Edit2,
  CheckCircle2,
  Clock,
  PauseCircle,
  Award
} from 'lucide-react';
import { exportToCsv, triggerFileInput } from '../../../../utils/exportUtils';

export default function CSRProjectsScreen({
  projects = [],
  onNavigateTab,
  onSelectProject,
  onOpenCreateProject
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleImportProjects = () => {
    triggerFileInput((file) => {
      console.log('Ingested CSR file:', file.name);
    }, '.csv,.xlsx,.xls');
  };

  const handleExportProjects = () => {
    exportToCsv('MEIL_CSR_Project_Register.csv', filteredProjects.map(p => ({
      Project_ID: p.id,
      Project_Name: p.name,
      Category: p.category,
      Location: p.location,
      Budget_Cr: p.budget,
      Spend_Cr: p.spent,
      Beneficiaries: p.beneficiaries,
      Status: p.status
    })));
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusChipClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'csr-status-chip active';
      case 'completed':
        return 'csr-status-chip completed';
      case 'planned':
        return 'csr-status-chip planned';
      case 'on-hold':
        return 'csr-status-chip on-hold';
      default:
        return 'csr-status-chip draft';
    }
  };

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HEADER BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge">
              <FolderKanban size={24} />
            </div>
            <div>
              <div className="csr-pill-tag">PROJECT PORTFOLIO</div>
              <h1 className="csr-hero-title">CSR Projects</h1>
              <p className="csr-hero-subtitle">
                Total 36 projects • All Categories • All Locations
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-primary" onClick={onOpenCreateProject}>
              <Plus size={16} />
              + Create Project
            </button>
            <button className="csr-btn-outline" onClick={handleImportProjects} title="Import CSR Projects">
              <Upload size={15} />
              Import
            </button>
            <button className="csr-btn-outline" onClick={handleExportProjects} title="Export CSR Projects to CSV">
              <Download size={15} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ──── MINI KPI STATS ROW (5 CARDS) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Projects</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>36</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderKanban size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Active</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>24</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Completed</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>8</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>On-Hold</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#EA580C', marginTop: '2px' }}>3</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(234, 88, 12, 0.1)', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PauseCircle size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Planned</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>5</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* ──── FILTER & SEARCH BAR ──── */}
      <div className="csr-filter-bar">
        <div className="csr-search-box">
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            className="csr-search-input"
            placeholder="Search projects, program, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="csr-filter-pills">
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', marginRight: '4px' }}>Status:</span>
          {['All', 'Active', 'Completed', 'Planned', 'On-Hold'].map((st) => (
            <button
              key={st}
              className={`csr-filter-pill-btn ${selectedStatus === st ? 'active' : ''}`}
              onClick={() => setSelectedStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="csr-filter-pills">
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', marginRight: '4px' }}>Category:</span>
          {['All', 'Education', 'Health', 'Livelihood', 'Community Infra', 'Environment'].map((cat) => (
            <button
              key={cat}
              className={`csr-filter-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ──── PROJECTS TABLE ──── */}
      <div className="csr-table-container">
        <table className="csr-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Spend</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => (
              <tr
                key={p.id}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onSelectProject?.(p);
                  onNavigateTab?.('project-detail');
                }}
              >
                <td style={{ fontWeight: 700, color: '#2563EB' }}>{p.id}</td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{p.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>{p.business_unit}</div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{p.category}</span>
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{p.location}</span>
                </td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{p.start_date}</td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{p.end_date}</td>
                <td>
                  <span className={getStatusChipClass(p.status)}>{p.status}</span>
                </td>
                <td style={{ fontWeight: 700, color: '#0F172A' }}>₹{p.spend_cr} Cr</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px', fontSize: '11.5px' }}
                      title="View Details"
                      onClick={() => {
                        onSelectProject?.(p);
                        onNavigateTab?.('project-detail');
                      }}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px', fontSize: '11.5px' }}
                      title="Edit Project"
                      onClick={() => {
                        onSelectProject?.(p);
                        onNavigateTab?.('project-detail');
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ──── PAGINATION ──── */}
        <div className="csr-pagination">
          <span>Showing 1 to {filteredProjects.length} of 36 projects</span>
          <div className="csr-page-btns">
            <button className="csr-page-btn active">1</button>
            <button className="csr-page-btn">2</button>
            <button className="csr-page-btn">3</button>
            <button className="csr-page-btn">4</button>
            <span>...</span>
            <button className="csr-page-btn">10</button>
            <span style={{ marginLeft: '8px' }}>10/page</span>
          </div>
        </div>
      </div>
    </div>
  );
}
