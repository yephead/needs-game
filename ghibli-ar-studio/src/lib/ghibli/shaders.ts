/**
 * GLSL sources for the Ghibli stylization pipeline.
 *
 * Pass 1 (bilateral): edge-preserving smoothing that flattens skin/sky into
 *   broad painterly regions while keeping silhouettes crisp.
 * Pass 2 (cel + ink + grade): posterizes color into watercolor bands, overlays
 *   Sobel ink outlines, and applies a warm Ghibli color grade. Optionally blends
 *   a paper-grain and softens with the original for the final look.
 */

export const VERT = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aPos;
out vec2 vUv;
uniform bool uFlipY;   // video texture is top-left origin; flip for canvas
uniform bool uMirror;  // mirror selfie horizontally
void main() {
  vec2 uv = aPos * 0.5 + 0.5;
  if (uFlipY) uv.y = 1.0 - uv.y;
  if (uMirror) uv.x = 1.0 - uv.x;
  vUv = uv;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

export const FRAG_BILATERAL = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTex;
uniform vec2 uTexel;       // 1.0 / resolution
uniform float uRadius;     // spatial radius in pixels
uniform float uSigmaColor; // range sigma (color similarity)

void main() {
  vec3 center = texture(uTex, vUv).rgb;
  vec3 sum = vec3(0.0);
  float wsum = 0.0;
  float sigmaSpace = max(uRadius * 0.5, 1.0);
  float r = uRadius;
  for (float x = -4.0; x <= 4.0; x += 1.0) {
    for (float y = -4.0; y <= 4.0; y += 1.0) {
      if (abs(x) > r || abs(y) > r) continue;
      vec2 offset = vec2(x, y) * uTexel;
      vec3 s = texture(uTex, vUv + offset).rgb;
      float ds = (x * x + y * y) / (2.0 * sigmaSpace * sigmaSpace);
      vec3 dc = s - center;
      float dr = dot(dc, dc) / (2.0 * uSigmaColor * uSigmaColor);
      float w = exp(-ds - dr);
      sum += s * w;
      wsum += w;
    }
  }
  fragColor = vec4(sum / max(wsum, 1e-4), 1.0);
}`;

export const FRAG_CEL = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uSmooth;   // bilateral output
uniform sampler2D uOriginal; // raw source (for intensity blend)
uniform vec2 uTexel;

uniform float uLevels;      // posterize bands
uniform float uEdge;        // ink strength 0..1
uniform float uSaturation;  // color saturation multiplier
uniform float uWarmth;      // warm/cool grade -1..1
uniform float uIntensity;   // blend with original 0..1
uniform float uPaper;       // paper grain amount 0..1
uniform float uTime;        // for subtle grain animation

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Sobel edge magnitude on luminance of the smoothed image.
float sobel() {
  float tl = luma(texture(uSmooth, vUv + uTexel * vec2(-1.0, -1.0)).rgb);
  float tc = luma(texture(uSmooth, vUv + uTexel * vec2( 0.0, -1.0)).rgb);
  float tr = luma(texture(uSmooth, vUv + uTexel * vec2( 1.0, -1.0)).rgb);
  float ml = luma(texture(uSmooth, vUv + uTexel * vec2(-1.0,  0.0)).rgb);
  float mr = luma(texture(uSmooth, vUv + uTexel * vec2( 1.0,  0.0)).rgb);
  float bl = luma(texture(uSmooth, vUv + uTexel * vec2(-1.0,  1.0)).rgb);
  float bc = luma(texture(uSmooth, vUv + uTexel * vec2( 0.0,  1.0)).rgb);
  float br = luma(texture(uSmooth, vUv + uTexel * vec2( 1.0,  1.0)).rgb);
  float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
  float gy = -tl - 2.0 * tc - tr + bl + 2.0 * bc + br;
  return sqrt(gx * gx + gy * gy);
}

vec3 saturate3(vec3 c, float amt) {
  float l = luma(c);
  return clamp(mix(vec3(l), c, amt), 0.0, 1.0);
}

// Cheap hash-based grain.
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec3 smooth = texture(uSmooth, vUv).rgb;

  // 1. Posterize into watercolor bands.
  float levels = max(uLevels, 2.0);
  vec3 posterized = floor(smooth * levels + 0.5) / levels;

  // 2. Ghibli grade: lift midtones, warm highlights, cool/teal shadows.
  vec3 col = posterized;
  col = saturate3(col, uSaturation);
  // soft S-curve contrast
  col = col * col * (3.0 - 2.0 * col);
  // warmth: push R up / B down in highlights, opposite in shadows
  float l = luma(col);
  vec3 warm = vec3(0.06, 0.01, -0.05) * uWarmth;
  vec3 cool = vec3(-0.03, 0.0, 0.05) * uWarmth;
  col += mix(cool, warm, smoothstep(0.2, 0.8, l));
  // signature soft green/teal lift in midtones (foliage/sky feel)
  col.g += 0.03 * (1.0 - abs(l - 0.5) * 2.0) * max(uWarmth, 0.0);
  col = clamp(col, 0.0, 1.0);

  // 3. Ink outlines from Sobel.
  float e = clamp(sobel() * 4.0, 0.0, 1.0);
  e = smoothstep(0.25, 0.6, e) * uEdge;
  vec3 ink = vec3(0.08, 0.07, 0.10);
  col = mix(col, ink, e);

  // 4. Paper grain.
  float g = (hash(vUv * vec2(1280.0, 720.0) + uTime) - 0.5);
  col += g * 0.04 * uPaper;

  // 5. Blend toward original by (1 - intensity) so the slider is meaningful.
  vec3 original = texture(uOriginal, vUv).rgb;
  col = mix(original, col, clamp(uIntensity, 0.0, 1.0));

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;
