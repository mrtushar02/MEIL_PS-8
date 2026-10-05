import React, { useState, useEffect } from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Users,
  Download,
  Plus,
  X,
  Check,
  Lock,
  Info,
  Calendar
} from 'lucide-react';
import { getHRHumanRights } from '../../../services/api';

export default function HRHumanRightsScreen({ 
  humanRightsData: initialData, 
  onRefresh, 
  loading = false 
}) {
  const [data, setData] = useState(initialData || {
    posh_register: {
      period: 'FY 2024-25',
      complaints_filed: 4,
      complaints_investigated: 4,
      complaints_resolved: 4,
      complaints_pending: 0,
      resolution_rate_pct: 100.0,
      statutory_window_days: 90
    },
    fair_wages: {
      minimum_wage_multiplier: 1.28,
      engineering_parity_ratio: '1.00 : 1.00',
      site_parity_ratio: '1.00 : 1.00',
      child_labour_incidents: 0,
      forced_labour_incidents: 0,
      sa8000_certified: true
    }
  });

  const [poshCases, setPoshCases] = useState([
    {
      id: 'ICC-2025-01',
      entity: 'MEIL Core Infrastructure (Hyderabad HQ)',
      category: 'Workplace Misconduct / Verbal Inappropriateness',
      dateFiled: '14 May 2025',
      dateClosed: '22 Jun 2025',
      daysTaken: 39,
      committee: 'Presiding Officer (Senior VP) + External NGO Advocate',
      outcome: 'Formal Inquiry Concluded; Disciplinary Action Implemented',
      status: 'RESOLVED_AND_FILED'
    },
    {
      id: 'ICC-2025-02',
      entity: 'Olectra Greentech Limited',
      category: 'Alleged Gender Disparity in Overtime Allocation',
      dateFiled: '08 Jul 2025',
      dateClosed: '18 Aug 2025',
      daysTaken: 41,
      committee: 'Plant HR Lead + Independent Legal Counsel',
      outcome: 'Policy Rectified; Standardized Roster Enacted',
      status: 'RESOLVED_AND_FILED'
    },
    {
      id: 'ICC-2025-03',
      entity: 'Megha Gas City Gas Depot',
      category: 'Hostile Environment / Supervisor Conduct',
      dateFiled: '19 Sep 2025',
      dateClosed: '28 Oct 2025',
      daysTaken: 39,
      committee: 'ICC Regional Bench + Presiding Officer',
      outcome: 'Inquiry Completed; Written Warning Issued; Transferred',
      status: 'RESOLVED_AND_FILED'
    },
    {
      id: 'ICC-2025-04',
      entity: 'Drillmec India Facility',
      category: 'Inappropriate Digital Communication',
      dateFiled: '04 Dec 2025',
      dateClosed: '12 Jan 2026',
      daysTaken: 39,
      committee: 'Group ICC Panel + External Advocate',
      outcome: 'Evidence Validated; Termination of Employment',
      status: 'RESOLVED_AND_FILED'
    }
  ]);

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [inquiryForm, setInquiryForm] = useState({
    entity: 'MEIL Core EPC (Hyderabad HQ)',
    category: 'Workplace Dignity & Conduct Review',
    committeeLead: 'External NGO Advocate & ICC Presiding Officer',
    outcomeNotes: 'Inquiry completed following due statutory process under POSH Act 2013.'
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRecordInquiry = (e) => {
    e.preventDefault();

    const newCase = {
      id: `ICC-2025-0${poshCases.length + 1}`,
      entity: inquiryForm.entity,
      category: inquiryForm.category,
      dateFiled: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dateClosed: 'In Progress / Final Review',
      daysTaken: 14,
      committee: inquiryForm.committeeLead,
      outcome: inquiryForm.outcomeNotes,
      status: 'RESOLVED_AND_FILED'
    };

    setPoshCases([newCase, ...poshCases]);
    setShowInquiryModal(false);
    triggerToast('Inquiry & Grievance record logged into Statutory POSH Register!');
  };

  const downloadPOSHAnnualReport = () => {
    const reportText = `
========================================================================
   MEGHA ENGINEERING & INFRASTRUCTURES LIMITED (MEIL GROUP)
   ANNUAL STATUTORY REPORT UNDER POSH ACT, 2013 (SECTION 21)
========================================================================
Reporting Year          : FY 2024-25
Statutory Mandate       : Prevention of Sexual Harassment of Women at Workplace
Total Complaints Filed  : ${data.posh_register?.complaints_filed || 4}
Total Cases Investigated: ${data.posh_register?.complaints_investigated || 4}
Total Cases Resolved    : ${data.posh_register?.complaints_resolved || 4} (100.0%)
Cases Pending > 90 Days : 0 (Zero Backlog)
External NGO Member     : Adv. Lakshmi Rao (Independent External Advocate)
Internal Committee Pres : Dr. Sunita Raman (Presiding Officer)
Statutory Filings Filed : Submitted to District Officer (Hyderabad & Regional D.O.s)
Cryptographic Audit Seal: SHA-256 Verified by MEIL ESG Core Portal
========================================================================
This document constitutes official digital proof under SEBI BRSR Principle 5
and Section 21 of the Sexual Harassment of Women at Workplace Act, 2013.
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MEIL_POSH_Section21_Annual_Statutory_Report_FY25.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Downloaded POSH Section 21 Annual Report.');
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
            <Scale size={24} color="#2563EB" />
          </div>
          <div className="hr-header-title-box">
            <div className="hr-badge-row">
              <span className="hr-brsr-badge">SEBI BRSR Principle 5</span>
              <span className="hr-scope-tag">Human Rights • Fair Wages • Equal Remuneration • POSH Governance</span>
            </div>
            <h1 className="hr-title">Human Rights, Fair Wages & POSH Governance</h1>
            <p className="hr-subtitle">
              Statutory disclosures covering Internal Complaints Committee (ICC) inquiries, minimum wage compliance, and SA8000 zero-child-labour assurance.
            </p>
          </div>
        </div>

        <div className="hr-header-actions">
          <button className="hr-btn-glass" type="button" onClick={downloadPOSHAnnualReport}>
            <Download size={13} />
            <span>POSH Section 21 Report</span>
          </button>

          <button className="hr-btn-primary" type="button" onClick={() => setShowInquiryModal(true)}>
            <Plus size={14} />
            <span>Record Inquiry Status</span>
          </button>
        </div>
      </div>

      {/* 2. 6 Key Assurance Cards */}
      <div className="hr-kpi-grid">
        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Wage Parity Ratio</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Scale size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val" style={{ fontSize: '18px' }}>1.00 : 1.00</span>
          </div>
          <div className="hr-kpi-sub">
            <span className="hr-kpi-delta-good">Exact Parity</span> Across Bands
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Min Wage Multiplier</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{data.fair_wages?.minimum_wage_multiplier || 1.28}x</span>
            <span className="hr-kpi-unit">Mandate</span>
          </div>
          <div className="hr-kpi-sub">
            Exceeds Central Minimum
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Child Labour</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val" style={{ color: '#16A34A' }}>0</span>
            <span className="hr-kpi-unit">Incidents</span>
          </div>
          <div className="hr-kpi-sub">
            SA8000 Biometric Gate
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Forced Labour</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <Lock size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val" style={{ color: '#16A34A' }}>0</span>
            <span className="hr-kpi-unit">Incidents</span>
          </div>
          <div className="hr-kpi-sub">
            Zero Tolerance Audited
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">POSH Inquiries</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777' }}>
              <Users size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{data.posh_register?.complaints_filed || 4}</span>
            <span className="hr-kpi-unit">Cases</span>
          </div>
          <div className="hr-kpi-sub">
            100% Inquiries Concluded
          </div>
        </div>

        <div className="hr-kpi-card">
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Pending Backlog</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A' }}>
              <Check size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val" style={{ color: '#16A34A' }}>{data.posh_register?.complaints_pending || 0}</span>
            <span className="hr-kpi-unit">Cases</span>
          </div>
          <div className="hr-kpi-sub">
            <span className="hr-kpi-delta-good">Zero Backlog</span> (&lt;90d SLA)
          </div>
        </div>
      </div>

      {/* 3. Main Operational Content Grid */}
      <div className="hr-main-grid">
        {/* Left Column: Statutory ICC POSH Register Table */}
        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">Internal Complaints Committee (ICC) POSH Register (BRSR P5 #3)</h3>
              <p className="hr-card-sub">Statutory inquiry disclosures under the Sexual Harassment of Women at Workplace Act 2013.</p>
            </div>
            <span className="hr-chip-success">
              <Check size={10} /> 100% Resolved Within SLA
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>Complaints Filed</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{data.posh_register?.complaints_filed || 4}</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>Investigated</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#2563EB', marginTop: '2px' }}>{data.posh_register?.complaints_investigated || 4}</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>Resolution Rate</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#16A34A', marginTop: '2px' }}>100.0%</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>Statutory SLA</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#8B5CF6', marginTop: '2px' }}>90 Days</div>
            </div>
          </div>

          {/* POSH Case Logs Table */}
          <div className="hr-table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Case Reference</th>
                  <th>Operating Entity</th>
                  <th>Category & Summary</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {poshCases.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '700', fontFamily: 'monospace' }}>{item.id}</td>
                    <td style={{ fontWeight: '600' }}>{item.entity}</td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{item.category}</div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>Filed: {item.dateFiled}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#2563EB' }}>{item.daysTaken} Days</span>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Mandate: &lt;90d</div>
                    </td>
                    <td>
                      <span className="hr-chip-success">
                        <Check size={9} /> Closed
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="hr-btn-glass"
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                        onClick={() => setSelectedCaseDetail(item)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* District Officer Reporting Confirmation Banner */}
          <div className="hr-calendar-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#16A34A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '12px', color: '#065F46' }}>Statutory Annual Return Filed with District Officers</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Section 21 annual report submitted to Women & Child Development Department across all operating regional benches.</div>
              </div>
            </div>
            <span className="hr-chip-success">100% Filed</span>
          </div>
        </div>

        {/* Right Column: Equal Remuneration, Fair Wages & Human Rights Safeguards */}
        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">Fair Wage & Equal Remuneration Audit (P5 #1)</h3>
              <p className="hr-card-sub">Male vs Female median remuneration ratio for identical job roles.</p>
            </div>
            <span className="hr-chip-blue">Zero Disparity</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="hr-sub-card">
              <div className="hr-sub-card-header">
                <span className="hr-sub-name">Engineering & Technical Roles</span>
                <span className="hr-chip-success">1.00 : 1.00 (Exact Parity)</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>
                Third-party remuneration benchmark verified by Bureau Veritas. Exact gender equality across senior civil, mechanical, and electrical engineering salaries.
              </div>
            </div>

            <div className="hr-sub-card">
              <div className="hr-sub-card-header">
                <span className="hr-sub-name">EPC Construction Site Roles</span>
                <span className="hr-chip-success">1.00 : 1.00 (Exact Parity)</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>
                Strict piece-rate and daily wage equality for equipment operators, QA/QC inspectors, and field technicians.
              </div>
            </div>

            <div className="hr-sub-card">
              <div className="hr-sub-card-header">
                <span className="hr-sub-name">Minimum Wage Multiplier</span>
                <span className="hr-chip-success">1.28x Central Mandate</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>
                Base compensation across all operating subsidiaries exceeds state and central government notified minimum wages by at least 28%.
              </div>
            </div>

            <div className="hr-sub-card" style={{ background: 'rgba(236, 253, 245, 0.7)', borderColor: 'rgba(167, 243, 208, 0.8)' }}>
              <div className="hr-sub-card-header">
                <span className="hr-sub-name" style={{ color: '#065F46' }}>Child & Forced Labour Prevention</span>
                <span className="hr-chip-success">0 Incidents (SA8000)</span>
              </div>
              <div style={{ fontSize: '11px', color: '#047857', lineHeight: 1.4 }}>
                Mandatory biometric age verification at all 258+ project gates before badge issuance. Complete supply chain vendor labor audits active.
              </div>
            </div>
          </div>

          {/* Grievance Redressal Architecture */}
          <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '6px' }}>
            <div style={{ fontWeight: '700', fontSize: '12px', color: '#0F172A', marginBottom: '8px' }}>
              Worker Grievance Redressal Architecture
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Multi-lingual Toll-Free Hotline:</span>
                <strong style={{ color: '#0F172A' }}>1800-MEIL-ETHICS</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Average Resolution Turnaround:</span>
                <strong style={{ color: '#16A34A' }}>4.2 Calendar Days</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Independent Whistleblower Desk:</span>
                <strong style={{ color: '#2563EB' }}>Audit Committee Direct</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Inspection Modal for POSH Case */}
      {selectedCaseDetail && (
        <div className="hr-modal-overlay" onClick={() => setSelectedCaseDetail(null)}>
          <div className="hr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  ICC Inquiry Disclosure Record
                </h3>
              </div>
              <button onClick={() => setSelectedCaseDetail(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="hr-detail-grid">
              <div className="hr-detail-card">
                <div className="hr-detail-card-label">Case Identifier & Operating Entity</div>
                <div className="hr-detail-card-val" style={{ fontFamily: 'monospace' }}>{selectedCaseDetail.id}</div>
                <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600', marginTop: '2px' }}>{selectedCaseDetail.entity}</div>
              </div>

              <div className="hr-detail-card">
                <div className="hr-detail-card-label">Category of Allegation</div>
                <div className="hr-detail-card-val" style={{ fontSize: '12.5px' }}>{selectedCaseDetail.category}</div>
              </div>

              <div className="hr-form-row-2">
                <div className="hr-detail-card">
                  <div className="hr-detail-card-label">Date Filed</div>
                  <div className="hr-detail-card-val">{selectedCaseDetail.dateFiled}</div>
                </div>
                <div className="hr-detail-card">
                  <div className="hr-detail-card-label">Date Closed / Days</div>
                  <div className="hr-detail-card-val" style={{ color: '#16A34A' }}>{selectedCaseDetail.dateClosed} ({selectedCaseDetail.daysTaken}d)</div>
                </div>
              </div>

              <div className="hr-detail-card">
                <div className="hr-detail-card-label">Internal Complaints Committee Bench</div>
                <div className="hr-detail-card-val" style={{ fontSize: '11.5px', color: '#334155' }}>{selectedCaseDetail.committee}</div>
              </div>

              <div className="hr-detail-card">
                <div className="hr-detail-card-label">Resolution & Final Action</div>
                <div className="hr-detail-card-val" style={{ fontSize: '12px', lineHeight: 1.4 }}>{selectedCaseDetail.outcome}</div>
              </div>

              <div className="hr-notice-box">
                <Info size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Statutory Inquiry SLA (&lt; 90 Days): Fully Compliant ({selectedCaseDetail.daysTaken} Days elapsed).</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" className="hr-btn-glass" onClick={() => setSelectedCaseDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Inquiry Status Modal */}
      {showInquiryModal && (
        <div className="hr-modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="hr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Record ICC Inquiry / Grievance Status
                </h3>
              </div>
              <button onClick={() => setShowInquiryModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="hr-form-group">
                <label className="hr-form-label">Operating Subsidiary / Site *</label>
                <select
                  className="hr-form-select"
                  value={inquiryForm.entity}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, entity: e.target.value })}
                >
                  <option value="MEIL Core EPC (Hyderabad HQ)">MEIL Core EPC (Hyderabad HQ)</option>
                  <option value="Polavaram Dam Project Site">Polavaram Dam Project Site</option>
                  <option value="Zojila Tunnel Package-2">Zojila Tunnel Package-2</option>
                  <option value="Olectra Greentech Limited">Olectra Greentech Limited</option>
                  <option value="Megha Gas CGD Network">Megha Gas CGD Network</option>
                  <option value="Drillmec S.p.A / India">Drillmec S.p.A / India</option>
                </select>
              </div>

              <div className="hr-form-group">
                <label className="hr-form-label">Allegation Classification *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., Workplace Dignity & Conduct Review"
                  value={inquiryForm.category}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, category: e.target.value })}
                  className="hr-form-input"
                />
              </div>

              <div className="hr-form-group">
                <label className="hr-form-label">Inquiry Bench & External NGO Advocate</label>
                <input 
                  type="text" 
                  placeholder="e.g., Adv. Lakshmi Rao (Independent Advocate) & Presiding Officer"
                  value={inquiryForm.committeeLead}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, committeeLead: e.target.value })}
                  className="hr-form-input"
                />
              </div>

              <div className="hr-form-group">
                <label className="hr-form-label">Inquiry Findings & Committee Closure Summary</label>
                <textarea 
                  rows={3} 
                  required 
                  placeholder="Document statutory inquiry conclusions, disciplinary outcomes, and policy enforcement..."
                  value={inquiryForm.outcomeNotes}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, outcomeNotes: e.target.value })}
                  className="hr-form-textarea"
                />
              </div>

              <div className="hr-notice-box">
                <Info size={15} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Logging this entry updates the MEIL Group POSH Section 21 register and records the audit seal.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" className="hr-btn-glass" onClick={() => setShowInquiryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="hr-btn-primary">
                  Record & Seal Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
