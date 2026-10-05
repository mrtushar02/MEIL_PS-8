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
  ShieldCheck
} from 'lucide-react';

export default function ValueChainScopeScreen({ onNavigateTab }) {
  const kpis = [
    { label: 'Suppliers in Scope', value: '412', icon: Users, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)' },
    { label: 'Suppliers Assessed', value: '312', icon: CheckCircle2, color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
    { label: 'Coverage', value: '76%', icon: ShieldCheck, color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)' },
    { label: 'High-Risk Suppliers', value: '18', icon: AlertTriangle, color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)' },
    { label: 'Scope Spend', value: '₹186.4 Cr', icon: TrendingUp, color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)' },
    { label: 'Local / MSME', value: '38%', icon: MapPin, color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)' }
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
            onClick={() => alert('Open Value Chain Scope Configuration (Top 75% spend criteria as per SEBI BRSR Core)')}
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
              onClick={() => alert('Opening Interactive Multi-Tier Supply Network Visualization')}
            >
              <span>View Details</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
