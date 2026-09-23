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
  phase: number;
  pulseSpeed: number;
}

const SUBTLE_PALETTE = [
  { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.18)' }, // Soft Sky Cyan
  { color: '#818cf8', glow: 'rgba(129, 140, 248, 0.15)' }, // Soft Indigo
  { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.15)' }, // Soft Violet
  { color: '#67e8f9', glow: 'rgba(103, 232, 249, 0.15)' }, // Light Cyan
  { color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.12)' }, // Slate Star
];

interface FuturisticParallaxBackgroundProps {
  className?: string;
  particleCount?: number;
}

export const FuturisticParallaxBackground: React.FC<FuturisticParallaxBackgroundProps> = ({
  className = '',
  particleCount = 48,
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

    // Initialize particles (Subtle, delicate sizes and velocities)
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const paletteItem = SUBTLE_PALETTE[Math.floor(Math.random() * SUBTLE_PALETTE.length)];
      const randLayer = Math.random();
      const layer = randLayer < 0.5 ? 0 : randLayer < 0.85 ? 1 : 2;

      let size: number;
      let baseAlpha: number;
      let speedMultiplier: number;

      if (layer === 0) {
        size = Math.random() * 0.8 + 0.6;
        baseAlpha = Math.random() * 0.15 + 0.12;
        speedMultiplier = 0.15;
      } else if (layer === 1) {
        size = Math.random() * 1.2 + 0.9;
        baseAlpha = Math.random() * 0.2 + 0.2;
        speedMultiplier = 0.35;
      } else {
        size = Math.random() * 1.5 + 1.2;
        baseAlpha = Math.random() * 0.25 + 0.25;
        speedMultiplier = 0.55;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedMultiplier,
        vy: (Math.random() * -0.35 - 0.08) * speedMultiplier, // Soft upward drift
        size,
        color: paletteItem.color,
        glowColor: paletteItem.glow,
        baseAlpha,
        alpha: baseAlpha,
        layer,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.008,
      });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth, gentle mouse dampening
      mouse.smoothNormX += (mouse.targetNormX - mouse.smoothNormX) * 0.05;
      mouse.smoothNormY += (mouse.targetNormY - mouse.smoothNormY) * 0.05;
      mouse.absX += (mouse.targetAbsX - mouse.absX) * 0.08;
      mouse.absY += (mouse.targetAbsY - mouse.absY) * 0.08;

      smoothScrollY += (scrollY - smoothScrollY) * 0.06;

      // Clear frame with deep void black
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // =========================================================================
      // 1. WHISPER-SOFT AMBIENT NEBULAE (Gentle cosmic breathing, low contrast)
      // =========================================================================
      const time = currentTime * 0.0004;
      const nebulaParallaxX = mouse.smoothNormX * 18;
      const nebulaParallaxY = mouse.smoothNormY * 14;

      // Top-Left Cyan Ambient Glow
      const g1X = width * 0.25 + nebulaParallaxX + Math.sin(time * 0.6) * 30;
      const g1Y = height * 0.2 + nebulaParallaxY + Math.cos(time * 0.5) * 25;
      const grad1 = ctx.createRadialGradient(g1X, g1Y, 10, g1X, g1Y, width * 0.4);
      grad1.addColorStop(0, 'rgba(14, 165, 233, 0.07)');
      grad1.addColorStop(0.6, 'rgba(56, 189, 248, 0.02)');
      grad1.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Center-Right Violet Ambient Glow
      const g2X = width * 0.75 - nebulaParallaxX + Math.cos(time * 0.7) * 35;
      const g2Y = height * 0.4 - nebulaParallaxY + Math.sin(time * 0.4) * 30;
      const grad2 = ctx.createRadialGradient(g2X, g2Y, 10, g2X, g2Y, width * 0.38);
      grad2.addColorStop(0, 'rgba(139, 92, 246, 0.06)');
      grad2.addColorStop(0.6, 'rgba(168, 85, 247, 0.015)');
      grad2.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // =========================================================================
      // 2. SUBTLE 3D PERSPECTIVE HORIZON GRID (Faint, high-end wireframe)
      // =========================================================================
      const gridHorizonY = height * 0.72;
      const gridBottomY = height;
      const vanishingX = width * 0.5 + mouse.smoothNormX * 40;

      gridOffset = (gridOffset + dt * 15) % 36;

      ctx.save();
      const gridFadeGrad = ctx.createLinearGradient(0, gridHorizonY, 0, gridBottomY);
      gridFadeGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      gridFadeGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.018)');
      gridFadeGrad.addColorStop(1, 'rgba(99, 102, 241, 0.045)');

      ctx.strokeStyle = gridFadeGrad;
      ctx.lineWidth = 0.75;

      const numLines = 18;
      for (let i = -numLines; i <= numLines; i++) {
        const bottomX = vanishingX + (i * width) / (numLines * 0.85);
        ctx.beginPath();
        ctx.moveTo(vanishingX + i * 2, gridHorizonY);
        ctx.lineTo(bottomX, gridBottomY);
        ctx.stroke();
      }

      const numHoriz = 8;
      for (let j = 0; j < numHoriz; j++) {
        const progress = Math.pow((j + gridOffset / 36) / numHoriz, 2.4);
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
      // 3. WHISPER-SOFT MOUSE SPOTLIGHT (Very subtle radial field)
      // =========================================================================
      if (mouse.isInside && mouse.absX > -100) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.absX,
          mouse.absY,
          0,
          mouse.absX,
          mouse.absY,
          160
        );
        mouseGlow.addColorStop(0, 'rgba(56, 189, 248, 0.038)');
        mouseGlow.addColorStop(0.5, 'rgba(129, 140, 248, 0.012)');
        mouseGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // =========================================================================
      // 4. SUBTLE PARTICLE DYNAMICS & DEPTH
      // =========================================================================
      const layerParallax = [
        { mouseX: 10, mouseY: 8, scroll: 0.03 },
        { mouseX: 24, mouseY: 18, scroll: 0.08 },
        { mouseX: 45, mouseY: 35, scroll: 0.15 },
      ];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.phase += p.pulseSpeed;
          p.x += p.vx;
          p.y += p.vy;

          p.x += Math.sin(p.phase) * 0.12;

          // Gentle organic attraction when cursor is near (organic magnetic dust)
          if (mouse.isInside) {
            const dx = mouse.absX - p.x;
            const dy = mouse.absY - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110 && dist > 1) {
              const force = (1 - dist / 110) * 0.35;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        p.alpha = p.baseAlpha + Math.sin(p.phase) * (p.baseAlpha * 0.25);
      }

      // =========================================================================
      // 5. GOSSAMER-THIN CONSTELLATION LINES (Subtle synaptic network)
      // =========================================================================
      const maxConnectDist = 100;
      const maxMouseConnectDist = 110;

      // Delicate hairline connection to mouse
      if (mouse.isInside) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.layer === 0) continue;

          const lp = layerParallax[p.layer];
          const px = p.x + mouse.smoothNormX * lp.mouseX;
          const py = ((p.y - smoothScrollY * lp.scroll) % (height + 40)) - 20;

          const mdx = px - mouse.absX;
          const mdy = py - mouse.absY;
          const mdist = Math.hypot(mdx, mdy);

          if (mdist < maxMouseConnectDist) {
            const mAlpha = (1 - mdist / maxMouseConnectDist) * 0.14;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(px, py);
            ctx.lineTo(mouse.absX, mouse.absY);
            ctx.stroke();
          }
        }
      }

      // Delicate lines between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.layer === 0) continue;

        const lp1 = layerParallax[p1.layer];
        const p1RenderX = p1.x + mouse.smoothNormX * lp1.mouseX;
        const p1RenderY =
          ((p1.y - smoothScrollY * lp1.scroll) % (height + 40)) - 20;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.layer === 0) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            const lp2 = layerParallax[p2.layer];
            const p2RenderX = p2.x + mouse.smoothNormX * lp2.mouseX;
            const p2RenderY =
              ((p2.y - smoothScrollY * lp2.scroll) % (height + 40)) - 20;

            const alpha = (1 - dist / maxConnectDist) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1RenderX, p1RenderY);
            ctx.lineTo(p2RenderX, p2RenderY);
            ctx.stroke();
          }
        }
      }

      // =========================================================================
      // 6. RENDER PARTICLES (Small, soft glowing nodes)
      // =========================================================================
      for (let layerIdx = 0; layerIdx <= 2; layerIdx++) {
        const lp = layerParallax[layerIdx];
        const layerOffsetX = mouse.smoothNormX * lp.mouseX;
        const layerOffsetY = -smoothScrollY * lp.scroll;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.layer !== layerIdx) continue;

          const rx = p.x + layerOffsetX;
          let ry = (p.y + layerOffsetY) % (height + 40);
          if (ry < -20) ry += height + 40;

          ctx.save();
          ctx.translate(rx, ry);

          // Soft glow halo
          if (p.layer >= 1) {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = p.glowColor;
            ctx.fill();
          }

          // Node center
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.08, Math.min(0.6, p.alpha));
          ctx.fill();

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

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
