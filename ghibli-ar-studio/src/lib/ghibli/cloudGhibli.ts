/**
 * Client for the optional high-fidelity cloud render. Posts a single captured
 * frame to a serverless endpoint that proxies a diffusion img2img model
 * (see api/ghibli.ts). Falls back gracefully when no endpoint/key is configured.
 */

export interface CloudRenderRequest {
  /** Source frame as a data URL (image/jpeg or image/png). */
  image: string;
  /** Extra style guidance appended to the base Ghibli prompt. */
  prompt?: string;
  /** 0..1, how strongly the model repaints the frame. */
  strength?: number;
}

export interface CloudRenderResult {
  image: string; // data URL of the rendered frame
}

export class CloudGhibliError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "CloudGhibliError";
  }
}

const ENDPOINT = import.meta.env.VITE_GHIBLI_API_URL ?? "/api/ghibli";

export async function renderGhibliCloud(req: CloudRenderRequest): Promise<CloudRenderResult> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        image: req.image,
        prompt: req.prompt ?? "",
        strength: req.strength ?? 0.65
      })
    });
  } catch (err) {
    throw new CloudGhibliError(
      `Could not reach the render service (${(err as Error).message}). ` +
        `Run the serverless function or set VITE_GHIBLI_API_URL.`,
      0
    );
  }

  if (res.status === 501) {
    throw new CloudGhibliError(
      "Cloud renderer is not configured. Add a FAL_KEY (or REPLICATE_API_TOKEN) to the deployment.",
      501
    );
  }
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new CloudGhibliError(`Render failed (${res.status}): ${text}`, res.status);
  }

  const data = (await res.json()) as Partial<CloudRenderResult>;
  if (!data.image) throw new CloudGhibliError("Render service returned no image.", 502);
  return { image: data.image };
}
