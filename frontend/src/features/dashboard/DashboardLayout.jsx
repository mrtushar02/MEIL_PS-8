import React from 'react';
import {
  Building2,
  Calendar,
  Bell,
  LogOut,
  Layers,
  FileText,
  UploadCloud,
  BarChart3,
  Clock
} from 'lucide-react';
import GlassCard from '../../components/glass/GlassCard';
import GlassBadge from '../../components/glass/GlassBadge';

export function DashboardLayout({
  user,
  role,
  activeTab,
  onTabChange,
  onLogout,
  reportingPeriod,
  onPeriodChange,
  children,
  utilityContent = null
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'data-entry', label: 'Data Entry', icon: FileText },
    { id: 'evidence', label: 'Evidence Library', icon: UploadCloud },
    { id: 'submissions', label: 'Submissions', icon: Layers },
    { id: 'audit', label: 'Audit Trail', icon: Clock }
  ];

  return (
    <div className="app-viewport">
      {/* ====================================================================
          TOP APPLICATION BAR (MASTER VISUAL REFERENCE)
          ==================================================================== */}
      <header style={{
        position: 'sticky',
        top: '16px',
        zIndex: 50,
        padding: '0 24px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-main)',
          boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          borderRadius: '18px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1440px',
          margin: '0 auto'
        }}>
          {/* Left: MEIL Brand & Hierarchy Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(23, 143, 224, 0.15) 0%, rgba(184, 221, 246, 0.3) 100%)',
              border: '1px solid rgba(23, 143, 224, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--blue-accent)'
            }}>
              <Building2 size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  MEIL Group
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>/</span>
                <span style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {role?.title || 'ESG Reporting Portal'}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                CIN: U45202TG2006PLC050271 • SEBI BRSR Core Active
              </div>
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(234, 244, 252, 0.65)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border-soft)'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '9px',
                    border: 'none',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? 'var(--blue-accent)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 2px 8px rgba(70, 110, 140, 0.08)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Reporting Period & Profile Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Period Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.85)',
              padding: '6px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-soft)',
              fontSize: '12.5px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              <Calendar size={14} color="var(--blue-accent)" />
              <span>{reportingPeriod || 'September 2025'}</span>
            </div>

            {/* Notification Bell */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid var(--border-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <Bell size={16} />
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--state-success)'
              }} />
            </div>

            {/* User Profile Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid var(--border-soft)',
              padding: '5px 12px 5px 6px',
              borderRadius: '24px'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: role?.color || 'var(--blue-accent)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'ME'}
              </div>
              <div style={{ lineHeight: '1.2' }}>
                <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user?.full_name || 'Site Officer'}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  {role?.badge || 'Operational'}
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Sign Out"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  marginLeft: '4px'
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MASTER COMPOSITION: 70% MAIN CONTENT REGION + 30% UTILITY REGION
          ==================================================================== */}
      <main style={{
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px 48px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 3fr)',
        gap: '24px',
        flexGrow: 1
      }}>
        {/* Main Content Area */}
        <section style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {children}
        </section>

        {/* Right Supporting Utility Panel */}
        <aside style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {utilityContent}
        </aside>
      </main>
    </div>
  );
}

export default DashboardLayout;
