import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, 
  CheckCircle2, 
  Layers, 
  Radio, 
  Cpu, 
  ShieldCheck, 
  Check, 
  Zap, 
  Send, 
  FileEdit, 
  AlertCircle, 
  Paperclip, 
  IndianRupee, 
  BarChart3, 
  Flame, 
  Droplets, 
  Download, 
  X
} from 'lucide-react';
import DataStreamSkeleton from './DataStreamSkeleton';
import { esgStore } from '../../services/esgStore';
import { api } from '../../services/api';
import { exportToCsv } from '../../utils/exportUtils';
import { MEIL_MEDIA } from '../../config/projectMedia';
import './DataStreamDashboard.css';

export default function DataStreamDashboard({
  user = { name: 'Rohit Kumar', email: 'rohit.kumar@meil.in' },
  _role = { id: 'PROJECT_OFFICER', title: 'Project / Site User' },
  onNavigateTab,
  reportingPeriod = 'September 2026',
  _onPeriodChange,
  _onLogout
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeNavTab, setActiveNavTab] = useState('Overview');
  const [activeOperationalTab, setActiveOperationalTab] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [kpis, setKpis] = useState(() => esgStore.getCalculatedKPIs());
  const [auditTrail, setAuditTrail] = useState(() => esgStore.getState().auditLogs?.slice(0, 4) || []);
  const [formInputs, setFormInputs] = useState({
    location: 'Zojila Tunnel PKG-2',
    division: 'DG Heavy Fleet',
    email: 'rohit.kumar@meilgroup.in',
    message: 'Monthly diesel fuel challan & 33kV substation meter calibration verified.'
  });
  const [formSaved, setFormSaved] = useState(false);

  // Subscribe to live ESG store and live backend audit trail
  useEffect(() => {
    const updateStore = () => {
      setKpis(esgStore.getCalculatedKPIs());
      setAuditTrail(esgStore.getState().auditLogs?.slice(0, 4) || []);
    };
    updateStore();

    api.getAuditLogs({ limit: 4 })
      .then(logs => {
        if (Array.isArray(logs) && logs.length > 0) {
          setAuditTrail(logs.slice(0, 4).map(l => ({
            id: l.id,
            user: l.user_name || l.user_email || 'Authorized Officer',
            reason: l.action_type || l.entity_name || 'Operational telemetry logged',
            timestamp: l.timestamp || new Date().toISOString()
          })));
        }
      })
      .catch(e => {
        console.warn('Live audit trail sync fallback:', e.message);
      });

    return esgStore.subscribe(updateStore);
  }, []);

  // Site Team Members configuration for direct messaging & selection
  const SITE_TEAM_MEMBERS = [
    {
      id: 'rohit',
      name: 'Rohit Kumar',
      role: 'Site Lead',
      status: 'Active',
      statusColor: '#10B981',
      pillBg: 'rgba(56, 189, 248, 0.15)',
      pillColor: '#0284C7',
      avatar: '/avatar_rohit.jpg',
      ackReply: 'Acknowledged, checking the site logs immediately.'
    },
    {
      id: 'venkat',
      name: 'K. Venkat',
      role: 'Plant Mech',
      status: 'Logged',
      statusColor: '#38BDF8',
      pillBg: 'rgba(251, 146, 60, 0.15)',
      pillColor: '#EA580C',
      avatar: '/avatar_reviewer.jpg',
      ackReply: 'Got it, verifying 33kV substation telemetry and DG meters.'
    },
    {
      id: 'priyanka',
      name: 'Priyanka S.',
      role: 'EHS Water',
      status: 'Active',
      statusColor: '#10B981',
      pillBg: 'rgba(250, 204, 21, 0.18)',
      pillColor: '#CA8A04',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      ackReply: 'Understood, reviewing the ZLD water sampling batch.'
    },
    {
      id: 'jitendra',
      name: 'Jitendra Roy',
      role: 'Safety Lead',
      status: 'Verified',
      statusColor: '#4ADE80',
      pillBg: 'rgba(74, 222, 128, 0.2)',
      pillColor: '#16A34A',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80',
      ackReply: 'Safety lead here, 45,000 safe man-hours confirmed on record.'
    }
  ];

  // Site Team Dispatch & Shift Chat State
  const [selectedRecipient, setSelectedRecipient] = useState('All');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Rohit Kumar', role: 'Site Lead', time: '10m ago', text: 'DG Fleet Batch #HMR-01 fuel calibration verified with IOCL tanker receipt.', recipient: 'All', avatar: '/avatar_rohit.jpg' },
    { id: 2, user: 'K. Venkat', role: 'Plant Mech', time: '28m ago', text: '33kV substation smart meter synced with CEA grid baseline (0.716 kg/kWh).', recipient: 'All', avatar: '/avatar_reviewer.jpg' },
    { id: 3, user: 'Priyanka S.', role: 'EHS Water', time: '1h ago', text: 'STP discharge BOD/COD lab report uploaded. ZLD compliant at 70%.', recipient: 'All', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' },
    { id: 4, user: 'Jitendra Roy', role: 'Safety Lead', time: '2h ago', text: 'Toolbox talk completed for 86 personnel. Zero near-miss reported today.', recipient: 'All', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80' }
  ]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const recipient = selectedRecipient;
    const msgText = chatInput.trim();
    const newMsg = {
      id: Date.now(),
      user: user.name || 'Rohit Kumar',
      role: 'Site Lead',
      time: 'Just now',
      text: msgText,
      recipient: recipient,
      avatar: '/avatar_rohit.jpg'
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // If sent to a specific team member, trigger automatic acknowledgment reply
    if (recipient !== 'All') {
      const targetMember = SITE_TEAM_MEMBERS.find((m) => m.name === recipient);
      if (targetMember) {
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              user: targetMember.name,
              role: targetMember.role,
              time: 'Just now',
              text: targetMember.ackReply,
              recipient: user.name || 'Rohit Kumar',
              isReply: true,
              avatar: targetMember.avatar
            }
          ]);
        }, 850);
      }
    }
  };

  const navRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  // Initial skeleton load simulation for smooth luxury transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Mouse wheel horizontal scrolling for secondary nav pod
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 1.5, behavior: 'smooth' });
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isLoading]);

  const handleMouseDown = (e) => {
    if (!navRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - navRef.current.offsetLeft);
    setScrollLeftPos(navRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    navRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const navTabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Fuel & DG', label: 'Fuel & DG' },
    { id: 'Grid Power', label: 'Grid Power' },
    { id: 'Water & ZLD', label: 'Water & ZLD' },
    { id: 'Safety & HSE', label: 'Safety & HSE' },
    { id: 'Waste & Scrap', label: 'Waste & Scrap' },
    { id: 'Site Team', label: 'Site Team' },
    { id: 'Sync & IoT', label: 'Sync & IoT' },
    { id: 'Workforce', label: 'Workforce' },
    { id: 'Travel', label: 'Travel' }
  ];

  const handleNavClick = (tabId) => {
    setActiveNavTab(tabId);
    if (tabId === 'Overview') {
      setActiveOperationalTab(null);
    } else {
      setActiveOperationalTab(tabId);
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    const qty = formInputs.division === 'DG Heavy Fleet' ? 2400 : 1800;
    esgStore.addFuelRecord({
      quantityLitres: qty,
      division: formInputs.division,
      location: formInputs.location,
      meterReading: 'MTR-DG-PKG2',
      challanNo: `CH-${Math.floor(10000 + Math.random() * 90000)}`,
      supplier: 'Indian Oil Corporation Ltd (IOCL)',
      notes: formInputs.message || 'Logged via Custom Site Log Form'
    }, user.name || 'Rohit Kumar');

    setFormSaved(true);
    setTimeout(() => setFormSaved(false), 3000);

    try {
      await api.createProjectEnergy('site-102', {
        reporting_period_id: 'period-2025-09',
        diesel_litres: qty,
        petrol_litres: 0,
        natural_gas_m3: 0,
        grid_electricity_kwh: 0,
        renewable_electricity_kwh: 0
      });
    } catch (err) {
      console.warn('Backend energy sync fallback:', err.message);
    }
  };

  if (isLoading) {
    return <DataStreamSkeleton />;
  }

  return (
    <div className="ds-dashboard-wrapper">
      {/* Background Ambient Glow */}
      <div className="ds-ambient-glow" />

      {/* Master 2-Island Grid Layout */}
      <div className="ds-master-layout">
        
        {/* ==============================================================
            LEFT MASTER ISLAND (~70% Width)
            ============================================================== */}
        <div className="ds-master-island">
          
          {/* 1. Header Bar: Active Site Context & Nav Capsule */}
          <div className="ds-island-header">
            {/* Active Facility Context Strip with Immersive Real Site Background */}
            <div 
              style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderRadius: '12px',
                backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.82) 55%, rgba(15, 23, 42, 0.4) 100%), url('${MEIL_MEDIA.zojilaTunnel.src}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)',
                marginBottom: '12px',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, zIndex: 1 }}>
                <div 
                  style={{ 
                    width: '56px', 
                    height: '42px', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={MEIL_MEDIA.zojilaTunnel.src} 
                    alt={MEIL_MEDIA.zojilaTunnel.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                      {MEIL_MEDIA.zojilaTunnel.title}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.25)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                      PKG-2 · Active Strategic Site
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.25)', color: '#4ADE80', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                      13.1 km High-Altitude Tunnel
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '2px' }}>
                    {MEIL_MEDIA.zojilaTunnel.subtitle} · Site Lead: Rohit Kumar
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, zIndex: 1 }}>
                <button
                  type="button"
                  className="ds-pill-btn"
                  onClick={() => onNavigateTab?.('my-project')}
                  style={{ 
                    fontSize: '11.5px', 
                    padding: '6px 14px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  View All 9 Projects &rarr;
                </button>
              </div>
            </div>

            {/* Nav Pill Pod Spanning Full Island Width - Mouse Wheel & Drag Scrollable */}
            <div 
              ref={navRef}
              className={`ds-nav-pill-pod ${isMouseDown ? 'is-dragging' : ''}`}
              role="tablist" 
              aria-label="Site Modules"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeaveOrUp}
              onMouseUp={handleMouseLeaveOrUp}
              onMouseMove={handleMouseMove}
            >
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeNavTab === tab.id}
                  className={`ds-nav-item ${activeNavTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Internal 2-Column Grid */}
          <div className="ds-island-grid">
            
            {/* ── LEFT SUB-COLUMN ─────────────────────────────────── */}
            <div className="ds-sub-col">
              
              {/* Card 1: Dashboard Overview (Site ESG Parameters) */}
              <div className="ds-card">
                <div className="ds-card-header">
                  <div>
                    <span className="ds-card-title">Site ESG Overview</span>
                    <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '3px' }}>
                      Real-time telemetry, GHG footprint & resource circularity
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="ds-pill-btn"
                    onClick={() => onNavigateTab?.('data-entry')}
                  >
                    Log Site Data
                  </button>
                </div>

                {/* 4 Frosted KPI Pods */}
                <div className="ds-overview-kpi-grid">
                  <div className="ds-overview-kpi-card">
                    <div className="ds-kpi-header">
                      <span className="ds-kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
                        <Flame size={15} />
                      </span>
                      <span className="ds-metric-delta-badge">-4.2% YoY</span>
                    </div>
                    <div className="ds-kpi-val">{kpis.totalGhg_t ? kpis.totalGhg_t.toLocaleString() : '347.4'} <span className="ds-kpi-unit">tCO₂e</span></div>
                    <div className="ds-kpi-lbl">Scope 1 & 2 Emissions</div>
                  </div>

                  <div className="ds-overview-kpi-card">
                    <div className="ds-kpi-header">
                      <span className="ds-kpi-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                        <Zap size={15} />
                      </span>
                      <span className="ds-metric-delta-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>+1.2%</span>
                    </div>
                    <div className="ds-kpi-val">{kpis.gridMwh ? kpis.gridMwh.toLocaleString() : '384'} <span className="ds-kpi-unit">MWh</span></div>
                    <div className="ds-kpi-lbl">33kV Grid Electricity</div>
                  </div>

                  <div className="ds-overview-kpi-card">
                    <div className="ds-kpi-header">
                      <span className="ds-kpi-icon-wrap" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
                        <Cpu size={15} />
                      </span>
                      <span className="ds-metric-delta-badge" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>Verified</span>
                    </div>
                    <div className="ds-kpi-val">{kpis.dieselLitres ? kpis.dieselLitres.toLocaleString() : '18,650'} <span className="ds-kpi-unit">L</span></div>
                    <div className="ds-kpi-lbl">HSD Diesel (DG Fleet)</div>
                  </div>

                  <div className="ds-overview-kpi-card">
                    <div className="ds-kpi-header">
                      <span className="ds-kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <Droplets size={15} />
                      </span>
                      <span className="ds-metric-delta-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>ZLD Active</span>
                    </div>
                    <div className="ds-kpi-val">{kpis.recycledSharePct || 70}% <span className="ds-kpi-unit">Share</span></div>
                    <div className="ds-kpi-lbl">Recycled Water Outflow</div>
                  </div>
                </div>

                {/* Dual Wave Trend Charts */}
                <div className="ds-overview-dual-charts" style={{ marginTop: '16px' }}>
                  {/* Left Chart Box: Monthly Emissions Wave */}
                  <div className="ds-mini-chart-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Monthly GHG Trajectory</span>
                      <span style={{ fontSize: '11px', color: '#64748B', background: 'rgba(241, 245, 249, 0.8)', padding: '2px 7px', borderRadius: '5px' }}>Target: &lt;5k tCO₂e</span>
                    </div>

                    <div style={{ width: '100%', height: '70px' }}>
                      <svg viewBox="0 0 240 64" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <defs>
                          <linearGradient id="blueWaveGrad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#258BE6" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#258BE6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 46 C 40 48, 60 16, 100 24 C 140 32, 170 12, 200 22 C 220 28, 230 18, 240 20 L 240 64 L 0 64 Z"
                          fill="url(#blueWaveGrad1)"
                        />
                        <path
                          d="M 0 46 C 40 48, 60 16, 100 24 C 140 32, 170 12, 200 22 C 220 28, 230 18, 240 20"
                          fill="none"
                          stroke="#258BE6"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                        <circle cx="100" cy="24" r="3.5" fill="#FFFFFF" stroke="#258BE6" strokeWidth="2" />
                        <circle cx="200" cy="22" r="3.5" fill="#FFFFFF" stroke="#258BE6" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="ds-chart-axis-labels">
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                    </div>
                  </div>

                  {/* Right Chart Box: Fuel & Circularity Wave */}
                  <div className="ds-mini-chart-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>Water Recycling & ZLD Curve</span>
                      <span style={{ fontSize: '11px', color: '#16A34A', background: 'rgba(22, 163, 74, 0.08)', padding: '2px 7px', borderRadius: '5px' }}>ZLD Compliant</span>
                    </div>

                    <div style={{ width: '100%', height: '70px' }}>
                      <svg viewBox="0 0 240 64" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <defs>
                          <linearGradient id="greenWaveGrad2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 42 C 45 44, 75 14, 120 18 C 160 22, 195 40, 240 22 L 240 64 L 0 64 Z"
                          fill="url(#greenWaveGrad2)"
                        />
                        <path
                          d="M 0 42 C 45 44, 75 14, 120 18 C 160 22, 195 40, 240 22"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                        <circle cx="120" cy="18" r="3.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="ds-chart-axis-labels">
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Site Activity & Audit Logs (Moved to left sub-column) */}
              <div className="ds-card">
                <div className="ds-card-header">
                  <span className="ds-card-title">Site Activity & Audit Logs</span>
                  <button 
                    type="button" 
                    className="ds-pill-btn"
                    onClick={() => onNavigateTab?.('audit')}
                  >
                    View All
                  </button>
                </div>

                <table className="ds-table">
                  <thead>
                    <tr>
                      <th>Engineer</th>
                      <th>Site Task / Disclosure</th>
                      <th>Date / Time</th>
                      <th style={{ width: '24px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditTrail.map((log) => {
                      const avatar = log.user?.includes('Venkat') ? '/avatar_reviewer.jpg'
                        : log.user?.includes('Priyanka') ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80'
                        : log.user?.includes('Jitendra') ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80'
                        : '/avatar_rohit.jpg';
                      return (
                        <tr key={log.id} onClick={() => onNavigateTab?.('audit')} style={{ cursor: 'pointer' }}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                              <img 
                                src={avatar} 
                                alt={log.user} 
                                className="ds-user-avatar"
                                style={{ width: '26px', height: '26px' }}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'; }}
                              />
                              <span style={{ fontWeight: 600, color: '#1E293B', fontSize: '13px' }}>{log.user?.split(' ')[0] || 'Officer'}</span>
                            </div>
                          </td>
                          <td style={{ fontSize: '13px', color: '#475569' }}>{log.reason}</td>
                          <td style={{ fontSize: '12px', color: '#94A3B8' }}>{log.timestamp?.slice(5, 16)}</td>
                          <td>
                            <MoreHorizontal size={14} color="#94A3B8" style={{ cursor: 'pointer' }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

            {/* ── RIGHT SUB-COLUMN ────────────────────────────────── */}
            <div className="ds-sub-col">
              
              {/* Card 3: Recent Activities (Redesigned with Data Flow & Premium Styles) */}
              <div className="ds-card">
                <div className="ds-card-header">
                  <div>
                    <span className="ds-card-title">Recent Site Activities</span>
                    <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '3px' }}>
                      Real-time submissions, drafts, approvals & audit actions
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="ds-pill-btn"
                    onClick={() => onNavigateTab?.('submissions')}
                  >
                    All Activities
                  </button>
                </div>

                <div className="ds-activity-feed">
                  {[
                    {
                      id: 'act-1',
                      type: 'submission',
                      title: 'HSD Fuel Log Submitted',
                      desc: 'Batch #HMR-01 (18,650 L) logged for DG Heavy Fleet • Sent for L1 Review',
                      badge: 'Submitted',
                      badgeBg: 'rgba(37, 99, 235, 0.12)',
                      badgeColor: '#2563EB',
                      icon: Send,
                      iconBg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.25) 100%)',
                      iconBorder: 'rgba(37, 99, 235, 0.3)',
                      iconColor: '#2563EB',
                      time: '25m ago',
                      user: 'Rohit Kumar',
                      role: 'Site Lead',
                      avatar: '/avatar_rohit.jpg'
                    },
                    {
                      id: 'act-2',
                      type: 'approval',
                      title: 'Grid Power Log Approved',
                      desc: '33kV Substation Smart Meter (384 MWh) verified against CEA v19 factor',
                      badge: 'Approved',
                      badgeBg: 'rgba(22, 163, 74, 0.12)',
                      badgeColor: '#16A34A',
                      icon: ShieldCheck,
                      iconBg: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(34, 197, 94, 0.25) 100%)',
                      iconBorder: 'rgba(22, 163, 74, 0.3)',
                      iconColor: '#16A34A',
                      time: '2h ago',
                      user: 'K. Venkat',
                      role: 'Plant Mech',
                      avatar: '/avatar_reviewer.jpg'
                    },
                    {
                      id: 'act-3',
                      type: 'draft',
                      title: 'STP Water Log Draft Saved',
                      desc: 'Auto-saved 42.5 kL recycled water outflow • Lab BOD/COD report pending',
                      badge: 'Draft',
                      badgeBg: 'rgba(217, 119, 6, 0.12)',
                      badgeColor: '#D97706',
                      icon: FileEdit,
                      iconBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%)',
                      iconBorder: 'rgba(245, 158, 11, 0.3)',
                      iconColor: '#D97706',
                      time: '4h ago',
                      user: 'Priyanka S.',
                      role: 'EHS Water',
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80'
                    },
                    {
                      id: 'act-4',
                      type: 'action',
                      title: 'DG Set Slip Flagged for Correction',
                      desc: 'Fuel log variance > 5% detected by QA engine • Re-upload pump receipt',
                      badge: 'Action Req',
                      badgeBg: 'rgba(239, 68, 68, 0.12)',
                      badgeColor: '#DC2626',
                      icon: AlertCircle,
                      iconBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.25) 100%)',
                      iconBorder: 'rgba(239, 68, 68, 0.3)',
                      iconColor: '#DC2626',
                      time: 'Yesterday',
                      user: 'Jitendra Roy',
                      role: 'Safety Lead',
                      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80'
                    },
                    {
                      id: 'act-5',
                      type: 'evidence',
                      title: 'Tool-Box Signoff Sheet Attached',
                      desc: '86 personnel attendance & SHA-256 digital compliance hash recorded',
                      badge: 'Verified',
                      badgeBg: 'rgba(8, 145, 178, 0.12)',
                      badgeColor: '#0891B2',
                      icon: Paperclip,
                      iconBg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.25) 100%)',
                      iconBorder: 'rgba(6, 182, 212, 0.3)',
                      iconColor: '#0891B2',
                      time: 'Yesterday',
                      user: 'Rohit Kumar',
                      role: 'Site Lead',
                      avatar: '/avatar_rohit.jpg'
                    }
                  ].map((act) => {
                    const IconComp = act.icon;
                    return (
                      <div key={act.id} className="ds-activity-card">
                        <div 
                          className="ds-activity-icon-box"
                          style={{
                            background: act.iconBg,
                            border: `1px solid ${act.iconBorder}`,
                            color: act.iconColor
                          }}
                        >
                          <IconComp size={16} />
                        </div>
                        <div className="ds-activity-content">
                          <div className="ds-activity-header">
                            <span className="ds-activity-title">{act.title}</span>
                            <span 
                              className="ds-activity-badge"
                              style={{
                                background: act.badgeBg,
                                color: act.badgeColor
                              }}
                            >
                              {act.badge}
                            </span>
                          </div>
                          <div className="ds-activity-desc">{act.desc}</div>
                          <div className="ds-activity-footer">
                            <div className="ds-activity-meta">
                              <img 
                                src={act.avatar} 
                                alt={act.user} 
                                className="ds-user-avatar"
                                style={{ width: '18px', height: '18px' }}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'; }}
                              />
                              <span style={{ fontWeight: 600, color: '#334155' }}>{act.user}</span>
                              <span style={{ color: '#94A3B8' }}>•</span>
                              <span style={{ color: '#64748B' }}>{act.role}</span>
                            </div>
                            <span style={{ color: '#94A3B8', fontWeight: 500 }}>{act.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 4: Site Team & Supervisors (Expanded height to fill down to Financial Overview) */}
              <div className="ds-card ds-team-card">
                <div className="ds-card-header">
                  <div>
                    <span className="ds-card-title">Site Team & Supervisors</span>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      Select any member below to send a direct targeted message
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="ds-pill-btn"
                    onClick={() => onNavigateTab?.('my-project')}
                  >
                    View Team
                  </button>
                </div>

                <div className="ds-team-cards-row">
                  {SITE_TEAM_MEMBERS.map((member) => {
                    const isSelected = selectedRecipient === member.name;
                    return (
                      <div 
                        key={member.id} 
                        className={`ds-team-profile-card ${isSelected ? 'ds-card-selected' : ''}`}
                        onClick={() => setSelectedRecipient(isSelected ? 'All' : member.name)}
                        title={`Click to send direct message to ${member.name}`}
                      >
                        {isSelected && (
                          <div className="ds-profile-selected-badge">
                            <Check size={9} strokeWidth={3} />
                          </div>
                        )}
                        <div className="ds-avatar-wrap">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80'; }}
                          />
                          <span className="ds-status-dot" style={{ background: member.statusColor }} />
                        </div>
                        <div className="ds-profile-name">{member.name}</div>
                        <div className="ds-profile-role">{member.role}</div>
                        <button 
                          type="button" 
                          className="ds-activity-pill"
                          style={{ 
                            background: isSelected ? '#0284C7' : member.pillBg, 
                            color: isSelected ? '#FFFFFF' : member.pillColor,
                            fontWeight: isSelected ? 800 : 700 
                          }}
                        >
                          {isSelected ? 'Direct' : member.status}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Live Site Team Dispatch & Shift Handoff Thread (Fills vertical section perfectly) */}
                <div className="ds-team-dispatch-box">
                  <div className="ds-dispatch-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <Radio size={14} color="#0284C7" className="ds-pulse-icon" />
                      <span className="ds-dispatch-title">Site Radio & Team Chat</span>
                      <span className="ds-dispatch-live-tag">#Site-Ops</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#16A34A', fontWeight: 600 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
                      <span>4/4 On-Duty</span>
                    </div>
                  </div>

                  {/* Recipient Target Selector Bar */}
                  <div className="ds-dispatch-target-bar">
                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>To:</span>
                    <button
                      type="button"
                      className={`ds-target-chip ${selectedRecipient === 'All' ? 'active' : ''}`}
                      onClick={() => setSelectedRecipient('All')}
                    >
                      📢 All Team
                    </button>
                    {SITE_TEAM_MEMBERS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`ds-target-chip ${selectedRecipient === m.name ? 'active' : ''}`}
                        onClick={() => setSelectedRecipient(m.name)}
                      >
                        @{m.name.split(' ')[0]}
                      </button>
                    ))}
                    {selectedRecipient !== 'All' && (
                      <button
                        type="button"
                        className="ds-target-clear-btn"
                        onClick={() => setSelectedRecipient('All')}
                        title="Reset to All Team broadcast"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Messages Scroll Feed */}
                  <div className="ds-dispatch-feed">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`ds-dispatch-msg ${msg.recipient && msg.recipient !== 'All' ? 'is-direct' : ''}`}
                      >
                        <img 
                          src={msg.avatar} 
                          alt={msg.user} 
                          className="ds-user-avatar"
                          style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0 }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'; }}
                        />
                        <div className="ds-dispatch-msg-body">
                          <div className="ds-dispatch-msg-header">
                            <span style={{ fontWeight: 700, color: '#1E293B', fontSize: '12.5px' }}>{msg.user}</span>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>{msg.role}</span>
                            {msg.recipient && msg.recipient !== 'All' && (
                              <span className="ds-dispatch-recipient-tag">
                                Direct to @{msg.recipient}
                              </span>
                            )}
                            <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: 'auto' }}>{msg.time}</span>
                          </div>
                          <div className="ds-dispatch-msg-text">{msg.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Action Input Bar */}
                  <form onSubmit={handleSendChat} className="ds-dispatch-input-row">
                    <input
                      type="text"
                      placeholder={selectedRecipient === 'All' ? 'Broadcast note to site team...' : `Direct message to ${selectedRecipient}...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="ds-dispatch-input"
                    />
                    <button 
                      type="submit" 
                      className="ds-dispatch-send-btn" 
                      title={selectedRecipient === 'All' ? 'Send Broadcast' : `Send direct message to ${selectedRecipient}`}
                    >
                      <Send size={13} />
                    </button>
                  </form>

                  {/* Shift Status Footer */}
                  <div className="ds-dispatch-footer">
                    <span><strong>Current Shift:</strong> Morning (06:00 - 14:00)</span>
                    <span style={{ color: '#94A3B8' }}>•</span>
                    <span>Next Handoff: 14:00 (Evening Team)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Card 5: Site ESG Capex & Financial Investment Overview (Fills Master Island bottom gap with zero empty space) */}
          <div className="ds-card ds-finance-island-card">
            {/* Header */}
            <div className="ds-card-header" style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="ds-finance-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                  <IndianRupee size={15} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ds-card-title" style={{ fontSize: '15px' }}>Site ESG Capex & Financial Overview</span>
                    <span className="ds-finance-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>FY 2026-27</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Capex allocation, green technology spend, energy savings & carbon ROI
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  type="button" 
                  className="ds-pill-btn" 
                  style={{ fontSize: '11.5px', padding: '4px 12px' }}
                  onClick={() => onNavigateTab?.('reports')}
                >
                  <BarChart3 size={13} style={{ marginRight: '4px' }} />
                  Financials
                </button>
                <button 
                  type="button" 
                  className="ds-pill-btn" 
                  style={{ background: '#258BE6', borderColor: '#258BE6', color: '#FFFFFF', fontWeight: 600, fontSize: '11.5px', padding: '4px 12px' }}
                  onClick={() => exportToCsv('MEIL_Site_ESG_Capex_Statement_FY27.csv', [
                    { Metric: 'Total ESG Capex', BudgetINR_Cr: 24.50, SpentINR_Cr: 18.82, UtilizationPct: '76.8%', Period: 'FY 2026-27' },
                    { Metric: 'Clean Tech & Decarbonization', BudgetINR_Cr: 12.00, SpentINR_Cr: 9.80, UtilizationPct: '81.7%', Period: 'FY 2026-27' },
                    { Metric: 'Zero Liquid Discharge & Water Recycling', BudgetINR_Cr: 6.50, SpentINR_Cr: 4.90, UtilizationPct: '75.4%', Period: 'FY 2026-27' },
                    { Metric: 'Health, Safety & Ergonomics', BudgetINR_Cr: 4.00, SpentINR_Cr: 3.12, UtilizationPct: '78.0%', Period: 'FY 2026-27' },
                    { Metric: 'Waste Diversion & Circular Economy', BudgetINR_Cr: 2.00, SpentINR_Cr: 1.00, UtilizationPct: '50.0%', Period: 'FY 2026-27' }
                  ])}
                >
                  <Download size={13} style={{ marginRight: '4px' }} />
                  Statement
                </button>
              </div>
            </div>

            {/* 4 Financial KPIs Row (Compact) */}
            <div className="ds-finance-kpi-row" style={{ gap: '10px', marginBottom: '12px' }}>
              <div className="ds-finance-kpi-card" style={{ padding: '10px 12px' }}>
                <span className="ds-finance-kpi-lbl" style={{ fontSize: '11px' }}>Total ESG Capex</span>
                <div className="ds-finance-kpi-val" style={{ fontSize: '18px', margin: '3px 0 2px' }}>₹24.50 <span style={{ fontSize: '12px', color: '#64748B' }}>Cr</span></div>
                <div className="ds-finance-kpi-sub" style={{ fontSize: '11px' }}>
                  <span style={{ color: '#2563EB', fontWeight: 700 }}>₹18.82 Cr</span> Spent (76.8%)
                </div>
              </div>

              <div className="ds-finance-kpi-card" style={{ padding: '10px 12px' }}>
                <span className="ds-finance-kpi-lbl" style={{ fontSize: '11px' }}>Energy Cost Savings</span>
                <div className="ds-finance-kpi-val" style={{ color: '#16A34A', fontSize: '18px', margin: '3px 0 2px' }}>₹68.40 <span style={{ fontSize: '12px', color: '#64748B' }}>L</span></div>
                <div className="ds-finance-kpi-sub" style={{ fontSize: '11px' }}>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>+18.2%</span> vs Grid Baseline
                </div>
              </div>

              <div className="ds-finance-kpi-card" style={{ padding: '10px 12px' }}>
                <span className="ds-finance-kpi-lbl" style={{ fontSize: '11px' }}>Water Circularity Recovery</span>
                <div className="ds-finance-kpi-val" style={{ color: '#0284C7', fontSize: '18px', margin: '3px 0 2px' }}>₹22.50 <span style={{ fontSize: '12px', color: '#64748B' }}>L</span></div>
                <div className="ds-finance-kpi-sub" style={{ fontSize: '11px' }}>
                  <span style={{ color: '#0284C7', fontWeight: 700 }}>42.5 kL</span> Recycled STP
                </div>
              </div>

              <div className="ds-finance-kpi-card" style={{ padding: '10px 12px' }}>
                <span className="ds-finance-kpi-lbl" style={{ fontSize: '11px' }}>Carbon Value (ROI)</span>
                <div className="ds-finance-kpi-val" style={{ color: '#9333EA', fontSize: '18px', margin: '3px 0 2px' }}>₹41.80 <span style={{ fontSize: '12px', color: '#64748B' }}>L</span></div>
                <div className="ds-finance-kpi-sub" style={{ fontSize: '11px' }}>
                  <span style={{ color: '#9333EA', fontWeight: 700 }}>3,240 tCO₂e</span> Abated
                </div>
              </div>
            </div>

            {/* 2-Column Infographic Grid (Pie Chart + Trend Graph) */}
            <div className="ds-finance-grid" style={{ gap: '10px' }}>
              {/* Left Sub-Card: Infographic Multi-Segment Pie Chart */}
              <div className="ds-finance-subcard" style={{ padding: '10px 12px' }}>
                <div className="ds-finance-subcard-header" style={{ marginBottom: '8px', paddingBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>ESG Capex Allocation</span>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>Budget: ₹24.50 Cr</span>
                </div>

                <div className="ds-pie-container" style={{ gap: '14px' }}>
                  <div className="ds-pie-svg-wrap" style={{ width: '124px', height: '124px' }}>
                    <svg width="124" height="124" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="80" cy="80" r="56" fill="none" stroke="#2563EB" strokeWidth="22" strokeDasharray="123.15 351.86" strokeDashoffset="0" />
                      <circle cx="80" cy="80" r="56" fill="none" stroke="#10B981" strokeWidth="22" strokeDasharray="87.96 351.86" strokeDashoffset="-123.15" />
                      <circle cx="80" cy="80" r="56" fill="none" stroke="#F59E0B" strokeWidth="22" strokeDasharray="70.37 351.86" strokeDashoffset="-211.11" />
                      <circle cx="80" cy="80" r="56" fill="none" stroke="#8B5CF6" strokeWidth="22" strokeDasharray="52.78 351.86" strokeDashoffset="-281.48" />
                      <circle cx="80" cy="80" r="56" fill="none" stroke="#F43F5E" strokeWidth="22" strokeDasharray="17.59 351.86" strokeDashoffset="-334.26" />
                    </svg>
                    <div className="ds-pie-center-callout">
                      <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Spent</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>₹18.8 Cr</div>
                      <div style={{ fontSize: '9.5px', color: '#16A34A', fontWeight: 700 }}>76.8%</div>
                    </div>
                  </div>

                  <div className="ds-pie-legend-list" style={{ gap: '5px' }}>
                    {[
                      { label: 'Solar & Decarbonization', pct: '35%', amt: '₹8.58 Cr', color: '#2563EB' },
                      { label: 'Water & ZLD Recycling', pct: '25%', amt: '₹6.12 Cr', color: '#10B981' },
                      { label: 'Zero-Harm Safety HSE', pct: '20%', amt: '₹4.90 Cr', color: '#F59E0B' },
                      { label: 'Waste Circularity / Ash', pct: '15%', amt: '₹3.68 Cr', color: '#8B5CF6' },
                      { label: 'BRSR Audits & Verification', pct: '5%', amt: '₹1.22 Cr', color: '#F43F5E' }
                    ].map((item, idx) => (
                      <div key={idx} className="ds-pie-legend-item" style={{ padding: '2px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                          <span className="ds-pie-legend-title" style={{ fontSize: '12px' }}>{item.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <span className="ds-pie-pct-badge" style={{ color: item.color, background: `${item.color}18`, fontSize: '10.5px', padding: '1.5px 6px' }}>{item.pct}</span>
                          <span className="ds-pie-amt" style={{ fontSize: '11.5px' }}>{item.amt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sub-Card: Infographic Bar & Growth Chart */}
              <div className="ds-finance-subcard" style={{ padding: '10px 12px' }}>
                <div className="ds-finance-subcard-header" style={{ marginBottom: '8px', paddingBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Monthly Capex vs Savings</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', background: '#38BDF8', borderRadius: '2px' }} /> Capex
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} /> Savings
                    </span>
                  </div>
                </div>

                <div style={{ width: '100%', height: '80px', position: 'relative' }}>
                  <svg viewBox="0 0 340 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="finBarGradCompact" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#258BE6" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="finLineGradCompact" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="10" y1="15" x2="330" y2="15" stroke="rgba(226, 232, 240, 0.7)" strokeDasharray="3 3" />
                    <line x1="10" y1="45" x2="330" y2="45" stroke="rgba(226, 232, 240, 0.7)" strokeDasharray="3 3" />

                    {[
                      { x: 26, h: 32, val: '2.4' },
                      { x: 78, h: 44, val: '3.1' },
                      { x: 130, h: 38, val: '2.8' },
                      { x: 182, h: 52, val: '3.6' },
                      { x: 234, h: 46, val: '3.2' },
                      { x: 286, h: 54, val: '3.7' }
                    ].map((b, i) => (
                      <g key={i}>
                        <rect x={b.x} y={70 - b.h} width="16" height={b.h} rx="3" fill="url(#finBarGradCompact)" />
                        <text x={b.x + 8} y={66 - b.h} textAnchor="middle" fontSize="8" fontWeight="700" fill="#334155">
                          {b.val}
                        </text>
                      </g>
                    ))}

                    <path
                      d="M 34 58 L 86 48 L 138 38 L 190 28 L 242 20 L 294 14 L 294 70 L 34 70 Z"
                      fill="url(#finLineGradCompact)"
                    />

                    <path
                      d="M 34 58 L 86 48 L 138 38 L 190 28 L 242 20 L 294 14"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {[
                      { cx: 34, cy: 58 },
                      { cx: 86, cy: 48 },
                      { cx: 138, cy: 38 },
                      { cx: 190, cy: 28 },
                      { cx: 242, cy: 20 },
                      { cx: 294, cy: 14 }
                    ].map((dot, idx) => (
                      <circle key={idx} cx={dot.cx} cy={dot.cy} r="3" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.8" />
                    ))}
                  </svg>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                </div>

                <div className="ds-finance-roi-ribbon" style={{ marginTop: '8px', padding: '6px 10px', fontSize: '11.5px' }}>
                  <span><strong>Payback:</strong> 3.2 Yrs</span>
                  <span style={{ color: '#94A3B8' }}>•</span>
                  <span><strong>Carbon ROI:</strong> 24.8% p.a.</span>
                  <span style={{ color: '#94A3B8' }}>•</span>
                  <span><strong>Offset:</strong> ₹1,290/t</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==============================================================
            RIGHT STACKED COLUMN (~30% Width - 3 Distinct Cards)
            ============================================================== */}
        <div className="ds-right-column">
          
          {/* CARD 1: Analytics & Reports */}
          <div className="ds-card">
            <div className="ds-card-header">
              <span className="ds-card-title">Site ESG Analytics</span>
            </div>

            {/* Sub-Charts Duo (Dual-Wave Line + Column Bar Chart) */}
            <div className="ds-sub-chart-duo">
              {/* Left Sub-Chart: Scope 1 vs Scope 2 GHG */}
              <div className="ds-sub-chart-box">
                <div className="ds-sub-chart-title">
                  <span>Scope 1 vs 2 GHG (tCO₂e)</span>
                  <MoreHorizontal size={12} color="#94A3B8" style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ width: '100%', height: '62px' }}>
                  <svg viewBox="0 0 160 62" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="kpcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Shaded Area for line 1 */}
                    <path
                      d="M 0 45 C 30 48, 45 18, 70 30 C 95 42, 115 14, 160 24 L 160 62 L 0 62 Z"
                      fill="url(#kpcGrad)"
                    />
                    {/* Primary Line 1 */}
                    <path
                      d="M 0 45 C 30 48, 45 18, 70 30 C 95 42, 115 14, 160 24"
                      fill="none"
                      stroke="#258BE6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Secondary Wavy Line 2 */}
                    <path
                      d="M 0 35 C 25 30, 50 46, 80 22 C 110 38, 135 18, 160 30"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="2 0"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="ds-chart-axis-labels">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>Sep</span>
                  <span>Oct</span>
                </div>
              </div>

              {/* Right Sub-Chart: Monthly Energy Consumption (GJ) */}
              <div className="ds-sub-chart-box">
                <div className="ds-sub-chart-title">
                  <span>Monthly Energy (GJ)</span>
                  <MoreHorizontal size={12} color="#94A3B8" style={{ cursor: 'pointer' }} />
                </div>
                {/* Vertical Column Bar Chart with exact heights */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '62px', padding: '0 4px' }}>
                  {[
                    { h: 28, l: '10' },
                    { h: 48, l: '18' },
                    { h: 20, l: '36' },
                    { h: 58, l: '40' },
                    { h: 44, l: '50' },
                    { h: 52, l: '60' },
                    { h: 24, l: '30' },
                    { h: 60, l: '84' }
                  ].map((bar, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                      <div
                        style={{
                          width: '7.5px',
                          height: `${bar.h}px`,
                          background: i % 2 === 0 ? '#38BDF8' : '#258BE6',
                          borderRadius: '3px 3px 1px 1px',
                          transition: 'height 400ms ease'
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="ds-chart-axis-labels">
                  <span>10</span>
                  <span>18</span>
                  <span>36</span>
                  <span>40</span>
                  <span>50</span>
                  <span>60</span>
                  <span>30</span>
                  <span>84</span>
                </div>
              </div>
            </div>

            {/* Bottom 3 Mini Widgets */}
            <div className="ds-mini-widgets-row">
              {/* Widget 1: Water Balance Donut */}
              <div className="ds-mini-widget">
                <span className="ds-mini-widget-title">Water Balance</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                  <svg width="34" height="34" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#258BE6"
                      strokeWidth="4.5"
                      strokeDasharray="55 100"
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="4.5"
                      strokeDasharray="25 100"
                      strokeDashoffset="-58"
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#258BE6' }} />
                      <span>Recycled 72%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38BDF8' }} />
                      <span>Ground 18%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1' }} />
                      <span>Surface 10%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Widget 2: CEA v19 Baseline Sparkline */}
              <div className="ds-mini-widget">
                <span className="ds-mini-widget-title">CEA v19 Baseline</span>
                <div className="ds-mini-widget-val">0.716 <span style={{ fontSize: '10px', color: '#64748B' }}>kg/kWh</span></div>
                <div style={{ width: '100%', height: '22px' }}>
                  <svg viewBox="0 0 80 22" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <path
                      d="M 0 16 C 20 18, 30 5, 50 12 C 65 18, 75 4, 80 6"
                      fill="none"
                      stroke="#258BE6"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Widget 3: Waste Circularity Sparkline */}
              <div className="ds-mini-widget">
                <span className="ds-mini-widget-title">Waste Recycled</span>
                <div className="ds-mini-widget-val">94.2%</div>
                <div style={{ width: '100%', height: '22px' }}>
                  <svg viewBox="0 0 80 22" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <path
                      d="M 0 18 C 15 19, 25 10, 40 14 C 55 18, 65 2, 80 12"
                      fill="none"
                      stroke="#258BE6"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Custom Site Log Form (Clean, Non-overflowing Layout) */}
          <div className="ds-card">
            <div className="ds-card-header">
              <span className="ds-card-title">Custom Site Log Form</span>
              <button type="button" className="ds-pill-btn">
                Add Section
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
              Drag-and-drop elements & live site parameter collection
            </div>

            <div className="ds-form-builder-body">
              {/* Top Chips Row: Available & Active Parameters */}
              <div className="ds-fb-chips-section">
                <div className="ds-fb-chips-row">
                  <span className="ds-fb-chips-lbl">Available:</span>
                  <div className="ds-fb-chips-wrap">
                    <span className="ds-fb-chip">:: HSD Fuel</span>
                    <span className="ds-fb-chip">+ Grid kWh</span>
                    <span className="ds-fb-chip">= Water m³</span>
                    <span className="ds-fb-chip">x Safety Log</span>
                  </div>
                </div>
                <div className="ds-fb-chips-row" style={{ marginTop: '5px' }}>
                  <span className="ds-fb-chips-lbl">Active Form:</span>
                  <div className="ds-fb-chips-wrap">
                    <span className="ds-fb-chip ds-chip-active">+ DG Meter</span>
                    <span className="ds-fb-chip ds-chip-active">+ Effluent Flow</span>
                    <span className="ds-fb-chip ds-chip-active">+ Calibration</span>
                  </div>
                </div>
              </div>

              {/* Live Form Inputs */}
              <form onSubmit={handleSaveForm} className="ds-fb-entry-form">
                <div className="ds-fb-row-2col">
                  <div>
                    <label className="ds-fb-field-lbl">Site Location</label>
                    <input
                      type="text"
                      placeholder="Site Location"
                      value={formInputs.location}
                      onChange={(e) => setFormInputs({ ...formInputs, location: e.target.value })}
                      className="ds-fb-input"
                    />
                  </div>
                  <div>
                    <label className="ds-fb-field-lbl">Division / Fleet</label>
                    <select
                      value={formInputs.division}
                      onChange={(e) => setFormInputs({ ...formInputs, division: e.target.value })}
                      className="ds-fb-input"
                    >
                      <option value="DG Heavy Fleet">DG Heavy Fleet</option>
                      <option value="Substation 33kV">Substation 33kV</option>
                      <option value="RO / STP Plant">RO / STP Plant</option>
                      <option value="Excavation TBM">Excavation TBM</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '6px' }}>
                  <label className="ds-fb-field-lbl">Officer Email</label>
                  <input
                    type="email"
                    placeholder="Officer Email"
                    value={formInputs.email}
                    onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                    className="ds-fb-input"
                  />
                </div>

                <div style={{ marginTop: '6px' }}>
                  <label className="ds-fb-field-lbl">Site Calibration Note</label>
                  <textarea
                    placeholder="Calibration note & challan log"
                    rows={2}
                    value={formInputs.message}
                    onChange={(e) => setFormInputs({ ...formInputs, message: e.target.value })}
                    className="ds-fb-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Buttons Row with ample padding and zero overflow */}
                <div className="ds-fb-btn-row">
                  <button
                    type="button"
                    onClick={() => setFormInputs({ location: 'Zojila Tunnel PKG-2', division: 'DG Heavy Fleet', email: 'rohit.kumar@meilgroup.in', message: '' })}
                    className="ds-pill-btn"
                    style={{ padding: '7px 18px', fontSize: '12.5px' }}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="ds-pill-btn"
                    style={{
                      background: '#258BE6',
                      borderColor: '#258BE6',
                      color: '#FFFFFF',
                      padding: '7px 22px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(37, 139, 230, 0.35)'
                    }}
                  >
                    {formSaved ? 'Saved Successfully!' : 'Save Log'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* CARD 3: Active Site Batches (Height expanded to align flush with Left Master Island) */}
          <div className="ds-card ds-active-batches-card">
            <div>
              <div className="ds-card-header">
                <span className="ds-card-title">Active Site Batches</span>
                <button 
                  type="button" 
                  className="ds-pill-btn"
                  onClick={() => onNavigateTab?.('submissions')}
                >
                  View Batches
                </button>
              </div>

              <table className="ds-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Batch</th>
                    <th>Parameter / Unit</th>
                    <th>Status</th>
                    <th style={{ width: '85px' }}>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedBatch({
                      id: 'HMR-01',
                      title: 'Diesel & Fuel Log (DG Heavy Fleet)',
                      status: 'Verified',
                      statusColor: '#16A34A',
                      unit: '18,650 Litres HSD',
                      source: 'IOCL Tanker Challan #CH-4912',
                      officer: 'Rohit Kumar (Site Lead)',
                      hash: 'a7c9f8e4d2b1a3e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
                      scope1: '49.98 tCO2e',
                      notes: 'Fuel challan verified against underground tank dip measurement. All 4 DG sets calibrated.'
                    })}
                  >
                    <td style={{ fontWeight: 600, color: '#1E293B', fontSize: '12.5px' }}>HMR-01</td>
                    <td style={{ fontSize: '12.5px' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>Diesel & Fuel Log</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>DG Heavy Fleet</div>
                    </td>
                    <td><span style={{ color: '#16A34A', fontWeight: 600, fontSize: '11.5px' }}>Verified</span></td>
                    <td>
                      <div className="ds-progress-track">
                        <div className="ds-progress-fill" style={{ width: '100%' }} />
                      </div>
                    </td>
                  </tr>
                  <tr 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedBatch({
                      id: 'HMR-02',
                      title: 'Grid Power (CEA Baseline v19)',
                      status: 'Approved',
                      statusColor: '#2563EB',
                      unit: '384,000 kWh (384 MWh)',
                      source: '33kV Substation Smart Telemetry',
                      officer: 'K. Venkat (Plant Mech)',
                      hash: 'b8d0a9f5e3c2b4f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
                      scope2: '274.94 tCO2e',
                      notes: 'CEA India Grid Baseline Database v19 factor (0.716 kg CO2e/kWh) applied. Verified by BU Coordinator.'
                    })}
                  >
                    <td style={{ fontWeight: 600, color: '#1E293B', fontSize: '12.5px' }}>HMR-02</td>
                    <td style={{ fontSize: '12.5px' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>Grid Power (CEA v19)</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>33kV Substation</div>
                    </td>
                    <td><span style={{ color: '#2563EB', fontWeight: 600, fontSize: '11.5px' }}>Approved</span></td>
                    <td>
                      <div className="ds-progress-track">
                        <div className="ds-progress-fill" style={{ width: '85%' }} />
                      </div>
                    </td>
                  </tr>
                  <tr 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedBatch({
                      id: 'HMR-03',
                      title: 'Water Inflow & STP Outflow (ZLD Unit)',
                      status: 'In Review',
                      statusColor: '#D97706',
                      unit: '42.5 kL Recycled (70% Share)',
                      source: 'Ultrasonic STP Flowmeter',
                      officer: 'Priyanka S. (EHS Water)',
                      hash: 'c9e1b0a6f4d3c5g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
                      notes: 'Zero Liquid Discharge certified. Awaiting final third-party NABL water quality report.'
                    })}
                  >
                    <td style={{ fontWeight: 600, color: '#1E293B', fontSize: '12.5px' }}>HMR-03</td>
                    <td style={{ fontSize: '12.5px' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>Water Inflow & STP</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Recycling Unit</div>
                    </td>
                    <td><span style={{ color: '#D97706', fontWeight: 600, fontSize: '11.5px' }}>In Review</span></td>
                    <td>
                      <div className="ds-progress-track">
                        <div className="ds-progress-fill" style={{ width: '65%' }} />
                      </div>
                    </td>
                  </tr>
                  <tr 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedBatch({
                      id: 'HMR-04',
                      title: 'Monthly Safety & Zero Harm Log',
                      status: 'Verified',
                      statusColor: '#16A34A',
                      unit: '45,000 Safe Man-Hours',
                      source: 'Daily Site Toolbox Attendance',
                      officer: 'Jitendra Roy (Safety Lead)',
                      hash: 'd0f2c1b7g5e4d6h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4',
                      notes: 'Zero Fatalities, Zero LTIs, 86 personnel attendance signed off with biometric verification.'
                    })}
                  >
                    <td style={{ fontWeight: 600, color: '#1E293B', fontSize: '12.5px' }}>HMR-04</td>
                    <td style={{ fontSize: '12.5px' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>Monthly Safety Log</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Zero Harm Units</div>
                    </td>
                    <td><span style={{ color: '#16A34A', fontWeight: 600, fontSize: '11.5px' }}>Verified</span></td>
                    <td>
                      <div className="ds-progress-track">
                        <div className="ds-progress-fill" style={{ width: '100%' }} />
                      </div>
                    </td>
                  </tr>
                  <tr 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedBatch({
                      id: 'HMR-05',
                      title: 'Hazardous Waste Slip & Manifest',
                      status: 'Submitted',
                      statusColor: '#64748B',
                      unit: '2.4 MT Used Lube Oil',
                      source: 'SPCB Form 10 Manifest',
                      officer: 'Priyanka S. (EHS Water)',
                      hash: 'e1g3d2c8h6f5e7i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5',
                      notes: 'Manifest #SPCB-JK-2026-891 signed by registered authorized re-refiner.'
                    })}
                  >
                    <td style={{ fontWeight: 600, color: '#1E293B', fontSize: '12.5px' }}>HMR-05</td>
                    <td style={{ fontSize: '12.5px' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>Hazardous Waste Slip</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Lubricants / Oil</div>
                    </td>
                    <td><span style={{ color: '#64748B', fontWeight: 600, fontSize: '11.5px' }}>Submitted</span></td>
                    <td>
                      <div className="ds-progress-track">
                        <div className="ds-progress-fill" style={{ width: '50%' }} />
                      </div>
                    </td>
                  </tr>
                  <tr 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedBatch({
                      id: 'HMR-06',
                      title: 'Solar Inverter 120kW Renewable Microgrid',
                      status: 'Verified',
                      statusColor: '#16A34A',
                      unit: '18,400 kWh Clean Solar Generation',
                      source: 'Fronius Inverter Telemetry',
                      officer: 'K. Venkat (Plant Mech)',
                      hash: 'f2h4e3d9i7g6f8j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
                      notes: 'Captive solar rooftop generation abated 13.17 tCO2e of grid electricity.'
                    })}
                  >
                    <td style={{ fontWeight: 600, color: '#1E293B', fontSize: '12.5px' }}>HMR-06</td>
                    <td style={{ fontSize: '12.5px' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>Solar Inverter 120kW</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Renewable Microgrid</div>
                    </td>
                    <td><span style={{ color: '#16A34A', fontWeight: 600, fontSize: '11.5px' }}>Verified</span></td>
                    <td>
                      <div className="ds-progress-track">
                        <div className="ds-progress-fill" style={{ width: '100%' }} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Batch Telemetry Synchronization Footer Strip */}
            <div className="ds-batch-footer-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#16A34A" />
                <span style={{ fontSize: '12px', color: '#1E293B', fontWeight: 600 }}>6 of 6 Active Batches Synchronized</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#0284C7', fontWeight: 600 }}>
                <span className="ds-live-dot" style={{ width: '6px', height: '6px' }} />
                <span>Live Telemetry</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Batch Details Modal (Liquid Glass) */}
      {selectedBatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '560px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(240,249,255,0.92) 100%)',
            backdropFilter: 'blur(24px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 20px 50px rgba(15,23,42,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(148,163,184,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#0284C7" />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Batch Specification: {selectedBatch.id}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Site Zojila Tunnel (PKG-2)</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBatch(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Parameter & Disclosure Title:</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>{selectedBatch.title}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.15)' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Quantity / Units</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0284C7' }}>{selectedBatch.unit}</div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.15)' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Verification Status</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: selectedBatch.statusColor }}>{selectedBatch.status}</div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.15)' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Telemetry Source</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>{selectedBatch.source}</div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.15)' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Responsible Officer</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>{selectedBatch.officer}</div>
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.15)' }}>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Site Verification Notes:</div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>{selectedBatch.notes}</div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '8px', background: '#0F172A', color: '#38BDF8', fontSize: '10px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                <div style={{ color: '#94A3B8', marginBottom: '2px', fontFamily: 'sans-serif', fontWeight: 600 }}>SHA-256 Ledger Proof:</div>
                {selectedBatch.hash}
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="ds-pill-btn"
                onClick={() => setSelectedBatch(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="ds-pill-btn"
                style={{ background: '#258BE6', borderColor: '#258BE6', color: '#FFFFFF', fontWeight: 700 }}
                onClick={() => {
                  setSelectedBatch(null);
                  onNavigateTab?.('evidence');
                }}
              >
                Inspect Attached Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operational Module Detail Modal (Liquid Glass) for Secondary Nav Pills */}
      {activeOperationalTab && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '640px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(240,249,255,0.92) 100%)',
            backdropFilter: 'blur(24px)',
            borderRadius: '18px',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 20px 50px rgba(15,23,42,0.2)',
            overflow: 'hidden',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(148,163,184,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="#0284C7" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Operational Section: {activeOperationalTab}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Site Zojila Tunnel (PKG-2) • Reporting: {reportingPeriod}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveOperationalTab(null);
                  setActiveNavTab('Overview');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div style={{ padding: '22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {activeOperationalTab === 'Fuel & DG' && (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(254,243,199,0.7)', border: '1px solid rgba(245,158,11,0.3)', fontSize: '12px', color: '#92400E' }}>
                    <strong>Stock Balance Formula:</strong> Opening Stock (12,400 L) + Received (18,650 L) - Consumed (12,400 L) = Closing Stock (18,650 L). Zero inventory leakage detected.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>HSD Consumed</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>18,650 Litres</div>
                      <div style={{ fontSize: '10px', color: '#D97706' }}>DG Heavy Fleet</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Calculated Scope 1</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#DC2626' }}>49.98 tCO2e</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Factor: 2.68 kg/L</div>
                    </div>
                  </div>
                </>
              )}

              {activeOperationalTab === 'Grid Power' && (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(240,249,255,0.7)', border: '1px solid rgba(2,132,199,0.3)', fontSize: '12px', color: '#0369A1' }}>
                    <strong>CEA Baseline v19 Compliance:</strong> 33kV Dedicated Feeder smart meter readings: Closing (1,804,000) - Opening (1,420,000) = 384,000 kWh net consumption.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Net Electricity</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>384 MWh</div>
                      <div style={{ fontSize: '10px', color: '#0284C7' }}>Power Factor: 0.98</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Calculated Scope 2</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284C7' }}>274.94 tCO2e</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Factor: 0.716 kg/kWh</div>
                    </div>
                  </div>
                </>
              )}

              {activeOperationalTab === 'Water & ZLD' && (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(240,253,244,0.7)', border: '1px solid rgba(22,163,74,0.3)', fontSize: '12px', color: '#166534' }}>
                    <strong>Zero Liquid Discharge Certified:</strong> Inflow (60.7 kL) with 42.5 kL recycled through on-site STP (70% circularity). 0 kL untreated discharge.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Recycled Water Outflow</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A' }}>42.5 kL (70%)</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>SPCB Compliance</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A' }}>100% ZLD Compliant</div>
                    </div>
                  </div>
                </>
              )}

              {activeOperationalTab === 'Safety & HSE' && (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(240,253,244,0.7)', border: '1px solid rgba(22,163,74,0.3)', fontSize: '12px', color: '#166534' }}>
                    <strong>Zero-Harm Target Achieved:</strong> 45,000 Safe Man-Hours logged with 0 Lost Time Injuries, 0 Fatalities, and 100% toolbox compliance.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Safe Man-Hours</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A' }}>45,000 hrs</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Incident Workflow</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Closed (Zero Open)</div>
                    </div>
                  </div>
                </>
              )}

              {activeOperationalTab === 'Waste & Scrap' && (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.2)', fontSize: '12px', color: '#334155' }}>
                    <strong>Circularity Rate: 94.2%:</strong> C&D rock muck repurposed into tunnel approach berms. Hazardous oils disposed via SPCB authorized re-refiners.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>C&D Muck Reused</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>420 MT</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Hazardous SPCB Form 10</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A' }}>Verified (2.4 MT)</div>
                    </div>
                  </div>
                </>
              )}

              {activeOperationalTab === 'Sync & IoT' && (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(240,249,255,0.7)', border: '1px solid rgba(2,132,199,0.3)', fontSize: '12px', color: '#0369A1' }}>
                    <strong>Automated Ingestion Feed:</strong> DG meters (1s poll), 33kV Smart meters (5m poll), STP Flowmeter (10m poll), SAP S/4HANA ERP (daily sync).
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Connection Status</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#16A34A' }}>All Sensors Online</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Packets Received Today</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284C7' }}>86,400 Records</div>
                    </div>
                  </div>
                </>
              )}

              {activeOperationalTab === 'Workforce' && (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.2)', fontSize: '12px', color: '#334155' }}>
                    <strong>Site Human Capital:</strong> 86 deployed on Zojila Tunnel PKG-2 (12 permanent engineers, 74 contracted technical specialists).
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Training Completion</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#16A34A' }}>100% Certified</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>ESI / EPF Coverage</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>100% Statutorily Enrolled</div>
                    </div>
                  </div>
                </>
              )}

              {activeOperationalTab === 'Travel' && (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.2)', fontSize: '12px', color: '#334155' }}>
                    <strong>Scope 3 Seed Logistics:</strong> Site-to-camp transit diesel fleet: 14,200 km. Rail cargo haulage: 18,400 pass-km. Air travel: 0 km.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Logistics Distance</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>32,600 km</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>Estimated Scope 3 Seed</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#D97706' }}>3.42 tCO2e</div>
                    </div>
                  </div>
                </>
              )}

              {activeOperationalTab === 'Site Team' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SITE_TEAM_MEMBERS.map((m) => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={m.avatar} alt={m.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{m.name}</div>
                          <div style={{ fontSize: '10px', color: '#64748B' }}>{m.role} • ESG Data Owner</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: m.statusColor, fontWeight: 700 }}>{m.status}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(148,163,184,0.2)', background: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="ds-pill-btn"
                onClick={() => {
                  setActiveOperationalTab(null);
                  setActiveNavTab('Overview');
                }}
              >
                Close View
              </button>
              <button 
                type="button" 
                className="ds-pill-btn"
                style={{ background: '#258BE6', borderColor: '#258BE6', color: '#FFFFFF', fontWeight: 700 }}
                onClick={() => {
                  const targetTab = (activeOperationalTab === 'Safety & HSE' || activeOperationalTab === 'Site Team') ? 'my-project'
                    : activeOperationalTab === 'Sync & IoT' ? 'analytics'
                    : 'data-entry';
                  setActiveOperationalTab(null);
                  onNavigateTab?.(targetTab);
                }}
              >
                Open Full Module
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
