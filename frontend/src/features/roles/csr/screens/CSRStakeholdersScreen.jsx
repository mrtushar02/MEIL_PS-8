import React, { useState } from 'react';
import {
  Users2,
  Search,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';
import { INITIAL_STAKEHOLDERS } from '../csrData';

export default function CSRStakeholdersScreen({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [engagements, setEngagements] = useState(INITIAL_STAKEHOLDERS);

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
            <button className="csr-btn-primary" onClick={() => alert('Opening Log Engagement Dialog...')}>
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
                    onClick={() => alert(`Stakeholder Consultation:\n${e.group} (${e.date})\nAction: ${e.action}`)}
                  >
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
