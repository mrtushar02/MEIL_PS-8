import React from 'react';
import { FileCode, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function XBRLPackagingScreen() {
  const xbrlTags = [
    { tag: 'in-brsr:Scope1EmissionsTotal', value: '112400', unit: 'MT CO2e', status: 'Valid XML Schema' },
    { tag: 'in-brsr:Scope2EmissionsTotal', value: '71850', unit: 'MT CO2e', status: 'Valid XML Schema' },
    { tag: 'in-brsr:TotalWaterConsumption', value: '1420000', unit: 'Cubic Meters', status: 'Valid XML Schema' },
    { tag: 'in-brsr:RenewableEnergyPercentage', value: '38.6', unit: 'Pure Ratio', status: 'Valid XML Schema' },
    { tag: 'in-brsr:LostTimeInjuryFrequencyRate', value: '0.08', unit: 'Frequency Rate', status: 'Valid XML Schema' }
  ];

  return (
    <div className="brsr-mgr-xbrl">
      <div className="brsr-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="brsr-mgr-card-header">
          <div>
            <h2 className="brsr-mgr-card-title">SEBI XBRL Taxonomy Packaging & Instance Validator</h2>
            <p className="brsr-mgr-card-subtitle">
              Generates compliant XBRL instance documents validating namespace, taxonomy elements, and mathematical consistency
            </p>
          </div>
          <button className="brsr-mgr-btn-primary">
            <Download size={14} /> Download XBRL Instance (.xml)
          </button>
        </div>
      </div>

      <div className="brsr-mgr-card">
        <div className="brsr-mgr-table-container">
          <table className="brsr-mgr-table">
            <thead>
              <tr>
                <th>SEBI Taxonomy Tag Name</th>
                <th>Tagged Instance Value</th>
                <th>Unit of Measure</th>
                <th style={{ textAlign: 'right' }}>Taxonomy Validation Status</th>
              </tr>
            </thead>
            <tbody>
              {xbrlTags.map(x => (
                <tr key={x.tag}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563EB' }}>{x.tag}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A' }}>{x.value}</span>
                  </td>
                  <td><span style={{ color: '#475569' }}>{x.unit}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="brsr-mgr-badge-blue">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                      {x.status}
                    </span>
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
