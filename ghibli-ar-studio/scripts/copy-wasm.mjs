// Copies the MediaPipe Tasks Vision wasm runtime out of node_modules into
// public/vendor so it is served same-origin with the app. No network needed;
// removes any runtime dependency on a third-party CDN (jsdelivr) that some
// networks block. Runs on predev/prebuild.
import { cp, mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const src = resolve(root, "node_modules/@mediapipe/tasks-vision/wasm");
const dest = resolve(root, "public/vendor/mediapipe/wasm");

try {
  await access(src);
} catch {
  console.error(`[copy-wasm] source missing: ${src}\nRun "npm install" first.`);
  process.exit(1);
}

await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });
console.log(`[copy-wasm] copied MediaPipe wasm -> public/vendor/mediapipe/wasm`);
