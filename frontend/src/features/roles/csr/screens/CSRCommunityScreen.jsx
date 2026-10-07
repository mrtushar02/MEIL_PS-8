import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Compass,
  Users,
  CheckCircle2,
  Eye,
  Edit2,
  X
} from 'lucide-react';
import { INITIAL_COMMUNITIES } from '../csrData';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function CSRCommunityScreen({
  communities = INITIAL_COMMUNITIES,
  onNavigateTab
}) {
  const [localCommunities, setLocalCommunities] = useState(communities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState('Odisha');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewCommunity, setViewCommunity] = useState(null);
  const [editCommunity, setEditCommunity] = useState(null);
  const [newCommForm, setNewCommForm] = useState({
    name: '',
    district: '',
    state: 'Odisha',
    population: 2500,
    projects_count: 1
  });

  React.useEffect(() => {
    if (communities && communities.length > 0) {
      setLocalCommunities(communities);
    }
  }, [communities]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCommForm.name) return;
    const created = {
      id: `COMM-${Date.now().toString().slice(-4)}`,
      name: newCommForm.name,
      district: newCommForm.district || 'Khordha',
      state: newCommForm.state,
      population: parseInt(newCommForm.population) || 2500,
      projects_count: parseInt(newCommForm.projects_count) || 1,
      status: 'Active'
    };
    setLocalCommunities([created, ...localCommunities]);
    setIsAddOpen(false);
    setNewCommForm({ name: '', district: '', state: 'Odisha', population: 2500, projects_count: 1 });
  };

  const filteredCommunities = localCommunities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge">
              <MapPin size={24} />
            </div>
            <div>
              <div className="csr-pill-tag">GEOGRAPHIC REACH</div>
              <h1 className="csr-hero-title">Community & Locations</h1>
              <p className="csr-hero-subtitle">
                Manage communities, project locations and social outreach across operational regions.
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-primary" onClick={() => setIsAddOpen(true)}>
              <Plus size={16} />
              + Add Community
            </button>
          </div>
        </div>
      </div>

      {/* ──── MINI STATS (4 CARDS) ──── */}
      <div className="csr-kpi-grid-4">
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Communities</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{localCommunities.length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Active Communities</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>{localCommunities.filter(c => c.status === 'Active').length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Population</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#DB2777', marginTop: '2px' }}>{localCommunities.reduce((acc, c) => acc + (c.population || 0), 0).toLocaleString()}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Districts Covered</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>{new Set(localCommunities.map(c => c.district)).size}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={18} />
          </div>
        </div>
      </div>

      {/* ──── 2 COLUMN LAYOUT: TABLE + GEOGRAPHIC MAP ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px' }}>
        {/* Left: Community Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="csr-search-box" style={{ width: '100%', maxWidth: 'none' }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              className="csr-search-input"
              placeholder="Search communities, location, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="csr-table-container">
            <table className="csr-table">
              <thead>
                <tr>
                  <th>Community Name</th>
                  <th>District</th>
                  <th>State</th>
                  <th>Population</th>
                  <th>Projects</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommunities.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{c.id}</div>
                    </td>
                    <td style={{ fontSize: '12.5px', color: '#334155' }}>{c.district}</td>
                    <td style={{ fontSize: '12.5px', color: '#475569' }}>{c.state}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{c.population.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: '#2563EB' }}>{c.projects_count}</td>
                    <td>
                      <span className={`csr-status-chip ${c.status.toLowerCase()}`}>{c.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="csr-btn-outline"
                          style={{ padding: '4px 8px' }}
                          title="View Profile"
                          onClick={() => setViewCommunity(c)}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="csr-btn-outline"
                          style={{ padding: '4px 8px' }}
                          title="Edit"
                          onClick={() => setEditCommunity(c)}
                        >
                          <Edit2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Geographic View with Map Visualization */}
        <div className="csr-glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Geographic View</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Project sites & community clusters</p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="csr-status-chip active">Active (54)</span>
              <span className="csr-status-chip planned">Planned (5)</span>
              <span className="csr-status-chip on-hold">On-Hold (3)</span>
            </div>
          </div>

          {/* SVG Map of India Representation */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '340px',
              borderRadius: '14px',
              background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {/* Map SVG Outline */}
            <svg viewBox="0 0 400 450" style={{ width: '85%', height: '85%', opacity: 0.85 }}>
              <path
                d="M 170 30 Q 190 20 220 30 Q 240 60 230 90 Q 270 110 320 120 Q 330 160 300 180 Q 330 200 310 240 Q 260 270 240 310 Q 210 370 190 420 Q 180 390 170 330 Q 130 310 110 260 Q 80 230 70 180 Q 90 140 120 130 Q 140 80 170 30 Z"
                fill="#FFFFFF"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
            </svg>

            {/* Interactive Pins */}
            {/* Odisha Pin */}
            <div
              style={{
                position: 'absolute',
                top: '52%',
                left: '64%',
                cursor: 'pointer',
                transform: selectedPin === 'Odisha' ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.2s ease'
              }}
              onClick={() => setSelectedPin('Odisha')}
            >
              <div style={{ background: '#2563EB', color: '#FFF', padding: '3px 8px', borderRadius: 9999, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 10px rgba(37,99,235,0.4)' }}>
                <MapPin size={12} /> Odisha (18)
              </div>
            </div>

            {/* Telangana Pin */}
            <div
              style={{
                position: 'absolute',
                top: '64%',
                left: '48%',
                cursor: 'pointer',
                transform: selectedPin === 'Telangana' ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.2s ease'
              }}
              onClick={() => setSelectedPin('Telangana')}
            >
              <div style={{ background: '#059669', color: '#FFF', padding: '3px 8px', borderRadius: 9999, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 10px rgba(5,150,105,0.4)' }}>
                <MapPin size={12} /> Telangana (14)
              </div>
            </div>

            {/* Bihar Pin */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '60%',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedPin('Bihar')}
            >
              <div style={{ background: '#0284C7', color: '#FFF', padding: '3px 8px', borderRadius: 9999, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 10px rgba(2,132,199,0.4)' }}>
                <MapPin size={12} /> Bihar (12)
              </div>
            </div>

            {/* Karnataka Pin */}
            <div
              style={{
                position: 'absolute',
                top: '72%',
                left: '38%',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedPin('Karnataka')}
            >
              <div style={{ background: '#D97706', color: '#FFF', padding: '3px 8px', borderRadius: 9999, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 10px rgba(217,119,6,0.4)' }}>
                <MapPin size={12} /> Karnataka (8)
              </div>
            </div>

            {/* Maharashtra Pin */}
            <div
              style={{
                position: 'absolute',
                top: '58%',
                left: '32%',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedPin('Maharashtra')}
            >
              <div style={{ background: '#7C3AED', color: '#FFF', padding: '3px 8px', borderRadius: 9999, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 10px rgba(124,58,237,0.4)' }}>
                <MapPin size={12} /> MH (10)
              </div>
            </div>
          </div>

          {/* Selected Region Quick Info Card */}
          <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>Selected Region: {selectedPin} Cluster</div>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>18 Active Villages • Primary: Rural Education & Water Infra</div>
            </div>
            <button className="csr-btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => onNavigateTab?.('projects')}>
              View Projects
            </button>
          </div>
        </div>
      </div>

      {/* Add Community Modal */}
      {isAddOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="csr-glass-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                Add New Community Location
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Community / Village Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rampur Village"
                  value={newCommForm.name}
                  onChange={(e) => setNewCommForm({ ...newCommForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Khordha"
                    value={newCommForm.district}
                    onChange={(e) => setNewCommForm({ ...newCommForm, district: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Odisha"
                    value={newCommForm.state}
                    onChange={(e) => setNewCommForm({ ...newCommForm, state: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Estimated Population Reach</label>
                <input
                  type="number"
                  value={newCommForm.population}
                  onChange={(e) => setNewCommForm({ ...newCommForm, population: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="csr-btn-outline"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="csr-btn-primary"
                >
                  Save Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Community Modal */}
      {viewCommunity && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setViewCommunity(null)}
        >
          <div
            className="csr-glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  {viewCommunity.name} ({viewCommunity.id})
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {viewCommunity.district}, {viewCommunity.state}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewCommunity(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '14px 0' }}>
              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Population</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{viewCommunity.population?.toLocaleString()}</div>
              </div>
              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Active CSR Projects</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563EB' }}>{viewCommunity.projects_count} Programs</div>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#EFF6FF', borderRadius: '10px', fontSize: '12.5px', color: '#1E293B', lineHeight: 1.5 }}>
              MEIL Impact: Safe drinking water RO plants and solar microgrids operational since 2024. Monitored under BRSR Principle 8.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                className="csr-btn-outline"
                onClick={() => setViewCommunity(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Community Modal */}
      {editCommunity && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setEditCommunity(null)}
        >
          <div
            className="csr-glass-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                Edit Community: {editCommunity.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditCommunity(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Community Name</label>
                <input
                  type="text"
                  value={editCommunity.name}
                  onChange={(e) => setEditCommunity({ ...editCommunity, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>District</label>
                <input
                  type="text"
                  value={editCommunity.district}
                  onChange={(e) => setEditCommunity({ ...editCommunity, district: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="csr-btn-outline"
                  onClick={() => setEditCommunity(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="csr-btn-primary"
                  onClick={() => {
                    setLocalCommunities(prev => prev.map(c => c.id === editCommunity.id ? editCommunity : c));
                    setEditCommunity(null);
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
