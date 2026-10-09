import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Leaf,
  Users,
  ShieldCheck,
  Check,
  Award,
  Activity,
  FileText
} from 'lucide-react';
import ESGCanvas from './ESGCanvas';
import { MeilLogo } from './MeilLogo';
import { MEIL_MEDIA } from '../../config/projectMedia';
import './WelcomeScreen.css';

// Authentic MEIL Infrastructure Background Projects Array
const BACKGROUND_PROJECTS = Object.values(MEIL_MEDIA);

// Organization data — architected for dynamic API loading
const ORGANIZATIONS = [
  { id: 'meil-group', name: 'MEIL Group (Holding)', type: 'Holding Entity · Full Scope', status: 'active' },
  { id: 'meil-power', name: 'MEIL Power Division', type: 'Subsidiary · Thermal & Solar', status: 'active' },
  { id: 'meil-infra', name: 'MEIL Core Infrastructure', type: 'EPC Division · 250+ Sites', status: 'active' },
  { id: 'meil-water', name: 'MEIL Water Resources', type: 'Subsidiary · Lift Irrigation', status: 'active' },
  { id: 'meil-solar', name: 'MEIL Clean Energy & Solar', type: 'Subsidiary · Renewables', status: 'active' },
  { id: 'meil-defence', name: 'ICOMM Tele Limited', type: 'Subsidiary · Defense Electronics', status: 'active' },
  { id: 'olectra', name: 'Olectra Greentech Limited', type: 'Listed Subsidiary · EV Mobility', status: 'active' },
];

export function WelcomeScreen({ onContinue }) {
  // State
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buttonState, setButtonState] = useState('idle'); // idle | loading | success
  const [isExiting, setIsExiting] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Automatic Background Popping / Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BACKGROUND_PROJECTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Refs
  const pageRef = useRef(null);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Cursor-following ambient light
  const handlePageMouseMove = useCallback((e) => {
    if (pageRef.current) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      pageRef.current.style.setProperty('--mouse-x', `${x}%`);
      pageRef.current.style.setProperty('--mouse-y', `${y}%`);
    }
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Keyboard navigation for dropdown
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setDropdownOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setDropdownOpen(!dropdownOpen);
    }
  };

  // Organization selection
  const handleOrgSelect = (org) => {
    setSelectedOrg(org);
    setDropdownOpen(false);
  };

  // Continue flow
  const handleContinue = async () => {
    if (buttonState !== 'idle') return;
    setButtonState('loading');

    await new Promise((resolve) => setTimeout(resolve, 600));
    setButtonState('success');

    await new Promise((resolve) => setTimeout(resolve, 350));
    setIsExiting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    if (onContinue) {
      onContinue({ organization: selectedOrg });
    }
  };

  // Canvas dimensions (calibrated for standard laptop viewports)
  const [canvasSize, setCanvasSize] = useState({ w: 420, h: 280 });
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < 768) {
        setCanvasSize({ w: Math.min(vw - 60, 340), h: 240 });
      } else if (vw < 1024) {
        setCanvasSize({ w: 380, h: 260 });
      } else if (vh < 780) {
        setCanvasSize({ w: 410, h: 270 });
      } else {
        setCanvasSize({ w: 430, h: 290 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div
      ref={pageRef}
      className="welcome-page"
      onMouseMove={handlePageMouseMove}
    >
      {/* ═══ Layer 1: Atmospheric Background with Popping Slideshow ═══ */}
      <div className="atmospheric-layer">
        <div className="welcome-bg-slideshow" aria-hidden="true">
          {BACKGROUND_PROJECTS.map((project, idx) => (
            <div
              key={project.id}
              className={`welcome-bg-slide ${idx === currentSlideIndex ? 'is-active' : ''}`}
              style={{ backgroundImage: `url(${project.src})` }}
            />
          ))}
          <div className="welcome-bg-scrim" />
        </div>
        <div className="ambient-light ambient-light-1" />
        <div className="ambient-light ambient-light-2" />
        <div className="ambient-light ambient-light-3" />
        <div className="subtle-arc arc-1" />
        <div className="subtle-arc arc-2" />
        <div className="subtle-arc arc-3" />
      </div>

      {/* ═══ Layer 2: Subtle Cursor Following Glow ═══ */}
      <div className="cursor-glow" />

      {/* ═══ Official MEIL Header ═══ */}
      <header className="meil-header">
        <div className="meil-brand-group">
          <MeilLogo height={42} />
        </div>
        <div className="meil-tagline-group">
          <span className="meil-tagline-badge">SEBI BRSR AUDIT READY</span>
          <span className="meil-tagline-title">Megha Engineering &amp; Infrastructures Ltd.</span>
          <span className="meil-tagline-sub">Engineering A Sustainable Tomorrow · CIN: U45202TG2006PLC050271</span>
        </div>
      </header>

      {/* ═══ Transition Overlay ═══ */}
      {isExiting && (
        <div className="transition-overlay">
          <div className="transition-light" />
        </div>
      )}

      {/* ═══ Main Glass Container ═══ */}
      <div className={`welcome-glass-panel ${isExiting ? 'panel-exit' : ''}`}>

        {/* ──── Left: Interactive ESG Canvas Ecosystem ──── */}
        <div className="welcome-left">
          {/* Top Live Badge */}
          <div className="left-live-badge">
            <span className="live-pulse-dot" />
            <span>INTERACTIVE ESG ECOSYSTEM · 250+ SITES</span>
          </div>

          <div className="canvas-container">
            <ESGCanvas
              width={canvasSize.w}
              height={canvasSize.h}
            />
          </div>

          {/* Clean Executive KPI Grid (No Clipping, Perfect Symmetry) */}
          <div className="left-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-num">250+</span>
              <span className="kpi-title">Project Sites</span>
              <span className="kpi-desc">IoT ESG Audits</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-num">42,800+</span>
              <span className="kpi-title">Workforce</span>
              <span className="kpi-desc">Zero Harm Safety</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-num">₹32,450 Cr</span>
              <span className="kpi-title">Turnover</span>
              <span className="kpi-desc">SEBI Top 1000</span>
            </div>
          </div>
        </div>

        {/* ──── Right: Welcome Content ──── */}
        <div className="welcome-right">

          {/* Eyebrow Badge */}
          <div className="welcome-badge-wrap">
            <span className="welcome-eyebrow-badge">
              <Award size={13} className="badge-gold-icon" />
              SEBI BRSR STATUTORY REPORTING SYSTEM
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="welcome-heading">
            <span className="text-navy">MEIL </span>
            <span className="text-blue">ESG</span>
          </h1>

          {/* Subtitle */}
          <h2 className="welcome-subtitle">Corporate ESG &amp; BRSR Reporting Platform</h2>

          {/* Description */}
          <p className="welcome-description">
            Unified statutory reporting system for Megha Engineering &amp; Infrastructures Limited,
            aggregating verifiable ESG disclosures across Holding, 6 Subsidiaries and 250+ project sites.
          </p>

          {/* ── Organization Selector ── */}
          <div className="org-selector-wrapper">
            <label className="org-selector-label" id="org-label">
              <Building2 size={16} className="text-blue" />
              <span>Select Reporting Entity / Scope:</span>
            </label>
            <div className="org-selector">
              <button
                ref={triggerRef}
                className="org-selector-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onKeyDown={handleKeyDown}
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
                aria-labelledby="org-label"
                type="button"
              >
                <div className="org-selector-icon">
                  <Building2 size={20} />
                </div>
                <div className="org-selector-text">
                  <div className="org-selector-name">{selectedOrg.name}</div>
                  <div className="org-selector-type">{selectedOrg.type}</div>
                </div>
                <span className="org-status-pill">Active Scope</span>
                <ChevronDown size={18} className="org-selector-chevron" />
              </button>

              {/* Dropdown List */}
              <div
                ref={dropdownRef}
                className={`org-dropdown ${dropdownOpen ? 'open' : ''}`}
                role="listbox"
                aria-labelledby="org-label"
              >
                {ORGANIZATIONS.map((org) => (
                  <button
                    key={org.id}
                    className={`org-dropdown-item ${selectedOrg.id === org.id ? 'active' : ''}`}
                    onClick={() => handleOrgSelect(org)}
                    role="option"
                    aria-selected={selectedOrg.id === org.id}
                    type="button"
                  >
                    <div className="org-selector-icon" style={{ width: 34, height: 34, borderRadius: 8 }}>
                      <Building2 size={16} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div className="org-item-name">{org.name}</div>
                      <div className="org-item-type">{org.type}</div>
                    </div>
                    {selectedOrg.id === org.id && (
                      <Check size={18} style={{ color: '#2563EB', marginLeft: 'auto' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Continue Button ── */}
          <div className="continue-btn-wrapper">
            <button
              className="continue-btn"
              onClick={handleContinue}
              disabled={buttonState !== 'idle'}
              aria-label="Continue to platform entry"
              type="button"
            >
              {buttonState === 'idle' && (
                <>
                  <span>Continue to Role Selection &amp; Sign In</span>
                  <ArrowRight size={20} className="btn-arrow" />
                </>
              )}
              {buttonState === 'loading' && (
                <div className="btn-spinner" />
              )}
              {buttonState === 'success' && (
                <div className="btn-success-check">
                  <Check size={26} />
                </div>
              )}
            </button>
          </div>

          {/* ── ESG Pillars Section ── */}
          <div className="esg-pillars">
            <div className="pillars-divider-wrapper">
              <div className="pillars-line" />
              <span className="pillars-label">STATUTORY BRSR CORE PILLARS</span>
              <div className="pillars-line" />
            </div>
            <div className="pillars-grid">
              <div className="pillar-item pillar-env">
                <div className="pillar-icon env"><Leaf size={16} /></div>
                <div className="pillar-info">
                  <div className="pillar-name">Environment</div>
                  <div className="pillar-sub">Scope 1, 2, 3 GHG · ZLD Water</div>
                </div>
              </div>
              <div className="pillar-item pillar-social">
                <div className="pillar-icon social"><Users size={16} /></div>
                <div className="pillar-info">
                  <div className="pillar-name">Social &amp; Safety</div>
                  <div className="pillar-sub">Zero Harm · SA8000 · POSH</div>
                </div>
              </div>
              <div className="pillar-item pillar-gov">
                <div className="pillar-icon gov"><ShieldCheck size={16} /></div>
                <div className="pillar-info">
                  <div className="pillar-name">Governance</div>
                  <div className="pillar-sub">Board Oversight · Audits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Floating Live Operational Facility Spotlight Pill ═══ */}
      <div className="welcome-live-spotlight-pill">
        <div className="spotlight-indicator">
          <span className="spotlight-pulse" />
          <span className="spotlight-live-tag">
            OPERATIONS SPOTLIGHT {currentSlideIndex + 1}/{BACKGROUND_PROJECTS.length}
          </span>
        </div>
        <div className="spotlight-meta">
          <span className="spotlight-title">{BACKGROUND_PROJECTS[currentSlideIndex]?.title}</span>
          <span className="spotlight-sep">·</span>
          <span className="spotlight-sub">{BACKGROUND_PROJECTS[currentSlideIndex]?.subtitle}</span>
        </div>
        <div className="spotlight-dots">
          {BACKGROUND_PROJECTS.map((p, i) => (
            <button
              key={p.id}
              className={`spotlight-dot ${i === currentSlideIndex ? 'active' : ''}`}
              onClick={() => setCurrentSlideIndex(i)}
              title={`${p.title} (${p.bu})`}
              type="button"
              aria-label={`View ${p.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
