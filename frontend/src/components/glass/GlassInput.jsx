import React from 'react';

/**
 * GlassInput Component
 * Liquid-glass input field with animated focus borders, icon slots, and validation indicators.
 */
export function GlassInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  icon: Icon = null,
  unit = null,
  rightSlot = null,
  error = null,
  hint = null,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const isNumeric = type === 'number' || Boolean(unit);

  return (
    <div className={`glass-input-group ${className}`}>
      {label && (
        <label className="glass-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            {label} {required && <span style={{ color: 'var(--state-error)' }}>*</span>}
          </span>
          {hint && <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>{hint}</span>}
        </label>
      )}
      <div className="glass-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="glass-input"
          style={{
            paddingLeft: Icon ? '36px' : '14px',
            paddingRight: unit ? '64px' : rightSlot ? '40px' : '14px',
            borderColor: error ? 'var(--state-error)' : undefined,
            fontVariantNumeric: isNumeric ? 'tabular-nums' : undefined,
            fontFamily: isNumeric ? 'var(--font-numeric)' : undefined,
            fontWeight: isNumeric ? '500' : '400',
          }}
          {...props}
        />
        {unit && (
          <div style={{
            position: 'absolute',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            padding: '3px 8px',
            borderRadius: '6px',
            background: 'rgba(23, 143, 224, 0.08)',
            color: 'var(--blue-accent)',
            fontSize: '11.5px',
            fontWeight: '600',
            pointerEvents: 'none'
          }}>
            {unit}
          </div>
        )}
        {rightSlot && !unit && (
          <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center' }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p style={{ color: 'var(--state-error)', fontSize: '11.5px', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default GlassInput;
