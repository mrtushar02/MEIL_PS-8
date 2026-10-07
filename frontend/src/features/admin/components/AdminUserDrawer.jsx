import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Mail, 
  Building, 
  Key, 
  Clock, 
  AlertTriangle, 
  LogOut, 
  Edit3, 
  CheckCircle2 
} from 'lucide-react';
import { api } from '../../../services/api';

export default function AdminUserDrawer({
  user,
  roles = [],
  onClose,
  onUserUpdated
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role_id || user.role_code);
  const [isActive, setIsActive] = useState(user.is_active);
  const [fullName, setFullName] = useState(user.full_name);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      await api.updateAdminUser(user.id, {
        full_name: fullName,
        role_id: selectedRole,
        is_active: isActive
      });
      setFeedback({ type: 'success', message: 'User updated successfully!' });
      setIsEditing(false);
      onUserUpdated && onUserUpdated();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeSessions = async () => {
    if (!window.confirm(`Force revoke all active sessions for ${user.full_name}?`)) return;
    try {
      await api.revokeAdminUserSessions(user.id);
      setFeedback({ type: 'success', message: 'All active sessions revoked.' });
      onUserUpdated && onUserUpdated();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div className="admin-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              User Profile & Access
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Canonical identity ID: {user.id}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={16} color="#64748B" />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {feedback && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: '600',
              background: feedback.type === 'success' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
              color: feedback.type === 'success' ? '#16A34A' : '#DC2626',
              border: `1px solid ${feedback.type === 'success' ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`
            }}>
              {feedback.message}
            </div>
          )}

          {/* Profile Identity Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800'
            }}>
              {user.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="admin-search-input"
                  style={{ marginBottom: '6px' }}
                />
              ) : (
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                  {user.full_name}
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={12} /> {user.email}
              </div>
            </div>
            <span className={`admin-badge ${user.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
              {user.is_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>

          {/* Role & Access Section */}
          <div className="admin-card" style={{ margin: 0, padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} color="#2563EB" /> Role & Authority Assignment
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>Assigned Canonical Role</label>
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="admin-select"
                  style={{ width: '100%' }}
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <input 
                    type="checkbox" 
                    id="user-active-toggle"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <label htmlFor="user-active-toggle" style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>
                    User Account Active
                  </label>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#64748B' }}>Current Role</span>
                  <strong style={{ color: '#2563EB' }}>{user.role_name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#64748B' }}>Role Code</span>
                  <span className="admin-badge admin-badge-purple">{user.role_code}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#64748B' }}>Scope Level</span>
                  <span className="admin-badge admin-badge-blue">{user.scope_type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#64748B' }}>Assigned Scope Node</span>
                  <strong style={{ color: '#0F172A' }}>{user.scope_id}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Security & Sessions */}
          <div className="admin-card" style={{ margin: 0, padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#16A34A" /> Security & Session Controls
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Last Login</span>
                <strong>{user.last_login}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Created On</span>
                <strong>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'System Genesis'}</strong>
              </div>

              <button 
                type="button" 
                onClick={handleRevokeSessions}
                className="admin-btn admin-btn-danger"
                style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
              >
                <LogOut size={14} /> Force Revoke All Active Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {isEditing ? (
            <>
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="admin-btn admin-btn-primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className="admin-btn admin-btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={14} /> Edit User & Role
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
