import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Droplet,
  Trash2,
  ShieldAlert,
  Flame,
  Calendar,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';

export default function BUAnalyticsScreen() {
  const [activePillar, setActivePillar] = useState('Emissions');
  const [timeRange, setTimeRange] = useState('FY 2026-27 (H1)');

  const pillars = ['Emissions', 'Energy', 'Water', 'Waste', 'Safety'];

  // Trend data over 6 months
  const monthlyTrends = [
    { month: 'Apr', scope1: 680, scope2: 410, energy: 1.3, water: 29000, waste: 76, safetyIncidents: 0 },
    { month: 'May', scope1: 710, scope2: 430, energy: 1.4, water: 31000, waste: 78, safetyIncidents: 1 },
    { month: 'Jun', scope1: 690, scope2: 390, energy: 1.35, water: 30500, waste: 79, safetyIncidents: 0 },
    { month: 'Jul', scope1: 740, scope2: 450, energy: 1.48, water: 32000, waste: 80, safetyIncidents: 0 },
    { month: 'Aug', scope1: 720, scope2: 440, energy: 1.42, water: 31200, waste: 81, safetyIncidents: 0 },
    { month: 'Sep', scope1: 760, scope2: 460, energy: 1.55, water: 30520, waste: 81.4, safetyIncidents: 0 }
  ];

  // Max values for SVG charting scales
  const maxScopeVal = 900;
  const svgWidth = 640;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 24;

  const getPoints = key => {
    return monthlyTrends
      .map((item, idx) => {
        const x = paddingX + (idx * (svgWidth - 2 * paddingX)) / (monthlyTrends.length - 1);
        const y =
          svgHeight -
          paddingY -
          (item[key] / maxScopeVal) * (svgHeight - 2 * paddingY);
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="bu-analytics-screen">
      {/* Pillar Selection Pills & Timeframe Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div className="bu-segmented-nav">
          {pillars.map(p => (
            <button
              key={p}
              className={`bu-segmented-btn ${activePillar === p ? 'active' : ''}`}
              onClick={() => setActivePillar(p)}
            >
              <span>{p}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="bu-select"
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            style={{ height: '36px', fontSize: '12px' }}
          >
            <option value="FY 2026-27 (H1)">FY 2026-27 (H1: Apr - Sep)</option>
            <option value="Q2 FY27">Q2 FY 2026-27 (Jul - Sep)</option>
            <option value="Full Year 2026">Full Calendar Year 2026</option>
          </select>
        </div>
      </div>

      {/* Main Trend Line Chart Card */}
      <div className="bu-card">
        <div className="bu-card-header">
          <div>
            <h3 className="bu-card-title">Scope 1 & 2 Emissions Trend</h3>
            <p className="bu-card-subtitle">
              Monthly consolidated carbon trajectory for Tunnels BU across all 6 project sites
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2563EB' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>Scope 1 (Direct Fuels)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#38BDF8' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>Scope 2 (Grid Electricity)</span>
            </div>
          </div>
        </div>

        {/* SVG Multi-Line Trend Chart */}
        <div style={{ width: '100%', overflowX: 'auto', padding: '16px 0' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: '100%', height: '240px', overflow: 'visible' }}
          >
            {/* Horizontal Grid lines */}
            {[0, 300, 600, 900].map(val => {
              const y = svgHeight - paddingY - (val / maxScopeVal) * (svgHeight - 2 * paddingY);
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    fontSize="10"
                    fill="#94A3B8"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Scope 1 Line (Blue) */}
            <polyline
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={getPoints('scope1')}
            />

            {/* Scope 2 Line (Cyan) */}
            <polyline
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={getPoints('scope2')}
            />

            {/* Data points and labels */}
            {monthlyTrends.map((item, idx) => {
              const x = paddingX + (idx * (svgWidth - 2 * paddingX)) / (monthlyTrends.length - 1);
              const y1 =
                svgHeight -
                paddingY -
                (item.scope1 / maxScopeVal) * (svgHeight - 2 * paddingY);
              const y2 =
                svgHeight -
                paddingY -
                (item.scope2 / maxScopeVal) * (svgHeight - 2 * paddingY);

              return (
                <g key={item.month}>
                  {/* Scope 1 Circle */}
                  <circle cx={x} cy={y1} r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  {/* Scope 2 Circle */}
                  <circle cx={x} cy={y2} r="4" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
                  {/* Month Label */}
                  <text
                    x={x}
                    y={svgHeight - 4}
                    fontSize="11"
                    fill="#64748B"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {item.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 4 Bottom KPI Metric Cards */}
      <div className="bu-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '20px' }}>
        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Total Emissions</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
              <Flame size={16} />
            </div>
          </div>
          <div className="kpi-value">4,214 <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>tCO2e</span></div>
          <div className="kpi-delta negative" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ArrowUpRight size={12} />
            <span>+1.2% vs prev</span>
          </div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Energy Consumed</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B' }}>
              <Zap size={16} />
            </div>
          </div>
          <div className="kpi-value">8.4M <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>kWh</span></div>
          <div className="kpi-delta negative" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ArrowUpRight size={12} />
            <span>+2.1% vs prev</span>
          </div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Water Recycled</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(14,165,233,0.08)', color: '#0EA5E9' }}>
              <Droplet size={16} />
            </div>
          </div>
          <div className="kpi-value">184,220 <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>KL</span></div>
          <div className="kpi-delta positive" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ArrowDownRight size={12} />
            <span>-1.8% vs prev</span>
          </div>
        </div>

        <div className="bu-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Waste Diversion</span>
            <div className="kpi-icon-wrap" style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981' }}>
              <Trash2 size={16} />
            </div>
          </div>
          <div className="kpi-value">81.4%</div>
          <div className="kpi-delta positive" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ArrowUpRight size={12} />
            <span>+3.6% vs prev</span>
          </div>
        </div>
      </div>
    </div>
  );
}
