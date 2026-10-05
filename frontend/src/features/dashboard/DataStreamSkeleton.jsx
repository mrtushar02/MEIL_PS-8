import React from 'react';
import './DataStreamDashboard.css';

export default function DataStreamSkeleton() {
  return (
    <div className="ds-dashboard-wrapper ds-skeleton-wrapper" aria-busy="true" aria-live="polite">
      {/* Background Ambient Glow */}
      <div className="ds-ambient-glow" />

      {/* Master 2-Island Grid Layout */}
      <div className="ds-master-layout">
        
        {/* LEFT MASTER ISLAND (~70% Width) */}
        <div className="ds-master-island ds-skeleton-card">
          {/* Header Nav Capsule Shimmer */}
          <div className="ds-island-header">
            <div className="ds-nav-pill-pod ds-skeleton-nav-pod">
              {[80, 75, 85, 95, 90, 95, 75, 80].map((w, idx) => (
                <div 
                  key={idx} 
                  className="ds-skeleton-shimmer ds-skeleton-pill" 
                  style={{ width: `${w}px`, height: '26px' }} 
                />
              ))}
            </div>
          </div>

          {/* Internal 2-Column Grid */}
          <div className="ds-island-grid">
            
            {/* LEFT SUB-COLUMN */}
            <div className="ds-sub-col">
              
              {/* Card 1: Site ESG Overview Skeleton */}
              <div className="ds-card ds-skeleton-glass-card">
                <div className="ds-card-header">
                  <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '130px', height: '18px' }} />
                  <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '90px', height: '24px' }} />
                </div>

                <div className="ds-overview-dual-charts">
                  {/* Left Chart Box */}
                  <div className="ds-mini-chart-box ds-skeleton-subbox">
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '110px', height: '11px', marginBottom: '8px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '80px', height: '24px', marginBottom: '14px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '100px', height: '11px', marginBottom: '8px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '60px', height: '22px', marginBottom: '12px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-chart" style={{ width: '100%', height: '56px', borderRadius: '8px' }} />
                  </div>

                  {/* Right Chart Box */}
                  <div className="ds-mini-chart-box ds-skeleton-subbox">
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '120px', height: '11px', marginBottom: '8px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '90px', height: '24px', marginBottom: '14px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '110px', height: '11px', marginBottom: '8px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '70px', height: '22px', marginBottom: '12px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-chart" style={{ width: '100%', height: '56px', borderRadius: '8px' }} />
                  </div>
                </div>
              </div>

              {/* Card 2: Site Activity & Audit Logs Skeleton */}
              <div className="ds-card ds-skeleton-glass-card">
                <div className="ds-card-header">
                  <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '160px', height: '18px' }} />
                  <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '70px', height: '24px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div className="ds-skeleton-shimmer ds-skeleton-circle" style={{ width: '28px', height: '28px' }} />
                        <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '85px', height: '12px' }} />
                      </div>
                      <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '160px', height: '12px' }} />
                      <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '70px', height: '11px' }} />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT SUB-COLUMN */}
            <div className="ds-sub-col">
              
              {/* Card 3: Recent Site Activities Skeleton */}
              <div className="ds-card ds-skeleton-glass-card">
                <div className="ds-card-header">
                  <div>
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '150px', height: '18px', marginBottom: '4px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '200px', height: '11px' }} />
                  </div>
                  <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '85px', height: '24px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="ds-skeleton-activity-box">
                      <div className="ds-skeleton-shimmer ds-skeleton-circle" style={{ width: '32px', height: '32px', borderRadius: '10px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '140px', height: '13px' }} />
                          <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '60px', height: '16px' }} />
                        </div>
                        <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '90%', height: '10px', marginBottom: '6px' }} />
                        <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '40%', height: '9px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Site Team & Supervisors Skeleton */}
              <div className="ds-card ds-skeleton-glass-card ds-team-card">
                <div className="ds-card-header">
                  <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '140px', height: '18px' }} />
                  <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '75px', height: '24px' }} />
                </div>

                <div className="ds-team-cards-row">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="ds-skeleton-team-pod">
                      <div className="ds-skeleton-shimmer ds-skeleton-circle" style={{ width: '38px', height: '38px', margin: '0 auto 8px' }} />
                      <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '55px', height: '12px', margin: '0 auto 5px' }} />
                      <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '45px', height: '10px', margin: '0 auto 6px' }} />
                      <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '40px', height: '16px', margin: '0 auto' }} />
                    </div>
                  ))}
                </div>

                {/* Dispatch Box Skeleton */}
                <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(255,255,255,0.6)', borderRadius: '14px', border: '1px solid rgba(226,232,240,0.8)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '130px', height: '12px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '60px', height: '14px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                    {[1, 2, 3, 4, 5].map((k) => (
                      <div key={k} className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '45px', height: '16px' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: '90px' }}>
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '100%', height: '28px', borderRadius: '8px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '92%', height: '28px', borderRadius: '8px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '96%', height: '28px', borderRadius: '8px' }} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Card 5: Site ESG Capex & Financial Investment Overview Skeleton */}
          <div className="ds-card ds-skeleton-glass-card ds-finance-island-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-circle" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
                <div>
                  <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '220px', height: '14px', marginBottom: '4px' }} />
                  <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '320px', height: '10px' }} />
                </div>
              </div>
              <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '90px', height: '24px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
              {[1, 2, 3, 4].map((k) => (
                <div key={k} className="ds-skeleton-subbox" style={{ padding: '8px 10px', height: '52px' }}>
                  <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '70px', height: '9px', marginBottom: '5px' }} />
                  <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '85px', height: '15px' }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="ds-skeleton-subbox" style={{ height: '140px', padding: '10px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '120px', height: '11px', marginBottom: '10px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="ds-skeleton-shimmer ds-skeleton-circle" style={{ width: '95px', height: '95px' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((p) => (
                      <div key={p} className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '100%', height: '12px', borderRadius: '4px' }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="ds-skeleton-subbox" style={{ height: '140px', padding: '10px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '140px', height: '11px', marginBottom: '10px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-chart" style={{ width: '100%', height: '80px', borderRadius: '8px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '100%', height: '16px', marginTop: '6px', borderRadius: '6px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT STACKED COLUMN (~30% Width - 3 Distinct Cards) */}
        <div className="ds-right-column">
          
          {/* Card 1: Site ESG Analytics Skeleton */}
          <div className="ds-card ds-skeleton-glass-card">
            <div className="ds-card-header">
              <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '120px', height: '18px' }} />
            </div>

            <div className="ds-sub-chart-duo">
              <div className="ds-skeleton-subbox" style={{ height: '95px', padding: '10px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '90px', height: '11px', marginBottom: '10px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-chart" style={{ width: '100%', height: '52px', borderRadius: '6px' }} />
              </div>
              <div className="ds-skeleton-subbox" style={{ height: '95px', padding: '10px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '80px', height: '11px', marginBottom: '10px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-chart" style={{ width: '100%', height: '52px', borderRadius: '6px' }} />
              </div>
            </div>

            <div className="ds-mini-widgets-row">
              <div className="ds-skeleton-subbox" style={{ height: '55px', padding: '8px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '60px', height: '9px', marginBottom: '6px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '40px', height: '14px' }} />
              </div>
              <div className="ds-skeleton-subbox" style={{ height: '55px', padding: '8px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '65px', height: '9px', marginBottom: '6px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '45px', height: '14px' }} />
              </div>
              <div className="ds-skeleton-subbox" style={{ height: '55px', padding: '8px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '65px', height: '9px', marginBottom: '6px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '45px', height: '14px' }} />
              </div>
            </div>
          </div>

          {/* Card 2: Custom Site Log Form Skeleton */}
          <div className="ds-card ds-skeleton-glass-card">
            <div className="ds-card-header">
              <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '135px', height: '18px' }} />
              <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '75px', height: '22px' }} />
            </div>
            <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '190px', height: '10px', marginBottom: '12px' }} />

            <div className="ds-form-builder-body">
              <div className="ds-skeleton-subbox" style={{ padding: '8px', minHeight: '120px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '50px', height: '10px', marginBottom: '8px' }} />
                {[1, 2, 3].map((k) => (
                  <div key={k} className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '100%', height: '18px', marginBottom: '6px', borderRadius: '5px' }} />
                ))}
              </div>
              <div className="ds-skeleton-subbox" style={{ padding: '8px', minHeight: '120px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '60px', height: '10px', marginBottom: '8px' }} />
                {[1, 2, 3].map((k) => (
                  <div key={k} className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '100%', height: '18px', marginBottom: '6px', borderRadius: '5px' }} />
                ))}
              </div>
              <div className="ds-skeleton-subbox" style={{ padding: '8px', minHeight: '120px' }}>
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '65px', height: '10px', marginBottom: '8px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '100%', height: '24px', marginBottom: '6px', borderRadius: '6px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '100%', height: '24px', marginBottom: '6px', borderRadius: '6px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '60px', height: '20px', marginLeft: 'auto', borderRadius: '6px' }} />
              </div>
            </div>
          </div>

          {/* Card 3: Active Site Batches Skeleton */}
          <div className="ds-card ds-skeleton-glass-card ds-active-batches-card">
            <div>
              <div className="ds-card-header">
                <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '125px', height: '18px' }} />
                <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '80px', height: '22px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                {[1, 2, 3, 4, 5, 6].map((b) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '45px', height: '12px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '110px', height: '12px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '50px', height: '14px' }} />
                    <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '65px', height: '8px', borderRadius: '4px' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Strip Shimmer */}
            <div className="ds-batch-footer-strip" style={{ marginTop: '14px' }}>
              <div className="ds-skeleton-shimmer ds-skeleton-text" style={{ width: '140px', height: '12px' }} />
              <div className="ds-skeleton-shimmer ds-skeleton-pill" style={{ width: '70px', height: '14px' }} />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
