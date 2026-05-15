export type ChoreographySnapshot = {
  active: boolean;
  surge: number;
  fold: number;
  flash: number;
  zoom: number;
  rotate: number;
  cameraX: number;
  cameraY: number;
  aura: number;
  prism: number;
};

type ChoreographyKind = "level" | "transcend";

const EMPTY: ChoreographySnapshot = {
  active: false,
  surge: 0,
  fold: 0,
  flash: 0,
  zoom: 1,
  rotate: 0,
  cameraX: 0,
  cameraY: 0,
  aura: 0,
  prism: 0
};

export function createTheatreDirector(options: { reduceMotion: boolean }) {
  const snapshot = { ...EMPTY };
  let rafDriver: any = null;
  let sheet: any = null;
  let camera: any = null;

  let startedAt = 0;
  let duration = 1;
  let kind: ChoreographyKind = "level";
  let tierIndex = 0;

  const init = async () => {
    const theatreModule = await import("@theatre/core");
    const { createRafDriver, getProject } = theatreModule.default ?? theatreModule;
    rafDriver = createRafDriver({ name: "needs-game-main-loop" });
    const project = getProject("NEEDS level choreography", {
      state: {
        definitionVersion: "0.4.0",
        revisionHistory: ["runtime-choreography"],
        sheetsById: {}
      }
    });
    sheet = project.sheet("Maslow ascents");
    camera = sheet.object("Camera and pyramid", {
      surge: 0,
      fold: 0,
      flash: 0,
      zoom: 1,
      rotate: 0,
      cameraX: 0,
      cameraY: 0,
      aura: 0,
      prism: 0
    });
    camera.onValuesChange((values: Omit<ChoreographySnapshot, "active">) => {
      snapshot.surge = values.surge;
      snapshot.fold = values.fold;
      snapshot.flash = values.flash;
      snapshot.zoom = values.zoom;
      snapshot.rotate = values.rotate;
      snapshot.cameraX = values.cameraX;
      snapshot.cameraY = values.cameraY;
      snapshot.aura = values.aura;
      snapshot.prism = values.prism;
    }, rafDriver);
  };

  void init();

  const trigger = (nextKind: ChoreographyKind, nextTier: number) => {
    if (options.reduceMotion) return;
    kind = nextKind;
    tierIndex = nextTier;
    startedAt = performance.now();
    duration = nextKind === "transcend" ? 1.86 : 1.14;
    snapshot.active = true;
    if (sheet && rafDriver) {
      sheet.sequence.position = 0;
      void sheet.sequence.play({ range: [0, duration], rafDriver, rate: 1 }).catch(() => undefined);
    }
  };

  const update = (time: number) => {
    if (!snapshot.active) return snapshot;
    const elapsed = (time - startedAt) / 1000;
    const t = Math.min(1, Math.max(0, elapsed / duration));
    const pulse = kind === "transcend" ? transcendCurve(t, tierIndex) : levelCurve(t, tierIndex);
    if (sheet && camera) {
      sheet.sequence.position = t * duration;
      camera.initialValue = pulse;
    }
    Object.assign(snapshot, pulse, { active: t < 1 });
    if (t >= 1) Object.assign(snapshot, EMPTY);
    rafDriver?.tick(time);
    return snapshot;
  };

  return {
    snapshot,
    levelUp: (_levelKey: string, index: number) => trigger("level", index),
    transcend: () => trigger("transcend", 6),
    update
  };
}

function levelCurve(t: number, tierIndex: number): Omit<ChoreographySnapshot, "active"> {
  const easeOut = 1 - Math.pow(1 - t, 3);
  const snap = Math.sin(Math.PI * Math.min(1, t * 1.35));
  const afterglow = Math.max(0, 1 - t);
  const direction = tierIndex % 2 ? -1 : 1;
  return {
    surge: snap,
    fold: easeOut,
    flash: Math.max(0, 1 - t * 1.6),
    zoom: 1 + snap * (0.035 + tierIndex * 0.004),
    rotate: direction * snap * (0.006 + tierIndex * 0.001),
    cameraX: direction * snap * (10 + tierIndex * 2),
    cameraY: -snap * (8 + tierIndex * 3),
    aura: afterglow * afterglow,
    prism: Math.sin(t * Math.PI * 3) * afterglow
  };
}

function transcendCurve(t: number, tierIndex: number): Omit<ChoreographySnapshot, "active"> {
  const open = Math.sin(Math.PI * t);
  const lift = 1 - Math.pow(1 - t, 4);
  return {
    surge: open,
    fold: lift,
    flash: Math.max(0, 1 - t * 0.85),
    zoom: 1 + open * 0.082,
    rotate: Math.sin(t * Math.PI * 4) * 0.012,
    cameraX: Math.sin(t * Math.PI * 2) * (8 + tierIndex),
    cameraY: -lift * 28,
    aura: Math.max(0, 1 - t * 0.42),
    prism: Math.sin(t * Math.PI * 7) * (1 - t)
  };
}
