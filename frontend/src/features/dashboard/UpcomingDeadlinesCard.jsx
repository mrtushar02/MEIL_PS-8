import React from 'react';
import {
  Zap,
  Droplet,
  Trash2,
  ShieldCheck
} from 'lucide-react';

export default function UpcomingDeadlinesCard({ onNavigateToDataEntry }) {
  const deadlines = [
    { id: 1, title: 'Energy Data Submission', period: 'Sep 2026', daysLeft: '5 days left', urgent: true, icon: Zap, color: '#2563EB' },
    { id: 2, title: 'Water Data Submission', period: 'Sep 2026', daysLeft: '5 days left', urgent: true, icon: Droplet, color: '#0284C7' },
    { id: 3, title: 'Waste Data Submission', period: 'Sep 2026', daysLeft: '8 days left', urgent: false, icon: Trash2, color: '#9333EA' },
    { id: 4, title: 'Safety Data Submission', period: 'Sep 2026', daysLeft: '8 days left', urgent: false, icon: ShieldCheck, color: '#16A34A' },
  ];

  return (
    <div className="standard-glass-card">
      <div className="card-header-bar">
        <h3 className="card-title">Upcoming Deadlines</h3>
        <button 
          type="button" 
          className="card-view-all-link"
          onClick={() => onNavigateToDataEntry?.()}
        >
          View All
        </button>
      </div>

      <div className="deadlines-list">
        {deadlines.map((d) => {
          const IconComp = d.icon;
          return (
            <div key={d.id} className="deadline-item">
              <div className="deadline-info">
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(241, 245, 249, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: d.color,
                  flexShrink: 0
                }}>
                  <IconComp size={14} />
                </div>
                <div>
                  <div className="deadline-name">{d.title}</div>
                  <div className="deadline-sub">{d.period}</div>
                </div>
              </div>

              <span className={`deadline-tag ${d.urgent ? 'medium' : ''}`}>
                {d.daysLeft}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
