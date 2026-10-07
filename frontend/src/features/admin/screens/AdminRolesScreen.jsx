import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Users, 
  Plus, 
  Grid, 
  Eye, 
  Check, 
  X, 
  Lock,
  Layers
} from 'lucide-react';

export default function AdminRolesScreen({
  roles = [],
  permissions = []
}) {
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState(null);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  const activeRolesCount = roles.filter(r => r.status === 'Active').length || roles.length;
  const totalPermsCount = permissions.length || 23;

  return (
    <div className="admin-roles-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Roles & Permissions</h2>
          <p>Manage canonical roles, jurisdictional scope boundaries, and authoritative RBAC matrices</p>
        </div>

        <div className="admin-actions-group">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary"
            onClick={() => setIsMatrixOpen(true)}
          >
            <Grid size={14} /> Permission Matrix
          </button>
        </div>
      </div>

      {/* Top Summary KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="admin-card" style={{ margin: 0, padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={18} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>{roles.length || 15}</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Canonical Roles</div>
          </div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.08)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>{totalPermsCount}</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Total Permissions</div>
          </div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(22, 163, 74, 0.08)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={18} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>{activeRolesCount}</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Active Roles</div>
          </div>
        </div>

        <div className="admin-card" style={{ margin: 0, padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(241, 245, 249, 0.9)', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>0</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Inactive Roles</div>
          </div>
        </div>
      </div>

      {/* Roles Data Table */}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Description</th>
              <th>Users</th>
              <th>Permissions</th>
              <th>Scope Type</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr 
                key={r.id}
                onClick={() => setSelectedRoleForDetail(r)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={14} color="#2563EB" />
                    <div>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{r.name}</div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}><code>{r.code}</code></div>
                    </div>
                  </div>
                </td>
                <td style={{ maxWidth: '320px' }}>
                  <span style={{ fontSize: '12px', color: '#475569' }}>{r.description}</span>
                </td>
                <td>
                  <span className="admin-badge admin-badge-blue">
                    <Users size={11} /> {r.users_count || 1}
                  </span>
                </td>
                <td>
                  <span className="admin-badge admin-badge-purple">
                    {r.permissions_count || r.permissions?.length || 4} perms
                  </span>
                </td>
                <td>
                  <span className="admin-badge" style={{ background: '#F1F5F9', color: '#334155' }}>
                    {r.scope_type}
                  </span>
                </td>
                <td>
                  <span className="admin-badge admin-badge-success">
                    Active
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    type="button" 
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoleForDetail(r);
                    }}
                  >
                    <Eye size={12} /> Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Detail Modal */}
      {selectedRoleForDetail && (
        <div className="admin-modal-overlay" onClick={() => setSelectedRoleForDetail(null)}>
          <div className="admin-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Role Detail: {selectedRoleForDetail.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Canonical Identifier: <code>{selectedRoleForDetail.code}</code>
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedRoleForDetail(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Description</span>
                <p style={{ fontSize: '13px', color: '#334155', margin: '4px 0 0 0' }}>{selectedRoleForDetail.description}</p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Jurisdictional Scope</span>
                <div style={{ marginTop: '4px' }}>
                  <span className="admin-badge admin-badge-blue">{selectedRoleForDetail.scope_type}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Assigned RBAC Permissions ({selectedRoleForDetail.permissions?.length || 0})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '200px', overflowY: 'auto', padding: '10px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  {(selectedRoleForDetail.permissions || []).map(p => (
                    <span key={p} className="admin-badge admin-badge-purple" style={{ fontSize: '11px' }}>
                      <Check size={10} /> {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedRoleForDetail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Matrix Modal */}
      {isMatrixOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsMatrixOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '920px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Authoritative Permission Catalog Matrix
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Cross-resource RBAC authorization contracts enforced on backend API routes
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsMatrixOpen(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Permission Code</th>
                    <th>Resource</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((p) => (
                    <tr key={p.id}>
                      <td><code>{p.code}</code></td>
                      <td><span className="admin-badge admin-badge-blue">{p.resource}</span></td>
                      <td><strong>{p.action}</strong></td>
                      <td style={{ fontSize: '11.5px', color: '#475569' }}>{p.description}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {(p.assigned_roles || []).slice(0, 3).map(r => (
                            <span key={r} className="admin-badge admin-badge-purple" style={{ fontSize: '9.5px' }}>
                              {r}
                            </span>
                          ))}
                          {(p.assigned_roles || []).length > 3 && (
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                              +{p.assigned_roles.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setIsMatrixOpen(false)}
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
