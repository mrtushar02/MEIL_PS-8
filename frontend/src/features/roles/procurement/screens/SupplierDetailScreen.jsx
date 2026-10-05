import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Calendar,
  AlertTriangle,
  TrendingUp,
  FileText,
  Activity,
  History,
  ChevronRight
} from 'lucide-react';

export default function SupplierDetailScreen({
  supplier,
  onNavigateTab,
  onBack
}) {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // Fallback if not provided
  const s = supplier || {
    id: 'SUP-001',
    code: 'SUP-001',
    name: 'ABC Construction Ltd.',
    category: 'Civil',
    location: 'Hyderabad, Telangana',
    msme: 'Yes',
    local: 'Yes',
    esgStatus: 'Assessed',
    risk: 'Medium',
    status: 'Active',
    spend: '₹42.8 Cr',
    contact: 'Rajesh Kumar',
    email: 'rajesh@abcconstruction.in',
    phone: '+91 98765 43210',
    bu: 'Infra - Roads',
    type: 'Contractor',
    onboarded: '12 Jan 2024',
    assessmentScore: 78,
    assessmentDate: '18 Aug 2026',
    nextReview: '18 Aug 2027'
  };

  const subTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'procurement', label: 'Procurement' },
    { id: 'assessments', label: 'ESG Assessment' },
    { id: 'risk', label: 'Risk' },
    { id: 'value-chain', label: 'Value Chain' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'actions', label: 'Actions' },
    { id: 'history', label: 'History' }
  ];

  const recentActivities = [
    { title: 'Assessment submitted', date: '3 days ago', user: 'Rajesh Kumar', status: 'Completed', color: '#059669' },
    { title: 'Evidence uploaded (ISO 14001)', date: '12 Sep 2026', user: 'Rajesh Kumar', status: 'Verified', color: '#2563EB' },
    { title: 'Procurement added (₹12.5 Cr)', date: '05 Sep 2026', user: 'ERP Sync', status: 'Processed', color: '#7C3AED' },
    { title: 'Risk level updated to Medium', date: '01 Sep 2026', user: 'Amit Kumar', status: 'Updated', color: '#D97706' },
    { title: 'Supplier details updated', date: '25 Aug 2026', user: 'Anand V.', status: 'Saved', color: '#64748B' }
  ];

  const categorySpend = [
    { label: 'Concrete', pct: 32, color: '#2563EB' },
    { label: 'Steel', pct: 28, color: '#0EA5E9' },
    { label: 'Equipment', pct: 18, color: '#10B981' },
    { label: 'Services', pct: 12, color: '#F59E0B' },
    { label: 'Others', pct: 10, color: '#94A3B8' }
  ];

  const monthlyTrend = [
    { month: 'Jan', val: 2.4 },
    { month: 'Feb', val: 3.8 },
    { month: 'Mar', val: 4.2 },
    { month: 'Apr', val: 3.1 },
    { month: 'May', val: 5.6 },
    { month: 'Jun', val: 6.2 },
    { month: 'Jul', val: 5.8 },
    { month: 'Aug', val: 7.2 },
    { month: 'Sep', val: 12.5 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Breadcrumb ──── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        <button
          type="button"
          onClick={onBack || (() => onNavigateTab?.('suppliers'))}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563EB',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0
          }}
        >
          <ArrowLeft size={14} />
          <span>Suppliers</span>
        </button>
        <ChevronRight size={13} color="#94A3B8" />
        <span style={{ color: '#0F172A', fontWeight: 700 }}>{s.code}</span>
      </div>

      {/* ──── Supplier Profile Hero Banner (Matching Image Panel 3) ──── */}
      <div className="proc-glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Main Info */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                {s.name}
              </h2>
              <span className="proc-status-chip active">{s.status}</span>
              {s.msme === 'Yes' && (
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>
                  MSME
                </span>
              )}
              {s.local === 'Yes' && (
                <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                  Local
                </span>
              )}
            </div>

            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 14px 0' }}>
              {s.category} Contractor | {s.location} | {s.code}
            </p>

            {/* Metadata Grid */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#94A3B8', fontWeight: 600, display: 'block', fontSize: '11px' }}>Primary Contact:</span>
                <strong style={{ color: '#1E293B' }}>{s.contact}</strong>
              </div>
              <div>
                <span style={{ color: '#94A3B8', fontWeight: 600, display: 'block', fontSize: '11px' }}>Contact Email:</span>
                <span style={{ color: '#2563EB', fontWeight: 600 }}>{s.email}</span>
              </div>
              <div>
                <span style={{ color: '#94A3B8', fontWeight: 600, display: 'block', fontSize: '11px' }}>Phone:</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{s.phone}</span>
              </div>
              <div>
                <span style={{ color: '#94A3B8', fontWeight: 600, display: 'block', fontSize: '11px' }}>Business Unit:</span>
                <strong style={{ color: '#1E293B' }}>{s.bu}</strong>
              </div>
              <div>
                <span style={{ color: '#94A3B8', fontWeight: 600, display: 'block', fontSize: '11px' }}>Supplier Type:</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{s.type}</span>
              </div>
              <div>
                <span style={{ color: '#94A3B8', fontWeight: 600, display: 'block', fontSize: '11px' }}>Onboarded:</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{s.onboarded}</span>
              </div>
            </div>
          </div>

          {/* Site photo thumbnail mockup matching reference */}
          <div
            style={{
              width: '160px',
              height: '90px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              background: '#0F172A',
              position: 'relative'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=320&h=180&fit=crop"
              alt="Project Site"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
            <div style={{ position: 'absolute', bottom: '4px', left: '6px', fontSize: '9.5px', color: '#FFFFFF', fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              Zojila Tunnel Site
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '18px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', overflowX: 'auto' }}>
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`proc-subnav-tab ${activeSubTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                if (tab.id !== 'overview' && tab.id !== 'history') {
                  onNavigateTab?.(tab.id);
                } else {
                  setActiveSubTab(tab.id);
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──── Supplier Detail KPIs Row ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        <div className="proc-kpi-card">
          <div className="proc-kpi-top">
            <span className="proc-kpi-label">Total Procurement Value</span>
            <div className="proc-kpi-icon-pill" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <TrendingUp size={15} />
            </div>
          </div>
          <span className="proc-kpi-value" style={{ fontSize: '24px' }}>₹42.8 Cr</span>
          <span className="proc-kpi-sub">FY 2026-27 cumulative</span>
        </div>

        <div className="proc-kpi-card">
          <div className="proc-kpi-top">
            <span className="proc-kpi-label">Transactions</span>
            <div className="proc-kpi-icon-pill" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
              <FileText size={15} />
            </div>
          </div>
          <span className="proc-kpi-value" style={{ fontSize: '24px' }}>86</span>
          <span className="proc-kpi-sub">All POs & Invoices</span>
        </div>

        <div className="proc-kpi-card">
          <div className="proc-kpi-top">
            <span className="proc-kpi-label">Latest Assessment</span>
            <span className="proc-status-chip active" style={{ fontSize: '10px', padding: '1px 6px' }}>Assessed</span>
          </div>
          <span className="proc-kpi-value" style={{ fontSize: '18px', color: '#0F172A' }}>
            18 Aug 2026
          </span>
          <span className="proc-kpi-sub" style={{ color: '#059669', fontWeight: 700 }}>Score: 78/100 (Grade A)</span>
        </div>

        <div className="proc-kpi-card">
          <div className="proc-kpi-top">
            <span className="proc-kpi-label">Risk Rating</span>
            <div className="proc-kpi-icon-pill" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <AlertTriangle size={15} />
            </div>
          </div>
          <span className="proc-kpi-value" style={{ fontSize: '22px', color: '#D97706' }}>
            Medium
          </span>
          <span className="proc-kpi-sub">H&S audit pending</span>
        </div>

        <div className="proc-kpi-card">
          <div className="proc-kpi-top">
            <span className="proc-kpi-label">Next Review</span>
            <div className="proc-kpi-icon-pill" style={{ background: 'rgba(100, 116, 139, 0.1)', color: '#64748B' }}>
              <Calendar size={15} />
            </div>
          </div>
          <span className="proc-kpi-value" style={{ fontSize: '18px', color: '#0F172A' }}>
            18 Aug 2027
          </span>
          <span className="proc-kpi-sub">Annual Cycle</span>
        </div>
      </div>

      {/* ──── Bottom 3 Panels (Category Donut, Trend, Recent Activity) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.3fr', gap: '14px' }}>
        
        {/* Panel 1: Category-wise Procurement */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '12px' }}>
            <div>
              <div className="proc-glass-card-title">Category-wise Procurement</div>
              <div className="proc-glass-card-subtitle">Spend breakdown by material type</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categorySpend.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>{cat.label}</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{cat.pct}%</span>
                </div>
                <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${cat.pct}%`,
                      background: cat.color,
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Procurement Trend */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '12px' }}>
            <div>
              <div className="proc-glass-card-title">Procurement Trend</div>
              <div className="proc-glass-card-subtitle">Monthly purchase orders (₹ Cr)</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB' }}>Total: ₹42.8 Cr</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '10px', borderBottom: '1px solid #E2E8F0' }}>
            {monthlyTrend.map((d, i) => {
              const h = (d.val / 14) * 120;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <div
                    style={{
                      width: '14px',
                      height: `${h}px`,
                      background: '#2563EB',
                      borderRadius: '4px 4px 0 0'
                    }}
                    title={`${d.month}: ₹${d.val} Cr`}
                  />
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 3: Recent Activity */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '12px' }}>
            <div>
              <div className="proc-glass-card-title">Recent Activity</div>
              <div className="proc-glass-card-subtitle">Audit history & timeline</div>
            </div>
            <Activity size={15} color="#64748B" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentActivities.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.color, marginTop: '4px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#1E293B' }}>{act.title}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{act.date} • {act.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
