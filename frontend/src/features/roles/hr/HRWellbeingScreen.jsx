import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  Award, 
  Users, 
  Building2, 
  Calendar, 
  Download, 
  Plus, 
  X, 
  Stethoscope, 
  CheckCircle2, 
  Search, 
  Check,
  Info
} from 'lucide-react';

export default function HRWellbeingScreen({ 
  wellbeingData: initialData, 
  _onRefresh, 
  _loading = false 
}) {
  const [wellbeingStats, setWellbeingStats] = useState(initialData || {
    subsidiary_name: 'MEIL Group (Consolidated)',
    health_insurance_pct: 98.2,
    accident_insurance_pct: 100.0,
    maternity_retention_pct: 98.4,
    paternity_takeup_pct: 100.0,
    annual_medical_screenings: 41200,
    creche_compliant: true,
    reporting_period: 'FY 2024-25'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubFilter, setSelectedSubFilter] = useState('ALL');
  const [showLogCampModal, setShowLogCampModal] = useState(false);
  const [selectedCampDetail, setSelectedCampDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [medicalCamps, setMedicalCamps] = useState([
    {
      id: 'OHC-CAMP-001',
      site: 'Polavaram Hydroelectric & Dam Project Site',
      subsidiary: 'MEIL Core EPC',
      screeningsCount: 1240,
      testType: 'Spirometry, Audiometry & High-Altitude Fitness',
      date: '25 Sep 2026',
      status: 'VERIFIED',
      doctor: 'Dr. A. K. Rao (Chief Medical Officer, MEIL)',
      notes: 'Tunnel engineering staff evaluated for respiratory fitness; 100% fit-for-duty certificates issued.'
    },
    {
      id: 'OHC-CAMP-002',
      site: 'Zojila Tunnel Package-2 Sub-Zero Site',
      subsidiary: 'MEIL Core EPC',
      screeningsCount: 880,
      testType: 'Hypothermia, Pulmonary & Altitude Acclimatization',
      date: '20 Sep 2026',
      status: 'VERIFIED',
      doctor: 'Dr. T. Dorjey (Senior Occupational Physician)',
      notes: 'Annual mandatory medical examination for cold-climate tunnel workers.'
    },
    {
      id: 'OHC-CAMP-003',
      site: 'Olectra Greentech EV Bus Manufacturing Plant',
      subsidiary: 'Olectra Greentech',
      screeningsCount: 650,
      testType: 'Ergonomic Posture, Vision & Audiometric Checkup',
      date: '15 Sep 2026',
      status: 'VERIFIED',
      doctor: 'Dr. Neha Verma (Industrial Health Specialist)',
      notes: 'Battery line assembly technicians screened for heavy metal exposure and repetitive strain.'
    },
    {
      id: 'OHC-CAMP-004',
      site: 'Megha Gas City Gas Distribution (CGD) Depot',
      subsidiary: 'Megha Gas',
      screeningsCount: 420,
      testType: 'Hydrocarbon Exposure & Pulmonary Function Test',
      date: '10 Sep 2026',
      status: 'VERIFIED',
      doctor: 'Dr. P. S. Reddy (Regional Medical Officer)',
      notes: 'CNG compressor operators and pipeline technicians audited.'
    },
    {
      id: 'OHC-CAMP-005',
      site: 'Drillmec India Rig Assembly Complex',
      subsidiary: 'Drillmec S.p.A',
      screeningsCount: 510,
      testType: 'Hydraulic Rig Sound Exposure & Musculoskeletal Exam',
      date: '05 Sep 2026',
      status: 'VERIFIED',
      doctor: 'Dr. R. K. Nair (Lead Ergonomist)',
      notes: 'Heavy fabrication yard technicians audited with baseline audiograms.'
    }
  ]);

  const [campForm, setCampForm] = useState({
    site: '',
    subsidiary: 'MEIL Core EPC',
    screeningsCount: '',
    testType: 'Periodic Occupational Health Screening',
    doctor: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setWellbeingStats(initialData);
    }
  }, [initialData]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddCamp = (e) => {
    e.preventDefault();
    if (!campForm.site || !campForm.screeningsCount) return;

    const newCamp = {
      id: `OHC-CAMP-${String(medicalCamps.length + 1).padStart(3, '0')}`,
      site: campForm.site,
      subsidiary: campForm.subsidiary,
      screeningsCount: parseInt(campForm.screeningsCount) || 500,
      testType: campForm.testType,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'VERIFIED',
      doctor: campForm.doctor || 'Dr. A. K. Rao (CMO)',
      notes: campForm.notes || 'Routine preventative OHC health camp completed.'
    };

    setMedicalCamps([newCamp, ...medicalCamps]);
    setShowLogCampModal(false);
    setCampForm({
      site: '',
      subsidiary: 'MEIL Core EPC',
      screeningsCount: '',
      testType: 'Periodic Occupational Health Screening',
      doctor: '',
      notes: ''
    });
    triggerToast('OHC Health Camp & Screening batch registered into SEBI BRSR P3 Register!');
  };

  const filteredCamps = medicalCamps.filter(camp => {
    const matchesSearch = 
      camp.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = selectedSubFilter === 'ALL' || camp.subsidiary.toLowerCase().includes(selectedSubFilter.toLowerCase());
    return matchesSearch && matchesSite;
  });

  const exportOHCSummary = () => {
    const csvContent = 
      "Camp ID,Project Site,Operating Entity,Screenings Count,Diagnostic Protocol,Certifying Medical Officer,Date,Audit Status\n" +
      medicalCamps.map(c => 
        `"${c.id}","${c.site}","${c.subsidiary}",${c.screeningsCount},"${c.testType}","${c.doctor}","${c.date}","${c.status}"`
      ).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MEIL_Group_BRSR_P3_OHC_Health_Register.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('OHC Medical Disclosures Register exported to CSV.');
  };

  return (
    <div className="hr-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="hr-toast">
          <CheckCircle2 size={16} color="#34D399" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: '6px' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. Master Header Banner */}
      <div className="hr-header-banner">
        <div className="hr-header-left">
          <div className="hr-header-icon" style={{ background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.9))' }}>
            <HeartPulse size={24} color="#2563EB" />
          </div>
          <div className="hr-header-title-box">
            <div className="hr-badge-row">
              <span className="hr-brsr-badge">SEBI BRSR Principle 3</span>
              <span className="hr-scope-tag">Essential Indicators 1, 2, 4, 10 & 11 • Employee Wellbeing & Social Security</span>
            </div>
            <h1 className="hr-title">Employee Wellbeing, Health & Social Security</h1>
            <p className="hr-subtitle">
              Comprehensive statutory coverage for Group Mediclaim, Workmen Compensation, maternity retention, and OHC checkups across 258+ sites.
            </p>
          </div>
        </div>

        <div className="hr-header-actions">
          <button className="hr-btn-glass" type="button" onClick={exportOHCSummary}>
            <Download size={13} />
            <span>Export OHC Summary</span>
          </button>

          <button className="hr-btn-primary" type="button" onClick={() => setShowLogCampModal(true)}>
            <Plus size={14} />
            <span>Log OHC Medical Camp</span>
          </button>
        </div>
      </div>

      {/* 2. 6 High-Impact Statutory Assurance Cards */}
      <div className="hr-kpi-grid">
        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Health Insurance</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <HeartPulse size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{wellbeingStats.health_insurance_pct}%</span>
            <span className="hr-kpi-unit">Coverage</span>
          </div>
          <div className="hr-kpi-sub">
            <span className="hr-kpi-delta-good">100%</span> Direct • 94.6% Site
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Accident Insurance</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{wellbeingStats.accident_insurance_pct}%</span>
            <span className="hr-kpi-unit">Covered</span>
          </div>
          <div className="hr-kpi-sub">
            All 44,648 Personnel Insured
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Maternity Retention</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777' }}>
              <Award size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{wellbeingStats.maternity_retention_pct}%</span>
            <span className="hr-kpi-unit">Return</span>
          </div>
          <div className="hr-kpi-sub">
            26 Weeks Fully Paid Leave
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Paternity Leave</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
              <Users size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{wellbeingStats.paternity_takeup_pct}%</span>
            <span className="hr-kpi-unit">Eligible</span>
          </div>
          <div className="hr-kpi-sub">
            15 Days Paid Leave Take-up
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">OHC Screenings</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
              <Stethoscope size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">41,200</span>
            <span className="hr-kpi-unit">Tests</span>
          </div>
          <div className="hr-kpi-sub">
            Across 258 Project Sites
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Crèche Facilities</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
              <Building2 size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val" style={{ color: '#16A34A' }}>100%</span>
            <span className="hr-kpi-unit">Statutory</span>
          </div>
          <div className="hr-kpi-sub">
            Maternity Benefit Act 2017
          </div>
        </div>
      </div>

      {/* 3. Main Operational Content Grid */}
      <div className="hr-main-grid">
        {/* Left Column: Statutory Social Security & Insurance Disclosures Table */}
        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">Statutory Social Security & Benefits Disclosures (BRSR P3 #1 & #2)</h3>
              <p className="hr-card-sub">Detailed statutory audit breakdown for permanent engineering staff and contractual site laborers.</p>
            </div>
            <span className="hr-chip-success">
              <Check size={10} /> 100% PF & ESIC Verified
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {/* Health Insurance Box */}
            <div className="hr-sub-card">
              <div className="hr-sub-card-header">
                <span className="hr-sub-name">Group Mediclaim & Health Policy</span>
                <span className="hr-chip-success">98.2% Total</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>
                • 100% Direct Staff (Group Mediclaim ₹5L sum insured)<br />
                • 94.6% Contractual (ESIC + Site Emergency Policy)
              </div>
            </div>

            {/* Accident Insurance Box */}
            <div className="hr-sub-card">
              <div className="hr-sub-card-header">
                <span className="hr-sub-name">Workmen Compensation & GPA</span>
                <span className="hr-chip-success">100% Complete</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>
                • High-Hazard Tunnel & Dam Sites: 100% GPA<br />
                • Contractual EPC Laborers: 100% End-to-End Covered
              </div>
            </div>

            {/* Maternity Benefits */}
            <div className="hr-sub-card">
              <div className="hr-sub-card-header">
                <span className="hr-sub-name">Maternity & Childcare Benefits</span>
                <span className="hr-chip-success">98.4% Return</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>
                • 26 Weeks fully paid maternity leave<br />
                • 181 of 184 returned to active duty (98.4% retention)
              </div>
            </div>

            {/* Paternity Leave */}
            <div className="hr-sub-card">
              <div className="hr-sub-card-header">
                <span className="hr-sub-name">Paternity Leave Entitlement</span>
                <span className="hr-chip-success">100% Eligible</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>
                • 15 Days paid paternity leave<br />
                • 42 On-site crèche facilities (&lt;500m from project gates)
              </div>
            </div>
          </div>

          {/* EPFO Banner */}
          <div className="hr-calendar-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '12px', color: '#1E3A8A' }}>EPFO Electronic Challan cum Return (ECR) Reconciliation</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Universal Account Number (UAN) generated for 100% of newly onboarded construction and EPC site employees.</div>
              </div>
            </div>
            <span className="hr-chip-success">Zero Default</span>
          </div>
        </div>

        {/* Right Column: Occupational Health Center (OHC) Screenings */}
        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">OHC Medical Screenings Register</h3>
              <p className="hr-card-sub">Mandatory medical surveillance, spirometry and audiometric testing logs.</p>
            </div>
            <span className="hr-chip-blue">{filteredCamps.length} Active Records</span>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="hr-search-bar" style={{ flex: 1 }}>
              <Search size={14} color="#64748B" />
              <input
                type="text"
                className="hr-search-input"
                placeholder="Search OHC center, doctor, or test type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="hr-select-sub"
              value={selectedSubFilter}
              onChange={(e) => setSelectedSubFilter(e.target.value)}
            >
              <option value="ALL">All Entities</option>
              <option value="MEIL Core">MEIL Core EPC</option>
              <option value="Olectra">Olectra</option>
              <option value="Megha Gas">Megha Gas</option>
              <option value="Drillmec">Drillmec</option>
            </select>
          </div>

          {/* OHC Medical Camps Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '440px', overflowY: 'auto' }}>
            {filteredCamps.map(camp => (
              <div 
                key={camp.id} 
                onClick={() => setSelectedCampDetail(camp)}
                style={{ 
                  background: '#F8FAFC', 
                  padding: '12px 14px', 
                  borderRadius: '12px', 
                  border: '1px solid #E2E8F0', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="hr-chip-blue" style={{ fontSize: '9.5px', padding: '1px 6px' }}>{camp.subsidiary}</span>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>{camp.id}</span>
                    </div>
                    <h4 style={{ margin: '4px 0 2px 0', fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>{camp.site}</h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#2563EB' }}>{camp.screeningsCount.toLocaleString()}</span>
                    <span style={{ fontSize: '10px', color: '#64748B', marginLeft: '3px' }}>Tests</span>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>
                  {camp.testType}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #F1F5F9', fontSize: '10.5px', color: '#64748B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} color="#94A3B8" />
                    <span>{camp.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontWeight: '700' }}>
                    <CheckCircle2 size={11} />
                    <span>{camp.doctor.split('(')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Inspection Modal for Medical Camp */}
      {selectedCampDetail && (
        <div className="hr-modal-overlay" onClick={() => setSelectedCampDetail(null)}>
          <div className="hr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  OHC Medical Camp Disclosure Detail
                </h3>
              </div>
              <button onClick={() => setSelectedCampDetail(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="hr-detail-grid">
              <div className="hr-detail-card">
                <div className="hr-detail-card-label">Project Site & Operating Entity</div>
                <div className="hr-detail-card-val">{selectedCampDetail.site}</div>
                <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600', marginTop: '2px' }}>{selectedCampDetail.subsidiary}</div>
              </div>

              <div className="hr-form-row-2">
                <div className="hr-detail-card">
                  <div className="hr-detail-card-label">Screenings Conducted</div>
                  <div className="hr-detail-card-val" style={{ color: '#2563EB', fontSize: '15px' }}>{selectedCampDetail.screeningsCount.toLocaleString()} Personnel</div>
                </div>
                <div className="hr-detail-card">
                  <div className="hr-detail-card-label">Examination Date</div>
                  <div className="hr-detail-card-val">{selectedCampDetail.date}</div>
                </div>
              </div>

              <div className="hr-detail-card">
                <div className="hr-detail-card-label">Diagnostic Protocol</div>
                <div className="hr-detail-card-val" style={{ fontSize: '12px' }}>{selectedCampDetail.testType}</div>
              </div>

              <div className="hr-detail-card">
                <div className="hr-detail-card-label">Certifying Medical Officer</div>
                <div className="hr-detail-card-val" style={{ fontSize: '12px' }}>{selectedCampDetail.doctor}</div>
              </div>

              <div className="hr-notice-box">
                <Info size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>SEBI BRSR Principle 3 Indicator 11 Audit Trail: Verified Compliant & Digitally Sealed.</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" className="hr-btn-glass" onClick={() => setSelectedCampDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Medical Camp Modal */}
      {showLogCampModal && (
        <div className="hr-modal-overlay" onClick={() => setShowLogCampModal(false)}>
          <div className="hr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Log OHC Medical Camp & Health Screening
                </h3>
              </div>
              <button onClick={() => setShowLogCampModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCamp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="hr-form-group">
                <label className="hr-form-label">
                  Project Site / Plant OHC *
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., Zojila Tunnel PKG-2 OHC Center"
                  value={campForm.site}
                  onChange={(e) => setCampForm({ ...campForm, site: e.target.value })}
                  className="hr-form-input"
                />
              </div>

              <div className="hr-form-row-2">
                <div className="hr-form-group">
                  <label className="hr-form-label">Operating Entity</label>
                  <select
                    className="hr-form-select"
                    value={campForm.subsidiary}
                    onChange={(e) => setCampForm({ ...campForm, subsidiary: e.target.value })}
                  >
                    <option value="MEIL Core EPC">MEIL Core EPC</option>
                    <option value="Olectra Greentech">Olectra Greentech</option>
                    <option value="Megha Gas">Megha Gas</option>
                    <option value="Drillmec S.p.A">Drillmec S.p.A</option>
                    <option value="ICOMM Tele">ICOMM Tele</option>
                  </select>
                </div>

                <div className="hr-form-group">
                  <label className="hr-form-label">Screenings Count *</label>
                  <input 
                    type="number" 
                    required 
                    min={1}
                    placeholder="e.g., 850"
                    value={campForm.screeningsCount}
                    onChange={(e) => setCampForm({ ...campForm, screeningsCount: e.target.value })}
                    className="hr-form-input"
                  />
                </div>
              </div>

              <div className="hr-form-group">
                <label className="hr-form-label">Diagnostic Screening Protocol</label>
                <input 
                  type="text" 
                  placeholder="e.g., Spirometry, Audiometry & High-Altitude Acclimatization"
                  value={campForm.testType}
                  onChange={(e) => setCampForm({ ...campForm, testType: e.target.value })}
                  className="hr-form-input"
                />
              </div>

              <div className="hr-form-group">
                <label className="hr-form-label">Chief Medical Officer / Certifying Doctor</label>
                <input 
                  type="text" 
                  placeholder="e.g., Dr. A. K. Rao (CMO, Reg #54219)"
                  value={campForm.doctor}
                  onChange={(e) => setCampForm({ ...campForm, doctor: e.target.value })}
                  className="hr-form-input"
                />
              </div>

              <div className="hr-notice-box">
                <Info size={15} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Logging this camp updates SEBI BRSR P3 Indicator 11 and syncs with the annual statutory register.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" className="hr-btn-glass" onClick={() => setShowLogCampModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="hr-btn-primary">
                  Register Health Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
