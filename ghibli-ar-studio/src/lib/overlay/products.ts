import type { Product } from "./types";

/**
 * Product catalog. Asset paths point at the original brand-evocative art in
 * /public/assets/products. To use genuine brand imagery, drop a transparent
 * PNG at the same path (or edit `asset`) and tune `scale`/`offset`/`aspect`.
 *
 * `aspect` is height / width of the artwork's intended footprint.
 */
export const PRODUCTS: Product[] = [
  {
    id: "gucci-shades",
    brand: "Gucci",
    name: "Oversized Web Sunglasses",
    category: "Eyewear",
    asset: "/assets/products/gucci-sunglasses.svg",
    anchor: "eyewear",
    scale: 2.15,
    offset: { x: 0, y: 0.02 },
    aspect: 0.42
  },
  {
    id: "jordan-1",
    brand: "Air Jordan",
    name: "AJ1 High",
    category: "Footwear",
    asset: "/assets/products/air-jordan-sneaker.svg",
    anchor: "footwear-pair",
    scale: 1.75,
    offset: { x: 0.05, y: -0.1 },
    aspect: 0.62
  },
  {
    id: "gucci-marmont",
    brand: "Gucci",
    name: "GG Marmont Bag",
    category: "Bags",
    asset: "/assets/products/gucci-bag.svg",
    anchor: "bag",
    scale: 1.5,
    offset: { x: 0, y: 0.55 },
    aspect: 0.8
  },
  {
    id: "gucci-cap",
    brand: "Gucci",
    name: "GG Baseball Cap",
    category: "Headwear",
    asset: "/assets/products/gucci-cap.svg",
    anchor: "headwear",
    scale: 1.85,
    offset: { x: 0, y: -0.32 },
    aspect: 0.62
  },
  {
    id: "watch-gold",
    brand: "Maison",
    name: "Gold Chrono Watch",
    category: "Accessories",
    asset: "/assets/products/luxe-watch.svg",
    anchor: "watch",
    scale: 0.9,
    offset: { x: 0, y: 0 },
    aspect: 1.3
  }
];

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
