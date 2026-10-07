import React, { useState } from 'react';
import { 
  Settings, 
  Search, 
  Key, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Database, 
  Bell, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  X 
} from 'lucide-react';

export default function AdminSettingsScreen({
  settingsData = {}
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'application', name: 'Application', desc: 'Configure app settings', icon: Settings, status: 'Configured', items: [
      { key: 'APP_NAME', val: 'MEIL ESG & BRSR Reporting Platform', status: 'Configured' },
      { key: 'APP_ENV', val: 'Production / Enterprise', status: 'Configured' },
      { key: 'DEFAULT_TIMEZONE', val: 'Asia/Kolkata (IST)', status: 'Configured' }
    ]},
    { id: 'auth', name: 'Authentication', desc: 'JWT, sessions, login', icon: Key, status: 'Configured', items: [
      { key: 'JWT_ALGORITHM', val: 'HS256 (SHA-256 HMAC)', status: 'Configured' },
      { key: 'TOKEN_TTL', val: '480 Minutes (8 Hours)', status: 'Configured' },
      { key: 'BLOCKLIST_MODE', val: 'In-Memory SHA-256 Vault', status: 'Active' }
    ]},
    { id: 'security', name: 'Security', desc: 'Security policies', icon: ShieldCheck, status: 'Protected', items: [
      { key: 'RATE_LIMIT_LOGIN', val: '5 attempts / 15 minutes', status: 'Configured' },
      { key: 'ACCOUNT_LOCKOUT', val: '15 Minutes Temporary Lockout', status: 'Configured' },
      { key: 'CROSS_ORIGIN_CORS', val: 'Strict Origin Whitelist', status: 'Active' }
    ]},
    { id: 'workflow', name: 'Workflow', desc: 'Approval workflow', icon: Layers, status: 'Configured', items: [
      { key: 'APPROVAL_TIERS', val: '4 Jurisdictional Levels', status: 'Configured' },
      { key: 'REWORK_BRANCHING', val: 'Enabled for BU & Sub Heads', status: 'Active' },
      { key: 'GROUP_LOCK_RULE', val: 'Enforced on CSO Sign-off', status: 'Configured' }
    ]},
    { id: 'reporting', name: 'Reporting', desc: 'Report generation', icon: FileText, status: 'Configured', items: [
      { key: 'PDF_ENGINE', val: 'Weasyprint / Canvas Renderer', status: 'Configured' },
      { key: 'XBRL_EXPORT', val: 'MCA & SEBI Taxonomy 2024', status: 'Configured' },
      { key: 'WATERMARK_UNAPPROVED', val: 'Enabled on Draft Documents', status: 'Active' }
    ]},
    { id: 'brsr', name: 'BRSR Configuration', desc: 'Framework settings', icon: CheckCircle2, status: 'Configured', items: [
      { key: 'STATUTORY_CIRCULAR', val: 'SEBI Circular 2025 Core In Force', status: 'Active' },
      { key: 'NGRBC_PRINCIPLES', val: '9 Core Principles (All Sections)', status: 'Configured' },
      { key: 'CEA_GRID_BASELINE', val: 'CEA v19 (0.716 kg CO₂e / kWh)', status: 'Configured' }
    ]},
    { id: 'storage', name: 'Storage', desc: 'File storage settings', icon: Database, status: 'Configured', items: [
      { key: 'STORAGE_BACKEND', val: 'Enterprise Local NAS / Blob', status: 'Configured' },
      { key: 'HASH_VERIFICATION', val: 'SHA-256 Checksum on Ingest', status: 'Active' },
      { key: 'MAX_DOCUMENT_SIZE', val: '50 MB per Evidence File', status: 'Configured' }
    ]},
    { id: 'notifications', name: 'Notifications', desc: 'Email & in-app', icon: Bell, status: 'Active', items: [
      { key: 'IN_APP_DISPATCH', val: 'Active Event Bus', status: 'Configured' },
      { key: 'SLA_BREACH_WARNINGS', val: '48h Window Alert Triggers', status: 'Configured' }
    ]},
    { id: 'environment', name: 'Environment', desc: 'Environment config', icon: Cpu, status: 'Configured', items: [
      { key: 'PYTHON_VERSION', val: 'Python 3.13 Runtime', status: 'Configured' },
      { key: 'VITE_SERVER', val: 'Node / Vite Dev & Build Pipeline', status: 'Configured' },
      { key: 'DB_DIALECT', val: 'SQLite (meil_esg.db)', status: 'Configured' }
    ]},
    { id: 'audit', name: 'Audit', desc: 'Audit settings', icon: Clock, status: 'Verified', items: [
      { key: 'HASH_CHAIN_GENESIS', val: 'Active SHA-256 Chain Linked', status: 'Verified' },
      { key: 'STATUTORY_RETENTION', val: '8 Years Immutable WORM', status: 'Configured' }
    ]}
  ];

  const filtered = categories.filter(c => 
    !search || 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-settings-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>System Settings</h2>
          <p>Inspect platform runtime configuration, statutory parameters, and security policies</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-left">
          <div className="admin-search-input-wrap">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search settings categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {filtered.map(cat => {
          const IconComp = cat.icon;
          return (
            <div 
              key={cat.id}
              className="admin-card"
              style={{ margin: 0, padding: '16px', cursor: 'pointer', transition: 'all 0.15s ease' }}
              onClick={() => setSelectedCategory(cat)}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <IconComp size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>{cat.name}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{cat.desc}</div>
              <div style={{ marginTop: '10px' }}>
                <span className="admin-badge admin-badge-success" style={{ fontSize: '10px' }}>
                  {cat.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Detail Modal */}
      {selectedCategory && (
        <div className="admin-modal-overlay" onClick={() => setSelectedCategory(null)}>
          <div className="admin-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} color="#2563EB" />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {selectedCategory.name} Configuration
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                    {selectedCategory.desc}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedCategory(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedCategory.items.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}><code>{item.key}</code></span>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', marginTop: '2px' }}>
                      {item.val}
                    </div>
                  </div>
                  <span className="admin-badge admin-badge-success">{item.status}</span>
                </div>
              ))}
            </div>

            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedCategory(null)}
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
