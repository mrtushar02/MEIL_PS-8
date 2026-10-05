import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Download,
  Check,
  X
} from 'lucide-react';
import { api } from '../../../services/api';

export default function HRWorkforceScreen({ reportingPeriod = 'FY 2026-27', triggerToast }) {
  const [selectedSub, setSelectedSub] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [records, setRecords] = useState([]);

  // Form state for adding demographic record
  const [formData, setFormData] = useState({
    category: 'Engineering & Project Managers',
    subsidiary_name: 'MEIL Core Infrastructure & EPC',
    male_count: '',
    female_count: '',
    permanent_count: '',
    contractual_count: '',
    differently_abled_count: '',
    turnover_rate_pct: ''
  });

  const loadRecords = async () => {
    try {
      const data = await api.getHRWorkforce(selectedSub, reportingPeriod);
      setRecords(data);
    } catch (e) {
      console.warn('Failed to load workforce records', e);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [selectedSub, reportingPeriod]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = !searchQuery || 
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subsidiary_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [records, searchQuery]);

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!formData.male_count && !formData.female_count) return;

    try {
      await api.createHRWorkforce({
        subsidiary_name: formData.subsidiary_name,
        category: formData.category,
        male_count: parseInt(formData.male_count) || 0,
        female_count: parseInt(formData.female_count) || 0,
        permanent_count: parseInt(formData.permanent_count) || 0,
        contractual_count: parseInt(formData.contractual_count) || 0,
        differently_abled_count: parseInt(formData.differently_abled_count) || 0,
        turnover_rate_pct: parseFloat(formData.turnover_rate_pct) || 0.0,
        reporting_period: reportingPeriod
      });

      triggerToast?.('Workforce demographic record registered into BRSR Register!');
      setShowAddModal(false);
      setFormData({
        category: 'Engineering & Project Managers',
        subsidiary_name: 'MEIL Core Infrastructure & EPC',
        male_count: '',
        female_count: '',
        permanent_count: '',
        contractual_count: '',
        differently_abled_count: '',
        turnover_rate_pct: ''
      });
      loadRecords();
    } catch {
      triggerToast?.('Failed to submit workforce record');
    }
  };

  const handleExportCSV = () => {
    const csvContent = "Category,Subsidiary,Total Workforce,Male,Female,Female %,Differently Abled (PwD),Turnover Rate\n" +
      filteredRecords.map(r => `"${r.category}","${r.subsidiary_name}",${r.total_count},${r.male_count},${r.female_count},${r.female_pct},${r.differently_abled_count},${r.turnover_rate_pct}`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MEIL_Workforce_Demographics_${reportingPeriod.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast?.('Exported Workforce Demographics CSV');
  };

  // Subsidiary breakdown
  const subsidiariesBreakdown = [
    { name: 'MEIL Core Infrastructure & EPC', direct: 6800, contract: 15600, total: 22400, femalePct: '12.4%' },
    { name: 'Olectra Greentech Limited', direct: 2900, contract: 3350, total: 6250, femalePct: '21.5%' },
    { name: 'Megha Gas (CGD Network)', direct: 1450, contract: 2650, total: 4100, femalePct: '16.2%' },
    { name: 'Drillmec S.p.A / Drillmec India', direct: 1200, contract: 2600, total: 3800, femalePct: '11.8%' },
    { name: 'ICOMM Tele Limited', direct: 1150, contract: 2450, total: 3600, femalePct: '18.9%' },
    { name: 'Evey Trans Private Limited', direct: 700, contract: 2000, total: 2700, femalePct: '14.0%' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Header Banner */}
      <div className="hr-header-banner">
        <div className="hr-header-left">
          <div className="hr-header-icon">
            <Users size={24} />
          </div>
          <div className="hr-header-title-box">
            <div className="hr-badge-row">
              <span className="hr-brsr-badge">SEBI BRSR Principle 3 (Essential Indicators 1 & 2)</span>
              <span className="hr-scope-tag">Employee Grade Breakdown • Gender Diversity • Turnover</span>
            </div>
            <h1 className="hr-title">Workforce Demographics & Grade Classifications</h1>
            <p className="hr-subtitle">
              Audited statutory headcount disclosures spanning Board of Directors, Key Managerial Personnel, down to EPC site labor.
            </p>
          </div>
        </div>

        <div className="hr-header-actions">
          <div className="hr-search-bar" style={{ width: '220px' }}>
            <Search size={14} color="#64748B" />
            <input 
              type="text" 
              className="hr-search-input" 
              placeholder="Filter grade or title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="hr-select-sub"
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
          >
            <option value="ALL">All Subsidiaries (6 Entities)</option>
            <option value="Core">MEIL Core Infrastructure</option>
            <option value="Olectra">Olectra Greentech</option>
            <option value="Megha Gas">Megha Gas</option>
            <option value="Drillmec">Drillmec S.p.A</option>
            <option value="ICOMM">ICOMM Tele</option>
            <option value="Evey">Evey Trans</option>
          </select>

          <button className="hr-btn-glass" onClick={handleExportCSV}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button className="hr-btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            <span>Add Workforce Disclosure</span>
          </button>
        </div>
      </div>

      {/* 2. Statutory Grade Breakdown Table (BRSR P3 EI 1 & 2) */}
      <div className="hr-card">
        <div className="hr-card-header">
          <div className="hr-card-title-box">
            <h3 className="hr-card-title">Employee Grade Category & Gender Disclosures (SEBI BRSR P3)</h3>
            <p className="hr-card-sub">Statutory classification with gender split, PwD inclusion, and turnover rates.</p>
          </div>
          <span className="hr-chip-success">Audited Headcount</span>
        </div>

        <div className="hr-table-wrap">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Category / Grade</th>
                <th>Total Workforce</th>
                <th>Male Personnel</th>
                <th>Female Personnel</th>
                <th>Female %</th>
                <th>Permanent Staff</th>
                <th>Contractual Workers</th>
                <th>Differently Abled (PwD)</th>
                <th>Turnover Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((row, i) => (
                <tr key={row.id || i}>
                  <td style={{ fontWeight: '700' }}>{row.category}</td>
                  <td><strong>{row.total_count.toLocaleString()}</strong></td>
                  <td>{row.male_count.toLocaleString()}</td>
                  <td>{row.female_count.toLocaleString()}</td>
                  <td><span style={{ fontWeight: '700', color: '#DB2777' }}>{row.female_pct}</span></td>
                  <td>{row.permanent_count?.toLocaleString() || '-'}</td>
                  <td>{row.contractual_count?.toLocaleString() || '-'}</td>
                  <td>{row.differently_abled_count}</td>
                  <td><span style={{ color: '#059669', fontWeight: '600' }}>{row.turnover_rate_pct}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Demographic Visualizations (2-Column Layout) */}
      <div className="hr-main-grid">
        {/* Left Column: Direct vs Contractual Headcount by Subsidiary */}
        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">Permanent vs Contractual Distribution by Operating Entity</h3>
              <p className="hr-card-sub">Full ratio comparison across MEIL's 6 principal infrastructure operating divisions.</p>
            </div>
            <span className="hr-chip-success">
              <Check size={10} /> Active Audited Headcount
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {subsidiariesBreakdown.map((sub, idx) => {
              const directRatio = (sub.direct / sub.total) * 100;
              const contractRatio = (sub.contract / sub.total) * 100;

              return (
                <div key={idx} className="hr-sub-card">
                  <div className="hr-sub-card-header">
                    <span className="hr-sub-name">{sub.name}</span>
                    <span className="hr-sub-total">{sub.total.toLocaleString()} total</span>
                  </div>

                  <div className="hr-stacked-bar">
                    <div className="hr-stacked-seg-direct" style={{ width: `${directRatio}%` }} title={`Direct: ${sub.direct}`} />
                    <div className="hr-stacked-seg-contract" style={{ width: `${contractRatio}%` }} title={`Contract: ${sub.contract}`} />
                  </div>

                  <div className="hr-bar-legend">
                    <span>Direct: <strong>{sub.direct.toLocaleString()}</strong> ({directRatio.toFixed(1)}%)</span>
                    <span>Contractual: <strong>{sub.contract.toLocaleString()}</strong> ({contractRatio.toFixed(1)}%)</span>
                    <span>Female: <strong>{sub.femalePct}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Age Diversity & Inclusion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Age Diversity Card */}
          <div className="hr-card">
            <div className="hr-card-header">
              <div className="hr-card-title-box">
                <h3 className="hr-card-title">Age Diversity & Experience Spread</h3>
                <p className="hr-card-sub">Demographic distribution across junior, mid-level, and senior leadership.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: '#1E293B' }}>Under 30 Years (Young Talent / Site Trainees)</span>
                  <span style={{ fontWeight: '700', color: '#2563EB' }}>34% (14,569)</span>
                </div>
                <div className="hr-progress-track" style={{ maxWidth: '100%', height: '8px' }}>
                  <div className="hr-progress-fill" style={{ width: '34%', background: '#38BDF8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: '#1E293B' }}>30 - 50 Years (Mid-Senior Engineers & PMs)</span>
                  <span style={{ fontWeight: '700', color: '#2563EB' }}>52% (22,282)</span>
                </div>
                <div className="hr-progress-track" style={{ maxWidth: '100%', height: '8px' }}>
                  <div className="hr-progress-fill" style={{ width: '52%', background: '#2563EB' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: '#1E293B' }}>Over 50 Years (Technical Experts & Directors)</span>
                  <span style={{ fontWeight: '700', color: '#2563EB' }}>14% (5,999)</span>
                </div>
                <div className="hr-progress-track" style={{ maxWidth: '100%', height: '8px' }}>
                  <div className="hr-progress-fill" style={{ width: '14%', background: '#64748B' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
              <span>Annualized Voluntary Turnover: <strong style={{ color: '#16A34A' }}>6.8%</strong></span>
              <span>Industry Benchmark: <strong>11.2%</strong></span>
            </div>
          </div>

          {/* Differently Abled Inclusion Card */}
          <div className="hr-card">
            <div className="hr-card-header">
              <div className="hr-card-title-box">
                <h3 className="hr-card-title">PwD Accessibility & Equal Opportunity</h3>
                <p className="hr-card-sub">Statutory compliance under Rights of Persons with Disabilities Act, 2016.</p>
              </div>
              <span className="hr-chip-success">142 PwD Staff</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: '700', color: '#0F172A' }}>Wheelchair Ramps & Lifts</div>
                <div style={{ color: '#16A34A', fontWeight: '600', marginTop: '2px' }}>✓ 100% HQ & Project Offices</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: '700', color: '#0F172A' }}>Assistive Software</div>
                <div style={{ color: '#16A34A', fontWeight: '600', marginTop: '2px' }}>✓ Deployed for all PwD roles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Modal: Add Workforce Disclosure */}
      {showAddModal && (
        <div className="hr-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="hr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Add Workforce Headcount Disclosure
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Grade / Category *
                  </label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  >
                    <option value="Board of Directors">Board of Directors</option>
                    <option value="Key Managerial Personnel (KMP)">Key Managerial Personnel (KMP)</option>
                    <option value="Senior Management & GMs">Senior Management & GMs</option>
                    <option value="Engineering & Project Managers">Engineering & Project Managers</option>
                    <option value="Permanent Technical & Supervisory Staff">Permanent Technical & Supervisory Staff</option>
                    <option value="Contractual EPC Site Workers">Contractual EPC Site Workers</option>
                    <option value="Trainees & Apprentices (NATS / NAPS)">Trainees & Apprentices (NATS / NAPS)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Subsidiary Entity *
                  </label>
                  <select 
                    value={formData.subsidiary_name} 
                    onChange={(e) => setFormData({ ...formData, subsidiary_name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  >
                    <option value="MEIL Core Infrastructure & EPC">MEIL Core Infrastructure & EPC</option>
                    <option value="Olectra Greentech Limited">Olectra Greentech Limited</option>
                    <option value="Megha Gas (CGD Network)">Megha Gas (CGD Network)</option>
                    <option value="Drillmec S.p.A / Drillmec India">Drillmec S.p.A / Drillmec India</option>
                    <option value="ICOMM Tele Limited">ICOMM Tele Limited</option>
                    <option value="Evey Trans Private Limited">Evey Trans Private Limited</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Male Headcount *
                  </label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g., 250"
                    value={formData.male_count}
                    onChange={(e) => setFormData({ ...formData, male_count: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Female Headcount *
                  </label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g., 50"
                    value={formData.female_count}
                    onChange={(e) => setFormData({ ...formData, female_count: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Differently Abled (PwD) Count
                  </label>
                  <input 
                    type="number" 
                    placeholder="e.g., 2"
                    value={formData.differently_abled_count}
                    onChange={(e) => setFormData({ ...formData, differently_abled_count: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Annual Turnover Rate (%)
                  </label>
                  <input 
                    type="number" 
                    step="0.1" 
                    placeholder="e.g., 4.5"
                    value={formData.turnover_rate_pct}
                    onChange={(e) => setFormData({ ...formData, turnover_rate_pct: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" className="hr-btn-glass" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="hr-btn-primary">
                  Save Disclosure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
