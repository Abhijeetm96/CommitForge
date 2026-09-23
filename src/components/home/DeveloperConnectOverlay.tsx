import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Users, Wifi, Radio, Zap, Sparkles, ChevronDown, ChevronUp, Terminal, Send, Check } from 'lucide-react';

interface PeerDeveloper {
  id: string;
  name: string;
  role: string;
  location: string;
  color: string;
  glow: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  status: string;
  isLinked: boolean;
  distanceToUser: number;
  lastHandshake: number;
  avatarLetter: string;
}

interface CursorTrailPoint {
  x: number;
  y: number;
  time: number;
  alpha: number;
  token?: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
}

interface BeaconRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  label?: string;
}

interface Packet {
  peerId: string;
  t: number; // 0 to 1 along bezier curve
  speed: number;
  direction: 'to_user' | 'to_peer';
  label: string;
  color: string;
}

const DEV_TOKENS = [
  'git:commit',
  'k8s:pod:running',
  'docker:mesh',
  '200 OK',
  'syn-ack',
  'HEAD~1',
  '0x7F2A',
  'diff:clean',
  'helm:v3',
  'route:ready',
  'tether:active',
];

const INITIAL_PEERS: Omit<PeerDeveloper, 'x' | 'y' | 'targetX' | 'targetY' | 'vx' | 'vy' | 'isLinked' | 'distanceToUser' | 'lastHandshake'>[] = [
  {
    id: 'sophia',
    name: '@sophia.k8s',
    role: 'Cloud Architect',
    location: 'Zurich, CH',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.5)',
    status: 'Reconciling Ingress mesh',
    avatarLetter: 'S',
  },
  {
    id: 'marcus',
    name: '@marcus.git',
    role: 'Core Systems',
    location: 'Austin, US',
    color: '#f05033',
    glow: 'rgba(240, 80, 51, 0.5)',
    status: 'Bisecting regression on main',
    avatarLetter: 'M',
  },
  {
    id: 'chen',
    name: '@chen.sre',
    role: 'SRE Lead',
    location: 'Singapore, SG',
    color: '#34d399',
    glow: 'rgba(52, 211, 153, 0.5)',
    status: 'Analyzing OOMKilled heapdump',
    avatarLetter: 'C',
  },
  {
    id: 'zara',
    name: '@zara.devops',
    role: 'Platform Eng',
    location: 'London, UK',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.5)',
    status: 'Validating Terraform drift',
    avatarLetter: 'Z',
  },
  {
    id: 'kai',
    name: '@kai.docker',
    role: 'Container Specialist',
    location: 'Tokyo, JP',
    color: '#0ea5e9',
    glow: 'rgba(14, 165, 233, 0.5)',
    status: 'Optimizing multi-stage build',
    avatarLetter: 'K',
  },
];

export const DeveloperConnectOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // User Callsign state with persistence
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('forgesuite:dev_callsign') || '@you.dev';
    } catch {
      return '@you.dev';
    }
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // HUD panel state
  const [isHudExpanded, setIsHudExpanded] = useState(false);
  const [activePeersState, setActivePeersState] = useState<PeerDeveloper[]>([]);
  const [handshakeNotification, setHandshakeNotification] = useState<string | null>(null);
  const [hoveredPeerId, setHoveredPeerId] = useState<string | null>(null);
  const [trailEnabled, setTrailEnabled] = useState(true);

  // Shared ref for canvas animation loop to avoid re-renders
  const stateRef = useRef({
    userX: -9999,
    userY: -9999,
    prevUserX: -9999,
    prevUserY: -9999,
    userSpeed: 0,
    isUserInside: false,
    trail: [] as CursorTrailPoint[],
    sparks: [] as Spark[],
    beacons: [] as BeaconRing[],
    packets: [] as Packet[],
    peers: [] as PeerDeveloper[],
    hoveredPeerId: null as string | null,
    trailEnabled: true,
    lastTokenSpawnTime: 0,
  });

  stateRef.current.hoveredPeerId = hoveredPeerId;
  stateRef.current.trailEnabled = trailEnabled;

  const handleSaveName = () => {
    const formatted = tempName.trim() ? (tempName.startsWith('@') ? tempName.trim() : `@${tempName.trim()}`) : '@you.dev';
    setUserName(formatted);
    try {
      localStorage.setItem('forgesuite:dev_callsign', formatted);
    } catch {}
    setIsEditingName(false);
  };

  const triggerBeacon = useCallback((x?: number, y?: number, label?: string) => {
    const bx = x !== undefined ? x : stateRef.current.userX > 0 ? stateRef.current.userX : window.innerWidth / 2;
    const by = y !== undefined ? y : stateRef.current.userY > 0 ? stateRef.current.userY : window.innerHeight / 3;

    stateRef.current.beacons.push({
      x: bx,
      y: by,
      radius: 5,
      maxRadius: 360,
      alpha: 1,
      color: '#38bdf8',
      label: label || `${userName} broadcasted a dev ping!`,
    });

    // Make nearby peers gravitate toward the ping
    stateRef.current.peers.forEach((peer) => {
      const dx = bx - peer.x;
      const dy = by - peer.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 600) {
        peer.targetX = bx + (Math.random() - 0.5) * 160;
        peer.targetY = by + (Math.random() - 0.5) * 160;
        peer.status = `Investigating ping from ${userName}`;
      }
    });
  }, [userName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
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

    // Initialize peers distributed across viewport
    const peers: PeerDeveloper[] = INITIAL_PEERS.map((base, idx) => {
      const posX = 120 + ((width - 240) * (idx + 0.5)) / INITIAL_PEERS.length;
      const posY = 180 + Math.random() * (height - 360);
      return {
        ...base,
        x: posX,
        y: posY,
        targetX: posX + (Math.random() - 0.5) * 200,
        targetY: posY + (Math.random() - 0.5) * 200,
        vx: 0,
        vy: 0,
        isLinked: false,
        distanceToUser: 9999,
        lastHandshake: 0,
      };
    });

    stateRef.current.peers = peers;
    setActivePeersState([...peers]);

    // Global mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      s.isUserInside = true;
      s.prevUserX = s.userX;
      s.prevUserY = s.userY;
      s.userX = e.clientX;
      s.userY = e.clientY;

      const dx = s.userX - s.prevUserX;
      const dy = s.userY - s.prevUserY;
      s.userSpeed = Math.hypot(dx, dy);

      if (s.trailEnabled) {
        // Add trail point
        s.trail.push({
          x: e.clientX,
          y: e.clientY,
          time: performance.now(),
          alpha: 1,
        });

        // Spawn occasional floating dev tokens on rapid mouse movements
        const now = performance.now();
        if (now - s.lastTokenSpawnTime > 140 && s.userSpeed > 6) {
          s.lastTokenSpawnTime = now;
          const token = DEV_TOKENS[Math.floor(Math.random() * DEV_TOKENS.length)];
          s.trail.push({
            x: e.clientX + (Math.random() - 0.5) * 20,
            y: e.clientY - 10,
            time: now,
            alpha: 1,
            token,
          });
        }
      }
    };

    const onMouseLeave = () => {
      stateRef.current.isUserInside = false;
      stateRef.current.userX = -9999;
      stateRef.current.userY = -9999;
    };

    const onWindowClick = (e: MouseEvent) => {
      // Don't trigger beacon if user clicked a real button or link
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.hud-interactive')) {
        return;
      }
      triggerBeacon(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onWindowClick);

    // Main 60fps render loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let packetTimer = 0;
    let hudUpdateTimer = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const s = stateRef.current;

      ctx.clearRect(0, 0, width, height);

      // =======================================================================
      // 1. UPDATE PEER DEVELOPERS (Autonomous natural navigation)
      // =======================================================================
      for (const peer of s.peers) {
        // Pick new targets when close or periodically
        const tDist = Math.hypot(peer.targetX - peer.x, peer.targetY - peer.y);
        if (tDist < 30 || Math.random() < 0.005) {
          // Constrain inside viewport with padding
          peer.targetX = 80 + Math.random() * (width - 160);
          peer.targetY = 120 + Math.random() * (height - 240);
        }

        // Steer toward target with gentle acceleration
        const angle = Math.atan2(peer.targetY - peer.y, peer.targetX - peer.x);
        const desiredVx = Math.cos(angle) * 1.2;
        const desiredVy = Math.sin(angle) * 1.2;
        peer.vx += (desiredVx - peer.vx) * 0.04;
        peer.vy += (desiredVy - peer.vy) * 0.04;

        peer.x += peer.vx;
        peer.y += peer.vy;

        // Calculate distance to user
        if (s.isUserInside && s.userX > 0) {
          peer.distanceToUser = Math.hypot(s.userX - peer.x, s.userY - peer.y);
          peer.isLinked = peer.distanceToUser < 220;

          // React to user proximity
          if (peer.distanceToUser < 180) {
            // Peer slows down to inspect
            peer.vx *= 0.85;
            peer.vy *= 0.85;
            // Peer status updates
            if (peer.distanceToUser < 80) {
              peer.status = `Pairing with ${userName} [ACTIVE]`;
            } else {
              peer.status = `Connected to ${userName} (${Math.round(peer.distanceToUser)}px)`;
            }

            // TRIGGER HANDSHAKE IF PROXIMITY < 70px
            if (peer.distanceToUser < 70 && now - peer.lastHandshake > 4000) {
              peer.lastHandshake = now;
              // Spawn explosion of cyber sparks
              for (let i = 0; i < 28; i++) {
                const spAngle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1.5;
                s.sparks.push({
                  x: (s.userX + peer.x) / 2,
                  y: (s.userY + peer.y) / 2,
                  vx: Math.cos(spAngle) * speed,
                  vy: Math.sin(spAngle) * speed,
                  color: Math.random() > 0.5 ? peer.color : '#38bdf8',
                  alpha: 1,
                  size: Math.random() * 3 + 1.5,
                  life: 0,
                  maxLife: 0.8 + Math.random() * 0.5,
                });
              }

              // Add shockwave beacon
              s.beacons.push({
                x: (s.userX + peer.x) / 2,
                y: (s.userY + peer.y) / 2,
                radius: 10,
                maxRadius: 180,
                alpha: 1,
                color: peer.color,
                label: `⚡ DEV HANDSHAKE with ${peer.name}!`,
              });

              setHandshakeNotification(`⚡ High-Five! Neural Link Established with ${peer.name}`);
              setTimeout(() => setHandshakeNotification(null), 3500);
            }
          }
        } else {
          peer.distanceToUser = 9999;
          peer.isLinked = false;
        }
      }

      // =======================================================================
      // 2. DATA PACKETS ALONG LINKED TETHERS
      // =======================================================================
      packetTimer += dt;
      if (packetTimer > 0.35) {
        packetTimer = 0;
        s.peers.forEach((peer) => {
          if (peer.isLinked && s.isUserInside) {
            const dir = Math.random() > 0.5 ? 'to_peer' : 'to_user';
            const pkts = ['SYN', 'ACK', 'DIFF', 'PING', 'PUSH', 'PULL', 'PACKET'];
            s.packets.push({
              peerId: peer.id,
              t: 0,
              speed: 1.2 + Math.random() * 0.8,
              direction: dir,
              label: pkts[Math.floor(Math.random() * pkts.length)],
              color: peer.color,
            });
          }
        });
      }

      // =======================================================================
      // 3. RENDER QUANTUM TETHERS / DYNAMIC ELASTIC BEAMS
      // =======================================================================
      if (s.isUserInside && s.userX > 0) {
        for (const peer of s.peers) {
          if (peer.isLinked) {
            const dist = peer.distanceToUser;
            const alpha = Math.max(0.1, (1 - dist / 220) * 0.85);

            // Curved elastic connection
            const midX = (s.userX + peer.x) / 2;
            const midY = (s.userY + peer.y) / 2;
            const curveOffset = Math.sin(now * 0.005 + peer.x) * 25;
            const ctrlX = midX + curveOffset;
            const ctrlY = midY - 20;

            ctx.save();
            // Outer glow line
            ctx.beginPath();
            ctx.moveTo(s.userX, s.userY);
            ctx.quadraticCurveTo(ctrlX, ctrlY, peer.x, peer.y);
            ctx.strokeStyle = peer.color;
            ctx.lineWidth = 2.5;
            ctx.globalAlpha = alpha * 0.6;
            ctx.shadowColor = peer.color;
            ctx.shadowBlur = 12;
            ctx.stroke();

            // Inner core laser beam
            ctx.beginPath();
            ctx.moveTo(s.userX, s.userY);
            ctx.quadraticCurveTo(ctrlX, ctrlY, peer.x, peer.y);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.globalAlpha = alpha;
            ctx.stroke();

            // Midpoint holographic HUD badge
            if (dist < 170) {
              const pingMs = Math.round(dist * 0.08 + 6);
              const badgeText = `LINK ACTIVE • ${pingMs}ms`;

              ctx.font = '600 10px monospace';
              const textWidth = ctx.measureText(badgeText).width;

              ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
              ctx.strokeStyle = peer.color;
              ctx.lineWidth = 1;
              ctx.globalAlpha = alpha * 0.95;

              ctx.beginPath();
              ctx.roundRect(ctrlX - textWidth / 2 - 8, ctrlY - 12, textWidth + 16, 20, 4);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#f8fafc';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(badgeText, ctrlX, ctrlY - 2);
            }

            ctx.restore();
          }
        }

        // Render packets traveling on curves
        for (let i = s.packets.length - 1; i >= 0; i--) {
          const pkt = s.packets[i];
          const peer = s.peers.find((p) => p.id === pkt.peerId);
          if (!peer || !peer.isLinked) {
            s.packets.splice(i, 1);
            continue;
          }

          pkt.t += dt * pkt.speed;
          if (pkt.t >= 1) {
            s.packets.splice(i, 1);
            continue;
          }

          // Calculate point on quadratic curve
          const progress = pkt.direction === 'to_peer' ? pkt.t : 1 - pkt.t;
          const midX = (s.userX + peer.x) / 2;
          const midY = (s.userY + peer.y) / 2;
          const curveOffset = Math.sin(now * 0.005 + peer.x) * 25;
          const ctrlX = midX + curveOffset;
          const ctrlY = midY - 20;

          const invT = 1 - progress;
          const px = invT * invT * s.userX + 2 * invT * progress * ctrlX + progress * progress * peer.x;
          const py = invT * invT * s.userY + 2 * invT * progress * ctrlY + progress * progress * peer.y;

          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = pkt.color;
          ctx.shadowBlur = 8;
          ctx.fill();

          ctx.font = '700 8px monospace';
          ctx.fillStyle = pkt.color;
          ctx.fillText(pkt.label, px + 5, py - 4);
          ctx.restore();
        }
      }

      // =======================================================================
      // 4. RENDER RADAR TARGET BEAM IF PEER IS HOVERED IN HUD
      // =======================================================================
      if (s.hoveredPeerId && s.userX > 0) {
        const hoveredPeer = s.peers.find((p) => p.id === s.hoveredPeerId);
        if (hoveredPeer) {
          ctx.save();
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(s.userX, s.userY);
          ctx.lineTo(hoveredPeer.x, hoveredPeer.y);
          ctx.strokeStyle = hoveredPeer.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.8;
          ctx.stroke();

          // Target reticle over peer
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(hoveredPeer.x, hoveredPeer.y, 28, 0, Math.PI * 2);
          ctx.strokeStyle = hoveredPeer.color;
          ctx.lineWidth = 2;
          ctx.shadowColor = hoveredPeer.color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.restore();
        }
      }

      // =======================================================================
      // 5. RENDER PEER DEVELOPER CURSORS & HOLOGRAPHIC TAGS
      // =======================================================================
      for (const peer of s.peers) {
        ctx.save();
        ctx.translate(peer.x, peer.y);

        // Ambient halo pulse
        const pulse = Math.sin(now * 0.004 + peer.x) * 0.2 + 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, 16 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = peer.glow;
        ctx.globalAlpha = peer.isLinked ? 0.7 : 0.35;
        ctx.fill();

        // Developer Cursor Pointer (SVG style)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(14, 18);
        ctx.lineTo(6, 17);
        ctx.lineTo(0, 24);
        ctx.closePath();
        ctx.fillStyle = peer.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = peer.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.stroke();

        // Callsign Pill Badge
        const tagText = `${peer.name} [${peer.avatarLetter}]`;
        ctx.font = '700 11px Inter, sans-serif';
        const tagWidth = ctx.measureText(tagText).width;

        ctx.fillStyle = 'rgba(10, 15, 28, 0.9)';
        ctx.strokeStyle = peer.isLinked ? peer.color : 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.shadowColor = peer.isLinked ? peer.color : 'transparent';
        ctx.shadowBlur = peer.isLinked ? 8 : 0;

        ctx.beginPath();
        ctx.roundRect(16, 2, tagWidth + 14, 20, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = peer.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(tagText, 23, 12);

        // Status Subtitle when linked or hovered
        if (peer.isLinked || s.hoveredPeerId === peer.id) {
          ctx.font = '500 9px monospace';
          const statusText = peer.status;
          const statusWidth = ctx.measureText(statusText).width;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
          ctx.beginPath();
          ctx.roundRect(16, 25, statusWidth + 12, 16, 4);
          ctx.fill();

          ctx.fillStyle = '#94a3b8';
          ctx.fillText(statusText, 22, 33);
        }

        ctx.restore();
      }

      // =======================================================================
      // 6. RENDER USER'S KINETIC MOTION TRAIL & CODE STREAM TOKENS
      // =======================================================================
      if (s.trailEnabled && s.trail.length > 0) {
        for (let i = s.trail.length - 1; i >= 0; i--) {
          const pt = s.trail[i];
          const age = (now - pt.time) / 1000;

          if (age > 1.2) {
            s.trail.splice(i, 1);
            continue;
          }

          pt.alpha = Math.max(0, 1 - age / 1.2);

          ctx.save();
          if (pt.token) {
            // Floating code token
            const floatY = pt.y - age * 35;
            ctx.font = '600 10px var(--font-mono, monospace)';
            ctx.fillStyle = `rgba(56, 189, 248, ${pt.alpha * 0.9})`;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
            ctx.shadowBlur = 6;
            ctx.fillText(pt.token, pt.x + 8, floatY);
          } else {
            // Particle wake dot
            const size = Math.max(0.5, (1 - age / 1.2) * 3);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${pt.alpha * 0.7})`;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 4;
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // =======================================================================
      // 7. RENDER USER CURSOR RETICLE & BADGE
      // =======================================================================
      if (s.isUserInside && s.userX > 0) {
        ctx.save();
        ctx.translate(s.userX, s.userY);

        // Cyber target halo
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // User callsign pill tag
        ctx.font = '700 10px Inter, sans-serif';
        const userTagWidth = ctx.measureText(userName).width;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(12, 10, userTagWidth + 14, 18, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(userName, 18, 19);

        ctx.restore();
      }

      // =======================================================================
      // 8. RENDER EXPANDING BEACONS / PING RADAR RINGS
      // =======================================================================
      for (let i = s.beacons.length - 1; i >= 0; i--) {
        const b = s.beacons[i];
        b.radius += dt * 180;
        b.alpha = Math.max(0, 1 - b.radius / b.maxRadius);

        if (b.radius >= b.maxRadius) {
          s.beacons.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = b.alpha * 0.7;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Second subtle inner wave
        if (b.radius > 30) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius - 25, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.globalAlpha = b.alpha * 0.4;
          ctx.stroke();
        }

        if (b.label && b.radius < 120) {
          ctx.font = '700 11px Inter, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(b.label, b.x, b.y - b.radius - 6);
        }
        ctx.restore();
      }

      // =======================================================================
      // 9. RENDER SPARKS / CELEBRATION PARTICLES
      // =======================================================================
      for (let i = s.sparks.length - 1; i >= 0; i--) {
        const sp = s.sparks[i];
        sp.life += dt;
        if (sp.life >= sp.maxLife) {
          s.sparks.splice(i, 1);
          continue;
        }

        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.95;
        sp.vy *= 0.95;
        sp.alpha = Math.max(0, 1 - sp.life / sp.maxLife);

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Throttle HUD react state updates to 6 times a second
      hudUpdateTimer += dt;
      if (hudUpdateTimer > 0.16) {
        hudUpdateTimer = 0;
        setActivePeersState([...s.peers]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onWindowClick);
    };
  }, [triggerBeacon, userName]);

  const linkedCount = activePeersState.filter((p) => p.isLinked).length;

  return (
    <>
      {/* Interactive Canvas Rendering Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Handshake Floating Toast Notification */}
      {handshakeNotification && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 27, 45, 0.98) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            boxShadow: '0 10px 30px -5px rgba(56, 189, 248, 0.35)',
            borderRadius: '999px',
            padding: '0.6rem 1.4rem',
            color: '#ffffff',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Sparkles size={16} color="#38bdf8" />
          <span>{handshakeNotification}</span>
        </div>
      )}

      {/* Floating Developer Co-Presence HUD Widget (Bottom-Right) */}
      <aside
        aria-label="Developer Telemetry & Collaboration HUD"
        className="hud-interactive"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          background: 'rgba(10, 15, 28, 0.88)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.15)',
          borderRadius: '16px',
          backdropFilter: 'blur(16px)',
          color: '#f8fafc',
          width: isHudExpanded ? '340px' : 'auto',
          maxWidth: 'calc(100vw - 48px)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Minimized / Header Bar */}
        <div
          onClick={() => setIsHudExpanded(!isHudExpanded)}
          style={{
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
            cursor: 'pointer',
            userSelect: 'none',
            background: isHudExpanded ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
            borderBottom: isHudExpanded ? '1px solid rgba(148, 163, 184, 0.12)' : 'none',
          }}
          title={isHudExpanded ? 'Collapse Developer HUD' : 'Expand Developer HUD'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: linkedCount > 0 ? '#38bdf8' : '#22c55e',
                boxShadow: linkedCount > 0 ? '0 0 8px #38bdf8' : '0 0 8px #22c55e',
                animation: 'pulse 1.8s infinite',
              }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
              {linkedCount > 0 ? `${linkedCount} Neural Link${linkedCount > 1 ? 's' : ''} Active` : '5 Engineers Live'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                fontWeight: 700,
              }}
            >
              Live Telemetry
            </span>
            {isHudExpanded ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronUp size={16} color="#94a3b8" />}
          </div>
        </div>

        {/* Expanded View */}
        {isHudExpanded && (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* User Callsign Card */}
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                  }}
                >
                  YOU
                </div>
                {isEditingName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid #38bdf8',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.78rem',
                        padding: '0.2rem 0.45rem',
                        width: '110px',
                        outline: 'none',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      style={{
                        background: '#38bdf8',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.2rem 0.4rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Check size={12} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{userName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Your Dev Node in Forge Network</div>
                  </div>
                )}
              </div>

              {!isEditingName && (
                <button
                  onClick={() => {
                    setTempName(userName);
                    setIsEditingName(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: '0.2rem 0.4rem',
                  }}
                >
                  Edit
                </button>
              )}
            </div>

            {/* Quick Peer Connections List */}
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#94a3b8',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Nearby Peer Engineers</span>
                <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>Hover to Ping</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto' }}>
                {activePeersState.map((peer) => {
                  const isHovered = hoveredPeerId === peer.id;
                  return (
                    <div
                      key={peer.id}
                      onMouseEnter={() => setHoveredPeerId(peer.id)}
                      onMouseLeave={() => setHoveredPeerId(null)}
                      style={{
                        padding: '0.45rem 0.65rem',
                        borderRadius: '8px',
                        background: isHovered || peer.isLinked ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isHovered || peer.isLinked ? peer.color : 'rgba(148, 163, 184, 0.1)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '6px',
                            background: peer.color,
                            color: '#0f172a',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {peer.avatarLetter}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                            {peer.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            {peer.role} &bull; {peer.location}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: peer.isLinked ? peer.color : '#64748b',
                          }}
                        >
                          {peer.distanceToUser < 1000 ? `${Math.round(peer.distanceToUser)}px` : 'Roaming'}
                        </div>
                        {peer.isLinked && (
                          <div style={{ fontSize: '0.62rem', color: '#4ade80', fontWeight: 600 }}>
                            Linked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
              <button
                onClick={() => triggerBeacon()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
              >
                <Radio size={13} />
                <span>Broadcast Ping</span>
              </button>

              <button
                onClick={() => setTrailEnabled(!trailEnabled)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: trailEnabled ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${trailEnabled ? 'rgba(34, 197, 94, 0.35)' : 'rgba(148, 163, 184, 0.2)'}`,
                  color: trailEnabled ? '#4ade80' : '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Zap size={13} />
                <span>{trailEnabled ? 'Trails: ON' : 'Trails: OFF'}</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
