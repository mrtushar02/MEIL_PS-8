import React, { useState, useMemo } from 'react';
import { ShieldCheck, PlusCircle, FileCheck2, X, Calendar } from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge, GlassKPI } from '../../../../components/glass';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const isInspectionScheduled = (status) => (status || '').toLowerCase().includes('scheduled');

const isInspectionComplete = (status) => {
  const s = (status || '').toLowerCase();
  return s.includes('completed') || s.includes('verified');
};

const getInspectionBadgeStatus = (status) => {
  const s = (status || '').toLowerCase();
  if (isInspectionComplete(status)) return 'success';
  if (isInspectionScheduled(status)) return 'info';
  if (s.includes('overdue')) return 'error';
  if (s.includes('finding') || s.includes('progress')) return 'warning';
  return 'info';
};

const DetailItem = ({ label, value, mono }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
      {label}
    </span>
    <span style={{ fontSize: '12.5px', color: '#0F172A', fontFamily: mono ? 'ui-monospace, SFMono-Regular, monospace' : 'inherit' }}>
      {value != null && value !== '' ? value : '—'}
    </span>
  </div>
);

export default function EHSInspectionsScreen({
  inspections = [],
  onCreateInspection,
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects / Sites');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedInspector, setSelectedInspector] = useState('All Inspectors');
  const [selectedRange, setSelectedRange] = useState('Sep 2026');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedInsp, setSelectedInsp] = useState(null);

  const inspectionList = useMemo(() => Array.isArray(inspections) ? inspections : [], [inspections]);

  const filterOptions = useMemo(() => {
    const projects = ['All Projects / Sites'];
    const types = ['All Types'];
    const inspectors = ['All Inspectors'];
    const statuses = ['All Statuses'];
    inspectionList.forEach((i) => {
      if (i.project_name && !projects.includes(i.project_name)) projects.push(i.project_name);
      if (i.type && !types.includes(i.type)) types.push(i.type);
      if (i.inspector && !inspectors.includes(i.inspector)) inspectors.push(i.inspector);
      if (i.status && !statuses.includes(i.status)) statuses.push(i.status);
    });
    return { projects, types, inspectors, statuses };
  }, [inspectionList]);

  const filteredInspections = useMemo(() => {
    return inspectionList.filter((i) => {
      if (selectedProject !== 'All Projects / Sites' && i.project_name !== selectedProject) return false;
      if (selectedType !== 'All Types' && i.type !== selectedType) return false;
      if (selectedInspector !== 'All Inspectors' && i.inspector !== selectedInspector) return false;
      if (selectedStatus !== 'All Statuses' && i.status !== selectedStatus) return false;
      return true;
    });
  }, [inspectionList, selectedProject, selectedType, selectedInspector, selectedStatus]);

  const kpiCounts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: inspectionList.length,
      scheduled: inspectionList.filter((i) => isInspectionScheduled(i.status)).length,
      completed: inspectionList.filter((i) => isInspectionComplete(i.status)).length,
      overdue: inspectionList.filter(
        (i) => !isInspectionComplete(i.status) && i.scheduled_date && new Date(i.scheduled_date) < today
      ).length,
      findings: inspectionList.filter((i) => (i.findings_count || 0) > 0).length,
    };
  }, [inspectionList]);

  return (
    <div className="ehs-module-root">
      <GlassCard level={2} style={{ padding: '20px 24px' }}>
        <div className="ehs-hero-banner" style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none', WebkitBoxShadow: 'none' }}>
          <div className="ehs-banner-top">
            <div className="ehs-title-group">
              <div className="ehs-title-icon-badge">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h1 className="ehs-hero-title">Inspections & Audits</h1>
                <p className="ehs-hero-subtitle">
                  Statutory site audits, HSE checklists, and compliance walk-throughs across 258+ project sites.
                </p>
              </div>
            </div>
            <div className="ehs-banner-actions">
              <GlassButton variant="primary" size="sm" icon={PlusCircle} onClick={() => onCreateInspection?.()}>
                Create Inspection
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard level={2} style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select className="ehs-select-control" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            {filterOptions.projects.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select className="ehs-select-control" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {filterOptions.types.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select className="ehs-select-control" value={selectedInspector} onChange={(e) => setSelectedInspector(e.target.value)}>
            {filterOptions.inspectors.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select className="ehs-select-control" value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
            <option value="Sep 2026">Sep 2026</option>
            <option value="Aug 2026">Aug 2026</option>
            <option value="Jul 2026">Jul 2026</option>
          </select>
          <select className="ehs-select-control" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            {filterOptions.statuses.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </GlassCard>

      <div className="ehs-kpi-grid">
        <GlassKPI title="Total Inspections" value={kpiCounts.total} subtitle="Across all sites" icon={ShieldCheck} status="info" />
        <GlassKPI title="Scheduled" value={kpiCounts.scheduled} subtitle="Pending execution" icon={Calendar} status="info" />
        <GlassKPI title="Completed" value={kpiCounts.completed} subtitle="Verified & closed" icon={FileCheck2} status={kpiCounts.completed > 0 ? 'success' : 'neutral'} />
        <GlassKPI title="Overdue" value={kpiCounts.overdue} subtitle="Past scheduled date" icon={X} status={kpiCounts.overdue > 0 ? 'warning' : 'neutral'} />
        <GlassKPI title="Findings" value={kpiCounts.findings} subtitle="With findings recorded" icon={ShieldCheck} status={kpiCounts.findings > 0 ? 'warning' : 'neutral'} />
      </div>

      <GlassCard level={2} style={{ padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: selectedInsp ? '1.8fr 1.2fr' : '1fr', gap: '16px', transition: 'gridTemplateColumns 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <GlassCard level={1} style={{ padding: '16px 20px', borderRadius: '8px', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="ehs-card-header">
              <div className="ehs-card-title-group">
                <FileCheck2 size={18} color="#2563EB" />
                <div>
                  <h3 className="ehs-card-title">Inspections & Audits Register</h3>
                  <span className="ehs-card-subtitle">Showing {filteredInspections.length} of {kpiCounts.total} inspections</span>
                </div>
              </div>
            </div>

            {filteredInspections.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center', color: '#94A3B8' }}>
                <Calendar size={32} style={{ marginBottom: '12px', opacity: 0.45 }} />
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', fontWeight: 500 }}>No inspections scheduled for this period.</p>
                <p style={{ margin: '4px 0 16px 0', fontSize: '11.5px', color: '#CBD5E1' }}>Adjust your filters or create a new inspection schedule.</p>
                <GlassButton variant="primary" size="sm" icon={PlusCircle} onClick={() => onCreateInspection?.()}>
                  Create Inspection
                </GlassButton>
              </div>
            ) : (
              <div className="ehs-table-container">
                <table className="ehs-data-table">
                  <thead>
                    <tr>
                      <th>Inspection ID</th>
                      <th>Date</th>
                      <th>Project / Site</th>
                      <th>Type</th>
                      <th>Inspector</th>
                      <th>Findings</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInspections.map((insp) => {
                      const isSelected = selectedInsp ? selectedInsp.id === insp.id : false;
                      const hasFindings = (insp.findings_count || 0) > 0;
                      return (
                        <tr
                          key={insp.id}
                          onClick={() => setSelectedInsp(insp)}
                          style={{
                            background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.12s ease, opacity 0.12s ease'
                          }}
                        >
                          <td style={{ fontWeight: 800, color: '#2563EB' }}>{insp.inspection_number || insp.id}</td>
                          <td style={{ fontSize: '12px', color: '#475569' }}>{formatDate(insp.scheduled_date)}</td>
                          <td style={{ fontWeight: 700, color: '#0F172A' }}>{insp.project_name || '—'}</td>
                          <td style={{ color: '#475569' }}>{insp.type || '—'}</td>
                          <td style={{ fontSize: '12px' }}>{insp.inspector || '—'}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: hasFindings ? '#DC2626' : '#059669' }}>{insp.findings_count || 0}</td>
                          <td>
                            <GlassBadge status={getInspectionBadgeStatus(insp.status)} size="sm">
                              {insp.status || '—'}
                            </GlassBadge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>

          {selectedInsp && (
            <GlassCard
              level={2}
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                borderRadius: '12px',
                animation: 'ehsFadeIn 0.2s ease',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Inspection Details — {selectedInsp.inspection_number || selectedInsp.id}
                  </h3>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>{selectedInsp.project_name || '—'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInsp(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
                  aria-label="Close details"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Basic Information
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11.5px' }}>
                  <DetailItem label="Inspection ID" value={selectedInsp.inspection_number || selectedInsp.id} mono />
                  <DetailItem label="Project / Site" value={selectedInsp.project_name} />
                  <DetailItem label="Type" value={selectedInsp.type} />
                  <DetailItem label="Inspector" value={selectedInsp.inspector} />
                  <DetailItem label="Scheduled Date" value={formatDate(selectedInsp.scheduled_date)} mono />
                  <DetailItem label="Completed Date" value={formatDate(selectedInsp.completed_date)} mono />
                  <DetailItem label="Score" value={selectedInsp.score != null ? selectedInsp.score + '%' : '—'} mono />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Status</span>
                    <GlassBadge status={getInspectionBadgeStatus(selectedInsp.status)} size="sm">
                      {selectedInsp.status || '—'}
                    </GlassBadge>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Checklist Summary</div>
                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    {selectedInsp.checklist_summary || 'No checklist summary available.'}
                  </p>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Findings Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <DetailItem label="Findings Count" value={selectedInsp.findings_count || 0} mono />
                  <DetailItem label="Compliance Score" value={selectedInsp.score != null ? selectedInsp.score + '%' : '—'} mono />
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Status: <strong style={{ color: isInspectionComplete(selectedInsp.status) ? '#059669' : '#D97706' }}>{selectedInsp.status || '—'}</strong>
                </span>
                <GlassButton variant="primary" size="sm" icon={FileCheck2} onClick={() => onNavigateTab?.('corrective-actions')}>
                  Log Findings to CAPA
                </GlassButton>
              </div>
            </GlassCard>
          )}
        </div>
      </GlassCard>
    </div>
  );
}