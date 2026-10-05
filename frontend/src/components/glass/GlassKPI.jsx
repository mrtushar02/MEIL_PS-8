import React from 'react';
import GlassCard from './GlassCard';
import { Info } from 'lucide-react';

/**
 * GlassKPI Component
 * Upgraded with Stripe Tabular Numerals, PostHog Delta Chips, and Wise Statutory Formula Tooltips.
 */
export function GlassKPI({
  title,
  value,
  unit = '',
  trend = null, // e.g. { direction: 'down', value: '4.8%', text: 'vs baseline' }
  icon: Icon = null,
  formula = null, // Statutory formula popover text
  status = 'neutral', // 'success' | 'warning' | 'info' | 'neutral'
  subtitle = null,
  className = '',
  onClick = undefined
}) {
  const [showFormula, setShowFormula] = React.useState(false);

  const statusBorderColors = {
    success: 'rgba(22, 163, 106, 0.45)',
    warning: 'rgba(217, 154, 36, 0.45)',
    info: 'rgba(23, 143, 224, 0.45)',
    neutral: 'transparent'
  };

  const isGoodTrend = trend?.direction === 'down' 
    ? (trend?.good !== false) 
    : (trend?.good === true);

  return (
    <GlassCard 
      level={3} 
      className={`glass-kpi-tile ${className}`} 
      onClick={onClick}
      style={{
        position: 'relative',
        borderTop: status !== 'neutral' ? `2px solid ${statusBorderColors[status]}` : undefined
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            {title}
          </span>
          {formula && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onMouseEnter={() => setShowFormula(true)}
                onMouseLeave={() => setShowFormula(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFormula(!showFormula);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Statutory GHG Protocol Formula"
              >
                <Info size={13} />
              </button>
              {showFormula && (
                <div style={{
                  position: 'absolute',
                  bottom: '22px',
                  left: '0',
                  minWidth: '220px',
                  padding: '8px 12px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontFamily: 'var(--font-numeric)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 40,
                  pointerEvents: 'none',
                  lineHeight: '1.4'
                }}>
                  <div style={{ color: '#93C5FD', fontWeight: '600', marginBottom: '2px' }}>
                    Statutory Formula:
                  </div>
                  {formula}
                </div>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(23, 143, 224, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--blue-accent)'
          }}>
            <Icon size={17} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
        <span style={{
          fontSize: '28px',
          fontWeight: '700',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
            {unit}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {trend && (
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            fontVariantNumeric: 'tabular-nums',
            color: isGoodTrend ? '#15803D' : '#B45309',
            background: isGoodTrend ? 'rgba(22, 163, 74, 0.12)' : 'rgba(245, 158, 11, 0.14)',
            padding: '2px 7px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            {trend.direction === 'down' ? '↓' : '↑'} {trend.value} 
            <span style={{ color: 'var(--text-muted)', fontWeight: '400', marginLeft: '2px' }}>
              {trend.text}
            </span>
          </span>
        )}
        {subtitle && (
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {subtitle}
          </span>
        )}
      </div>
    </GlassCard>
  );
}

export default GlassKPI;
