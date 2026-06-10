import type { Landmark } from "./types";

/**
 * Named landmark indices. These come from the MediaPipe model cards:
 *  - Face Mesh: 478 points (canonical face model)
 *  - Pose: 33 points (BlazePose topology)
 *  - Hand: 21 points
 */
export const FACE = {
  noseTip: 1,
  betweenEyes: 168,
  foreheadTop: 10,
  chin: 152,
  leftEyeOuter: 33, // subject's right eye, image-left
  leftEyeInner: 133,
  rightEyeOuter: 263, // subject's left eye, image-right
  rightEyeInner: 362,
  leftTemple: 234,
  rightTemple: 454,
  leftEarTop: 127,
  rightEarTop: 356,
  upperLip: 13,
  lowerLip: 14
} as const;

export const POSE = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
  leftHeel: 29,
  rightHeel: 30,
  leftFootIndex: 31,
  rightFootIndex: 32
} as const;

export const HAND = {
  wrist: 0,
  indexMcp: 5,
  middleMcp: 9,
  pinkyMcp: 17,
  middleTip: 12
} as const;

export interface Vec2 {
  x: number;
  y: number;
}

/** Convert a normalized landmark into pixel coordinates for a given canvas size. */
export function toPixel(l: Landmark, width: number, height: number): Vec2 {
  return { x: l.x * width, y: l.y * height };
}

export function midpoint(a: Vec2, b: Vec2): Vec2 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function distance(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Angle in radians of the vector a→b, measured from the +x axis. */
export function angle(a: Vec2, b: Vec2): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpVec(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

/** Average visibility of a set of landmarks (0 when missing). */
export function avgVisibility(landmarks: Landmark[], indices: number[]): number {
  let sum = 0;
  let n = 0;
  for (const i of indices) {
    const v = landmarks[i]?.visibility;
    if (typeof v === "number") {
      sum += v;
      n++;
    }
  }
  return n ? sum / n : 1; // face mesh has no visibility -> treat as fully visible
}
