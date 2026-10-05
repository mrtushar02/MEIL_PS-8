import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileCheck2,
  FileText,
  GraduationCap,
  HeartPulse,
  Paperclip,
  Plus,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { api } from '../../../services/api';

export default function HROverviewScreen({
  onNavigateTab,
  reportingPeriod = 'September 2026',
  onOpenLogTraining,
  onOpenUploadEvidence,
  onOpenSubmitReturn,
  triggerToast
}) {
  const [stats, setStats] = useState({
    total_workforce: 42850,
    direct_employees: 14200,
    contract_workers: 28650,
    female_diversity_pct: 14.8,
    training_hours_per_emp: 28.4,
    fair_wage_adherence_pct: 100.0,
    statutory_minimum_multiplier: 1.28,
    differently_abled_count: 142,
    posh_resolution_pct: 100.0,
    pending_posh_grievances: 0,
    subsidiaries_count: 6,
    statutory_filings_count: 5
  });

  const [selectedSub, setSelectedSub] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState(reportingPeriod);

  useEffect(() => {
    let isMounted = true;
    api.getHROverview().then((data) => {
      if (isMounted && data) setStats(data);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const subsidiariesData = useMemo(() => ([
    { name: 'MEIL Core Infrastructure & EPC', direct: 6800, contract: 15600, total: 22400, femalePct: 12.4, trainingHrs: 29.2, compliance: 99.8 },
    { name: 'Olectra Greentech Limited', direct: 2900, contract: 3350, total: 6250, femalePct: 21.5, trainingHrs: 32.4, compliance: 100 },
    { name: 'Megha Gas (CGD Network)', direct: 1450, contract: 2650, total: 4100, femalePct: 16.2, trainingHrs: 26.8, compliance: 100 },
    { name: 'Drillmec S.p.A / Drillmec India', direct: 1200, contract: 2600, total: 3800, femalePct: 11.8, trainingHrs: 31.0, compliance: 99.4 },
    { name: 'ICOMM Tele Limited', direct: 1150, contract: 2450, total: 3600, femalePct: 18.9, trainingHrs: 27.5, compliance: 100 },
    { name: 'Evey Trans Private Limited', direct: 700, contract: 2000, total: 2700, femalePct: 14.0, trainingHrs: 24.2, compliance: 99.6 }
  ]), []);

  const actionItems = [
    { count: 12, label: 'Training batches pending completion', tab: 'training', tone: 'danger' },
    { count: 4, label: 'Certifications expiring this month', tab: 'evidence', tone: 'warning' },
    { count: 3, label: 'Wage exceptions require review', tab: 'human-rights', tone: 'danger' },
    { count: 2, label: 'Grievances approaching deadline', tab: 'human-rights', tone: 'warning' },
    { count: 7, label: 'Workforce records incomplete', tab: 'workforce', tone: 'warning' }
  ];

  const recentActivities = [
    { icon: GraduationCap, label: 'Safety training batch completed', time: '2 hours ago', tab: 'training' },
    { icon: Users, label: 'New workforce data imported', time: '4 hours ago', tab: 'workforce' },
    { icon: HeartPulse, label: 'Wellbeing program record added', time: '1 day ago', tab: 'wellbeing' },
    { icon: Scale, label: 'Grievance case resolved', time: '2 days ago', tab: 'human-rights' },
    { icon: Send, label: 'Monthly HR data submitted', time: '3 days ago', tab: 'submissions' }
  ];

  const moduleCards = [
    { label: 'Workforce Status', value: stats.total_workforce.toLocaleString(), detail: '14.2k direct - 28.6k contract', icon: Users, tab: 'workforce', progress: 88 },
    { label: 'Training', value: '78%', detail: `${stats.training_hours_per_emp} hrs per employee`, icon: GraduationCap, tab: 'training', progress: 78 },
    { label: 'Wellbeing', value: '86%', detail: 'OHC and benefit coverage', icon: HeartPulse, tab: 'wellbeing', progress: 86 },
    { label: 'Human Rights', value: '100%', detail: 'Fair wage and POSH closure', icon: Scale, tab: 'human-rights', progress: 100 },
    { label: 'Evidence', value: '248', detail: '196 verified documents', icon: Paperclip, tab: 'evidence', progress: 79 },
    { label: 'Submissions', value: stats.statutory_filings_count, detail: '3 accepted - 2 in review', icon: FileCheck2, tab: 'submissions', progress: 82 }
  ];

  const trendMonths = [
    { month: 'Apr', total: 37200, direct: 13200, contract: 24000 },
    { month: 'May', total: 38150, direct: 13500, contract: 24650 },
    { month: 'Jun', total: 39400, direct: 13800, contract: 25600 },
    { month: 'Jul', total: 40780, direct: 14000, contract: 26780 },
    { month: 'Aug', total: 41850, direct: 14100, contract: 27750 },
    { month: 'Sep', total: stats.total_workforce, direct: stats.direct_employees, contract: stats.contract_workers }
  ];

  const handleDownloadReport = () => {
    const csvContent = 'Entity,Direct Employees,Contract Workers,Total Workforce,Female %,Training Hours,Compliance %\n' +
      subsidiariesData.map((item) => `"${item.name}",${item.direct},${item.contract},${item.total},${item.femalePct},${item.trainingHrs},${item.compliance}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MEIL_HR_Overview_${selectedYear.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast?.('Downloaded HR overview CSV');
  };

  const handlePrimaryTraining = () => {
    if (onOpenLogTraining) onOpenLogTraining();
    else onNavigateTab?.('training');
  };

  const handleUploadEvidence = () => {
    if (onOpenUploadEvidence) onOpenUploadEvidence();
    else onNavigateTab?.('evidence');
  };

  const handleSubmitReturn = () => {
    if (onOpenSubmitReturn) onOpenSubmitReturn();
    else onNavigateTab?.('submissions');
  };

  return (
    <div className="hr-container">
      <div className="hr-header-banner">
        <div className="hr-header-left">
          <div className="hr-header-icon">
            <Users size={24} />
          </div>
          <div className="hr-header-title-box">
            <div className="hr-badge-row">
              <span className="hr-brsr-badge">SEBI BRSR Principles 3 & 5</span>
              <span className="hr-scope-tag">Comprehensive headcount, training, wellbeing, and human rights intelligence</span>
            </div>
            <h1 className="hr-title">Human Resources & Workforce Intelligence</h1>
            <p className="hr-subtitle">
              Current workforce situation, statutory risks, and next actions across MEIL Group.
            </p>
          </div>
        </div>

        <div className="hr-overview-assurance">
          <span>P3 Employee Wellbeing 3 & 5</span>
          <span>P5 Human Rights</span>
          <button type="button" onClick={() => onNavigateTab?.('reports')}>View Mapping</button>
        </div>
      </div>

      <div className="hr-filter-row">
        <select className="hr-select-sub" value={selectedSub} onChange={(event) => setSelectedSub(event.target.value)}>
          <option value="ALL">All Subsidiaries ({stats.total_workforce.toLocaleString()})</option>
          <option value="Core">MEIL Core EPC (22,400)</option>
          <option value="Olectra">Olectra Greentech (6,250)</option>
          <option value="Megha Gas">Megha Gas (4,100)</option>
          <option value="Drillmec">Drillmec S.p.A (3,800)</option>
          <option value="ICOMM">ICOMM Tele (3,600)</option>
          <option value="Evey">Evey Trans (2,700)</option>
        </select>
        <select className="hr-select-sub" value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
          <option value="September 2026">September 2026</option>
          <option value="Q2 FY 2026-27">Q2 FY 2026-27</option>
          <option value="FY 2026-27">FY 2026-27</option>
        </select>
        <button className="hr-btn-glass" type="button" onClick={handleDownloadReport}>
          <Download size={13} />
          <span>BRSR P3 Export</span>
        </button>
        <button className="hr-btn-primary" type="button" onClick={handleSubmitReturn}>
          <Plus size={14} />
          <span>BRSR P3 Batch</span>
        </button>
      </div>

      <div className="hr-kpi-grid">
        <button className="hr-kpi-card hr-clickable-card" type="button" onClick={() => onNavigateTab?.('workforce')}>
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Total Workforce</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Users size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{stats.total_workforce.toLocaleString()}</span>
          </div>
          <div className="hr-kpi-sub"><span className="hr-kpi-delta-good">+3.2%</span> vs last month</div>
        </button>

        <button className="hr-kpi-card hr-clickable-card" type="button" onClick={() => onNavigateTab?.('workforce')}>
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Female Workforce</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777' }}>
              <Award size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{stats.female_diversity_pct}%</span>
          </div>
          <div className="hr-kpi-sub"><span className="hr-kpi-delta-good">+2.4%</span> YoY</div>
        </button>

        <button className="hr-kpi-card hr-clickable-card" type="button" onClick={() => onNavigateTab?.('training')}>
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Training Coverage</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <GraduationCap size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">78%</span>
          </div>
          <div className="hr-kpi-sub"><span className="hr-kpi-delta-good">+6%</span> vs last month</div>
        </button>

        <button className="hr-kpi-card hr-clickable-card" type="button" onClick={() => onNavigateTab?.('human-rights')}>
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">Fair Wage Compliance</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <ShieldCheck size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{stats.fair_wage_adherence_pct}%</span>
          </div>
          <div className="hr-kpi-sub">Compliant</div>
        </button>

        <button className="hr-kpi-card hr-clickable-card" type="button" onClick={() => onNavigateTab?.('workforce')}>
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">PwD Inclusion</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <Sparkles size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{stats.differently_abled_count}</span>
          </div>
          <div className="hr-kpi-sub">3.1% of workforce</div>
        </button>

        <button className="hr-kpi-card hr-clickable-card" type="button" onClick={() => onNavigateTab?.('human-rights')}>
          <div className="hr-kpi-top">
            <span className="hr-kpi-title">POSH Grievances</span>
            <div className="hr-kpi-icon" style={{ background: 'rgba(219, 39, 119, 0.1)', color: '#DB2777' }}>
              <Scale size={15} />
            </div>
          </div>
          <div className="hr-kpi-val-row">
            <span className="hr-kpi-val">{stats.posh_resolution_pct}%</span>
          </div>
          <div className="hr-kpi-sub">Resolved ({stats.pending_posh_grievances} pending)</div>
        </button>
      </div>

      <div className="hr-overview-grid">
        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">Workforce Trend</h3>
              <p className="hr-card-sub">Total, direct, and contract workforce movement through the current reporting period.</p>
            </div>
            <div className="hr-chart-legend">
              <span><i style={{ background: '#2563EB' }} /> Total</span>
              <span><i style={{ background: '#60A5FA' }} /> Direct</span>
              <span><i style={{ background: '#A855F7' }} /> Contract</span>
            </div>
          </div>
          <div className="hr-bar-chart" aria-label="Workforce trend chart">
            {trendMonths.map((item) => (
              <div className="hr-bar-group" key={item.month}>
                <div className="hr-bar-stack">
                  <span className="hr-bar-contract" style={{ height: `${Math.max(34, item.contract / 520)}px` }} />
                  <span className="hr-bar-direct" style={{ height: `${Math.max(20, item.direct / 520)}px` }} />
                </div>
                <span className="hr-bar-month">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">Action Required</h3>
              <p className="hr-card-sub">Items that need HR owner review before BRSR closure.</p>
            </div>
            <AlertTriangle size={16} color="#D97706" />
          </div>
          <div className="hr-action-list">
            {actionItems.map((item) => (
              <button className="hr-action-row" type="button" key={item.label} onClick={() => onNavigateTab?.(item.tab)}>
                <span className={`hr-action-count ${item.tone}`}>{item.count}</span>
                <span>{item.label}</span>
                <ChevronRight size={13} />
              </button>
            ))}
          </div>
        </div>

        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">Recent HR Activities</h3>
              <p className="hr-card-sub">Latest workforce, evidence, training, and filing events.</p>
            </div>
            <Activity size={16} color="#2563EB" />
          </div>
          <div className="hr-activity-list">
            {recentActivities.map((item) => {
              const Icon = item.icon;
              return (
                <button className="hr-activity-row" type="button" key={item.label} onClick={() => onNavigateTab?.(item.tab)}>
                  <span className="hr-activity-icon"><Icon size={13} /></span>
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.time}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="hr-module-status-grid">
        {moduleCards.map((module) => {
          const Icon = module.icon;
          return (
            <button className="hr-module-card" type="button" key={module.label} onClick={() => onNavigateTab?.(module.tab)}>
              <div className="hr-module-card-top">
                <span className="hr-kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                  <Icon size={15} />
                </span>
                <ArrowUpRight size={14} color="#94A3B8" />
              </div>
              <span className="hr-module-label">{module.label}</span>
              <strong>{module.value}</strong>
              <small>{module.detail}</small>
              <span className="hr-module-progress">
                <i style={{ width: `${module.progress}%` }} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="hr-main-grid">
        <div className="hr-card">
          <div className="hr-card-header">
            <div className="hr-card-title-box">
              <h3 className="hr-card-title">Workforce Status by Operating Entity</h3>
              <p className="hr-card-sub">Direct and contract workforce split, diversity, training hours, and statutory compliance.</p>
            </div>
            <button className="hr-btn-glass" type="button" onClick={() => onNavigateTab?.('workforce')}>
              <span>Open Workforce</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="hr-table-wrap">
            <table className="hr-table">
              <thead>
                <tr>
                  <th>Operating Entity</th>
                  <th>Direct</th>
                  <th>Contract</th>
                  <th>Total</th>
                  <th>Female</th>
                  <th>Training</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subsidiariesData.map((item) => (
                  <tr key={item.name}>
                    <td style={{ fontWeight: 700 }}>{item.name}</td>
                    <td>{item.direct.toLocaleString()}</td>
                    <td>{item.contract.toLocaleString()}</td>
                    <td><strong>{item.total.toLocaleString()}</strong></td>
                    <td><strong style={{ color: '#DB2777' }}>{item.femalePct}%</strong></td>
                    <td>{item.trainingHrs} hrs</td>
                    <td><span className="hr-chip-success"><Check size={9} /> {item.compliance}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="hr-card">
            <div className="hr-card-header">
              <div className="hr-card-title-box">
                <h3 className="hr-card-title">What Should HR Do Next?</h3>
                <p className="hr-card-sub">Recommended actions based on current workforce and compliance status.</p>
              </div>
              <TrendingUp size={16} color="#2563EB" />
            </div>
            <div className="hr-next-action-stack">
              <button type="button" className="hr-next-action primary" onClick={handlePrimaryTraining}>
                <GraduationCap size={15} />
                <span>Close 12 pending training batches</span>
              </button>
              <button type="button" className="hr-next-action" onClick={handleUploadEvidence}>
                <FileText size={15} />
                <span>Upload expiring certificate evidence</span>
              </button>
              <button type="button" className="hr-next-action" onClick={() => onNavigateTab?.('human-rights')}>
                <ShieldCheck size={15} />
                <span>Review wage exception queue</span>
              </button>
            </div>
          </div>

          <div className="hr-card">
            <div className="hr-card-header">
              <div className="hr-card-title-box">
                <h3 className="hr-card-title">BRSR / Analytics Readiness</h3>
                <p className="hr-card-sub">Principle 3 and 5 assurance preparation.</p>
              </div>
              <span className="hr-chip-success">96.8% Ready</span>
            </div>
            <div className="hr-readiness-ring">
              <div className="hr-readiness-donut">
                <span>96.8%</span>
                <small>Ready</small>
              </div>
              <div className="hr-readiness-details">
                <span><CheckCircle2 size={12} /> Workforce register complete</span>
                <span><CheckCircle2 size={12} /> Human rights controls verified</span>
                <span><Calendar size={12} /> 5 statutory filings in current cycle</span>
                <button type="button" className="hr-btn-glass" onClick={() => onNavigateTab?.('analytics')}>
                  <BarChart3 size={13} />
                  <span>Open Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
