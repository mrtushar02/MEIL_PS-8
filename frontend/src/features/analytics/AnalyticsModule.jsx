import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Download,
  Flame,
  Zap,
  Droplets,
  Trash2,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import './AnalyticsModule.css';

export default function AnalyticsModule({ onNavigate }) {
  // Filters
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedPeriod, setSelectedPeriod] = useState('FY 2026-27');
  const [selectedMetric, setSelectedMetric] = useState('All Metrics');
  const [selectedView, setSelectedView] = useState('Monthly');

  // Chart hover state for interactive glass tooltip
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [hoveredEnergyMonth, setHoveredEnergyMonth] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  // Reset filters
  const handleReset = () => {
    setSelectedProject('All Projects');
    setSelectedPeriod('FY 2026-27');
    setSelectedMetric('All Metrics');
    setSelectedView('Monthly');
  };

  // Export Analysis CSV
  const handleExport = () => {
    const csvContent = `MEIL GROUP ESG & BRSR ANALYTICS EXPORT
Generated On: ${new Date().toLocaleString()}
Scope: ${selectedProject}
Period: ${selectedPeriod}
Resolution: ${selectedView}

KPI SUMMARY:
Total GHG Emissions: 12,480 tCO2e (+6.8% YoY)
Scope 1 Direct Emissions: 5,120 tCO2e
Scope 2 Indirect Grid (CEA v19): 7,360 tCO2e
Energy Consumption: 18,650 MWh (-4.2%)
Water Consumption: 1,24,300 KL (-8.1%)
Water Recycled Share: 70.0% (Zero Liquid Discharge SPCB Compliant)
Waste Generated: 2,840 MT (+12.5%)
Waste Diverted from Landfill: 94.2%

MONTHLY EMISSIONS TREND (tCO2e):
Month,Scope 1,Scope 2,Total
Jan,520,780,1300
Feb,510,760,1270
Mar,580,820,1400
Apr,540,790,1330
May,590,830,1420
Jun,610,870,1480
Jul,570,810,1380
Aug,560,800,1360
Sep,640,890,1530

PROJECT-WISE ESG PERFORMANCE:
Project,Score,Energy,Water,Waste,Safety
Zojila Tunnel (PKG-2),88%,92%,85%,88%,98%
Bengaluru Metro,82%,80%,78%,84%,94%
Krishna Water Supply,92%,90%,96%,90%,96%
MEIL Energy Park,90%,96%,88%,86%,95%
Hyderabad Infra Park,76%,74%,72%,78%,90%
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MEIL_ESG_Analytics_${selectedPeriod.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Monthly data series matching the charts in reference
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  
  // Emissions Trend points (Jan to Sep)
  // Max scale: 20,000 on Y-axis
  const emissionsData = [
    { m: 'Jan', s1: 4200, s2: 7800, total: 12000 },
    { m: 'Feb', s1: 4100, s2: 7600, total: 11700 },
    { m: 'Mar', s1: 4600, s2: 8100, total: 12700 },
    { m: 'Apr', s1: 4400, s2: 7900, total: 12300 },
    { m: 'May', s1: 4900, s2: 8300, total: 13200 },
    { m: 'Jun', s1: 5200, s2: 8600, total: 13800 },
    { m: 'Jul', s1: 4800, s2: 8200, total: 13000 },
    { m: 'Aug', s1: 4700, s2: 8100, total: 12800 },
    { m: 'Sep', s1: 5300, s2: 8900, total: 14200 },
  ];

  // Energy consumption stacked bar data (Jan to Sep)
  // Max scale: 10,000 MWh
  const energyData = [
    { m: 'Jan', grid: 3800, diesel: 1800, renew: 1200 },
    { m: 'Feb', grid: 3700, diesel: 1700, renew: 1300 },
    { m: 'Mar', grid: 4200, diesel: 1900, renew: 1400 },
    { m: 'Apr', grid: 3900, diesel: 1750, renew: 1500 },
    { m: 'May', grid: 4400, diesel: 2000, renew: 1600 },
    { m: 'Jun', grid: 4600, diesel: 2100, renew: 1700 },
    { m: 'Jul', grid: 4300, diesel: 1950, renew: 1800 },
    { m: 'Aug', grid: 4200, diesel: 1900, renew: 1850 },
    { m: 'Sep', grid: 4800, diesel: 2200, renew: 1950 },
  ];

  // Project comparisons matching bottom left card
  const projectScores = [
    { name: 'Zojila Tunnel (PKG-2)', energy: 30, water: 25, waste: 20, safety: 13, total: '88%' },
    { name: 'Bengaluru Metro', energy: 28, water: 22, waste: 18, safety: 14, total: '82%' },
    { name: 'Krishna Water Supply', energy: 32, water: 28, waste: 19, safety: 13, total: '92%' },
    { name: 'MEIL Energy Park', energy: 34, water: 24, waste: 18, safety: 14, total: '90%' },
    { name: 'Hyderabad Infra Park', energy: 26, water: 20, waste: 17, safety: 13, total: '76%' },
  ];

  // Key calculated insights matching bottom middle card
  const insights = [
    {
      text: 'Emissions decreased by 6.8% compared to last period.',
      icon: TrendingUp,
      bg: 'rgba(2, 132, 199, 0.1)',
      color: '#0284C7'
    },
    {
      text: 'Water recycling improved by 12% across all sites.',
      icon: Droplets,
      bg: 'rgba(14, 165, 233, 0.1)',
      color: '#0284C7'
    },
    {
      text: 'Waste generation reduced by 12.5% with better segregation.',
      icon: Trash2,
      bg: 'rgba(249, 115, 22, 0.1)',
      color: '#EA580C'
    },
    {
      text: 'Safety data completion is at 98%.',
      icon: ShieldCheck,
      bg: 'rgba(22, 163, 74, 0.1)',
      color: '#16A34A'
    }
  ];

  // Completeness breakdown matching bottom right donut
  const moduleCompleteness = [
    { name: 'Energy', pct: 88, color: '#38BDF8' },
    { name: 'Water', pct: 72, color: '#0284C7' },
    { name: 'Waste', pct: 62, color: '#F59E0B' },
    { name: 'Safety', pct: 90, color: '#10B981' },
    { name: 'Social', pct: 64, color: '#EC4899' },
    { name: 'Governance', pct: 78, color: '#8B5CF6' }
  ];

  // SVG dimensions for Line Chart
  const svgWidth = 460;
  const svgHeight = 150;
  const paddingLeft = 36;
  const paddingBottom = 22;
  const paddingTop = 10;
  const chartW = svgWidth - paddingLeft;
  const chartH = svgHeight - paddingBottom - paddingTop;
  const maxY = 20000;

  // Convert point to SVG coordinates
  const getX = (index) => paddingLeft + (index / (emissionsData.length - 1)) * chartW;
  const getY = (val) => paddingTop + chartH - (val / maxY) * chartH;

  // Path generators
  const scope1Points = emissionsData.map((d, i) => `${getX(i)},${getY(d.s1)}`).join(' ');
  const scope2Points = emissionsData.map((d, i) => `${getX(i)},${getY(d.s2)}`).join(' ');

  // Area path for Scope 2
  const scope2Area = `${scope2Points} ${getX(emissionsData.length - 1)},${paddingTop + chartH} ${paddingLeft},${paddingTop + chartH}`;

  return (
    <div className="an-container">
      {/* 1. Page Header */}
      <div className="an-page-header">
        <div className="an-header-left">
          <div className="an-header-icon-box">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="an-page-title">Analytics</h1>
            <p className="an-page-subtitle">Explore ESG performance, trends and insights across your projects.</p>
          </div>
        </div>

        <button 
          className="an-btn-primary-action"
          onClick={handleExport}
        >
          <Download size={15} />
          <span>Export Analysis</span>
        </button>
      </div>

      {/* 2. Compact Glass Filter Bar */}
      <div className="an-filter-bar-card">
        <div className="an-filter-items">
          <div className="an-filter-item">
            <span className="an-filter-label">Project</span>
            <select 
              className="an-filter-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="All Projects">All Projects</option>
              <option value="Zojila Tunnel (PKG-2)">Zojila Tunnel (PKG-2)</option>
              <option value="Bengaluru Metro">Bengaluru Metro</option>
              <option value="Krishna Water Supply">Krishna Water Supply</option>
              <option value="MEIL Energy Park">MEIL Energy Park</option>
              <option value="Hyderabad Infra Park">Hyderabad Infra Park</option>
            </select>
          </div>

          <div className="an-filter-item">
            <span className="an-filter-label">Reporting Period</span>
            <select 
              className="an-filter-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="FY 2026-27">FY 2026-27</option>
              <option value="FY 2025-26">FY 2025-26</option>
              <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
            </select>
          </div>

          <div className="an-filter-item">
            <span className="an-filter-label">Metric</span>
            <select 
              className="an-filter-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="All Metrics">All Metrics</option>
              <option value="Emissions">GHG Emissions</option>
              <option value="Energy">Energy (MWh)</option>
              <option value="Water">Water (KL)</option>
              <option value="Waste">Waste (MT)</option>
            </select>
          </div>

          <div className="an-filter-item">
            <span className="an-filter-label">View</span>
            <select 
              className="an-filter-select"
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        <button 
          className="an-reset-btn"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* 3. 4 Top KPI Cards Row */}
      <div className="an-kpi-grid">
        {/* Total Emissions */}
        <div className="an-kpi-card">
          <div className="an-kpi-icon-wrap" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
            <Flame size={22} />
          </div>
          <div className="an-kpi-content">
            <div className="an-kpi-title">Total Emissions (tCO₂e)</div>
            <div className="an-kpi-val-row">
              <span className="an-kpi-val">12,480</span>
              <span className="an-kpi-badge" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                <ArrowDownRight size={12} /> +6.8%
              </span>
            </div>
          </div>
        </div>

        {/* Energy Consumption */}
        <div className="an-kpi-card">
          <div className="an-kpi-icon-wrap" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}>
            <Zap size={22} />
          </div>
          <div className="an-kpi-content">
            <div className="an-kpi-title">Energy Consumption (MWh)</div>
            <div className="an-kpi-val-row">
              <span className="an-kpi-val">18,650</span>
              <span className="an-kpi-badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                <ArrowDownRight size={12} /> -4.2%
              </span>
            </div>
          </div>
        </div>

        {/* Water Consumption */}
        <div className="an-kpi-card">
          <div className="an-kpi-icon-wrap" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0284C7' }}>
            <Droplets size={22} />
          </div>
          <div className="an-kpi-content">
            <div className="an-kpi-title">Water Consumption (KL)</div>
            <div className="an-kpi-val-row">
              <span className="an-kpi-val">1,24,300</span>
              <span className="an-kpi-badge" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                <ArrowDownRight size={12} /> -8.1%
              </span>
            </div>
          </div>
        </div>

        {/* Waste Generated */}
        <div className="an-kpi-card">
          <div className="an-kpi-icon-wrap" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#EA580C' }}>
            <Trash2 size={22} />
          </div>
          <div className="an-kpi-content">
            <div className="an-kpi-title">Waste Generated (MT)</div>
            <div className="an-kpi-val-row">
              <span className="an-kpi-val">2,840</span>
              <span className="an-kpi-badge" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                <ArrowUpRight size={12} /> +12.5%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main 2 Charts Row */}
      <div className="an-charts-grid">
        {/* Left Chart: Emissions Trend (Scope 1 vs Scope 2) */}
        <div className="an-chart-card">
          <div className="an-chart-header">
            <span className="an-chart-title">Emissions Trend (Scope 1 vs Scope 2)</span>
            <div className="an-chart-controls">
              <div className="an-legend-item">
                <span className="an-legend-dot" style={{ background: '#38BDF8' }} />
                <span>Scope 1</span>
              </div>
              <div className="an-legend-item">
                <span className="an-legend-dot" style={{ background: '#0284C7' }} />
                <span>Scope 2</span>
              </div>
              <button 
                className="an-chart-action-btn"
                onClick={() => setDetailsModal('emissions')}
              >
                View Details
              </button>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="an-svg-container" onMouseLeave={() => setHoveredMonth(null)}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="scope2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Axis Grid Lines */}
              {[0, 5000, 10000, 15000, 20000].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={svgWidth} 
                      y2={y} 
                      stroke="rgba(226, 232, 240, 0.7)" 
                      strokeDasharray="3 3" 
                    />
                    <text 
                      x={paddingLeft - 6} 
                      y={y + 3} 
                      fontSize="9" 
                      fill="#94A3B8" 
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {val === 0 ? '0' : `${val / 1000}k`}
                    </text>
                  </g>
                );
              })}

              {/* Scope 2 Area Gradient */}
              <polygon points={scope2Area} fill="url(#scope2Grad)" />

              {/* Scope 2 Polyline (Deeper Blue) */}
              <polyline 
                points={scope2Points} 
                fill="none" 
                stroke="#0284C7" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Scope 1 Polyline (Cyan / Light Blue) */}
              <polyline 
                points={scope1Points} 
                fill="none" 
                stroke="#38BDF8" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Data points & hover triggers */}
              {emissionsData.map((d, i) => {
                const cx = getX(i);
                const cy1 = getY(d.s1);
                const cy2 = getY(d.s2);
                const isHovered = hoveredMonth === d.m;

                return (
                  <g 
                    key={d.m} 
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredMonth(d.m)}
                  >
                    {/* Vertical guideline on hover */}
                    {isHovered && (
                      <line 
                        x1={cx} 
                        y1={paddingTop} 
                        x2={cx} 
                        y2={paddingTop + chartH} 
                        stroke="#0284C7" 
                        strokeWidth="1" 
                        strokeDasharray="2 2" 
                      />
                    )}

                    {/* Scope 2 Point */}
                    <circle 
                      cx={cx} 
                      cy={cy2} 
                      r={isHovered ? 5 : 3.5} 
                      fill="#FFFFFF" 
                      stroke="#0284C7" 
                      strokeWidth="2" 
                    />

                    {/* Scope 1 Point */}
                    <circle 
                      cx={cx} 
                      cy={cy1} 
                      r={isHovered ? 4.5 : 3} 
                      fill="#FFFFFF" 
                      stroke="#38BDF8" 
                      strokeWidth="2" 
                    />

                    {/* X-axis label */}
                    <text 
                      x={cx} 
                      y={svgHeight - 4} 
                      fontSize="9.5" 
                      fill={isHovered ? '#0284C7' : '#64748B'} 
                      fontWeight={isHovered ? '700' : '500'}
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {d.m}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Liquid Glass Interactive Tooltip */}
            {hoveredMonth && (
              <div 
                className="an-tooltip"
                style={{
                  left: `${(months.indexOf(hoveredMonth) / (months.length - 1)) * 75 + 12}%`,
                  top: '12px'
                }}
              >
                <div style={{ fontWeight: 800, color: '#0F172A', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', paddingBottom: '3px', marginBottom: '2px' }}>
                  {hoveredMonth} 2026 Emissions
                </div>
                <div style={{ color: '#0284C7', fontWeight: 700 }}>
                  Scope 2 (Grid): {emissionsData.find(e => e.m === hoveredMonth)?.s2} tCO₂e
                </div>
                <div style={{ color: '#38BDF8', fontWeight: 700 }}>
                  Scope 1 (Fuel): {emissionsData.find(e => e.m === hoveredMonth)?.s1} tCO₂e
                </div>
                <div style={{ fontSize: '9px', color: '#64748B', marginTop: '2px' }}>
                  Calculated: CEA Grid v19 @ 0.716 kg/kWh
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Energy Consumption */}
        <div className="an-chart-card">
          <div className="an-chart-header">
            <span className="an-chart-title">Energy Consumption</span>
            <div className="an-chart-controls">
              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Monthly ▾</span>
              <button 
                className="an-chart-action-btn"
                onClick={() => setDetailsModal('energy')}
              >
                View Details
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', fontSize: '10.5px' }}>
            <div className="an-legend-item">
              <span className="an-legend-dot" style={{ background: '#0284C7' }} />
              <span>Grid</span>
            </div>
            <div className="an-legend-item">
              <span className="an-legend-dot" style={{ background: '#F59E0B' }} />
              <span>Diesel</span>
            </div>
            <div className="an-legend-item">
              <span className="an-legend-dot" style={{ background: '#10B981' }} />
              <span>Renewable</span>
            </div>
          </div>

          {/* SVG Stacked Bar Graph */}
          <div className="an-svg-container" onMouseLeave={() => setHoveredEnergyMonth(null)}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%' }}>
              {/* Y Axis Grid Lines */}
              {[0, 2500, 5000, 7500, 10000].map((val) => {
                const y = paddingTop + chartH - (val / 10000) * chartH;
                return (
                  <g key={val}>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={svgWidth} 
                      y2={y} 
                      stroke="rgba(226, 232, 240, 0.7)" 
                      strokeDasharray="3 3" 
                    />
                    <text 
                      x={paddingLeft - 6} 
                      y={y + 3} 
                      fontSize="9" 
                      fill="#94A3B8" 
                      textAnchor="end"
                      fontFamily="sans-serif"
                    >
                      {val === 0 ? '0' : `${val / 1000}k`}
                    </text>
                  </g>
                );
              })}

              {/* Grouped/Stacked Bars */}
              {energyData.map((d, i) => {
                const cx = getX(i);
                const barWidth = 14;
                const maxBarVal = 10000;
                
                const hRenew = (d.renew / maxBarVal) * chartH;
                const hDiesel = (d.diesel / maxBarVal) * chartH;
                const hGrid = (d.grid / maxBarVal) * chartH;

                const yGrid = paddingTop + chartH - hGrid;
                const yDiesel = yGrid - hDiesel;
                const yRenew = yDiesel - hRenew;

                const isHovered = hoveredEnergyMonth === d.m;

                return (
                  <g 
                    key={d.m} 
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredEnergyMonth(d.m)}
                  >
                    {/* Grid Segment */}
                    <rect 
                      x={cx - barWidth / 2} 
                      y={yGrid} 
                      width={barWidth} 
                      height={hGrid} 
                      fill="#0284C7" 
                      rx="1"
                    />

                    {/* Diesel Segment */}
                    <rect 
                      x={cx - barWidth / 2} 
                      y={yDiesel} 
                      width={barWidth} 
                      height={hDiesel} 
                      fill="#F59E0B" 
                    />

                    {/* Renewable Segment */}
                    <rect 
                      x={cx - barWidth / 2} 
                      y={yRenew} 
                      width={barWidth} 
                      height={hRenew} 
                      fill="#10B981" 
                      rx="2"
                    />

                    {/* X-axis label */}
                    <text 
                      x={cx} 
                      y={svgHeight - 4} 
                      fontSize="9.5" 
                      fill={isHovered ? '#0284C7' : '#64748B'} 
                      fontWeight={isHovered ? '700' : '500'}
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {d.m}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip for Energy */}
            {hoveredEnergyMonth && (
              <div 
                className="an-tooltip"
                style={{
                  left: `${(months.indexOf(hoveredEnergyMonth) / (months.length - 1)) * 75 + 12}%`,
                  top: '12px'
                }}
              >
                <div style={{ fontWeight: 800, color: '#0F172A', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', paddingBottom: '3px', marginBottom: '2px' }}>
                  {hoveredEnergyMonth} Energy Mix (MWh)
                </div>
                <div style={{ color: '#0284C7', fontWeight: 700 }}>
                  Grid Power: {energyData.find(e => e.m === hoveredEnergyMonth)?.grid} MWh
                </div>
                <div style={{ color: '#F59E0B', fontWeight: 700 }}>
                  Diesel Gen: {energyData.find(e => e.m === hoveredEnergyMonth)?.diesel} MWh
                </div>
                <div style={{ color: '#10B981', fontWeight: 700 }}>
                  Solar / PPA: {energyData.find(e => e.m === hoveredEnergyMonth)?.renew} MWh
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Bottom 3 Cards Row */}
      <div className="an-bottom-grid">
        {/* Card 1: ESG Performance by Project */}
        <div className="an-bottom-card">
          <div className="an-bottom-header">
            <span className="an-bottom-title">ESG Performance by Project</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748B' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38BDF8' }} /> Energy
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284C7' }} /> Water
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} /> Waste
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> Safety
              </div>
              <button 
                className="an-bottom-pill-btn"
                onClick={() => onNavigate && onNavigate('project')}
              >
                View All
              </button>
            </div>
          </div>

          <div className="an-project-rows">
            {projectScores.map((proj, idx) => (
              <div key={idx} className="an-project-row">
                <span className="an-project-name" title={proj.name}>{proj.name}</span>
                <div className="an-project-bar-track">
                  <div style={{ width: `${proj.energy}%`, background: '#38BDF8' }} title="Energy" />
                  <div style={{ width: `${proj.water}%`, background: '#0284C7' }} title="Water" />
                  <div style={{ width: `${proj.waste}%`, background: '#F59E0B' }} title="Waste" />
                  <div style={{ width: `${proj.safety}%`, background: '#10B981' }} title="Safety" />
                </div>
                <span className="an-project-score">{proj.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Key Insights */}
        <div className="an-bottom-card">
          <div className="an-bottom-header">
            <span className="an-bottom-title">Key Insights</span>
            <button className="an-bottom-pill-btn">View All</button>
          </div>

          <div className="an-insights-list">
            {insights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="an-insight-item">
                  <div className="an-insight-icon-wrap" style={{ background: item.bg, color: item.color }}>
                    <Icon size={14} />
                  </div>
                  <span className="an-insight-text">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Data Completeness */}
        <div className="an-bottom-card">
          <div className="an-bottom-header">
            <span className="an-bottom-title">Data Completeness</span>
          </div>

          <div className="an-completeness-body">
            {/* SVG Donut */}
            <div className="an-donut-wrap">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="38" 
                  fill="transparent" 
                  stroke="rgba(226, 232, 240, 0.7)" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="38" 
                  fill="transparent" 
                  stroke="#0284C7" 
                  strokeWidth="8" 
                  strokeDasharray="238.76" 
                  strokeDashoffset={238.76 * (1 - 0.72)} 
                  strokeLinecap="round" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
              <div className="an-donut-inner">
                <span className="an-donut-pct">72%</span>
                <span className="an-donut-label">Overall</span>
              </div>
            </div>

            {/* Modules List */}
            <div className="an-modules-list">
              {moduleCompleteness.map((mod, idx) => (
                <div key={idx} className="an-module-item">
                  <div className="an-module-left">
                    <span className="an-module-dot" style={{ background: mod.color }} />
                    <span>{mod.name}</span>
                  </div>
                  <span className="an-module-val">{mod.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details & Methodology Modal */}
      {detailsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 520, maxWidth: '92%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}>
                  {detailsModal === 'emissions' ? 'GHG Protocol Accounting' : 'Energy Transmission Telemetry'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                  {detailsModal === 'emissions' ? 'CEA India Grid Baseline Methodology' : '33kV Dedicated Feeders Architecture'}
                </h3>
              </div>
              <button onClick={() => setDetailsModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>

            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, fontSize: '12.5px', color: '#334155', lineHeight: 1.5, marginBottom: 16 }}>
              {detailsModal === 'emissions' ? (
                <>
                  <p><strong>Baseline Standard:</strong> Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector, Version 19.0.</p>
                  <p style={{ marginTop: 6 }}><strong>Scope 2 Grid Emission Factor:</strong> <span style={{ color: '#2563EB', fontWeight: 700 }}>0.716 kg CO2e / kWh</span> (weighted average combined margin).</p>
                  <p style={{ marginTop: 6 }}><strong>Scope 1 Fuel Calculations:</strong> High-Speed Diesel (HSD) calibrated at 2.68 kg CO2e / Liter; Heavy Furnace Oil at 3.12 kg CO2e / Liter.</p>
                  <p style={{ marginTop: 6 }}><strong>Verification Status:</strong> Third-party assured under SEBI BRSR Core Circulars (2023 & 2025).</p>
                </>
              ) : (
                <>
                  <p><strong>Grid Interconnection:</strong> Dedicated 33kV & 11kV substation feeder lines with bidirectional ABT-compliant electronic meters.</p>
                  <p style={{ marginTop: 6 }}><strong>Telemetry Sync:</strong> Automated optical port data extraction linked directly with State DISCOM Billing engines.</p>
                  <p style={{ marginTop: 6 }}><strong>Backup Diesel Gensets:</strong> PLC-monitored fuel flow meters with automated operational hour recording.</p>
                  <p style={{ marginTop: 6 }}><strong>Data Integrity:</strong> 15-minute time-stamped interval log immutable audit trail.</p>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="an-chart-action-btn"
                style={{ padding: '6px 16px', fontSize: '12px' }}
                onClick={() => setDetailsModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
