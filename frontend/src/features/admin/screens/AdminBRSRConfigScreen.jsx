import React, { useState } from 'react';
import { 
  FileCheck, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Eye, 
  Sliders, 
  FileText 
} from 'lucide-react';

export default function AdminBRSRConfigScreen({
  factors = []
}) {
  const [activeTab, setActiveTab] = useState('Frameworks');

  const frameworks = [
    { version: '2025', name: 'SEBI BRSR Core 2025', status: 'Active', effective: '1 Jan 2025', indicators: 38, core_attributes: 9, circular: 'SEBI/HO/CFD/CFD-SEC-2/P/CIR/2025/11' },
    { version: '2023', name: 'SEBI BRSR Core 2023', status: 'Active', effective: '1 Jan 2023', indicators: 27, core_attributes: 6, circular: 'SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122' },
    { version: '2021', name: 'SEBI BRSR 2021', status: 'Archived', effective: '1 Jan 2021', indicators: 21, core_attributes: 8, circular: 'SEBI/HO/CFD/CMD-2/P/CIR/2021/562' }
  ];

  return (
    <div className="admin-brsr-config-screen">
      {/* Header */}
      <div className="admin-section-header">
        <div className="admin-section-title-wrap">
          <h2>ESG & BRSR Statutory Configuration</h2>
          <p>Maintain SEBI circular frameworks, 9 NGRBC principle indicators, and national emission factor baselines</p>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
        {['Frameworks', 'Factors (CEA Baseline)', 'Principles & Indicators', 'Validation Rules'].map((tab) => (
          <button 
            key={tab}
            type="button" 
            className={`admin-btn ${activeTab === tab ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Frameworks Tab */}
      {activeTab === 'Frameworks' && (
        <div className="admin-table-card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              BRSR Regulatory Frameworks
            </h3>
            <span className="admin-badge admin-badge-success">SEBI 2025 Active</span>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Framework Name</th>
                <th>Status</th>
                <th>Effective Period</th>
                <th>Indicators</th>
                <th>Core Attributes</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {frameworks.map((f) => (
                <tr key={f.version}>
                  <td><span className="admin-badge admin-badge-blue">{f.version}</span></td>
                  <td>
                    <div>
                      <strong style={{ color: '#0F172A' }}>{f.name}</strong>
                      <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{f.circular}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${f.status === 'Active' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td>{f.effective}</td>
                  <td><strong>{f.indicators}</strong></td>
                  <td><span className="admin-badge admin-badge-purple">{f.core_attributes}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                      <Eye size={12} /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Factors Tab */}
      {activeTab === 'Factors (CEA Baseline)' && (
        <div className="admin-table-card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              National & CEA India Emission Factors
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Statutory GHG Protocol Scope 1, 2, 3 conversion coefficients
            </p>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Activity / Fuel</th>
                <th>Scope</th>
                <th>Factor Value</th>
                <th>Unit</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>CEA India Grid Electricity</strong></td>
                <td><span className="admin-badge admin-badge-purple">Scope 2</span></td>
                <td><strong style={{ color: '#2563EB' }}>0.716</strong></td>
                <td>kg CO₂e / kWh</td>
                <td>CEA India Baseline v19 (2024)</td>
                <td><span className="admin-badge admin-badge-success">Enforced</span></td>
              </tr>
              <tr>
                <td><strong>High-Speed Diesel (HSD)</strong></td>
                <td><span className="admin-badge admin-badge-blue">Scope 1</span></td>
                <td><strong style={{ color: '#2563EB' }}>2.68</strong></td>
                <td>kg CO₂e / Litre</td>
                <td>IPCC 2006 Guidelines</td>
                <td><span className="admin-badge admin-badge-success">Enforced</span></td>
              </tr>
              <tr>
                <td><strong>Motor Gasoline (Petrol)</strong></td>
                <td><span className="admin-badge admin-badge-blue">Scope 1</span></td>
                <td><strong style={{ color: '#2563EB' }}>2.31</strong></td>
                <td>kg CO₂e / Litre</td>
                <td>IPCC 2006 Guidelines</td>
                <td><span className="admin-badge admin-badge-success">Enforced</span></td>
              </tr>
              <tr>
                <td><strong>Purchased Steam / Heat</strong></td>
                <td><span className="admin-badge admin-badge-purple">Scope 2</span></td>
                <td><strong style={{ color: '#2563EB' }}>0.054</strong></td>
                <td>t CO₂e / GJ</td>
                <td>DEFRA 2024 Baseline</td>
                <td><span className="admin-badge admin-badge-success">Enforced</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Principles & Indicators Tab */}
      {activeTab === 'Principles & Indicators' && (
        <div className="admin-card" style={{ margin: 0, padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
            NGRBC 9 National Guidelines on Responsible Business Conduct
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { p: 'Principle 1', title: 'Integrity, Ethics & Anti-Corruption', cat: 'Governance' },
              { p: 'Principle 2', title: 'Safe & Sustainable Goods & Services', cat: 'Product' },
              { p: 'Principle 3', title: 'Employee Wellbeing & Safety', cat: 'Social' },
              { p: 'Principle 4', title: 'Stakeholder Responsiveness', cat: 'Stakeholders' },
              { p: 'Principle 5', title: 'Human Rights Promotion', cat: 'Social' },
              { p: 'Principle 6', title: 'Environmental Protection & Climate', cat: 'Environment' },
              { p: 'Principle 7', title: 'Public & Regulatory Policy Advocacy', cat: 'Governance' },
              { p: 'Principle 8', title: 'Inclusive Growth & Community (CSR)', cat: 'Social' },
              { p: 'Principle 9', title: 'Customer Value & Consumer Protection', cat: 'Consumer' }
            ].map((principle) => (
              <div key={principle.p} style={{ padding: '14px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="admin-badge admin-badge-blue" style={{ fontSize: '10px' }}>{principle.p}</span>
                  <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>{principle.cat}</span>
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#0F172A' }}>
                  {principle.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Rules Tab */}
      {activeTab === 'Validation Rules' && (
        <div className="admin-table-card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Automated Data Validation & Verification Gates
            </h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Category</th>
                <th>Validation Logic</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>RULE-VAL-01</code></td>
                <td>Completeness</td>
                <td>Required monthly activity logs cannot be zero or null for active project</td>
                <td><span className="admin-badge admin-badge-danger">CRITICAL</span></td>
                <td><span className="admin-badge admin-badge-success">Active</span></td>
              </tr>
              <tr>
                <td><code>RULE-VAL-02</code></td>
                <td>Evidence Anchor</td>
                <td>Invoices required for grid electricity exceeding 10,000 kWh threshold</td>
                <td><span className="admin-badge admin-badge-warning">HIGH</span></td>
                <td><span className="admin-badge admin-badge-success">Active</span></td>
              </tr>
              <tr>
                <td><code>RULE-VAL-03</code></td>
                <td>Anomaly Variance</td>
                <td>Variance exceeding ±30% against 3-month trailing moving average flagged</td>
                <td><span className="admin-badge admin-badge-warning">MEDIUM</span></td>
                <td><span className="admin-badge admin-badge-success">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
