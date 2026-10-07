import React, { useMemo, useState } from 'react';
import {
  FileDown,
  TrendingUp,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Layout,
  Loader2,
  Eye
} from 'lucide-react';
import { GlassCard, GlassButton, GlassKPI } from '../../../../components/glass';
import { exportToCsv } from '../../../../utils/exportUtils';

export default function EHSAnalyticsScreen({
  overview = {},
  incidents = [],
  user,
  onNavigateTab
}) {
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedPeriod, setSelectedPeriod] = useState('Sep 2026');
  const [selectedFreq, setSelectedFreq] = useState('Monthly');

  const availableProjects = useMemo(() => {
    const set = new Set(['Zojila Tunnel', 'Main Tunnel', 'Access Road', 'Camp Area']);
    incidents.forEach(i => {
      if (i.project_name || i.project) set.add(i.project_name || i.project);
    });
    return Array.from(set);
  }, [incidents]);

  const handleExportAnalytics = () => {
    const report = [
      { Metric: 'Total Incidents', Value: incidents.length, Period: selectedPeriod, Project: selectedProject },
      { Metric: 'Near Misses', Value: incidents.filter(i => i.type === 'Near Miss').length, Period: selectedPeriod, Project: selectedProject },
      { Metric: 'Lost Time Injuries (LTI)', Value: incidents.filter(i => i.lti === true).length, Period: selectedPeriod, Project: selectedProject },
      { Metric: 'LTIFR Rate', Value: (overview.lost_time_injury_frequency ?? 0).toFixed(2), Period: selectedPeriod, Project: selectedProject },
      { Metric: 'Safe Man-Hours', Value: overview.safe_manhours ?? 1250000, Period: selectedPeriod, Project: selectedProject },
      { Metric: 'Inspections Completed', Value: overview.inspections_completed ?? 24, Period: selectedPeriod, Project: selectedProject }
    ];
    exportToCsv(`MEIL_Safety_Analytics_${selectedPeriod.replace(/\s+/g, '_')}.csv`, report);
  };

  const totalIncidents = incidents.length;
  const nearMisses = incidents.filter(i => i.type === 'Near Miss').length;
  const ltiCount = incidents.filter(i => i.lti === true).length;
  const ltifr = overview.lost_time_injury_frequency ?? 0;
  const safeManhours = overview.safe_manhours ?? 0;
  const inspectionsCompleted = overview.inspections_completed ?? 0;

  const formatManhours = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return String(val);
  };

  const trendData = useMemo(() => {
    if (!incidents.length) return [];
    const monthCounts = {};
    const monthNearMisses = {};
    incidents.forEach(inc => {
      if (!inc.incident_date) return;
      const d = new Date(inc.incident_date);
      if (isNaN(d)) return;
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthCounts[key] = (monthCounts[key] || 0) + 1;
      monthNearMisses[key] = (monthNearMisses[key] || 0) + (inc.type === 'Near Miss' ? 1 : 0);
    });
    return Object.keys(monthCounts).sort((a, b) => new Date(a) - new Date(b)).map(month => ({
      month,
      incidents: monthCounts[month],
      nearMisses: monthNearMisses[month] || 0
    }));
  }, [incidents]);

  const correctiveAging = useMemo(() => {
    const correctiveIncidents = incidents.filter(i =>
      (i.status || '').toLowerCase().includes('corrective')
    );
    const today = new Date();
    const buckets = { '0-7 days': 0, '8-30 days': 0, '31-60 days': 0, '60+ days': 0 };
    correctiveIncidents.forEach(inc => {
      const dateStr = inc.target_date || inc.incident_date;
      if (!dateStr) return;
      const openDate = new Date(dateStr);
      if (isNaN(openDate)) return;
      const diffDays = Math.floor((today - openDate) / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) buckets['0-7 days']++;
      else if (diffDays <= 30) buckets['8-30 days']++;
      else if (diffDays <= 60) buckets['31-60 days']++;
      else buckets['60+ days']++;
    });
    const total = correctiveIncidents.length || overview.corrective_actions_open || 0;
    return { total, buckets };
  }, [incidents, overview]);

  const projectData = useMemo(() => {
    if (!incidents.length) return [];
    const projectMap = {};
    incidents.forEach(inc => {
      if (!inc.project_name) return;
      if (!projectMap[inc.project_name]) projectMap[inc.project_name] = { name: inc.project_name, count: 0 };
      projectMap[inc.project_name].count++;
    });
    return Object.values(projectMap).sort((a, b) => b.count - a.count);
  }, [incidents]);

  const maxTrend = Math.max(...trendData.map(t => Math.max(t.incidents, t.nearMisses)), 1);
  const maxProject = Math.max(...projectData.map(p => p.count), 1);

  return (
    <div className="ehs-module-root" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="ehs-glass-card" style={{ padding: '16px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Analytics
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Predictive incident trends, severity distributions, and cross-project safety benchmarking.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="ehs-select-control" style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}>
              <option value="All Projects">All Projects</option>
              {availableProjects.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="ehs-select-control" style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}>
              <option value="Sep 2026">Sep 2026</option>
              <option value="Aug 2026">Aug 2026</option>
              <option value="Jul 2026">Jul 2026</option>
            </select>
            <select value={selectedFreq} onChange={e => setSelectedFreq(e.target.value)} className="ehs-select-control" style={{ fontSize: '12px', padding: '5px 10px', height: '32px' }}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
            <GlassButton variant="primary" size="sm" icon={FileDown} onClick={handleExportAnalytics}>
              Export
            </GlassButton>
          </div>
        </div>
      </div>

      <div className="ehs-kpi-grid">
        <GlassKPI title="Total Incidents" value={totalIncidents} subtitle="Period total" icon={AlertTriangle} status={totalIncidents > 0 ? 'warning' : 'success'} />
        <GlassKPI title="LTIFR" value={ltifr.toFixed(2)} subtitle="per 200k man-hours" icon={TrendingUp} status={ltifr > 0 ? 'warning' : 'success'} />
        <GlassKPI title="Near Misses" value={nearMisses} subtitle="Proactive reporting" icon={Eye} status="info" />
        <GlassKPI title="LTI" value={ltiCount} subtitle="Lost Time Injury" icon={Clock} status={ltiCount > 0 ? 'warning' : 'success'} />
        <GlassKPI title="Safe Man-Hours" value={formatManhours(safeManhours)} subtitle="Cumulative" icon={Shield} status="success" />
        <GlassKPI title="Inspections Completed" value={inspectionsCompleted} subtitle="Across all sites" icon={CheckCircle2} status="info" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
        <GlassCard level={2} style={{ padding: '16px 18px', borderRadius: '12px', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Incident Trend</h3>
            <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', color: '#64748B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }} /> Incidents
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> Near Miss
              </span>
            </div>
          </div>
          {trendData.length === 0 ? (
            <div style={{ width: '100%', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px' }}>
              No trend data available
            </div>
          ) : (
            <div style={{ width: '100%', height: '170px' }}>
              <svg viewBox="0 0 350 170" style={{ width: '100%', height: '100%' }}>
                {[20, 60, 100, 140].map(y => (
                  <line key={y} x1="20" y1={y} x2="330" y2={y} stroke="#F1F5F9" />
                ))}
                <polyline fill="none" stroke="#10B981" strokeWidth="2.5" points={
                  trendData.map((t, i) => {
                    const x = 35 + i * (280 / Math.max(trendData.length - 1, 1));
                    const y = 140 - ((t.nearMisses / maxTrend) * 100);
                    return `${x},${y}`;
                  }).join(' ')
                } />
                <polyline fill="none" stroke="#2563EB" strokeWidth="2.5" points={
                  trendData.map((t, i) => {
                    const x = 35 + i * (280 / Math.max(trendData.length - 1, 1));
                    const y = 140 - ((t.incidents / maxTrend) * 100);
                    return `${x},${y}`;
                  }).join(' ')
                } />
                {trendData.map((t, i) => {
                  const x = 35 + i * (280 / Math.max(trendData.length - 1, 1));
                  return (
                    <text key={t.month} x={x} y="156" fontSize="10" fill="#64748B" textAnchor="middle">
                      {t.month.split(' ')[0]}
                    </text>
                  );
                })}
              </svg>
            </div>
          )}
        </GlassCard>

        <GlassCard level={2} style={{ padding: '16px 18px', borderRadius: '12px', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>Corrective Action Aging</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
              {correctiveAging.total === 0 ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '11px' }}>
                  No data
                </div>
              ) : (
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {(() => {
                    const { buckets } = correctiveAging;
                    const total = correctiveAging.total;
                    const segments = [
                      { key: '0-7 days', color: '#10B981' },
                      { key: '8-30 days', color: '#3B82F6' },
                      { key: '31-60 days', color: '#F59E0B' },
                      { key: '60+ days', color: '#EF4444' }
                    ];
                    let offset = 0;
                    return segments.map(seg => {
                      const pct = total > 0 ? (buckets[seg.key] / total) * 100 : 0;
                      const dasharray = `${pct} ${100 - pct}`;
                      const dashoffset = -offset;
                      offset += pct;
                      return (
                        <circle key={seg.key} cx="18" cy="18" r="14" fill="none" stroke={seg.color} strokeWidth="5.5" strokeDasharray={dasharray} strokeDashoffset={dashoffset} />
                      );
                    });
                  })()}
                </svg>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10.5px', flex: 1 }}>
              {Object.entries(correctiveAging.buckets).map(([label, val]) => {
                const colors = { '0-7 days': '#059669', '8-30 days': '#2563EB', '31-60 days': '#D97706', '60+ days': '#DC2626' };
                const pct = correctiveAging.total > 0 ? Math.round((val / correctiveAging.total) * 100) : 0;
                return (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors[label] }}>? {label}</span>
                    <strong>{pct}%</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard level={2} style={{ padding: '16px 18px', borderRadius: '12px', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>Project Safety Comparison</h3>
          {projectData.length === 0 ? (
            <div style={{ width: '100%', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px' }}>
              No project data available
            </div>
          ) : (
            <div style={{ width: '100%', height: '170px' }}>
              <svg viewBox="0 0 300 170" style={{ width: '100%', height: '100%' }}>
                {[20, 60, 100, 140].map(y => (
                  <line key={y} x1="20" y1={y} x2="280" y2={y} stroke="#F1F5F9" />
                ))}
                {projectData.map((p, idx) => {
                  const x = 40 + idx * 62;
                  const h = (p.count / maxProject) * 100;
                  return (
                    <g key={p.name} transform={`translate(${x}, 0)`}>
                      <rect x="0" y={140 - h} width="28" height={h} fill="#2563EB" rx="3" />
                      <text x="14" y="156" fontSize="9.5" fill="#64748B" textAnchor="middle">{p.name.split(' ')[0]}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
