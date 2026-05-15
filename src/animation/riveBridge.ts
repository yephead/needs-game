type RiveBridge = {
  resize: (width: number, height: number, dpr: number) => void;
  setLevel: (levelIndex: number, progress: number) => void;
  pulse: (levelIndex: number) => void;
  transcend: () => void;
  drawFallback: (time: number, palette: { primary: string; secondary: string }) => void;
  destroy: () => void;
};

export function createRiveBridge(canvas: HTMLCanvasElement | null): RiveBridge {
  const ctx = canvas?.getContext("2d", { alpha: true }) ?? null;
  let rive: any = null;
  let loaded = false;
  let fallbackPulse = 0;
  let currentLevel = 0;
  let currentProgress = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;

  const init = async () => {
    if (!canvas) return;
    const asset = await fetch("/needs-symbols.riv", { method: "HEAD", cache: "no-store" }).catch(() => null);
    const contentType = asset?.headers.get("content-type") || "";
    if (!asset?.ok || contentType.includes("text/html")) return;
    const { Alignment, Fit, Layout, Rive } = await import("@rive-app/canvas");
    rive = new Rive({
      canvas,
      src: "/needs-symbols.riv",
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      enableRiveAssetCDN: false,
      shouldDisableRiveListeners: true,
      onLoad: () => {
        loaded = true;
      },
      onLoadError: () => {
        loaded = false;
      }
    });
  };

  void init();

  const resize = (nextWidth: number, nextHeight: number, nextDpr: number) => {
    if (!canvas) return;
    width = Math.max(1, nextWidth);
    height = Math.max(1, nextHeight);
    dpr = Math.min(2, nextDpr || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    rive?.resizeDrawingSurfaceToCanvas();
  };

  const setLevel = (levelIndex: number, progress: number) => {
    currentLevel = levelIndex;
    currentProgress = progress;
  };

  const pulse = (levelIndex: number) => {
    currentLevel = levelIndex;
    fallbackPulse = 1;
    if (loaded) rive?.play();
  };

  const transcend = () => {
    fallbackPulse = 1.8;
    if (loaded) rive?.play();
  };

  const drawFallback = (time: number, palette: { primary: string; secondary: string }) => {
    if (!ctx || loaded) return;
    ctx.clearRect(0, 0, width, height);
    fallbackPulse = Math.max(0, fallbackPulse - 0.018);
    const cx = width * 0.5;
    const cy = height * 0.52;
    const base = 42 + currentLevel * 8 + currentProgress * 70;
    const sides = 3 + (currentLevel % 5);
    const spin = time * 0.00024 * (currentLevel % 2 ? -1 : 1);
    ctx.save();
    ctx.globalAlpha = 0.2 + Math.min(0.38, fallbackPulse * 0.28);
    ctx.translate(cx, cy);
    ctx.rotate(spin);
    drawSymbol(ctx, sides, base + fallbackPulse * 44, palette.primary);
    ctx.rotate(-spin * 1.8);
    ctx.globalAlpha = 0.12 + currentProgress * 0.12;
    drawSymbol(ctx, sides + 2, base * 1.75 + fallbackPulse * 70, palette.secondary);
    ctx.restore();
  };

  const destroy = () => {
    rive?.cleanup();
    rive = null;
  };

  return { resize, setLevel, pulse, transcend, drawFallback, destroy };
}

function drawSymbol(ctx: CanvasRenderingContext2D, sides: number, radius: number, color: string) {
  ctx.beginPath();
  for (let i = 0; i < sides; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / sides;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.stroke();
}
