import React, { useState } from 'react';
import {
  Target,
  Search,
  Plus,
  TrendingUp,
  FileCheck2,
  Paperclip,
  Eye,
  Edit2
} from 'lucide-react';
import { INITIAL_IMPACT_INDICATORS } from '../csrData';

export default function CSRSocialImpactScreen({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [indicators, setIndicators] = useState(INITIAL_IMPACT_INDICATORS);

  const filteredIndicators = indicators.filter((ind) =>
    ind.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ind.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ind.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusChipClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'achieved':
      case 'on track':
        return 'csr-status-chip active';
      case 'in progress':
        return 'csr-status-chip pending';
      default:
        return 'csr-status-chip medium';
    }
  };

  return (
    <div className="csr-screen-root" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ──── HERO BANNER ──── */}
      <div className="csr-hero-banner">
        <div className="csr-banner-top">
          <div className="csr-title-group">
            <div className="csr-title-icon-badge" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>
              <Target size={24} />
            </div>
            <div>
              <div className="csr-pill-tag" style={{ color: '#7C3AED', borderColor: 'rgba(124, 58, 237, 0.25)', background: 'rgba(124, 58, 237, 0.08)' }}>
                OUTCOME EVALUATION & METHODOLOGY
              </div>
              <h1 className="csr-hero-title">Social Impact</h1>
              <p className="csr-hero-subtitle">
                Track outcomes, indicators, project results and community impact against verified baselines.
              </p>
            </div>
          </div>

          <div className="csr-banner-actions">
            <button className="csr-btn-primary" onClick={() => alert('Opening Record Social Impact Dialog...')}>
              <Plus size={16} />
              + Record Impact
            </button>
            <button className="csr-btn-outline" onClick={() => alert('Add Custom KPI Indicator...')}>
              <Plus size={15} />
              + Add Indicator
            </button>
          </div>
        </div>
      </div>

      {/* ──── 4 KPI STATS ROW ──── */}
      <div className="csr-kpi-grid-4">
        {/* Projects With Impact Data */}
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Projects With Impact Data</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>20</div>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>83% of Active Projects</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} />
          </div>
        </div>

        {/* Indicators Reported */}
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Indicators Reported</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>48</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Quantitative & Qualitative</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck2 size={18} />
          </div>
        </div>

        {/* On Track */}
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>On Track</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>70%</div>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>Meeting Milestone Targets</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={18} />
          </div>
        </div>

        {/* Evidence Coverage */}
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Evidence Coverage</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#7C3AED', marginTop: '2px' }}>82%</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Attached & Geo-Audited</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paperclip size={18} />
          </div>
        </div>
      </div>

      {/* ──── SEARCH BAR ──── */}
      <div className="csr-filter-bar">
        <div className="csr-search-box">
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            className="csr-search-input"
            placeholder="Search indicators, projects, units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ──── SOCIAL IMPACT TABLE ──── */}
      <div className="csr-table-container">
        <table className="csr-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Project</th>
              <th>Baseline</th>
              <th>Target</th>
              <th>Current</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndicators.map((ind) => (
              <tr key={ind.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{ind.indicator}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Methodology: {ind.methodology}</div>
                </td>
                <td style={{ fontWeight: 700, color: '#2563EB' }}>{ind.project}</td>
                <td style={{ fontSize: '12.5px', color: '#64748B' }}>{ind.baseline.toLocaleString()}</td>
                <td style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>{ind.target.toLocaleString()}</td>
                <td style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A' }}>{ind.current.toLocaleString()}</td>
                <td style={{ fontSize: '12px', color: '#475569' }}>{ind.unit}</td>
                <td>
                  <span className={getStatusChipClass(ind.status)}>{ind.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px' }}
                      title="View Evidence & Methodology"
                      onClick={() => alert(`Indicator: ${ind.indicator}\nEvidence Ref: ${ind.evidence_ref}`)}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px' }}
                      title="Update Value"
                      onClick={() => alert(`Update current measured value for ${ind.indicator}`)}
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
