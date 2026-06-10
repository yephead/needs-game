import {
  FilesetResolver,
  FaceLandmarker,
  PoseLandmarker,
  HandLandmarker,
  ImageSegmenter
} from "@mediapipe/tasks-vision";
import type {
  VisionConfig,
  VisionResult,
  Landmark,
  FaceResult,
  PoseResult,
  HandResult
} from "./types";
import { DEFAULT_VISION_CONFIG } from "./types";

/**
 * The wasm runtime is copied out of node_modules into /public/vendor at build
 * time (see scripts/copy-wasm.mjs), so it is served same-origin — no dependency
 * on a third-party CDN that a corporate/mobile network might block. We probe it
 * and fall back to the version-pinned jsdelivr copy only if the local files are
 * somehow absent.
 */
const TASKS_VISION_VERSION = "0.10.35";
const LOCAL_WASM_BASE = `${import.meta.env.BASE_URL}vendor/mediapipe/wasm`;
const CDN_WASM_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;

async function resolveWasmBase(): Promise<string> {
  try {
    const res = await fetch(`${LOCAL_WASM_BASE}/vision_wasm_internal.js`, { method: "HEAD" });
    if (res.ok) return LOCAL_WASM_BASE;
  } catch {
    /* fall through to CDN */
  }
  return CDN_WASM_BASE;
}

/** Official model assets hosted by Google. */
const MODELS = {
  face: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
  pose: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
  hand: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
  segmenter:
    "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"
} as const;

function toLandmarks(raw: { x: number; y: number; z: number; visibility?: number }[]): Landmark[] {
  return raw.map((p) => ({ x: p.x, y: p.y, z: p.z, visibility: p.visibility }));
}

/**
 * Owns all MediaPipe Tasks Vision detectors and runs them against a video frame.
 * Detectors are created lazily based on the active config so a mode that only
 * needs the face mesh never pays for the pose model download or GPU cost.
 */
export class VisionEngine {
  private fileset: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null = null;
  private face: FaceLandmarker | null = null;
  private pose: PoseLandmarker | null = null;
  private hand: HandLandmarker | null = null;
  private segmenter: ImageSegmenter | null = null;

  private config: VisionConfig = { ...DEFAULT_VISION_CONFIG };
  private initializing: Promise<void> | null = null;

  /** Monotonic guard: MediaPipe video mode rejects non-increasing timestamps. */
  private lastTimestamp = -1;

  get activeConfig(): VisionConfig {
    return this.config;
  }

  /** (Re)configure which detectors are active. Safe to call repeatedly. */
  async configure(partial: Partial<VisionConfig>): Promise<void> {
    this.config = { ...this.config, ...partial };
    await this.ensure();
  }

  private async getFileset() {
    if (!this.fileset) {
      const base = await resolveWasmBase();
      this.fileset = await FilesetResolver.forVisionTasks(base);
    }
    return this.fileset;
  }

  /** Build/tear-down detectors to match the current config. */
  private async ensure(): Promise<void> {
    if (this.initializing) await this.initializing;
    this.initializing = this.build();
    await this.initializing;
    this.initializing = null;
  }

  private async build(): Promise<void> {
    const fileset = await this.getFileset();
    const { delegate } = this.config;
    const baseTasks: Promise<unknown>[] = [];

    if (this.config.face && !this.face) {
      baseTasks.push(
        FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODELS.face, delegate },
          runningMode: "VIDEO",
          numFaces: this.config.maxFaces,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true
        }).then((d) => (this.face = d))
      );
    } else if (!this.config.face && this.face) {
      this.face.close();
      this.face = null;
    }

    if (this.config.pose && !this.pose) {
      baseTasks.push(
        PoseLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODELS.pose, delegate },
          runningMode: "VIDEO",
          numPoses: this.config.maxPoses,
          minPoseDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        }).then((d) => (this.pose = d))
      );
    } else if (!this.config.pose && this.pose) {
      this.pose.close();
      this.pose = null;
    }

    if (this.config.hand && !this.hand) {
      baseTasks.push(
        HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODELS.hand, delegate },
          runningMode: "VIDEO",
          numHands: this.config.maxHands
        }).then((d) => (this.hand = d))
      );
    } else if (!this.config.hand && this.hand) {
      this.hand.close();
      this.hand = null;
    }

    if (this.config.segmentation && !this.segmenter) {
      baseTasks.push(
        ImageSegmenter.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODELS.segmenter, delegate },
          runningMode: "VIDEO",
          outputCategoryMask: false,
          outputConfidenceMasks: true
        }).then((d) => (this.segmenter = d))
      );
    } else if (!this.config.segmentation && this.segmenter) {
      this.segmenter.close();
      this.segmenter = null;
    }

    await Promise.all(baseTasks);
  }

  /** True once every detector required by the config is ready. */
  get ready(): boolean {
    if (this.config.face && !this.face) return false;
    if (this.config.pose && !this.pose) return false;
    if (this.config.hand && !this.hand) return false;
    if (this.config.segmentation && !this.segmenter) return false;
    return true;
  }

  /**
   * Run all active detectors on a single video frame.
   * `timestampMs` must strictly increase across calls.
   */
  detect(video: HTMLVideoElement, timestampMs: number): VisionResult {
    // Guarantee strictly-increasing timestamps even if the caller passes equal values.
    const ts = timestampMs <= this.lastTimestamp ? this.lastTimestamp + 1 : timestampMs;
    this.lastTimestamp = ts;

    const result: VisionResult = { timestampMs: ts };

    if (this.face) {
      const r = this.face.detectForVideo(video, ts);
      const face: FaceResult = {
        faces: (r.faceLandmarks ?? []).map(toLandmarks),
        transforms: (r.facialTransformationMatrixes ?? []).map((m) => Array.from(m.data))
      };
      result.face = face;
    }

    if (this.pose) {
      const r = this.pose.detectForVideo(video, ts);
      const pose: PoseResult = { poses: (r.landmarks ?? []).map(toLandmarks) };
      result.pose = pose;
    }

    if (this.hand) {
      const r = this.hand.detectForVideo(video, ts);
      const hand: HandResult = {
        hands: (r.landmarks ?? []).map(toLandmarks),
        handedness: (r.handedness ?? []).map((h) => h[0]?.categoryName ?? "Unknown")
      };
      result.hand = hand;
    }

    if (this.segmenter) {
      const r = this.segmenter.segmentForVideo(video, ts);
      const mask = r.confidenceMasks?.[0];
      if (mask) {
        const data = mask.getAsFloat32Array();
        // Copy out before close(): the underlying buffer is reused by MediaPipe.
        result.segmentation = {
          data: new Float32Array(data),
          width: mask.width,
          height: mask.height
        };
      }
      r.close();
    }

    return result;
  }

  /** Release all GPU/wasm resources. */
  dispose(): void {
    this.face?.close();
    this.pose?.close();
    this.hand?.close();
    this.segmenter?.close();
    this.face = this.pose = this.hand = this.segmenter = null;
    this.lastTimestamp = -1;
  }
}
