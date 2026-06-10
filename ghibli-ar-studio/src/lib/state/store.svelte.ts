import { DEFAULT_GHIBLI_PARAMS, type GhibliParams } from "../ghibli/ghibliRenderer";
import { PRODUCTS } from "../overlay/products";
import type { Product } from "../overlay/types";

export type Mode = "live" | "studio";
export type Status = "idle" | "starting" | "running" | "error";

/** Global UI/runtime state (Svelte 5 runes). */
export const ui = $state({
  mode: "live" as Mode,
  /** Apply the Ghibli look to the live preview. */
  stylize: false,
  mirror: true,
  /** Render scale (0.5..1) — trades sharpness for frame rate. */
  quality: 0.85,
  /** product id -> enabled. */
  enabled: { "gucci-shades": true, "jordan-1": true } as Record<string, boolean>,
  status: "idle" as Status,
  message: "",
  fps: 0,
  faces: 0,
  poses: 0,
  cloudBusy: false,
  cloudError: "" as string,
  cloudResult: null as string | null
});

/** Live-tunable Ghibli stylization parameters. */
export const ghibli = $state<GhibliParams>({ ...DEFAULT_GHIBLI_PARAMS });

export function enabledProducts(): Product[] {
  return PRODUCTS.filter((p) => ui.enabled[p.id]);
}

export function toggleProduct(id: string): void {
  ui.enabled[id] = !ui.enabled[id];
}
