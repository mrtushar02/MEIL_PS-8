import React, { useState } from 'react';
import {
  Users2,
  Search,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  Eye,
  X
} from 'lucide-react';
import { INITIAL_STAKEHOLDERS } from '../csrData';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function CSRStakeholdersScreen({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [engagements, setEngagements] = useState(INITIAL_STAKEHOLDERS);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [viewEngagement, setViewEngagement] = useState(null);

  const [newLogForm, setNewLogForm] = useState({
    group: '',
    project: 'Clean Drinking Water RO Plants',
    community: 'Rampur Village',
    purpose: 'Community Needs Assessment',
    participants: 35,
    feedback: '',
    action: ''
  });

  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (!newLogForm.group) return;
    const created = {
      id: `ENG-${Date.now().toString().slice(-4)}`,
      group: newLogForm.group,
      project: newLogForm.project,
      community: newLogForm.community,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      purpose: newLogForm.purpose,
      participants: parseInt(newLogForm.participants) || 30,
      feedback: newLogForm.feedback || 'Community endorsed project milestones.',
      action: newLogForm.action || 'Initiated project rollout.',
      status: 'Active'
    };
    setEngagements([created, ...engagements]);
    setIsLogOpen(false);
    setNewLogForm({
      group: '',
      project: 'Clean Drinking Water RO Plants',
      community: 'Rampur Village',
      purpose: 'Community Needs Assessment',
      participants: 35,
      feedback: '',
      action: ''
    });
  };

  const filteredEngagements = engagements.filter((e) =>
    e.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.community.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}>
              <Users2 size={24} />
            </div>
            <div>
              <div className="csr-pill-tag" style={{ color: '#0284C7', borderColor: 'rgba(2, 132, 199, 0.25)', background: 'rgba(2, 132, 199, 0.08)' }}>
                COMMUNITY CONSULTATION & NGRBC PRINCIPLE 4
              </div>
              <h1 className="csr-hero-title">Stakeholder Engagement</h1>
              <p className="csr-hero-subtitle">
                Record community interactions, consultations, feedback, grievances and follow-up action closures.
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-primary" onClick={() => setIsLogOpen(true)}>
              <Plus size={16} />
              + Log Engagement
            </button>
          </div>
        </div>
      </div>

      {/* ──── STATS ──── */}
      <div className="csr-kpi-grid-4">
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Engagements</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>34</div>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>Quarterly Consultations</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users2 size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Participants</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>1,480</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Villagers, Gram Panchayats</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Open Follow-ups</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>5</div>
            <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 700, marginTop: '2px' }}>Assigned to Site Leads</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
        </div>

        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Closed Consultations</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>29</div>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>85% Action Closure Rate</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* ──── SEARCH BAR ──── */}
      <div className="csr-filter-bar">
        <div className="csr-search-box">
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            className="csr-search-input"
            placeholder="Search stakeholder groups, projects, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ──── STAKEHOLDERS TABLE ──── */}
      <div className="csr-table-container">
        <table className="csr-table">
          <thead>
            <tr>
              <th>Engagement ID</th>
              <th>Date</th>
              <th>Stakeholder Type & Group</th>
              <th>Project & Community</th>
              <th>Purpose & Topics</th>
              <th>Participants</th>
              <th>Feedback & Action</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEngagements.map((e) => (
              <tr key={e.id}>
                <td style={{ fontWeight: 700, color: '#2563EB' }}>{e.id}</td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{e.date}</td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{e.group}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>{e.stakeholder_type}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#2563EB' }}>{e.project}</div>
                  <div style={{ fontSize: '11.5px', color: '#475569' }}>{e.community}</div>
                </td>
                <td>
                  <div style={{ fontSize: '12.5px', color: '#1E293B', maxWidth: '280px' }}>{e.purpose}</div>
                </td>
                <td style={{ fontWeight: 700, color: '#0F172A' }}>{e.participants}</td>
                <td>
                  <div style={{ fontSize: '12px', color: '#334155', maxWidth: '260px' }}>{e.feedback}</div>
                  <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600, marginTop: '2px' }}>Action: {e.action}</div>
                </td>
                <td>
                  <span className={`csr-status-chip ${e.status === 'Closed' ? 'completed' : e.status === 'Follow-up' ? 'high' : 'active'}`}>
                    {e.status}
                  </span>
                </td>
                <td>
                  <button
                    className="csr-btn-outline"
                    style={{ padding: '4px 8px' }}
                    title="View Details"
                    onClick={() => setViewEngagement(e)}
                  >
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Engagement Modal */}
      {isLogOpen && (
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
          onClick={() => setIsLogOpen(false)}
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                Log Stakeholder Engagement
              </h3>
              <button
                type="button"
                onClick={() => setIsLogOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Stakeholder Group</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gram Panchayat Council"
                  value={newLogForm.group}
                  onChange={(e) => setNewLogForm({ ...newLogForm, group: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Village / Community</label>
                  <input
                    type="text"
                    required
                    value={newLogForm.community}
                    onChange={(e) => setNewLogForm({ ...newLogForm, community: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Participants</label>
                  <input
                    type="number"
                    value={newLogForm.participants}
                    onChange={(e) => setNewLogForm({ ...newLogForm, participants: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Key Community Feedback</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Village council requested secondary pipelines to south hamlet"
                  value={newLogForm.feedback}
                  onChange={(e) => setNewLogForm({ ...newLogForm, feedback: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Agreed MEIL Action & Timeline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Survey team scheduled for next week"
                  value={newLogForm.action}
                  onChange={(e) => setNewLogForm({ ...newLogForm, action: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="csr-btn-outline"
                  onClick={() => setIsLogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="csr-btn-primary"
                >
                  Save Engagement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Engagement Modal */}
      {viewEngagement && (
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
          onClick={() => setViewEngagement(null)}
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
                  {viewEngagement.group} ({viewEngagement.id})
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {viewEngagement.community} • {viewEngagement.date}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewEngagement(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Feedback & Concerns Raised</div>
              <div style={{ fontSize: '13px', color: '#1E293B', marginTop: '4px' }}>{viewEngagement.feedback}</div>
            </div>

            <div style={{ padding: '12px', background: '#EFF6FF', borderRadius: '10px', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>Agreed Action Closure</div>
              <div style={{ fontSize: '13px', color: '#1E40AF', marginTop: '4px' }}>{viewEngagement.action}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="csr-btn-outline"
                onClick={() => setViewEngagement(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="csr-btn-primary"
                onClick={() => {
                  exportToCsv(`Engagement_${viewEngagement.id}.csv`, [viewEngagement]);
                  setViewEngagement(null);
                }}
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
