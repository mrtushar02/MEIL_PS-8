import React from 'react';
import { Award, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function ESGRatingsBenchmarkingScreen() {
  const peers = [
    { entity: 'Megha Engineering & Infra (MEIL)', msci: 'BBB (Upgrade to A Pending)', spGlobal: '62 / 100', crisil: 'Strong', carbonIntensity: '5.61 t / ₹ Cr', renewableMix: '38.6%' },
    { entity: 'Larsen & Toubro (L&T)', msci: 'A', spGlobal: '68 / 100', crisil: 'Strong', carbonIntensity: '6.20 t / ₹ Cr', renewableMix: '34.2%' },
    { entity: 'Tata Projects Limited', msci: 'BBB', spGlobal: '58 / 100', crisil: 'Adequate', carbonIntensity: '7.10 t / ₹ Cr', renewableMix: '28.0%' },
    { entity: 'Afcons Infrastructure', msci: 'BB', spGlobal: '52 / 100', crisil: 'Adequate', carbonIntensity: '8.40 t / ₹ Cr', renewableMix: '19.4%' },
    { entity: 'Dilip Buildcon Limited', msci: 'B', spGlobal: '44 / 100', crisil: 'Moderate', carbonIntensity: '9.80 t / ₹ Cr', renewableMix: '12.0%' }
  ];

  return (
    <div className="exec-bd-ratings">
      <div className="exec-bd-card" style={{ marginBottom: '1.25rem' }}>
        <div className="exec-bd-card-header">
          <div>
            <h2 className="exec-bd-card-title">Global ESG Rating Agency Standing & Peer Benchmarking</h2>
            <p className="exec-bd-card-subtitle">
              Benchmarking against leading Indian and global infrastructure EPC conglomerates
            </p>
          </div>
          <span className="exec-bd-badge-slate">Top Decile Operational Metrics</span>
        </div>
      </div>

      <div className="exec-bd-card">
        <div className="exec-bd-table-container">
          <table className="exec-bd-table">
            <thead>
              <tr>
                <th>Infrastructure Peer Entity</th>
                <th>MSCI Rating</th>
                <th>S&P Global ESG Score</th>
                <th>CRISIL ESG Evaluation</th>
                <th>Carbon Intensity</th>
                <th style={{ textAlign: 'right' }}>Renewable Energy Mix</th>
              </tr>
            </thead>
            <tbody>
              {peers.map((p, idx) => (
                <tr key={idx} style={{ background: idx === 0 ? 'rgba(238, 242, 255, 0.5)' : undefined }}>
                  <td>
                    <span style={{ fontWeight: idx === 0 ? 800 : 600, color: idx === 0 ? '#1E293B' : '#475569' }}>
                      {p.entity}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: p.msci.startsWith('A') ? '#047857' : '#1E293B' }}>{p.msci}</span>
                  </td>
                  <td><span style={{ fontWeight: 600 }}>{p.spGlobal}</span></td>
                  <td><span>{p.crisil}</span></td>
                  <td><span style={{ fontWeight: 700, color: '#0891B2' }}>{p.carbonIntensity}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{p.renewableMix}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
