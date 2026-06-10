/**
 * Loads and caches product artwork as HTMLImageElements (works for SVG + PNG).
 * Decoding is async; draws against a not-yet-loaded asset are simply skipped
 * until the image is ready.
 */
export class AssetManager {
  private cache = new Map<string, HTMLImageElement>();
  private loading = new Map<string, Promise<HTMLImageElement>>();

  /** Synchronously return a decoded image, or null if still loading. */
  get(url: string): HTMLImageElement | null {
    const img = this.cache.get(url);
    if (img) return img;
    if (!this.loading.has(url)) void this.load(url);
    return null;
  }

  load(url: string): Promise<HTMLImageElement> {
    const existing = this.loading.get(url);
    if (existing) return existing;
    const p = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.cache.set(url, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load asset: ${url}`));
      img.src = url;
    });
    this.loading.set(url, p);
    return p;
  }

  /** Preload a batch; resolves once all settle (errors swallowed). */
  async preload(urls: string[]): Promise<void> {
    await Promise.allSettled(urls.map((u) => this.load(u)));
  }
}
