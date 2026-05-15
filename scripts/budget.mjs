import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url);
const DIST_PATH = fileURLToPath(DIST);
const KB = 1024;
const LIMITS = {
  initialJs: 145 * KB,
  initialCss: 18 * KB,
  totalAssets: 1_650 * KB,
  largestAsyncAsset: 550 * KB
};

const indexHtml = await readFile(new URL("index.html", DIST), "utf8");
const initialScripts = [...indexHtml.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => normalizeAsset(match[1]));
const initialStyles = [...indexHtml.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map((match) => normalizeAsset(match[1]));
const assetNames = await listAssets();

const initialJs = await sumBytes(initialScripts);
const initialCss = await sumBytes(initialStyles);
const totalAssets = await sumBytes(assetNames.map((name) => `/assets/${name}`));
const asyncAssets = assetNames
  .map((name) => ({ name, size: 0 }))
  .filter((asset) => !initialScripts.includes(`/assets/${asset.name}`) && !initialStyles.includes(`/assets/${asset.name}`));

for (const asset of asyncAssets) {
  asset.size = await fileSize(`/assets/${asset.name}`);
}

const largestAsyncAsset = asyncAssets.reduce((largest, asset) => (asset.size > largest.size ? asset : largest), { name: "", size: 0 });

const failures = [];
if (initialJs > LIMITS.initialJs) failures.push(`initial JS ${format(initialJs)} > ${format(LIMITS.initialJs)}`);
if (initialCss > LIMITS.initialCss) failures.push(`initial CSS ${format(initialCss)} > ${format(LIMITS.initialCss)}`);
if (totalAssets > LIMITS.totalAssets) failures.push(`total assets ${format(totalAssets)} > ${format(LIMITS.totalAssets)}`);
if (largestAsyncAsset.size > LIMITS.largestAsyncAsset) {
  failures.push(`largest async asset ${largestAsyncAsset.name} ${format(largestAsyncAsset.size)} > ${format(LIMITS.largestAsyncAsset)}`);
}

if (failures.length) {
  throw new Error(`budget:fail\n${failures.join("\n")}`);
}

console.log(
  `budget:pass initialJs=${format(initialJs)} initialCss=${format(initialCss)} totalAssets=${format(totalAssets)} largestAsync=${largestAsyncAsset.name}:${format(largestAsyncAsset.size)}`
);

async function listAssets() {
  const { readdir } = await import("node:fs/promises");
  return (await readdir(new URL("assets/", DIST))).filter((name) => /\.(js|css|wasm|woff2?)$/.test(name));
}

async function sumBytes(paths) {
  const sizes = await Promise.all(paths.map(fileSize));
  return sizes.reduce((total, size) => total + size, 0);
}

async function fileSize(pathname) {
  const relative = pathname.replace(/^\//, "");
  const info = await stat(join(DIST_PATH, relative));
  return info.size;
}

function normalizeAsset(pathname) {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function format(bytes) {
  return `${(bytes / KB).toFixed(1)} KiB`;
}
