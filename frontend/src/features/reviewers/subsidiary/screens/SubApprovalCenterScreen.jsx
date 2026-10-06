import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import api from '../../../../services/api';

export default function SubApprovalCenterScreen({ onApproveEntirePackage }) {
  const [approving, setApproving] = useState(false);
  const [approvedState, setApprovedState] = useState(false);

  const buApprovalMap = [
    { name: 'Tunnels Business Unit', status: 'Approved', class: 'sub-badge-success', coordinator: 'R. K. Sharma' },
    { name: 'Water Business Unit', status: 'Pending', class: 'sub-badge-warning', coordinator: 'P. Venkat' },
    { name: 'Energy Business Unit', status: 'Approved', class: 'sub-badge-success', coordinator: 'S. K. Rao' },
    { name: 'Infrastructure Business Unit', status: 'Correction', class: 'sub-badge-danger', coordinator: 'M. Deshmukh' },
    { name: 'Metro Business Unit', status: 'Approved', class: 'sub-badge-success', coordinator: 'A. Verma' },
    { name: 'Expressway Business Unit', status: 'Approved', class: 'sub-badge-success', coordinator: 'V. Joshi' }
  ];

  const handleApproveSubsidiary = async () => {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      setApprovedState(true);
      if (onApproveEntirePackage) onApproveEntirePackage();
    }, 1000);
  };

  return (
    <div className="sub-approval-center-screen">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Left: Subsidiary Approval Progress Stepper */}
        <div className="sub-card">
          <div className="sub-card-header">
            <div>
              <h3 className="sub-card-title">Subsidiary Approval Status</h3>
              <p className="sub-card-subtitle">Division signoff lifecycle for MEIL Core Infrastructure</p>
            </div>
            <span className="sub-badge-purple">Stage 2 of 4</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                ✓
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>
                  Business Units Review
                </strong>
                <span style={{ fontSize: '12px', color: '#64748B' }}>5 of 6 Business Units approved</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEF3C7', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                2
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>
                  Subsidiary Consolidation
                </strong>
                <span style={{ fontSize: '12px', color: '#64748B' }}>In Progress (Carbon & Energy rollup complete)</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                3
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>
                  BRSR Core Validation
                </strong>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Awaiting full division clearance</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                4
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>
                  Group Submission
                </strong>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Final forward to Group CSO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: BU Approval Map */}
        <div className="sub-card">
          <div className="sub-card-header">
            <div>
              <h3 className="sub-card-title">BU Approval Map</h3>
              <p className="sub-card-subtitle">Status of constituent Business Unit packages</p>
            </div>
            <Building2 size={18} color="#7C3AED" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {buApprovalMap.map(bu => (
              <div
                key={bu.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block' }}>
                    {bu.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Lead: {bu.coordinator}</span>
                </div>
                <span className={bu.class} style={{ fontSize: '11px' }}>
                  {bu.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Approval Action Bar (Matching Screen 6) */}
      <div
        className="sub-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%)',
          border: '1.5px solid #E9D5FF'
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            Approve Entire Subsidiary Package
          </h4>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Promotes consolidated division reporting package to Group Executive & CSO review.
          </span>
        </div>

        <button
          className="sub-btn sub-btn-primary"
          style={{ padding: '10px 24px', fontSize: '13px' }}
          onClick={handleApproveSubsidiary}
          disabled={approving || approvedState}
        >
          {approvedState ? (
            <>
              <CheckCircle2 size={16} />
              <span>Subsidiary Approved & Forwarded</span>
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>{approving ? 'Attesting Division...' : 'Approve Subsidiary Package'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
