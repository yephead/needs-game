# Product assets

Each file here is the artwork for one catalog entry in
`src/lib/overlay/products.ts`. The demo ships with original, brand-evocative
SVGs so the app runs out of the box.

## Swapping in real brand assets

1. Export the product as a **transparent PNG** (or keep SVG), framed tightly to
   the visible product with the "front" pointing right for footwear.
2. Save it over the matching file (e.g. `air-jordan-sneaker.svg` →
   `air-jordan-sneaker.png`) and update the `asset` path in `products.ts` if the
   extension changes.
3. Tune the entry's `scale`, `offset`, and `aspect` (height ÷ width of the art)
   so it seats correctly on the landmarks.

## Anchors

| Anchor           | Tracks      | Landmarks used                         |
| ---------------- | ----------- | -------------------------------------- |
| `eyewear`        | Face mesh   | eye outer corners (33 / 263)           |
| `headwear`       | Face mesh   | temples (234 / 454), forehead (10)     |
| `footwear-pair`  | Body pose   | heel + foot index per foot             |
| `bag`            | Body pose   | wrist + elbow (hangs with gravity)     |
| `watch`          | Body pose   | wrist + elbow                          |
| `necklace`       | Body pose   | shoulders (11 / 12)                    |
