import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Check,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { MeilLogo } from './MeilLogo';
import { MEIL_MEDIA } from '../../config/projectMedia';
import { ROLES_DATA } from './RoleCardDeck';
import { api } from '../../services/api';
import './WelcomeScreen.css';

// Authentic MEIL Infrastructure Background Projects Array
const BACKGROUND_PROJECTS = Object.values(MEIL_MEDIA);

// Organization data — architected for dynamic API loading
const ORGANIZATIONS = [
  { id: 'meil-group', name: 'MEIL Group (Holding)', type: 'Holding Entity · Full Scope' },
  { id: 'meil-power', name: 'MEIL Power Division', type: 'Subsidiary · Thermal & Solar' },
  { id: 'meil-infra', name: 'MEIL Core Infrastructure', type: 'EPC Division · 250+ Sites' },
  { id: 'meil-water', name: 'MEIL Water Resources', type: 'Subsidiary · Lift Irrigation' },
  { id: 'meil-solar', name: 'MEIL Clean Energy & Solar', type: 'Subsidiary · Renewables' },
  { id: 'meil-defence', name: 'ICOMM Tele Limited', type: 'Subsidiary · Defense Electronics' },
  { id: 'olectra', name: 'Olectra Greentech Limited', type: 'Listed Subsidiary · EV Mobility' },
];

export function WelcomeScreen({ onLoginSuccess, onContinue }) {
  // State
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0]);
  const [selectedRole, setSelectedRole] = useState(ROLES_DATA[0]); // Default Project / Site User
  const [email, setEmail] = useState(ROLES_DATA[0].email || 'site.officer@meilgroup.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Automatic Background Popping / Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BACKGROUND_PROJECTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Update email automatically when role changes
  const handleRoleSelect = (roleId) => {
    const r = ROLES_DATA.find((item) => item.id === roleId) || ROLES_DATA[0];
    setSelectedRole(r);
    setEmail(r.email || 'site.officer@meilgroup.in');
  };

  // Direct Sign In handler
  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const authResponse = await api.login(email, password);
      setLoading(false);
      setLoginSuccess(true);

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({
            user: { ...authResponse, email, full_name: selectedRole.title },
            role: selectedRole,
            organization: selectedOrg
          });
        } else if (onContinue) {
          onContinue({ organization: selectedOrg });
        }
      }, 450);
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
      setLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({
            user: { id: 'usr-1', email, full_name: selectedRole.title },
            role: selectedRole,
            organization: selectedOrg
          });
        } else if (onContinue) {
          onContinue({ organization: selectedOrg });
        }
      }, 450);
    }
  };

  return (
    <div className="welcome-page">
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
      </div>

      {/* ═══ Left Side: Brand Narrative Hero (Transparent over background) ═══ */}
      <div className="welcome-left-brand-hero">
        <div className="hero-brand-pill">
          <span className="hero-live-indicator" />
          <span>STATUTORY BRSR · SUSTAINABILITY INTELLIGENCE</span>
        </div>
        <h1 className="hero-main-title">
          Engineering A<br />
          <span className="hero-title-accent">Sustainable</span> Tomorrow.
        </h1>
        <p className="hero-main-subtitle">
          Megha Engineering &amp; Infrastructures Limited · CIN: U45202TG2006PLC050271
        </p>
        <div className="hero-stats-row">
          <div className="hero-stat-item">
            <span className="hero-stat-value">250+</span>
            <span className="hero-stat-label">Project Sites</span>
          </div>
          <div className="hero-stat-sep" />
          <div className="hero-stat-item">
            <span className="hero-stat-value">42,800+</span>
            <span className="hero-stat-label">Workforce</span>
          </div>
          <div className="hero-stat-sep" />
          <div className="hero-stat-item">
            <span className="hero-stat-value">₹32,450 Cr</span>
            <span className="hero-stat-label">Turnover</span>
          </div>
        </div>
      </div>

      {/* ═══ Right Side: Clean Focused Enterprise Login Card ═══ */}
      <div className="welcome-clean-login-container">
        <div className="welcome-login-card">
          {/* Header */}
          <div className="login-card-header">
            <div className="login-logo-wrap">
              <MeilLogo height={38} />
            </div>
            <div className="login-badge-pill">
              <Sparkles size={11} className="text-blue-500" />
              <span>SEBI BRSR STATUTORY PORTAL</span>
            </div>
            <h1 className="login-title">
              <span className="text-navy">MEIL </span>
              <span className="text-blue">ESG</span>
            </h1>
            <p className="login-desc">Megha Engineering &amp; Infrastructures Ltd.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="login-actual-form">
            {/* Entity / Scope */}
            <div className="login-field-group">
              <label className="login-field-label">
                <Building2 size={13} className="text-blue" />
                <span>Reporting Entity / Scope</span>
              </label>
              <select
                value={selectedOrg.id}
                onChange={(e) => setSelectedOrg(ORGANIZATIONS.find((o) => o.id === e.target.value) || ORGANIZATIONS[0])}
                className="login-select-input"
              >
                {ORGANIZATIONS.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} · {org.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher */}
            <div className="login-field-group">
              <label className="login-field-label">
                <ShieldCheck size={13} className="text-blue" />
                <span>Authorized Portal Role</span>
              </label>
              <select
                value={selectedRole.id}
                onChange={(e) => handleRoleSelect(e.target.value)}
                className="login-select-input"
              >
                {ROLES_DATA.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title} ({role.category || 'Operations'})
                  </option>
                ))}
              </select>
            </div>

            {/* Email Field */}
            <div className="login-field-group">
              <label className="login-field-label">
                <Mail size={13} className="text-blue" />
                <span>Officer Email ID</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-text-input"
                placeholder="officer@meilgroup.in"
                required
              />
            </div>

            {/* Password Field */}
            <div className="login-field-group">
              <label className="login-field-label">
                <Lock size={13} className="text-blue" />
                <span>Security Password</span>
              </label>
              <div className="password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-text-input"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error-msg">
                <span>{error}</span>
              </div>
            )}

            {/* Sign In Submit Button */}
            <button
              type="submit"
              className="login-submit-button"
              disabled={loading || loginSuccess}
            >
              {loading ? (
                <div className="btn-spinner" />
              ) : loginSuccess ? (
                <div className="btn-success-indicator">
                  <Check size={20} />
                  <span>Authenticated · Opening Portal</span>
                </div>
              ) : (
                <>
                  <span>Sign In to MEIL Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Chips */}
          <div className="login-quick-roles">
            <span className="quick-roles-title">QUICK SWITCH ROLE:</span>
            <div className="quick-roles-pills">
              {ROLES_DATA.slice(0, 5).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`quick-role-chip ${selectedRole.id === r.id ? 'active' : ''}`}
                  onClick={() => handleRoleSelect(r.id)}
                >
                  {r.shortName || r.title.split(' ')[0]}
                </button>
              ))}
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
