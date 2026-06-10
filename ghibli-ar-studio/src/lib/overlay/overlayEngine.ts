import type { VisionResult } from "../vision/types";
import type { Product, Placement } from "./types";
import { computePlacements } from "./anchors";
import { AssetManager } from "./assetManager";

interface SmoothState {
  cx: number;
  cy: number;
  width: number;
  height: number;
  rotation: number;
}

/**
 * Draws enabled products onto a 2D overlay canvas, anchored to vision landmarks.
 * Placements are exponentially smoothed per-slot to kill landmark jitter, and a
 * soft contact shadow is drawn under each item to seat it against the subject.
 */
export class OverlayEngine {
  readonly assets = new AssetManager();
  /** Smoothing factor: higher = snappier, lower = floatier. */
  smoothing = 0.45;
  /** Draw a subtle drop shadow under each product. */
  shadows = true;

  private states = new Map<string, SmoothState>();

  preload(products: Product[]): void {
    void this.assets.preload(products.map((p) => p.asset));
  }

  private smooth(key: string, p: Placement): Placement {
    const prev = this.states.get(key);
    if (!prev) {
      this.states.set(key, { ...p });
      return p;
    }
    const a = this.smoothing;
    // Unwrap rotation so it doesn't snap across the ±π seam.
    let dr = p.rotation - prev.rotation;
    while (dr > Math.PI) dr -= 2 * Math.PI;
    while (dr < -Math.PI) dr += 2 * Math.PI;
    const next: SmoothState = {
      cx: prev.cx + (p.cx - prev.cx) * a,
      cy: prev.cy + (p.cy - prev.cy) * a,
      width: prev.width + (p.width - prev.width) * a,
      height: prev.height + (p.height - prev.height) * a,
      rotation: prev.rotation + dr * a
    };
    this.states.set(key, next);
    return next;
  }

  /** Forget all smoothing history (e.g. when switching camera or subject). */
  reset(): void {
    this.states.clear();
  }

  draw(
    ctx: CanvasRenderingContext2D,
    vision: VisionResult,
    products: Product[],
    width: number,
    height: number,
    mirror: boolean
  ): void {
    ctx.clearRect(0, 0, width, height);
    const seen = new Set<string>();

    for (const product of products) {
      const img = this.assets.get(product.asset);
      const placements = computePlacements(product, vision, width, height, mirror);
      placements.forEach((raw, i) => {
        const key = `${product.id}:${i}`;
        seen.add(key);
        const p = this.smooth(key, raw);
        if (img) this.drawOne(ctx, img, p);
        else this.drawPending(ctx, p);
      });
    }

    // Drop smoothing state for slots that vanished this frame.
    for (const key of [...this.states.keys()]) {
      if (!seen.has(key)) this.states.delete(key);
    }
  }

  private drawOne(ctx: CanvasRenderingContext2D, img: HTMLImageElement, p: Placement): void {
    ctx.save();
    ctx.translate(p.cx, p.cy);
    ctx.rotate(p.rotation);
    if (this.shadows) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = p.width * 0.06;
      ctx.shadowOffsetY = p.height * 0.05;
    }
    ctx.drawImage(img, -p.width / 2, -p.height / 2, p.width, p.height);
    ctx.restore();
  }

  /** Placeholder marker shown while artwork is still decoding. */
  private drawPending(ctx: CanvasRenderingContext2D, p: Placement): void {
    ctx.save();
    ctx.translate(p.cx, p.cy);
    ctx.rotate(p.rotation);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);
    ctx.restore();
  }
}
