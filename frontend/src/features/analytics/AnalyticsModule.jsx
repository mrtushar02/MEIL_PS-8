import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowDownRight,
  Layers,
  ChevronDown,
  Filter,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { esgStore, EMISSION_FACTORS } from '../../services/esgStore';
import './AnalyticsModule.css';

export default function AnalyticsModule({ onNavigate }) {
  // 1. Reactive Store Subscription
  const [storeKpis, setStoreKpis] = useState(() => esgStore.getCalculatedKPIs());
  const [storeState, setStoreState] = useState(() => esgStore.getState());

  useEffect(() => {
    const unsub = esgStore.subscribe((state) => {
      setStoreKpis(esgStore.getCalculatedKPIs());
      setStoreState({ ...state });
    });
    return unsub;
  }, []);

  // 2. Filters State
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedPeriod, setSelectedPeriod] = useState('FY 2026-27');
  const [selectedMetric, setSelectedMetric] = useState('All Metrics');
  const [selectedView, setSelectedView] = useState('Monthly');

  // Chart hover state for interactive glass tooltip
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [hoveredEnergyMonth, setHoveredEnergyMonth] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  // Project multiplier factors for realistic responsive figures
  const projectMultiplier = useMemo(() => {
    switch (selectedProject) {
      case 'Zojila Tunnel (PKG-2)': return 0.22;
      case 'Bengaluru Metro': return 0.35;
      case 'Krishna Water Supply': return 0.18;
      case 'MEIL Energy Park': return 0.15;
      case 'Hyderabad Infra Park': return 0.10;
      default: return 1.0;
    }
  }, [selectedProject]);

  // Period multiplier factor
  const periodMultiplier = useMemo(() => {
    switch (selectedPeriod) {
      case 'FY 2025-26': return 0.94;
      case 'Q2 FY 2026-27': return 0.38;
      default: return 1.0;
    }
  }, [selectedPeriod]);

  // Dynamic Calculated KPI totals (combining store state and active project filter)
  const computedKpis = useMemo(() => {
    const isSingleProject = selectedProject === 'Zojila Tunnel (PKG-2)';
    
    // Live store baseline additions
    const liveDieselL = storeKpis.dieselLitres || 18650;
    const liveGridMwh = storeKpis.gridMwh || 384;
    const liveScope1 = storeKpis.scope1_t || (liveDieselL * 2.68 / 1000);
    const liveScope2 = storeKpis.scope2_t || (liveGridMwh * 1000 * 0.716 / 1000);
    const liveTotalGhg = Math.round((liveScope1 + liveScope2) * 10) / 10;

    if (isSingleProject) {
      return {
        totalEmissions: liveTotalGhg > 0 ? liveTotalGhg.toLocaleString() : '347.4',
        emissionsDelta: '-4.2% YoY',
        isEmissionsGood: true,
        energyMwh: liveGridMwh.toLocaleString(),
        energyDelta: '+1.2%',
        isEnergyGood: false,
        waterKl: (18200).toLocaleString(),
        waterDelta: '-8.1%',
        isWaterGood: true,
        wasteMt: (145.8).toLocaleString(),
        wasteDelta: '+12.5%',
        isWasteGood: true,
        scope1: liveScope1.toFixed(1),
        scope2: liveScope2.toFixed(1),
        recycledWaterPct: storeKpis.recycledSharePct || 70,
        wasteRecycledPct: storeKpis.wasteRecoveryPct || 94.2
      };
    }

    // Aggregated Group Level
    const baseEmissions = Math.round(12480 * projectMultiplier * periodMultiplier);
    const baseEnergy = Math.round(18650 * projectMultiplier * periodMultiplier);
    const baseWater = Math.round(124300 * projectMultiplier * periodMultiplier);
    const baseWaste = Math.round(2840 * projectMultiplier * periodMultiplier);

    return {
      totalEmissions: baseEmissions.toLocaleString(),
      emissionsDelta: '+6.8% YoY',
      isEmissionsGood: false,
      energyMwh: baseEnergy.toLocaleString(),
      energyDelta: '-4.2%',
      isEnergyGood: true,
      waterKl: baseWater.toLocaleString(),
      waterDelta: '-8.1%',
      isWaterGood: true,
      wasteMt: baseWaste.toLocaleString(),
      wasteDelta: '+12.5%',
      isWasteGood: true,
      scope1: Math.round(baseEmissions * 0.41).toLocaleString(),
      scope2: Math.round(baseEmissions * 0.59).toLocaleString(),
      recycledWaterPct: 70.0,
      wasteRecycledPct: 94.2
    };
  }, [selectedProject, projectMultiplier, periodMultiplier, storeKpis]);

  // Dynamic Chart Resolution based on selectedView (Monthly, Quarterly, Yearly)
  const timeLabels = useMemo(() => {
    if (selectedView === 'Quarterly') {
      return ['Q1 FY26', 'Q2 FY26', 'Q3 FY26', 'Q4 FY26'];
    }
    if (selectedView === 'Yearly') {
      return ['FY 2023-24', 'FY 2024-25', 'FY 2025-26', 'FY 2026-27'];
    }
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  }, [selectedView]);

  // Dynamic Emissions Trend Data
  const emissionsData = useMemo(() => {
    const mult = projectMultiplier * periodMultiplier;
    if (selectedView === 'Quarterly') {
      return [
        { m: 'Q1 FY26', s1: Math.round(3800 * mult), s2: Math.round(5900 * mult), total: Math.round(9700 * mult) },
        { m: 'Q2 FY26', s1: Math.round(4100 * mult), s2: Math.round(6200 * mult), total: Math.round(10300 * mult) },
        { m: 'Q3 FY26', s1: Math.round(3900 * mult), s2: Math.round(6000 * mult), total: Math.round(9900 * mult) },
        { m: 'Q4 FY26', s1: Math.round(4200 * mult), s2: Math.round(6400 * mult), total: Math.round(10600 * mult) }
      ];
    }
    if (selectedView === 'Yearly') {
      return [
        { m: 'FY 2023-24', s1: Math.round(42000 * mult), s2: Math.round(68000 * mult), total: Math.round(110000 * mult) },
        { m: 'FY 2024-25', s1: Math.round(46000 * mult), s2: Math.round(72000 * mult), total: Math.round(118000 * mult) },
        { m: 'FY 2025-26', s1: Math.round(49000 * mult), s2: Math.round(75000 * mult), total: Math.round(124000 * mult) },
        { m: 'FY 2026-27', s1: Math.round(51000 * mult), s2: Math.round(78000 * mult), total: Math.round(129000 * mult) }
      ];
    }

    return [
      { m: 'Jan', s1: Math.round(4200 * mult), s2: Math.round(7800 * mult), total: Math.round(12000 * mult) },
      { m: 'Feb', s1: Math.round(4100 * mult), s2: Math.round(7600 * mult), total: Math.round(11700 * mult) },
      { m: 'Mar', s1: Math.round(4600 * mult), s2: Math.round(8100 * mult), total: Math.round(12700 * mult) },
      { m: 'Apr', s1: Math.round(4400 * mult), s2: Math.round(7900 * mult), total: Math.round(12300 * mult) },
      { m: 'May', s1: Math.round(4900 * mult), s2: Math.round(8300 * mult), total: Math.round(13200 * mult) },
      { m: 'Jun', s1: Math.round(5200 * mult), s2: Math.round(8600 * mult), total: Math.round(13800 * mult) },
      { m: 'Jul', s1: Math.round(4800 * mult), s2: Math.round(8200 * mult), total: Math.round(13000 * mult) },
      { m: 'Aug', s1: Math.round(4700 * mult), s2: Math.round(8100 * mult), total: Math.round(12800 * mult) },
      { m: 'Sep', s1: Math.round(5300 * mult), s2: Math.round(8900 * mult), total: Math.round(14200 * mult) }
    ];
  }, [projectMultiplier, periodMultiplier, selectedView]);

  // Dynamic Energy Consumption Stacked Data
  const energyData = useMemo(() => {
    const mult = projectMultiplier * periodMultiplier;
    if (selectedView === 'Quarterly') {
      return [
        { m: 'Q1 FY26', grid: Math.round(3800 * mult), diesel: Math.round(1800 * mult), renew: Math.round(1200 * mult) },
        { m: 'Q2 FY26', grid: Math.round(4200 * mult), diesel: Math.round(1950 * mult), renew: Math.round(1400 * mult) },
        { m: 'Q3 FY26', grid: Math.round(4400 * mult), diesel: Math.round(2050 * mult), renew: Math.round(1600 * mult) },
        { m: 'Q4 FY26', grid: Math.round(4800 * mult), diesel: Math.round(2200 * mult), renew: Math.round(1850 * mult) }
      ];
    }
    if (selectedView === 'Yearly') {
      return [
        { m: 'FY 2023-24', grid: Math.round(38000 * mult), diesel: Math.round(18000 * mult), renew: Math.round(9000 * mult) },
        { m: 'FY 2024-25', grid: Math.round(42000 * mult), diesel: Math.round(19000 * mult), renew: Math.round(12000 * mult) },
        { m: 'FY 2025-26', grid: Math.round(45000 * mult), diesel: Math.round(20500 * mult), renew: Math.round(15500 * mult) },
        { m: 'FY 2026-27', grid: Math.round(49000 * mult), diesel: Math.round(22000 * mult), renew: Math.round(19000 * mult) }
      ];
    }

    return [
      { m: 'Jan', grid: Math.round(3800 * mult), diesel: Math.round(1800 * mult), renew: Math.round(1200 * mult) },
      { m: 'Feb', grid: Math.round(3700 * mult), diesel: Math.round(1700 * mult), renew: Math.round(1300 * mult) },
      { m: 'Mar', grid: Math.round(4200 * mult), diesel: Math.round(1900 * mult), renew: Math.round(1400 * mult) },
      { m: 'Apr', grid: Math.round(3900 * mult), diesel: Math.round(1750 * mult), renew: Math.round(1500 * mult) },
      { m: 'May', grid: Math.round(4400 * mult), diesel: Math.round(2000 * mult), renew: Math.round(1600 * mult) },
      { m: 'Jun', grid: Math.round(4600 * mult), diesel: Math.round(2100 * mult), renew: Math.round(1700 * mult) },
      { m: 'Jul', grid: Math.round(4300 * mult), diesel: Math.round(1950 * mult), renew: Math.round(1800 * mult) },
      { m: 'Aug', grid: Math.round(4200 * mult), diesel: Math.round(1900 * mult), renew: Math.round(1850 * mult) },
      { m: 'Sep', grid: Math.round(4800 * mult), diesel: Math.round(2200 * mult), renew: Math.round(1950 * mult) }
    ];
  }, [projectMultiplier, periodMultiplier, selectedView]);

  // Project comparisons filtered list
  const projectScores = useMemo(() => {
    const list = [
      { name: 'Zojila Tunnel (PKG-2)', energy: 30, water: 25, waste: 20, safety: 13, total: '88%' },
      { name: 'Bengaluru Metro', energy: 28, water: 22, waste: 18, safety: 14, total: '82%' },
      { name: 'Krishna Water Supply', energy: 32, water: 28, waste: 19, safety: 13, total: '92%' },
      { name: 'MEIL Energy Park', energy: 34, water: 24, waste: 18, safety: 14, total: '90%' },
      { name: 'Hyderabad Infra Park', energy: 26, water: 20, waste: 17, safety: 13, total: '76%' }
    ];
    if (selectedProject === 'All Projects') return list;
    return list.filter((p) => p.name.toLowerCase().includes(selectedProject.toLowerCase().split(' ')[0]));
  }, [selectedProject]);

  // Key calculated insights
  const insights = [
    {
      text: `Emissions tracking ${computedKpis.emissionsDelta} under CEA Grid v19 Baseline.`,
      icon: TrendingUp,
      bg: 'rgba(2, 132, 199, 0.1)',
      color: '#0284C7'
    },
    {
      text: `Water recycling maintained at ${computedKpis.recycledWaterPct}% across operational sites.`,
      icon: Droplets,
      bg: 'rgba(14, 165, 233, 0.1)',
      color: '#0284C7'
    },
    {
      text: `Waste diversion from landfill confirmed at ${computedKpis.wasteRecycledPct}% with CPCB passbooks.`,
      icon: Trash2,
      bg: 'rgba(249, 115, 22, 0.1)',
      color: '#EA580C'
    },
    {
      text: 'Safety data assurance completed with 100% verified toolbox talks.',
      icon: ShieldCheck,
      bg: 'rgba(22, 163, 74, 0.1)',
      color: '#16A34A'
    }
  ];

  // Completeness breakdown matching donut
  const moduleCompleteness = [
    { name: 'Energy', pct: 92, color: '#38BDF8' },
    { name: 'Water', pct: 86, color: '#0284C7' },
    { name: 'Waste', pct: 84, color: '#F59E0B' },
    { name: 'Safety', pct: 98, color: '#10B981' },
    { name: 'Social', pct: 76, color: '#EC4899' },
    { name: 'Governance', pct: 90, color: '#8B5CF6' }
  ];

  // SVG Chart Scaling
  const svgWidth = 460;
  const svgHeight = 150;
  const paddingLeft = 36;
  const paddingBottom = 22;
  const paddingTop = 10;
  const chartW = svgWidth - paddingLeft;
  const chartH = svgHeight - paddingBottom - paddingTop;
  
  const maxY = useMemo(() => {
    const maxVal = Math.max(...emissionsData.map(d => Math.max(d.s1, d.s2, d.total)), 1);
    return maxVal * 1.25;
  }, [emissionsData]);

  const maxEnergyY = useMemo(() => {
    const maxVal = Math.max(...energyData.map(d => (d.grid + d.diesel + d.renew)), 1);
    return maxVal * 1.25;
  }, [energyData]);

  const getX = (index) => paddingLeft + (index / (emissionsData.length - 1 || 1)) * chartW;
  const getY = (val) => paddingTop + chartH - (val / maxY) * chartH;

  const scope1Points = emissionsData.map((d, i) => `${getX(i)},${getY(d.s1)}`).join(' ');
  const scope2Points = emissionsData.map((d, i) => `${getX(i)},${getY(d.s2)}`).join(' ');
  const scope2Area = `${scope2Points} ${getX(emissionsData.length - 1)},${paddingTop + chartH} ${paddingLeft},${paddingTop + chartH}`;

  // Reset Filters
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
Active Metric: ${selectedMetric}

KPI SUMMARY:
Total GHG Emissions: ${computedKpis.totalEmissions} tCO2e (${computedKpis.emissionsDelta})
Scope 1 Direct Fuel: ${computedKpis.scope1} tCO2e
Scope 2 Indirect Grid (CEA v19): ${computedKpis.scope2} tCO2e
Energy Consumption: ${computedKpis.energyMwh} MWh (${computedKpis.energyDelta})
Water Consumption: ${computedKpis.waterKl} KL (${computedKpis.waterDelta})
Water Recycled Share: ${computedKpis.recycledWaterPct}% (Zero Liquid Discharge Compliant)
Waste Generated: ${computedKpis.wasteMt} MT (${computedKpis.wasteDelta})
Waste Diverted from Landfill: ${computedKpis.wasteRecycledPct}%

EMISSIONS SERIES (${selectedView}):
${selectedView},Scope 1 (tCO2e),Scope 2 (tCO2e),Total (tCO2e)
${emissionsData.map(e => `${e.m},${e.s1},${e.s2},${e.total}`).join('\n')}

ENERGY MIX SERIES (${selectedView}):
${selectedView},Grid (MWh),Diesel (MWh),Renewable (MWh)
${energyData.map(e => `${e.m},${e.grid},${e.diesel},${e.renew}`).join('\n')}
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MEIL_ESG_Analytics_${selectedProject.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedPeriod.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="an-container">
      {/* 1. Page Header */}
      <div className="an-page-header">
        <div className="an-header-left">
          <div className="an-header-icon-box">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="an-page-title">Analytics Studio</h1>
            <p className="an-page-subtitle">
              Live ESG performance telemetry, Scope 1 & 2 carbon footprints, and BRSR metrics for {selectedProject}.
            </p>
          </div>
        </div>

        <button 
          type="button"
          className="an-btn-primary-action"
          onClick={handleExport}
        >
          <Download size={15} />
          <span>Export Analysis</span>
        </button>
      </div>

      {/* 2. Interactive Glass Filter Bar */}
      <div className="an-filter-bar-card">
        <div className="an-filter-items">
          <div className="an-filter-item">
            <span className="an-filter-label">Project / Site</span>
            <select 
              className="an-filter-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="All Projects">All Projects (Group Aggregation)</option>
              <option value="Zojila Tunnel (PKG-2)">Zojila Tunnel (PKG-2)</option>
              <option value="Bengaluru Metro">Bengaluru Metro Phase 2</option>
              <option value="Krishna Water Supply">Krishna Water Supply</option>
              <option value="MEIL Energy Park">MEIL Energy Park 500MW</option>
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
              <option value="FY 2026-27">FY 2026-27 (Current)</option>
              <option value="FY 2025-26">FY 2025-26 (Baseline)</option>
              <option value="Q2 FY 2026-27">Q2 FY 2026-27 (Quarter)</option>
            </select>
          </div>

          <div className="an-filter-item">
            <span className="an-filter-label">Metric Focus</span>
            <select 
              className="an-filter-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="All Metrics">All Metrics</option>
              <option value="Emissions">GHG Emissions (Scope 1 & 2)</option>
              <option value="Energy">Energy (MWh)</option>
              <option value="Water">Water & ZLD (kL)</option>
              <option value="Waste">Waste Circularity (MT)</option>
            </select>
          </div>

          <div className="an-filter-item">
            <span className="an-filter-label">Resolution / View</span>
            <select 
              className="an-filter-select"
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
            >
              <option value="Monthly">Monthly View</option>
              <option value="Quarterly">Quarterly View</option>
              <option value="Yearly">Yearly Comparison</option>
            </select>
          </div>
        </div>

        <button 
          type="button"
          className="an-reset-btn"
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>

      {/* 3. 4 Top KPI Cards Row */}
      <div className="an-kpi-grid">
        {/* Total Emissions */}
        <div 
          className="an-kpi-card" 
          style={{ cursor: 'pointer' }}
          onClick={() => setDetailsModal('emissions')}
          title="Click to view GHG Methodology"
        >
          <div className="an-kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' }}>
            <Flame size={22} />
          </div>
          <div className="an-kpi-content">
            <div className="an-kpi-title">Total Emissions (tCO₂e)</div>
            <div className="an-kpi-val-row">
              <span className="an-kpi-val">{computedKpis.totalEmissions}</span>
              <span 
                className="an-kpi-badge" 
                style={{ 
                  background: computedKpis.isEmissionsGood ? 'rgba(22, 163, 74, 0.12)' : 'rgba(239, 68, 68, 0.12)', 
                  color: computedKpis.isEmissionsGood ? '#16A34A' : '#DC2626' 
                }}
              >
                {computedKpis.isEmissionsGood ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />} 
                {computedKpis.emissionsDelta}
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
              Scope 1: {computedKpis.scope1} • Scope 2: {computedKpis.scope2}
            </div>
          </div>
        </div>

        {/* Energy Consumption */}
        <div 
          className="an-kpi-card"
          style={{ cursor: 'pointer' }}
          onClick={() => setDetailsModal('energy')}
          title="Click to view Energy Telemetry"
        >
          <div className="an-kpi-icon-wrap" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}>
            <Zap size={22} />
          </div>
          <div className="an-kpi-content">
            <div className="an-kpi-title">Energy Consumption (MWh)</div>
            <div className="an-kpi-val-row">
              <span className="an-kpi-val">{computedKpis.energyMwh}</span>
              <span className="an-kpi-badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
                <ArrowDownRight size={12} /> {computedKpis.energyDelta}
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
              Grid: 72% • Diesel: 16% • Solar: 12%
            </div>
          </div>
        </div>

        {/* Water Consumption */}
        <div 
          className="an-kpi-card"
          style={{ cursor: 'pointer' }}
          onClick={() => setDetailsModal('water')}
          title="Click to view Water Balance"
        >
          <div className="an-kpi-icon-wrap" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0284C7' }}>
            <Droplets size={22} />
          </div>
          <div className="an-kpi-content">
            <div className="an-kpi-title">Water Consumption (KL)</div>
            <div className="an-kpi-val-row">
              <span className="an-kpi-val">{computedKpis.waterKl}</span>
              <span className="an-kpi-badge" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                <ArrowDownRight size={12} /> {computedKpis.waterDelta}
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#16A34A', marginTop: '2px', fontWeight: 600 }}>
              Recycled Share: {computedKpis.recycledWaterPct}% (ZLD Active)
            </div>
          </div>
        </div>

        {/* Waste Generated */}
        <div 
          className="an-kpi-card"
          style={{ cursor: 'pointer' }}
          onClick={() => setDetailsModal('waste')}
          title="Click to view Circularity Registry"
        >
          <div className="an-kpi-icon-wrap" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#EA580C' }}>
            <Trash2 size={22} />
          </div>
          <div className="an-kpi-content">
            <div className="an-kpi-title">Waste Generated (MT)</div>
            <div className="an-kpi-val-row">
              <span className="an-kpi-val">{computedKpis.wasteMt}</span>
              <span className="an-kpi-badge" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
                <ArrowUpRight size={12} /> {computedKpis.wasteDelta}
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#16A34A', marginTop: '2px', fontWeight: 600 }}>
              Landfill Diversion: {computedKpis.wasteRecycledPct}%
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main 2 Charts Row */}
      <div className="an-charts-grid">
        {/* Left Chart: Emissions Trend (Scope 1 vs Scope 2) */}
        <div className="an-chart-card">
          <div className="an-chart-header">
            <span className="an-chart-title">Emissions Trend (Scope 1 vs Scope 2) — {selectedView}</span>
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
                type="button"
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
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const val = Math.round(maxY * pct);
                const y = paddingTop + chartH - (pct * chartH);
                return (
                  <g key={idx}>
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
                      {val >= 1000 ? `${Math.round(val / 1000)}k` : val}
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

                    <circle 
                      cx={cx} 
                      cy={cy2} 
                      r={isHovered ? 5 : 3.5} 
                      fill="#FFFFFF" 
                      stroke="#0284C7" 
                      strokeWidth="2" 
                    />

                    <circle 
                      cx={cx} 
                      cy={cy1} 
                      r={isHovered ? 4.5 : 3} 
                      fill="#FFFFFF" 
                      stroke="#38BDF8" 
                      strokeWidth="2" 
                    />

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
                  left: `${(timeLabels.indexOf(hoveredMonth) / (timeLabels.length - 1 || 1)) * 75 + 12}%`,
                  top: '12px'
                }}
              >
                <div style={{ fontWeight: 800, color: '#0F172A', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', paddingBottom: '3px', marginBottom: '2px' }}>
                  {hoveredMonth} Emissions
                </div>
                <div style={{ color: '#0284C7', fontWeight: 700 }}>
                  Scope 2 (Grid): {emissionsData.find(e => e.m === hoveredMonth)?.s2} tCO₂e
                </div>
                <div style={{ color: '#38BDF8', fontWeight: 700 }}>
                  Scope 1 (Fuel): {emissionsData.find(e => e.m === hoveredMonth)?.s1} tCO₂e
                </div>
                <div style={{ fontSize: '9px', color: '#64748B', marginTop: '2px' }}>
                  CEA Grid v19 Baseline Factor: 0.716 kg/kWh
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Energy Consumption */}
        <div className="an-chart-card">
          <div className="an-chart-header">
            <span className="an-chart-title">Energy Consumption Mix — {selectedView}</span>
            <div className="an-chart-controls">
              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>{selectedView}</span>
              <button 
                type="button"
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
              <span>Grid Power</span>
            </div>
            <div className="an-legend-item">
              <span className="an-legend-dot" style={{ background: '#F59E0B' }} />
              <span>Diesel Genset</span>
            </div>
            <div className="an-legend-item">
              <span className="an-legend-dot" style={{ background: '#10B981' }} />
              <span>Solar / Renewable</span>
            </div>
          </div>

          {/* SVG Stacked Bar Graph */}
          <div className="an-svg-container" onMouseLeave={() => setHoveredEnergyMonth(null)}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%' }}>
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const val = Math.round(maxEnergyY * pct);
                const y = paddingTop + chartH - (pct * chartH);
                return (
                  <g key={idx}>
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
                      {val >= 1000 ? `${Math.round(val / 1000)}k` : val}
                    </text>
                  </g>
                );
              })}

              {energyData.map((d, i) => {
                const cx = getX(i);
                const barWidth = 16;
                
                const hRenew = (d.renew / maxEnergyY) * chartH;
                const hDiesel = (d.diesel / maxEnergyY) * chartH;
                const hGrid = (d.grid / maxEnergyY) * chartH;

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
                    <rect 
                      x={cx - barWidth / 2} 
                      y={yGrid} 
                      width={barWidth} 
                      height={hGrid} 
                      fill="#0284C7" 
                      rx="1"
                    />

                    <rect 
                      x={cx - barWidth / 2} 
                      y={yDiesel} 
                      width={barWidth} 
                      height={hDiesel} 
                      fill="#F59E0B" 
                    />

                    <rect 
                      x={cx - barWidth / 2} 
                      y={yRenew} 
                      width={barWidth} 
                      height={hRenew} 
                      fill="#10B981" 
                      rx="2"
                    />

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

            {hoveredEnergyMonth && (
              <div 
                className="an-tooltip"
                style={{
                  left: `${(timeLabels.indexOf(hoveredEnergyMonth) / (timeLabels.length - 1 || 1)) * 75 + 12}%`,
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
                type="button"
                className="an-bottom-pill-btn"
                onClick={() => onNavigate && onNavigate('my-project')}
              >
                View Sites
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
            <span className="an-bottom-title">Calculated ESG Insights</span>
            <button 
              type="button" 
              className="an-bottom-pill-btn"
              onClick={() => onNavigate?.('reports')}
            >
              Reports
            </button>
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
            <span className="an-bottom-title">Assurance Completeness</span>
          </div>

          <div className="an-completeness-body">
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
                  strokeDashoffset={238.76 * (1 - 0.88)} 
                  strokeLinecap="round" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
              <div className="an-donut-inner">
                <span className="an-donut-pct">88%</span>
                <span className="an-donut-label">Assured</span>
              </div>
            </div>

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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, width: 520, maxWidth: '92%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}>
                  {detailsModal === 'emissions' ? 'GHG Protocol Accounting' : detailsModal === 'energy' ? 'Energy Transmission Telemetry' : detailsModal === 'water' ? 'Water Circularity Balance' : 'Waste TSDF Manifests'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                  {detailsModal === 'emissions' ? 'CEA India Grid Baseline Methodology' : detailsModal === 'energy' ? '33kV Substation Telemetry Architecture' : detailsModal === 'water' ? 'Zero Liquid Discharge (ZLD) Audit' : 'Hazardous Waste Form 10 Compliance'}
                </h3>
              </div>
              <button onClick={() => setDetailsModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748B' }}>✕</button>
            </div>

            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, fontSize: '12.5px', color: '#334155', lineHeight: 1.6, marginBottom: 16 }}>
              {detailsModal === 'emissions' ? (
                <>
                  <p><strong>Baseline Standard:</strong> Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector, Version 19.0.</p>
                  <p style={{ marginTop: 6 }}><strong>Scope 2 Grid Factor:</strong> <span style={{ color: '#2563EB', fontWeight: 700 }}>0.716 kg CO₂e / kWh</span> (weighted combined margin).</p>
                  <p style={{ marginTop: 6 }}><strong>Scope 1 Fuel Factor:</strong> High-Speed Diesel (HSD) calibrated at <strong>2.68 kg CO₂e / Liter</strong>.</p>
                  <p style={{ marginTop: 6 }}><strong>Assurance Status:</strong> Full compliance with SEBI BRSR Core Circulars (2023 & 2025).</p>
                </>
              ) : detailsModal === 'energy' ? (
                <>
                  <p><strong>Grid Interconnection:</strong> Dedicated 33kV & 11kV substation feeder lines with bidirectional ABT-compliant smart meters.</p>
                  <p style={{ marginTop: 6 }}><strong>Telemetry Sync:</strong> Automated optical port data extraction linked directly with DISCOM billing invoices.</p>
                  <p style={{ marginTop: 6 }}><strong>Diesel Backup:</strong> Continuous PLC fuel flow sensors with digital weighbridge integration.</p>
                </>
              ) : detailsModal === 'water' ? (
                <>
                  <p><strong>ZLD Compliance:</strong> 100% of treated wastewater recirculated into tunnel rock excavation and dust mitigation.</p>
                  <p style={{ marginTop: 6 }}><strong>Lab Certification:</strong> NABL accredited BOD & COD effluent reports uploaded and hashed.</p>
                  <p style={{ marginTop: 6 }}><strong>Recycled Share:</strong> Consistently maintained above 70% statutory target.</p>
                </>
              ) : (
                <>
                  <p><strong>Hazardous Manifests:</strong> Form 10 manifests verified with CPCB registered re-refiners and TSDF facilities.</p>
                  <p style={{ marginTop: 6 }}><strong>Circularity Recovery:</strong> Over 94% steel and construction scrap remelted in electric arc furnaces.</p>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="an-chart-action-btn"
                style={{ padding: '8px 20px', fontSize: '12px' }}
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
export { AnalyticsModule };
