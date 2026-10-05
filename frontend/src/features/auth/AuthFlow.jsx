import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import RoleCardDeck, { ROLES_DATA } from './RoleCardDeck';
import RoleLoginPanel from './RoleLoginPanel';
import MeilLogo from './MeilLogo';
import './AuthFlow.css';

/**
 * AuthFlow — Enterprise Multi-Stage Authentication & Role Experience
 * ──────────────────────────────────────────────────────────────────
 * Stage 1: WelcomeScreen (Organization Entry)
 * Stage 2: RoleCardDeck (Choose Your Role - Stacked to Horizontal Deck)
 * Stage 3: Particle Dissolve & Landscape Card Morph
 * Stage 4: RoleLoginPanel (Landscape Credentials Panel with Profile & SSO)
 * Reverse: Change Role reconstructs the deck seamlessly
 */
export function AuthFlow({ onLoginSuccess }) {
  // Stages: 'WELCOME' | 'CHOOSE_ROLE' | 'ROLE_SELECTED' | 'LOGIN_PANEL' | 'RECONSTRUCTING'
  const [stage, setStage] = useState('WELCOME');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedRole, setSelectedRole] = useState(ROLES_DATA[2]); // Default EHS / Safety
  const [particles, setParticles] = useState([]);
  const [isReconstructing, setIsReconstructing] = useState(false);

  // ── Welcome Screen -> Choose Role ──
  const handleWelcomeContinue = ({ organization }) => {
    setSelectedOrg(organization);
    setStage('CHOOSE_ROLE');
  };

  // ── Role Selected -> Particle Dissolve -> Card Morph -> Login Panel ──
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setStage('ROLE_SELECTED');

    // Generate 60 elegant translucent glass particles scattering outward and upward
    const newParticles = Array.from({ length: 64 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 64 + (Math.random() - 0.5) * 0.4;
      const distance = Math.random() * 320 + 120;
      return {
        id: i,
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 260,
        dx: `${Math.cos(angle) * distance}px`,
        dy: `${Math.sin(angle) * distance - 40}px`, // slight upward drift
        size: Math.random() * 7 + 3,
        opacity: Math.random() * 0.6 + 0.3,
        delay: Math.random() * 120,
      };
    });
    setParticles(newParticles);

    // After 750ms of particle dissolution and centering morph, render the landscape login panel
    setTimeout(() => {
      setStage('LOGIN_PANEL');
      setParticles([]);
    }, 750);
  };

  // ── Return to Role Selection (Reverse Reconstruction) ──
  const handleChangeRole = () => {
    setIsReconstructing(true);
    setStage('RECONSTRUCTING');

    // Generate reverse converging particles
    const reconstructParticles = Array.from({ length: 48 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 48;
      const distance = Math.random() * 260 + 80;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        dx: `0px`,
        dy: `0px`,
        size: Math.random() * 6 + 3,
        opacity: Math.random() * 0.5 + 0.3,
        delay: Math.random() * 100,
      };
    });
    setParticles(reconstructParticles);

    setTimeout(() => {
      setStage('CHOOSE_ROLE');
      setIsReconstructing(false);
      setParticles([]);
    }, 600);
  };

  return (
    <div className="auth-flow-root" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* ════════════ STAGE 1: WELCOME SCREEN ════════════ */}
      {stage === 'WELCOME' && (
        <WelcomeScreen onContinue={handleWelcomeContinue} />
      )}

      {/* ════════════ STAGES 2, 3 & 4: ROLE SELECTION & LOGIN ════════════ */}
      {stage !== 'WELCOME' && (
        <div className="auth-stage-container">
          {/* Atmospheric Background Layer: White Dominant (85-92%) + Soft Blue (8-15%) */}
          <div className="atmospheric-layer">
            <div className="ambient-light ambient-light-1" />
            <div className="ambient-light ambient-light-2" />
            <div className="ambient-glass-orb orb-1" />
            <div className="ambient-glass-orb orb-3" />
            <div className="ambient-glass-orb orb-5" />
            {/* Cursor following soft illumination */}
            <div className="cursor-ambient-glow" />
          </div>

          {/* Official MEIL Minimal Header */}
          <header className="auth-header-fixed">
            <MeilLogo height={38} />
            <div className="meil-tagline-group">
              <span className="meil-tagline-title">Engineering</span>
              <span className="meil-tagline-sub">A Sustainable Tomorrow</span>
            </div>
          </header>

          {/* Glass Dissolution / Reconstruction Particle Burst */}
          {particles.length > 0 && (
            <div className="morph-particle-layer">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className={`glass-dissolve-particle ${isReconstructing ? 'reconstructing' : ''}`}
                  style={{
                    top: '50%',
                    left: '50%',
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    transform: `translate(${p.x}px, ${p.y}px)`,
                    '--dx': p.dx,
                    '--dy': p.dy,
                    opacity: p.opacity,
                    animationDelay: `${p.delay}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Stage: Choose Role (Stacked or Horizontal Alignment) */}
          {(stage === 'CHOOSE_ROLE' || stage === 'ROLE_SELECTED' || stage === 'RECONSTRUCTING') && (
            <RoleCardDeck
              selectedOrg={selectedOrg}
              onSelectRole={handleSelectRole}
              isDissolving={stage === 'ROLE_SELECTED'}
              selectedRoleId={selectedRole?.id}
              animationState={stage === 'RECONSTRUCTING' ? 'HORIZONTAL_BROWSE' : 'IDLE_STACK'}
            />
          )}

          {/* Stage: Selected Role Landscape Login Panel (Frame 6) */}
          {stage === 'LOGIN_PANEL' && (
            <RoleLoginPanel
              selectedRole={selectedRole}
              onChangeRole={handleChangeRole}
              onLoginSuccess={onLoginSuccess}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default AuthFlow;
