import React, { useState } from 'react';
import { Layers, ChevronRight, ChevronDown, Building, Building2, MapPin, CheckCircle2, Clock, ShieldCheck, User, ArrowUpRight } from 'lucide-react';

export default function GroupHierarchyExplorerScreen() {
  const [selectedNode, setSelectedNode] = useState({
    id: 'T1-HQ',
    level: 'Tier-1 Apex',
    name: 'Megha Engineering & Infrastructures Limited (MEIL Group)',
    lead: 'Dr. Rajeshwar Rao (Group CSO)',
    scope: '6 Subsidiaries • 36 Business Units • 258 Sites',
    status: 'Consolidation Active',
    emissions: '184,250 tCO2e',
    readiness: '96.4%'
  });

  const [expandedSubs, setExpandedSubs] = useState({ 'SUB-01': true });

  const toggleSub = (code) => {
    setExpandedSubs(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const subsidiariesTree = [
    {
      code: 'SUB-01',
      name: 'Megha Hydro & Infrastructure Subsidiary',
      lead: 'V. Krishna (Head)',
      bus: [
        { code: 'BU-TUN', name: 'Tunnels Business Unit', lead: 'P. Nair', sites: 42, emissions: '18,400 tCO2e', status: 'Approved' },
        { code: 'BU-WAT', name: 'Water & Irrigation BU', lead: 'A. Rao', sites: 58, emissions: '12,900 tCO2e', status: 'Approved' },
        { code: 'BU-NRG', name: 'Thermal & Power BU', lead: 'R. Sharma', sites: 34, emissions: '19,500 tCO2e', status: 'Approved' },
        { code: 'BU-INF', name: 'Highways & Civil Infra BU', lead: 'S. Verma', sites: 62, emissions: '13,320 tCO2e', status: 'In Review' }
      ]
    },
    {
      code: 'SUB-02',
      name: 'Megha City Gas & Distribution',
      lead: 'M. Anand (Head)',
      bus: [
        { code: 'BU-CGD-S', name: 'South India City Gas BU', lead: 'K. Reddy', sites: 22, emissions: '11,200 tCO2e', status: 'Approved' },
        { code: 'BU-CGD-W', name: 'Western Zone Gas BU', lead: 'N. Joshi', sites: 16, emissions: '11,250 tCO2e', status: 'Approved' }
      ]
    },
    {
      code: 'SUB-03',
      name: 'Megha Solar & Clean Energy',
      lead: 'D. Sen (Head)',
      bus: [
        { code: 'BU-SOL-UT', name: 'Utility Scale Solar BU', lead: 'T. Ganguly', sites: 32, emissions: '4,100 tCO2e', status: 'Approved' },
        { code: 'BU-SOL-RF', name: 'C&I Rooftop & Hybrid BU', lead: 'V. Iyer', sites: 20, emissions: '4,820 tCO2e', status: 'Approved' }
      ]
    },
    {
      code: 'SUB-04',
      name: 'Megha Electric Mobility (Olectra Greentech)',
      lead: 'S. Rawat (Head)',
      bus: [
        { code: 'BU-EV-BUS', name: 'e-Bus Manufacturing BU', lead: 'H. Malhotra', sites: 12, emissions: '8,100 tCO2e', status: 'Approved' },
        { code: 'BU-EV-CHG', name: 'Fleet Depots & Charging BU', lead: 'J. Pinto', sites: 12, emissions: '6,110 tCO2e', status: 'Approved' }
      ]
    }
  ];

  return (
    <div className="group-hierarchy-screen">
      <div className="group-card" style={{ marginBottom: '1.25rem' }}>
        <div className="group-card-header">
          <div>
            <h2 className="group-card-title">4-Tier Enterprise Organizational Hierarchy</h2>
            <p className="group-card-subtitle">
              Explore governance boundaries, reporting lines, and roll-up paths from 258 construction sites to Group HQ
            </p>
          </div>
          <span className="group-badge-indigo">SEBI Mandated Consolidation Model</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.25rem' }}>
        {/* Left: Interactive Tree Navigator */}
        <div className="group-card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#4338CA" /> Organizational Structure
          </h3>

          {/* Group HQ Node */}
          <div 
            onClick={() => setSelectedNode({
              id: 'T1-HQ',
              level: 'Tier-1 Apex',
              name: 'Megha Engineering & Infrastructures Limited (MEIL Group)',
              lead: 'Dr. Rajeshwar Rao (Group CSO)',
              scope: '6 Subsidiaries • 36 Business Units • 258 Sites',
              status: 'Consolidation Active',
              emissions: '184,250 tCO2e',
              readiness: '96.4%'
            })}
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '14px',
              background: selectedNode.id === 'T1-HQ' ? '#EEF2FF' : '#F8FAFC',
              border: selectedNode.id === 'T1-HQ' ? '2px solid #4338CA' : '1px solid #E2E8F0',
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={18} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>MEIL Group Corporate HQ</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Tier-1 Apex Entity • Dr. Rajeshwar Rao (CSO)</div>
              </div>
            </div>
            <span className="group-badge-indigo">Apex</span>
          </div>

          {/* Subsidiary Nodes */}
          <div style={{ paddingLeft: '1.5rem', borderLeft: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {subsidiariesTree.map(sub => (
              <div key={sub.code}>
                <div 
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: selectedNode.id === sub.code ? '#EEF2FF' : '#FFFFFF',
                    border: selectedNode.id === sub.code ? '2px solid #4338CA' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => {
                    toggleSub(sub.code);
                    setSelectedNode({
                      id: sub.code,
                      level: 'Tier-2 Subsidiary',
                      name: sub.name,
                      lead: sub.lead,
                      scope: `${sub.bus.length} Business Units • Multiple Sites`,
                      status: 'Approved',
                      emissions: 'Consolidated',
                      readiness: '93.2%'
                    });
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {expandedSubs[sub.code] ? <ChevronDown size={16} color="#64748B" /> : <ChevronRight size={16} color="#64748B" />}
                    <Building2 size={16} color="#7C3AED" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{sub.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{sub.code} • {sub.lead}</div>
                    </div>
                  </div>
                  <span className="group-badge-success">Tier-2</span>
                </div>

                {/* BU Children */}
                {expandedSubs[sub.code] && (
                  <div style={{ paddingLeft: '2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '2px solid #E2E8F0', marginLeft: '1rem' }}>
                    {sub.bus.map(bu => (
                      <div 
                        key={bu.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode({
                            id: bu.code,
                            level: 'Tier-3 Business Unit',
                            name: bu.name,
                            lead: `${bu.lead} (BU Coordinator)`,
                            scope: `${bu.sites} Active Project Sites`,
                            status: bu.status,
                            emissions: bu.emissions,
                            readiness: '97.8%'
                          });
                        }}
                        style={{
                          padding: '0.6rem 0.85rem',
                          borderRadius: '10px',
                          background: selectedNode.id === bu.code ? '#EEF2FF' : '#F8FAFC',
                          border: selectedNode.id === bu.code ? '1.5px solid #4338CA' : '1px solid #E2E8F0',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#4338CA', fontWeight: 700 }}>{bu.code}</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{bu.name}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{bu.sites} Sites</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Node Details Inspector */}
        <div className="group-card" style={{ height: 'fit-content' }}>
          <div className="group-card-header">
            <div>
              <span className="group-badge-indigo" style={{ marginBottom: '0.4rem' }}>{selectedNode.level}</span>
              <h3 className="group-card-title">{selectedNode.name}</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Designated Lead / Head:</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} color="#4338CA" /> {selectedNode.lead}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Emissions Footprint:</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4338CA', marginTop: '0.2rem' }}>
                  {selectedNode.emissions}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>SEBI Audit Readiness:</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                  {selectedNode.readiness}
                </div>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Operational Scope:</span>
              <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600, marginTop: '0.2rem' }}>
                {selectedNode.scope}
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="group-btn-primary" style={{ flex: 1, padding: '0.5rem' }}>
                Inspect Deep Submissions <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
