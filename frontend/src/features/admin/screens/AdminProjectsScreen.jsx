import React, { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  Plus, 
  Download, 
  MapPin, 
  Eye, 
  Building2, 
  CheckCircle2,
  AlertCircle,
  X 
} from 'lucide-react';
import { exportToCsv } from '../../../utils/exportUtils';

export default function AdminProjectsScreen({
  projects = [],
  treeData = null
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inspectedProject, setInspectedProject] = useState(null);
  const pageSize = 8;

  // Real projects list combining database projects with canonical sites
  const displayProjects = projects.length > 0 ? projects.map(p => ({
    id: p.id,
    name: p.name,
    code: p.code,
    subsidiary: 'MEIL Core Infrastructure',
    business_unit: p.business_unit_id ? p.business_unit_id.replace('bu-', '').toUpperCase() : 'Tunnels',
    location: p.location || 'India',
    status: p.status || 'Active',
    readiness: '92%'
  })) : [
    { id: 'site-102', name: 'Zojila Tunnel Project', code: 'ZT-J-001', subsidiary: 'MEIL Core Infra', business_unit: 'Tunnels', location: 'J&K', status: 'Active', readiness: '95%' },
    { id: 'site-101', name: 'Goypatri Tunnel Project', code: 'GPT-002', subsidiary: 'MEIL Core Infra', business_unit: 'Tunnels', location: 'HP', status: 'Active', readiness: '86%' },
    { id: 'site-103', name: 'Tunnel B High Altitude', code: 'TNL-B-03', subsidiary: 'MEIL Core Infra', business_unit: 'Tunnels', location: 'HP', status: 'Active', readiness: '72%' },
    { id: 'site-104', name: 'Vihar Link Interconnect', code: 'VL-004', subsidiary: 'MEIL Core Infra', business_unit: 'Tunnels', location: 'Ladakh', readiness: '90%', status: 'Active' },
    { id: 'site-105', name: 'Metro Phase 1 Underground', code: 'MTP-001', subsidiary: 'MEIL Infra', business_unit: 'Metro', location: 'Delhi', readiness: '86%', status: 'Active' },
    { id: 'site-106', name: 'Metro Phase 2 Elevated', code: 'MTP-002', subsidiary: 'MEIL Infra', business_unit: 'Metro', location: 'Delhi', readiness: 'Planned', status: 'Planned' },
    { id: 'site-201', name: 'Water Treatment Plant 50MLD', code: 'WTR-001', subsidiary: 'Utilities', business_unit: 'Water', location: 'Telangana', readiness: '78%', status: 'Active' },
    { id: 'site-301', name: 'Thermal Plant Unit 4 FGD', code: 'TMP-001', subsidiary: 'Energy', business_unit: 'Energy', location: 'AP', readiness: '90%', status: 'Active' }
  ];

  const filtered = displayProjects.filter(p => {
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportDirectory = () => {
    exportToCsv('MEIL_Projects_Directory.csv', displayProjects.map(p => ({
      'Project ID': p.id,
      'Project Name': p.name,
      'Site Code': p.code,
      'Parent Subsidiary': p.subsidiary,
      'Business Unit': p.business_unit,
      'Location': p.location,
      'Operational Status': p.status,
      'ESG Readiness Score': p.readiness
    })));
  };

  return (
    <div className="admin-projects-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Project Directory</h2>
          <p>Manage all 258+ engineering, procurement, and construction projects across the organization</p>
        </div>

        <div className="admin-actions-group">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary"
            onClick={handleExportDirectory}
          >
            <Download size={14} /> Export Directory
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-left">
          <div className="admin-search-input-wrap">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search projects, site code, location..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="admin-search-input"
            />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PLANNED">Planned</option>
          </select>
        </div>

        <div style={{ fontSize: '12px', color: '#64748B' }}>
          Showing <strong>{filtered.length}</strong> project sites
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Code</th>
              <th>Subsidiary</th>
              <th>Business Unit</th>
              <th>Location</th>
              <th>Status</th>
              <th>ESG Readiness</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderKanban size={15} color="#2563EB" />
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{p.name}</span>
                  </div>
                </td>
                <td><code>{p.code}</code></td>
                <td>{p.subsidiary}</td>
                <td><span className="admin-badge admin-badge-blue">{p.business_unit}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <MapPin size={12} color="#64748B" /> {p.location}
                  </div>
                </td>
                <td>
                  <span className={`admin-badge ${p.status === 'Active' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {p.status}
                  </span>
                </td>
                <td style={{ fontWeight: '700', color: p.readiness.includes('7') ? '#D97706' : '#2563EB' }}>
                  {p.readiness}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    type="button" 
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    onClick={() => setInspectedProject(p)}
                  >
                    <Eye size={12} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="admin-pagination">
          <div>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></div>
          <div className="admin-page-btn-group">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                type="button" 
                className={`admin-page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {inspectedProject && (
        <div className="admin-modal-overlay" onClick={() => setInspectedProject(null)}>
          <div className="admin-modal-card" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderKanban size={18} color="#2563EB" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {inspectedProject.name}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Code: <code>{inspectedProject.code}</code></span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setInspectedProject(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Subsidiary</span>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A' }}>{inspectedProject.subsidiary}</div>
                </div>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Business Unit</span>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A' }}>{inspectedProject.business_unit}</div>
                </div>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Site Location</span>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A' }}>{inspectedProject.location}</div>
                </div>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>ESG Readiness Score</span>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: '#2563EB' }}>{inspectedProject.readiness}</div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setInspectedProject(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
