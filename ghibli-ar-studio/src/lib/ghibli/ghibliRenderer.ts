import {
  createGL,
  createProgram,
  createFullscreenTriangle,
  createRenderTarget,
  resizeRenderTarget,
  createVideoTexture,
  type RenderTarget
} from "./glUtils";
import { VERT, FRAG_BILATERAL, FRAG_CEL } from "./shaders";

export interface GhibliParams {
  /** Posterize bands; lower = chunkier watercolor. */
  levels: number;
  /** Ink outline strength 0..1. */
  edge: number;
  /** Color saturation multiplier. */
  saturation: number;
  /** Warm/cool grade, -1..1 (positive = warm Ghibli daylight). */
  warmth: number;
  /** Blend with original, 0 = raw camera, 1 = full stylization. */
  intensity: number;
  /** Paper grain amount 0..1. */
  paper: number;
  /** Bilateral spatial radius in pixels (1..4). */
  smoothRadius: number;
  /** Bilateral range sigma (color similarity). */
  sigmaColor: number;
}

export const DEFAULT_GHIBLI_PARAMS: GhibliParams = {
  levels: 7,
  edge: 0.7,
  saturation: 1.18,
  warmth: 0.55,
  intensity: 0.9,
  paper: 0.4,
  smoothRadius: 3,
  sigmaColor: 0.18
};

export type GhibliSource = HTMLVideoElement | HTMLCanvasElement | ImageBitmap;

interface BilateralUniforms {
  uTex: WebGLUniformLocation | null;
  uTexel: WebGLUniformLocation | null;
  uRadius: WebGLUniformLocation | null;
  uSigmaColor: WebGLUniformLocation | null;
  uFlipY: WebGLUniformLocation | null;
  uMirror: WebGLUniformLocation | null;
}

interface CelUniforms {
  uSmooth: WebGLUniformLocation | null;
  uOriginal: WebGLUniformLocation | null;
  uTexel: WebGLUniformLocation | null;
  uLevels: WebGLUniformLocation | null;
  uEdge: WebGLUniformLocation | null;
  uSaturation: WebGLUniformLocation | null;
  uWarmth: WebGLUniformLocation | null;
  uIntensity: WebGLUniformLocation | null;
  uPaper: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uFlipY: WebGLUniformLocation | null;
  uMirror: WebGLUniformLocation | null;
}

/**
 * Two-pass WebGL2 stylizer. Pass 1 smooths into a framebuffer, pass 2 applies
 * cel-shading + ink + grade straight to the visible canvas. Designed to run
 * every animation frame on top of live video.
 */
export class GhibliRenderer {
  readonly canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject;

  private bilateralProgram: WebGLProgram;
  private celProgram: WebGLProgram;
  private bu: BilateralUniforms;
  private cu: CelUniforms;

  private videoTexture: WebGLTexture;
  private smoothTarget: RenderTarget;

  private startTime = performance.now();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = createGL(canvas);
    const gl = this.gl;

    this.vao = createFullscreenTriangle(gl);
    this.bilateralProgram = createProgram(gl, VERT, FRAG_BILATERAL);
    this.celProgram = createProgram(gl, VERT, FRAG_CEL);

    this.bu = {
      uTex: gl.getUniformLocation(this.bilateralProgram, "uTex"),
      uTexel: gl.getUniformLocation(this.bilateralProgram, "uTexel"),
      uRadius: gl.getUniformLocation(this.bilateralProgram, "uRadius"),
      uSigmaColor: gl.getUniformLocation(this.bilateralProgram, "uSigmaColor"),
      uFlipY: gl.getUniformLocation(this.bilateralProgram, "uFlipY"),
      uMirror: gl.getUniformLocation(this.bilateralProgram, "uMirror")
    };
    this.cu = {
      uSmooth: gl.getUniformLocation(this.celProgram, "uSmooth"),
      uOriginal: gl.getUniformLocation(this.celProgram, "uOriginal"),
      uTexel: gl.getUniformLocation(this.celProgram, "uTexel"),
      uLevels: gl.getUniformLocation(this.celProgram, "uLevels"),
      uEdge: gl.getUniformLocation(this.celProgram, "uEdge"),
      uSaturation: gl.getUniformLocation(this.celProgram, "uSaturation"),
      uWarmth: gl.getUniformLocation(this.celProgram, "uWarmth"),
      uIntensity: gl.getUniformLocation(this.celProgram, "uIntensity"),
      uPaper: gl.getUniformLocation(this.celProgram, "uPaper"),
      uTime: gl.getUniformLocation(this.celProgram, "uTime"),
      uFlipY: gl.getUniformLocation(this.celProgram, "uFlipY"),
      uMirror: gl.getUniformLocation(this.celProgram, "uMirror")
    };

    this.videoTexture = createVideoTexture(gl);
    this.smoothTarget = createRenderTarget(gl, 16, 16);
  }

  private sizeTo(width: number, height: number): void {
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    resizeRenderTarget(this.gl, this.smoothTarget, width, height);
  }

  /**
   * Render one stylized frame.
   * @param mirror  horizontally mirror (selfie front camera)
   * @param flipY   flip vertically (video textures are top-left origin)
   */
  render(
    source: GhibliSource,
    width: number,
    height: number,
    params: GhibliParams,
    mirror = true,
    flipY = true
  ): void {
    if (width <= 0 || height <= 0) return;
    const gl = this.gl;
    this.sizeTo(width, height);

    // Upload source frame.
    gl.bindTexture(gl.TEXTURE_2D, this.videoTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source as TexImageSource);

    const texel = [1 / width, 1 / height] as const;
    gl.bindVertexArray(this.vao);

    // ---- Pass 1: bilateral smoothing into the FBO (source orientation) ----
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.smoothTarget.framebuffer);
    gl.viewport(0, 0, width, height);
    gl.useProgram(this.bilateralProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.videoTexture);
    gl.uniform1i(this.bu.uTex, 0);
    gl.uniform2f(this.bu.uTexel, texel[0], texel[1]);
    gl.uniform1f(this.bu.uRadius, params.smoothRadius);
    gl.uniform1f(this.bu.uSigmaColor, params.sigmaColor);
    gl.uniform1i(this.bu.uFlipY, 0);
    gl.uniform1i(this.bu.uMirror, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---- Pass 2: cel + ink + grade to the screen (apply flip/mirror here) ----
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.useProgram(this.celProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.smoothTarget.texture);
    gl.uniform1i(this.cu.uSmooth, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.videoTexture);
    gl.uniform1i(this.cu.uOriginal, 1);
    gl.uniform2f(this.cu.uTexel, texel[0], texel[1]);
    gl.uniform1f(this.cu.uLevels, params.levels);
    gl.uniform1f(this.cu.uEdge, params.edge);
    gl.uniform1f(this.cu.uSaturation, params.saturation);
    gl.uniform1f(this.cu.uWarmth, params.warmth);
    gl.uniform1f(this.cu.uIntensity, params.intensity);
    gl.uniform1f(this.cu.uPaper, params.paper);
    gl.uniform1f(this.cu.uTime, (performance.now() - this.startTime) * 0.001);
    gl.uniform1i(this.cu.uFlipY, flipY ? 1 : 0);
    gl.uniform1i(this.cu.uMirror, mirror ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindVertexArray(null);
  }

  dispose(): void {
    const gl = this.gl;
    gl.deleteProgram(this.bilateralProgram);
    gl.deleteProgram(this.celProgram);
    gl.deleteTexture(this.videoTexture);
    gl.deleteTexture(this.smoothTarget.texture);
    gl.deleteFramebuffer(this.smoothTarget.framebuffer);
    gl.deleteVertexArray(this.vao);
  }
}
