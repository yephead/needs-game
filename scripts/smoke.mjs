import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";

const PORT = Number(process.env.SMOKE_PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const LEVELS = "intro:pass,body:pass,safety:pass,love:pass,esteem:pass,actual:pass,beyond:pass,camera:pass";

const server = spawn("npm", ["run", "preview", "--", "--port", String(PORT)], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, CI: "1" },
  detached: process.platform !== "win32"
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  await waitForServer(BASE_URL);
  const browser = await chromium.launch({ headless: true });
  try {
    await smokeStartFlow(browser);
    await smokeViewport(browser, { width: 1280, height: 720, name: "desktop" });
    await smokeViewport(browser, { width: 390, height: 844, name: "mobile" });
  } finally {
    await browser.close();
  }
  console.log("smoke:pass");
} finally {
  stopServer();
}

async function smokeViewport(browser, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const messages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    messages.push(`pageerror: ${error.message}`);
  });

  await page.goto(`${BASE_URL}/?verify=1&smoke=${viewport.name}`, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const game = document.querySelector(".game");
    return game?.dataset.verify === "pass" || game?.dataset.verify === "fail";
  }, null, { timeout: 15_000 });
  await page
    .waitForFunction(() => navigator.serviceWorker?.getRegistration("/").then(Boolean), null, { timeout: 6_000 })
    .catch(() => undefined);
  await page
    .waitForFunction(() => Boolean(document.querySelector(".pixi-canvas")) && Boolean(document.querySelector("#riveLayer")), null, { timeout: 8_000 })
    .catch(() => undefined);
  await page.waitForTimeout(1_500);

  const result = await page.evaluate(async () => {
    const game = document.querySelector(".game");
    const meta = Object.fromEntries(
      [...document.querySelectorAll("meta[property], meta[name]")].map((element) => [
        element.getAttribute("property") || element.getAttribute("name"),
        element.getAttribute("content")
      ])
    );
    const overflowing = [...document.querySelectorAll("button, .level-chip, .meter, .stage-note, .start-panel")]
      .map((element) => ({ name: element.id || element.className || element.tagName, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.left < -1 || rect.right > window.innerWidth + 1 || rect.top < -1 || rect.bottom > window.innerHeight + 1)
      .map(({ name }) => name);

    return {
      verify: game?.dataset.verify || "",
      results: game?.dataset.verifyResults || "",
      pixiCanvas: Boolean(document.querySelector(".pixi-canvas")),
      riveLayer: Boolean(document.querySelector("#riveLayer")),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
      manifest: document.querySelector('link[rel="manifest"]')?.getAttribute("href") || "",
      ogImage: meta["og:image"] || "",
      twitterCard: meta["twitter:card"] || "",
      serviceWorker: Boolean(await navigator.serviceWorker?.getRegistration("/").catch(() => null)),
      overflowing
    };
  });

  await page.close();

  if (result.verify !== "pass") {
    throw new Error(`${viewport.name} verify failed: ${JSON.stringify(result)}`);
  }
  if (result.results !== LEVELS) {
    throw new Error(`${viewport.name} level results changed: ${result.results}`);
  }
  if (!result.pixiCanvas || !result.riveLayer) {
    throw new Error(`${viewport.name} effect layers missing: ${JSON.stringify(result)}`);
  }
  if (result.canonical !== "https://needs-game.vercel.app/" || result.manifest !== "/site.webmanifest") {
    throw new Error(`${viewport.name} metadata broken: ${JSON.stringify(result)}`);
  }
  if (result.ogImage !== "https://needs-game.vercel.app/og.svg" || result.twitterCard !== "summary_large_image") {
    throw new Error(`${viewport.name} share metadata broken: ${JSON.stringify(result)}`);
  }
  if (!result.serviceWorker) {
    throw new Error(`${viewport.name} service worker did not register: ${JSON.stringify(result)}`);
  }
  if (result.overflowing.length) {
    throw new Error(`${viewport.name} layout overflow: ${result.overflowing.join(", ")}`);
  }
  const currentMessages = filterConsole(messages);
  if (currentMessages.length) {
    throw new Error(`${viewport.name} console noise:\n${currentMessages.join("\n")}`);
  }
}

async function smokeStartFlow(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const messages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    messages.push(`pageerror: ${error.message}`);
  });

  await page.goto(`${BASE_URL}/?smoke=start`, { waitUntil: "load" });
  await page.waitForTimeout(3_000);
  const before = await readStartFlow(page);
  const startRect = await page.evaluate(() => {
    const rect = document.querySelector("#startButton")?.getBoundingClientRect();
    return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;
  });
  if (!startRect) {
    throw new Error(`start button missing before click: ${JSON.stringify(before)}`);
  }
  await page.mouse.click(startRect.x + startRect.width / 2, startRect.y + startRect.height / 2);
  await page.waitForTimeout(1_500);
  const after = await readStartFlow(page);
  await page.close();

  if (before.startOpen !== "true" || before.startHidden !== "false") {
    throw new Error(`start overlay not open on first load: ${JSON.stringify(before)}`);
  }
  if (before.completeOpen !== "false" || before.completeHidden !== "true" || !before.completeInert) {
    throw new Error(`complete overlay exposed on first load: ${JSON.stringify(before)}`);
  }
  if (after.started !== "true" || after.startOpen !== "false" || after.startHidden !== "true" || !after.startInert) {
    throw new Error(`start action did not enter play cleanly: ${JSON.stringify(after)}`);
  }
  if (after.completeOpen !== "false" || after.completeHidden !== "true" || !after.completeInert) {
    throw new Error(`complete overlay exposed during play: ${JSON.stringify(after)}`);
  }
  if (after.cameraBlocked === "true" && after.cameraStatus !== "classic controls") {
    throw new Error(`blocked camera did not fall back clearly: ${JSON.stringify(after)}`);
  }
  const currentMessages = filterConsole(messages);
  if (currentMessages.length) {
    throw new Error(`start flow console noise:\n${currentMessages.join("\n")}`);
  }
}

async function readStartFlow(page) {
  return page.evaluate(() => {
    const game = document.querySelector(".game");
    const startOverlay = document.querySelector("#startOverlay");
    const completeOverlay = document.querySelector("#completeOverlay");
    return {
      started: game?.dataset.started || "",
      mode: game?.dataset.mode || "",
      cameraBlocked: game?.dataset.cameraBlocked || "",
      cameraStatus: document.querySelector("#cameraStatus")?.textContent?.trim() || "",
      startText: document.querySelector("#startButtonText")?.textContent?.trim() || "",
      startOpen: startOverlay?.dataset.open || "",
      startHidden: startOverlay?.getAttribute("aria-hidden") || "",
      startInert: Boolean(startOverlay?.hasAttribute("inert")),
      completeOpen: completeOverlay?.dataset.open || "",
      completeHidden: completeOverlay?.getAttribute("aria-hidden") || "",
      completeInert: Boolean(completeOverlay?.hasAttribute("inert"))
    };
  });
}

function filterConsole(messages) {
  return messages.filter((message) => {
    if (message.includes("Permissions-Policy")) return false;
    if (message.includes("GL Driver Message") && message.includes("GPU stall due to ReadPixels")) return false;
    return true;
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) return;
    } catch {
      // Preview server is still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not start at ${url}\n${serverOutput}`);
}

function stopServer() {
  if (!server.pid || server.killed) return;
  try {
    if (process.platform === "win32") server.kill("SIGTERM");
    else process.kill(-server.pid, "SIGTERM");
  } catch {
    try {
      server.kill("SIGTERM");
    } catch {
      // The server already exited.
    }
  }
}
