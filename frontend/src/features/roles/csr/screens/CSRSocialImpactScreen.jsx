import React, { useState } from 'react';
import {
  Target,
  Search,
  Plus,
  TrendingUp,
  FileCheck2,
  Paperclip,
  Eye,
  Edit2,
  X
} from 'lucide-react';
import { INITIAL_IMPACT_INDICATORS } from '../csrData';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function CSRSocialImpactScreen({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [indicators, setIndicators] = useState(INITIAL_IMPACT_INDICATORS);
  const [isRecordImpactOpen, setIsRecordImpactOpen] = useState(false);
  const [isAddIndicatorOpen, setIsAddIndicatorOpen] = useState(false);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);
  const [editingIndicator, setEditingIndicator] = useState(null);

  const [newIndicatorForm, setNewIndicatorForm] = useState({
    indicator: '',
    project: 'Clean Drinking Water RO Plants',
    baseline: '0',
    target: '100',
    current: '25',
    unit: 'Units',
    evidence_ref: 'EV-CSR-2026-091'
  });

  const handleAddIndicatorSubmit = (e) => {
    e.preventDefault();
    if (!newIndicatorForm.indicator) return;
    const created = {
      id: `IND-${Date.now().toString().slice(-4)}`,
      indicator: newIndicatorForm.indicator,
      project: newIndicatorForm.project,
      baseline: newIndicatorForm.baseline,
      target: newIndicatorForm.target,
      current: newIndicatorForm.current,
      unit: newIndicatorForm.unit,
      status: 'In Progress',
      evidence_ref: newIndicatorForm.evidence_ref
    };
    setIndicators([created, ...indicators]);
    setIsAddIndicatorOpen(false);
    setIsRecordImpactOpen(false);
    setNewIndicatorForm({
      indicator: '',
      project: 'Clean Drinking Water RO Plants',
      baseline: '0',
      target: '100',
      current: '25',
      unit: 'Units',
      evidence_ref: 'EV-CSR-2026-091'
    });
  };

  const handleUpdateCurrentValue = (e) => {
    e.preventDefault();
    if (!editingIndicator) return;
    setIndicators(prev => prev.map(ind => ind.id === editingIndicator.id ? { ...ind, current: editingIndicator.current } : ind));
    setEditingIndicator(null);
  };

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
            <button className="csr-btn-primary" onClick={() => setIsRecordImpactOpen(true)}>
              <Plus size={16} />
              + Record Impact
            </button>
            <button className="csr-btn-outline" onClick={() => setIsAddIndicatorOpen(true)}>
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
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              {new Set(indicators.map(i => i.project)).size}
            </div>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>Active Portfolio Coverage</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} />
          </div>
        </div>

        {/* Indicators Reported */}
        <div className="csr-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Indicators Reported</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>{indicators.length}</div>
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
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>
              {Math.round((indicators.filter(i => i.status?.toLowerCase() === 'achieved' || i.status?.toLowerCase() === 'on track').length / (indicators.length || 1)) * 100)}%
            </div>
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
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#7C3AED', marginTop: '2px' }}>
              {Math.round((indicators.filter(i => i.evidence_ref).length / (indicators.length || 1)) * 100)}%
            </div>
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
                      onClick={() => setActiveEvidenceModal(ind)}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      className="csr-btn-outline"
                      style={{ padding: '4px 8px' }}
                      title="Update Value"
                      onClick={() => setEditingIndicator({ ...ind })}
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

      {/* Record Impact / Add Indicator Modal */}
      {(isRecordImpactOpen || isAddIndicatorOpen) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => { setIsRecordImpactOpen(false); setIsAddIndicatorOpen(false); }}
        >
          <div
            className="csr-glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                {isRecordImpactOpen ? 'Record Social Impact Metric' : 'Add Custom KPI Indicator'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsRecordImpactOpen(false); setIsAddIndicatorOpen(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddIndicatorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Indicator Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Total Direct Beneficiaries Reached"
                  value={newIndicatorForm.indicator}
                  onChange={(e) => setNewIndicatorForm({ ...newIndicatorForm, indicator: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>CSR Program / Project</label>
                <input
                  type="text"
                  required
                  value={newIndicatorForm.project}
                  onChange={(e) => setNewIndicatorForm({ ...newIndicatorForm, project: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Baseline</label>
                  <input
                    type="number"
                    value={newIndicatorForm.baseline}
                    onChange={(e) => setNewIndicatorForm({ ...newIndicatorForm, baseline: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Target</label>
                  <input
                    type="number"
                    value={newIndicatorForm.target}
                    onChange={(e) => setNewIndicatorForm({ ...newIndicatorForm, target: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Current</label>
                  <input
                    type="number"
                    value={newIndicatorForm.current}
                    onChange={(e) => setNewIndicatorForm({ ...newIndicatorForm, current: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="csr-btn-outline"
                  onClick={() => { setIsRecordImpactOpen(false); setIsAddIndicatorOpen(false); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="csr-btn-primary"
                >
                  Save Indicator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Evidence & Methodology Modal */}
      {activeEvidenceModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveEvidenceModal(null)}
        >
          <div
            className="csr-glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  {activeEvidenceModal.indicator}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {activeEvidenceModal.project} • Evidence Ref: {activeEvidenceModal.evidence_ref}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveEvidenceModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Evaluation Methodology</div>
              <div style={{ fontSize: '13px', color: '#1E293B', marginTop: '4px' }}>
                {activeEvidenceModal.methodology || 'Third-party social audit conducted by accredited agency following SROI (Social Return On Investment) framework.'}
              </div>
            </div>

            <div style={{ padding: '12px', background: '#EFF6FF', borderRadius: '10px', fontSize: '12px', color: '#1E40AF', marginBottom: '14px' }}>
              Statutory verification compliant with Schedule VII of Companies Act 2013 and SEBI BRSR Core.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="csr-btn-outline"
                onClick={() => setActiveEvidenceModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="csr-btn-primary"
                onClick={() => {
                  exportToCsv(`Impact_Evidence_${activeEvidenceModal.id}.csv`, [activeEvidenceModal]);
                  setActiveEvidenceModal(null);
                }}
              >
                Export Evidence Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Update Value Modal */}
      {editingIndicator && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setEditingIndicator(null)}
        >
          <div
            className="csr-glass-card"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '24px',
              borderRadius: '20px',
              background: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                Update Measured Value
              </h3>
              <button
                type="button"
                onClick={() => setEditingIndicator(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateCurrentValue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Indicator</label>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{editingIndicator.indicator}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>New Measured Value ({editingIndicator.unit})</label>
                <input
                  type="number"
                  required
                  value={editingIndicator.current}
                  onChange={(e) => setEditingIndicator({ ...editingIndicator, current: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="csr-btn-outline"
                  onClick={() => setEditingIndicator(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="csr-btn-primary"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
