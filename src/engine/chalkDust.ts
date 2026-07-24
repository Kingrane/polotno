/**
 * Chalk dust particle system for the chalkboard theme.
 * Particles spawn near the stroke tip, drift downward, and fade in ~1–2s.
 */

export interface ChalkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number; // 0 → 1
  maxLife: number; // seconds
  opacity: number;
  color: string;
  /** soft rotation for irregular flake look */
  rot: number;
  rotSpeed: number;
  /** fixed aspect ratio so flakes don't flicker each frame */
  aspect: number;
}

const MAX_PARTICLES = 280;

/** Parse hex/rgb color → chalk-tinted rgba base (lighter dusty variant). */
function chalkTint(color: string): string {
  // Dark strokes become white chalk; bright colors keep a dusty wash
  if (
    color === '#1d1d1f' ||
    color === '#000000' ||
    color === '#000' ||
    color === 'black'
  ) {
    return '255,255,255';
  }

  // Try hex #rrggbb
  const hex = color.replace('#', '');
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + 40);
    const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + 40);
    const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + 40);
    return `${r},${g},${b}`;
  }

  return '255,255,245';
}

/**
 * Spawn a small burst of dust at a world-space point.
 * @param intensity 0.3–1.5 typical; eraser can use higher.
 */
export function spawnChalkDust(
  particles: ChalkParticle[],
  x: number,
  y: number,
  strokeColor: string,
  intensity = 1,
  count?: number
): void {
  const n = count ?? Math.round(2 + Math.random() * 3 * intensity);
  const tint = chalkTint(strokeColor);

  for (let i = 0; i < n; i++) {
    if (particles.length >= MAX_PARTICLES) {
      // Drop oldest to keep budget
      particles.shift();
    }

    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 18 * intensity;
    const maxLife = 0.9 + Math.random() * 1.1; // 0.9–2.0s

    particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(angle) * speed * 0.35 + (Math.random() - 0.5) * 8,
      vy: Math.sin(angle) * speed * 0.2 + 6 + Math.random() * 14, // bias downward
      size: 0.6 + Math.random() * 2.2 * Math.min(intensity, 1.4),
      life: 0,
      maxLife,
      opacity: 0.35 + Math.random() * 0.45,
      color: tint,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 4,
      aspect: 0.4 + Math.random() * 0.55,
    });
  }
}

/** Integrate physics for one frame. Mutates array in place, removes dead. */
export function updateChalkDust(particles: ChalkParticle[], dt: number): void {
  const gravity = 28; // world units / s²
  const drag = 0.92;

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life += dt;
    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
      continue;
    }

    p.vy += gravity * dt;
    p.vx *= Math.pow(drag, dt * 60);
    p.vy *= Math.pow(drag, dt * 60);
    // tiny horizontal flutter
    p.vx += Math.sin(p.life * 12 + p.rot) * 6 * dt;

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.rotSpeed * dt;
  }
}

/**
 * Draw particles in current world transform (call after elements, still inside viewport transform).
 */
export function renderChalkDust(
  ctx: CanvasRenderingContext2D,
  particles: ChalkParticle[]
): void {
  if (particles.length === 0) return;

  ctx.save();
  for (const p of particles) {
    const t = p.life / p.maxLife;
    // ease-out fade: bright briefly, then soft dissolve
    const fade =
      t < 0.15
        ? t / 0.15 // quick fade-in
        : 1 - Math.pow((t - 0.15) / 0.85, 1.4);

    const alpha = p.opacity * Math.max(0, fade);
    if (alpha < 0.01) continue;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    // soft flake: irregular ellipse
    ctx.fillStyle = `rgba(${p.color},${alpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * p.aspect, 0, 0, Math.PI * 2);
    ctx.fill();

    // soft glow halo
    ctx.fillStyle = `rgba(${p.color},${alpha * 0.25})`;
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

export function hasLiveChalkDust(particles: ChalkParticle[]): boolean {
  return particles.length > 0;
}
