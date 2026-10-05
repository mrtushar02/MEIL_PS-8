import React, { useState } from 'react';
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  FileText,
  Upload
} from 'lucide-react';

const PROGRESS_DATA = [
  { name: 'Education', value: 28, color: '#2563EB' },
  { name: 'In Progress', value: 31, color: '#0284C7' },
  { name: 'Pending', value: 17, color: '#D97706' },
  { name: 'Budget', value: 12, color: '#059669' },
  { name: 'Elderly', value: 6, color: '#8B5CF6' }
];

export default function CSRProjectDetailScreen({
  project = null,
  onNavigateTab,
  onBack
}) {
  const p = project || {
    id: 'CSR-001',
    name: 'Rural Education Program',
    category: 'Education',
    location: 'Odisha',
    status: 'Active',
    start_date: '01 Apr 2025',
    end_date: '31 Mar 2027',
    budget_cr: 2.0,
    spend_cr: 1.2,
    beneficiaries: 5420,
    communities_count: 18,
    description: 'Improve access to quality education for rural children through school infrastructure support, digital learning and scholarships.'
  };

  const [activeSubTab, setActiveSubTab] = useState('Overview');

  const milestones = [
    { name: 'Project Initiation', date: '01 Apr 2025', status: 'Completed' },
    { name: 'Community Survey', date: '15 Jun 2025', status: 'Completed' },
    { name: 'Infrastructure Work', date: '01 Oct 2025', status: 'In Progress' },
    { name: 'Program Implementation', date: '01 Jan 2026', status: 'Pending' },
    { name: 'Impact Assessment', date: '15 Feb 2027', status: 'Pending' }
  ];

  const subTabs = [
    'Overview',
    'Activities',
    'Budget & Spend',
    'Beneficiaries',
    'Impact',
    'Stakeholders',
    'Grievances',
    'Evidence',
    'Submissions',
    'Analytics'
  ];

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ──── DETAIL HEADER BANNER ──── */}
      <div className="csr-hero-banner">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <button
              className="csr-btn-outline"
              style={{ padding: '8px 12px' }}
              onClick={onBack || (() => onNavigateTab?.('projects'))}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="csr-pill-tag" style={{ margin: 0 }}>{p.id}</span>
                <span className="csr-status-chip active">{p.category} • {p.location} • {p.status}</span>
              </div>
              <h1 className="csr-hero-title">{p.name}</h1>
              <p className="csr-hero-subtitle">{p.description}</p>
            </div>
          </div>

          {/* Project Photo Mockup */}
          <div
            style={{
              width: '180px',
              height: '90px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '2px solid #FFFFFF',
              flexShrink: 0,
              background: 'linear-gradient(135deg, #1E3A8A, #0284C7)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop"
              alt="Rural Education Facility"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
              Khurda Facility
            </div>
          </div>
        </div>

        {/* ──── DETAIL SUB TABS ──── */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '18px', borderTop: '1px solid #E2E8F0', paddingTop: '12px', overflowX: 'auto' }}>
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
                if (tab !== 'Overview') {
                  const map = {
                    'Beneficiaries': 'beneficiaries',
                    'Impact': 'social-impact',
                    'Stakeholders': 'stakeholders',
                    'Grievances': 'grievances',
                    'Evidence': 'evidence',
                    'Submissions': 'submissions',
                    'Analytics': 'analytics'
                  };
                  if (map[tab]) onNavigateTab?.(map[tab]);
                }
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeSubTab === tab ? '#2563EB' : 'transparent',
                color: activeSubTab === tab ? '#FFFFFF' : '#475569',
                transition: 'all 0.18s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ──── STATS SUMMARY ROW (6 CARDS) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        <div className="csr-glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Start Date</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{p.start_date}</div>
        </div>
        <div className="csr-glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>End Date</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{p.end_date}</div>
        </div>
        <div className="csr-glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Budget</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>₹{p.budget_cr} Cr</div>
        </div>
        <div className="csr-glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Spent</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>₹{p.spend_cr} Cr (60%)</div>
        </div>
        <div className="csr-glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Beneficiaries</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#DB2777', marginTop: '4px' }}>{p.beneficiaries.toLocaleString()}</div>
        </div>
        <div className="csr-glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Communities</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0284C7', marginTop: '4px' }}>{p.communities_count}</div>
        </div>
      </div>

      {/* ──── 3 COLUMN WORKSPACE (MILESTONES, PROGRESS DONUT, RECENT ACTIVITY) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
        {/* Milestones Card */}
        <div className="csr-glass-card">
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>Milestones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: m.status === 'Completed' ? '#DCFCE7' : m.status === 'In Progress' ? '#DBEAFE' : '#F1F5F9',
                      color: m.status === 'Completed' ? '#16A34A' : m.status === 'In Progress' ? '#2563EB' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{m.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{m.date}</div>
                  </div>
                </div>
                <span className={`csr-status-chip ${m.status.toLowerCase().replace(' ', '-')}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview Donut */}
        <div className="csr-glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', alignSelf: 'flex-start' }}>Progress Overview</h3>
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '150px', height: '150px', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3.6" />
              {/* Education (28%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#2563EB" strokeWidth="3.6" strokeDasharray="28, 100" strokeDashoffset="0" />
              {/* In Progress (31%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#0284C7" strokeWidth="3.6" strokeDasharray="31, 100" strokeDashoffset="-28" />
              {/* Pending (17%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#D97706" strokeWidth="3.6" strokeDasharray="17, 100" strokeDashoffset="-59" />
              {/* Budget (12%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#059669" strokeWidth="3.6" strokeDasharray="12, 100" strokeDashoffset="-76" />
              {/* Elderly (6%) */}
              <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="3.6" strokeDasharray="6, 100" strokeDashoffset="-88" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>60%</div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Progress</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', fontSize: '11px', marginTop: '12px' }}>
            {PROGRESS_DATA.map((d) => (
              <span key={d.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#334155' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="csr-glass-card">
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={15} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Site visit conducted</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>2 days ago • Khurda Project Site</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#FDF2F8', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={15} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Beneficiary data updated</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>5 days ago • 350 students added</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Upload size={15} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Evidence uploaded</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>8 days ago • Q2 Inspection report</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={15} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Community meeting</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>12 days ago • Gram Panchayat</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
