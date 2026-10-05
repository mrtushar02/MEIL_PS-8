import React from 'react';

/**
 * GlassBadge Component
 * Semantic status indicators (Success, Warning, Error, Info, Draft, Verified)
 */
export function GlassBadge({
  children,
  status = 'info', // 'success' | 'warning' | 'error' | 'info' | 'neutral'
  icon: Icon = null,
  size = 'md',
  className = '',
  ...props
}) {
  const badgeClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    neutral: 'glass-level-3'
  };

  const currentClass = badgeClasses[status] || badgeClasses.info;

  return (
    <span className={`glass-badge ${currentClass} ${className}`} {...props}>
      {Icon && <Icon size={size === 'sm' ? 11 : 13} />}
      <span>{children}</span>
    </span>
  );
}

export default GlassBadge;
