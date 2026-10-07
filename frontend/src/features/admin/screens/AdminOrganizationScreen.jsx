import React, { useState } from 'react';
import { 
  Network, 
  Building2, 
  Layers, 
  FolderKanban, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Edit3, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function AdminOrganizationScreen({
  treeData = null
}) {
  const group = treeData?.group || {
    name: 'MEIL Group',
    code: 'MEIL-HQ',
    subsidiaries: [
      {
        id: 'sub-meil-core',
        name: 'MEIL Core Infrastructure',
        code: 'MEIL-CORE',
        business_units: [
          {
            id: 'bu-tunnels',
            name: 'Tunnels Business Unit',
            code: 'TUN',
            projects: [
              { id: 'site-102', name: 'Zojila Tunnel Project', code: 'ZT-J-001', location: 'J&K', readiness: '95%' },
              { id: 'site-101', name: 'Goypatri Tunnel Project', code: 'GPT-002', location: 'Uttarakhand', readiness: '92%' },
              { id: 'site-103', name: 'Tunnel B High Altitude Bypass', code: 'TNL-B', location: 'Ladakh', readiness: '88%' },
              { id: 'site-104', name: 'Vihar Link Interconnect Tunnel', code: 'VL-004', location: 'Maharashtra', readiness: '90%' },
              { id: 'site-105', name: 'Metro Phase 1 Underground', code: 'MET-01', location: 'Delhi', readiness: '94%' }
            ]
          },
          {
            id: 'bu-water',
            name: 'Water Business Unit',
            code: 'WAT',
            projects: [
              { id: 'site-201', name: 'Kaleshwaram Lift Irrigation', code: 'KLI-01', location: 'Telangana', readiness: '96%' },
              { id: 'site-202', name: 'Drinking Water Pipeline Grid', code: 'DWP-02', location: 'AP', readiness: '91%' }
            ]
          },
          {
            id: 'bu-energy',
            name: 'Energy Business Unit',
            code: 'ENG',
            projects: [
              { id: 'site-301', name: 'Solar PV 250MW Field', code: 'SLR-01', location: 'Rajasthan', readiness: '98%' }
            ]
          },
          {
            id: 'bu-infra',
            name: 'Infrastructure BU',
            code: 'INF',
            projects: [
              { id: 'site-401', name: 'Highway Expressway Corridor 4', code: 'HWY-04', location: 'Gujarat', readiness: '89%' }
            ]
          },
          {
            id: 'bu-metro',
            name: 'Metro Business Unit',
            code: 'MTR',
            projects: [
              { id: 'site-501', name: 'Metro Elevated Viaduct', code: 'MEV-02', location: 'Karnataka', readiness: '93%' }
            ]
          }
        ]
      }
    ]
  };

  const [expandedNodes, setExpandedNodes] = useState({
    'group': true,
    'sub-meil-core': true,
    'bu-tunnels': true
  });

  const [selectedEntity, setSelectedEntity] = useState({
    type: 'Business Unit',
    name: 'Tunnels Business Unit',
    code: 'TUN',
    parent: 'MEIL Core Infrastructure',
    projectsCount: 6,
    usersCount: 3,
    readiness: '91.4%',
    submissions: 14,
    approved: 13,
    pending: 1,
    correction: 0,
    projects: [
      { name: 'Zojila Tunnel Project', code: 'ZT-J-001', location: 'J&K', readiness: '95%' },
      { name: 'Goypatri Tunnel Project', code: 'GPT-002', location: 'Uttarakhand', readiness: '92%' },
      { name: 'Tunnel B High Altitude Bypass', code: 'TNL-B', location: 'Ladakh', readiness: '88%' },
      { name: 'Vihar Link Interconnect Tunnel', code: 'VL-004', location: 'Maharashtra', readiness: '90%' },
      { name: 'Metro Phase 1 Underground', code: 'MET-01', location: 'Delhi', readiness: '94%' }
    ]
  });

  const [activeTab, setActiveTab] = useState('Overview');

  const toggleExpand = (id) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="admin-organization-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Organization Structure</h2>
          <p>Manage group enterprise, subsidiaries, business units, and site projects</p>
        </div>
      </div>

      {/* Split View Layout */}
      <div className="admin-split-layout">
        {/* Left: Interactive Tree */}
        <div className="admin-card" style={{ margin: 0, padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={16} color="#2563EB" /> Enterprise Hierarchy Tree
          </div>

          <div className="admin-tree-container">
            {/* Group Level */}
            <div 
              className={`admin-tree-node ${selectedEntity.name === group.name ? 'selected' : ''}`}
              onClick={() => {
                setSelectedEntity({
                  type: 'Enterprise Group',
                  name: group.name,
                  code: group.code,
                  parent: 'Corporate Headquarters',
                  projectsCount: 258,
                  usersCount: 17,
                  readiness: '94.2%',
                  submissions: 96,
                  approved: 84,
                  pending: 10,
                  correction: 2,
                  projects: []
                });
              }}
            >
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); toggleExpand('group'); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {expandedNodes['group'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <Building2 size={15} color="#2563EB" />
              <span>{group.name}</span>
              <span className="admin-badge admin-badge-blue" style={{ marginLeft: 'auto', fontSize: '9px' }}>GROUP</span>
            </div>

            {/* Subsidiaries */}
            {expandedNodes['group'] && (
              <div className="admin-tree-children">
                {group.subsidiaries?.map(sub => (
                  <div key={sub.id}>
                    <div 
                      className={`admin-tree-node ${selectedEntity.name === sub.name ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedEntity({
                          type: 'Subsidiary',
                          name: sub.name,
                          code: sub.code,
                          parent: group.name,
                          projectsCount: 180,
                          usersCount: 12,
                          readiness: '92.8%',
                          submissions: 42,
                          approved: 38,
                          pending: 4,
                          correction: 0,
                          projects: []
                        });
                      }}
                    >
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); toggleExpand(sub.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        {expandedNodes[sub.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                      <Layers size={14} color="#7C3AED" />
                      <span>{sub.name}</span>
                      <span className="admin-badge admin-badge-purple" style={{ marginLeft: 'auto', fontSize: '9px' }}>SUB</span>
                    </div>

                    {/* Business Units */}
                    {expandedNodes[sub.id] && (
                      <div className="admin-tree-children">
                        {sub.business_units?.map(bu => (
                          <div key={bu.id}>
                            <div 
                              className={`admin-tree-node ${selectedEntity.name === bu.name ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedEntity({
                                  type: 'Business Unit',
                                  name: bu.name,
                                  code: bu.code,
                                  parent: sub.name,
                                  projectsCount: bu.projects?.length || 5,
                                  usersCount: 3,
                                  readiness: '91.4%',
                                  submissions: 14,
                                  approved: 13,
                                  pending: 1,
                                  correction: 0,
                                  projects: bu.projects || []
                                });
                              }}
                            >
                              <FolderKanban size={13} color="#0D9488" />
                              <span>{bu.name}</span>
                              <span className="admin-badge" style={{ marginLeft: 'auto', fontSize: '9px', background: '#F1F5F9' }}>BU</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Entity Details */}
        <div className="admin-card" style={{ margin: 0, padding: '24px' }}>
          {/* Top Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="admin-badge admin-badge-blue">{selectedEntity.type}</span>
                <span className="admin-badge admin-badge-success">ACTIVE</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: '8px 0 2px 0' }}>
                {selectedEntity.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Code: <strong>{selectedEntity.code}</strong> • Parent: <strong>{selectedEntity.parent}</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>ESG READINESS</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563EB' }}>
                {selectedEntity.readiness}
              </div>
            </div>
          </div>

          {/* Submissions & Project Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Total Submissions</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>{selectedEntity.submissions}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(22, 163, 74, 0.08)', borderRadius: '12px', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
              <div style={{ fontSize: '11px', color: '#16A34A' }}>Approved</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#16A34A' }}>{selectedEntity.approved}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
              <div style={{ fontSize: '11px', color: '#D97706' }}>Pending Review</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#D97706' }}>{selectedEntity.pending}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(220, 38, 38, 0.08)', borderRadius: '12px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
              <div style={{ fontSize: '11px', color: '#DC2626' }}>Corrections</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#DC2626' }}>{selectedEntity.correction}</div>
            </div>
          </div>

          {/* Associated Projects Table */}
          {selectedEntity.projects && selectedEntity.projects.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '10px' }}>
                Assigned Site Projects ({selectedEntity.projects.length})
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Code</th>
                    <th>Location</th>
                    <th>Readiness</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntity.projects.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '600' }}>{p.name}</td>
                      <td><code>{p.code}</code></td>
                      <td>{p.location}</td>
                      <td style={{ fontWeight: '700', color: '#2563EB' }}>{p.readiness}</td>
                      <td><span className="admin-badge admin-badge-success">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
