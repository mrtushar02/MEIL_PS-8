import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  ShieldCheck,
  Package,
  HeartHandshake,
  ClipboardCheck,
  Leaf,
  HardHat,
  FileText,
  Activity,
  Award,
  Target,
  Truck,
  Heart,
  Scale
} from 'lucide-react';

import ProjectIllustration from './illustrations/ProjectIllustration';
import HRIllustration from './illustrations/HRIllustration';
import EHSIllustration from './illustrations/EHSIllustration';
import ProcurementIllustration from './illustrations/ProcurementIllustration';
import CSRIllustration from './illustrations/CSRIllustration';
import ComplianceIllustration from './illustrations/ComplianceIllustration';

export const ROLES_DATA = [
  {
    id: 'PROJECT_OFFICER',
    title: 'Project / Site User',
    shortName: 'Project / Site',
    desc: 'Enter project level ESG data',
    illustration: ProjectIllustration,
    icon: Building2,
    color: '#0284C7',
    email: 'site.officer@meilgroup.in',
    capabilities: [
      { icon: Building2, label: 'On-site Fuel & Grid Data' },
      { icon: Activity, label: 'Water Withdrawal & Recycling' },
      { icon: HardHat, label: 'Safety Man-hours & Incidents' },
      { icon: FileText, label: 'Site Evidence Documentation' }
    ]
  },
  {
    id: 'HR_OFFICER',
    title: 'HR User',
    shortName: 'HR',
    desc: 'Manage workforce and people data',
    illustration: HRIllustration,
    icon: Users,
    color: '#2563EB',
    email: 'hr.director@meilgroup.in',
    capabilities: [
      { icon: Users, label: 'Workforce Demographics & Gender' },
      { icon: Award, label: 'Training & Skill Development' },
      { icon: Target, label: 'Fair Wages & Living Standard' },
      { icon: Heart, label: 'Employee Wellbeing & Grievances' }
    ]
  },
  {
    id: 'EHS_OFFICER',
    title: 'EHS / Safety User',
    shortName: 'EHS / Safety',
    desc: 'Environment, Health and Safety data',
    illustration: EHSIllustration,
    icon: ShieldCheck,
    color: '#059669',
    email: 'ehs.head@meilgroup.in',
    capabilities: [
      { icon: Leaf, label: 'Environmental Impact Tracking' },
      { icon: ShieldCheck, label: 'Zero Harm Safety Audits' },
      { icon: HardHat, label: 'Hazardous Waste Management' },
      { icon: FileText, label: 'Emissions Baseline Verification' }
    ]
  },
  {
    id: 'PROCUREMENT_OFFICER',
    title: 'Procurement User',
    shortName: 'Procurement',
    desc: 'Supplier and procurement data',
    illustration: ProcurementIllustration,
    icon: Package,
    color: '#D97706',
    email: 'procurement@meilgroup.in',
    capabilities: [
      { icon: Package, label: 'Sustainable Supply Chain' },
      { icon: Activity, label: 'Tier-1 Vendor ESG Assessment' },
      { icon: Truck, label: 'Scope 3 Upstream Logistics' },
      { icon: Target, label: 'Green Sourcing Compliance' }
    ]
  },
  {
    id: 'CSR_OFFICER',
    title: 'CSR / Community User',
    shortName: 'CSR / Community',
    desc: 'Social impact and CSR data',
    illustration: CSRIllustration,
    icon: HeartHandshake,
    color: '#DB2777',
    email: 'csr.lead@meilgroup.in',
    capabilities: [
      { icon: HeartHandshake, label: 'CSR Projects Management' },
      { icon: Users, label: 'Community Engagement' },
      { icon: Heart, label: 'Social Impact Tracking' },
      { icon: Award, label: 'Beneficiary Data Auditing' }
    ]
  },
  {
    id: 'COMPLIANCE_OFFICER',
    title: 'Governance & Compliance Lead',
    shortName: 'Governance',
    desc: 'Governance, compliance, ethics, policies and disclosures',
    illustration: ComplianceIllustration,
    icon: ClipboardCheck,
    color: '#1E40AF',
    email: 'compliance@meilgroup.in',
    capabilities: [
      { icon: ClipboardCheck, label: 'SEBI BRSR Core Principles' },
      { icon: ShieldCheck, label: 'Vigil Mechanism & Ethics' },
      { icon: FileText, label: 'Statutory Assurance Tracking' },
      { icon: Scale, label: 'Governance Board Disclosures' }
    ]
  }
];

export function RoleCardDeck({
  onSelectRole,
  selectedOrg,
  isDissolving = false,
  selectedRoleId = null,
  animationState = 'HORIZONTAL_BROWSE', // 'IDLE_STACK' | 'BROWSE_EXPANDING' | 'HORIZONTAL_BROWSE'
}) {
  const [deckState, setDeckState] = useState(animationState);
  const [hoveredIdx, setHoveredIdx] = useState(2); // Default focus on EHS like frame 3
  const [activeIdx, setActiveIdx] = useState(2);
  const deckRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // ── Entrance & Expand Transition ──
  useEffect(() => {
    // If starting in IDLE_STACK, automatically expand on mount
    const timer = setTimeout(() => {
      if (deckState === 'IDLE_STACK' && !hasInteracted) {
        setDeckState('HORIZONTAL_BROWSE');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [deckState, hasInteracted]);

  // ── Throttled Mouse Movement Handler ──
  const handleMouseMove = useCallback((e) => {
    if (!deckRef.current || isDissolving) return;
    if (!hasInteracted) {
      setHasInteracted(true);
      setDeckState('HORIZONTAL_BROWSE');
    }
  }, [isDissolving, hasInteracted]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null);
  }, []);

  // ── Keyboard Navigation ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDissolving) return;
      if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : ROLES_DATA.length - 1));
        setHoveredIdx((prev) => (prev > 0 ? prev - 1 : ROLES_DATA.length - 1));
        setDeckState('HORIZONTAL_BROWSE');
      } else if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev < ROLES_DATA.length - 1 ? prev + 1 : 0));
        setHoveredIdx((prev) => (prev < ROLES_DATA.length - 1 ? prev + 1 : 0));
        setDeckState('HORIZONTAL_BROWSE');
      } else if (e.key === 'Enter') {
        const role = ROLES_DATA[activeIdx];
        if (role) onSelectRole(role);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDissolving, activeIdx, onSelectRole]);

  // ── Navigation Arrows ──
  const handlePrev = () => {
    setDeckState('HORIZONTAL_BROWSE');
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : ROLES_DATA.length - 1));
    setHoveredIdx((prev) => (prev > 0 ? prev - 1 : ROLES_DATA.length - 1));
  };

  const handleNext = () => {
    setDeckState('HORIZONTAL_BROWSE');
    setActiveIdx((prev) => (prev < ROLES_DATA.length - 1 ? prev + 1 : 0));
    setHoveredIdx((prev) => (prev < ROLES_DATA.length - 1 ? prev + 1 : 0));
  };

  const isStacked = deckState === 'IDLE_STACK';

  return (
    <div className="role-deck-wrapper" onMouseMove={handleMouseMove}>
      {/* ── Stepper Header ── */}
      <div className="auth-stepper-wrap">
        <span className="auth-stepper-label">STEP 1 OF 2</span>
        <div className="auth-stepper-bar" />
        <h1 className="auth-main-title">
          CHOOSE YOUR <span className="highlight-blue">ROLE</span>
        </h1>
        <p className="auth-subtitle">
          Select your role to continue to the MEIL ESG platform
        </p>

        {/* State Indicator / View Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => setDeckState(isStacked ? 'HORIZONTAL_BROWSE' : 'IDLE_STACK')}
            className="stack-toggle-pill"
          >
            {isStacked ? '← Expand to Horizontal Deck' : '◫ View Stacked Mode'}
          </button>
        </div>
      </div>

      {/* ── Main Deck Carousel Row ── */}
      <div
        className="deck-carousel-row"
        ref={deckRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Arrow Button */}
        {!isStacked && (
          <button
            className="deck-nav-arrow left"
            onClick={handlePrev}
            aria-label="Previous role"
            type="button"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* The 6 Role Cards Track */}
        <div
          className={`deck-cards-track ${isStacked ? 'is-stacked-mode' : 'is-horizontal-mode'} ${
            isDissolving ? 'cards-dissolving-away' : ''
          }`}
        >
          {ROLES_DATA.map((role, idx) => {
            const IllustrationComp = role.illustration;
            const isHovered = hoveredIdx === idx && !isStacked;
            const isActive = activeIdx === idx;
            const isSelected = selectedRoleId === role.id;

            // Stack physics when in IDLE_STACK:
            // Front card is index 0 (Project / Site User), others behind with offset and scale
            let cardTransform = '';
            let cardZIndex = ROLES_DATA.length - idx;
            let cardOpacity = 1;

            if (isStacked) {
              const depthIdx = idx; // 0 is front
              const xOffset = depthIdx * -28;
              const yOffset = depthIdx * -6;
              const scale = 1 - depthIdx * 0.04;
              cardOpacity = Math.max(0.6, 1 - depthIdx * 0.08);
              cardZIndex = 50 - depthIdx;
              cardTransform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scale})`;
            } else {
              // Horizontal Layout with Smooth Hover Rebound
              let neighborShift = 0;
              if (hoveredIdx !== null && hoveredIdx !== idx) {
                neighborShift = idx < hoveredIdx ? -8 : 8;
              }

              const lift = isHovered ? -14 : (isActive ? -4 : 0);
              const scale = isHovered ? 1.05 : (isActive ? 1.02 : 1);
              const subtleRotate = (idx - 2.5) * 0.7;

              cardTransform = `translate3d(${neighborShift}px, ${lift}px, 0) scale(${scale}) rotate(${subtleRotate}deg)`;
              cardZIndex = isHovered ? 60 : (isActive ? 40 : 10);
            }

            return (
              <div
                key={role.id}
                className={`role-glass-card ${isHovered || isActive ? 'is-active' : ''} ${
                  isSelected ? 'morph-selected-card' : ''
                } ${isDissolving && !isSelected ? 'dissolving-card' : ''}`}
                style={{
                  transform: cardTransform,
                  zIndex: cardZIndex,
                  opacity: cardOpacity,
                }}
                onMouseEnter={() => {
                  if (!isStacked) {
                    setHoveredIdx(idx);
                    setActiveIdx(idx);
                  }
                }}
                onClick={() => {
                  if (isStacked) {
                    setDeckState('HORIZONTAL_BROWSE');
                    setActiveIdx(idx);
                    setHoveredIdx(idx);
                  } else {
                    onSelectRole(role);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select role: ${role.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isStacked) setDeckState('HORIZONTAL_BROWSE');
                    else onSelectRole(role);
                  }
                }}
              >
                {/* Specular Diagonal Reflection Sweep */}
                <div className="card-glass-specular-sweep" />

                {/* ── Profile Illustration (Dominant Card Element, No Background Box) ── */}
                <div className="role-illustration-container">
                  <IllustrationComp
                    isHovered={isHovered}
                    isSelected={isSelected}
                  />
                </div>

                {/* ── Role Title & Description ── */}
                <div className="role-text-meta">
                  <h3 className="role-card-title">{role.title}</h3>
                  <p className="role-card-desc">{role.desc}</p>
                </div>

                {/* ── Soft Blue Atmospheric Underglow ── */}
                <div
                  className="role-card-underglow"
                  style={{
                    background: `radial-gradient(ellipse at 50% 100%, ${role.color}33 0%, transparent 70%)`
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {!isStacked && (
          <button
            className="deck-nav-arrow right"
            onClick={handleNext}
            aria-label="Next role"
            type="button"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* ── Pagination Dots ── */}
      <div className="deck-pagination-dots">
        {ROLES_DATA.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Jump to role ${idx + 1}`}
            className={`deck-dot ${activeIdx === idx ? 'active' : ''}`}
            onClick={() => {
              setDeckState('HORIZONTAL_BROWSE');
              setActiveIdx(idx);
              setHoveredIdx(idx);
            }}
          />
        ))}
      </div>

      {/* ── Footer Sustainability Line ── */}
      <div className="deck-footer-tagline">
        <div className="deck-footer-line" />
        <span className="deck-footer-text">
          Together for a Cleaner, Safer and More Responsible Tomorrow
        </span>
        <div className="deck-footer-line" />
      </div>
    </div>
  );
}

export default RoleCardDeck;
