import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Leaf, Users, ShieldCheck, BarChart3 } from 'lucide-react';

/**
 * ESGCanvas — Centerpiece 2D Canvas + Liquid Glass Visualization
 * ─────────────────────────────────────────────────────────────
 * Implements:
 * • HTML5 Canvas background: concentric orbital rings, flowing data pulses,
 *   ambient floating particles, and connecting curved network lines
 * • Centerpiece: Floating Liquid Glass ESG Core cushion node with Leaf + ESG + SUSTAINABLE GROWTH
 * • 3 Major Nodes: Environment (Leaf), Social (Users), Governance (ShieldCheck)
 * • 4th Secondary Node: Data Analytics (BarChart3)
 * • Floating orbital miniature glass cubes
 * • Interactive mouse parallax (2-8px shift) and smooth interpolation
 * • Hover states with elevation, glow, particle attraction, and tooltips
 * • Reduced motion and 60 FPS requestAnimationFrame loop
 */
export function ESGCanvas({ width = 440, height = 350 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Mouse parallax state
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [activeHoverNode, setActiveHoverNode] = useState(null);

  // Tooltip state
  const [tooltip, setTooltip] = useState({ text: '', visible: false, x: 0, y: 0 });

  // Node data aligned with the reference design
  const nodes = [
    {
      id: 'environment',
      label: 'Environment',
      tooltip: 'Environmental Impact',
      icon: Leaf,
      xRel: 0,
      yRel: -98,
      variant: 'env',
    },
    {
      id: 'social',
      label: 'Social',
      tooltip: 'People & Communities',
      icon: Users,
      xRel: -118,
      yRel: 6,
      variant: 'social',
    },
    {
      id: 'governance',
      label: 'Governance',
      tooltip: 'Responsible Governance',
      icon: ShieldCheck,
      xRel: 118,
      yRel: 6,
      variant: 'gov',
    },
    {
      id: 'analytics',
      label: '',
      tooltip: 'Transparent ESG Metrics',
      icon: BarChart3,
      xRel: 0,
      yRel: 94,
      variant: 'analytics',
      compact: true,
    },
  ];

  // ── Canvas Animation Loop: Orbits, Particles & Data Pulses ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let time = 0;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Ambient floating particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 0.9,
      y: (Math.random() - 0.5) * height * 0.9,
      size: Math.random() * 2.2 + 1,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.25 + 0.1,
      orbitRadius: Math.random() * 120 + 60,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitSpeed: (Math.random() * 0.004 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
    }));

    // Data pulse beacons traveling along orbital lines
    const pulses = [
      { angle: 0, speed: 0.012, radius: 100, size: 3.5, color: '#3B82F6' },
      { angle: Math.PI * 0.6, speed: -0.009, radius: 140, size: 2.8, color: '#60A5FA' },
      { angle: Math.PI * 1.3, speed: 0.007, radius: 140, size: 3.2, color: '#2563EB' },
      { angle: Math.PI * 0.2, speed: 0.015, radius: 65, size: 2.5, color: '#93C5FD' },
    ];

    const render = () => {
      time += 0.016;

      // Smooth mouse parallax interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 + mousePos.current.x * 0.5;
      const centerY = height / 2 + mousePos.current.y * 0.5;

      // ── Soft Blue Radial Glow Behind Core ──
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        180
      );
      glowGrad.addColorStop(0, 'rgba(191, 219, 254, 0.45)');
      glowGrad.addColorStop(0.5, 'rgba(219, 234, 254, 0.2)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
      ctx.fill();

      // ── Concentric Orbital Rings ──
      const rings = [
        { r: 75, dash: [4, 6], alpha: 0.16, width: 1.2, rotation: time * 0.08 },
        { r: 115, dash: [2, 5], alpha: 0.22, width: 1.2, rotation: -time * 0.05 },
        { r: 145, dash: [6, 8], alpha: 0.14, width: 1.0, rotation: time * 0.04 },
      ];

      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(isReducedMotion ? 0 : ring.rotation);
        ctx.strokeStyle = `rgba(59, 130, 246, ${ring.alpha})`;
        ctx.lineWidth = ring.width;
        ctx.setLineDash(ring.dash);
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // ── Connecting Network Lines to Satellite Nodes ──
      nodes.forEach((node) => {
        const nodeX = centerX + node.xRel + mousePos.current.x * 0.8;
        const nodeY = centerY + node.yRel + mousePos.current.y * 0.8;

        const isHovered = activeHoverNode === node.id;

        // Gradient connection line
        const lineGrad = ctx.createLinearGradient(centerX, centerY, nodeX, nodeY);
        lineGrad.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
        lineGrad.addColorStop(1, isHovered ? 'rgba(37, 99, 235, 0.65)' : 'rgba(59, 130, 246, 0.15)');

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = isHovered ? 1.8 : 1.0;
        ctx.stroke();

        // Little pulse dot along connection
        if (!isReducedMotion) {
          const progress = (time * 0.6 + (node.xRel + node.yRel) * 0.01) % 1;
          const px = centerX + (nodeX - centerX) * progress;
          const py = centerY + (nodeY - centerY) * progress;

          ctx.beginPath();
          ctx.arc(px, py, isHovered ? 2.5 : 1.8, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? '#2563EB' : 'rgba(59, 130, 246, 0.6)';
          ctx.fill();
        }
      });

      // ── Orbiting Data Pulses on Rings ──
      if (!isReducedMotion) {
        pulses.forEach((pulse) => {
          pulse.angle += pulse.speed;
          const px = centerX + Math.cos(pulse.angle) * pulse.radius;
          const py = centerY + Math.sin(pulse.angle) * pulse.radius;

          // Outer halo
          ctx.beginPath();
          ctx.arc(px, py, pulse.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
          ctx.fill();

          // Core point
          ctx.beginPath();
          ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
          ctx.fillStyle = pulse.color;
          ctx.fill();
        });
      }

      // ── Ambient Floating Particles ──
      particles.forEach((p) => {
        if (!isReducedMotion) {
          p.orbitAngle += p.orbitSpeed;
          p.x = Math.cos(p.orbitAngle) * p.orbitRadius;
          p.y = Math.sin(p.orbitAngle) * (p.orbitRadius * 0.75);
        }

        const px = centerX + p.x;
        const py = centerY + p.y;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();
      });

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [width, height, activeHoverNode]);

  // ── Mouse Move Parallax Handler ──
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Smooth subtle movement: 2-8px max shift
    mousePos.current.targetX = (x / (rect.width / 2)) * 8;
    mousePos.current.targetY = (y / (rect.height / 2)) * 8;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePos.current.targetX = 0;
    mousePos.current.targetY = 0;
    setActiveHoverNode(null);
    setTooltip({ visible: false, text: '', x: 0, y: 0 });
  }, []);

  const handleNodeMouseEnter = (node, e) => {
    setActiveHoverNode(node.id);
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setTooltip({
      visible: true,
      text: node.tooltip,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 12,
    });
  };

  const handleNodeMouseLeave = () => {
    setActiveHoverNode(null);
    setTooltip({ visible: false, text: '', x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="esg-network-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── 2D Canvas for orbits, beams & pulses ── */}
      <canvas
        ref={canvasRef}
        className="esg-canvas-layer"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Floating Tooltip ── */}
      {tooltip.visible && (
        <div
          className="esg-floating-tooltip"
          style={{
            position: 'absolute',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 30,
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* ── Center Core: Liquid Glass ESG Cushion Node ── */}
      <div
        className="esg-core-cushion"
        style={{
          transform: `translate(${mousePos.current.x * 0.4}px, ${mousePos.current.y * 0.4}px)`,
        }}
      >
        <div className="esg-core-leaf-badge">
          <Leaf size={22} className="esg-core-leaf-icon" />
        </div>
        <div className="esg-core-title">ESG</div>
        <div className="esg-core-sub">SUSTAINABLE</div>
        <div className="esg-core-growth">GROWTH</div>
        {/* Subtle glass reflection highlight */}
        <div className="cushion-specular-sheen" />
      </div>

      {/* ── Satellite Liquid Glass Nodes ── */}
      {nodes.map((node) => {
        const IconComponent = node.icon;
        const isHovered = activeHoverNode === node.id;

        return (
          <div
            key={node.id}
            className={`esg-satellite-node ${node.variant} ${node.compact ? 'compact' : ''} ${
              isHovered ? 'hovered' : ''
            }`}
            style={{
              position: 'absolute',
              left: `calc(50% + ${node.xRel}px)`,
              top: `calc(50% + ${node.yRel}px)`,
              transform: `translate(-50%, -50%) translate(${mousePos.current.x * 0.75}px, ${
                mousePos.current.y * 0.75
              }px)`,
              zIndex: 10,
            }}
            onMouseEnter={(e) => handleNodeMouseEnter(node, e)}
            onMouseLeave={handleNodeMouseLeave}
          >
            <div className={`satellite-icon-ring ${node.variant}`}>
              <IconComponent size={node.compact ? 16 : 18} />
            </div>
            {node.label && <div className="satellite-label">{node.label}</div>}
            <div className="satellite-specular" />
          </div>
        );
      })}

      {/* ── Orbiting Miniature Glass Cubes ── */}
      <div className="orbital-mini-cube cube-1" />
      <div className="orbital-mini-cube cube-2" />
      <div className="orbital-mini-cube cube-3" />
    </div>
  );
}

export default ESGCanvas;
