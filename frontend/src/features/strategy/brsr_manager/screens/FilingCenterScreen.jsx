import React, { useState } from 'react';
import { Download, Upload, CheckCircle2, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { exportToCsv } from '../../../../utils/exportUtils';
import esgStore from '../../../../services/esgStore';

export default function FilingCenterScreen() {
  const [dscStatus, setDscStatus] = useState('Pending Validation');
  const [isStaged, setIsStaged] = useState(false);

  const checklistItems = [
    'SEBI BRSR Annexure I & II PDF Dossier Generated',
    'SEBI BRSR XBRL Instance Document Validated',
    'Independent Third-Party Reasonable Assurance Opinion Attached (PwC)',
    'MD & Group CSO Digital Signature DSC Class-3 Validated',
    'Board Audit Committee ESG Resolution Ref #BAC-2024-Q2 Linked'
  ];

  const handleDownloadFilingPack = () => {
    exportToCsv('MEIL_SEBI_BRSR_Filing_Package_FY24.csv', checklistItems.map((item, idx) => ({
      'Sequence': idx + 1,
      'Mandatory Statutory Item': item,
      'Verification Status': 'Verified & Attested',
      'Filing Node': 'NSE / BSE Electronic Gateway (NEAPS / BSE Corporate Filing)'
    })));
  };

  const handleValidateDsc = () => {
    setDscStatus('DSC Class-3 Attested & Staged');
    setIsStaged(true);
    esgStore.addAuditLog('SEBI_BRSR_DSC_STAGED', 'Digital Signature DSC Class-3 validated and filing staged for upload', 'STRATEGY');
  };

  return (
    <div className="brsr-mgr-filing">
      <div className="brsr-mgr-card" style={{ marginBottom: '1.25rem' }}>
        <div className="brsr-mgr-card-header">
          <div>
            <h2 className="brsr-mgr-card-title">SEBI BSE / NSE Statutory Filing Submission Center</h2>
            <p className="brsr-mgr-card-subtitle">
              Final statutory dossier packaging, digital signature token verification, and stock exchange submission tracking
            </p>
          </div>
          <button className="brsr-mgr-btn-primary" onClick={handleDownloadFilingPack}>
            <Download size={14} /> Download Board Signed Filing Pack
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        <div className="brsr-mgr-card">
          <h3 className="brsr-mgr-card-title" style={{ marginBottom: '0.85rem' }}>Statutory Filing Checklist</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {checklistItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1E293B' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="brsr-mgr-card">
          <h3 className="brsr-mgr-card-title" style={{ marginBottom: '0.85rem' }}>Exchange Portal Status</h3>
          <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: '14px', border: '1px solid #BFDBFE', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 700 }}>NSE / BSE LISTING REGULATIONS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E3A8A', marginTop: '0.2rem' }}>
              {isStaged ? 'Staged & DSC Token Verified' : 'Ready for E-Filing'}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 600 }}>Due Date: 30 November 2024</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              className="brsr-mgr-btn-primary" 
              style={{ width: '100%', background: isStaged ? '#047857' : undefined }}
              onClick={handleValidateDsc}
              disabled={isStaged}
            >
              <Lock size={14} /> {isStaged ? 'DSC Verified & Staged for Upload' : 'Validate DSC & Stage for Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
