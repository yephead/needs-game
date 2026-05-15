# NEEDS

Minimal Maslow-inspired browser game with camera-first embodied play.

## Run

Install and run the Vite app:

```sh
npm install
npm run dev
```

Then visit the URL Vite prints, usually `http://127.0.0.1:5173/`.

Run the production gate:

```sh
npm run verify
```

For a built-in completion smoke test, visit `/?verify=1` on the dev or preview server and inspect the `.game` element:

- `data-verify="pass"` means every level reached its completion transition through its real update path.
- `data-verify-results` lists the tier-by-tier result.

## Architecture

- `index.html`: Vite entry, metadata, and structured game schema.
- `src/App.svelte`: Svelte 5 shell for the HUD, overlays, camera surfaces, and render layers.
- `src/game.ts`: game loop, level state machines, canvas renderer, MediaPipe input adapters, and orchestration glue.
- `src/render/pixiLayer.ts`: lazy PixiJS GPU layer for aura fields, burst particles, rings, and transcendence energy.
- `src/motion/theatreDirector.ts`: Theatre.js timeline director for level-up camera motion, pyramid unfolding, and final lift.
- `src/audio/soundEngine.ts`: Tone.js generative motifs plus Howler UI transients.
- `src/animation/riveBridge.ts`: Rive runtime bridge for authored `.riv` symbols, with a canvas fallback until `public/needs-symbols.riv` exists.

The first app chunk stays small. PixiJS, Theatre.js, Rive, Tone.js, and Howler are loaded as capability chunks instead of being forced into the initial shell.

Input is progressive, without an upfront chooser:

- The page primes `Upper` on load: camera upper-body/hand play via MediaPipe Tasks Vision Gesture Recognizer.
- The camera HUD button escalates a live upper-body run into `Full`: full-body play via MediaPipe Tasks Vision Pose Landmarker.
- A second camera HUD press returns to `Classic`: no camera; pointer/touch plus keyboard.
- Camera permission is preflighted when the browser supports it. The start panel and HUD distinguish `allow camera`, `no camera`, `camera busy`, and model-unavailable states.
- If camera permission, device support, or a model load fails during play, the game keeps running in `Classic` instead of blocking the player.
- Upper is not a raw cursor hack. Canned gestures and landmarks are mapped to the level verb:
  - open palm / pinch: breath and gather
  - fist / open palm: shield
  - ILoveYou / pinch / open palm: thread
  - thumb up / victory / pinch: timing lock
  - point / open palm: trace
  - victory / ILoveYou / fast motion: transcendence pulses
- Body mode interprets the 33 pose landmarks as whole-body verbs:
  - open arms / hands together: breath
  - crouch / star stance: gather shockwaves
  - crossed/open shield stance: seal with a body aura
  - wrist-to-wrist arm span: thread
  - jump / arms up: timing lock
  - reach: trace
  - star / jump: transcendence pulses
- Body mode also watches framing and gives tiny camera-fit hints such as `closer`, `center`, or `step back`.

## Camera Privacy

Camera frames stay in the browser. Gesture and pose recognition use MediaPipe Tasks Vision in-page; no app code uploads camera frames. The camera stream is stopped when camera control is turned off or the page is hidden/unloaded.

## Deployment

This is a static Vercel app. `vercel.json` keeps clean URLs, allows browser camera permission for the same origin, disables unused sensors, and adds baseline security/cache headers.
