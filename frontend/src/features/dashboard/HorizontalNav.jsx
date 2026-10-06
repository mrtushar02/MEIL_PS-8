import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Building2, 
  FileText, 
  Paperclip, 
  Send, 
  BarChart3, 
  TrendingUp, 
  MoreHorizontal,
  ChevronDown,
  Users,
  GraduationCap,
  HeartPulse,
  Scale,
  Leaf,
  ShieldAlert,
  Truck,
  CheckSquare,
  FileCheck2,
  Clock,
  Layers,
  FolderKanban,
  MapPin,
  Target,
  Users2,
  AlertCircle,
  Inbox,
  Shield,
  Lock,
  Award
} from 'lucide-react';

export default function HorizontalNav({
  role = { id: 'PROJECT_OFFICER', title: 'Project / Site User' },
  activeTab = 'overview',
  onTabChange
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Role-aware primary tabs configuration
  const getNavTabs = () => {
    switch (role?.id) {
      case 'EHS_OFFICER':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'safety', label: 'Safety & HSE', icon: ShieldAlert },
          { id: 'inspections', label: 'Inspections', icon: CheckSquare },
          { id: 'training', label: 'Training', icon: GraduationCap },
          { id: 'environmental', label: 'Environmental', icon: Leaf },
          { id: 'evidence', label: 'Evidence', icon: Paperclip },
          { id: 'submissions', label: 'Submissions', icon: Send },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ];
      case 'PROCUREMENT_OFFICER':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'suppliers', label: 'Suppliers', icon: Building2 },
          { id: 'procurement', label: 'Procurement', icon: Truck },
          { id: 'assessments', label: 'Assessments', icon: FileCheck2 },
          { id: 'value-chain', label: 'Value Chain', icon: Layers },
          { id: 'risk', label: 'Risk', icon: ShieldAlert },
          { id: 'actions', label: 'Actions', icon: CheckSquare },
          { id: 'evidence', label: 'Evidence', icon: Paperclip },
          { id: 'submissions', label: 'Submissions', icon: Send },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ];
      case 'HR_OFFICER':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'workforce', label: 'Workforce', icon: Users },
          { id: 'training', label: 'Training', icon: GraduationCap },
          { id: 'wellbeing', label: 'Wellbeing', icon: HeartPulse },
          { id: 'human-rights', label: 'Human Rights', icon: Scale },
          { id: 'evidence', label: 'Evidence', icon: Paperclip },
          { id: 'submissions', label: 'Submissions', icon: Send }
        ];
      case 'CSR_OFFICER':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'projects', label: 'CSR Projects', icon: FolderKanban },
          { id: 'community', label: 'Community', icon: MapPin },
          { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
          { id: 'social-impact', label: 'Social Impact', icon: Target },
          { id: 'stakeholders', label: 'Stakeholders', icon: Users2 },
          { id: 'grievances', label: 'Grievances', icon: AlertCircle },
          { id: 'evidence', label: 'Evidence', icon: Paperclip },
          { id: 'submissions', label: 'Submissions', icon: Send },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ];
      case 'COMPLIANCE_OFFICER':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'policies', label: 'Policies', icon: FileText },
          { id: 'obligations', label: 'Compliance', icon: Scale },
          { id: 'controls', label: 'Controls', icon: ShieldAlert },
          { id: 'ethics', label: 'Ethics', icon: Users },
          { id: 'grievances', label: 'Grievances', icon: AlertCircle },
          { id: 'disclosures', label: 'Disclosures', icon: Building2 },
          { id: 'evidence', label: 'Evidence', icon: Paperclip },
          { id: 'submissions', label: 'Submissions', icon: Send },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ];
      case 'BU_COORDINATOR':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'review-queue', label: 'Review Queue', icon: Inbox },
          { id: 'my-bu', label: 'My Business Unit', icon: Building2 },
          { id: 'submissions', label: 'Submissions', icon: Send },
          { id: 'data-validation', label: 'Data & Validation', icon: CheckSquare },
          { id: 'evidence', label: 'Evidence', icon: Paperclip },
          { id: 'consolidation', label: 'Consolidation', icon: BarChart3 },
          { id: 'exceptions', label: 'Exceptions & SLA', icon: AlertCircle },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'audit', label: 'Audit & Traceability', icon: Clock },
          { id: 'more', label: 'More', icon: MoreHorizontal }
        ];
      case 'SUBSIDIARY_HEAD':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'bu-review', label: 'BU Review Center', icon: Inbox },
          { id: 'package-detail', label: 'Package Cockpit', icon: Layers },
          { id: 'esg-performance', label: 'Consolidated ESG', icon: BarChart3 },
          { id: 'brsr-impact', label: 'BRSR Impact', icon: Target },
          { id: 'approvals', label: 'Approval Center', icon: CheckSquare },
          { id: 'evidence', label: 'Evidence Vault', icon: Paperclip },
          { id: 'exceptions', label: 'Exceptions & Risks', icon: AlertCircle },
          { id: 'reports', label: 'Reports & Audit', icon: FileText },
          { id: 'more', label: 'More', icon: MoreHorizontal }
        ];
      case 'GROUP_CSO':
        return [
          { id: 'overview', label: 'Command Center', icon: Shield },
          { id: 'hierarchy', label: '4-Tier Hierarchy', icon: Layers },
          { id: 'enterprise-esg', label: 'Enterprise ESG', icon: BarChart3 },
          { id: 'brsr-command', label: 'BRSR Command', icon: Award },
          { id: 'assurance', label: 'Assurance Center', icon: CheckSquare },
          { id: 'final-lock', label: 'Statutory Lock', icon: Lock },
          { id: 'risk', label: 'Risk Register', icon: ShieldAlert },
          { id: 'statutory-reports', label: 'Statutory Reports', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'audit', label: 'Audit Trail', icon: Clock },
          { id: 'panoramic', label: 'Executive Panoramic', icon: Home },
          { id: 'more', label: 'More', icon: MoreHorizontal }
        ];
      case 'PROJECT_OFFICER':
      default:
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'my-project', label: 'My Project', icon: Building2 },
          { id: 'data-entry', label: 'Data Entry', icon: FileText },
          { id: 'evidence', label: 'Evidence', icon: Paperclip },
          { id: 'submissions', label: 'Submissions', icon: Send },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'audit', label: 'Audit & Traceability', icon: Clock }
        ];
    }
  };

  const getTabBadge = (tabId) => {
    switch (tabId) {
      case 'review-queue':
        return { text: '8', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' };
      case 'exceptions':
        return { text: '3', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.12)' };
      case 'data-entry':
        return { text: 'New', color: '#16A34A', bg: 'rgba(220, 163, 74, 0.12)' };
      case 'evidence':
        return { text: '12', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' };
      case 'submissions':
        return { text: '3', color: '#D97706', bg: 'rgba(217, 119, 6, 0.14)' };
      case 'risk':
        return { text: '6', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.12)' };
      case 'actions':
        return { text: '24', color: '#D97706', bg: 'rgba(217, 119, 6, 0.14)' };
      default:
        return null;
    }
  };

  const getMoreMenuOptions = () => {
    switch (role?.id) {
      case 'EHS_OFFICER':
        return [
          { id: 'incidents', label: 'Incident Management', icon: ShieldAlert, tag: 'INC' },
          { id: 'corrective-actions', label: 'Corrective Actions (CAPA)', icon: CheckSquare, tag: 'CAPA' },
          { id: 'compliance', label: 'Compliance / Action Center', icon: FileCheck2, tag: 'DGMS' },
          { id: 'audit', label: 'Audit & Traceability', icon: Clock, tag: 'ISO 45001' },
          { id: 'reports', label: 'BRSR Principle 6 Report', icon: BarChart3, tag: 'P6 HSE' }
        ];
      case 'PROCUREMENT_OFFICER':
        return [
          { id: 'action-center', label: 'Procurement Action Center', icon: Clock, tag: 'ACTIONS' },
          { id: 'supplier-detail', label: 'Supplier Profile Detail', icon: Building2, tag: 'SUP-001' },
          { id: 'reports', label: 'BRSR Principle 8 Report', icon: BarChart3, tag: 'P8 Core' }
        ];
      case 'CSR_OFFICER':
        return [
          { id: 'actions', label: 'Action Center', icon: Clock, tag: 'TASKS' },
          { id: 'project-detail', label: 'Project Detail (CSR-001)', icon: FolderKanban, tag: 'DETAIL' },
          { id: 'reports', label: 'BRSR Principle 8 Report', icon: BarChart3, tag: 'P8 CSR' },
          { id: 'audit', label: 'Audit & Traceability', icon: FileCheck2, tag: 'AUDIT' }
        ];
      case 'COMPLIANCE_OFFICER':
        return [
          { id: 'action-center', label: 'Compliance Action Center', icon: Clock, tag: 'ACTION' },
          { id: 'policy-detail', label: 'Policy Detail (POL-002)', icon: FileText, tag: 'DETAIL' },
          { id: 'assessments', label: 'Compliance Assessments', icon: FileCheck2, tag: 'AUDIT' },
          { id: 'brsr-mapping', label: 'BRSR / ESG Mapping', icon: Layers, tag: 'BRSR' },
          { id: 'audit', label: 'Audit & Traceability', icon: Clock, tag: 'TRACE' }
        ];
      case 'HR_OFFICER':
        return [
          { id: 'evidence', label: 'HR Evidence Vault', icon: Paperclip, tag: 'EPF/ESI' },
          { id: 'submissions', label: 'Statutory Filings', icon: Send, tag: 'Form IV' },
          { id: 'reports', label: 'BRSR Principle 3 Report', icon: BarChart3, tag: 'Annexure' },
        ];
      case 'SUBSIDIARY_HEAD':
        return [
          { id: 'package-detail', label: 'BU Package Cockpit', icon: Layers, tag: 'DETAIL' },
          { id: 'approvals', label: 'Approval Sign-off Center', icon: CheckSquare, tag: 'SIGN' },
          { id: 'exceptions', label: 'Risk Mitigation Desk', icon: AlertCircle, tag: 'RISK' }
        ];
      case 'GROUP_CSO':
        return [
          { id: 'hierarchy', label: 'Group 4-Tier Tree', icon: Layers, tag: 'ORG' },
          { id: 'assurance', label: 'PwC Assurance Workstreams', icon: CheckSquare, tag: 'AUDIT' },
          { id: 'final-lock', label: 'Period Lock Ceremony', icon: Lock, tag: 'SEAL' },
          { id: 'panoramic', label: 'Executive Panoramic View', icon: Home, tag: 'BOARD' }
        ];
      case 'PROJECT_OFFICER':
      default:
        return [
          { id: 'workforce', label: 'Workforce & HR', icon: Users, tag: 'P3/P5' },
          { id: 'reports', label: 'BRSR Reports', icon: BarChart3, tag: 'SEBI' },
          { id: 'analytics', label: 'ESG Analytics', icon: TrendingUp, tag: 'GHG' },
        ];
    }
  };

  const navTabs = getNavTabs();
  const moreOptions = getMoreMenuOptions();

  return (
    <div className="dashboard-nav-container">
      <nav className="horizontal-nav-bar" aria-label="Main Navigation">
        {/* Scrollable Tabs Track */}
        <div className="nav-tabs-scroll-track">
          {navTabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            const badge = getTabBadge(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-item ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComp size={16} />
                <span>{tab.label}</span>
                {badge && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '700',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    color: badge.color,
                    background: badge.bg,
                    marginLeft: '2px',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* More Menu Dropdown (Pinned to Right, Unclipped) */}
        <div ref={moreRef} style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, zIndex: 9999 }}>
          <button
            type="button"
            className="nav-tab-item nav-more-btn"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            style={{ 
              color: isMoreOpen ? '#2563EB' : '#475569',
              background: isMoreOpen ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              borderRadius: '10px'
            }}
          >
            <MoreHorizontal size={16} />
            <span>More</span>
            <ChevronDown size={14} style={{ marginLeft: '-2px', transform: isMoreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
          </button>

          {isMoreOpen && (
            <div 
              className="nav-more-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(28px) saturate(140%)',
                WebkitBackdropFilter: 'blur(28px) saturate(140%)',
                border: '1px solid rgba(203, 213, 225, 0.9)',
                borderRadius: '14px',
                padding: '6px',
                minWidth: '220px',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.15), 0 2px 8px rgba(15, 23, 42, 0.06)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}
            >
              <div style={{ padding: '6px 10px 4px', fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Additional Modules
              </div>
              {moreOptions.map(sub => {
                const SubIcon = sub.icon;
                const isItemActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    className="more-dropdown-item"
                    onClick={() => {
                      onTabChange(sub.id);
                      setIsMoreOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isItemActive ? 'rgba(37, 99, 235, 0.1)' : 'none',
                      color: isItemActive ? '#2563EB' : '#1E293B',
                      fontSize: '12px',
                      fontWeight: isItemActive ? 700 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isItemActive) e.currentTarget.style.background = '#F1F5F9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isItemActive) e.currentTarget.style.background = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SubIcon size={14} color={isItemActive ? '#2563EB' : '#64748B'} />
                      <span>{sub.label}</span>
                    </div>
                    {sub.tag && (
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: '700',
                        color: '#64748B',
                        background: '#E2E8F0',
                        padding: '1px 5px',
                        borderRadius: '6px'
                      }}>
                        {sub.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
