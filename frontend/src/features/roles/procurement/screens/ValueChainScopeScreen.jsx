import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Settings,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  X,
  Sliders,
  Network
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function ValueChainScopeScreen({ 
  onNavigateTab,
  suppliers = [],
  transactions = []
}) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [spendThreshold, setSpendThreshold] = useState('75'); // SEBI BRSR default
  const [includeTier2, setIncludeTier2] = useState(true);
  const [msmeExemption, setMsmeExemption] = useState(false);

  const totalInScope = suppliers.length > 0 ? suppliers.length : 412;
  const assessedCount = suppliers.length > 0 ? suppliers.filter(s => s.esgScore || s.esgAssessed || s.status === 'Assessed').length : 312;
  const coveragePct = Math.round((assessedCount / totalInScope) * 100);
  const highRiskCount = suppliers.length > 0 ? suppliers.filter(s => s.riskLevel === 'High' || s.risk === 'High').length : 18;
  const totalSpendNum = transactions.length > 0 
    ? transactions.reduce((acc, t) => acc + (parseFloat(t.amount || t.value || t.spend || 0) || 0), 0)
    : 0;
  const spendDisplay = totalSpendNum > 0 ? `₹${(totalSpendNum / 10000000).toFixed(1)} Cr` : '₹186.4 Cr';
  const localMsmePct = suppliers.length > 0
    ? Math.round((suppliers.filter(s => s.isLocal || s.isMsme || s.tier === 'Tier 3').length / totalInScope) * 100)
    : 38;

  const kpis = [
    { label: 'Suppliers in Scope', value: String(totalInScope), icon: Users, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)' },
    { label: 'Suppliers Assessed', value: String(assessedCount), icon: CheckCircle2, color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
    { label: 'Coverage', value: `${coveragePct}%`, icon: ShieldCheck, color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)' },
    { label: 'High-Risk Suppliers', value: String(highRiskCount), icon: AlertTriangle, color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)' },
    { label: 'Scope Spend', value: spendDisplay, icon: TrendingUp, color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)' },
    { label: 'Local / MSME', value: `${localMsmePct}%`, icon: MapPin, color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)' }
  ];

  const categoryCoverage = [
    { label: 'Materials', pct: 82, color: '#2563EB' },
    { label: 'Services', pct: 68, color: '#0EA5E9' },
    { label: 'Civil', pct: 76, color: '#10B981' },
    { label: 'Electrical', pct: 62, color: '#F59E0B' },
    { label: 'Equipment', pct: 70, color: '#8B5CF6' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Top Action Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Value Chain & Scope
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Track supplier coverage and value chain ESG participation.
            </p>
          </div>

          <button
            type="button"
            className="proc-btn proc-btn-blue"
            onClick={() => setIsConfigOpen(true)}
            style={{ padding: '7px 14px', fontSize: '12.5px' }}
          >
            <Settings size={15} />
            <span>Configure Scope</span>
          </button>
        </div>
      </div>

      {/* ──── 6 KPI Cards Grid ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {kpis.map((k, i) => {
          const IconComp = k.icon;
          return (
            <div key={i} className="proc-kpi-card">
              <div className="proc-kpi-top">
                <span className="proc-kpi-label" style={{ fontSize: '10.5px' }}>{k.label}</span>
                <div className="proc-kpi-icon-pill" style={{ background: k.bg, color: k.color }}>
                  <IconComp size={14} />
                </div>
              </div>
              <span className="proc-kpi-value" style={{ fontSize: '24px' }}>{k.value}</span>
            </div>
          );
        })}
      </div>

      {/* ──── Bottom 3 Panels (Tiers, Coverage, Map) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.3fr', gap: '14px' }}>
        
        {/* Panel 1: Suppliers by Tier */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '16px' }}>
            <div>
              <div className="proc-glass-card-title">Suppliers by Tier</div>
              <div className="proc-glass-card-subtitle">Supply chain depth analysis</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '160px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#2563EB' }}>186</span>
              <div style={{ width: '42px', height: '110px', background: '#2563EB', borderRadius: '6px 6px 0 0' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Tier 1</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0EA5E9' }}>148</span>
              <div style={{ width: '42px', height: '88px', background: '#0EA5E9', borderRadius: '6px 6px 0 0' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Tier 2</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#64748B' }}>78</span>
              <div style={{ width: '42px', height: '48px', background: '#94A3B8', borderRadius: '6px 6px 0 0' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Tier 3</span>
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '11px', color: '#64748B', textAlign: 'center' }}>
            Total value chain participants: <strong>412 partners</strong>
          </div>
        </div>

        {/* Panel 2: Coverage by Category */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '16px' }}>
            <div>
              <div className="proc-glass-card-title">Coverage by Category</div>
              <div className="proc-glass-card-subtitle">BRSR Core assessment completion %</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categoryCoverage.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>{cat.label}</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{cat.pct}%</span>
                </div>
                <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${cat.pct}%`,
                      background: cat.color,
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Value Chain Map */}
        <div className="proc-glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="proc-glass-card-header" style={{ marginBottom: '16px' }}>
            <div>
              <div className="proc-glass-card-title">Value Chain Map</div>
              <div className="proc-glass-card-subtitle">Tier cascading flow & transparency</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.06)', border: '1px solid rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>Tier 1 Direct Suppliers</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>186 vendors • 75% group spend</div>
              </div>
              <span className="proc-status-chip active">82% Verified</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ArrowRight size={14} color="#94A3B8" style={{ transform: 'rotate(90deg)' }} />
            </div>

            <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.06)', border: '1px solid rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>Tier 2 SME Suppliers</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>148 vendors • Sub-contractors</div>
              </div>
              <span className="proc-status-chip pending">68% Verified</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ArrowRight size={14} color="#94A3B8" style={{ transform: 'rotate(90deg)' }} />
            </div>

            <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(100, 116, 139, 0.06)', border: '1px solid rgba(100, 116, 139, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>Tier 3 Raw Suppliers</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>78 vendors • Extractive & quarry</div>
              </div>
              <span className="proc-status-chip not-started">44% Verified</span>
            </div>

            <button
              type="button"
              className="proc-btn proc-btn-outline"
              style={{ width: '100%', justifyContent: 'center', marginTop: '6px', fontSize: '12px', padding: '7px' }}
              onClick={() => setIsNetworkModalOpen(true)}
            >
              <span>View Details</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

      </div>

      {/* Scope Configuration Modal */}
      {isConfigOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsConfigOpen(false)}
        >
          <div
            className="proc-glass-card"
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={20} color="#2563EB" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  BRSR Core Scope Configuration
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Value Chain Spend Cut-Off Threshold (%)
                </label>
                <select
                  value={spendThreshold}
                  onChange={(e) => setSpendThreshold(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="75">Top 75% of Procurement Spend (SEBI BRSR Core Mandate)</option>
                  <option value="80">Top 80% (Enhanced Group Transparency)</option>
                  <option value="90">Top 90% (Comprehensive Assurance)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  id="tier2toggle"
                  checked={includeTier2}
                  onChange={(e) => setIncludeTier2(e.target.checked)}
                />
                <label htmlFor="tier2toggle" style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600, cursor: 'pointer' }}>
                  Include Tier 2 Sub-contractors in ESG Assurance
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  id="msmetoggle"
                  checked={msmeExemption}
                  onChange={(e) => setMsmeExemption(e.target.checked)}
                />
                <label htmlFor="msmetoggle" style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600, cursor: 'pointer' }}>
                  Apply Micro & Small Enterprise (MSE) Reporting Grace Period
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="proc-btn proc-btn-outline"
                  onClick={() => setIsConfigOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="proc-btn proc-btn-blue"
                  onClick={() => setIsConfigOpen(false)}
                >
                  Apply & Recalculate Scope
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Details Modal */}
      {isNetworkModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsNetworkModalOpen(false)}
        >
          <div
            className="proc-glass-card"
            style={{
              width: '100%',
              maxWidth: '620px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network size={22} color="#2563EB" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Value Chain Supply Network Map
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNetworkModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
              <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                <div style={{ fontWeight: 800, color: '#2563EB', marginBottom: '4px' }}>Tier 1: 186 Strategic Direct Vendors</div>
                <div style={{ color: '#475569' }}>Represents ₹186.4 Cr spend (75% threshold). Directly audited for Scope 1 & 2 emissions and human rights compliance under SEBI Circular 2023.</div>
              </div>
              <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                <div style={{ fontWeight: 800, color: '#0EA5E9', marginBottom: '4px' }}>Tier 2: 148 Sub-Contractors & Specialized Fabricators</div>
                <div style={{ color: '#475569' }}>Engaged across MEIL's 258+ project sites for mechanical erection, civil earthworks, and pipeline welding.</div>
              </div>
              <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                <div style={{ fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>Tier 3: 78 Primary Material & Quarry Sources</div>
                <div style={{ color: '#475569' }}>Raw aggregate, sand, cement clinker, and steel billets tracked for legal mining concessions and zero child labor certifications.</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                className="proc-btn proc-btn-outline"
                onClick={() => setIsNetworkModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="proc-btn proc-btn-blue"
                onClick={() => {
                  exportToCsv('MEIL_Value_Chain_Network_Report.csv', [
                    { Tier: 'Tier 1', Vendors: 186, Spend_Cr: 186.4, Assurance: '82% Audited' },
                    { Tier: 'Tier 2', Vendors: 148, Spend_Cr: 42.1, Assurance: '68% Audited' },
                    { Tier: 'Tier 3', Vendors: 78, Spend_Cr: 20.1, Assurance: '44% Audited' }
                  ]);
                  setIsNetworkModalOpen(false);
                }}
              >
                Export Network CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
