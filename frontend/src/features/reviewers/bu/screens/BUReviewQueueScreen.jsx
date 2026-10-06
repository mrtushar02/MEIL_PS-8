import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  ArrowRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function BUReviewQueueScreen({
  submissions = [],
  projects = [],
  onSelectSubmission
}) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING, CORRECTION, APPROVED, SLA_RISK
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Filtered submissions based on state, search, and dropdowns
  const filteredList = useMemo(() => {
    return submissions.filter((sub) => {
      // 1. Tab filter
      if (activeTab === 'PENDING' && sub.status !== 'SUBMITTED' && sub.status !== 'BU_REVIEW') return false;
      if (activeTab === 'APPROVED' && sub.status !== 'BU_APPROVED' && sub.status !== 'SUBSIDIARY_APPROVED') return false;
      if (activeTab === 'CORRECTION' && sub.status !== 'CORRECTION_REQUIRED') return false;
      if (activeTab === 'SLA_RISK') {
        const isNearSla = sub.id === 'SUB-2026-087' || sub.id === 'SUB-2026-084';
        if (!isNearSla) return false;
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = (sub.id || '').toLowerCase().includes(query);
        const matchProj = (sub.projectName || sub.project_id || '').toLowerCase().includes(query);
        if (!matchId && !matchProj) return false;
      }

      // 3. Project dropdown filter
      if (selectedProject !== 'ALL' && sub.project_id !== selectedProject) return false;

      // 4. Risk dropdown filter
      if (selectedRisk !== 'ALL' && sub.risk !== selectedRisk) return false;

      return true;
    });
  }, [submissions, activeTab, searchQuery, selectedProject, selectedRisk]);

  // Paginated slice
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;

  // Derive counts for tabs
  const counts = useMemo(() => {
    return {
      all: submissions.length,
      pending: submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'BU_REVIEW').length,
      correction: submissions.filter(s => s.status === 'CORRECTION_REQUIRED').length,
      approved: submissions.filter(s => s.status === 'BU_APPROVED' || s.status === 'SUBSIDIARY_APPROVED').length,
      slaRisk: 2
    };
  }, [submissions]);

  return (
    <div className="bu-table-card">
      {/* ── Table Header & Segmented Controls (Screen 2 Top) ── */}
      <div className="bu-table-header-row">
        <div>
          <h2 className="bu-table-title">Submission Review Queue</h2>
          <p className="bu-table-subtitle">Submissions currently awaiting BU-level review and statutory verification.</p>
        </div>

        {/* Segmented Controls (Matching Reference Screen 2) */}
        <div className="bu-segmented-controls">
          <button
            type="button"
            className={`bu-segmented-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => { setActiveTab('ALL'); setCurrentPage(1); }}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            className={`bu-segmented-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
            onClick={() => { setActiveTab('PENDING'); setCurrentPage(1); }}
          >
            Pending ({counts.pending})
          </button>
          <button
            type="button"
            className={`bu-segmented-btn ${activeTab === 'CORRECTION' ? 'active' : ''}`}
            onClick={() => { setActiveTab('CORRECTION'); setCurrentPage(1); }}
          >
            Correction ({counts.correction})
          </button>
          <button
            type="button"
            className={`bu-segmented-btn ${activeTab === 'APPROVED' ? 'active' : ''}`}
            onClick={() => { setActiveTab('APPROVED'); setCurrentPage(1); }}
          >
            Approved ({counts.approved})
          </button>
          <button
            type="button"
            className={`bu-segmented-btn ${activeTab === 'SLA_RISK' ? 'active' : ''}`}
            onClick={() => { setActiveTab('SLA_RISK'); setCurrentPage(1); }}
          >
            SLA Risk ({counts.slaRisk})
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls Toolbar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Search Bar */}
        <div style={{
          position: 'relative',
          flex: '1',
          minWidth: '240px',
          maxWidth: '360px'
        }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search submissions, projects, IDs..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '10px',
              border: '1px solid rgba(203, 213, 225, 0.9)',
              fontSize: '12.5px',
              background: '#FFFFFF',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Project Dropdown */}
          <select
            value={selectedProject}
            onChange={(e) => { setSelectedProject(e.target.value); setCurrentPage(1); }}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              color: '#334155',
              background: '#FFFFFF',
              outline: 'none'
            }}
          >
            <option value="ALL">Project: All (6 Sites)</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name.split('(')[0]}</option>
            ))}
          </select>

          {/* Risk Dropdown */}
          <select
            value={selectedRisk}
            onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              color: '#334155',
              background: '#FFFFFF',
              outline: 'none'
            }}
          >
            <option value="ALL">Risk: All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Period: Sep 2026</span>
        </div>
      </div>

      {/* ── Review Queue Table ── */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
        <table className="bu-data-table">
          <thead>
            <tr>
              <th>Submission ID</th>
              <th>Project</th>
              <th>Reporting Period</th>
              <th>Completeness</th>
              <th>Validation</th>
              <th>Evidence</th>
              <th>Risk</th>
              <th>SLA</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSubmissions.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                  No submissions matching your filter criteria.
                </td>
              </tr>
            ) : (
              paginatedSubmissions.map((sub) => {
                const isPending = sub.status === 'SUBMITTED' || sub.status === 'BU_REVIEW';
                const isApproved = sub.status === 'BU_APPROVED' || sub.status === 'SUBSIDIARY_APPROVED';
                const isCorrection = sub.status === 'CORRECTION_REQUIRED';
                const isSlaRisk = sub.id === 'SUB-2026-087' || sub.id === 'SUB-2026-084';

                // Derive SLA string
                let slaText = '18h left';
                let slaColor = '#10B981';
                if (sub.id === 'SUB-2026-087') { slaText = '6h left'; slaColor = '#D97706'; }
                else if (sub.id === 'SUB-2026-084') { slaText = '-2h overdue'; slaColor = '#DC2626'; }
                else if (isApproved) { slaText = 'Met'; slaColor = '#64748B'; }

                // Completeness percentage
                const compPct = sub.completeness || (isApproved ? 100 : (isCorrection ? 72 : 98));

                return (
                  <tr 
                    key={sub.id} 
                    onClick={() => onSelectSubmission?.(sub)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Submission ID */}
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>
                      <span style={{ color: '#2563EB' }}>{sub.id}</span>
                      <span style={{ display: 'block', fontSize: '10.5px', color: '#94A3B8', fontWeight: 500 }}>
                        v{sub.version || 1} • {sub.submitted_by || 'Site Team'}
                      </span>
                    </td>

                    {/* Project */}
                    <td>
                      <strong style={{ color: '#0F172A' }}>{sub.projectName || sub.project_id}</strong>
                      <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>
                        Tunnels BU
                      </span>
                    </td>

                    {/* Reporting Period */}
                    <td style={{ color: '#475569' }}>Sep 2026</td>

                    {/* Completeness Bar */}
                    <td style={{ width: '130px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${compPct}%`,
                            height: '100%',
                            background: compPct >= 95 ? '#16A34A' : (compPct >= 80 ? '#2563EB' : '#DC2626'),
                            borderRadius: '3px'
                          }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', minWidth: '30px' }}>
                          {compPct}%
                        </span>
                      </div>
                    </td>

                    {/* Validation */}
                    <td>
                      {isCorrection || sub.id === 'SUB-2026-084' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '11.5px', fontWeight: 700 }}>
                          <AlertTriangle size={13} /> Issues
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontSize: '11.5px', fontWeight: 700 }}>
                          <ShieldCheck size={13} /> Passed
                        </span>
                      )}
                    </td>

                    {/* Evidence */}
                    <td style={{ color: '#475569', fontWeight: 600 }}>
                      {sub.evidenceCount ? `${sub.evidenceCount}/14` : (isCorrection ? '8/14' : '14/14')}
                    </td>

                    {/* Risk Badge */}
                    <td>
                      {sub.id === 'SUB-2026-084' ? (
                        <span className="bu-badge bu-badge-risk-high">High</span>
                      ) : (sub.id === 'SUB-2026-087' || isCorrection ? (
                        <span className="bu-badge bu-badge-risk-med">Medium</span>
                      ) : (
                        <span className="bu-badge bu-badge-risk-low">Low</span>
                      ))}
                    </td>

                    {/* SLA */}
                    <td>
                      <span style={{ color: slaColor, fontWeight: 700, fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {slaText}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td>
                      {isPending ? (
                        <span className="bu-badge bu-badge-pending">Pending Review</span>
                      ) : isApproved ? (
                        <span className="bu-badge bu-badge-approved">Approved</span>
                      ) : (
                        <span className="bu-badge bu-badge-correction">Correction Req.</span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className={`bu-btn ${isPending ? 'bu-btn-primary' : 'bu-btn-secondary'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSubmission?.(sub);
                        }}
                        style={{ padding: '5px 12px', fontSize: '11.5px' }}
                      >
                        {isPending ? 'Review' : 'View'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer & Pagination ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <div>
          Showing {Math.min(filteredList.length, (currentPage - 1) * pageSize + 1)}–{Math.min(filteredList.length, currentPage * pageSize)} of {filteredList.length} submissions
        </div>

        {/* Pagination buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="bu-btn bu-btn-secondary"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ padding: '4px 8px' }}
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`bu-btn ${currentPage === page ? 'bu-btn-primary' : 'bu-btn-secondary'}`}
              onClick={() => setCurrentPage(page)}
              style={{ width: '28px', height: '28px', padding: 0 }}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="bu-btn bu-btn-secondary"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ padding: '4px 8px' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
