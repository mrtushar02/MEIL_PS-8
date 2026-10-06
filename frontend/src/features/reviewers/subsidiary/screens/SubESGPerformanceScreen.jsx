import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Zap,
  Droplet,
  Trash2,
  Flame,
  ShieldCheck,
  Calendar,
  PieChart
} from 'lucide-react';

export default function SubESGPerformanceScreen() {
  const [activeTab, setActiveTab] = useState('Environmental');

  const monthlyEmissions = [
    { month: 'Apr', scope1: 1420, scope2: 950 },
    { month: 'May', scope1: 1480, scope2: 980 },
    { month: 'Jun', scope1: 1390, scope2: 920 },
    { month: 'Jul', scope1: 1520, scope2: 1010 },
    { month: 'Aug', scope1: 1460, scope2: 970 },
    { month: 'Sep', scope1: 1350, scope2: 890 }
  ];

  return (
    <div className="sub-esg-performance-screen">
      {/* Pillar Tabs Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Subsidiary ESG Performance
          </h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
            Consolidated environmental, social, and governance indicators for MEIL Core Infrastructure Division
          </p>
        </div>

        <div className="sub-segmented-nav">
          {['Environmental', 'Social', 'Governance'].map(tab => (
            <button
              key={tab}
              className={`sub-segmented-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Metric Cards (Matching Screen 4) */}
      <div className="sub-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
        <div className="sub-kpi-card">
          <span className="sub-kpi-label">Carbon Emissions</span>
          <div className="sub-kpi-val" style={{ color: '#0F172A' }}>
            8,356 <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>tCO2e</span>
          </div>
          <span style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingDown size={12} /> -12% vs FY25
          </span>
        </div>

        <div className="sub-kpi-card">
          <span className="sub-kpi-label">Energy Consumption</span>
          <div className="sub-kpi-val" style={{ color: '#0F172A' }}>
            12.4M <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>kWh</span>
          </div>
          <span style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingDown size={12} /> -5% vs FY25
          </span>
        </div>

        <div className="sub-kpi-card">
          <span className="sub-kpi-label">Water Withdrawal</span>
          <div className="sub-kpi-val" style={{ color: '#0284C7' }}>
            420,630 <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>KL</span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B' }}>88.4% Recycled/Reused</span>
        </div>

        <div className="sub-kpi-card">
          <span className="sub-kpi-label">Waste Diversion</span>
          <div className="sub-kpi-val" style={{ color: '#16A34A' }}>81.4%</div>
          <span style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> +8.2% vs FY25
          </span>
        </div>
      </div>

      {/* Charts Dual Layout (Matching Screen 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Left: Scope 1 & 2 Trend Chart */}
        <div className="sub-card">
          <div className="sub-card-header">
            <div>
              <h3 className="sub-card-title">Scope 1 & 2 Emissions Trend</h3>
              <p className="sub-card-subtitle">Monthly trajectory over current financial year</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
              <span style={{ color: '#2563EB', fontWeight: 600 }}>● Scope 1</span>
              <span style={{ color: '#0EA5E9', fontWeight: 600 }}>● Scope 2</span>
            </div>
          </div>

          <div style={{ padding: '10px 0' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '180px' }}>
              {/* Grid Lines */}
              <line x1="40" y1="30" x2="480" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#F1F5F9" strokeWidth="1" />

              {/* Scope 1 Line */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                points="60,60 140,50 220,70 300,40 380,55 460,80"
              />
              {/* Scope 2 Line */}
              <polyline
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2.5"
                points="60,100 140,95 220,105 300,90 380,98 460,115"
              />

              {/* Month Labels */}
              {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m, idx) => (
                <text key={m} x={60 + idx * 80} y="152" fontSize="10" fill="#64748B" textAnchor="middle">
                  {m}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Energy Mix Donut */}
        <div className="sub-card">
          <div className="sub-card-header">
            <div>
              <h3 className="sub-card-title">Division Energy Mix</h3>
              <p className="sub-card-subtitle">Grid vs. On-site Renewables & Fuels</p>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>12.4M kWh</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
            {/* Donut representation */}
            <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'conic-gradient(#2563EB 0% 68%, #10B981 68% 90%, #F59E0B 90% 98%, #94A3B8 98% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>
                68% Grid
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2563EB' }} />
                <span>Grid Supply (68%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10B981' }} />
                <span>Renewable Solar (22%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F59E0B' }} />
                <span>Diesel Gensets (8%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#94A3B8' }} />
                <span>Other Fuels (2%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
