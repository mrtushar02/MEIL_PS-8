import React from 'react';
import { 
  Zap, 
  Droplet, 
  Trash2, 
  ShieldAlert, 
  Users, 
  FileCheck2, 
  ChevronRight 
} from 'lucide-react';

export default function DataEntryStatusCard({ onNavigateToDataEntry }) {
  const categories = [
    { id: 'energy', label: 'Energy', icon: Zap, percent: 80, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)' },
    { id: 'water', label: 'Water', icon: Droplet, percent: 70, color: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)' },
    { id: 'waste', label: 'Waste', icon: Trash2, percent: 60, color: '#9333EA', bg: 'rgba(147, 51, 234, 0.1)' },
    { id: 'safety', label: 'Safety', icon: ShieldAlert, percent: 75, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
    { id: 'social', label: 'Social', icon: Users, percent: 85, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
    { id: 'governance', label: 'Governance', icon: FileCheck2, percent: 50, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  ];

  return (
    <div className="standard-glass-card">
      <div className="card-header-bar">
        <h3 className="card-title">Data Entry Status</h3>
        <button 
          type="button" 
          className="card-view-all-link"
          onClick={() => onNavigateToDataEntry?.()}
        >
          View All
        </button>
      </div>

      <div className="data-entry-rows">
        {categories.map((cat) => {
          const IconComp = cat.icon;
          return (
            <div 
              key={cat.id} 
              className="data-entry-row-item"
              onClick={() => onNavigateToDataEntry?.(cat.id)}
              role="button"
              tabIndex={0}
            >
              <div className="entry-cat-icon" style={{ background: cat.bg, color: cat.color }}>
                <IconComp size={16} />
              </div>

              <span className="entry-cat-name">{cat.label}</span>

              <div className="entry-cat-bar-wrap">
                <div 
                  className="entry-cat-bar-fill" 
                  style={{ width: `${cat.percent}%`, background: cat.color }} 
                />
              </div>

              <span className="entry-cat-percent">{cat.percent}%</span>

              <ChevronRight size={14} className="entry-cat-chevron" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
