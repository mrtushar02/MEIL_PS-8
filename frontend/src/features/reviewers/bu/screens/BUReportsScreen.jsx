import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  FileSpreadsheet,
  FileCode,
  Layers,
  ShieldCheck,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

export default function BUReportsScreen() {
  const [generatingReportId, setGeneratingReportId] = useState(null);
  const [completedReports, setCompletedReports] = useState({});
  const [selectedFormat, setSelectedFormat] = useState('PDF');

  const reportCatalog = [
    {
      id: 'rpt-01',
      title: 'BU ESG Summary',
      subtitle: 'Comprehensive BU Performance Report',
      description:
        'Executive ESG summary consolidating Scope 1, 2, water, waste, and safety KPIs across all 6 project sites for Subsidiary Head submission.',
      iconColor: '#2563EB',
      iconBg: 'rgba(37,99,235,0.08)',
      recommendedFormat: 'PDF',
      lastGenerated: 'Today, 14:30'
    },
    {
      id: 'rpt-02',
      title: 'BU Consolidation Report',
      subtitle: 'Project-wise consolidated data',
      description:
        'Detailed tabular breakdown per site and emission category conforming strictly to SEBI BRSR Core format and CEA v19 Grid Baseline factors.',
      iconColor: '#10B981',
      iconBg: 'rgba(16,185,129,0.08)',
      recommendedFormat: 'Excel',
      lastGenerated: 'Yesterday'
    },
    {
      id: 'rpt-03',
      title: 'Submission Status Report',
      subtitle: 'All submission status and exceptions',
      description:
        'Operational tracking register with turnaround times, SLA breach warnings, pending review bottlenecks, and correction requests.',
      iconColor: '#F59E0B',
      iconBg: 'rgba(245,158,11,0.08)',
      recommendedFormat: 'Excel',
      lastGenerated: '2 days ago'
    },
    {
      id: 'rpt-04',
      title: 'Evidence Coverage Report',
      subtitle: 'Evidence completeness and verification',
      description:
        'Full document registry with SHA-256 integrity hashes, vendor invoice linkages, verification status, and flag logs for external auditors.',
      iconColor: '#6366F1',
      iconBg: 'rgba(99,102,241,0.08)',
      recommendedFormat: 'PDF',
      lastGenerated: '26 Sep 2026'
    },
    {
      id: 'rpt-05',
      title: 'Approval History Report',
      subtitle: 'Workflow and approval timeline',
      description:
        'Chronological audit log of all BU Coordinator decisions, timestamps, comments, and cryptographic handover signatures.',
      iconColor: '#0EA5E9',
      iconBg: 'rgba(14,165,233,0.08)',
      recommendedFormat: 'PDF',
      lastGenerated: '25 Sep 2026'
    }
  ];

  const handleGenerate = rpt => {
    setGeneratingReportId(rpt.id);
    setTimeout(() => {
      setGeneratingReportId(null);
      setCompletedReports(prev => ({
        ...prev,
        [rpt.id]: {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          format: selectedFormat
        }
      }));
    }, 1200);
  };

  return (
    <div className="bu-reports-screen">
      {/* Top Banner */}
      <div className="bu-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="bu-card-title" style={{ fontSize: '18px' }}>BU Reports Center</h3>
            <p className="bu-card-subtitle">
              Official exportable regulatory packages, consolidation sheets, and audit registers for Tunnels BU
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Default Export Format:</span>
            <div className="bu-segmented-nav" style={{ margin: 0 }}>
              {['PDF', 'Excel', 'JSON'].map(fmt => (
                <button
                  key={fmt}
                  className={`bu-segmented-btn ${selectedFormat === fmt ? 'active' : ''}`}
                  onClick={() => setSelectedFormat(fmt)}
                  style={{ padding: '4px 12px', fontSize: '11px' }}
                >
                  <span>{fmt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Items List matching panel 11 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reportCatalog.map(rpt => {
          const isGenerating = generatingReportId === rpt.id;
          const completed = completedReports[rpt.id];

          return (
            <div
              key={rpt.id}
              className="bu-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: rpt.iconBg,
                    color: rpt.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FileText size={22} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                      {rpt.title}
                    </h4>
                    <span
                      style={{
                        fontSize: '11px',
                        background: '#F1F5F9',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}
                    >
                      {rpt.recommendedFormat}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                    {rpt.subtitle}
                  </span>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#334155', maxWidth: '640px' }}>
                    {rpt.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
                {completed ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} />
                      <span>Ready ({completed.timestamp})</span>
                    </span>
                    <button
                      className="bu-btn bu-btn-primary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      onClick={() => {
                        const content = `MEIL BU STATUTORY REPORT\nTitle: ${rpt.title}\nFormat: ${completed.format}\nGenerated At: ${completed.timestamp}\nStatus: Verified & Validated\n\nMetric,Value,Unit,Compliance\nScope 1 Fuel Emissions,4820.5,tCO2e,Compliant\nScope 2 Grid Emissions,2104.3,tCO2e,Compliant\nWater Recycled Ratio,78.4,%,Exceeds Target\nLost Time Injury Frequency (LTIFR),0.12,rate,Compliant (Zero Fatalities)\n`;
                        const blob = new Blob([content], { type: completed.format === 'CSV' ? 'text/csv' : 'text/plain' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `${rpt.title.replace(/\s+/g, '_')}_Report.${completed.format.toLowerCase()}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>
                ) : (
                  <button
                    className="bu-btn bu-btn-secondary"
                    style={{ padding: '8px 18px', fontSize: '12px', minWidth: '100px' }}
                    onClick={() => handleGenerate(rpt)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RotateCcw size={13} className="spin-animation" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} color="#2563EB" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
