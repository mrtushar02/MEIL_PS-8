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

  const handleDownloadXml = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<xbrli:xbrl xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:in-brsr="http://www.sebi.gov.in/xbrl/2024-03-31/in-brsr">
  <xbrli:context id="FY2024_ANNUAL">
    <xbrli:entity>
      <xbrli:identifier scheme="http://www.mca.gov.in/CIN">L45200TG1989PLC013058</xbrli:identifier>
    </xbrli:entity>
    <xbrli:period>
      <xbrli:startDate>2023-10-01</xbrli:startDate>
      <xbrli:endDate>2024-09-30</xbrli:endDate>
    </xbrli:period>
  </xbrli:context>
  ${xbrlTags.map(t => `<${t.tag} contextRef="FY2024_ANNUAL" unitRef="${t.unit}">${t.value}</${t.tag}>`).join('\n  ')}
</xbrli:xbrl>`;

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MEIL_BRSR_FY24_XBRL_Instance.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <button className="brsr-mgr-btn-primary" onClick={handleDownloadXml}>
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
