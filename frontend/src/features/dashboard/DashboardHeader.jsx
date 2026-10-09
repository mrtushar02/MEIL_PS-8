import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  LogOut, 
  User, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  X,
  ExternalLink,
  Shield,
  FileCheck
} from 'lucide-react';
import MeilLogo from '../auth/MeilLogo';

export default function DashboardHeader({
  user = { name: 'Rohit Kumar', email: 'rohit.kumar@meil.in' },
  role = { title: 'Project / Site User', id: 'PROJECT_OFFICER' },
  onLogout,
  onNavigateTab,
  onSwitchRole
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const helpRef = useRef(null);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsHelpOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = [
    { type: 'Project', title: 'Hyderabad Metro Rail Project', meta: 'BU: MEIL Infrastructure • Code: HMR-001', icon: Building2 },
    { type: 'Data', title: 'Energy Data — Sep 2026 (48,250 MWh)', meta: 'Draft saved • 5 days until deadline', icon: FileText },
    { type: 'Evidence', title: 'TSSPDCL Electricity Invoices Q2', meta: 'Verified OCR • Hash: 9f8a...312', icon: FileCheck },
    { type: 'BRSR', title: 'Principle 6 — Environmental Safeguards', meta: 'Scope 1, 2 emissions & water stewardship', icon: Shield },
  ].filter(item => 
    !searchQuery || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.meta.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="dashboard-top-header">
        {/* Left: MEIL Brand Mark & Platform Name */}
        <div className="top-header-left">
          <MeilLogo width={110} height={32} />
          <div className="header-brand-divider" />
          <div className="header-brand-titles">
            <span className="header-brand-name">MEIL ESG</span>
            <span className="header-brand-sub">ESG & BRSR Reporting Platform</span>
          </div>
        </div>

        {/* Center: Large Glass Search Bar */}
        <div className="top-header-search">
          <button 
            type="button" 
            className="header-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open global search"
          >
            <Search size={16} color="#64748B" />
            <span>Search projects, data, submissions, evidence...</span>
            <kbd className="header-search-shortcut">Ctrl K</kbd>
          </button>
        </div>

        {/* Right: Notifications, Help, User Profile */}
        <div className="top-header-right">
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button 
              type="button" 
              className="header-icon-btn" 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="header-badge-count">3</span>
            </button>

            {isNotificationsOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '320px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                borderRadius: '16px',
                boxShadow: '0 12px 32px rgba(37, 99, 235, 0.12)',
                padding: '16px',
                zIndex: 100
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>Notifications</span>
                  <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600', cursor: 'pointer' }}>Mark all read</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', padding: '8px', background: 'rgba(234, 244, 255, 0.5)', borderRadius: '10px' }}>
                    <AlertTriangle size={16} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A' }}>Correction Requested on Waste Data</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>BU Reviewer highlighted hazardous segregation variance.</div>
                      <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>1 day ago</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', padding: '8px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '10px' }}>
                    <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A' }}>Water Data Validated</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>System completed automated variance benchmark.</div>
                      <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>5 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Popover */}
          <div style={{ position: 'relative' }} ref={helpRef}>
            <button 
              type="button" 
              className="header-icon-btn" 
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              title="Help & BRSR Standards"
              aria-label="Help"
            >
              <HelpCircle size={18} />
            </button>

            {isHelpOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '280px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                borderRadius: '16px',
                boxShadow: '0 12px 32px rgba(37, 99, 235, 0.12)',
                padding: '16px',
                zIndex: 100
              }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                  MEIL ESG Guidance
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.4', marginBottom: '12px' }}>
                  Adheres to SEBI BRSR Circulars (2021, 2023, 2025) and CEA India Grid Baseline v19 (0.716 kg CO₂e/kWh).
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <a href="#handbook" style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <ExternalLink size={12} /> SEBI BRSR Indicator Reference
                  </a>
                  <a href="#support" style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <ExternalLink size={12} /> Site Officer Data Entry Guide
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="header-brand-divider" style={{ height: '24px' }} />

          {/* User Profile Pill & Dropdown */}
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button 
              type="button" 
              className="header-user-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User profile options"
            >
              <img 
                src={user.avatar || (role?.id === 'HR_OFFICER' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces' : '/avatar_rohit.jpg')} 
                alt={user.name} 
                className="header-user-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/avatar_rohit.jpg';
                }}
              />
              <div className="header-user-info">
                <span className="header-user-name">{user.name || 'Rohit Kumar'}</span>
                <span className="header-user-role">{role?.title || 'Project / Site User'}</span>
              </div>
              <ChevronDown size={14} color="#64748B" style={{ marginLeft: '4px' }} />
            </button>

            {isUserMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '270px',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                borderRadius: '16px',
                boxShadow: '0 16px 40px rgba(30, 90, 160, 0.12)',
                padding: '10px',
                zIndex: 100
              }}>
                <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{user.email}</div>
                  <div style={{
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontWeight: '700',
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563EB',
                    border: '1px solid rgba(37, 99, 235, 0.2)'
                  }}>
                    ● {role?.title || 'Project Officer'}
                  </div>
                </div>

                {/* Strict Role-Based Access Control Notice */}
                <div style={{ padding: '10px 8px', borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px'
                  }}>
                    <Shield size={13} color="#059669" />
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      RBAC Security Locked
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
                    You are authenticated strictly for <strong>{role?.title || 'Current Role'}</strong>. Cross-department portal hopping is restricted under SEBI statutory audit governance.
                  </div>
                </div>

                <div style={{ padding: '6px 0 2px 0' }}>
                  <button 
                    type="button"
                    onClick={onLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '11.5px',
                      color: '#DC2626',
                      fontWeight: '700',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(254, 242, 242, 0.8)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={13} color="#DC2626" />
                    <span>Sign Out & Switch User</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Interactive Search Modal (Ctrl + K) */}
      {isSearchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.25)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '12vh'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsSearchOpen(false);
        }}
        >
          <div style={{
            width: '100%',
            maxWidth: '620px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 24px 60px rgba(37, 99, 235, 0.16)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              gap: '12px'
            }}>
              <Search size={20} color="#2563EB" />
              <input 
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, ESG parameters, evidence files, BRSR questions..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  color: '#0F172A',
                  fontWeight: '500'
                }}
              />
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px 16px', maxHeight: '360px', overflowY: 'auto' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {searchQuery ? 'Search Results' : 'Suggested Suggestions'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {searchResults.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        setIsSearchOpen(false);
                        if (item.type === 'Data') onNavigateTab?.('data-entry');
                        else if (item.type === 'Evidence') onNavigateTab?.('evidence');
                        else if (item.type === 'Project') onNavigateTab?.('overview');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'rgba(248, 250, 252, 0.7)',
                        border: '1px solid rgba(226, 232, 240, 0.6)',
                        cursor: 'pointer',
                        transition: 'all 160ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(234, 244, 255, 0.8)';
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(248, 250, 252, 0.7)';
                        e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.6)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9px',
                          background: 'rgba(37, 99, 235, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2563EB'
                        }}>
                          <IconComp size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>{item.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{item.meta}</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(226, 232, 240, 0.6)',
                        color: '#475569'
                      }}>
                        {item.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              padding: '10px 18px',
              background: 'rgba(248, 250, 252, 0.8)',
              borderTop: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#64748B'
            }}>
              <span>Press <kbd style={{ padding: '1px 4px', background: '#E2E8F0', borderRadius: '4px' }}>ESC</kbd> to exit</span>
              <span>Use arrow keys to navigate</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
