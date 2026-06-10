import { CameraManager } from "../camera/cameraManager";
import { VisionEngine } from "../vision/visionEngine";
import type { VisionConfig, VisionResult } from "../vision/types";
import { GhibliRenderer } from "../ghibli/ghibliRenderer";
import { OverlayEngine } from "../overlay/overlayEngine";
import { PRODUCTS } from "../overlay/products";
import type { Product } from "../overlay/types";
import { ui, ghibli, enabledProducts } from "./store.svelte";

/** Which vision detectors does a product's anchor need? */
function detectorsFor(products: Product[]): { face: boolean; pose: boolean } {
  let face = false;
  let pose = false;
  for (const p of products) {
    if (p.anchor === "eyewear" || p.anchor === "headwear") face = true;
    else pose = true; // footwear / bag / watch / necklace all use the body pose
  }
  return { face, pose };
}

/**
 * Owns the live render loop. Draws the (optionally) stylized camera to a base
 * WebGL canvas and composites product overlays on a 2D canvas above it.
 * Reads the reactive store each frame, so UI changes take effect immediately.
 */
export class StudioController {
  readonly camera = new CameraManager();
  readonly engine = new VisionEngine();
  readonly overlay = new OverlayEngine();
  private ghibli: GhibliRenderer | null = null;

  private base: HTMLCanvasElement | null = null;
  private overlayCanvas: HTMLCanvasElement | null = null;
  private overlayCtx: CanvasRenderingContext2D | null = null;

  private raf = 0;
  private running = false;
  private lastVisionSig = "";
  private lastVision: VisionResult = { timestampMs: 0 };

  private frameCount = 0;
  private fpsClock = performance.now();

  attach(base: HTMLCanvasElement, overlay: HTMLCanvasElement): void {
    this.base = base;
    this.overlayCanvas = overlay;
    this.overlayCtx = overlay.getContext("2d");
    if (!this.ghibli) this.ghibli = new GhibliRenderer(base);
    this.overlay.preload(PRODUCTS);
  }

  async start(): Promise<void> {
    if (this.running) return;
    ui.status = "starting";
    ui.message = "Requesting camera…";
    try {
      await this.camera.start({ facingMode: ui.mirror ? "user" : "environment" });
      ui.message = "Loading vision models…";
      await this.syncVisionConfig(true);
      this.running = true;
      ui.status = "running";
      ui.message = "";
      this.loop();
    } catch (err) {
      ui.status = "error";
      ui.message = friendlyError(err);
    }
  }

  /** Reconfigure detectors to match enabled products (debounced by signature). */
  private async syncVisionConfig(force = false): Promise<void> {
    const { face, pose } = detectorsFor(enabledProducts());
    const cfg: Partial<VisionConfig> = {
      face,
      pose,
      hand: false,
      segmentation: false
    };
    const sig = `${face}|${pose}`;
    if (!force && sig === this.lastVisionSig) return;
    this.lastVisionSig = sig;
    await this.engine.configure(cfg);
  }

  private loop = (): void => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);

    const { camera, base, overlayCanvas, overlayCtx, ghibli } = this;
    if (!base || !overlayCanvas || !overlayCtx || !ghibli || !camera.active) return;

    const q = Math.min(Math.max(ui.quality, 0.4), 1);
    const w = Math.round(camera.width * q);
    const h = Math.round(camera.height * q);
    if (w <= 0 || h <= 0) return;
    if (overlayCanvas.width !== w || overlayCanvas.height !== h) {
      overlayCanvas.width = w;
      overlayCanvas.height = h;
    }

    // Keep detectors in sync with product toggles (cheap when unchanged).
    void this.syncVisionConfig();

    // Run vision (guard against model-not-ready / transient GPU errors).
    if (this.engine.ready) {
      try {
        this.lastVision = this.engine.detect(camera.video, performance.now());
      } catch {
        /* drop this frame's detection, keep last */
      }
    }
    ui.faces = this.lastVision.face?.faces.length ?? 0;
    ui.poses = this.lastVision.pose?.poses.length ?? 0;

    // Base layer: stylized (or raw, when intensity collapses to original).
    const params = ghibliParams();
    const intensity = ui.stylize ? params.intensity : 0;
    ghibli.render(camera.video, w, h, { ...params, intensity }, ui.mirror, true);

    // Overlay layer: products anchored to landmarks.
    this.overlay.draw(overlayCtx, this.lastVision, enabledProducts(), w, h, ui.mirror);

    this.tickFps();
  };

  private tickFps(): void {
    this.frameCount++;
    const now = performance.now();
    if (now - this.fpsClock >= 500) {
      ui.fps = Math.round((this.frameCount * 1000) / (now - this.fpsClock));
      this.frameCount = 0;
      this.fpsClock = now;
    }
  }

  /** Flatten base + overlay into a single PNG/JPEG data URL. */
  capture(type: "image/png" | "image/jpeg" = "image/jpeg", quality = 0.92): string | null {
    const { base, overlayCanvas } = this;
    if (!base || !overlayCanvas) return null;
    const out = document.createElement("canvas");
    out.width = base.width;
    out.height = base.height;
    const ctx = out.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(base, 0, 0);
    ctx.drawImage(overlayCanvas, 0, 0, out.width, out.height);
    return out.toDataURL(type, quality);
  }

  async flipCamera(): Promise<void> {
    ui.mirror = !ui.mirror;
    this.overlay.reset();
    await this.camera.start({ facingMode: ui.mirror ? "user" : "environment" });
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    void this.camera.stop();
    ui.status = "idle";
  }

  dispose(): void {
    this.stop();
    this.engine.dispose();
    this.ghibli?.dispose();
  }
}

function ghibliParams() {
  // Snapshot the reactive params into a plain object for the renderer.
  return {
    levels: ghibli.levels,
    edge: ghibli.edge,
    saturation: ghibli.saturation,
    warmth: ghibli.warmth,
    intensity: ghibli.intensity,
    paper: ghibli.paper,
    smoothRadius: ghibli.smoothRadius,
    sigmaColor: ghibli.sigmaColor
  };
}

function friendlyError(err: unknown): string {
  const msg = (err as Error)?.message ?? String(err);
  if (/permission|denied|notallowed/i.test(msg)) {
    return "Camera permission was denied. Allow camera access and reload.";
  }
  if (/notfound|devices/i.test(msg)) return "No camera was found on this device.";
  if (/webgl/i.test(msg)) return "WebGL2 is required but unavailable in this browser.";
  return msg;
}
