import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Eye, 
  CheckCheck,
  X 
} from 'lucide-react';
import esgStore from '../../../services/esgStore';

export default function AdminNotificationsScreen({
  notifications = []
}) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedNotif, setSelectedNotif] = useState(null);

  const initialNotifs = notifications.length > 0 ? notifications : [
    { id: '1', severity: 'HIGH', category: 'Security', title: 'Failed login attempts detected', time: '18 mins ago', status: 'New', detail: 'Rate limiting automatically engaged on external IP 192.168.1.45 after 5 invalid password attempts.' },
    { id: '2', severity: 'MEDIUM', category: 'System', title: 'New user created and credentials issued', time: '1 hour ago', status: 'New', detail: 'Super Administrator created a new user profile with Business Unit scope.' },
    { id: '3', severity: 'MEDIUM', category: 'Workflow', title: '3 submissions awaiting group review', time: '2 hours ago', status: 'Read', detail: 'Energy and Water BU batch submissions ready for Group CSO sign-off.' },
    { id: '4', severity: 'HIGH', category: 'SLA', title: 'Zojila Tunnel submission SLA at risk', time: '3 hours ago', status: 'Read', detail: 'Pending BU review is approaching the 48-hour compliance window.' },
    { id: '5', severity: 'HIGH', category: 'Security', title: 'Suspicious login attempt blocked', time: '5 hours ago', status: 'Read', detail: 'Automated security filter prevented unauthorized token generation from blacklisted IP.' }
  ];

  const [notifList, setNotifList] = useState(initialNotifs);

  const handleMarkAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, status: 'Read' })));
    esgStore.addAuditLog('NOTIFICATIONS_MARKED_READ', 'All admin notifications marked as read', 'ADMIN');
  };

  const filtered = activeCategory === 'ALL'
    ? notifList
    : notifList.filter(n => n.category.toUpperCase() === activeCategory.toUpperCase());

  return (
    <div className="admin-notifications-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>System Notifications</h2>
          <p>Real-time system telemetry alerts, security events, compliance reminders, and SLA notices</p>
        </div>

        <div className="admin-actions-group">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary"
            onClick={handleMarkAllRead}
          >
            <CheckCheck size={14} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Categories Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { id: 'ALL', label: 'All', count: allNotifs.length },
          { id: 'System', label: 'System', count: 1 },
          { id: 'Security', label: 'Security', count: 2 },
          { id: 'Workflow', label: 'Workflow', count: 1 },
          { id: 'SLA', label: 'SLA', count: 1 }
        ].map(cat => (
          <button 
            key={cat.id}
            type="button"
            className={`admin-btn ${activeCategory === cat.id ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Notifications List Card */}
      <div className="admin-table-card" style={{ padding: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(n => (
            <div 
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '12px',
                background: n.status === 'New' ? 'rgba(234, 244, 255, 0.6)' : '#FFFFFF',
                border: '1px solid rgba(226, 232, 240, 0.85)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: n.severity === 'HIGH' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                  color: n.severity === 'HIGH' ? '#DC2626' : '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {n.severity === 'HIGH' ? <ShieldAlert size={18} /> : <Bell size={18} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0F172A' }}>{n.title}</span>
                    <span className={`admin-badge ${n.severity === 'HIGH' ? 'admin-badge-danger' : 'admin-badge-blue'}`} style={{ fontSize: '10px' }}>
                      {n.category}
                    </span>
                    {n.status === 'New' && (
                      <span className="admin-badge admin-badge-success" style={{ fontSize: '9.5px' }}>NEW</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    {n.detail}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{n.time}</span>
                <button 
                  type="button" 
                  className="admin-btn admin-btn-secondary" 
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                  onClick={() => setSelectedNotif(n)}
                >
                  <Eye size={12} /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNotif && (
        <div className="admin-modal-overlay" onClick={() => setSelectedNotif(null)}>
          <div className="admin-modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  {selectedNotif.title}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedNotif(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`admin-badge ${selectedNotif.severity === 'HIGH' ? 'admin-badge-danger' : 'admin-badge-blue'}`}>
                  {selectedNotif.severity} PRIORITY
                </span>
                <span className="admin-badge admin-badge-purple">{selectedNotif.category}</span>
                <span style={{ fontSize: '11px', color: '#64748B', marginLeft: 'auto' }}>{selectedNotif.time}</span>
              </div>

              <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                {selectedNotif.detail}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedNotif(null)}
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
