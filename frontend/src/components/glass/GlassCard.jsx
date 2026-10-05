import React from 'react';

/**
 * GlassCard Component
 * Implements 3 levels of iOS Liquid Glass depth:
 * Level 1: Master Containers
 * Level 2: Section / Dashboard Cards (default)
 * Level 3: Nested Tiles / Controls
 */
export function GlassCard({
  children,
  level = 2,
  className = '',
  style = {},
  hoverable = true,
  onClick = undefined,
  ...props
}) {
  const levelClass = `glass-level-${level}`;
  const hoverClass = hoverable && level === 2 ? 'hover-specular-lift' : '';

  return (
    <div
      className={`glass-card ${levelClass} ${hoverClass} ${className}`}
      style={{
        padding: level === 1 ? '32px' : level === 2 ? '24px' : '16px',
        ...style
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
