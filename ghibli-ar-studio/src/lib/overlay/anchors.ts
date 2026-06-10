import type { VisionResult, Landmark } from "../vision/types";
import { FACE, POSE, distance, angle, midpoint, type Vec2 } from "../vision/landmarks";
import type { Product, Placement } from "./types";

/**
 * Resolve a product into 0..n on-screen placements from the latest vision frame.
 *
 * Landmarks are normalized in *image* space. When the view is mirrored (front
 * camera selfie), we mirror x and negate rotation so overlays track the flipped
 * preview the user actually sees.
 */
export function computePlacements(
  product: Product,
  vision: VisionResult,
  width: number,
  height: number,
  mirror: boolean
): Placement[] {
  const pix = (l: Landmark | undefined): Vec2 | null => {
    if (!l) return null;
    const x = mirror ? 1 - l.x : l.x;
    return { x: x * width, y: l.y * height };
  };
  const mr = mirror ? -1 : 1;

  switch (product.anchor) {
    case "eyewear":
      return eyewear(product, vision, pix, mr);
    case "headwear":
      return headwear(product, vision, pix, mr);
    case "footwear-pair":
      return footwear(product, vision, pix);
    case "bag":
      return bag(product, vision, pix);
    case "watch":
      return watch(product, vision, pix, mr);
    case "necklace":
      return necklace(product, vision, pix, mr);
    default:
      return [];
  }
}

type Pixer = (l: Landmark | undefined) => Vec2 | null;

function face0(vision: VisionResult): Landmark[] | null {
  return vision.face?.faces[0] ?? null;
}
function pose0(vision: VisionResult): Landmark[] | null {
  return vision.pose?.poses[0] ?? null;
}

function eyewear(product: Product, vision: VisionResult, pix: Pixer, mr: number): Placement[] {
  const f = face0(vision);
  if (!f) return [];
  const l = pix(f[FACE.leftEyeOuter]);
  const r = pix(f[FACE.rightEyeOuter]);
  if (!l || !r) return [];
  const center = midpoint(l, r);
  const eyeDist = distance(l, r);
  const w = eyeDist * product.scale;
  const h = w * product.aspect;
  const rot = mr * angle(l, r);
  return [
    {
      cx: center.x + product.offset.x * w,
      cy: center.y + product.offset.y * h,
      width: w,
      height: h,
      rotation: rot
    }
  ];
}

function headwear(product: Product, vision: VisionResult, pix: Pixer, mr: number): Placement[] {
  const f = face0(vision);
  if (!f) return [];
  const lt = pix(f[FACE.leftTemple]);
  const rt = pix(f[FACE.rightTemple]);
  const top = pix(f[FACE.foreheadTop]);
  if (!lt || !rt || !top) return [];
  const templeDist = distance(lt, rt);
  const w = templeDist * product.scale;
  const h = w * product.aspect;
  const rot = mr * angle(lt, rt);
  // place above the forehead along the head's "up" direction
  return [
    {
      cx: top.x + product.offset.x * w,
      cy: top.y + product.offset.y * h,
      width: w,
      height: h,
      rotation: rot
    }
  ];
}

function footwear(product: Product, vision: VisionResult, pix: Pixer): Placement[] {
  const p = pose0(vision);
  if (!p) return [];
  const out: Placement[] = [];
  const feet: [number, number, number][] = [
    [POSE.leftHeel, POSE.leftFootIndex, POSE.leftAnkle],
    [POSE.rightHeel, POSE.rightFootIndex, POSE.rightAnkle]
  ];
  for (const [heelIdx, toeIdx, ankleIdx] of feet) {
    const ankle = p[ankleIdx];
    if ((ankle?.visibility ?? 0) < 0.35) continue;
    const heel = pix(p[heelIdx]);
    const toe = pix(p[toeIdx]);
    if (!heel || !toe) continue;
    const footLen = distance(heel, toe);
    if (footLen < 4) continue;
    const w = footLen * product.scale;
    const h = w * product.aspect;
    const center = midpoint(heel, toe);
    const rot = angle(heel, toe); // points from heel toward toes
    out.push({
      cx: center.x + product.offset.x * w,
      cy: center.y + product.offset.y * h,
      width: w,
      height: h,
      rotation: rot
    });
  }
  return out;
}

function bag(product: Product, vision: VisionResult, pix: Pixer): Placement[] {
  const p = pose0(vision);
  if (!p) return [];
  // Hang from whichever wrist is more visible.
  const right = (p[POSE.rightWrist]?.visibility ?? 0) >= (p[POSE.leftWrist]?.visibility ?? 0);
  const wristIdx = right ? POSE.rightWrist : POSE.leftWrist;
  const elbowIdx = right ? POSE.rightElbow : POSE.leftElbow;
  const wrist = pix(p[wristIdx]);
  const elbow = pix(p[elbowIdx]);
  if (!wrist || !elbow || (p[wristIdx]?.visibility ?? 0) < 0.35) return [];
  const forearm = distance(elbow, wrist);
  const w = Math.max(forearm * product.scale, 40);
  const h = w * product.aspect;
  return [
    {
      cx: wrist.x + product.offset.x * w,
      cy: wrist.y + product.offset.y * h, // hangs below the wrist
      width: w,
      height: h,
      rotation: 0 // bags hang with gravity
    }
  ];
}

function watch(product: Product, vision: VisionResult, pix: Pixer, mr: number): Placement[] {
  const p = pose0(vision);
  if (!p) return [];
  const right = (p[POSE.rightWrist]?.visibility ?? 0) >= (p[POSE.leftWrist]?.visibility ?? 0);
  const wristIdx = right ? POSE.rightWrist : POSE.leftWrist;
  const elbowIdx = right ? POSE.rightElbow : POSE.leftElbow;
  const wrist = pix(p[wristIdx]);
  const elbow = pix(p[elbowIdx]);
  if (!wrist || !elbow || (p[wristIdx]?.visibility ?? 0) < 0.35) return [];
  const forearm = distance(elbow, wrist);
  const w = forearm * 0.3 * product.scale;
  const h = w * product.aspect;
  // sit slightly up the forearm from the wrist
  const t = 0.12;
  const center = { x: wrist.x + (elbow.x - wrist.x) * t, y: wrist.y + (elbow.y - wrist.y) * t };
  return [
    {
      cx: center.x,
      cy: center.y,
      width: w,
      height: h,
      rotation: mr * angle(elbow, wrist) + Math.PI / 2
    }
  ];
}

function necklace(product: Product, vision: VisionResult, pix: Pixer, mr: number): Placement[] {
  const p = pose0(vision);
  if (!p) return [];
  const ls = pix(p[POSE.leftShoulder]);
  const rs = pix(p[POSE.rightShoulder]);
  if (!ls || !rs) return [];
  const shoulderDist = distance(ls, rs);
  const center = midpoint(ls, rs);
  const w = shoulderDist * product.scale;
  const h = w * product.aspect;
  return [
    {
      cx: center.x + product.offset.x * w,
      cy: center.y + product.offset.y * h,
      width: w,
      height: h,
      rotation: mr * angle(ls, rs)
    }
  ];
}
