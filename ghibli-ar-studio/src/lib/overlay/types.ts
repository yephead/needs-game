export type AnchorKind =
  | "eyewear"
  | "headwear"
  | "footwear-pair"
  | "bag"
  | "watch"
  | "necklace";

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  /** Image URL (SVG or PNG with transparency). Swap for real brand assets. */
  asset: string;
  anchor: AnchorKind;
  /** Multiplier applied to the anchor's reference dimension. */
  scale: number;
  /** Offset in local units (fractions of the placed width/height). */
  offset: { x: number; y: number };
  /** Art aspect ratio = height / width. */
  aspect: number;
}

/** A resolved on-screen placement in canvas pixels. */
export interface Placement {
  cx: number;
  cy: number;
  width: number;
  height: number;
  /** rotation in radians */
  rotation: number;
}
