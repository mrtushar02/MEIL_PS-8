import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Clock,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';

export default function EHSTrainingScreen({
  _trainingBatches = [],
  _onCreateTrainingBatch,
  _onNavigateTab
}) {

  // Batches matching image Panel 6
  const batches = [
    {
      id: 'TB-2026-21',
      topic: 'Working at Height',
      project: 'Zojila',
      participants: 35,
      type: 'Mandatory',
      status: 'Completed'
    },
    {
      id: 'TB-2026-20',
      topic: 'PPE Awareness',
      project: 'Access Road',
      participants: 28,
      type: 'Refresher',
      status: 'In Progress'
    },
    {
      id: 'TB-2026-19',
      topic: 'Fire Safety',
      project: 'Main Tunnel',
      participants: 42,
      type: 'Mandatory',
      status: 'In Progress'
    },
    {
      id: 'TB-2026-18',
      topic: 'Emergency Response',
      project: 'Bridge Site',
      participants: 30,
      type: 'Specialized',
      status: 'Completed'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── 1. PAGE HEADER (Matching Image Panel 6) ──── */}
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Safety Training
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Mandatory site inductions, toolbox talks, and statutory competency tracking.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button" 
              className="ehs-btn ehs-btn-outline"
              style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              + Log Training Batch
            </button>
            <button 
              type="button" 
              className="ehs-btn ehs-btn-blue"
              style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}
            >
              <PlusCircle size={14} />
              <span>+ Create Requirement</span>
            </button>
          </div>
        </div>
      </div>

      {/* ──── 2. TOP KPI CARDS (5 Cards in a Row - Matching Image Panel 6) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Training Coverage</span>
            <GraduationCap size={14} color="#059669" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">92%</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#059669', fontWeight: 700 }}>Mandatory Inductions</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Personnel Trained</span>
            <Users size={14} color="#2563EB" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">1,284</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Direct + Contract workers</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Training Hours</span>
            <Clock size={14} color="#2563EB" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">4,860</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>28.4 hrs / employee avg</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Pending</span>
            <Clock size={14} color="#D97706" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val">102</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span>Scheduled this cycle</span>
          </div>
        </div>

        <div className="ehs-kpi-card">
          <div className="ehs-kpi-top">
            <span className="ehs-kpi-label">Expired</span>
            <AlertTriangle size={14} color="#DC2626" />
          </div>
          <div className="ehs-kpi-value-row">
            <span className="ehs-kpi-main-val" style={{ color: '#DC2626' }}>18</span>
          </div>
          <div className="ehs-kpi-subtext">
            <span style={{ color: '#DC2626', fontWeight: 700 }}>Recertification Due</span>
          </div>
        </div>
      </div>

      {/* ──── 3. SPLIT MAIN SECTION: TREND (LEFT 55%) + BATCHES (RIGHT 45%) ──── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Left: Training Coverage Trend */}
        <div className="ehs-glass-card" style={{ padding: '18px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Training Coverage Trend
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#475569' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#93C5FD' }} /> Completed
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} /> Required
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: '210px' }}>
            <svg viewBox="0 0 450 210" style={{ width: '100%', height: '100%' }}>
              <line x1="30" y1="20" x2="430" y2="20" stroke="#F1F5F9" />
              <line x1="30" y1="65" x2="430" y2="65" stroke="#F1F5F9" />
              <line x1="30" y1="110" x2="430" y2="110" stroke="#F1F5F9" />
              <line x1="30" y1="155" x2="430" y2="155" stroke="#F1F5F9" />
              <line x1="30" y1="175" x2="430" y2="175" stroke="#CBD5E1" />

              {/* Monthly Bars */}
              {[
                { m: 'Apr', h: 80, req: 95 },
                { m: 'May', h: 95, req: 105 },
                { m: 'Jun', h: 120, req: 125 },
                { m: 'Jul', h: 110, req: 115 },
                { m: 'Aug', h: 135, req: 140 },
                { m: 'Sep', h: 150, req: 155 }
              ].map((b, idx) => (
                <g key={b.m} transform={`translate(${55 + idx * 62}, 0)`}>
                  <rect x="0" y={175 - b.h} width="22" height={b.h} fill="#93C5FD" rx="3" />
                  <circle cx="11" cy={175 - b.req} r="3.5" fill="#2563EB" />
                  <text x="11" y="192" fontSize="10.5" fill="#64748B" textAnchor="middle">{b.m}</text>
                </g>
              ))}

              {/* Line linking required target dots */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2"
                points="66,80 128,70 190,50 252,60 314,35 376,20"
              />
            </svg>
          </div>
        </div>

        {/* Right: Recent Training Batches Table */}
        <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Recent Training Batches
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Daily Rosters</span>
          </div>

          <div className="ehs-table-container">
            <table className="ehs-data-table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Course / Topic</th>
                  <th>Project</th>
                  <th>People</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 800, color: '#2563EB' }}>{b.id}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{b.topic}</td>
                    <td style={{ color: '#475569' }}>{b.project}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{b.participants}</td>
                    <td style={{ fontSize: '11.5px', color: '#64748B' }}>{b.type}</td>
                    <td>
                      <span 
                        style={{ 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          padding: '2px 8px', 
                          borderRadius: '9999px',
                          background: b.status === 'Completed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                          color: b.status === 'Completed' ? '#059669' : '#D97706'
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
