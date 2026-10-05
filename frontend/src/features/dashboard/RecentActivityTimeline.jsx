import React, { useState } from 'react';
import { CheckCircle2, Paperclip, ShieldCheck, AlertTriangle, RotateCcw, Copy, Check } from 'lucide-react';

export default function RecentActivityTimeline({ onNavigateToSubmissions }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyHash = (id, hash) => {
    navigator.clipboard?.writeText?.(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const activities = [
    {
      id: 1,
      title: 'Data Submitted',
      description: 'Energy data for Sep 2026',
      user: 'Rohit Kumar',
      role: 'Site Officer',
      time: '2 hours ago',
      avatar: '/avatar_rohit.jpg',
      icon: CheckCircle2,
      iconColor: '#16A34A',
      iconBg: 'rgba(22, 163, 74, 0.1)',
      hash: 'e9f4a1c',
      fullHash: 'e9f4a1c5b8823f990ac12411e74a88bc3b81d77a'
    },
    {
      id: 2,
      title: 'Evidence Uploaded',
      description: 'Electricity Bill — Sep 2026',
      user: 'Rohit Kumar',
      role: 'Site Officer',
      time: '3 hours ago',
      avatar: '/avatar_rohit.jpg',
      icon: Paperclip,
      iconColor: '#2563EB',
      iconBg: 'rgba(37, 99, 235, 0.1)',
      hash: 'a47c29e',
      fullHash: 'a47c29e19d7b4112e452c9aa3f518e906b3a41c2'
    },
    {
      id: 3,
      title: 'Validation Completed',
      description: 'Water Circularity (ZLD Certified)',
      user: 'System Core Engine',
      role: 'Automated Rule #42',
      time: '5 hours ago',
      avatar: null,
      icon: ShieldCheck,
      iconColor: '#0284C7',
      iconBg: 'rgba(2, 132, 199, 0.1)',
      hash: '7d32bb0',
      fullHash: '7d32bb0e4c556b1899fa12b98871cd23a9e14421'
    },
    {
      id: 4,
      title: 'Correction Requested',
      description: 'Waste Data (Hazardous variance >15%)',
      user: 'K. V. Rao',
      role: 'BU Reviewer',
      time: '1 day ago',
      avatar: '/avatar_reviewer.jpg',
      icon: AlertTriangle,
      iconColor: '#EF4444',
      iconBg: 'rgba(239, 68, 68, 0.1)',
      hash: '91f0c2a',
      fullHash: '91f0c2ae77bb32014ea87f1981cd709ba24e5192'
    },
    {
      id: 5,
      title: 'Resubmitted',
      description: 'Safety Data — Zero LTI Verified',
      user: 'Rohit Kumar',
      role: 'Site Officer',
      time: '2 days ago',
      avatar: '/avatar_rohit.jpg',
      icon: RotateCcw,
      iconColor: '#2563EB',
      iconBg: 'rgba(37, 99, 235, 0.1)',
      hash: '3bc81d4',
      fullHash: '3bc81d4aa910c7321bf498701e63a87612c99a01'
    },
  ];

  return (
    <div className="standard-glass-card">
      <div className="card-header-bar">
        <h3 className="card-title">Recent Activity</h3>
        <button 
          type="button" 
          className="card-view-all-link"
          onClick={() => onNavigateToSubmissions?.()}
        >
          View All
        </button>
      </div>

      <div className="recent-activity-timeline">
        {activities.map((item) => {
          const IconComp = item.icon;
          return (
            <div key={item.id} className="activity-item">
              <div className="activity-connector-line" />
              
              <div className="activity-status-icon-wrap" style={{ background: item.iconBg, color: item.iconColor }}>
                <IconComp size={16} />
              </div>

              <div className="activity-content">
                <div className="activity-title-row">
                  <span className="activity-title">{item.title}</span>
                  <span className="activity-time">{item.time}</span>
                </div>
                
                <div className="activity-desc">{item.description}</div>
                
                <div className="activity-author-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.user} 
                        className="activity-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.15)',
                        color: '#2563EB',
                        fontSize: '9px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        S
                      </div>
                    )}
                    <span className="activity-author">{item.user}</span>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>• {item.role}</span>
                  </div>

                  {item.hash && (
                    <button
                      type="button"
                      onClick={() => copyHash(item.id, item.fullHash)}
                      title={`SHA-256 Hash: ${item.fullHash} (Click to copy)`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 6px',
                        borderRadius: '5px',
                        background: copiedId === item.id ? 'rgba(22, 163, 74, 0.12)' : 'rgba(241, 245, 249, 0.9)',
                        border: '1px solid rgba(203, 213, 225, 0.6)',
                        color: copiedId === item.id ? '#16A34A' : '#64748B',
                        fontSize: '10.5px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      {copiedId === item.id ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedId === item.id ? 'Copied' : `#${item.hash}`}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
