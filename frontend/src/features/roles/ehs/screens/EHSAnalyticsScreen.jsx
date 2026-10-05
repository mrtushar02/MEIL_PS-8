import React, { useState } from 'react';
import {
  FileDown
} from 'lucide-react';

export default function EHSAnalyticsScreen({
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedPeriod, setSelectedPeriod] = useState('Sep 2026');
  const [selectedFreq, setSelectedFreq] = useState('Monthly');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER & CONTROLS (Matching Image Panel 10) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Analytics
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Predictive incident trends, severity distributions, and cross-project safety benchmarking.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <select 
              className="ehs-select-control"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
            >
              <option value="All Projects">All Projects (258+ Sites)</option>
              <option value="Zojila Tunnel">Zojila Tunnel</option>
              <option value="Access Road">Access Road</option>
              <option value="Camp Area">Camp Area</option>
              <option value="Bridge Site">Bridge Site</option>
            </select>

            <select 
              className="ehs-select-control"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
            >
              <option value="Sep 2026">Sep 2026</option>
              <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
              <option value="FY 2026-27 YTD">FY 2026-27 YTD</option>
            </select>

            <select 
              className="ehs-select-control"
              value={selectedFreq}
              onChange={(e) => setSelectedFreq(e.target.value)}
              style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}
            >
              <option value="Monthly">Monthly Frequency</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>

            <button 
              type="button" 
              className="ehs-btn ehs-btn-outline"
              style={{ padding: '6px 12px', fontSize: '12px', height: '32px' }}
            >
              <FileDown size={13} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (6 Cards in a Row - Matching Image Panel 10) ──── */}
      <div className="ehs-kpi-grid">
        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Total Incidents</span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">12</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Period total</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Incident Rate</span>
            <span style={{ fontSize: '11px', color: '#10B981' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">0.42</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Per 200k hours</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Near Misses</span>
            <span style={{ fontSize: '11px', color: '#10B981' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">28</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Proactive ratio: 2.3x</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">LTI</span>
            <span style={{ fontSize: '11px', color: '#F59E0B' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">1</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Lost Time Injury</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Training Coverage</span>
            <span style={{ fontSize: '11px', color: '#059669' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">92%</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#059669', fontWeight: 700 }}>Compliant Target</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Inspection Rate</span>
            <span style={{ fontSize: '11px', color: '#2563EB' }}>●</span>
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">87%</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>28 of 32 sites</span>
          </div>
        </div>
      </div>

      {/* ──── 3. THREE CHARTS IN A ROW (Matching Image Panel 10) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
        {/* Chart 1: Incident Trend Line Chart */}
        <div className="ehs-glass-card" style={{ padding: '16px 18px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Incident Trend
            </h3>
            <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', color: '#64748B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }} /> Incidents
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> Near Miss
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: '170px' }}>
            <svg viewBox="0 0 350 170" style={{ width: '100%', height: '100%' }}>
              <line x1="20" y1="20" x2="330" y2="20" stroke="#F1F5F9" />
              <line x1="20" y1="60" x2="330" y2="60" stroke="#F1F5F9" />
              <line x1="20" y1="100" x2="330" y2="100" stroke="#F1F5F9" />
              <line x1="20" y1="140" x2="330" y2="140" stroke="#CBD5E1" />

              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                points="30,80 80,60 130,50 180,70 230,45 280,35 320,30"
              />
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                points="30,120 80,110 130,95 180,105 230,90 280,85 320,75"
              />

              {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m, idx) => (
                <text key={m} x={35 + idx * 54} y="156" fontSize="10" fill="#64748B" textAnchor="middle">{m}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: Corrective Action Aging Donut Chart */}
        <div className="ehs-glass-card" style={{ padding: '16px 18px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
            Corrective Action Aging
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* 0-7 days: 45% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="5.5" strokeDasharray="45 100" />
                {/* 8-30 days: 30% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="5.5" strokeDasharray="30 100" strokeDashoffset="-45" />
                {/* 31-60 days: 15% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="5.5" strokeDasharray="15 100" strokeDashoffset="-75" />
                {/* 60+ days: 10% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="5.5" strokeDasharray="10 100" strokeDashoffset="-90" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10.5px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#059669' }}>● 0–7 Days</span>
                <strong>45%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#2563EB' }}>● 8–30 Days</span>
                <strong>30%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#D97706' }}>● 31–60 Days</span>
                <strong>15%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#DC2626' }}>● 60+ Days</span>
                <strong>10%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Project Safety Comparison Bar Chart */}
        <div className="ehs-glass-card" style={{ padding: '16px 18px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
            Project Safety Comparison
          </h3>

          <div style={{ width: '100%', height: '170px' }}>
            <svg viewBox="0 0 300 170" style={{ width: '100%', height: '100%' }}>
              <line x1="20" y1="20" x2="280" y2="20" stroke="#F1F5F9" />
              <line x1="20" y1="60" x2="280" y2="60" stroke="#F1F5F9" />
              <line x1="20" y1="100" x2="280" y2="100" stroke="#F1F5F9" />
              <line x1="20" y1="140" x2="280" y2="140" stroke="#CBD5E1" />

              {[
                { name: 'Zojila Tunnel', h: 100, color: '#2563EB' },
                { name: 'Access Road', h: 65, color: '#3B82F6' },
                { name: 'Camp Area', h: 45, color: '#60A5FA' },
                { name: 'Bridge Site', h: 80, color: '#93C5FD' }
              ].map((p, idx) => (
                <g key={p.name} transform={`translate(${40 + idx * 62}, 0)`}>
                  <rect x="0" y={140 - p.h} width="28" height={p.h} fill={p.color} rx="3" />
                  <text x="14" y="156" fontSize="9.5" fill="#64748B" textAnchor="middle">{p.name.split(' ')[0]}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
