import React, { useState, useMemo } from 'react';
import {
  X,
  BarChart3,
  TrendingUp,
  Download,
  Flame,
  Zap,
  Droplets,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Filter,
  Eye,
  Activity
} from 'lucide-react';

export default function SiteDeepAnalyticsModal({
  isOpen,
  onClose,
  reportingPeriod = 'September 2026',
  project = { id: 'site-102', name: 'Zojila Tunnel Project (PKG-2)' },
  kpis = { totalGhg_t: 347.4, gridMwh: 384, dieselLitres: 18650, recycledSharePct: 70, scope1_t: 49.98, scope2_t: 274.94 }
}) {
  const [activeMetric, setActiveMetric] = useState('ghg'); // 'ghg' | 'energy' | 'water' | 'intensity'
  const [timeRange, setTimeRange] = useState('FY2025-26');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Month-by-month realistic dataset scaled dynamically from current project KPIs
  const monthlyData = useMemo(() => {
    const scope1Base = kpis.scope1_t ? parseFloat(kpis.scope1_t) : 49.98;
    const scope2Base = kpis.scope2_t ? parseFloat(kpis.scope2_t) : 274.94;
    const waterRecycledBase = kpis.recycledSharePct ? parseFloat(kpis.recycledSharePct) : 70;

    return [
      { month: 'Apr 25', s1: Math.round(scope1Base * 0.88), s2: Math.round(scope2Base * 0.90), energyGJ: 1180, waterInflow: 54, waterRecycled: 36, intensity: 7.8 },
      { month: 'May 25', s1: Math.round(scope1Base * 0.92), s2: Math.round(scope2Base * 0.94), energyGJ: 1240, waterInflow: 58, waterRecycled: 39, intensity: 7.6 },
      { month: 'Jun 25', s1: Math.round(scope1Base * 0.95), s2: Math.round(scope2Base * 0.96), energyGJ: 1310, waterInflow: 62, waterRecycled: 42, intensity: 7.4 },
      { month: 'Jul 25', s1: Math.round(scope1Base * 0.98), s2: Math.round(scope2Base * 0.99), energyGJ: 1360, waterInflow: 65, waterRecycled: 45, intensity: 7.3 },
      { month: 'Aug 25', s1: Math.round(scope1Base * 1.02), s2: Math.round(scope2Base * 1.01), energyGJ: 1410, waterInflow: 63, waterRecycled: 44, intensity: 7.1 },
      { month: 'Sep 25', s1: Math.round(scope1Base), s2: Math.round(scope2Base), energyGJ: 1382, waterInflow: 61, waterRecycled: 42.5, intensity: 7.0 },
      { month: 'Oct 25', s1: Math.round(scope1Base * 0.96), s2: Math.round(scope2Base * 0.97), energyGJ: 1320, waterInflow: 59, waterRecycled: 41, intensity: 6.9 },
      { month: 'Nov 25', s1: Math.round(scope1Base * 0.91), s2: Math.round(scope2Base * 0.92), energyGJ: 1260, waterInflow: 55, waterRecycled: 38, intensity: 6.8 },
      { month: 'Dec 25', s1: Math.round(scope1Base * 0.89), s2: Math.round(scope2Base * 0.88), energyGJ: 1210, waterInflow: 52, waterRecycled: 36, intensity: 6.7 }
    ];
  }, [kpis]);

  const handleExportCsv = () => {
    const headers = ['Month', 'Scope 1 GHG (tCO2e)', 'Scope 2 GHG (tCO2e)', 'Total GHG (tCO2e)', 'Energy (GJ)', 'Water Inflow (kL)', 'Water Recycled (kL)', 'Carbon Intensity'];
    const rows = monthlyData.map(d => [
      `"${d.month}"`,
      d.s1,
      d.s2,
      d.s1 + d.s2,
      d.energyGJ,
      d.waterInflow,
      d.waterRecycled,
      d.intensity
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MEIL_Site_ESG_Analytics_${project.id}_FY26.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG dimensions for chart
  const svgWidth = 680;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Max scale calculation depending on metric
  const maxVal = useMemo(() => {
    if (activeMetric === 'ghg') {
      const maxTotal = Math.max(...monthlyData.map(d => d.s1 + d.s2));
      return Math.ceil(maxTotal * 1.15);
    } else if (activeMetric === 'energy') {
      const maxE = Math.max(...monthlyData.map(d => d.energyGJ));
      return Math.ceil(maxE * 1.15);
    } else if (activeMetric === 'water') {
      const maxW = Math.max(...monthlyData.map(d => d.waterInflow));
      return Math.ceil(maxW * 1.15);
    } else {
      const maxI = Math.max(...monthlyData.map(d => d.intensity));
      return Math.ceil(maxI * 1.2);
    }
  }, [activeMetric, monthlyData]);

  // Point mapping for area and line paths
  const points = monthlyData.map((d, i) => {
    const x = padding.left + (i / (monthlyData.length - 1)) * graphWidth;
    let yVal = 0;
    if (activeMetric === 'ghg') yVal = d.s1 + d.s2;
    else if (activeMetric === 'energy') yVal = d.energyGJ;
    else if (activeMetric === 'water') yVal = d.waterInflow;
    else yVal = d.intensity;

    const y = padding.top + graphHeight - (yVal / maxVal) * graphHeight;
    return { x, y, val: yVal, data: d };
  });

  const secondaryPoints = activeMetric === 'ghg' ? monthlyData.map((d, i) => {
    const x = padding.left + (i / (monthlyData.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.s1 / maxVal) * graphHeight;
    return { x, y, val: d.s1 };
  }) : null;

  const areaPath = `M ${points[0].x} ${points[0].y} ` +
    points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`;

  const linePath = `M ${points[0].x} ${points[0].y} ` +
    points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  const secondaryLinePath = secondaryPoints ? `M ${secondaryPoints[0].x} ${secondaryPoints[0].y} ` +
    secondaryPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') : null;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '960px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
        backdropFilter: 'blur(30px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(186, 230, 253, 0.5)',
        overflow: 'hidden',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'linear-gradient(90deg, rgba(240, 249, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Site Real-Time Telemetry & ESG Analytics
                </h3>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#2563EB',
                  background: 'rgba(37, 99, 235, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(37, 99, 235, 0.2)'
                }}>
                  {reportingPeriod}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                {project.name || 'Zojila Tunnel PKG-2'} • Ingested Smart Feeder, DG Telemetry & Lab Data
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExportCsv}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(203, 213, 225, 0.8)',
                color: '#334155',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={13} />
              <span>Export Analytics</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(241, 245, 249, 0.8)',
                border: '1px solid rgba(203, 213, 225, 0.6)',
                borderRadius: '10px',
                cursor: 'pointer',
                padding: '6px',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 4 Primary Metric Switchers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          padding: '14px 24px',
          background: 'rgba(248, 250, 252, 0.7)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.7)'
        }}>
          {[
            {
              id: 'ghg',
              title: 'Total Scope 1 & 2 GHG',
              val: `${kpis.totalGhg_t || 347.4} tCO₂e`,
              sub: `Scope 1: ${kpis.scope1_t || 49.98}t • Scope 2: ${kpis.scope2_t || 274.9}t`,
              color: '#2563EB',
              icon: Flame
            },
            {
              id: 'energy',
              title: 'Grid Electricity Energy',
              val: `${kpis.gridMwh || 384} MWh`,
              sub: '1,382 GJ Thermal Equiv.',
              color: '#0284C7',
              icon: Zap
            },
            {
              id: 'water',
              title: 'Water Recycling & ZLD',
              val: `${kpis.recycledSharePct || 70}% Recycled`,
              sub: '42.5 kL Recycled of 60.7 kL',
              color: '#16A34A',
              icon: Droplets
            },
            {
              id: 'intensity',
              title: 'Carbon Intensity Index',
              val: '7.02 kg/hr',
              sub: 'kg CO₂e per Safe Man-Hour',
              color: '#7C3AED',
              icon: Activity
            }
          ].map(card => {
            const Icon = card.icon;
            const isSelected = activeMetric === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setActiveMetric(card.id)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)',
                  border: isSelected ? `2px solid ${card.color}` : '1px solid rgba(226, 232, 240, 0.8)',
                  boxShadow: isSelected ? `0 4px 14px ${card.color}25` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{card.title}</span>
                  <Icon size={14} color={card.color} />
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: card.color }}>{card.val}</div>
                <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>{card.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Chart Viewport */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            padding: '16px 20px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                  {activeMetric === 'ghg' ? 'Scope 1 & Scope 2 GHG Trajectory (Monthly tCO₂e)'
                    : activeMetric === 'energy' ? 'Monthly Energy Consumption (GJ Equiv.)'
                    : activeMetric === 'water' ? 'Water Withdrawal vs Recycled Output (kL)'
                    : 'Carbon Intensity per Operational Safe Man-Hour'}
                </span>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  CEA Baseline v19 Verified • Automatic Telemetry Ingestion
                </div>
              </div>

              {activeMetric === 'ghg' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: '#64748B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />
                    <span>Combined Scope 1 & 2</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                    <span>Scope 1 (Diesel DG Fleet)</span>
                  </div>
                </div>
              )}
            </div>

            {/* SVG Chart with Smooth Curve and Interactivity */}
            <div style={{ width: '100%', height: '220px', position: 'relative' }}>
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = padding.top + graphHeight * (1 - pct);
                  const lblVal = Math.round(maxVal * pct);
                  return (
                    <g key={i}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={svgWidth - padding.right}
                        y2={y}
                        stroke="rgba(226, 232, 240, 0.8)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="9.5"
                        fill="#94A3B8"
                        fontFamily="sans-serif"
                      >
                        {lblVal}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area */}
                <path d={areaPath} fill="url(#areaGradient)" />

                {/* Primary Trend Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Secondary Line for Scope 1 if GHG */}
                {secondaryLinePath && (
                  <path
                    d={secondaryLinePath}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                )}

                {/* Interactive Points and Labels */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    {/* X-axis Month Label */}
                    <text
                      x={p.x}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748B"
                      fontWeight="600"
                    >
                      {p.data.month}
                    </text>

                    {/* Point Circle */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredPoint?.idx === idx ? 6 : 4}
                      fill="#FFFFFF"
                      stroke="#2563EB"
                      strokeWidth={hoveredPoint?.idx === idx ? 3 : 2}
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredPoint({ idx, ...p })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div style={{
                  position: 'absolute',
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${(hoveredPoint.y / svgHeight) * 100}%`,
                  transform: 'translate(-50%, -125%)',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  zIndex: 10
                }}>
                  <div style={{ fontWeight: 700 }}>{hoveredPoint.data.month}</div>
                  <div>
                    {activeMetric === 'ghg' ? `Total GHG: ${hoveredPoint.val} tCO₂e (Scope 1: ${hoveredPoint.data.s1}t, Scope 2: ${hoveredPoint.data.s2}t)`
                      : activeMetric === 'energy' ? `Energy: ${hoveredPoint.val} GJ`
                      : activeMetric === 'water' ? `Intake: ${hoveredPoint.val} kL (Recycled: ${hoveredPoint.data.waterRecycled} kL)`
                      : `Intensity: ${hoveredPoint.val} kg CO₂e/hr`}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subsystem Telemetry Feeds Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            marginTop: '16px'
          }}>
            <div style={{ padding: '14px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.9)' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Smart Feeder Meters</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>33kV Feeder 02</div>
              <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                <span>Live Ingestion: 5m interval</span>
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.9)' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Diesel DG Metering</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>IOCL Tanker CH-4482</div>
              <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                <span>Verified Stock Reconciliation</span>
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.9)' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Water ZLD STP</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>Flowmeter STP-04</div>
              <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                <span>70% Effluent Recycled (Zero Liquid)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            SEBI BRSR Core Circular 2023 & 2025 Audit Assurance Metric Framework
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 20px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#0F172A',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close Analytics Studio
          </button>
        </div>
      </div>
    </div>
  );
}
