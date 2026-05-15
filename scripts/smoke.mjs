import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";

const PORT = Number(process.env.SMOKE_PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const LEVELS = "intro:pass,body:pass,safety:pass,love:pass,esteem:pass,actual:pass,beyond:pass";

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
  await page.waitForTimeout(1_500);

  const result = await page.evaluate(() => {
    const game = document.querySelector(".game");
    const overflowing = [...document.querySelectorAll("button, .level-chip, .meter, .stage-note, .start-panel")]
      .map((element) => ({ name: element.id || element.className || element.tagName, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.left < -1 || rect.right > window.innerWidth + 1 || rect.top < -1 || rect.bottom > window.innerHeight + 1)
      .map(({ name }) => name);

    return {
      verify: game?.dataset.verify || "",
      results: game?.dataset.verifyResults || "",
      pixiCanvas: Boolean(document.querySelector(".pixi-canvas")),
      riveLayer: Boolean(document.querySelector("#riveLayer")),
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
  if (result.overflowing.length) {
    throw new Error(`${viewport.name} layout overflow: ${result.overflowing.join(", ")}`);
  }
  const currentMessages = messages.filter((message) => {
    if (message.includes("Permissions-Policy")) return false;
    if (message.includes("GL Driver Message") && message.includes("GPU stall due to ReadPixels")) return false;
    return true;
  });
  if (currentMessages.length) {
    throw new Error(`${viewport.name} console noise:\n${currentMessages.join("\n")}`);
  }
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
