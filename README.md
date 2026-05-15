# NEEDS

Minimal Maslow-inspired browser game with camera-first embodied play.

## Run

Open `index.html` directly, or serve the folder locally:

```sh
npm run serve
```

Then visit `http://127.0.0.1:4173/`.

Run the static verification check:

```sh
npm run verify
```

For a built-in completion smoke test, visit `http://127.0.0.1:4173/?verify=1` and inspect the `.game` element:

- `data-verify="pass"` means every level reached its completion transition through its real update path.
- `data-verify-results` lists the tier-by-tier result.

## Architecture

- `index.html`: semantic shell, overlays, and HUD controls.
- `styles.css`: visual system, responsive HUD, camera preview/status surfaces.
- `src/game.js`: game loop, level state machines, canvas renderer, audio/haptics, input adapters.

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
