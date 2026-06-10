/**
 * Shared vision types. We keep our own lightweight landmark shape so the rest
 * of the app never imports MediaPipe types directly — makes the engine swappable.
 */

export interface Landmark {
  x: number; // normalized [0,1] in image space (x grows right)
  y: number; // normalized [0,1] in image space (y grows down)
  z: number; // relative depth, smaller = closer to camera
  visibility?: number;
}

/** A 4x4 column-major transform as returned by the face landmarker. */
export type Matrix4 = number[];

export interface FaceResult {
  /** One entry per detected face; each is the dense 478-point mesh. */
  faces: Landmark[][];
  /** Optional 4x4 head pose transforms (one per face). */
  transforms: Matrix4[];
}

export interface PoseResult {
  /** One entry per detected person; each is the 33-point body skeleton. */
  poses: Landmark[][];
}

export interface HandResult {
  /** One entry per detected hand; each is the 21-point hand skeleton. */
  hands: Landmark[][];
  /** "Left" | "Right" per hand, mirrored to match the on-screen image. */
  handedness: string[];
}

export interface VisionResult {
  face?: FaceResult;
  pose?: PoseResult;
  hand?: HandResult;
  /**
   * Person/background segmentation mask, 1 channel, values [0,1] where
   * 1 = foreground (person). Width/height match maskWidth/maskHeight.
   */
  segmentation?: {
    data: Float32Array;
    width: number;
    height: number;
  };
  timestampMs: number;
}

export interface VisionConfig {
  face: boolean;
  pose: boolean;
  hand: boolean;
  segmentation: boolean;
  /** GPU is dramatically faster; CPU is the safe fallback. */
  delegate: "GPU" | "CPU";
  maxFaces: number;
  maxPoses: number;
  maxHands: number;
}

export const DEFAULT_VISION_CONFIG: VisionConfig = {
  face: true,
  pose: true,
  hand: false,
  segmentation: false,
  delegate: "GPU",
  maxFaces: 1,
  maxPoses: 1,
  maxHands: 2
};
