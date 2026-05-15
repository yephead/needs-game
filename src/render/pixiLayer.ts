// Pixi is intentionally loaded as a separate capability chunk so the first
// interaction screen is not blocked by the GPU renderer.
import type { ChoreographySnapshot } from "../motion/theatreDirector";

type BurstKind = "level" | "hit" | "transcend";

type Particle = {
  graphic: any;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  ttl: number;
  color: number;
};

type PixiLayer = {
  resize: (width: number, height: number, dpr: number) => void;
  setPalette: (primary: string, secondary: string) => void;
  burst: (options: { x: number; y: number; color: string; count?: number; kind?: BurstKind }) => void;
  update: (
    dt: number,
    state: { width: number; height: number; progress: number; levelIndex: number; player: { x: number; y: number } },
    motion: ChoreographySnapshot
  ) => void;
  destroy: () => void;
};

export function createPixiLayer(host: HTMLElement | null): PixiLayer {
  let app: any = null;
  let Pixi: typeof import("pixi.js") | null = null;
  let ready = false;
  let primary = 0x7dd7c7;
  let secondary = 0xf4bd61;
  const particles: Particle[] = [];
  let field: any = null;
  let burstLayer: any = null;
  let aura: any = null;
  let prism: any = null;
  let rings: any[] = [];

  const init = async () => {
    if (!host || ready) return;
    Pixi = await import("pixi.js");
    app = new Pixi.Application();
    await app.init({
      antialias: true,
      autoDensity: true,
      backgroundAlpha: 0,
      powerPreference: "high-performance",
      resolution: Math.min(2, window.devicePixelRatio || 1)
    });
    field = new Pixi.Container();
    burstLayer = new Pixi.Container();
    aura = new Pixi.Graphics();
    prism = new Pixi.Graphics();
    rings = Array.from({ length: 4 }, () => new Pixi!.Graphics());
    app.canvas.className = "pixi-canvas";
    app.canvas.setAttribute("aria-hidden", "true");
    host.appendChild(app.canvas);
    aura.filters = [new Pixi.BlurFilter({ strength: 12 })];
    field.addChild(aura, prism, ...rings, burstLayer);
    app.stage.addChild(field);
    ready = true;
  };

  void init();

  const resize = (width: number, height: number, dpr: number) => {
    if (!app) return;
    app.renderer.resolution = Math.min(2, dpr || 1);
    app.renderer.resize(Math.max(1, width), Math.max(1, height));
  };

  const setPalette = (nextPrimary: string, nextSecondary: string) => {
    primary = toHex(nextPrimary);
    secondary = toHex(nextSecondary);
  };

  const burst = ({ x, y, color, count = 36, kind = "level" }: { x: number; y: number; color: string; count?: number; kind?: BurstKind }) => {
    if (!ready) return;
    if (!Pixi || !burstLayer) return;
    const hex = toHex(color);
    const force = kind === "transcend" ? 720 : kind === "level" ? 520 : 280;
    for (let i = 0; i < count; i += 1) {
      const g = new Pixi.Graphics();
      const angle = Math.random() * Math.PI * 2;
      const speed = force * (0.18 + Math.random() * 0.82);
      const radius = kind === "hit" ? 1.8 + Math.random() * 3.2 : 2.5 + Math.random() * 7;
      g.circle(0, 0, radius).fill({ color: hex, alpha: 0.74 });
      burstLayer.addChild(g);
      particles.push({
        graphic: g,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: radius,
        life: 0.82 + Math.random() * 0.72,
        ttl: 0.82 + Math.random() * 0.72,
        color: hex
      });
    }
  };

  const update = (
    dt: number,
    state: { width: number; height: number; progress: number; levelIndex: number; player: { x: number; y: number } },
    motion: ChoreographySnapshot
  ) => {
    if (!ready || !app) return;
    field.x = motion.cameraX;
    field.y = motion.cameraY;
    field.rotation = motion.rotate;
    field.scale.set(motion.zoom);
    drawAura(state.width, state.height, state.player.x, state.player.y, state.progress, motion);
    drawRings(state.width, state.height, state.levelIndex, motion);
    updateParticles(dt);
    app.render();
  };

  const destroy = () => {
    particles.splice(0).forEach((particle) => particle.graphic.destroy());
    app?.destroy(true);
    app = null;
    ready = false;
  };

  function drawAura(width: number, height: number, x: number, y: number, progress: number, motion: ChoreographySnapshot) {
    aura.clear();
    const strength = 0.14 + progress * 0.22 + motion.aura * 0.32;
    aura.circle(x, y, 72 + progress * 120 + motion.surge * 90).fill({ color: primary, alpha: strength });
    aura.circle(width * 0.5, height * 0.52, 190 + motion.fold * 220).fill({ color: secondary, alpha: 0.035 + motion.flash * 0.12 });

    prism.clear();
    if (Math.abs(motion.prism) > 0.02) {
      const offset = motion.prism * 18;
      prism
        .poly([width * 0.5, height * 0.16 - offset, width * 0.82 + offset, height * 0.8, width * 0.18 - offset, height * 0.8])
        .stroke({ color: secondary, width: 1.3, alpha: Math.min(0.42, Math.abs(motion.prism)) });
    }
  }

  function drawRings(width: number, height: number, levelIndex: number, motion: ChoreographySnapshot) {
    rings.forEach((ring, index) => {
      ring.clear();
      const phase = ((performance.now() * 0.00018 + index / rings.length + levelIndex * 0.04) % 1 + motion.fold * 0.18) % 1;
      const radius = 72 + phase * (Math.min(width, height) * 0.42);
      const alpha = (1 - phase) * (0.075 + motion.surge * 0.16);
      ring.circle(width * 0.5, height * 0.52, radius).stroke({ color: index % 2 ? primary : secondary, width: 1.4 + motion.surge * 2, alpha });
    });
  }

  function updateParticles(dt: number) {
    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= Math.pow(0.12, dt);
      particle.vy *= Math.pow(0.12, dt);
      particle.life -= dt;
      const alpha = Math.max(0, particle.life / particle.ttl);
      particle.graphic.position.set(particle.x, particle.y);
      particle.graphic.scale.set(0.35 + alpha * 1.15);
      particle.graphic.alpha = alpha;
      if (particle.life <= 0) {
        particle.graphic.destroy();
        particles.splice(index, 1);
      }
    }
  }

  return { resize, setPalette, burst, update, destroy };
}

function toHex(color: string): number {
  const normalized = color.trim().replace("#", "");
  const parsed = Number.parseInt(normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized, 16);
  return Number.isFinite(parsed) ? parsed : 0xffffff;
}
