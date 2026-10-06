import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Building2
} from 'lucide-react';
import { api } from '../../services/api';

export function RoleLoginPanel({ selectedRole, onChangeRole, onLoginSuccess }) {
  const [email, setEmail] = useState(selectedRole.email || 'officer@meilgroup.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showHelpdesk, setShowHelpdesk] = useState(false);

  const IllustrationComp = selectedRole.illustration;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const authResponse = await api.login(email, password);
      setLoading(false);
      setLoginSuccess(true);

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({
            user: authResponse,
            role: selectedRole,
          });
        }
      }, 600);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="role-login-panel-container">
      {/* ──── LEFT COLUMN: Selected Role Profile & Capabilities ──── */}
      <div className="role-identity-col">
        {/* Floating Profile Illustration (No background box) */}
        <div className="login-panel-illustration-wrap">
          {IllustrationComp ? (
            <IllustrationComp isHovered={true} isSelected={true} />
          ) : (
            <div className="role-identity-cushion-badge">
              <Building2 size={38} color={selectedRole.color} />
            </div>
          )}
        </div>

        {/* Role Identity Details */}
        <div className="role-identity-profile">
          <h2 className="role-identity-name">{selectedRole.title}</h2>
          <p className="role-identity-desc">{selectedRole.desc}</p>
        </div>

        {/* 4 Role Capabilities with Supporting Icons */}
        <div className="role-capabilities-list">
          {selectedRole.capabilities &&
            selectedRole.capabilities.map((cap, i) => {
              const CapIcon = cap.icon;
              return (
                <div key={i} className="role-cap-item">
                  <div className="role-cap-icon">
                    <CapIcon size={13} color={selectedRole.color} />
                  </div>
                  <span>{cap.label}</span>
                </div>
              );
            })}
        </div>

        {/* Change Role Button (Reverses Animation to Deck) */}
        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <button
            className="change-role-btn"
            onClick={onChangeRole}
            type="button"
            aria-label="Back to role selection"
          >
            <ArrowLeft size={14} />
            <span>Change Role</span>
          </button>
        </div>
      </div>

      {/* ──── RIGHT COLUMN: Enterprise Credentials & Sign In ──── */}
      <div className="role-login-form-col">
        <h1 className="login-heading">
          Welcome <span className="highlight-blue">Back</span>
        </h1>
        <p className="login-subheading">Sign in to your MEIL ESG account</p>

        {/* Error notification */}
        {error && (
          <div className="login-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="login-form-body">
          {/* Email / Username Input */}
          <div className="login-input-group">
            <div className="login-input-box">
              <Mail size={17} className="login-input-icon" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="login-input-group">
            <div className="login-input-box">
              <Lock size={17} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Options: Remember me & Forgot Password */}
          <div className="login-options-row">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-me-checkbox"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setShowHelpdesk(!showHelpdesk)}
            >
              Forgot password?
            </button>
          </div>

          {showHelpdesk && (
            <div style={{ margin: '-6px 0 12px', padding: '10px 14px', background: 'rgba(37,99,235,0.08)', borderRadius: '8px', fontSize: '11.5px', color: '#1D4ED8', lineHeight: 1.4, border: '1px solid rgba(37,99,235,0.18)' }}>
              <strong>MEIL Enterprise IT Helpdesk:</strong> Contact <code>it.helpdesk@meilgroup.in</code> or dial ext. 4401 to reset your SSO credentials.
            </div>
          )}

          {/* Submit Sign In Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="btn-spinner" />
            ) : loginSuccess ? (
              <>
                <Check size={18} />
                <span>Verified</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Secure Portal Footer */}
        <div style={{ marginTop: '22px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
            Protected by MEIL Enterprise Multi-Factor Authentication
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoleLoginPanel;
