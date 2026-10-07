import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, CheckCircle2, AlertCircle, FileText, KeyRound, Award } from 'lucide-react';
import { esgStore } from '../../../../services/esgStore';

export default function GroupFinalApprovalLockScreen() {
  const [isLocked, setIsLocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [digitalPin, setDigitalPin] = useState('');

  const tiers = [
    { tier: 'Tier-4 Project Sites', actors: '258 Site ESG Officers', status: 'Completed', count: '258 / 258 Signed', time: '26 Oct 2024' },
    { tier: 'Tier-3 Business Units', actors: '36 BU Coordinators', status: 'Completed', count: '36 / 36 Signed', time: '27 Oct 2024' },
    { tier: 'Tier-2 Subsidiaries', actors: '6 Subsidiary Heads', status: 'Completed', count: '6 / 6 Signed', time: '28 Oct 2024' },
    { tier: 'Tier-1 Group Corporate', actors: 'Group CSO (Dr. Rajeshwar Rao)', status: isLocked ? 'Locked & Sealed' : 'Ready for Group Lock', count: isLocked ? '1 / 1 Sealed' : 'Awaiting Seal', time: isLocked ? 'Just Now' : 'Pending Action' }
  ];

  const handleLock = () => {
    try {
      if (esgStore && esgStore.addAuditLog) {
        esgStore.addAuditLog({
          action: 'GROUP_PERIOD_LOCKED_AND_SEALED',
          entity: 'Group Statutory Reporting Period',
          entity_id: 'FY-2024-25-Q2',
          user: 'Group CSO (Dr. Rajeshwar Rao)',
          details: 'Locked reporting period across 258 project sites with SHA-256 statutory seal.'
        });
      }
    } catch (e) {
      console.warn(e);
    }
    setIsLocked(true);
    setShowModal(false);
  };

  return (
    <div className="group-final-lock-screen">
      {/* Top Banner */}
      <div className="group-card" style={{ marginBottom: '1.25rem', borderLeft: isLocked ? '6px solid #059669' : '6px solid #4338CA' }}>
        <div className="group-card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className={isLocked ? 'group-badge-success' : 'group-badge-indigo'}>
                {isLocked ? 'REPORTING PERIOD LOCKED' : 'READY FOR GROUP LOCK'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Period: FY 2024-25 Q2</span>
            </div>
            <h2 className="group-card-title">Group Statutory ESG Period Finalization & Lock</h2>
            <p className="group-card-subtitle">
              Locking this period prevents further data edits across all 258 project sites, establishes immutable cryptographic hashes, and releases the Board ESG dossier.
            </p>
          </div>
          <div>
            {!isLocked ? (
              <button className="group-btn-primary" onClick={() => setShowModal(true)}>
                <Lock size={16} /> Lock Reporting Period & Issue Pack
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="#059669" /> Sealed with SHA-256 Hash
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-Tier Sign-off Ladder */}
      <div className="group-card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="group-card-title" style={{ marginBottom: '1rem' }}>4-Tier Statutory Governance Sign-off Ladder</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {tiers.map((t, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: t.status.includes('Completed') || isLocked ? '#ECFDF5' : '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {t.status.includes('Completed') || isLocked ? (
                    <CheckCircle2 size={20} color="#059669" />
                  ) : (
                    <Lock size={18} color="#4338CA" />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{t.tier}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{t.actors}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>{t.count}</span>
                <span className={t.status.includes('Completed') || isLocked ? 'group-badge-success' : 'group-badge-indigo'}>
                  {t.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lock Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="group-card" style={{ maxWidth: '520px', width: '90%', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#EEF2FF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}>
                <Lock size={26} color="#4338CA" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Confirm Group Reporting Lock
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.4rem' }}>
                This action is legally binding under SEBI BRSR guidelines. All 258 project sites will be set to read-only mode for FY25 Q2.
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                Enter Digital Signature PIN / Auth Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={digitalPin}
                onChange={e => setDigitalPin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                  fontSize: '1rem',
                  textAlign: 'center',
                  letterSpacing: '0.2em'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="group-btn-outline" style={{ flex: 1, padding: '0.65rem' }} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="group-btn-primary" style={{ flex: 1, padding: '0.65rem' }} onClick={handleLock}>
                Confirm & Seal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
