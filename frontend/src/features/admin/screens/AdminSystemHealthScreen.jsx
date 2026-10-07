import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Server, 
  Database, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  FileText,
  AlertTriangle 
} from 'lucide-react';

export default function AdminSystemHealthScreen({
  healthData = {}
}) {
  const services = healthData.services || [
    { name: 'Backend API (FastAPI)', uptime_pct: 99.8, status: 'Operational', latency_ms: 24 },
    { name: 'Frontend Web App (Vite)', uptime_pct: 99.8, status: 'Operational', latency_ms: 12 },
    { name: 'Primary Database (SQLite / Postgres)', uptime_pct: 99.9, status: 'Operational', latency_ms: 8 },
    { name: 'API Gateway & Router', uptime_pct: 99.7, status: 'Operational', latency_ms: 28 },
    { name: 'Audit Service & Hash Chain', uptime_pct: 99.9, status: 'Operational', latency_ms: 4 },
    { name: 'Reporting Engine (PDF / XBRL)', uptime_pct: 99.6, status: 'Operational', latency_ms: 45 }
  ];

  const serviceStatus = healthData.service_status_matrix || {
    authentication_service: 'Operational',
    workflow_engine: 'Operational',
    calculation_engine: 'Operational',
    brsr_engine: 'Operational',
    notification_service: 'Operational'
  };

  const responseTimes = healthData.api_response_times || [
    { time: '06:00', average_ms: 120, p95_ms: 180 },
    { time: '07:00', average_ms: 135, p95_ms: 195 },
    { time: '08:00', average_ms: 160, p95_ms: 220 },
    { time: '09:00', average_ms: 190, p95_ms: 260 },
    { time: '10:00', average_ms: 140, p95_ms: 210 },
    { time: '11:00', average_ms: 130, p95_ms: 185 }
  ];

  return (
    <div className="admin-health-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>Platform Health & Services</h2>
          <p>Real-time telemetry, service heartbeat, API response latency, and database performance</p>
        </div>
      </div>

      {/* 6 Service Uptime Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '22px' }}>
        {services.map((s, idx) => (
          <div key={idx} className="admin-card" style={{ margin: 0, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.name.split('(')[0]}
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#16A34A', marginTop: '6px' }}>
              {s.uptime_pct}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
              <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '600' }}>{s.status}</span>
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
              {s.latency_ms} ms ping
            </div>
          </div>
        ))}
      </div>

      {/* API Latency Chart & Subsystem Status Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        {/* Left: API Response Time Graph Card */}
        <div className="admin-card" style={{ margin: 0, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                API Response Time (ms)
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                Median average: 136 ms • p95 benchmark: 185 ms
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563EB', fontWeight: '600' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} /> Average
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7C3AED', fontWeight: '600' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7C3AED' }} /> p95
              </span>
            </div>
          </div>

          {/* SVG Latency Graph */}
          <div style={{ width: '100%', height: '180px', position: 'relative' }}>
            <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%' }}>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />

              {/* p95 Line (Purple) */}
              <polyline
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2.5"
                points="20,90 100,82 180,68 260,50 340,74 420,86"
              />

              {/* Average Line (Blue) */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                points="20,110 100,102 180,90 260,75 340,100 420,106"
              />

              {/* Markers */}
              {[
                { x: 20, y: 110 }, { x: 100, y: 102 }, { x: 180, y: 90 },
                { x: 260, y: 75 }, { x: 340, y: 100 }, { x: 420, y: 106 }
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#2563EB" />
              ))}
            </svg>

            {/* X-Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontSize: '10.5px', color: '#94A3B8' }}>
              {responseTimes.map(r => (
                <span key={r.time}>{r.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Subsystem Status Checklist */}
        <div className="admin-card" style={{ margin: 0, padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
            Service Status Matrix
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(serviceStatus).map(([key, val]) => (
              <div 
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#0F172A' }}>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <span className="admin-badge admin-badge-success" style={{ fontSize: '10.5px' }}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
