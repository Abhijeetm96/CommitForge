import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  glowColor: string;
  baseAlpha: number;
  alpha: number;
  layer: number; // 0 = deep background, 1 = midground, 2 = foreground
  shape: 'circle' | 'diamond' | 'ring';
  phase: number;
  pulseSpeed: number;
  rotation: number;
  rotationSpeed: number;
}

const PALETTE = [
  { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)' }, // Cyber Sky Cyan
  { color: '#818cf8', glow: 'rgba(129, 140, 248, 0.35)' }, // Indigo / Mesh
  { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.35)' }, // Cyber Violet
  { color: '#f05033', glow: 'rgba(240, 80, 51, 0.3)' }, // Git Orange / Flame
  { color: '#34d399', glow: 'rgba(52, 211, 153, 0.3)' }, // Pod Green
  { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' }, // Electric Blue
];

interface FuturisticParallaxBackgroundProps {
  className?: string;
  particleCount?: number;
}

export const FuturisticParallaxBackground: React.FC<FuturisticParallaxBackgroundProps> = ({
  className = '',
  particleCount = 85,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates (normalized -1 to 1 and absolute px)
    const mouse = {
      targetNormX: 0,
      targetNormY: 0,
      smoothNormX: 0,
      smoothNormY: 0,
      absX: -9999,
      absY: -9999,
      targetAbsX: -9999,
      targetAbsY: -9999,
      isInside: false,
    };

    // Scroll offset tracking for vertical parallax
    let scrollY = 0;
    let smoothScrollY = 0;

    // Grid animation offset
    let gridOffset = 0;

    // Handle high DPI
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Mouse move listener
    const handleMouseMove = (e: MouseEvent) => {
      mouse.isInside = true;
      mouse.targetAbsX = e.clientX;
      mouse.targetAbsY = e.clientY;
      mouse.targetNormX = (e.clientX / width) * 2 - 1;
      mouse.targetNormY = (e.clientY / height) * 2 - 1;
    };

    const handleMouseLeave = () => {
      mouse.isInside = false;
      mouse.targetNormX = 0;
      mouse.targetNormY = 0;
      mouse.targetAbsX = -9999;
      mouse.targetAbsY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Scroll listener on main container or window
    const handleScroll = () => {
      const mainEl = document.querySelector('.main-content');
      scrollY = mainEl ? mainEl.scrollTop : window.scrollY;
    };

    const mainElement = document.querySelector('.main-content');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const paletteItem = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      // 45% deep, 40% mid, 15% foreground
      const randLayer = Math.random();
      const layer = randLayer < 0.45 ? 0 : randLayer < 0.85 ? 1 : 2;

      let size: number;
      let baseAlpha: number;
      let speedMultiplier: number;
      let shape: 'circle' | 'diamond' | 'ring' = 'circle';

      if (layer === 0) {
        size = Math.random() * 1.5 + 0.8;
        baseAlpha = Math.random() * 0.35 + 0.15;
        speedMultiplier = 0.25;
      } else if (layer === 1) {
        size = Math.random() * 2.2 + 1.2;
        baseAlpha = Math.random() * 0.4 + 0.35;
        speedMultiplier = 0.55;
        if (Math.random() < 0.18) shape = 'diamond';
      } else {
        size = Math.random() * 3.2 + 2;
        baseAlpha = Math.random() * 0.45 + 0.5;
        speedMultiplier = 0.9;
        const r = Math.random();
        if (r < 0.25) shape = 'diamond';
        else if (r < 0.4) shape = 'ring';
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedMultiplier,
        vy: (Math.random() * -0.5 - 0.15) * speedMultiplier, // Gentle upward cosmic drift
        size,
        color: paletteItem.color,
        glowColor: paletteItem.glow,
        baseAlpha,
        alpha: baseAlpha,
        layer,
        shape,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
      });
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Time-based animation loop
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth mouse lerp
      mouse.smoothNormX += (mouse.targetNormX - mouse.smoothNormX) * 0.06;
      mouse.smoothNormY += (mouse.targetNormY - mouse.smoothNormY) * 0.06;
      mouse.absX += (mouse.targetAbsX - mouse.absX) * 0.1;
      mouse.absY += (mouse.targetAbsY - mouse.absY) * 0.1;

      // Smooth scroll lerp
      smoothScrollY += (scrollY - smoothScrollY) * 0.08;

      // Clear frame with deep void cyber background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // =========================================================================
      // 1. AMBIENT MULTI-LAYER NEBULAE (Slow breathing, mouse-parallaxed)
      // =========================================================================
      const time = currentTime * 0.0006;
      const nebulaParallaxX = mouse.smoothNormX * 25;
      const nebulaParallaxY = mouse.smoothNormY * 20;

      // Top-Left Cyan Nebula
      const g1X = width * 0.2 + nebulaParallaxX + Math.sin(time * 0.8) * 40;
      const g1Y = height * 0.25 + nebulaParallaxY + Math.cos(time * 0.7) * 35;
      const grad1 = ctx.createRadialGradient(g1X, g1Y, 10, g1X, g1Y, width * 0.45);
      grad1.addColorStop(0, 'rgba(14, 165, 233, 0.14)');
      grad1.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
      grad1.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Center-Right Violet / Purple Cyber Nebula
      const g2X = width * 0.75 - nebulaParallaxX + Math.cos(time * 0.9) * 45;
      const g2Y = height * 0.45 - nebulaParallaxY + Math.sin(time * 0.6) * 40;
      const grad2 = ctx.createRadialGradient(g2X, g2Y, 10, g2X, g2Y, width * 0.42);
      grad2.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      grad2.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
      grad2.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Bottom Git Flame / Amber Flare
      const g3X = width * 0.45 + nebulaParallaxX * 0.8;
      const g3Y = height * 0.85 + nebulaParallaxY * 0.8;
      const grad3 = ctx.createRadialGradient(g3X, g3Y, 10, g3X, g3Y, width * 0.38);
      grad3.addColorStop(0, 'rgba(240, 80, 51, 0.09)');
      grad3.addColorStop(0.5, 'rgba(234, 88, 12, 0.03)');
      grad3.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // =========================================================================
      // 2. FUTURISTIC 3D PERSPECTIVE CYBER GRID (Horizon effect at bottom)
      // =========================================================================
      const gridHorizonY = height * 0.65;
      const gridBottomY = height;
      const vanishingX = width * 0.5 + mouse.smoothNormX * 60;

      gridOffset = (gridOffset + dt * 25) % 40;

      ctx.save();
      // Grid clipping / gradient mask so it fades smoothly upward
      const gridFadeGrad = ctx.createLinearGradient(0, gridHorizonY, 0, gridBottomY);
      gridFadeGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      gridFadeGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.04)');
      gridFadeGrad.addColorStop(1, 'rgba(99, 102, 241, 0.12)');

      ctx.strokeStyle = gridFadeGrad;
      ctx.lineWidth = 1;

      // Perspective vertical lines converging to vanishing point
      const numLines = 24;
      for (let i = -numLines; i <= numLines; i++) {
        const bottomX = vanishingX + (i * width) / (numLines * 0.7);
        ctx.beginPath();
        ctx.moveTo(vanishingX + i * 4, gridHorizonY);
        ctx.lineTo(bottomX, gridBottomY);
        ctx.stroke();
      }

      // Horizontal perspective cross lines with logarithmic spacing
      const numHoriz = 12;
      for (let j = 0; j < numHoriz; j++) {
        // Perspective curve
        const progress = Math.pow((j + gridOffset / 40) / numHoriz, 2.2);
        const y = gridHorizonY + progress * (gridBottomY - gridHorizonY);
        if (y > gridHorizonY && y <= gridBottomY) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // =========================================================================
      // 3. MOUSE INTERACTION TORCH / GRAVITATIONAL LIGHT FIELD
      // =========================================================================
      if (mouse.isInside && mouse.absX > -100) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.absX,
          mouse.absY,
          0,
          mouse.absX,
          mouse.absY,
          220
        );
        mouseGlow.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
        mouseGlow.addColorStop(0.4, 'rgba(129, 140, 248, 0.04)');
        mouseGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // =========================================================================
      // 4. PARTICLE MOTION & MULTI-LAYER PARALLAX DEPTH
      // =========================================================================
      // Layer parallax coefficients
      // Layer 0 (deep): mouseParallax 12px, scrollParallax 0.05
      // Layer 1 (mid): mouseParallax 32px, scrollParallax 0.12
      // Layer 2 (fore): mouseParallax 65px, scrollParallax 0.22
      const layerParallax = [
        { mouseX: 14, mouseY: 12, scroll: 0.04 },
        { mouseX: 36, mouseY: 28, scroll: 0.12 },
        { mouseX: 70, mouseY: 55, scroll: 0.22 },
      ];

      // Update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.phase += p.pulseSpeed;
          p.rotation += p.rotationSpeed;
          p.x += p.vx;
          p.y += p.vy;

          // Gentle sinusoidal sway
          p.x += Math.sin(p.phase) * 0.2;

          // Interactive mouse force: particles gently evade or bend around cursor
          if (mouse.isInside) {
            const dx = p.x - mouse.absX;
            const dy = p.y - mouse.absY;
            const dist = Math.hypot(dx, dy);
            if (dist < 130 && dist > 1) {
              const force = (1 - dist / 130) * 1.8;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }

          // Boundary wrap with 40px buffer
          if (p.x < -40) p.x = width + 40;
          if (p.x > width + 40) p.x = -40;
          if (p.y < -40) p.y = height + 40;
          if (p.y > height + 40) p.y = -40;
        }

        // Pulsating alpha
        p.alpha = p.baseAlpha + Math.sin(p.phase) * (p.baseAlpha * 0.35);
      }

      // =========================================================================
      // 5. CONSTELLATION MESH LINES (Between nearby particles and mouse)
      // =========================================================================
      const maxConnectDist = 115;
      const maxMouseConnectDist = 140;

      // Connect particles to each other
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.layer === 0) continue; // Skip deep layer for crisp performance

        const lp1 = layerParallax[p1.layer];
        const p1RenderX = p1.x + mouse.smoothNormX * lp1.mouseX;
        const p1RenderY =
          ((p1.y - smoothScrollY * lp1.scroll) % (height + 80)) - 40;

        // Interactive beam to mouse
        if (mouse.isInside && p1.layer >= 1) {
          const mdx = p1RenderX - mouse.absX;
          const mdy = p1RenderY - mouse.absY;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < maxMouseConnectDist) {
            const mAlpha = (1 - mdist / maxMouseConnectDist) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(p1RenderX, p1RenderY);
            ctx.lineTo(mouse.absX, mouse.absY);
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.layer === 0) continue;

          // Connect if in similar or adjacent layers
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            const lp2 = layerParallax[p2.layer];
            const p2RenderX = p2.x + mouse.smoothNormX * lp2.mouseX;
            const p2RenderY =
              ((p2.y - smoothScrollY * lp2.scroll) % (height + 80)) - 40;

            const alpha = (1 - dist / maxConnectDist) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1RenderX, p1RenderY);
            ctx.lineTo(p2RenderX, p2RenderY);
            ctx.stroke();
          }
        }
      }

      // =========================================================================
      // 6. RENDER PARTICLES BY DEPTH LAYER
      // =========================================================================
      for (let layerIdx = 0; layerIdx <= 2; layerIdx++) {
        const lp = layerParallax[layerIdx];
        const layerOffsetX = mouse.smoothNormX * lp.mouseX;
        const layerOffsetY = -smoothScrollY * lp.scroll;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.layer !== layerIdx) continue;

          // Calculated parallax render position
          const rx = p.x + layerOffsetX;
          let ry = (p.y + layerOffsetY) % (height + 80);
          if (ry < -40) ry += height + 80;

          ctx.save();
          ctx.translate(rx, ry);

          // Draw glow halo for foreground & midground particles
          if (p.layer >= 1) {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = p.glowColor;
            ctx.fill();
          }

          // Main Particle Body
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'diamond') {
            ctx.rotate(p.rotation);
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.5);
            ctx.lineTo(p.size * 1.5, 0);
            ctx.lineTo(0, p.size * 1.5);
            ctx.lineTo(-p.size * 1.5, 0);
            ctx.closePath();
            ctx.fill();
          } else if (p.shape === 'ring') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 1.4, 0, Math.PI * 2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            // Core spark
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Start loop
    animationFrameId = requestAnimationFrame(render);

    // Visibility change: pause when hidden to save CPU/battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [particleCount]);

  return (
    <div
      aria-hidden="true"
      className={`futuristic-parallax-bg ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
