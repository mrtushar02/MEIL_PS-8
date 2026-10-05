import React from 'react';
import { Loader2, Check } from 'lucide-react';

/**
 * GlassButton Component
 * Supports micro-interactions:
 * - Hover light sweep
 * - Press compression
 * - Loading morph
 * - Success checkmark morph
 */
export function GlassButton({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'success'
  size = 'md',        // 'sm' | 'md' | 'lg'
  loading = false,
  success = false,
  icon: Icon = null,
  shortcut = null,
  disabled = false,
  className = '',
  onClick = undefined,
  type = 'button',
  ...props
}) {
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px', borderRadius: '8px' },
    md: { padding: '10px 18px', fontSize: '13.5px', borderRadius: '12px' },
    lg: { padding: '13px 24px', fontSize: '15px', borderRadius: '14px' },
  };

  const variantClass = variant === 'primary' 
    ? 'glass-btn-primary' 
    : variant === 'secondary' 
    ? 'glass-btn-secondary' 
    : 'glass-btn-ghost';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`glass-btn ${variantClass} ${className}`}
      style={{
        ...sizeStyles[size],
        cursor: disabled || loading ? 'not-allowed' : 'pointer'
      }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={16} />
          <span>Processing...</span>
        </>
      ) : success ? (
        <>
          <Check size={16} className="text-white animate-fade-in" />
          <span>Success</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
          <span>{children}</span>
          {shortcut && <span className="kbd-shortcut">{shortcut}</span>}
        </>
      )}
    </button>
  );
}

export default GlassButton;
