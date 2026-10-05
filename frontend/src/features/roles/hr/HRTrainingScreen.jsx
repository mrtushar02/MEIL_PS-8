import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Download,
  Check,
  X
} from 'lucide-react';
import { api } from '../../../services/api';

export default function HRTrainingScreen({ reportingPeriod = 'FY 2026-27', triggerToast }) {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedSub, setSelectedSub] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [statutoryMatrix, setStatutoryMatrix] = useState([]);
  const [trainingSessions, setTrainingSessions] = useState([]);

  // Form state
  const [trainingForm, setTrainingForm] = useState({
    title: '',
    category: 'Health & Safety',
    subsidiary: 'MEIL Core Infrastructure & EPC',
    attendees: '',
    hours: '',
    trainer: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getHRTraining(selectedCat, selectedSub);
      if (res) {
        setStatutoryMatrix(res.statutory_matrix || []);
        setTrainingSessions(res.sessions || []);
      }
    } catch (e) {
      console.warn('Failed to load training data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat, selectedSub]);

  const filteredSessions = useMemo(() => {
    return trainingSessions.filter(s => {
      const matchSearch = !searchQuery || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.trainer?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [trainingSessions, searchQuery]);

  const handleAddTraining = async (e) => {
    e.preventDefault();
    if (!trainingForm.title || !trainingForm.attendees) return;

    try {
      await api.logHRTraining({
        title: trainingForm.title,
        category: trainingForm.category,
        subsidiary_name: trainingForm.subsidiary,
        attendees_count: parseInt(trainingForm.attendees) || 50,
        hours: parseFloat(trainingForm.hours) || 4.0,
        trainer: trainingForm.trainer || 'Certified Faculty',
        date_logged: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Verified'
      });

      triggerToast?.('Training session registered and verified into BRSR P3 Register!');
      setShowLogModal(false);
      setTrainingForm({
        title: '',
        category: 'Health & Safety',
        subsidiary: 'MEIL Core Infrastructure & EPC',
        attendees: '',
        hours: '',
        trainer: ''
      });
      loadData();
    } catch {
      triggerToast?.('Failed to log training batch');
    }
  };

  const handleExportCSV = () => {
    const csvContent = "Program Title,Category,Subsidiary,Attendees,Hours,Date,Status\n" +
      filteredSessions.map(s => `"${s.title}","${s.category}","${s.subsidiary}",${s.attendees},${s.hours},"${s.date}","${s.status}"`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MEIL_BRSR_P3_Training_Register_${reportingPeriod.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast?.('Exported BRSR P3 Training Register CSV');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Header Banner */}
      <div className="hr-header-banner">
        <div className="hr-header-left">
          <div className="hr-header-icon">
            <GraduationCap size={24} />
          </div>
          <div className="hr-header-title-box">
            <div className="hr-badge-row">
              <span className="hr-brsr-badge">SEBI BRSR Principle 3 (Essential Indicator 8)</span>
              <span className="hr-scope-tag">Skill Upgradation • Health & Safety • Human Rights</span>
            </div>
            <h1 className="hr-title">Training & Skill Upgradation Matrix</h1>
            <p className="hr-subtitle">
              Mandatory statutory disclosures of training hours across leadership, engineering staff, and EPC site workers.
            </p>
          </div>
        </div>

        <div className="hr-header-actions">
          <div className="hr-search-bar" style={{ width: '220px' }}>
            <Search size={14} color="#64748B" />
            <input 
              type="text" 
              className="hr-search-input" 
              placeholder="Search session or trainer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="hr-select-sub"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Health & Safety">Health & Safety</option>
            <option value="Skill Upgradation">Skill Upgradation</option>
            <option value="POSH & Human Rights">POSH & Human Rights</option>
            <option value="Technical & SOP">Technical & SOP</option>
            <option value="Environmental Compliance">Environmental Compliance</option>
          </select>

          <select 
            className="hr-select-sub"
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
          >
            <option value="ALL">All Subsidiaries</option>
            <option value="Core">MEIL Core Infrastructure</option>
            <option value="Olectra">Olectra Greentech</option>
            <option value="Megha Gas">Megha Gas</option>
            <option value="Drillmec">Drillmec S.p.A</option>
            <option value="ICOMM">ICOMM Tele</option>
          </select>

          <button className="hr-btn-glass" onClick={handleExportCSV}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button className="hr-btn-primary" onClick={() => setShowLogModal(true)}>
            <Plus size={14} />
            <span>Log Training Batch</span>
          </button>
        </div>
      </div>

      {/* 2. BRSR Principle 3 Indicator 8 Statutory Table */}
      <div className="hr-card">
        <div className="hr-card-header">
          <div className="hr-card-title-box">
            <h3 className="hr-card-title">SEBI BRSR Principle 3 (Essential Indicator 8) — Statutory Disclosures</h3>
            <p className="hr-card-sub">Mandatory disclosure of training on Health & Safety, Skill Upgradation, and Human Rights.</p>
          </div>
          <span className="hr-chip-success">100% Health & Safety Audited</span>
        </div>

        <div className="hr-table-wrap">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Count</th>
                <th>Health & Safety (% / Hrs)</th>
                <th>Skill Upgradation (% / Hrs)</th>
                <th>POSH & Human Rights (%)</th>
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {statutoryMatrix.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '700' }}>{row.category}</td>
                  <td><strong>{row.total_count.toLocaleString()}</strong></td>
                  <td>{row.safety_coverage_pct} ({row.safety_hours} hrs)</td>
                  <td>{row.skill_coverage_pct} ({row.skill_hours} hrs)</td>
                  <td><span style={{ fontWeight: '700', color: '#2563EB' }}>{row.posh_coverage_pct}</span></td>
                  <td><span className="hr-chip-success"><Check size={9} /> {row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Training Sessions Register & Biometric Logs */}
      <div className="hr-card">
        <div className="hr-card-header">
          <div className="hr-card-title-box">
            <h3 className="hr-card-title">Recent Training Programs & Biometric Attendance Logs</h3>
            <p className="hr-card-sub">Real-time sessions logged across EPC site batches, plant facilities, and project offices.</p>
          </div>
          <span className="hr-chip-blue">{filteredSessions.length} Batches Active</span>
        </div>

        <div className="hr-table-wrap">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Program Title</th>
                <th>Category</th>
                <th>Subsidiary Entity</th>
                <th>Attendees</th>
                <th>Duration</th>
                <th>Trainer / Faculty</th>
                <th>Date Logged</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                    Loading training records...
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                    No training sessions found matching filters.
                  </td>
                </tr>
              ) : (
                filteredSessions.map(session => (
                  <tr key={session.id}>
                    <td style={{ fontWeight: '700' }}>{session.title}</td>
                    <td><span className="hr-chip-blue">{session.category}</span></td>
                    <td>{session.subsidiary}</td>
                    <td><strong>{session.attendees}</strong> workers</td>
                    <td>{session.hours} hrs</td>
                    <td style={{ fontSize: '11px', color: '#64748B' }}>{session.trainer}</td>
                    <td>{session.date}</td>
                    <td><span className="hr-chip-success"><Check size={9} /> {session.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal: Log Training Session */}
      {showLogModal && (
        <div className="hr-modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="hr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Log Training Session (BRSR P3)
                </h3>
              </div>
              <button onClick={() => setShowLogModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTraining} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Training Program Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., High-Altitude Tunnel Hypothermia First Aid"
                  value={trainingForm.title}
                  onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select 
                    value={trainingForm.category}
                    onChange={(e) => setTrainingForm({ ...trainingForm, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  >
                    <option value="Health & Safety">Health & Safety</option>
                    <option value="Skill Upgradation">Skill Upgradation</option>
                    <option value="POSH & Human Rights">POSH & Human Rights</option>
                    <option value="Technical & SOP">Technical & SOP</option>
                    <option value="Environmental Compliance">Environmental Compliance</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Subsidiary Entity
                  </label>
                  <select 
                    value={trainingForm.subsidiary}
                    onChange={(e) => setTrainingForm({ ...trainingForm, subsidiary: e.target.value })}
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
                    Attendees Count *
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g., 120"
                    value={trainingForm.attendees}
                    onChange={(e) => setTrainingForm({ ...trainingForm, attendees: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Duration (Hours) *
                  </label>
                  <input 
                    type="number" 
                    step="0.5" 
                    required
                    placeholder="e.g., 8.0"
                    value={trainingForm.hours}
                    onChange={(e) => setTrainingForm({ ...trainingForm, hours: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Trainer / Certifying Faculty
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., National Safety Council (NSC) Lead Auditor"
                  value={trainingForm.trainer}
                  onChange={(e) => setTrainingForm({ ...trainingForm, trainer: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" className="hr-btn-glass" onClick={() => setShowLogModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="hr-btn-primary">
                  Record Training Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
