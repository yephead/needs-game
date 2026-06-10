/**
 * Serverless high-fidelity Ghibli renderer.
 *
 * Portable fetch handler that runs as a Vercel Edge Function or a Cloudflare
 * Worker. It proxies a diffusion img2img model so API keys never reach the
 * browser. Configure ONE of:
 *   - FAL_KEY            -> uses fal.ai (default, fast)
 *   - REPLICATE_API_TOKEN-> uses Replicate
 * With neither set it returns 501 so the UI can show a friendly hint.
 *
 * Vercel: place in /api, it is auto-detected. Edge runtime declared below.
 * Cloudflare: wire `export default { fetch: handler }` in your worker entry.
 */

export const config = { runtime: "edge" };

interface RenderBody {
  image: string; // data URL
  prompt?: string;
  strength?: number;
}

const BASE_PROMPT =
  "Studio Ghibli anime film still, hand-painted watercolor backgrounds, soft " +
  "cinematic lighting, gentle warm palette, Hayao Miyazaki style, highly detailed";

const NEGATIVE_PROMPT = "photo, photorealistic, 3d render, lowres, deformed, extra limbs, text, watermark";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
  });
}

async function renderWithFal(key: string, body: RenderBody): Promise<string> {
  // fal.ai flux/SD img2img endpoint. Model id is overridable via FAL_MODEL.
  const model = (globalThis as Record<string, unknown>).FAL_MODEL ?? "fal-ai/flux/dev/image-to-image";
  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: { authorization: `Key ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      image_url: body.image,
      prompt: `${BASE_PROMPT}. ${body.prompt ?? ""}`.trim(),
      strength: body.strength ?? 0.65,
      num_inference_steps: 28,
      guidance_scale: 3.5,
      enable_safety_checker: false
    })
  });
  if (!res.ok) throw new Error(`fal.ai ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { images?: { url: string }[] };
  const url = data.images?.[0]?.url;
  if (!url) throw new Error("fal.ai returned no image");
  return url;
}

async function renderWithReplicate(token: string, body: RenderBody): Promise<string> {
  // Replicate SDXL img2img. Override model version via REPLICATE_VERSION.
  const version =
    (globalThis as Record<string, unknown>).REPLICATE_VERSION ??
    "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc";
  const create = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      version: String(version).split(":")[1] ?? version,
      input: {
        image: body.image,
        prompt: `${BASE_PROMPT}. ${body.prompt ?? ""}`.trim(),
        negative_prompt: NEGATIVE_PROMPT,
        prompt_strength: body.strength ?? 0.65
      }
    })
  });
  if (!create.ok) throw new Error(`replicate ${create.status}: ${await create.text()}`);
  let pred = (await create.json()) as { id: string; status: string; output?: string[]; urls: { get: string } };
  // Poll until the prediction settles.
  for (let i = 0; i < 60 && pred.status !== "succeeded" && pred.status !== "failed"; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(pred.urls.get, { headers: { authorization: `Bearer ${token}` } });
    pred = (await poll.json()) as typeof pred;
  }
  const out = pred.output?.[pred.output.length - 1];
  if (!out) throw new Error("replicate returned no image");
  return out;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type"
      }
    });
  }
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);

  const env = (globalThis as Record<string, unknown>) as Record<string, string | undefined>;
  const falKey = env.FAL_KEY;
  const replicateToken = env.REPLICATE_API_TOKEN;
  if (!falKey && !replicateToken) {
    return json({ error: "No render backend configured." }, 501);
  }

  let body: RenderBody;
  try {
    body = (await req.json()) as RenderBody;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  if (!body.image) return json({ error: "Missing image" }, 400);

  try {
    const image = falKey
      ? await renderWithFal(falKey, body)
      : await renderWithReplicate(replicateToken!, body);
    return json({ image });
  } catch (err) {
    return json({ error: (err as Error).message }, 502);
  }
}
