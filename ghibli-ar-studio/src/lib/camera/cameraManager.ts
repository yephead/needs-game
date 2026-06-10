export interface CameraOptions {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
}

/**
 * Thin wrapper over getUserMedia + a hidden <video>. Handles the async play
 * handshake (Safari/iOS will reject a getVideo() before metadata loads) and
 * exposes a single ready video element the render loop can draw from.
 */
export class CameraManager {
  readonly video: HTMLVideoElement;
  private stream: MediaStream | null = null;
  private _facing: "user" | "environment" = "user";

  constructor() {
    const v = document.createElement("video");
    v.playsInline = true;
    v.muted = true;
    v.autoplay = true;
    // Keep it out of layout; we only ever draw it to a canvas.
    v.style.position = "absolute";
    v.style.opacity = "0";
    v.style.pointerEvents = "none";
    v.width = 1;
    v.height = 1;
    this.video = v;
  }

  get facingMode(): "user" | "environment" {
    return this._facing;
  }

  get active(): boolean {
    return !!this.stream && this.video.readyState >= 2;
  }

  async start(opts: CameraOptions = {}): Promise<void> {
    this._facing = opts.facingMode ?? this._facing;
    await this.stop();

    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: this._facing,
        width: { ideal: opts.width ?? 1280 },
        height: { ideal: opts.height ?? 720 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.stream = stream;
    this.video.srcObject = stream;

    await new Promise<void>((resolve, reject) => {
      const v = this.video;
      const onLoaded = () => {
        v.removeEventListener("loadedmetadata", onLoaded);
        v.play().then(resolve).catch(reject);
      };
      if (v.readyState >= 1) onLoaded();
      else v.addEventListener("loadedmetadata", onLoaded);
    });
  }

  /** Flip between front/rear cameras, reusing the current resolution intent. */
  async flip(): Promise<void> {
    await this.start({ facingMode: this._facing === "user" ? "environment" : "user" });
  }

  async stop(): Promise<void> {
    if (this.stream) {
      for (const track of this.stream.getTracks()) track.stop();
      this.stream = null;
    }
    this.video.srcObject = null;
  }

  get width(): number {
    return this.video.videoWidth || 0;
  }

  get height(): number {
    return this.video.videoHeight || 0;
  }
}
