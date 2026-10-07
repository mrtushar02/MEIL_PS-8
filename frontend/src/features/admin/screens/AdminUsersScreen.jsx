import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  MoreVertical, 
  ShieldCheck, 
  Building, 
  Key, 
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  Edit3
} from 'lucide-react';
import AdminUserDrawer from '../components/AdminUserDrawer';
import AdminCreateUserModal from './AdminCreateUserModal';

export default function AdminUsersScreen({
  users = [],
  roles = [],
  isLoading = false,
  onRefresh
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter users based on search and dropdowns
  const filteredUsers = users.filter((u) => {
    const matchesSearch = !search || 
      u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role_code === roleFilter;
    const matchesStatus = !statusFilter || (statusFilter === 'ACTIVE' ? u.is_active : !u.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Role', 'Scope Level', 'Scope ID', 'Status'];
    const rows = filteredUsers.map(u => [u.full_name, u.email, u.role_code, u.scope_type, u.scope_id, u.is_active ? 'Active' : 'Inactive']);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meil_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-users-screen">
      {/* Screen Title & Action Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>User Management</h2>
          <p>Create and manage enterprise platform users, role assignments, and organizational scopes</p>
        </div>

        <div className="admin-actions-group">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            type="button" 
            className="admin-btn admin-btn-primary"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={15} /> Create User
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
              placeholder="Search users, email..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="admin-search-input"
            />
          </div>

          <select 
            value={roleFilter} 
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="admin-select"
          >
            <option value="">All Roles (15)</option>
            {roles.map(r => (
              <option key={r.id} value={r.code}>{r.name}</option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        <div style={{ fontSize: '12px', color: '#64748B' }}>
          Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
        </div>
      </div>

      {/* Users Data Table */}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Organization Scope</th>
              <th>Status</th>
              <th>Last Login</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                  Loading authenticated users from server...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                  No users match the specified criteria.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr 
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        flexShrink: 0
                      }}>
                        {u.full_name ? u.full_name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '13px' }}>
                          {u.full_name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                          ID: {u.id.slice(0, 10)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#475569', fontSize: '12px' }}>{u.email}</span>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-purple">
                      {u.role_name}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="admin-badge admin-badge-blue" style={{ fontSize: '10.5px' }}>
                        {u.scope_type}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        {u.scope_id}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${u.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      {u.last_login || 'Active Today'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <button 
                        type="button" 
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(u);
                        }}
                      >
                        <Eye size={12} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="admin-pagination">
          <div>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="admin-page-btn-group">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button 
                key={p} 
                type="button" 
                className={`admin-page-btn ${currentPage === p ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Detail Slide-in Drawer */}
      {selectedUser && (
        <AdminUserDrawer 
          user={selectedUser}
          roles={roles}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={() => {
            setSelectedUser(null);
            onRefresh && onRefresh();
          }}
        />
      )}

      {/* Create User Multi-Step Modal */}
      {isCreateOpen && (
        <AdminCreateUserModal 
          roles={roles}
          onClose={() => setIsCreateOpen(false)}
          onUserCreated={() => {
            setIsCreateOpen(false);
            onRefresh && onRefresh();
          }}
        />
      )}
    </div>
  );
}
