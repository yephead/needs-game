# 🎬 Ghibli AR Studio

A camera-first web app built on the latest **MediaPipe Tasks Vision**. Two things,
in real time, in the browser:

1. **Live AR try-on** — see yourself in the camera feed with brand products
   (Gucci shades, Air Jordans, bags, caps, watches) overlaid and anchored to your
   face mesh and body pose.
2. **Studio Ghibli stylization** — turn the live video into a hand-painted,
   cel-shaded Ghibli scene with an on-device WebGL pipeline, plus an optional
   **cloud hi-fi render** through a diffusion img2img model.

Both run on the same render loop, so you can wear the products *and* be Ghibli-fied
at the same time.

---

## Architecture

```
camera ─▶ VisionEngine (MediaPipe) ─▶ landmarks ┐
   │                                             ├─▶ OverlayEngine ─▶ 2D overlay canvas
   └────────────────────────────────────────────┘        (products anchored to landmarks)
   │
   └─▶ GhibliRenderer (WebGL2) ─▶ base canvas   (bilateral smooth → cel + ink + grade)
                                      │
                                      └─▶ capture ─▶ CloudGhibli ─▶ /api/ghibli (diffusion)
```

| Layer            | File                                   | Responsibility                                  |
| ---------------- | -------------------------------------- | ----------------------------------------------- |
| Camera           | `src/lib/camera/cameraManager.ts`      | `getUserMedia`, front/rear flip, ready video    |
| Vision           | `src/lib/vision/visionEngine.ts`       | Face / Pose / Hand landmarkers + segmentation   |
| Stylizer         | `src/lib/ghibli/ghibliRenderer.ts`     | Two-pass WebGL2 Ghibli look (real-time)         |
| Cloud render     | `src/lib/ghibli/cloudGhibli.ts` + `api/ghibli.ts` | Hi-fi diffusion img2img proxy        |
| Overlays         | `src/lib/overlay/*`                     | Product catalog, landmark anchoring, compositor |
| Orchestration    | `src/lib/state/studioController.ts`     | RAF loop tying it all together                  |
| UI               | `src/App.svelte`, `src/components/*`    | Svelte 5 (runes) interface                      |

MediaPipe models and the matching wasm are loaded from CDN at runtime (pinned to
the installed package version in `visionEngine.ts`), so the JS bundle stays small.

## The Ghibli pipeline (on-device)

`GhibliRenderer` runs every frame:

1. **Bilateral smoothing** — edge-preserving blur flattens skin/sky into broad
   painterly regions while keeping silhouettes.
2. **Cel + ink + grade** — posterizes color into watercolor bands, overlays Sobel
   ink outlines, applies a warm Ghibli daylight grade, and adds paper grain.

Everything is slider-driven (intensity, ink, bands, saturation, warmth, grain,
smoothing) in the **Ghibli Look** panel.

## Cloud hi-fi render (optional)

The **Ghibli Studio** tab can send the current frame to a diffusion model for a
true painted result. The bundled serverless function (`api/ghibli.ts`) proxies
**fal.ai** or **Replicate** so keys never reach the browser. Set one of:

```
FAL_KEY=...                 # recommended (flux img2img)
REPLICATE_API_TOKEN=...     # alternative (SDXL img2img)
```

Without a key the UI still works and shows a friendly "not configured" hint; the
on-device snapshot path needs nothing.

## Products / brand assets

The catalog lives in `src/lib/overlay/products.ts`; artwork is in
`public/assets/products/` (original brand-evocative SVGs by default). Drop real
transparent PNGs in to use genuine assets — see
[`public/assets/products/README.md`](public/assets/products/README.md).

## Run it

```bash
npm install
npm run dev        # http://127.0.0.1:5173  (camera needs https or localhost)
npm run typecheck  # svelte-check
npm run build      # production bundle in dist/
```

> Camera access requires a secure context. `localhost` is treated as secure;
> for LAN/mobile testing serve over HTTPS.

## Deploy

- **Vercel**: `vercel.json` is included; `api/ghibli.ts` becomes an Edge Function.
  Add `FAL_KEY` (or `REPLICATE_API_TOKEN`) in project env vars.
- **Static + Cloudflare Worker**: deploy `dist/` anywhere; wire `api/ghibli.ts`'s
  default export as a Worker `fetch` handler and set `VITE_GHIBLI_API_URL`.

## Browser support

WebGL2 + `getUserMedia` are required (Chrome, Edge, Firefox, Safari 15+). GPU
delegate is used for MediaPipe with a CPU fallback path available in config.

## Notes

This is a demo/testbed. Brand names and any real assets you add are the property
of their respective owners; ship original or properly licensed artwork for
anything public.
