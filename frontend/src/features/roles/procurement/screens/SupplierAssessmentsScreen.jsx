import React, { useState } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function SupplierAssessmentsScreen({
  assessments = [],
  onNavigateTab,
  onOpenStartAssessment
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedType, setSelectedType] = useState('All Assessment Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRisk, setSelectedRisk] = useState('All Risk Levels');
  const [selectedDetailAssessment, setSelectedDetailAssessment] = useState(null);

  const handleDownloadTemplate = () => {
    const templateData = [
      { Question_ID: 'Q-E01', Pillar: 'Environmental', Question: 'Does the supplier report Scope 1 and Scope 2 GHG emissions as per GHG Protocol?', Mandatory_BRSR_Core: 'Yes', Weightage: '15%' },
      { Question_ID: 'Q-E02', Pillar: 'Environmental', Question: 'Does the supplier hold valid ISO 14001 or equivalent environmental management system certification?', Mandatory_BRSR_Core: 'Yes', Weightage: '10%' },
      { Question_ID: 'Q-E03', Pillar: 'Environmental', Question: 'Specific water consumption per unit of turnover tracked with zero liquid discharge (ZLD)?', Mandatory_BRSR_Core: 'Yes', Weightage: '10%' },
      { Question_ID: 'Q-S01', Pillar: 'Social', Question: 'Are all permanent and contract workers covered by statutory PF, ESIC, and minimum wages under Indian Code on Wages?', Mandatory_BRSR_Core: 'Yes', Weightage: '20%' },
      { Question_ID: 'Q-S02', Pillar: 'Social', Question: 'Zero tolerance policy and active POSH Committee established for prevention of sexual harassment?', Mandatory_BRSR_Core: 'Yes', Weightage: '15%' },
      { Question_ID: 'Q-S03', Pillar: 'Social', Question: 'Lost Time Injury Frequency Rate (LTIFR) audited and reported with zero fatal accidents?', Mandatory_BRSR_Core: 'Yes', Weightage: '15%' },
      { Question_ID: 'Q-G01', Pillar: 'Governance', Question: 'Code of Conduct, Anti-Bribery & Anti-Corruption policy endorsed and signed by Board/Directors?', Mandatory_BRSR_Core: 'Yes', Weightage: '15%' }
    ];
    exportToCsv('MEIL_BRSR_Core_Supplier_ESG_Assessment_Template.csv', templateData);
  };

  const filteredAssessments = assessments.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier =
      selectedSupplier === 'All Suppliers' || a.supplier.includes(selectedSupplier);
    const matchesType =
      selectedType === 'All Assessment Types' || a.type === selectedType;
    const matchesStatus =
      selectedStatus === 'All Status' || a.status === selectedStatus;
    const matchesRisk =
      selectedRisk === 'All Risk Levels' || a.risk === selectedRisk;
    return matchesSearch && matchesSupplier && matchesType && matchesStatus && matchesRisk;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="proc-status-chip approved">Approved</span>;
      case 'In Review':
        return <span className="proc-status-chip review">In Review</span>;
      case 'In Progress':
        return <span className="proc-status-chip in-progress">In Progress</span>;
      case 'Submitted':
        return <span className="proc-status-chip pending">Submitted</span>;
      default:
        return <span className="proc-status-chip not-started">{status}</span>;
    }
  };

  const getRiskChip = (risk) => {
    switch (risk) {
      case 'High':
        return <span className="proc-status-chip high">High</span>;
      case 'Medium':
        return <span className="proc-status-chip medium">Medium</span>;
      case 'Low':
        return <span className="proc-status-chip low">Low</span>;
      default:
        return <span className="proc-status-chip not-started">{risk}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ──── Header & Action Controls ──── */}
      <div className="proc-glass-card" style={{ padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Supplier ESG Assessments
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Assess supplier ESG practices and track evaluation status.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="proc-btn proc-btn-blue"
              onClick={onOpenStartAssessment}
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              <Plus size={15} />
              <span>Start Assessment</span>
            </button>
            <button
              type="button"
              className="proc-btn proc-btn-outline"
              style={{ padding: '7px 12px', fontSize: '12.5px' }}
              onClick={handleDownloadTemplate}
              title="Download BRSR Core Questionnaire Template"
            >
              <BookOpen size={14} />
              <span>Templates</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
          <div className="proc-search-bar" style={{ minWidth: '240px' }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search assessment ID, supplier, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="proc-select-control"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Suppliers">All Suppliers</option>
            <option value="ABC Construction">ABC Construction Ltd.</option>
            <option value="TechBuild Engineers">TechBuild Engineers</option>
            <option value="Green Materials">Green Materials Pvt Ltd</option>
            <option value="SafeWorks Services">SafeWorks Services</option>
            <option value="PowerGrid Solutions">PowerGrid Solutions</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Assessment Types">All Assessment Types</option>
            <option value="General ESG">General ESG</option>
            <option value="Environmental">Environmental</option>
            <option value="Social">Social</option>
            <option value="H&S">Health & Safety</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Status">All Status</option>
            <option value="Approved">Approved</option>
            <option value="In Review">In Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Submitted">Submitted</option>
          </select>

          <select
            className="proc-select-control"
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 12px', height: '34px' }}
          >
            <option value="All Risk Levels">All Risk Levels</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* ──── Assessments Table ──── */}
      <div className="proc-glass-card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="proc-table-wrapper">
          <table className="proc-table">
            <thead>
              <tr>
                <th>Assessment ID</th>
                <th>Supplier</th>
                <th>Type</th>
                <th>Assessment Date</th>
                <th>Score</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Next Review</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssessments.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>
                    {a.id}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{a.supplier}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>{a.type}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{a.date}</span>
                  </td>
                  <td>
                    {a.score !== null ? (
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '13px',
                          color: a.score >= 80 ? '#059669' : a.score >= 60 ? '#D97706' : '#DC2626'
                        }}
                      >
                        {a.score} / 100
                      </span>
                    ) : (
                      <span style={{ color: '#94A3B8', fontWeight: 600 }}>-</span>
                    )}
                  </td>
                  <td>{getRiskChip(a.risk)}</td>
                  <td>{getStatusChip(a.status)}</td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{a.nextReview}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailAssessment(a)}
                      title="View Assessment"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563EB'
                      }}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Assessment Details */}
        {selectedDetailAssessment && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedDetailAssessment(null)}
          >
            <div
              className="proc-glass-card"
              style={{
                width: '100%',
                maxWidth: '600px',
                padding: '24px',
                borderRadius: '20px',
                background: '#FFFFFF',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={24} color="#2563EB" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                      Assessment Details: {selectedDetailAssessment.id}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      {selectedDetailAssessment.supplier} • {selectedDetailAssessment.type}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDetailAssessment(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: '16px 0' }}>
                <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>ESG Score</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB' }}>
                    {selectedDetailAssessment.score ? `${selectedDetailAssessment.score} / 100` : 'Pending Score'}
                  </div>
                </div>
                <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Risk Level</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626' }}>
                    {selectedDetailAssessment.risk}
                  </div>
                </div>
                <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Status</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {selectedDetailAssessment.status}
                  </div>
                </div>
                <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Next Review</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {selectedDetailAssessment.nextReview}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, background: '#EFF6FF', padding: '12px', borderRadius: '10px' }}>
                <strong>Verification Note:</strong> This assessment satisfies BRSR Core Principle 2 (Value Chain Sustainability) and was verified by MEIL Group ESG Compliance Officers.
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="proc-btn proc-btn-outline"
                  onClick={() => setSelectedDetailAssessment(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="proc-btn proc-btn-blue"
                  onClick={() => {
                    exportToCsv(`Assessment_${selectedDetailAssessment.id}.csv`, [selectedDetailAssessment]);
                    setSelectedDetailAssessment(null);
                  }}
                >
                  Export Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Showing <strong>1 to {filteredAssessments.length}</strong> of <strong>94 assessments</strong>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" className="proc-page-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <button type="button" className="proc-page-btn active">1</button>
            <button type="button" className="proc-page-btn">2</button>
            <button type="button" className="proc-page-btn">3</button>
            <button type="button" className="proc-page-btn">4</button>
            <button type="button" className="proc-page-btn">5</button>
            <span style={{ color: '#94A3B8', fontSize: '12px' }}>...</span>
            <button type="button" className="proc-page-btn">10</button>
            <button type="button" className="proc-page-btn">
              <ChevronRight size={14} />
            </button>
            <select
              style={{
                marginLeft: '8px',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11.5px',
                color: '#475569',
                background: '#FFFFFF'
              }}
            >
              <option>10 / page</option>
              <option>25 / page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
