import React from 'react';
import { FileEdit, UploadCloud, Layers, Download } from 'lucide-react';

export default function QuickActionsCard({
  onNavigateToDataEntry,
  onNavigateToEvidence,
  onNavigateToSubmissions
}) {
  const handleDownloadTemplate = () => {
    // Generate sample CSV template for Site Officer monthly metrics
    const headers = 'Month,ProjectCode,Diesel_Litres,Grid_Electricity_kWh,Water_Withdrawn_KL,Recycled_Water_KL,Hazardous_Waste_MT,NonHazardous_Waste_MT,Safe_Manhours\n';
    const row = 'September 2026,HMR-001,384000,6739000,125000,50050,42.5,1799.5,4520000\n';
    const blob = new Blob([headers + row], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'MEIL_ESG_Monthly_Data_Template_FY26.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="standard-glass-card">
      <div className="card-header-bar" style={{ marginBottom: '14px' }}>
        <h3 className="card-title">Quick Actions</h3>
      </div>

      <div className="quick-actions-grid">
        <button 
          type="button" 
          className="quick-action-tile"
          onClick={onNavigateToDataEntry}
        >
          <FileEdit size={18} color="#2563EB" />
          <span>Enter Data</span>
        </button>

        <button 
          type="button" 
          className="quick-action-tile"
          onClick={onNavigateToEvidence}
        >
          <UploadCloud size={18} color="#0284C7" />
          <span>Upload Evidence</span>
        </button>

        <button 
          type="button" 
          className="quick-action-tile"
          onClick={onNavigateToSubmissions}
        >
          <Layers size={18} color="#16A34A" />
          <span>View Submissions</span>
        </button>

        <button 
          type="button" 
          className="quick-action-tile"
          onClick={handleDownloadTemplate}
        >
          <Download size={18} color="#64748B" />
          <span>Download Template</span>
        </button>
      </div>
    </div>
  );
}
