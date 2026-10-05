import React from 'react';
import {
  Flame,
  Zap,
  Droplet,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import GlassCard from '../../components/glass/GlassCard';
import GlassKPI from '../../components/glass/GlassKPI';
import GlassBadge from '../../components/glass/GlassBadge';
import GlassButton from '../../components/glass/GlassButton';

export function ProjectDashboard({ onNavigateToDataEntry, onNavigateToEvidence }) {
  // Sample operational trend data for SVG visualization
  const trendData = [
    { month: 'Jun', scope1: 820, scope2: 510 },
    { month: 'Jul', scope1: 940, scope2: 580 },
    { month: 'Aug', scope1: 990, scope2: 610 },
    { month: 'Sep', scope1: 1029, scope2: 644 },
  ];

  return (
    <>
      {/* 1. Project Site Context Banner */}
      <GlassCard level={2} style={{ padding: '22px 26px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <GlassBadge status="success">Operational Site</GlassBadge>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Code: SITE-KALES-01</span>
            </div>

            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              fontFamily: 'var(--font-heading)'
            }}>
              Gayatri Pumphouse — Kaleshwaram Lift Irrigation
            </h2>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '8px',
              fontSize: '12.5px',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="var(--blue-accent)" />
                Medaram, Jayashankar Bhupalpally, Telangana
              </span>
              <span>•</span>
              <span>Civil & Electromechanical Division</span>
              <span>•</span>
              <span>Director: V. R. Krishna Murthy</span>
            </div>
          </div>

          <GlassButton variant="primary" size="md" onClick={onNavigateToDataEntry} icon={ArrowUpRight}>
            Log Monthly Metrics
          </GlassButton>
        </div>
      </GlassCard>

      {/* 2. Key Performance Indicators (Scope 1, 2, Water, Safety) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        <GlassKPI
          title="Scope 1 Direct GHG"
          value="1,029.1"
          unit="tCO₂e"
          trend={{ direction: 'up', value: '3.9%', text: 'vs Aug' }}
          icon={Flame}
          subtitle="Diesel: 384k L (CEA Baseline)"
        />

        <GlassKPI
          title="Scope 2 Grid Power"
          value="644.4"
          unit="tCO₂e"
          trend={{ direction: 'down', value: '2.1%', text: 'vs Aug' }}
          icon={Zap}
          subtitle="Grid CEA v19 (0.716 kg/kWh)"
        />

        <GlassKPI
          title="Water Recycled"
          value="73.4"
          unit="%"
          trend={{ direction: 'down', value: '50,050', text: 'KL recycled' }}
          icon={Droplet}
          subtitle="Target: >70% (L&T Benchmark)"
        />

        <GlassKPI
          title="Safe Man-Hours"
          value="4.52"
          unit="M hrs"
          icon={ShieldCheck}
          subtitle="LTIFR: 0.22 (Zero Fatalities)"
        />
      </div>

      {/* 3. Anomaly / Outlier Alert Banner */}
      <div style={{
        background: 'rgba(217, 154, 36, 0.08)',
        border: '1px solid rgba(217, 154, 36, 0.3)',
        borderRadius: '16px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(217, 154, 36, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--state-warning)'
          }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Monsoon Heavy Pumping Variance (+18.4% Diesel)
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Excavation & continuous de-watering verified against IOCL Delivery Slip #4819. Outlier justified for statutory audit.
            </div>
          </div>
        </div>

        <GlassButton variant="secondary" size="sm" onClick={onNavigateToEvidence}>
          View Evidence
        </GlassButton>
      </div>

      {/* 4. Monthly Emission & Energy Trend Visualization (Interactive SVG) */}
      <GlassCard level={2} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              FY 2025-26 Monthly Emission Profile
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Calculated using CEA Grid v19 and IPCC 2006 Standard Factors (tCO₂e)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12.5px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--blue-accent)' }} />
              Scope 1 (Direct Fuel)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#93C5FD' }} />
              Scope 2 (Electricity)
            </span>
          </div>
        </div>

        {/* Responsive Bar Chart Canvas */}
        <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', gap: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-soft)' }}>
          {trendData.map((item, index) => {
            const height1 = (item.scope1 / 1200) * 160;
            const height2 = (item.scope2 / 1200) * 160;

            return (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', width: '100%', justifyContent: 'center' }}>
                  {/* Scope 1 Bar */}
                  <div
                    title={`Scope 1: ${item.scope1} tCO2e`}
                    style={{
                      width: '32px',
                      height: `${height1}px`,
                      background: 'linear-gradient(180deg, #2A9CF0 0%, #178FE0 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 4px 12px rgba(23, 143, 224, 0.2)',
                      transition: 'all 200ms ease',
                      cursor: 'pointer'
                    }}
                  />
                  {/* Scope 2 Bar */}
                  <div
                    title={`Scope 2: ${item.scope2} tCO2e`}
                    style={{
                      width: '32px',
                      height: `${height2}px`,
                      background: 'linear-gradient(180deg, #BFDBFE 0%, #93C5FD 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 4px 12px rgba(147, 197, 253, 0.2)',
                      transition: 'all 200ms ease',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {item.month} 2025
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Source: Meter Readings & IOCL Invoices</span>
          <span style={{ color: 'var(--state-success)', fontWeight: '600' }}>✓ 100% Primary Evidence Verified</span>
        </div>
      </GlassCard>
    </>
  );
}

export default ProjectDashboard;
