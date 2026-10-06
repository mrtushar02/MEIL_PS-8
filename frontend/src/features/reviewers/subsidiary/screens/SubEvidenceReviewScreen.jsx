import React, { useState } from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, Search, Filter, Download, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SubEvidenceReviewScreen() {
  const [filterBu, setFilterBu] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');

  const evidenceList = [
    { id: 'EV-SUB-01', title: 'Scope 1 Diesel Log & IOCL Tanker Challans', bu: 'Tunnels BU', site: 'Zojila Tunnel Site', type: 'Energy / Fuel', date: '28 Oct 2024', size: '4.2 MB', verifiedBy: 'P. Nair (BU Coord)', status: 'Verified', hash: 'sha256:4a8b...19e' },
    { id: 'EV-SUB-02', title: 'DISCOM HT Electricity Bills FY25 Q2', bu: 'Tunnels BU', site: 'Rohtang Pass Tunnel Site', type: 'Scope 2 / Grid', date: '27 Oct 2024', size: '2.8 MB', verifiedBy: 'P. Nair (BU Coord)', status: 'Verified', hash: 'sha256:7c1d...88f' },
    { id: 'EV-SUB-03', title: 'CPCB Calibrated Continuous Flue Gas Report', bu: 'Energy BU', site: 'Thermal Infra Unit 4', type: 'Emissions', date: '26 Oct 2024', size: '6.1 MB', verifiedBy: 'R. Sharma (BU Coord)', status: 'Verified', hash: 'sha256:92e4...31a' },
    { id: 'EV-SUB-04', title: 'CGWA Approved Groundwater Extraction Telemetry', bu: 'Water BU', site: 'Kaleshwaram Lift Irrig.', type: 'Water Stewardship', date: '25 Oct 2024', size: '1.9 MB', verifiedBy: 'A. Rao (BU Coord)', status: 'Verified', hash: 'sha256:55f2...bc0' },
    { id: 'EV-SUB-05', title: 'SPCB Hazardous Waste Manifest Form-10', bu: 'Infrastructure BU', site: 'Ganga Expressway Pkg 3', type: 'Waste / SPCB', date: '25 Oct 2024', size: '3.4 MB', verifiedBy: 'S. Verma (BU Coord)', status: 'Pending Review', hash: 'sha256:10ca...fe2' },
    { id: 'EV-SUB-06', title: 'TUV Nord ISO 45001 External Safety Audit', bu: 'Metro BU', site: 'Bengaluru Metro Ph 2A', type: 'Health & Safety', date: '24 Oct 2024', size: '5.7 MB', verifiedBy: 'K. Patel (BU Coord)', status: 'Verified', hash: 'sha256:88ad...273' },
    { id: 'EV-SUB-07', title: 'Third-Party CSR Impact Evaluation Report', bu: 'Group Corporate', site: 'CSR Model Villages', type: 'CSR / Social', date: '22 Oct 2024', size: '8.3 MB', verifiedBy: 'M. Deshmukh', status: 'Verified', hash: 'sha256:e3b1...aa9' }
  ];

  const filtered = evidenceList.filter(item => {
    if (filterBu !== 'All' && item.bu !== filterBu) return false;
    if (filterType !== 'All' && item.type !== filterType) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="sub-evidence-review-screen">
      {/* Top Banner */}
      <div className="sub-card" style={{ marginBottom: '1.25rem' }}>
        <div className="sub-card-header">
          <div>
            <h2 className="sub-card-title">Consolidated Subsidiary Evidence Repository</h2>
            <p className="sub-card-subtitle">
              Verify statutory test reports, DISCOM bills, CPCB calibration certificates, and auditor sign-offs across all 6 BUs
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="sub-badge-purple">
              <ShieldCheck size={13} style={{ marginRight: '0.25rem', display: 'inline' }} />
              SEBI BRSR Core Audit Grade
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.4rem 0.8rem', minWidth: '260px' }}>
            <Search size={16} color="#64748B" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search evidence ID, title..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem', color: '#0F172A' }}
            />
          </div>

          <select 
            value={filterBu} 
            onChange={e => setFilterBu(e.target.value)}
            style={{ padding: '0.45rem 0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}
          >
            <option value="All">All Business Units</option>
            <option value="Tunnels BU">Tunnels BU</option>
            <option value="Water BU">Water BU</option>
            <option value="Energy BU">Energy BU</option>
            <option value="Infrastructure BU">Infrastructure BU</option>
            <option value="Metro BU">Metro BU</option>
          </select>

          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
            Showing {filtered.length} of {evidenceList.length} artifacts
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="sub-card">
        <div className="sub-table-container">
          <table className="sub-table">
            <thead>
              <tr>
                <th>Artifact ID</th>
                <th>Evidence Title & Details</th>
                <th>Business Unit</th>
                <th>Site / Location</th>
                <th>Category</th>
                <th>Uploaded & Verified By</th>
                <th>Audit Hash</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#7C3AED' }}>
                      {item.id}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileText size={14} color="#7C3AED" />
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                        Uploaded {item.date} • {item.size}
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 600 }}>{item.bu}</span></td>
                  <td><span style={{ color: '#475569', fontSize: '0.8rem' }}>{item.site}</span></td>
                  <td><span className="sub-badge-neutral">{item.type}</span></td>
                  <td>
                    <div style={{ fontSize: '0.78rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                      <CheckCircle2 size={13} color="#16A34A" />
                      {item.verifiedBy}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#64748B', background: '#F1F5F9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                      {item.hash}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button className="sub-btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }} title="Inspect PDF">
                        <ExternalLink size={13} /> View
                      </button>
                      <button className="sub-btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }} title="Download Raw Artifact">
                        <Download size={13} />
                      </button>
                    </div>
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
