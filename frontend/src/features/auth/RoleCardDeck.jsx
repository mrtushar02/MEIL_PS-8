import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  ShieldCheck,
  Package,
  Heart,
  ClipboardCheck,
  Layers,
  Briefcase,
  ShieldAlert,
  BarChart3,
  Activity,
  FileCheck,
  Search,
  Eye,
  Settings,
  HardHat,
  FileText,
  Award,
  Target,
  Truck,
  Scale
} from 'lucide-react';

import ProjectIllustration from './illustrations/ProjectIllustration';
import HRIllustration from './illustrations/HRIllustration';
import EHSIllustration from './illustrations/EHSIllustration';
import ProcurementIllustration from './illustrations/ProcurementIllustration';
import CSRIllustration from './illustrations/CSRIllustration';
import ComplianceIllustration from './illustrations/ComplianceIllustration';

export const ROLES_DATA = [
  // ── 6 PRIMARY OPERATIONAL DATA ENTRY ROLES (EXACTLY MATCHING THE REFERENCE IMAGE) ──
  {
    id: 'PROJECT_OFFICER',
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'Project / Site User',
    shortName: 'Project / Site',
    desc: 'Enter project level ESG data',
    illustration: ProjectIllustration,
    icon: Building2,
    color: '#2563EB',
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
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'EHS / Safety User',
    shortName: 'EHS / Safety',
    desc: 'Environment, Health and Safety data',
    illustration: EHSIllustration,
    icon: ShieldCheck,
    color: '#2563EB',
    email: 'ehs.head@meilgroup.in',
    capabilities: [
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
    desc: 'Supplier and procurement data',
    illustration: ProcurementIllustration,
    icon: Package,
    color: '#2563EB',
    email: 'procurement@meilgroup.in',
    capabilities: [
      { icon: Package, label: 'Sustainable Supply Chain' },
      { icon: Activity, label: 'Tier-1 Vendor ESG Assessment' },
      { icon: Truck, label: 'Scope 3 Upstream Logistics' }
    ]
  },
  {
    id: 'CSR_OFFICER',
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'CSR / Community User',
    shortName: 'CSR & Community',
    desc: 'Social impact and CSR data',
    illustration: CSRIllustration,
    icon: Heart,
    color: '#2563EB',
    email: 'csr.lead@meilgroup.in',
    capabilities: [
      { icon: Heart, label: 'CSR Projects Management' },
      { icon: Users, label: 'Community Engagement' },
      { icon: Award, label: 'Beneficiary Data Auditing' }
    ]
  },
  {
    id: 'COMPLIANCE_OFFICER',
    category: 'OPERATIONS',
    phase: 'Phase 1',
    title: 'Compliance User',
    shortName: 'Compliance',
    desc: 'Governance and compliance data',
    illustration: ComplianceIllustration,
    icon: ClipboardCheck,
    color: '#2563EB',
    email: 'compliance@meilgroup.in',
    capabilities: [
      { icon: ClipboardCheck, label: 'SEBI BRSR Core Principles' },
      { icon: ShieldCheck, label: 'Vigil Mechanism & Ethics' },
      { icon: Scale, label: 'Governance Board Disclosures' }
    ]
  },

  // ── PHASE 2: REVIEW & APPROVAL WORKFLOW ROLES ──
  {
    id: 'BU_COORDINATOR',
    category: 'REVIEWERS',
    phase: 'Phase 2',
    title: 'BU Reviewer / Coordinator',
    shortName: 'BU Coordinator',
    desc: 'Review project submissions across BU',
    icon: Layers,
    color: '#2563EB',
    email: 'bu.coordinator@meilgroup.in',
    capabilities: [
      { icon: Layers, label: 'Multi-Project Review & Batching' },
      { icon: FileCheck, label: 'Level-1 Approval & Rework Request' }
    ]
  },
  {
    id: 'SUBSIDIARY_HEAD',
    category: 'REVIEWERS',
    phase: 'Phase 2',
    title: 'Subsidiary ESG Head',
    shortName: 'Subsidiary Head',
    desc: 'Oversee subsidiary ESG integrity & review',
    icon: Briefcase,
    color: '#2563EB',
    email: 'sub.head@meilgroup.in',
    capabilities: [
      { icon: Briefcase, label: 'Subsidiary Scope Governance' },
      { icon: FileCheck, label: 'Level-2 Statutory Sign-Off' }
    ]
  },
  {
    id: 'GROUP_CSO',
    category: 'REVIEWERS',
    phase: 'Phase 2',
    title: 'Group / HQ CSO',
    shortName: 'Group CSO',
    desc: 'Group ESG strategy & final consolidation',
    icon: ShieldAlert,
    color: '#2563EB',
    email: 'cso@meilgroup.in',
    capabilities: [
      { icon: ShieldAlert, label: 'Group Multi-Entity Sign-Off' },
      { icon: FileCheck, label: 'WORM Immutable Audit Finalization' }
    ]
  },

  // ── PHASE 3: STRATEGY & ASSURANCE ROLES ──
  {
    id: 'ESG_MANAGER',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'ESG Strategy Manager',
    shortName: 'ESG Manager',
    desc: 'BRSR KPI targets & peer benchmarking',
    icon: BarChart3,
    color: '#2563EB',
    email: 'esg.manager@meilgroup.in',
    capabilities: [
      { icon: BarChart3, label: 'Strategic ESG Target Tracking' },
      { icon: Target, label: 'Peer Benchmarking & Sector Analysis' }
    ]
  },
  {
    id: 'ESG_ANALYST',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'ESG Carbon Analyst',
    shortName: 'ESG Analyst',
    desc: 'GHG Scope 1, 2, 3 calculations & audit',
    icon: Activity,
    color: '#2563EB',
    email: 'esg.analyst@meilgroup.in',
    capabilities: [
      { icon: Activity, label: 'GHG Scope 1, 2, 3 Inventory' },
      { icon: Scale, label: 'India Grid CEA Emission Factors' }
    ]
  },
  {
    id: 'BRSR_MANAGER',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'BRSR Disclosure Lead',
    shortName: 'BRSR Lead',
    desc: 'SEBI statutory reporting across principles',
    icon: FileCheck,
    color: '#2563EB',
    email: 'brsr.manager@meilgroup.in',
    capabilities: [
      { icon: FileCheck, label: 'SEBI BRSR Statutory Filing' },
      { icon: ClipboardCheck, label: '9 NGRBC Core Principles' }
    ]
  },
  {
    id: 'ASSURANCE_AUDITOR',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'Assurance Auditor',
    shortName: 'Auditor',
    desc: 'Independent assurance verification & trails',
    icon: Search,
    color: '#2563EB',
    email: 'auditor@kpmg-assurance.com',
    capabilities: [
      { icon: Search, label: 'ISAE 3000 / SSAE 3410 Verification' },
      { icon: ShieldCheck, label: 'Digital Evidence Chain of Custody' }
    ]
  },
  {
    id: 'EXECUTIVE',
    category: 'STRATEGY',
    phase: 'Phase 3',
    title: 'Management / Executive',
    shortName: 'Executive',
    desc: 'Board & C-Suite executive briefing & ratings',
    icon: Eye,
    color: '#2563EB',
    email: 'executive@meilgroup.in',
    capabilities: [
      { icon: Eye, label: 'Executive Board Overview' },
      { icon: Award, label: 'Global ESG Rating Scores' }
    ]
  },
  {
    id: 'SUPER_ADMIN',
    category: 'ADMIN',
    phase: 'System',
    title: 'Super Administrator',
    shortName: 'Super Admin',
    desc: 'Full enterprise control, RBAC & WORM audit',
    icon: Settings,
    color: '#2563EB',
    email: 'admin@meilgroup.in',
    capabilities: [
      { icon: Settings, label: 'RBAC Master Management' },
      { icon: ShieldAlert, label: 'WORM Immutable Audit Archive' }
    ]
  }
];

export function RoleCardDeck({
  onSelectRole,
  selectedOrg,
  isDissolving = false,
  selectedRoleId = null,
}) {
  const CARD_WIDTH = 172;
  const GAP = 16;
  const CARD_STEP = CARD_WIDTH + GAP; // 188px

  // Default active role index is 4 (CSR / Community User), matching the reference design image!
  const [activeIdx, setActiveIdx] = useState(4);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const carouselRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1150
  );

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const [dragDelta, setDragDelta] = useState(0);

  // Measure carousel container width for exact middle centering
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.clientWidth || window.innerWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Step to previous role
  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => Math.max(0, prev - 1));
  }, []);

  // Step to next role
  const handleNext = useCallback(() => {
    setActiveIdx((prev) => Math.min(ROLES_DATA.length - 1, prev + 1));
  }, []);

  // Smooth middle mouse wheel listener with debounce
  useEffect(() => {
    const containerEl = carouselRef.current;
    if (!containerEl) return;

    let wheelTimeout = null;
    let accumulatedDelta = 0;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      accumulatedDelta += delta;

      if (wheelTimeout) clearTimeout(wheelTimeout);

      if (Math.abs(accumulatedDelta) >= 30) {
        if (accumulatedDelta > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        accumulatedDelta = 0;
      }

      wheelTimeout = setTimeout(() => {
        accumulatedDelta = 0;
      }, 140);
    };

    containerEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      containerEl.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [handlePrev, handleNext]);

  // Keyboard navigation: Left/Right arrow keys & Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDissolving) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Enter') {
        const role = ROLES_DATA[activeIdx];
        if (role) onSelectRole(role);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDissolving, activeIdx, onSelectRole, handlePrev, handleNext]);

  // Pointer drag interactions (swipe left/right)
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    setDragDelta(0);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - dragStartXRef.current;
    setDragDelta(diff * 0.7);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const diff = e.clientX - dragStartXRef.current;
    setDragDelta(0);

    if (diff < -35) {
      handleNext();
    } else if (diff > 35) {
      handlePrev();
    }
  };

  // Card click: If not centered, center it in the middle. If already centered, proceed!
  const handleCardClick = (idx, role) => {
    if (activeIdx !== idx) {
      setActiveIdx(idx);
    } else {
      onSelectRole(role);
    }
  };

  // Pagination dot click: Jump directly to role and center in the middle
  const handleDotClick = (idx) => {
    setActiveIdx(idx);
  };

  // ── EXACT MIDDLE CENTERING FORMULA ──
  // Shifts the track so that card `activeIdx` is aligned directly at (containerWidth / 2)
  const activeCardCenter = activeIdx * CARD_STEP + (CARD_WIDTH / 2);
  const trackOffsetX = (containerWidth / 2) - activeCardCenter;

  return (
    <div className="role-deck-wrapper">
      {/* ── Stepper Header: Exactly matching reference design ── */}
      <div className="auth-stepper-wrap">
        <span className="auth-stepper-label">STEP 1 OF 2</span>
        <h1 className="auth-main-title">
          Choose Your <span className="highlight-blue">Role</span>
        </h1>
        <p className="auth-subtitle">
          Select your role to continue to the MEIL ESG platform
        </p>
      </div>

      {/* ── Main Deck Carousel with Side Chevron Arrows ── */}
      <div className="deck-carousel-container" ref={carouselRef}>
        {/* Left Arrow Button */}
        <button
          className="deck-nav-arrow left"
          onClick={handlePrev}
          aria-label="Previous role"
          type="button"
          disabled={activeIdx === 0}
          style={{ opacity: activeIdx === 0 ? 0.4 : 1, cursor: activeIdx === 0 ? 'default' : 'pointer' }}
        >
          <ChevronLeft size={24} strokeWidth={2.4} />
        </button>

        {/* The Scroll Viewport */}
        <div
          className="deck-carousel-row"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Track of Cards: Smoothly translates so activeIdx is always centered in the middle */}
          <div
            className={`deck-cards-track ${isDissolving ? 'cards-dissolving-away' : ''}`}
            style={{
              transform: `translate3d(${trackOffsetX + dragDelta}px, 0, 0)`,
              transition: isDraggingRef.current
                ? 'none'
                : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {ROLES_DATA.map((role, idx) => {
              const IconComp = role.icon || Building2;
              // Elevated straight up if hovered, or if active and no card is hovered
              const isElevated = hoveredIdx !== null ? hoveredIdx === idx : activeIdx === idx;
              const isSelected = selectedRoleId === role.id;

              return (
                <div
                  key={role.id}
                  className={`role-glass-card ${isElevated ? 'is-elevated' : ''} ${
                    isSelected ? 'morph-selected-card' : ''
                  } ${isDissolving && !isSelected ? 'dissolving-card' : ''}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => handleCardClick(idx, role)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select role: ${role.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(idx, role);
                    }
                  }}
                >
                  {/* Rounded Square Light-Blue Icon Container */}
                  <div className="role-card-icon-box">
                    <IconComp size={28} strokeWidth={2} color="#2563EB" />
                  </div>

                  {/* Role Title & Subtitle */}
                  <div className="role-text-meta">
                    {role.category && <span className="role-category-tag">{role.category}</span>}
                    <h3 className="role-card-title">{role.title}</h3>
                    <p className="role-card-desc">{role.desc}</p>
                  </div>

                  {/* Soft Atmospheric Blue Underglow Beneath Card */}
                  <div className="role-card-underglow" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          className="deck-nav-arrow right"
          onClick={handleNext}
          aria-label="Next role"
          type="button"
          disabled={activeIdx === ROLES_DATA.length - 1}
          style={{
            opacity: activeIdx === ROLES_DATA.length - 1 ? 0.4 : 1,
            cursor: activeIdx === ROLES_DATA.length - 1 ? 'default' : 'pointer',
          }}
        >
          <ChevronRight size={24} strokeWidth={2.4} />
        </button>
      </div>

      {/* ── Pagination Dots (Clickable, perfectly synced with active role in the middle) ── */}
      <div className="deck-pagination-dots">
        {ROLES_DATA.map((role, dotIdx) => (
          <button
            key={role.id}
            type="button"
            aria-label={`Jump to role ${dotIdx + 1}: ${role.title}`}
            className={`deck-dot ${activeIdx === dotIdx ? 'active' : ''}`}
            onClick={() => handleDotClick(dotIdx)}
          />
        ))}
      </div>

      {/* ── Footer Sustainability Tagline ── */}
      <div className="deck-footer-tagline">
        <span className="deck-footer-text">
          Together for a Cleaner, Safer and More Responsible Tomorrow
        </span>
      </div>
    </div>
  );
}

export default RoleCardDeck;
