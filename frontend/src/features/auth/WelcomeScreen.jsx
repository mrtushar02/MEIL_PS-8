import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Leaf,
  Users,
  ShieldCheck,
  Check
} from 'lucide-react';
import ESGCanvas from './ESGCanvas';
import MeilLogo from './MeilLogo';
import './WelcomeScreen.css';

/*
  WelcomeScreen — MEIL ESG & BRSR Reporting Platform Entry
  ─────────────────────────────────────────────────────────
  Precision implementation of the master design prompt:
  • Apple-level polish + iOS Liquid Glass visual language
  • Subtle blue atmospheric illumination & floating glass orbs
  • Official MEIL branding with red symbol badge
  • Centerpiece 2D Canvas + Liquid Glass ESG ecosystem
  • Dynamic organization selector & interactive continue flow
  • Clean 3-pillar footer with responsive layout
*/

// Organization data — architected for dynamic API loading
const ORGANIZATIONS = [
  { id: 'meil-group', name: 'MEIL Group', type: 'Group Holding', status: 'active' },
  { id: 'meil-power', name: 'MEIL Power', type: 'Subsidiary', status: 'active' },
  { id: 'meil-infra', name: 'MEIL Infrastructure', type: 'Subsidiary', status: 'active' },
  { id: 'meil-water', name: 'MEIL Water', type: 'Subsidiary', status: 'active' },
  { id: 'meil-solar', name: 'MEIL Solar', type: 'Subsidiary', status: 'active' },
  { id: 'meil-defence', name: 'MEIL Defence', type: 'Subsidiary', status: 'active' },
  { id: 'meil-aerospace', name: 'MEIL Aerospace', type: 'Subsidiary', status: 'active' },
];

// ESG Pillars data
const ESG_PILLARS = [
  { icon: Leaf, label: 'Environment Protection', variant: 'env' },
  { icon: Users, label: 'Social Responsibility', variant: 'social' },
  { icon: ShieldCheck, label: 'Good Governance', variant: 'gov' },
];

export function WelcomeScreen({ onContinue }) {
  // State
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buttonState, setButtonState] = useState('idle'); // idle | loading | success
  const [isExiting, setIsExiting] = useState(false);

  // Refs
  const pageRef = useRef(null);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // ── Cursor-following ambient light ──
  const handlePageMouseMove = useCallback((e) => {
    if (pageRef.current) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      pageRef.current.style.setProperty('--mouse-x', `${x}%`);
      pageRef.current.style.setProperty('--mouse-y', `${y}%`);
    }
  }, []);

  // ── Click outside to close dropdown ──
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

  // ── Keyboard navigation for dropdown ──
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setDropdownOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setDropdownOpen(!dropdownOpen);
    }
  };

  // ── Organization selection ──
  const handleOrgSelect = (org) => {
    setSelectedOrg(org);
    setDropdownOpen(false);
  };

  // ── Continue flow ──
  const handleContinue = async () => {
    if (buttonState !== 'idle') return;
    setButtonState('loading');

    // Simulate brief loading
    await new Promise((resolve) => setTimeout(resolve, 800));
    setButtonState('success');

    // Trigger exit transition
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsExiting(true);

    // Call parent after transition completes
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (onContinue) {
      onContinue({ organization: selectedOrg });
    }
  };

  // ── Canvas dimensions (responsive) ──
  const [canvasSize, setCanvasSize] = useState({ w: 440, h: 350 });
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      if (vw < 768) {
        setCanvasSize({ w: Math.min(vw - 60, 360), h: 300 });
      } else if (vw < 1024) {
        setCanvasSize({ w: 380, h: 330 });
      } else {
        setCanvasSize({ w: 440, h: 350 });
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
      {/* ═══ Layer 1: Atmospheric Background ═══ */}
      <div className="atmospheric-layer">
        <div className="ambient-light ambient-light-1" />
        <div className="ambient-light ambient-light-2" />
        <div className="ambient-light ambient-light-3" />
        <div className="subtle-arc arc-1" />
        <div className="subtle-arc arc-2" />
        <div className="subtle-arc arc-3" />

        {/* Ambient Floating Frosted Glass Orbs / Droplets */}
        <div className="ambient-glass-orb orb-1" />
        <div className="ambient-glass-orb orb-2" />
        <div className="ambient-glass-orb orb-3" />
        <div className="ambient-glass-orb orb-4" />
        <div className="ambient-glass-orb orb-5" />
      </div>

      {/* ═══ Layer 2: Subtle Cursor Following Glow ═══ */}
      <div className="cursor-glow" />

      {/* ═══ MEIL Header ═══ */}
      <header className="meil-header">
        <MeilLogo height={44} />
        <div className="meil-tagline-group">
          <span className="meil-tagline-title">Engineering</span>
          <span className="meil-tagline-sub">A Sustainable Tomorrow</span>
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
          <div className="canvas-container">
            <ESGCanvas
              width={canvasSize.w}
              height={canvasSize.h}
            />
          </div>

          {/* Measure / Manage / Report concepts */}
          <div className="canvas-concepts">
            <div className="concept-item">
              <div className="concept-label">Measure</div>
              <div className="concept-desc">REAL IMPACT</div>
            </div>
            <div className="concept-divider" />
            <div className="concept-item">
              <div className="concept-label">Manage</div>
              <div className="concept-desc">RESPONSIBLY</div>
            </div>
            <div className="concept-divider" />
            <div className="concept-item">
              <div className="concept-label">Report</div>
              <div className="concept-desc">TRANSPARENTLY</div>
            </div>
          </div>
        </div>

        {/* ──── Right: Welcome Content ──── */}
        <div className="welcome-right">

          {/* Eyebrow */}
          <span className="welcome-eyebrow">WELCOME TO</span>

          {/* Main Heading */}
          <h1 className="welcome-heading">
            <span className="text-navy">MEIL </span>
            <span className="text-blue">ESG</span>
          </h1>

          {/* Subtitle */}
          <p className="welcome-subtitle">ESG &amp; BRSR Reporting Platform</p>

          {/* Description */}
          <p className="welcome-description">
            A unified platform for responsible data collection,
            transparent reporting and a sustainable future.
          </p>

          {/* ── Organization Selector ── */}
          <div className="org-selector-wrapper">
            <label className="org-selector-label" id="org-label">
              Select Organization
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
                  <Building2 size={18} />
                </div>
                <div className="org-selector-text">
                  <div className="org-selector-name">{selectedOrg.name}</div>
                  <div className="org-selector-type">{selectedOrg.type}</div>
                </div>
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
                    <div className="org-selector-icon" style={{ width: 32, height: 32, borderRadius: 8 }}>
                      <Building2 size={15} />
                    </div>
                    <div>
                      <div className="org-item-name">{org.name}</div>
                      <div className="org-item-type">{org.type}</div>
                    </div>
                    {selectedOrg.id === org.id && (
                      <Check size={16} style={{ color: '#2563EB', marginLeft: 'auto' }} />
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
                  <span>Continue</span>
                  <ArrowRight size={18} className="btn-arrow" />
                </>
              )}
              {buttonState === 'loading' && (
                <div className="btn-spinner" />
              )}
              {buttonState === 'success' && (
                <Check size={22} className="btn-success-check" />
              )}
            </button>
          </div>

          {/* ── ESG Pillars Section ── */}
          <div className="esg-pillars">
            <div className="pillars-divider-wrapper">
              <span className="pillars-line" />
              <span className="pillars-label">OUR ESG PILLARS</span>
              <span className="pillars-line" />
            </div>
            <div className="pillars-grid">
              {ESG_PILLARS.map((pillar) => {
                const IconComp = pillar.icon;
                return (
                  <div key={pillar.variant} className="pillar-item">
                    <div className={`pillar-icon ${pillar.variant}`}>
                      <IconComp size={16} />
                    </div>
                    <span className="pillar-text">{pillar.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
