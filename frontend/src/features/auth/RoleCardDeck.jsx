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
  Scale,
  Briefcase,
  TrendingUp,
  FileCheck,
  Search,
  Settings,
  Eye,
  BarChart3,
  Layers,
  ShieldAlert
} from 'lucide-react';

import ProjectIllustration from './illustrations/ProjectIllustration';
import HRIllustration from './illustrations/HRIllustration';
import EHSIllustration from './illustrations/EHSIllustration';
import ProcurementIllustration from './illustrations/ProcurementIllustration';
import CSRIllustration from './illustrations/CSRIllustration';
import ComplianceIllustration from './illustrations/ComplianceIllustration';

export const ROLES_DATA = [
  // ── PHASE 1: OPERATIONAL DATA ENTRY ROLES ──
  {
    id: 'PROJECT_OFFICER',
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'Project / Site User',
    shortName: 'Project / Site',
    desc: 'Enter on-site fuel, grid, water, waste & safety incident logs',
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
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'HR User',
    shortName: 'HR',
    desc: 'Manage workforce demographics, training, POSH & fair wages',
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
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'EHS / Safety User',
    shortName: 'EHS / Safety',
    desc: 'Environment, Health and Safety zero-harm monitoring',
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
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'Procurement User',
    shortName: 'Procurement',
    desc: 'Sustainable supply chain, Tier-1 vendor ESG & Scope 3 logistics',
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
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'CSR / Community User',
    shortName: 'CSR & Community',
    desc: 'Social impact, community development & Section 135 projects',
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
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'Governance & Compliance Lead',
    shortName: 'Governance',
    desc: 'Governance, ethics, board charters & regulatory compliance',
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
  },

  // ── PHASE 2: REVIEW & APPROVAL WORKFLOW ROLES ──
  {
    id: 'BU_COORDINATOR',
    category: 'REVIEWERS',
    phase: 'Phase 2',
    title: 'Business Unit Reviewer / Coordinator',
    shortName: 'BU Coordinator',
    desc: 'Review and approve site submissions across Business Unit projects',
    icon: Layers,
    color: '#0D9488',
    email: 'bu.coordinator@meilgroup.in',
    capabilities: [
      { icon: Layers, label: 'Multi-Project Review & Batching' },
      { icon: FileCheck, label: 'Level-1 Approval & Rework Request' },
      { icon: Activity, label: 'BU Consolidation Tracking' },
      { icon: ShieldCheck, label: 'Pre-Assurance Quality Gates' }
    ]
  },
  {
    id: 'SUBSIDIARY_HEAD',
    category: 'REVIEWERS',
    phase: 'Phase 2',
    title: 'Subsidiary ESG Reviewer / Head',
    shortName: 'Subsidiary Head',
    desc: 'Approve BU submissions and oversee subsidiary-level ESG integrity',
    icon: Briefcase,
    color: '#7C3AED',
    email: 'sub.head@meilgroup.in',
    capabilities: [
      { icon: Briefcase, label: 'Subsidiary Scope Governance' },
      { icon: FileCheck, label: 'Level-2 Statutory Sign-Off' },
      { icon: TrendingUp, label: 'Division Decarbonization Roadmap' },
      { icon: Scale, label: 'Subsidiary BRSR Compliance' }
    ]
  },
  {
    id: 'GROUP_CSO',
    category: 'REVIEWERS',
    phase: 'Phase 2',
    title: 'Group / HQ ESG Reviewer / CSO',
    shortName: 'Group CSO',
    desc: 'Group Chief Sustainability Officer enterprise review & locking',
    icon: ShieldCheck,
    color: '#4338CA',
    email: 'cso@meilgroup.in',
    capabilities: [
      { icon: ShieldCheck, label: 'Group-Wide Final Locking' },
      { icon: BarChart3, label: 'Consolidated Enterprise Carbon' },
      { icon: Award, label: 'Statutory BRSR Attestation' },
      { icon: FileText, label: 'Auditor Engagement Sign-Off' }
    ]
  },

  // ── PHASE 3: STRATEGY & ASSURANCE ROLES ──
  {
    id: 'ESG_MANAGER',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'ESG / Sustainability Manager',
    shortName: 'ESG Manager',
    desc: 'Lead enterprise sustainability initiatives, Net Zero targets & KPIs',
    icon: Target,
    color: '#047857',
    email: 'esg.manager@meilgroup.in',
    capabilities: [
      { icon: Target, label: 'Net Zero & Science-Based Targets' },
      { icon: Activity, label: 'Cross-Functional ESG Orchestration' },
      { icon: Leaf, label: 'Renewable Transition Strategy' },
      { icon: FileText, label: 'ESG Committee Reporting' }
    ]
  },
  {
    id: 'ESG_ANALYST',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'ESG Analyst',
    shortName: 'ESG Analyst',
    desc: 'Quantitative modeling, CEA baseline auditing & emission analytics',
    icon: BarChart3,
    color: '#0891B2',
    email: 'esg.analyst@meilgroup.in',
    capabilities: [
      { icon: BarChart3, label: 'Scope 1, 2, 3 Intensity Models' },
      { icon: Activity, label: 'Grid Baseline v19 Variance' },
      { icon: TrendingUp, label: 'Year-on-Year Trend Forecasts' },
      { icon: Search, label: 'Deep Data Diagnostics' }
    ]
  },
  {
    id: 'BRSR_MANAGER',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'BRSR Manager',
    shortName: 'BRSR Manager',
    desc: 'SEBI BRSR Statutory filings, circulars & Core 9 indicator assurance',
    icon: FileCheck,
    color: '#3B82F6',
    email: 'brsr.manager@meilgroup.in',
    capabilities: [
      { icon: FileCheck, label: 'SEBI Circular 2021/2023/2025' },
      { icon: Scale, label: 'NGRBC 9 Principles Inventory' },
      { icon: Award, label: 'BRSR Core Assurance Packaging' },
      { icon: FileText, label: 'Statutory XBRL / PDF Exports' }
    ]
  },
  {
    id: 'ASSURANCE_AUDITOR',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'Auditor / Assurance User',
    shortName: 'Auditor',
    desc: 'Independent third-party verification, sample auditing & evidence seals',
    icon: Search,
    color: '#B45309',
    email: 'auditor@meilgroup.in',
    capabilities: [
      { icon: Search, label: 'Independent Reasonable Assurance' },
      { icon: ShieldCheck, label: 'Cryptographic Byte Hash Audit' },
      { icon: FileText, label: 'Sample Evidence Scrutiny' },
      { icon: Award, label: 'Assurance Opinion Issuance' }
    ]
  },
  {
    id: 'EXECUTIVE',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'Management / Executive User',
    shortName: 'Executive',
    desc: 'Board & C-Suite executive briefing, ESG rating & capital allocation',
    icon: Eye,
    color: '#1E293B',
    email: 'executive@meilgroup.in',
    capabilities: [
      { icon: Eye, label: 'Executive Board Overview' },
      { icon: Award, label: 'Global ESG Rating Scores' },
      { icon: TrendingUp, label: 'Green Finance & CapEx Tracking' },
      { icon: Scale, label: 'Group Reputational Governance' }
    ]
  },

  // ── SYSTEM ADMINISTRATION ──
  {
    id: 'SUPER_ADMIN',
    category: 'ADMIN',
    phase: 'System',
    title: 'Super Administrator',
    shortName: 'Super Admin',
    desc: 'Full enterprise control, RBAC scopes, factor governance & WORM audit',
    icon: Settings,
    color: '#6366F1',
    email: 'admin@meilgroup.in',
    capabilities: [
      { icon: Settings, label: 'RBAC Master Management' },
      { icon: ShieldAlert, label: 'WORM Immutable Audit Archive' },
      { icon: Layers, label: 'Organization Tree Administration' },
      { icon: Scale, label: 'Governed Emission Factor Master' }
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
                  {IllustrationComp ? (
                    <IllustrationComp
                      isHovered={isHovered}
                      isSelected={isSelected}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '22px',
                      background: `radial-gradient(circle at 30% 30%, ${role.color}20, ${role.color}06)`,
                      border: `1.5px solid ${role.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 24px -6px ${role.color}30`
                    }}>
                      {role.icon ? React.createElement(role.icon, { size: 40, color: role.color }) : <Building2 size={40} color={role.color} />}
                    </div>
                  )}
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
