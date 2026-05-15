// @ts-nocheck
import { createRiveBridge } from "./animation/riveBridge";
import { createSoundEngine } from "./audio/soundEngine";
import { createTheatreDirector } from "./motion/theatreDirector";
import { createPixiLayer } from "./render/pixiLayer";

export function mountNeedsGame() {

const SVG = {
        play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z"/></svg>',
        restart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v6h-6"/></svg>',
        soundOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9Z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19 6a9 9 0 0 1 0 12"/></svg>',
        soundOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9Z"/><path d="m19 9-6 6"/><path d="m13 9 6 6"/></svg>',
        camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8l2 3h2v8H4v-8h2Z"/><circle cx="12" cy="14" r="3"/><path d="M9 4h6"/></svg>',
        cameraActive: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8l2 3h2v8H4v-8h2Z"/><circle cx="12" cy="14" r="3"/><path d="M9 4h6"/><circle cx="18.7" cy="5.2" r="1.6" fill="currentColor" stroke="none"/></svg>',
        intro: '<svg viewBox="0 0 24 24"><path d="M12 3c4 4 4 14 0 18C8 17 8 7 12 3Z"/><path d="M12 8v8"/></svg>',
        body: '<svg viewBox="0 0 24 24"><path d="M12 3c4 5 6 8 6 12a6 6 0 0 1-12 0c0-4 2-7 6-12Z"/></svg>',
        safety: '<svg viewBox="0 0 24 24"><path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7Z"/></svg>',
        love: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"/></svg>',
        esteem: '<svg viewBox="0 0 24 24"><path d="M12 3 15 9l6 .8-4.5 4.2 1.2 6-5.7-3.1L6.3 20l1.2-6L3 9.8 9 9Z"/></svg>',
        actual: '<svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M5 10c5 0 7-2 7-7 0 5 2 7 7 7-5 0-7 2-7 7 0-5-2-7-7-7Z"/></svg>',
        beyond: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>'
      };

      const LEVELS = [
        {
          key: "intro",
          name: "Intro",
          full: "Intro",
          hint: "pulse",
          verb: "Breathe",
          gestureCue: "open / close",
          successMotif: [196, 294, 392],
          failureMotif: [116, 92],
          completionMoment: "first breath opens",
          color: "#7dd7c7",
          color2: "#e7f6ea",
          icon: SVG.intro
        },
        {
          key: "body",
          name: "Body",
          full: "Physiological",
          hint: "chain",
          verb: "Gather",
          gestureCue: "open hand over needs",
          successMotif: [246, 311, 392],
          failureMotif: [122, 104],
          completionMoment: "needs bloom into a chain",
          color: "#5ec6d6",
          color2: "#f4bd61",
          icon: SVG.body
        },
        {
          key: "safety",
          name: "Shelter",
          full: "Safety",
          hint: "seal",
          verb: "Seal",
          gestureCue: "palm shield",
          successMotif: [330, 440, 554],
          failureMotif: [92, 70],
          completionMoment: "the shelter locks",
          color: "#79a7ff",
          color2: "#f2d16b",
          icon: SVG.safety
        },
        {
          key: "love",
          name: "Bond",
          full: "Love and belonging",
          hint: "thread",
          verb: "Thread",
          gestureCue: "open hand thread",
          successMotif: [294, 370, 494],
          failureMotif: [130, 110],
          completionMoment: "the bond becomes a constellation",
          color: "#f08ab6",
          color2: "#7dd7c7",
          icon: SVG.love
        },
        {
          key: "esteem",
          name: "Worth",
          full: "Esteem",
          hint: "lock",
          verb: "Time",
          gestureCue: "thumb / victory",
          successMotif: [440, 554, 740],
          failureMotif: [120, 82],
          completionMoment: "the mark locks in",
          color: "#f2c766",
          color2: "#f77e5f",
          icon: SVG.esteem
        },
        {
          key: "actual",
          name: "Becoming",
          full: "Self-actualization",
          hint: "trace",
          verb: "Trace",
          gestureCue: "point / reach",
          successMotif: [349, 466, 622],
          failureMotif: [146, 116],
          completionMoment: "the path becomes a living mark",
          color: "#8ee48f",
          color2: "#6bc8ff",
          icon: SVG.actual
        },
        {
          key: "beyond",
          name: "Beyond",
          full: "Transcendence",
          hint: "release",
          verb: "Release",
          gestureCue: "sign pulse",
          successMotif: [262, 392, 523],
          failureMotif: [138, 98],
          completionMoment: "every tier answers",
          color: "#c7a1ff",
          color2: "#ffffff",
          icon: SVG.beyond
        }
      ];

      const BODY_CUES = {
        intro: "Breathe: open / close",
        body: "Gather: open hand / crouch-star",
        safety: "Seal: palm shield / body shield",
        love: "Thread: arm span",
        esteem: "Time: jump / arms up",
        actual: "Trace: reach",
        beyond: "Release: sign / star pulses"
      };
      const CLASSIC_CUE = "pointer / arrows / space";
      const DEFAULT_MODE = "hands";
      const DEFAULT_CAMERA_TASK = "gesture";

      const TAU = Math.PI * 2;
      const CUE_DURATION = 2.35;
      const LEVEL_TRANSITION_DURATION = 1.14;
      const FINALE_TRANSITION_DURATION = 1.86;
      const INTRO_BREATHS = 2;
      const INTRO_PHASE_SPEED = 0.46;
      const BEYOND_TAP_RADIUS = 68;
      const BEYOND_BEACON_PULSES = 3;
      const MEDIAPIPE_VERSION = "0.10.35";
      const MEDIAPIPE_ROOT = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}`;
      const GESTURE_MODEL_URL = "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task";
      const POSE_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task";

      const canvas = document.getElementById("world");
      const ctx = canvas.getContext("2d", { alpha: true });
      const gameEl = document.querySelector(".game");
      const root = document.documentElement;
      const chipIcon = document.getElementById("chipIcon");
      const levelName = document.getElementById("levelName");
      const levelHint = document.getElementById("levelHint");
      const barFill = document.getElementById("barFill");
      const rail = document.getElementById("rail");
      const stageNote = document.getElementById("stageNote");
      const startOverlay = document.getElementById("startOverlay");
      const completeOverlay = document.getElementById("completeOverlay");
      const startButton = document.getElementById("startButton");
      const startButtonText = document.getElementById("startButtonText");
      const againButton = document.getElementById("againButton");
      const restartButton = document.getElementById("restartButton");
      const startStatus = document.getElementById("startStatus");
      const startStatusIcon = document.getElementById("startStatusIcon");
      const startStatusText = document.getElementById("startStatusText");
      const cameraButton = document.getElementById("cameraButton");
      const cameraIcon = document.getElementById("cameraIcon");
      const cameraFeed = document.getElementById("cameraFeed");
      const cameraStatus = document.getElementById("cameraStatus");
      const soundButton = document.getElementById("soundButton");
      const soundIcon = document.getElementById("soundIcon");
      const pixiHost = document.getElementById("pixiLayer");
      const riveCanvas = document.getElementById("riveLayer");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const verifyMode = new URLSearchParams(window.location.search).has("verify");
      const soundEngine = createSoundEngine();
      const director = createTheatreDirector({ reduceMotion });
      const pixiLayer = createPixiLayer(pixiHost);
      const riveBridge = createRiveBridge(riveCanvas);
      let motionSnapshot = director.snapshot;
      let loopRaf = 0;
      let primeTimer = 0;
      let verifyTimer = 0;

      document.getElementById("playIcon").innerHTML = SVG.play;
      document.getElementById("againIcon").innerHTML = SVG.restart;
      document.getElementById("restartIcon").innerHTML = SVG.restart;
      cameraIcon.innerHTML = SVG.camera;
      startStatusIcon.innerHTML = SVG.camera;
      document.getElementById("startGlyphs").innerHTML = LEVELS.map((level) => level.icon).join("");

      const state = {
        started: false,
        mode: DEFAULT_MODE,
        levelIndex: 0,
        levelState: {},
        progress: 0,
        transitioning: false,
        transitionTime: 0,
        transitionKind: "intro",
        complete: false,
        verifying: false,
        cueTime: 0,
        time: 0,
        last: performance.now(),
        shake: 0,
        muted: false,
        particles: [],
        waves: [],
        ripples: [],
        width: 0,
        height: 0,
        dpr: 1,
        player: { x: 0, y: 0, vx: 0, vy: 0, r: 14 },
        pointer: { x: 0, y: 0, active: false, seen: false },
        camera: {
          enabled: false,
          loading: false,
          status: "",
          permission: "unknown",
          stream: null,
          task: null,
          gestureRecognizer: null,
          poseLandmarker: null,
          raf: 0,
          lastVideoTime: -1,
          hand: null,
          body: null,
          bodyBaselineY: null,
          bodyFit: null,
          blocked: false,
          lastPoseLabel: "",
          lastPoseEffectTime: 0,
          pinched: false,
          actionDown: false,
          confidence: 0,
          intent: null,
          session: 0
        },
        input: { left: false, right: false, up: false, down: false, space: false, just: false, pointerJust: false }
      };

      let lastCameraToggle = 0;

      function iconButton(level, index) {
        const button = document.createElement("button");
        button.type = "button";
        button.innerHTML = level.icon + `<span class="sr-only">${level.name}</span>`;
        button.title = level.full;
        button.setAttribute("aria-label", `${level.name} - ${level.full}`);
        button.addEventListener("click", () => {
          if (index <= state.levelIndex && state.started && !state.transitioning) {
            state.complete = false;
            setOverlayOpen(completeOverlay, false);
            state.levelIndex = index;
            initLevel();
          }
        });
        return button;
      }

      LEVELS.forEach((level, index) => rail.appendChild(iconButton(level, index)));

      function updateHud() {
        const level = LEVELS[state.levelIndex] || LEVELS[LEVELS.length - 1];
        chipIcon.innerHTML = level.icon;
        levelName.textContent = level.name;
        levelHint.textContent = level.verb.toLowerCase();
        root.style.setProperty("--glow", level.color);
        root.style.setProperty("--glow-2", level.color2);
        root.style.setProperty("--bg-a", shade(level.color, -0.82));
        root.style.setProperty("--bg-b", shade(level.color2, -0.77));
        barFill.parentElement.style.setProperty("--progress", Math.max(0, Math.min(1, state.progress)));
        gameEl.dataset.level = level.key;
        gameEl.dataset.progress = Math.max(0, Math.min(1, state.progress)).toFixed(3);
        gameEl.dataset.started = String(state.started);
        gameEl.dataset.complete = String(state.complete);
        gameEl.dataset.maslow = level.full;
        gameEl.dataset.mode = state.mode;
        gameEl.dataset.camera = state.camera.task || "off";
        gameEl.dataset.cameraEnabled = String(state.camera.enabled);
        gameEl.dataset.cameraBlocked = String(state.camera.blocked);
        pixiLayer.setPalette(level.color, level.color2);
        riveBridge.setLevel(state.levelIndex, state.progress);
        levelName.title = level.full;
        const nextCameraAction = cameraActionLabel();
        cameraButton.setAttribute("aria-pressed", String(state.camera.enabled));
        cameraButton.setAttribute("aria-label", nextCameraAction);
        cameraButton.title = nextCameraAction;
        cameraButton.disabled = state.verifying;
        cameraIcon.innerHTML = state.camera.enabled ? SVG.cameraActive : SVG.camera;
        cameraFeed.dataset.active = String(state.camera.enabled);
        cameraStatus.dataset.active = String(Boolean(state.camera.status));
        cameraStatus.textContent = state.camera.status;
        const cameraSignal = cameraStatusSignal();
        startStatus.dataset.active = String(!state.started && Boolean(cameraSignal.text));
        startStatus.dataset.state = cameraSignal.state;
        startStatusIcon.innerHTML = state.camera.enabled ? SVG.cameraActive : SVG.camera;
        startStatusText.textContent = cameraSignal.text;
        const startLabel = !state.started && state.camera.blocked ? "Begin classic" : "Begin";
        startButtonText.textContent = startLabel;
        startButton.setAttribute("aria-label", state.camera.blocked ? "Begin with classic controls" : "Begin");
        soundButton.setAttribute("aria-pressed", String(!state.muted));
        soundIcon.innerHTML = state.muted ? SVG.soundOff : SVG.soundOn;
        Array.from(rail.children).forEach((button, index) => {
          button.dataset.active = String(index === state.levelIndex);
          button.dataset.done = String(index < state.levelIndex || state.complete);
        });
      }

      function cameraActionLabel() {
        if (state.camera.loading) return "Cancel camera startup";
        if (state.camera.blocked) return "Retry camera permission";
        if (!state.camera.enabled) return "Start upper-body control";
        if (state.camera.task === "gesture") return "Escalate to full-body control";
        if (state.camera.task === "pose") return "Return to classic control";
        return "Camera control";
      }

      function cameraStatusSignal() {
        if (state.camera.loading) return { state: "loading", text: state.camera.status || "camera permission" };
        if (state.camera.blocked) return { state: "blocked", text: state.started ? "classic controls" : "allow camera" };
        if (state.camera.enabled) return { state: "active", text: state.camera.task === "pose" ? "full body" : "upper body" };
        if (state.camera.status) return { state: "blocked", text: state.camera.status };
        return { state: "idle", text: "" };
      }

      function desiredVisionTask() {
        if (state.mode === "classic") return null;
        return state.mode === "body" ? "pose" : "gesture";
      }

      function cueForLevel(level) {
        if (state.mode === "body") return BODY_CUES[level.key];
        if (state.mode === "classic") return CLASSIC_CUE;
        return `${level.verb}: ${level.gestureCue}`;
      }

      function refreshStageCue() {
        stageNote.textContent = cueForLevel(LEVELS[state.levelIndex] || LEVELS[0]);
      }

      function shade(hex, amount) {
        const n = parseInt(hex.slice(1), 16);
        const r = Math.max(0, Math.min(255, (n >> 16) + Math.round(255 * amount)));
        const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + Math.round(255 * amount)));
        const b = Math.max(0, Math.min(255, (n & 255) + Math.round(255 * amount)));
        return `rgb(${r}, ${g}, ${b})`;
      }

      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        state.dpr = dpr;
        state.width = window.innerWidth;
        state.height = window.innerHeight;
        canvas.width = Math.floor(state.width * dpr);
        canvas.height = Math.floor(state.height * dpr);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        pixiLayer.resize(state.width, state.height, dpr);
        riveBridge.resize(state.width, state.height, dpr);
        state.player.x = state.player.x || state.width * 0.5;
        state.player.y = state.player.y || state.height * 0.58;
      }

      function resetGame() {
        state.levelIndex = 0;
        state.complete = false;
        state.transitioning = false;
        state.transitionTime = 0;
        state.particles.length = 0;
        state.waves.length = 0;
        state.ripples.length = 0;
        setOverlayOpen(completeOverlay, false);
        initLevel();
      }

      function setOverlayOpen(overlay, open) {
        overlay.dataset.open = String(open);
        overlay.setAttribute("aria-hidden", String(!open));
        if (open) overlay.removeAttribute("inert");
        else overlay.setAttribute("inert", "");
        overlay.inert = !open;
      }

      function initLevel() {
        const level = LEVELS[state.levelIndex];
        const key = level.key;
        state.progress = 0;
        state.levelState = {};
        state.particles.length = 0;
        state.waves.length = 0;
        state.ripples.length = 0;
        state.cueTime = 0;
        state.shake = 0;
        state.player.x = state.width * 0.5;
        state.player.y = state.height * 0.62;
        state.player.vx = 0;
        state.player.vy = 0;
        stageNote.textContent = cueForLevel(level);

        if (key === "intro") {
          state.levelState.breaths = 0;
          state.levelState.phase = 0;
          state.levelState.lastPhase = 0;
          state.levelState.inhaleCharge = 0;
          state.levelState.exhaleCharge = 0;
          state.levelState.ready = false;
          state.levelState.cycleAwarded = false;
          state.levelState.breathPulse = 0;
          state.levelState.bloom = 0;
          state.levelState.missGlow = 0;
          state.levelState.helpPulse = 0;
        }

        if (key === "body") {
          state.levelState.collected = 0;
          state.levelState.combo = 0;
          state.levelState.comboTimer = 0;
          state.levelState.chainPulse = 0;
          state.levelState.starLock = false;
          state.levelState.crouchLock = false;
          state.levelState.items = makeItems(12, 50);
        }

        if (key === "safety") {
          state.levelState.nodes = makeRingNodes(5, Math.min(state.width, state.height) * 0.26);
          state.levelState.hazard = -Math.PI / 2;
          state.levelState.sealed = 0;
          state.levelState.hitCooldown = 0;
          state.levelState.dangerFlash = 0;
          state.levelState.bodySealPulse = 0;
        }

        if (key === "love") {
          state.levelState.nodes = makeRingNodes(6, Math.min(state.width, state.height) * 0.24).map((node, index) => ({
            ...node,
            linked: index === 0,
            drift: Math.random() * 10
          }));
          state.levelState.links = 1;
          state.levelState.order = [state.levelState.nodes[0]];
          state.levelState.thread = [];
          state.levelState.snap = null;
        }

        if (key === "esteem") {
          state.levelState.targets = [
            Math.PI * 0.18,
            Math.PI * 0.58,
            -Math.PI * 0.22,
            Math.PI * 0.88,
            -Math.PI * 0.62,
            Math.PI * 0.08
          ];
          state.levelState.angle = -Math.PI / 2;
          state.levelState.target = state.levelState.targets[0];
          state.levelState.hits = 0;
          state.levelState.flash = 0;
          state.levelState.lock = 0;
          state.levelState.bodyLiftLock = false;
          state.levelState.bodyStrikeCooldown = 0;
        }

        if (key === "actual") {
          const radius = Math.min(state.width, state.height) * 0.25;
          const cx = state.width * 0.5;
          const cy = state.height * 0.52;
          state.levelState.path = Array.from({ length: 7 }, (_, i) => {
            const t = -Math.PI / 2 + i * Math.PI * 2 / 7;
            const wave = radius * (0.68 + (i % 2) * 0.24);
            return { x: cx + Math.cos(t) * wave, y: cy + Math.sin(t) * wave };
          });
          state.levelState.next = 0;
          state.levelState.ink = [];
          state.levelState.flow = 0;
        }

        if (key === "beyond") {
          const base = Math.min(state.width, state.height) * 0.2;
          const cx = state.width * 0.5;
          const cy = state.height * 0.52;
          state.levelState.beacons = Array.from({ length: 6 }, (_, index) => {
            const angle = -Math.PI / 2 + index * TAU / 6;
            const radius = base * (0.78 + index * 0.105);
            return {
              x: cx + Math.cos(angle) * radius,
              y: cy + Math.sin(angle) * radius,
              active: false,
              charge: 0,
              awake: false,
              pulses: 0,
              glyph: LEVELS[index + 1].key,
              tierIndex: index + 1
            };
          });
          state.levelState.current = 0;
          state.levelState.ritual = false;
          state.levelState.centerPulse = 0;
          state.levelState.recapFlash = 0;
          state.levelState.hitFlash = 0;
          state.levelState.missFlash = 0;
          state.levelState.lastTap = null;
          state.levelState.echoes = [];
          state.levelState.beams = [];
          state.levelState.pulseCooldown = 0;
        }

        updateHud();
      }

      function makeRingNodes(count, radius) {
        const cx = state.width * 0.5;
        const cy = state.height * 0.52;
        return Array.from({ length: count }, (_, i) => {
          const t = -Math.PI / 2 + (i / count) * Math.PI * 2;
          return { x: cx + Math.cos(t) * radius, y: cy + Math.sin(t) * radius, active: false };
        });
      }

      function makeItems(count, margin) {
        const top = Math.max(margin, 108);
        const bottom = Math.max(top + 1, state.height - margin);
        return Array.from({ length: count }, (_, i) => ({
          x: margin + Math.random() * (state.width - margin * 2),
          y: top + Math.random() * (bottom - top),
          r: 11 + Math.random() * 9,
          phase: Math.random() * Math.PI * 2,
          kind: i % 3,
          pull: 0,
          collected: false
        }));
      }

      function startGame() {
        unlockAudio();
        const shouldAttemptCamera = !state.camera.enabled && !state.camera.loading && !state.camera.blocked;
        if (shouldAttemptCamera) {
          state.mode = DEFAULT_MODE;
        } else if (state.camera.blocked) {
          state.mode = "classic";
          setCameraStatus("classic controls");
        }
        state.started = true;
        state.complete = false;
        setOverlayOpen(startOverlay, false);
        resetGame();
        if (shouldAttemptCamera) {
          startHandControl(DEFAULT_CAMERA_TASK, { fallbackMode: "classic" });
        }
      }

      function unlockAudio() {
        if (state.muted) return;
        void soundEngine.unlock();
      }

      function tone(freq = 440, duration = 0.12, type = "sine", gain = 0.055) {
        if (state.verifying || state.muted) return;
        soundEngine.tone(freq, duration, type, gain);
      }

      function buzz(pattern) {
        if ("vibrate" in navigator && !state.verifying && !state.muted) navigator.vibrate(pattern);
      }

      function successTone(levelIndex, step = 0, duration = 0.12) {
        const motif = LEVELS[levelIndex].successMotif;
        if (state.verifying || state.muted) return;
        soundEngine.success(motif, step, duration);
      }

      function failureTone(levelIndex, step = 0) {
        const motif = LEVELS[levelIndex].failureMotif;
        if (state.verifying || state.muted) return;
        soundEngine.failure(motif, step);
      }

      async function startHandControl(task = desiredVisionTask(), options = {}) {
        if (!task) {
          setCameraStatus("");
          updateHud();
          return;
        }
        if (state.camera.loading || state.camera.enabled) return;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          handleCameraFailure(task, { name: "Unavailable" }, options);
          return;
        }

        const session = state.camera.session + 1;
        state.camera.session = session;
        state.camera.loading = true;
        state.camera.task = task;
        state.camera.blocked = false;
        setCameraStatus("checking camera");
        updateHud();

        try {
          const permission = await cameraPermissionState();
          state.camera.permission = permission;
          if (state.camera.session !== session) return;
          if (permission === "denied") {
            handleCameraFailure(task, { name: "NotAllowedError" }, options);
            return;
          }
          setCameraStatus(permission === "granted" ? (task === "pose" ? "loading full body" : "loading upper body") : "camera permission");
          updateHud();
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
              frameRate: { ideal: 30, max: 60 }
            }
          });
          cameraFeed.srcObject = stream;
          cameraFeed.muted = true;
          cameraFeed.playsInline = true;
          await cameraFeed.play();
          if (state.camera.session !== session) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          setCameraStatus(task === "pose" ? "loading full body" : "loading upper body");
          updateHud();
          const { FilesetResolver, GestureRecognizer, PoseLandmarker } = await import(`${MEDIAPIPE_ROOT}/vision_bundle.mjs`);
          const vision = await FilesetResolver.forVisionTasks(`${MEDIAPIPE_ROOT}/wasm`);
          let gestureRecognizer = null;
          let poseLandmarker = null;
          if (task === "pose") {
            poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: POSE_MODEL_URL,
                delegate: "GPU"
              },
              runningMode: "VIDEO",
              numPoses: 1,
              minPoseDetectionConfidence: 0.55,
              minPosePresenceConfidence: 0.55,
              minTrackingConfidence: 0.5
            });
          } else {
            gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: GESTURE_MODEL_URL,
                delegate: "GPU"
              },
              runningMode: "VIDEO",
              numHands: 1,
              minHandDetectionConfidence: 0.55,
              minHandPresenceConfidence: 0.55,
              minTrackingConfidence: 0.5
            });
          }
          if (state.camera.session !== session) {
            if (gestureRecognizer && typeof gestureRecognizer.close === "function") gestureRecognizer.close();
            if (poseLandmarker && typeof poseLandmarker.close === "function") poseLandmarker.close();
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          state.camera.stream = stream;
          state.camera.task = task;
          state.camera.gestureRecognizer = gestureRecognizer;
          state.camera.poseLandmarker = poseLandmarker;
          state.camera.enabled = true;
          state.camera.loading = false;
          state.camera.lastVideoTime = -1;
          setCameraStatus(task === "pose" ? "full body" : "upper body");
          updateHud();
          trackHandFrame();
        } catch (error) {
          handleCameraFailure(task, error, options);
        }
      }

      async function cameraPermissionState() {
        if (!navigator.permissions || !navigator.permissions.query) return "unknown";
        try {
          const status = await navigator.permissions.query({ name: "camera" });
          status.onchange = () => {
            state.camera.permission = status.state;
            if (status.state === "granted" && state.camera.blocked && !state.camera.enabled && !state.camera.loading) {
              state.camera.blocked = false;
              setCameraStatus("");
            }
            updateHud();
          };
          return status.state || "unknown";
        } catch (error) {
          return "unknown";
        }
      }

      function cameraFailureStatus(task, error) {
        if (!error) return task === "pose" ? "full body unavailable" : "upper body unavailable";
        if (error.name === "NotAllowedError" || error.name === "SecurityError") return "allow camera";
        if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") return "no camera";
        if (error.name === "NotReadableError" || error.name === "TrackStartError") return "camera busy";
        if (error.name === "Unavailable") return "camera unavailable";
        return task === "pose" ? "full body unavailable" : "upper body unavailable";
      }

      function handleCameraFailure(task, error, options = {}) {
        const blocked = error && (error.name === "NotAllowedError" || error.name === "SecurityError");
        const status = cameraFailureStatus(task, error);
        const fallbackMode = options.fallbackMode || (state.started ? "classic" : "");
        stopHandControl({ skipUpdate: true });
        state.camera.blocked = blocked;
        if (options.fallbackTask && !blocked) {
          state.mode = options.fallbackTask === "pose" ? "body" : "hands";
          setCameraStatus(status);
          refreshStageCue();
          updateHud();
          startHandControl(options.fallbackTask, { fallbackMode: options.fallbackMode });
          return;
        }
        if (fallbackMode === "classic") {
          state.mode = "classic";
          setCameraStatus(state.started && blocked ? "classic controls" : status);
          refreshStageCue();
        } else {
          setCameraStatus(status);
        }
        updateHud();
      }

      function stopHandControl(options = {}) {
        state.camera.session += 1;
        if (state.camera.raf) cancelAnimationFrame(state.camera.raf);
        state.camera.raf = 0;
        if (state.camera.gestureRecognizer && typeof state.camera.gestureRecognizer.close === "function") {
          state.camera.gestureRecognizer.close();
        }
        if (state.camera.poseLandmarker && typeof state.camera.poseLandmarker.close === "function") {
          state.camera.poseLandmarker.close();
        }
        if (state.camera.stream) {
          state.camera.stream.getTracks().forEach((track) => track.stop());
        }
        cameraFeed.pause();
        cameraFeed.srcObject = null;
        state.camera.enabled = false;
        state.camera.loading = false;
        state.camera.stream = null;
        state.camera.task = null;
        state.camera.gestureRecognizer = null;
        state.camera.poseLandmarker = null;
        state.camera.hand = null;
        state.camera.body = null;
        state.camera.bodyBaselineY = null;
        state.camera.bodyFit = null;
        state.camera.blocked = false;
        state.camera.lastPoseLabel = "";
        state.camera.lastPoseEffectTime = 0;
        state.camera.pinched = false;
        state.camera.actionDown = false;
        state.camera.intent = null;
        state.camera.confidence = 0;
        state.camera.lastVideoTime = -1;
        state.pointer.active = false;
        if (!options.preserveStatus) setCameraStatus("");
        if (!options.skipUpdate) updateHud();
      }

      function setCameraStatus(message) {
        state.camera.status = message;
        cameraStatus.textContent = message;
        cameraStatus.dataset.active = String(Boolean(message));
      }

      function primeCamera() {
        if (verifyMode || state.started || state.camera.enabled || state.camera.loading) return;
        state.mode = DEFAULT_MODE;
        setCameraStatus("camera permission");
        updateHud();
        startHandControl(DEFAULT_CAMERA_TASK);
      }

      function trackHandFrame() {
        if (!state.camera.enabled) return;
        if (state.camera.task === "pose" && !state.camera.poseLandmarker) return;
        if (state.camera.task !== "pose" && !state.camera.gestureRecognizer) return;
        const videoReady = cameraFeed.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
        if (videoReady && cameraFeed.currentTime !== state.camera.lastVideoTime) {
          state.camera.lastVideoTime = cameraFeed.currentTime;
          let result;
          if (state.camera.task === "pose") {
            try {
              result = state.camera.poseLandmarker.detectForVideo(cameraFeed, performance.now());
            } catch (error) {
              clearHandInput();
              state.camera.raf = requestAnimationFrame(trackHandFrame);
              return;
            }
            const landmarks = result.landmarks && result.landmarks[0];
            const worldLandmarks = result.worldLandmarks && result.worldLandmarks[0];
            if (landmarks) applyPoseInput(landmarks, worldLandmarks);
            else clearHandInput();
          } else {
            try {
              result = state.camera.gestureRecognizer.recognizeForVideo(cameraFeed, performance.now());
            } catch (error) {
              clearHandInput();
              state.camera.raf = requestAnimationFrame(trackHandFrame);
              return;
            }
            const landmarks = result.landmarks && result.landmarks[0];
            const gesture = result.gestures && result.gestures[0] && result.gestures[0][0];
            const handedness = result.handednesses && result.handednesses[0] && result.handednesses[0][0];
            if (landmarks) applyHandInput(landmarks, {
              gesture: gesture ? gesture.categoryName : "None",
              score: gesture ? gesture.score : 0,
              handedness: handedness ? handedness.categoryName : "",
              confidence: handedness ? handedness.score : 1
            });
            else clearHandInput();
          }
        }
        state.camera.raf = requestAnimationFrame(trackHandFrame);
      }

      function applyHandInput(landmarks, recognition = {}) {
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        const wrist = landmarks[0];
        if (!indexTip || !thumbTip || !wrist) return;

        const intent = buildHandIntent(landmarks, recognition);
        const controlPoint = gestureControlPoint(intent);
        const x = clamp(controlPoint.x, 16, state.width - 16);
        const y = clamp(controlPoint.y, 82, state.height - 16);
        const prev = state.camera.hand || { x, y };
        const smooth = state.pointer.seen ? 0.44 : 1;
        state.pointer.x = prev.x + (x - prev.x) * smooth;
        state.pointer.y = prev.y + (y - prev.y) * smooth;
        state.pointer.seen = true;

        const actionDown = isGestureActionDown(intent);
        if (actionDown && !state.camera.actionDown) {
          state.input.just = true;
          state.input.pointerJust = true;
          unlockAudio();
          buzz(6);
        }
        state.pointer.active = isGestureHoldDown(intent);
        state.camera.pinched = intent.pinch;
        state.camera.actionDown = actionDown;
        state.camera.confidence = intent.confidence;
        state.camera.intent = intent;
        state.camera.hand = {
          x: state.pointer.x,
          y: state.pointer.y,
          pinch: intent.pinch,
          action: actionDown,
          label: intent.label,
          open: intent.open,
          fist: intent.fist,
          spread: intent.spread,
          velocity: intent.velocity,
          confidence: intent.confidence
        };
        setCameraStatus(`${intent.shortLabel}${actionDown ? " action" : ""}`);
      }

      function applyPoseInput(landmarks, worldLandmarks = []) {
        const intent = buildPoseIntent(landmarks, worldLandmarks);
        if (!intent) {
          clearHandInput();
          return;
        }

        const controlPoint = gestureControlPoint(intent);
        const x = clamp(controlPoint.x, 16, state.width - 16);
        const y = clamp(controlPoint.y, 82, state.height - 16);
        const prev = state.camera.body || { x, y };
        const smooth = state.pointer.seen ? 0.36 : 1;
        state.pointer.x = prev.x + (x - prev.x) * smooth;
        state.pointer.y = prev.y + (y - prev.y) * smooth;
        state.pointer.seen = true;

        const actionDown = isGestureActionDown(intent);
        if (actionDown && !state.camera.actionDown) {
          state.input.just = true;
          state.input.pointerJust = true;
          unlockAudio();
          buzz(intent.jump ? 16 : 8);
        }
        state.pointer.active = isGestureHoldDown(intent);
        state.camera.pinched = intent.pinch;
        state.camera.actionDown = actionDown;
        state.camera.confidence = intent.confidence;
        state.camera.intent = intent;
        state.camera.body = {
          x: state.pointer.x,
          y: state.pointer.y,
          pinch: intent.pinch,
          action: actionDown,
          label: intent.label,
          open: intent.open,
          fist: intent.fist,
          star: intent.star,
          jump: intent.jump,
          crouch: intent.crouch,
          armsOpen: intent.armsOpen,
          armsUp: intent.armsUp,
          handsTogether: intent.handsTogether,
          shield: intent.shield,
          energy: intent.energy,
          spread: intent.spread,
          velocity: intent.velocity,
          confidence: intent.confidence,
          fit: intent.fit,
          pose: intent.pose
        };
        state.camera.bodyFit = intent.fit;
        state.camera.hand = null;
        triggerPoseMicroEffects(intent);
        const fitHint = intent.fit && intent.fit.tooClose ? "step back" : intent.fit && intent.fit.tooFar ? "closer" : intent.fit && intent.fit.offCenter ? "center" : "";
        setCameraStatus(fitHint || `${intent.shortLabel}${actionDown ? " action" : ""}`);
      }

      function clearHandInput() {
        state.camera.hand = null;
        state.camera.body = null;
        state.camera.bodyFit = null;
        state.camera.intent = null;
        state.camera.confidence = 0;
        state.camera.pinched = false;
        state.camera.actionDown = false;
        if (state.camera.enabled) state.pointer.active = false;
        if (state.camera.enabled) setCameraStatus(state.camera.task === "pose" ? "stand in frame" : "show one hand");
      }

      function triggerPoseMicroEffects(intent) {
        if (!intent || intent.source !== "pose") return;
        const core = intent.pose && intent.pose.bodyCenter;
        if (!core) return;
        const changed = intent.label !== state.camera.lastPoseLabel;
        const energetic = intent.energy > 0.68;
        if (!changed && !energetic) return;
        if (state.time - state.camera.lastPoseEffectTime < 0.18) return;

        state.camera.lastPoseLabel = intent.label;
        state.camera.lastPoseEffectTime = state.time;
        const level = LEVELS[state.levelIndex] || LEVELS[0];
        const color = intent.star || intent.jump ? level.color2 : level.color;
        const radius = intent.star ? 170 : intent.jump ? 130 : intent.crouch ? 82 : 96;
        spawnRipple(core.x, core.y, color, radius);
        if (intent.star || intent.jump) burst(core.x, core.y, color, intent.star ? 18 : 12);
        if (intent.pose.leftWrist && poseVisible(intent.pose.leftWrist)) spawnParticle(intent.pose.leftWrist.x, intent.pose.leftWrist.y, color, 1.1, true);
        if (intent.pose.rightWrist && poseVisible(intent.pose.rightWrist)) spawnParticle(intent.pose.rightWrist.x, intent.pose.rightWrist.y, color, 1.1, true);
      }

      function buildHandIntent(landmarks, recognition) {
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        const palm = midpoint([landmarks[0], landmarks[5], landmarks[9], landmarks[13], landmarks[17]]);
        const palmScale = Math.max(0.035, distance2d(wrist, landmarks[9]));
        const pinchRatio = distance2d(thumbTip, indexTip) / palmScale;
        const tips = [thumbTip, indexTip, middleTip, ringTip, pinkyTip];
        const spread = clamp(
          (distance2d(thumbTip, pinkyTip) + distance2d(indexTip, pinkyTip) + distance2d(indexTip, ringTip)) / (palmScale * 5.2),
          0,
          1
        );
        const extended = [4, 8, 12, 16, 20].map((tipIndex) => distance2d(landmarks[tipIndex], wrist) > distance2d(landmarks[tipIndex - 2], wrist) * 1.08);
        const openness = clamp((extended.filter(Boolean).length / 5) * 0.62 + spread * 0.38, 0, 1);
        const label = recognition.gesture || "None";
        const previous = state.camera.intent && state.camera.intent.source === "hand" ? state.camera.intent : null;
        const rawX = (1 - indexTip.x) * state.width;
        const rawY = indexTip.y * state.height;
        const vx = previous ? rawX - previous.rawX : 0;
        const vy = previous ? rawY - previous.rawY : 0;
        const velocity = Math.hypot(vx, vy);
        const swipe = previous && velocity > 52 ? { x: Math.sign(vx), y: Math.sign(vy), speed: velocity } : { x: 0, y: 0, speed: 0 };

        return {
          source: "hand",
          rawX,
          rawY,
          x: rawX,
          y: rawY,
          palmX: (1 - palm.x) * state.width,
          palmY: palm.y * state.height,
          pinch: pinchRatio < 0.36,
          pinchRatio,
          open: label === "Open_Palm" || openness > 0.72,
          fist: label === "Closed_Fist" || openness < 0.28,
          point: label === "Pointing_Up" || (extended[1] && !extended[2] && !extended[3]),
          victory: label === "Victory",
          love: label === "ILoveYou",
          thumbUp: label === "Thumb_Up",
          thumbDown: label === "Thumb_Down",
          spread,
          openness,
          velocity,
          swipe,
          label,
          shortLabel: label === "None" ? (pinchRatio < 0.36 ? "pinch" : openness > 0.72 ? "open palm" : "hand") : label.replace(/_/g, " ").toLowerCase(),
          score: recognition.score || 0,
          confidence: recognition.confidence || 0,
          landmarks,
          tips
        };
      }

      function buildPoseIntent(landmarks, worldLandmarks = []) {
        const nose = landmarks[0];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];
        if (!leftShoulder || !rightShoulder || !leftWrist || !rightWrist || !leftHip || !rightHip) return null;

        const trackedPoints = [nose, leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle]
          .filter((point) => point && landmarkConfidence(point) > 0.2);
        const box = trackedPoints.reduce((bounds, point) => ({
          minX: Math.min(bounds.minX, point.x),
          maxX: Math.max(bounds.maxX, point.x),
          minY: Math.min(bounds.minY, point.y),
          maxY: Math.max(bounds.maxY, point.y)
        }), { minX: 1, maxX: 0, minY: 1, maxY: 0 });
        const boxWidth = Math.max(0, box.maxX - box.minX);
        const boxHeight = Math.max(0, box.maxY - box.minY);
        const shoulderCenter = midpoint([leftShoulder, rightShoulder]);
        const hipCenter = midpoint([leftHip, rightHip]);
        const bodyCenter = midpoint([shoulderCenter, hipCenter]);
        const shoulderWidth = Math.max(0.055, distance2d(leftShoulder, rightShoulder));
        const leftWristVisible = landmarkConfidence(leftWrist) > 0.24;
        const rightWristVisible = landmarkConfidence(rightWrist) > 0.24;
        const leftAnkleVisible = landmarkConfidence(leftAnkle) > 0.24;
        const rightAnkleVisible = landmarkConfidence(rightAnkle) > 0.24;
        const wristSpan = distance2d(leftWrist, rightWrist);
        const ankleSpan = leftAnkle && rightAnkle ? distance2d(leftAnkle, rightAnkle) : 0;
        const leftArmExtended = leftWristVisible && distance2d(leftWrist, leftShoulder) > shoulderWidth * 1.15;
        const rightArmExtended = rightWristVisible && distance2d(rightWrist, rightShoulder) > shoulderWidth * 1.15;
        const leadIsRight = landmarkConfidence(rightWrist) >= landmarkConfidence(leftWrist);
        const leadWrist = leadIsRight ? rightWrist : leftWrist;
        const leadExtended = leadIsRight ? rightArmExtended : leftArmExtended;
        const oneArmUp =
          (leftWristVisible && leftWrist.y < leftShoulder.y - shoulderWidth * 0.12) ||
          (rightWristVisible && rightWrist.y < rightShoulder.y - shoulderWidth * 0.12);
        const bothArmsUp =
          leftWristVisible &&
          rightWristVisible &&
          leftWrist.y < leftShoulder.y - shoulderWidth * 0.1 &&
          rightWrist.y < rightShoulder.y - shoulderWidth * 0.1;
        const handsTogether = leftWristVisible && rightWristVisible && wristSpan < shoulderWidth * 0.72;
        const armsOpen =
          leftWristVisible &&
          rightWristVisible &&
          wristSpan > shoulderWidth * 1.75 &&
          leftWrist.y < hipCenter.y &&
          rightWrist.y < hipCenter.y;
        const wideStance = leftAnkleVisible && rightAnkleVisible && ankleSpan > shoulderWidth * 1.28;
        const wristCenter = midpoint([leftWrist, rightWrist]);
        const crossedArms =
          leftWristVisible &&
          rightWristVisible &&
          (distance2d(leftWrist, rightShoulder) < shoulderWidth * 0.88 || distance2d(rightWrist, leftShoulder) < shoulderWidth * 0.88) &&
          wristCenter.y < hipCenter.y;
        const shield = crossedArms || (handsTogether && wristCenter.y < hipCenter.y);
        const kneeCenter = leftKnee && rightKnee ? midpoint([leftKnee, rightKnee]) : null;
        const legCompression = kneeCenter ? (kneeCenter.y - hipCenter.y) / shoulderWidth : 2;
        if (state.camera.bodyBaselineY == null) {
          state.camera.bodyBaselineY = hipCenter.y;
        } else {
          state.camera.bodyBaselineY = Math.min(hipCenter.y, state.camera.bodyBaselineY + 0.0008);
        }
        const hipDrop = hipCenter.y - state.camera.bodyBaselineY;
        const crouch = hipDrop > shoulderWidth * 0.14 || legCompression < 0.82;
        const star = armsOpen && wideStance;
        const centerScreen = poseToScreen(bodyCenter);
        const leadScreen = poseToScreen(leadWrist);
        const previous = state.camera.intent && state.camera.intent.source === "pose" ? state.camera.intent : null;
        const vx = previous ? centerScreen.x - previous.centerX : 0;
        const vy = previous ? centerScreen.y - previous.centerY : 0;
        const velocity = Math.hypot(vx, vy);
        const jump = Boolean(previous && previous.centerY - centerScreen.y > 18) || (oneArmUp && -vy > 12);
        const lean = nose ? clamp((nose.x - hipCenter.x) / shoulderWidth, -1.8, 1.8) : 0;
        const spread = clamp((wristSpan / shoulderWidth - 0.55) / 1.75, 0, 1);
        const openness = clamp((armsOpen ? 0.58 : 0) + (wideStance ? 0.22 : 0) + (oneArmUp ? 0.2 : 0), 0, 1);
        const fit = {
          width: boxWidth,
          height: boxHeight,
          tooClose: boxHeight > 0.94 || boxWidth > 0.86,
          tooFar: boxHeight > 0 && boxHeight < 0.34,
          offCenter: Math.abs(bodyCenter.x - 0.5) > 0.31,
          score: clamp(1 - Math.abs(boxHeight - 0.66) * 1.6 - Math.max(0, Math.abs(bodyCenter.x - 0.5) - 0.16) * 1.7, 0, 1)
        };
        const confidence = clamp(average([
          landmarkConfidence(leftShoulder),
          landmarkConfidence(rightShoulder),
          landmarkConfidence(leftWrist),
          landmarkConfidence(rightWrist),
          landmarkConfidence(leftHip),
          landmarkConfidence(rightHip)
        ]), 0, 1);
        const energy = clamp(velocity / 86 + (jump ? 0.42 : 0) + (star ? 0.35 : 0) + (crouch ? 0.16 : 0), 0, 1.4);
        const label = star ? "Star" : jump ? "Jump" : shield ? "Shield" : bothArmsUp ? "Arms_Up" : crouch ? "Crouch" : handsTogether ? "Hands_Close" : armsOpen ? "Open_Body" : leadExtended ? "Reach" : "Body";

        return {
          source: "pose",
          rawX: leadScreen.x,
          rawY: leadScreen.y,
          x: leadScreen.x,
          y: leadScreen.y,
          palmX: centerScreen.x,
          palmY: centerScreen.y,
          centerX: centerScreen.x,
          centerY: centerScreen.y,
          pinch: handsTogether,
          pinchRatio: wristSpan / shoulderWidth,
          open: armsOpen || star,
          fist: handsTogether || crouch || shield,
          point: leadExtended,
          victory: bothArmsUp || jump,
          love: armsOpen || star,
          thumbUp: oneArmUp || jump,
          thumbDown: crouch,
          spread,
          openness,
          velocity,
          swipe: velocity > 42 ? { x: Math.sign(vx), y: Math.sign(vy), speed: velocity } : { x: 0, y: 0, speed: 0 },
          label,
          shortLabel: label.replace(/_/g, " ").toLowerCase(),
          score: confidence,
          confidence,
          armsOpen,
          armsUp: bothArmsUp,
          handsTogether,
          wideStance,
          crouch,
          jump,
          star,
          shield,
          lean,
          energy,
          fit,
          landmarks,
          worldLandmarks,
          pose: {
            nose: nose ? poseToScreen(nose) : null,
            leftShoulder: poseToScreen(leftShoulder),
            rightShoulder: poseToScreen(rightShoulder),
            leftElbow: leftElbow ? poseToScreen(leftElbow) : null,
            rightElbow: rightElbow ? poseToScreen(rightElbow) : null,
            leftWrist: poseToScreen(leftWrist),
            rightWrist: poseToScreen(rightWrist),
            leftHip: poseToScreen(leftHip),
            rightHip: poseToScreen(rightHip),
            leftKnee: leftKnee ? poseToScreen(leftKnee) : null,
            rightKnee: rightKnee ? poseToScreen(rightKnee) : null,
            leftAnkle: leftAnkle ? poseToScreen(leftAnkle) : null,
            rightAnkle: rightAnkle ? poseToScreen(rightAnkle) : null,
            shoulderCenter: poseToScreen(shoulderCenter),
            hipCenter: poseToScreen(hipCenter),
            bodyCenter: centerScreen
          }
        };
      }

      function poseToScreen(point) {
        return {
          x: (1 - clamp(point.x, -0.18, 1.18)) * state.width,
          y: clamp(point.y, -0.18, 1.18) * state.height,
          z: point.z || 0,
          visibility: landmarkConfidence(point)
        };
      }

      function landmarkConfidence(point) {
        if (!point) return 0;
        if (typeof point.visibility === "number") return point.visibility;
        if (typeof point.presence === "number") return point.presence;
        return 1;
      }

      function average(values) {
        return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
      }

      function isGestureActionDown(intent) {
        const key = LEVELS[state.levelIndex].key;
        if (intent.source === "pose") {
          if (key === "intro") return intent.armsOpen || intent.star || intent.armsUp || intent.handsTogether || intent.crouch;
          if (key === "body") return intent.crouch || intent.star || intent.armsOpen || intent.jump || intent.handsTogether;
          if (key === "safety") return intent.shield || intent.armsOpen || intent.handsTogether || intent.crouch;
          if (key === "love") return intent.armsOpen || intent.handsTogether || intent.star;
          if (key === "esteem") return intent.jump || intent.armsUp || intent.thumbUp || intent.energy > 0.76;
          if (key === "actual") return intent.point || intent.armsOpen || intent.armsUp || intent.star;
          if (key === "beyond") return intent.star || intent.jump || intent.armsUp || intent.armsOpen || intent.handsTogether || intent.energy > 0.72;
        }
        if (key === "intro") return intent.open || intent.pinch || intent.victory || intent.thumbUp;
        if (key === "body") return intent.fist || intent.pinch || intent.open;
        if (key === "safety") return intent.open || intent.fist;
        if (key === "love") return intent.love || intent.pinch || intent.open;
        if (key === "esteem") return intent.thumbUp || intent.victory || intent.pinch || intent.velocity > 58;
        if (key === "actual") return intent.point || intent.pinch || intent.open;
        if (key === "beyond") return intent.victory || intent.love || intent.pinch || intent.velocity > 64;
        return intent.pinch;
      }

      function isGestureHoldDown(intent) {
        const key = LEVELS[state.levelIndex].key;
        if (key === "intro") return intent.open || intent.pinch || intent.victory || intent.thumbUp;
        if (key === "safety") return intent.open || intent.fist;
        if (key === "actual") return intent.point || intent.pinch || intent.open;
        return isGestureActionDown(intent);
      }

      function gestureControlPoint(intent) {
        const key = LEVELS[state.levelIndex].key;
        if (intent.source === "pose" && (key === "body" || key === "safety" || key === "beyond")) return { x: intent.centerX, y: intent.centerY };
        if (key === "safety" || key === "body") return { x: intent.palmX, y: intent.palmY };
        if (key === "beyond" && intent.open) return { x: intent.palmX, y: intent.palmY };
        return { x: intent.x, y: intent.y };
      }

      function pointerFromEvent(event) {
        pointerFromClient(event.clientX, event.clientY);
      }

      function pointerFromClient(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        state.pointer.x = clientX - rect.left;
        state.pointer.y = clientY - rect.top;
        state.pointer.seen = true;
      }

      canvas.addEventListener("pointermove", pointerFromEvent);
      canvas.addEventListener("pointerdown", (event) => {
        pointerFromEvent(event);
        state.pointer.active = true;
        state.input.just = true;
        state.input.pointerJust = true;
        unlockAudio();
        canvas.setPointerCapture(event.pointerId);
      });
      canvas.addEventListener("pointerup", () => {
        state.pointer.active = false;
      });
      canvas.addEventListener("pointercancel", () => {
        state.pointer.active = false;
      });
      window.addEventListener("mousedown", (event) => {
        if (event.target.closest("button")) return;
        pointerFromClient(event.clientX, event.clientY);
        state.pointer.active = true;
        state.input.just = true;
        state.input.pointerJust = true;
        unlockAudio();
      });
      window.addEventListener("mouseup", () => {
        state.pointer.active = false;
      });
      window.addEventListener("touchstart", (event) => {
        if (event.target.closest("button")) return;
        const touch = event.touches[0];
        if (!touch) return;
        pointerFromClient(touch.clientX, touch.clientY);
        state.pointer.active = true;
        state.input.just = true;
        state.input.pointerJust = true;
        unlockAudio();
      }, { passive: true });
      window.addEventListener("touchend", () => {
        state.pointer.active = false;
      }, { passive: true });

      window.addEventListener("keydown", (event) => {
        if (["ArrowLeft", "a", "A"].includes(event.key)) state.input.left = true;
        if (["ArrowRight", "d", "D"].includes(event.key)) state.input.right = true;
        if (["ArrowUp", "w", "W"].includes(event.key)) state.input.up = true;
        if (["ArrowDown", "s", "S"].includes(event.key)) state.input.down = true;
        if (isSpace(event)) {
          if (!state.input.space) state.input.just = true;
          state.input.space = true;
          unlockAudio();
          event.preventDefault();
        }
      });

      window.addEventListener("keyup", (event) => {
        if (["ArrowLeft", "a", "A"].includes(event.key)) state.input.left = false;
        if (["ArrowRight", "d", "D"].includes(event.key)) state.input.right = false;
        if (["ArrowUp", "w", "W"].includes(event.key)) state.input.up = false;
        if (["ArrowDown", "s", "S"].includes(event.key)) state.input.down = false;
        if (isSpace(event)) state.input.space = false;
      });
      window.addEventListener("blur", () => {
        state.input.left = false;
        state.input.right = false;
        state.input.up = false;
        state.input.down = false;
        state.input.space = false;
        state.input.pointerJust = false;
        state.pointer.active = false;
      });

      startButton.addEventListener("click", startGame);
      againButton.addEventListener("click", startGame);
      restartButton.addEventListener("click", startGame);
      function requestCameraToggle(event) {
        if (event) event.preventDefault();
        const now = performance.now();
        if (now - lastCameraToggle < 250) return;
        lastCameraToggle = now;
        if (state.camera.loading) {
          stopHandControl({ skipUpdate: true });
          state.mode = "classic";
          setCameraStatus("classic controls");
          refreshStageCue();
          updateHud();
          return;
        }
        if (!state.camera.enabled) {
          state.mode = DEFAULT_MODE;
          refreshStageCue();
          updateHud();
          startHandControl(DEFAULT_CAMERA_TASK, { fallbackMode: "classic" });
          return;
        }
        if (state.camera.task === "gesture") {
          stopHandControl({ skipUpdate: true });
          state.mode = "body";
          refreshStageCue();
          updateHud();
          startHandControl("pose", { fallbackTask: "gesture", fallbackMode: "classic" });
          return;
        }
        stopHandControl({ skipUpdate: true });
        state.mode = "classic";
        setCameraStatus("classic controls");
        refreshStageCue();
        updateHud();
      }
      cameraButton.addEventListener("click", requestCameraToggle);
      cameraButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || isSpace(event)) requestCameraToggle(event);
      });
      soundButton.addEventListener("click", () => {
        state.muted = !state.muted;
        soundEngine.setMuted(state.muted);
        if (!state.muted) unlockAudio();
        updateHud();
      });
      window.addEventListener("resize", () => {
        resize();
        initLevel();
      });
      window.addEventListener("pagehide", stopHandControl);

      function updatePlayer(dt, canMove = true) {
        const player = state.player;
        if (!canMove) {
          player.x += (state.width * 0.5 - player.x) * Math.min(1, dt * 5);
          player.y += (state.height * 0.58 - player.y) * Math.min(1, dt * 5);
          return;
        }

        let ax = 0;
        let ay = 0;
        if (state.input.left) ax -= 1;
        if (state.input.right) ax += 1;
        if (state.input.up) ay -= 1;
        if (state.input.down) ay += 1;
        const keyboard = ax || ay;
        if (keyboard) {
          const len = Math.hypot(ax, ay) || 1;
          player.vx += (ax / len) * 740 * dt;
          player.vy += (ay / len) * 740 * dt;
        }
        if (state.pointer.seen && (state.pointer.active || !keyboard)) {
          const pull = state.pointer.active ? 16 : 9;
          player.vx += (state.pointer.x - player.x) * pull * dt;
          player.vy += (state.pointer.y - player.y) * pull * dt;
        }
        player.vx *= Math.pow(0.02, dt);
        player.vy *= Math.pow(0.02, dt);
        player.x += player.vx * dt;
        player.y += player.vy * dt;
        player.x = clamp(player.x, 22, state.width - 22);
        player.y = clamp(player.y, 86, state.height - 22);
      }

      function loop(now) {
        const rawDt = Math.min(0.033, (now - state.last) / 1000 || 0.016);
        const dt = reduceMotion ? Math.min(rawDt, 0.02) : rawDt;
        state.last = now;
        state.time += dt;
        motionSnapshot = director.update(now);
        riveBridge.setLevel(state.levelIndex, state.progress);
        tick(dt);
        draw();
        pixiLayer.update(dt, state, motionSnapshot);
        const level = LEVELS[state.levelIndex] || LEVELS[LEVELS.length - 1];
        riveBridge.drawFallback(now, { primary: level.color, secondary: level.color2 });
        state.input.just = false;
        state.input.pointerJust = false;
        loopRaf = requestAnimationFrame(loop);
      }

      function tick(dt) {
        state.shake = Math.max(0, state.shake - dt * 14);
        updateParticles(dt);

        if (!state.started || state.complete) {
          updateIdle(dt);
          return;
        }

        if (state.transitioning) {
          state.transitionTime += dt;
          updatePlayer(dt, false);
          const transitionDuration = state.transitionKind === "beyond" ? FINALE_TRANSITION_DURATION : LEVEL_TRANSITION_DURATION;
          if (state.transitionTime > transitionDuration) {
            state.transitioning = false;
            if (state.levelIndex >= LEVELS.length - 1) {
              finishGame();
            } else {
              state.levelIndex += 1;
              initLevel();
            }
          }
          return;
        }

        const level = LEVELS[state.levelIndex].key;
        state.cueTime += dt;
        if (level === "intro") tickIntro(dt);
        if (level === "body") tickBody(dt);
        if (level === "safety") tickSafety(dt);
        if (level === "love") tickLove(dt);
        if (level === "esteem") tickEsteem(dt);
        if (level === "actual") tickActual(dt);
        if (level === "beyond") tickBeyond(dt);
        updateHud();
      }

      function updateIdle(dt) {
        state.player.x += (state.width * 0.5 - state.player.x) * dt * 1.5;
        state.player.y += (state.height * 0.58 - state.player.y) * dt * 1.5;
        if (Math.random() < dt * 4) {
          spawnParticle(state.width * (0.25 + Math.random() * 0.5), state.height * (0.25 + Math.random() * 0.45), LEVELS[state.levelIndex].color, 1);
        }
      }

      function tickIntro(dt) {
        updatePlayer(dt, false);
        const held = state.pointer.active || state.input.space;
        const l = state.levelState;
        const intent = state.camera.intent;
        const inhaleSignal = intent && intent.source === "pose"
          ? intent.armsOpen || intent.star || intent.armsUp
          : intent && intent.source === "hand"
            ? intent.open || intent.love || intent.victory || intent.thumbUp
            : held;
        const exhaleSignal = intent && intent.source === "pose"
          ? intent.handsTogether || intent.shield || intent.crouch || (!intent.armsOpen && !intent.armsUp && !intent.star)
          : intent && intent.source === "hand"
            ? intent.fist || intent.pinch || (!intent.open && !intent.love)
            : !held;
        l.lastPhase = l.phase;
        l.phase = (l.phase + dt * INTRO_PHASE_SPEED) % 1;
        const inhaling = l.phase < 0.54;
        const correct = inhaling ? inhaleSignal : exhaleSignal;
        const justLooped = l.phase < l.lastPhase;
        if (justLooped && !l.cycleAwarded) {
          l.ready = false;
          l.inhaleCharge = 0;
          l.exhaleCharge = 0;
        }
        if (justLooped) l.cycleAwarded = false;
        l.breathPulse += dt * (correct ? 3.4 : 1.05);
        l.bloom = Math.max(0, l.bloom - dt * 1.6);
        l.missGlow = Math.max(0, l.missGlow - dt * 2.4);
        l.helpPulse += dt * 2.2;

        if (inhaling) {
          stageNote.textContent = state.mode === "body" ? "Breathe: open as ring opens" : state.mode === "hands" ? "Breathe: open hand" : "Breathe: hold as the ring opens";
          l.inhaleCharge = clamp(l.inhaleCharge + dt * (inhaleSignal ? 1.62 : -0.16), 0, 1);
          l.exhaleCharge = Math.max(0, l.exhaleCharge - dt * 0.4);
          if (state.input.just && inhaleSignal) {
            l.inhaleCharge = clamp(l.inhaleCharge + 0.28, 0, 1);
            spawnRipple(state.width * 0.5, state.height * 0.54, LEVELS[0].color, 92);
          }
          if (l.inhaleCharge >= 0.5) l.ready = true;
          if (!inhaleSignal && l.phase > 0.18 && Math.random() < dt * 5) l.missGlow = Math.max(l.missGlow, 0.35);
        } else {
          stageNote.textContent = state.mode === "body" ? "Breathe: close as ring settles" : state.mode === "hands" ? "Breathe: close hand" : "Breathe: release as the ring settles";
          if (l.ready) l.exhaleCharge = clamp(l.exhaleCharge + dt * (exhaleSignal ? 1.75 : -0.24), 0, 1);
          if (!exhaleSignal && l.ready && Math.random() < dt * 5) l.missGlow = Math.max(l.missGlow, 0.35);
        }

        if (l.ready && !l.cycleAwarded && l.exhaleCharge >= 0.48) {
          l.breaths += 1;
          l.bloom = 1;
          l.cycleAwarded = true;
          l.ready = false;
          l.inhaleCharge = 0;
          l.exhaleCharge = 0;
          spawnRipple(state.width * 0.5, state.height * 0.54, LEVELS[0].color2, 148);
          burst(state.width * 0.5, state.height * 0.54, LEVELS[0].color, 18);
          successTone(0, l.breaths, 0.12);
          buzz(8);
        }

        const partial = inhaling ? l.inhaleCharge * 0.42 : (l.ready ? 0.42 + l.exhaleCharge * 0.58 : 0);
        state.progress = clamp((l.breaths + partial) / INTRO_BREATHS, 0, 1);
        if (correct && Math.random() < dt * 8) {
          spawnRipple(state.width * 0.5, state.height * 0.54, inhaling ? LEVELS[0].color : LEVELS[0].color2, 35 + partial * 120);
        }
        if (state.progress >= 1) levelUp("intro");
      }

      function tickBody(dt) {
        updatePlayer(dt, true);
        const l = state.levelState;
        const intent = state.camera.intent;
        const handGather = intent && intent.source === "hand" && (intent.open || intent.fist || intent.pinch || intent.love);
        const bodyGather = intent && intent.source === "pose" && (intent.star || intent.crouch || intent.armsOpen || intent.jump || intent.handsTogether);
        const gatherOrigin = bodyGather
          ? { x: intent.centerX, y: intent.centerY }
          : handGather
            ? { x: intent.palmX, y: intent.palmY }
            : state.player;
        const gatherRange = bodyGather
          ? intent.star ? 460 : intent.jump ? 390 : intent.crouch ? 330 : intent.armsOpen ? 300 : 250
          : handGather
            ? 190 + intent.spread * 95 + (intent.pinch || intent.fist ? 38 : 0)
            : 0;
        const collectRange = bodyGather
          ? intent.star ? 210 : intent.jump ? 160 : intent.crouch ? 132 : 118
          : handGather
            ? 62 + intent.spread * 36 + (intent.pinch || intent.fist ? 32 : 0)
            : 0;
        const fullBodyGather = bodyGather ? gatherRange * 0.38 : 0;
        const starSurge = intent && intent.source === "pose" && intent.star && !l.starLock;
        const crouchSurge = intent && intent.source === "pose" && intent.crouch && !l.crouchLock;
        if (starSurge || crouchSurge) {
          const radius = starSurge ? 310 : 210;
          l.chainPulse = 1;
          l.items.forEach((item) => {
            if (!item.collected && dist(item, state.player) < radius) item.pull = starSurge ? 1.35 : 0.95;
          });
          spawnRipple(state.player.x, state.player.y, starSurge ? LEVELS[1].color2 : LEVELS[1].color, starSurge ? 220 : 145);
          successTone(1, starSurge ? 2 : 1, 0.08);
        }
        l.starLock = Boolean(intent && intent.source === "pose" && intent.star);
        l.crouchLock = Boolean(intent && intent.source === "pose" && intent.crouch);
        l.comboTimer = Math.max(0, l.comboTimer - dt);
        if (l.comboTimer <= 0) l.combo = 0;
        l.chainPulse = Math.max(0, l.chainPulse - dt * 2.3);
        l.items.forEach((item) => {
          if (item.collected) return;
          item.phase += dt;
          item.pull = Math.max(0, item.pull - dt * 1.8);
          const d = dist(item, state.player);
          const gatherDistance = gatherRange > 0 ? dist(item, gatherOrigin) : Infinity;
          const magnetRange = 128 + l.combo * 12 + (handGather ? 94 + intent.spread * 60 : 0) + fullBodyGather;
          if (gatherDistance < gatherRange) {
            const strength = (bodyGather ? 250 : 180) * Math.max(0.28, 1 - gatherDistance / Math.max(1, gatherRange));
            item.x += ((gatherOrigin.x - item.x) / Math.max(1, gatherDistance)) * strength * dt;
            item.y += ((gatherOrigin.y - item.y) / Math.max(1, gatherDistance)) * strength * dt;
            item.pull = Math.max(item.pull, bodyGather ? 0.7 : 0.45);
          } else if (d < magnetRange || item.pull > 0) {
            const strength = (item.pull > 0 ? 135 : handGather ? 112 : 46) * Math.max(0.2, 1 - d / magnetRange);
            item.x += ((state.player.x - item.x) / Math.max(1, d)) * strength * dt;
            item.y += ((state.player.y - item.y) / Math.max(1, d)) * strength * dt;
          } else {
            item.x += Math.cos(item.phase * 1.7 + item.kind) * dt * 12;
            item.y += Math.sin(item.phase * 1.3 + item.kind) * dt * 10;
          }
          const directHit = collectRange > 0 && dist(item, gatherOrigin) < item.r + collectRange;
          const hit = directHit || dist(item, state.player) < item.r + state.player.r;
          if (hit) {
            item.collected = true;
            l.collected += 1;
            l.combo = l.comboTimer > 0 ? Math.min(5, l.combo + 1) : 1;
            l.comboTimer = 1.2;
            l.chainPulse = 1;
            state.progress = l.collected / l.items.length;
            l.items.forEach((other) => {
              if (!other.collected && dist(other, item) < 92 + l.combo * 18 + (handGather ? 70 : 0) + fullBodyGather * 0.45) other.pull = 1;
            });
            burst(directHit ? gatherOrigin.x : item.x, directHit ? gatherOrigin.y : item.y, LEVELS[1].color, 18 + l.combo * 6);
            spawnRipple(directHit ? gatherOrigin.x : item.x, directHit ? gatherOrigin.y : item.y, bodyGather ? LEVELS[1].color2 : LEVELS[1].color, bodyGather ? 96 : 62);
            successTone(1, l.combo);
            buzz(8);
          }
        });
        if (state.progress >= 1) levelUp("body");
      }

      function tickSafety(dt) {
        updatePlayer(dt, true);
        const l = state.levelState;
        l.hazard += dt * 1.65;
        l.hitCooldown = Math.max(0, l.hitCooldown - dt);
        l.dangerFlash = Math.max(0, l.dangerFlash - dt * 2.8);
        l.bodySealPulse = Math.max(0, l.bodySealPulse - dt * 2.5);
        const intent = state.camera.intent;
        const bodyShielding = intent && intent.source === "pose" && (intent.shield || intent.armsOpen || intent.handsTogether || intent.crouch);
        const handShielding = intent && intent.source === "hand" && (intent.open || intent.fist || intent.pinch);
        const shielding = bodyShielding || handShielding || (intent && (intent.open || intent.fist || intent.shield));
        const sealOrigin = bodyShielding && intent
          ? { x: intent.centerX, y: intent.centerY }
          : handShielding && intent
            ? { x: intent.palmX, y: intent.palmY }
            : state.player;
        const sealRadius = bodyShielding && intent
          ? 150 + intent.spread * 124 + (intent.armsOpen ? 46 : 0)
          : handShielding && intent
            ? 96 + intent.spread * 72 + (intent.pinch || intent.fist ? 26 : 0)
            : 34;
        const sweepAngle = l.hazard;
        const cx = state.width * 0.5;
        const cy = state.height * 0.52;
        const playerAngle = Math.atan2(state.player.y - cy, state.player.x - cx);
        const sweepHit = Math.abs(angleDelta(playerAngle, sweepAngle)) < 0.09 && dist(state.player, { x: cx, y: cy }) < Math.min(state.width, state.height) * 0.34;
        if (sweepHit && l.hitCooldown <= 0) {
          l.hitCooldown = 0.85;
          if (shielding) {
            state.shake = Math.max(state.shake, 0.35);
            l.dangerFlash = 0.35;
            l.bodySealPulse = bodyShielding ? 1 : Math.max(l.bodySealPulse, 0.58);
            spawnRipple(sealOrigin.x, sealOrigin.y, LEVELS[2].color, bodyShielding ? 210 : 150);
            successTone(2, l.sealed + 1, 0.08);
          } else {
            state.shake = Math.max(state.shake, 1);
            l.dangerFlash = 1;
            state.player.vx += Math.cos(sweepAngle) * 180;
            state.player.vy += Math.sin(sweepAngle) * 180;
            const sealedNodes = l.nodes.filter((node) => node.active);
            if (sealedNodes.length) {
              const nearest = sealedNodes.reduce((best, node) => (dist(node, state.player) < dist(best, state.player) ? node : best), sealedNodes[0]);
              nearest.active = false;
              l.sealed = Math.max(0, l.sealed - 1);
              state.progress = l.sealed / l.nodes.length;
              burst(nearest.x, nearest.y, "#ff6b6b", 24);
            }
            failureTone(2);
            buzz([18, 22, 18]);
          }
        }
        l.nodes.forEach((node) => {
          if (!node.active && dist(node, sealOrigin) < sealRadius) {
            node.active = true;
            l.sealed += 1;
            l.bodySealPulse = bodyShielding ? 1 : Math.max(l.bodySealPulse, handShielding ? 0.52 : 0);
            state.progress = l.sealed / l.nodes.length;
            burst(node.x, node.y, LEVELS[2].color, 26);
            spawnRipple(node.x, node.y, LEVELS[2].color2, bodyShielding ? 112 : 76);
            successTone(2, l.sealed);
            buzz(12);
          }
        });
        if (state.progress >= 1) levelUp("safety");
      }

      function tickLove(dt) {
        updatePlayer(dt, true);
        const l = state.levelState;
        const intent = state.camera.intent;
        const poseThreading = intent && intent.source === "pose" && (intent.armsOpen || intent.handsTogether || intent.star || intent.love);
        const handThreading = intent && intent.source === "hand" && (intent.love || intent.open || intent.pinch);
        const drawing = state.pointer.active || state.input.space || Boolean(poseThreading || handThreading);
        const snapRange = poseThreading && intent
          ? 138 + intent.spread * 92 + (intent.star ? 60 : 0)
          : handThreading && intent
            ? 112 + intent.spread * 58 + (intent.love ? 34 : 0)
            : 82;
        l.snap = l.snap && l.snap.life > 0 ? { ...l.snap, life: l.snap.life - dt * 2.8 } : null;
        if (drawing) {
          l.thread.push({ x: state.player.x, y: state.player.y, life: 1 });
          if (l.thread.length > 150) l.thread.shift();
        }
        l.thread.forEach((point) => (point.life -= drawing ? dt * 0.18 : dt * 0.55));
        l.thread = l.thread.filter((point) => point.life > 0);

        const pointerRef = state.pointer.seen ? state.pointer : state.player;
        let snapCandidate = null;
        let snapDistance = Infinity;
        l.nodes.forEach((node, index) => {
          node.drift += dt;
          if (!node.linked) {
            node.x += Math.cos(node.drift + index) * dt * 7;
            node.y += Math.sin(node.drift * 1.3 + index) * dt * 7;
            const d = Math.min(dist(node, state.player), dist(node, pointerRef));
            if (d < snapDistance) {
              snapCandidate = node;
              snapDistance = d;
            }
          }
        });
        if (poseThreading && intent.pose && intent.pose.leftWrist && intent.pose.rightWrist) {
          l.nodes.forEach((node) => {
            if (node.linked) return;
            const d = distanceToSegment(node, intent.pose.leftWrist, intent.pose.rightWrist);
            const wristD = Math.min(dist(node, intent.pose.leftWrist), dist(node, intent.pose.rightWrist), dist(node, { x: intent.centerX, y: intent.centerY }));
            const bodyThreadDistance = Math.min(d, wristD);
            if (bodyThreadDistance < 118 + intent.spread * 62 && bodyThreadDistance < snapDistance) {
              snapCandidate = node;
              snapDistance = bodyThreadDistance;
            }
          });
        }
        if (drawing && snapCandidate && snapDistance < snapRange) {
          snapCandidate.linked = true;
          l.links += 1;
          l.order.push(snapCandidate);
          l.snap = { x: snapCandidate.x, y: snapCandidate.y, life: 1 };
          state.progress = l.links / l.nodes.length;
          state.player.vx += (snapCandidate.x - state.player.x) * 1.9;
          state.player.vy += (snapCandidate.y - state.player.y) * 1.9;
          spawnRipple(snapCandidate.x, snapCandidate.y, LEVELS[3].color, 90);
          burst(snapCandidate.x, snapCandidate.y, LEVELS[3].color, 26);
          successTone(3, l.links, 0.15);
          buzz([8, 18, 8]);
        }
        if (state.progress >= 1) levelUp("love");
      }

      function tickEsteem(dt) {
        updatePlayer(dt, false);
        const l = state.levelState;
        l.angle += dt * (1.48 + l.hits * 0.18 + Math.sin(state.time * 1.35) * 0.16);
        l.flash = Math.max(0, l.flash - dt * 3);
        l.lock = Math.max(0, l.lock - dt * 2.6);
        l.bodyStrikeCooldown = Math.max(0, l.bodyStrikeCooldown - dt);
        const intent = state.camera.intent;
        if (intent && intent.thumbDown) {
          l.angle -= dt * 0.55;
        }
        const bodyLift = intent && intent.source === "pose" && (intent.jump || intent.armsUp || intent.energy > 0.82);
        if (bodyLift) l.angle -= dt * (intent.armsUp ? 0.28 : 0.16);
        const bodyLiftTrigger = bodyLift && !l.bodyLiftLock;
        const bodyAutoStrike = bodyLift && l.bodyStrikeCooldown <= 0 && Math.abs(angleDelta(l.angle, l.target)) < 0.56;
        if (!bodyLift) l.bodyLiftLock = false;
        if (bodyLiftTrigger) l.bodyLiftLock = true;
        if (state.input.just || bodyLiftTrigger || bodyAutoStrike) {
          const diff = Math.abs(angleDelta(l.angle, l.target));
          const handPrecision = intent && (intent.thumbUp || intent.victory);
          const bodyPrecision = bodyLift ? 0.5 + clamp(intent.energy, 0, 1) * 0.1 : 0;
          if (diff < (bodyLift ? bodyPrecision : handPrecision ? 0.36 : 0.27)) {
            const hitTarget = l.target;
            l.hits += 1;
            l.flash = 1;
            l.lock = 1;
            l.bodyStrikeCooldown = bodyLift ? 0.62 : l.bodyStrikeCooldown;
            state.progress = l.hits / 6;
            burst(state.width * 0.5 + Math.cos(hitTarget) * 118, state.height * 0.52 + Math.sin(hitTarget) * 118, LEVELS[4].color, 34);
            successTone(4, l.hits, 0.12);
            if (l.hits < 6) l.target = l.targets[l.hits];
            buzz(15);
          } else if (!bodyAutoStrike) {
            state.shake = Math.max(state.shake, 0.5);
            failureTone(4);
          }
        }
        if (state.progress >= 1) levelUp("esteem");
      }

      function tickActual(dt) {
        updatePlayer(dt, true);
        const l = state.levelState;
        l.ink.push({ x: state.player.x, y: state.player.y, life: 1 });
        if (l.ink.length > 180) l.ink.shift();
        l.ink.forEach((dot) => (dot.life -= dt * 0.22));
        l.flow = Math.max(0, l.flow - dt * 2.2);
        const target = l.path[l.next];
        let reachedTarget = false;
        if (target) {
          const d = dist(target, state.player);
          const intent = state.camera.intent;
          const tracing = intent && (intent.point || intent.open || intent.pinch || intent.armsOpen || intent.armsUp || intent.star);
          const handReach = intent && intent.source === "hand" && tracing && dist(target, { x: intent.x, y: intent.y }) < (intent.point ? 122 : 96);
          const bodyReachDistance = intent && intent.source === "pose" && intent.pose
            ? Math.min(
              dist(target, { x: intent.x, y: intent.y }),
              intent.pose.leftWrist ? dist(target, intent.pose.leftWrist) : Infinity,
              intent.pose.rightWrist ? dist(target, intent.pose.rightWrist) : Infinity,
              dist(target, { x: intent.centerX, y: intent.centerY })
            )
            : Infinity;
          const bodyReach = intent && intent.source === "pose" && tracing && bodyReachDistance < (intent.star || intent.armsUp ? 172 : 132);
          const range = tracing ? (intent && intent.source === "pose" ? 220 : 166) : 115;
          if (d < range) {
            const pull = (1 - d / range) * (tracing ? 92 : 60);
            state.player.vx += ((target.x - state.player.x) / Math.max(1, d)) * pull * dt;
            state.player.vy += ((target.y - state.player.y) / Math.max(1, d)) * pull * dt;
          }
          if (bodyReach || handReach) {
            reachedTarget = true;
            state.player.vx += (target.x - state.player.x) * dt * 7;
            state.player.vy += (target.y - state.player.y) * dt * 7;
          }
        }
        if (target && (reachedTarget || dist(target, state.player) < 42)) {
          burst(target.x, target.y, LEVELS[5].color, 26);
          successTone(5, l.next, 0.11);
          l.next += 1;
          l.flow = 1;
          state.progress = l.next / l.path.length;
        }
        if (state.progress >= 1) levelUp("actual");
      }

      function tickBeyond(dt) {
        updatePlayer(dt, true);
        const l = state.levelState;
        const cx = state.width * 0.5;
        const cy = state.height * 0.52;
        l.recapFlash = Math.max(0, l.recapFlash - dt * 2.4);
        l.centerPulse = Math.max(0, l.centerPulse - dt * 2.8);
        l.hitFlash = Math.max(0, l.hitFlash - dt * 2.6);
        l.missFlash = Math.max(0, l.missFlash - dt * 2.1);
        l.pulseCooldown = Math.max(0, l.pulseCooldown - dt);
        if (l.lastTap) {
          l.lastTap.life -= dt * 2.8;
          if (l.lastTap.life <= 0) l.lastTap = null;
        }
        l.echoes.forEach((echo) => {
          echo.life -= dt * 0.7;
          echo.r += dt * (118 + echo.tierIndex * 16);
        });
        l.echoes = l.echoes.filter((echo) => echo.life > 0);
        l.beams.forEach((beam) => (beam.life -= dt * 1.15));
        l.beams = l.beams.filter((beam) => beam.life > 0);

        const intent = state.camera.intent;
        const fullBodyPulse = intent && intent.source === "pose" && (intent.star || intent.jump || intent.armsUp || intent.armsOpen || intent.handsTogether);
        const handPulse = intent && intent.source === "hand" && (intent.victory || intent.love || intent.pinch || intent.open || intent.velocity > 64);
        const autoPulse = l.current < l.beacons.length && l.pulseCooldown <= 0 && (fullBodyPulse || handPulse);

        if ((state.input.just || autoPulse) && l.current < l.beacons.length) {
          l.ritual = true;
          l.centerPulse = 1;
          const active = l.beacons[l.current];
          const gesturePulse = intent && (intent.victory || intent.love || intent.velocity > 64 || fullBodyPulse || handPulse);
          const usingPointerTap = gesturePulse || state.input.pointerJust || (state.pointer.active && state.pointer.seen && !state.input.space);
          const tap = usingPointerTap
            ? { x: state.pointer.x, y: state.pointer.y }
            : { x: state.player.x || cx, y: state.player.y || cy };
          const nearActive = Boolean(fullBodyPulse) || dist(tap, active) < BEYOND_TAP_RADIUS + (gesturePulse ? 56 : 0);
          const origin = fullBodyPulse || nearActive ? { x: active.x, y: active.y } : tap;
          l.lastTap = { x: tap.x, y: tap.y, life: 1, ok: nearActive };
          state.waves.push({ x: origin.x, y: origin.y, r: 6, life: 1.05, hit: new Set(), target: l.current, missed: false });
          if (autoPulse) l.pulseCooldown = fullBodyPulse ? 0.58 : 0.46;
          tone(nearActive ? 238 + l.current * 26 : 176, 0.2, "sine", nearActive ? 0.038 : 0.024);
          buzz(nearActive ? 8 : 5);
        }

        state.waves.forEach((wave) => {
          wave.r += dt * 330;
          wave.life -= dt * 0.68;
        });
        if (l.current < l.beacons.length) {
          const active = l.beacons[l.current];
          state.waves.forEach((wave) => {
            if (wave.target !== l.current || wave.hit.has(l.current)) return;
            const delta = Math.abs(dist(active, wave) - wave.r);
            const waveInside = wave.r < Math.max(state.width, state.height) * 0.7;
            if (delta < 18 && waveInside) {
              wave.hit.add(l.current);
              active.pulses += 1;
              active.charge = clamp(active.pulses / BEYOND_BEACON_PULSES, 0, 1);
              l.hitFlash = 1;
              l.centerPulse = 1;
              l.echoes.push({ x: active.x, y: active.y, r: 12 + active.pulses * 5, life: 0.58, tierIndex: active.tierIndex });
              burst(active.x, active.y, LEVELS[active.tierIndex].color, 12 + active.pulses * 6);
              successTone(active.tierIndex, active.pulses, 0.12);
              buzz(active.pulses >= BEYOND_BEACON_PULSES ? [8, 18, 8] : 8);
              if (active.pulses >= BEYOND_BEACON_PULSES) {
                awakenBeyondBeacon(l.current);
                l.current += 1;
              }
            }
          });
        }
        state.waves.forEach((wave) => {
          if (wave.life <= 0 && !wave.missed && wave.hit.size === 0 && wave.target === l.current) {
            wave.missed = true;
            l.missFlash = 1;
            failureTone(6, l.current);
          }
        });
        state.waves = state.waves.filter((wave) => wave.life > 0);

        l.beacons.forEach((beacon, index) => {
          if (!beacon.awake && index !== l.current) beacon.charge = Math.max(0, beacon.charge - dt * 0.08);
        });

        if (!l.ritual) stageNote.textContent = state.mode === "body" ? "Release: star the lit symbol" : "Release: tap the lit symbol";
        else if (l.current < l.beacons.length) {
          const active = l.beacons[l.current];
          stageNote.textContent = state.mode === "body"
            ? `${LEVELS[active.tierIndex].verb}: star ${active.pulses + 1}/${BEYOND_BEACON_PULSES}`
            : `${LEVELS[active.tierIndex].verb}: tap lit symbol ${active.pulses + 1}/${BEYOND_BEACON_PULSES}`;
        }
        if (l.current >= l.beacons.length) stageNote.textContent = "Release: all tiers awake";
        const activeCharge = l.current < l.beacons.length ? l.beacons[l.current].charge : 0;
        state.progress = (l.current + activeCharge) / l.beacons.length;
        if (state.progress >= 1) levelUp("beyond");
      }

      function awakenBeyondBeacon(index) {
        const l = state.levelState;
        const beacon = l.beacons[index];
        const previous = index > 0 ? l.beacons[index - 1] : { x: state.width * 0.5, y: state.height * 0.52 };
        beacon.awake = true;
        beacon.charge = 1;
        l.recapFlash = 1;
        l.centerPulse = 1;
        l.echoes.push({ x: beacon.x, y: beacon.y, r: 18, life: 1, tierIndex: beacon.tierIndex });
        l.beams.push({ x1: previous.x, y1: previous.y, x2: beacon.x, y2: beacon.y, life: 1, tierIndex: beacon.tierIndex });
        state.waves.push({ x: beacon.x, y: beacon.y, r: 6, life: 0.9, hit: new Set() });
        burst(beacon.x, beacon.y, LEVELS[beacon.tierIndex].color, 24 + index * 5);
        successTone(beacon.tierIndex, index, 0.16);
        buzz(index % 2 ? [8, 18, 8] : 12);
      }

      function levelUp(kind) {
        if (state.transitioning) return;
        const level = LEVELS[state.levelIndex];
        state.transitioning = true;
        state.transitionKind = kind;
        state.transitionTime = 0;
        state.progress = 1;
        state.shake = 1.2;
        stageNote.textContent = level.completionMoment;
        if (kind === "beyond") {
          director.transcend();
          soundEngine.transcend();
          riveBridge.transcend();
          pixiLayer.burst({ x: state.width * 0.5, y: state.height * 0.52, color: level.color2, count: 132, kind: "transcend" });
        } else {
          director.levelUp(level.key, state.levelIndex);
          soundEngine.levelUp(level.successMotif, state.levelIndex);
          riveBridge.pulse(state.levelIndex);
          pixiLayer.burst({ x: state.width * 0.5, y: state.height * 0.52, color: level.color, count: 78, kind: "level" });
        }
        for (let i = 0; i < 110; i++) {
          spawnParticle(state.width * 0.5, state.height * 0.52, level.color, 1.2 + Math.random() * 1.9, true);
        }
        successTone(state.levelIndex, 0, 0.16);
        setTimeout(() => successTone(state.levelIndex, 2, 0.18), 80);
        buzz([12, 28, 18]);
        updateHud();
      }

      function finishGame() {
        state.complete = true;
        state.transitioning = false;
        setOverlayOpen(completeOverlay, true);
        state.progress = 1;
        updateHud();
      }

      function updateParticles(dt) {
        state.particles.forEach((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= Math.pow(0.16, dt);
          p.vy *= Math.pow(0.16, dt);
          p.life -= dt * p.decay;
          p.spin += dt * p.twist;
        });
        state.particles = state.particles.filter((p) => p.life > 0);
        state.ripples.forEach((r) => {
          r.r += dt * r.speed;
          r.life -= dt * 0.72;
        });
        state.ripples = state.ripples.filter((r) => r.life > 0);
      }

      function draw() {
        const w = state.width;
        const h = state.height;
        ctx.clearRect(0, 0, w, h);
        const shakeX = (Math.random() - 0.5) * state.shake * 8;
        const shakeY = (Math.random() - 0.5) * state.shake * 8;
        ctx.save();
        ctx.translate(shakeX, shakeY);
        if (motionSnapshot.active || motionSnapshot.surge) {
          ctx.translate(w * 0.5 + motionSnapshot.cameraX, h * 0.5 + motionSnapshot.cameraY);
          ctx.rotate(motionSnapshot.rotate);
          ctx.scale(motionSnapshot.zoom, motionSnapshot.zoom);
          ctx.translate(-w * 0.5, -h * 0.5);
        }
        drawAtmosphere();

        if (!state.started || state.complete) {
          drawIdleMark();
        } else {
          const level = LEVELS[state.levelIndex].key;
          if (level === "intro") drawIntro();
          if (level === "body") drawBody();
          if (level === "safety") drawSafety();
          if (level === "love") drawLove();
          if (level === "esteem") drawEsteem();
          if (level === "actual") drawActual();
          if (level === "beyond") drawBeyond();
          drawGestureCue(level, state.cueTime);
          drawCameraAffordance(level);
          drawPlayer();
          if (state.transitioning) drawLevelUp(state.transitionKind, state.transitionTime);
        }

        drawRipples();
        drawParticles();
        drawHandControl();
        ctx.restore();
      }

      function drawAtmosphere() {
        const level = LEVELS[state.levelIndex] || LEVELS[0];
        const w = state.width;
        const h = state.height;
        const grd = ctx.createRadialGradient(w * 0.5, h * 0.42, 10, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
        grd.addColorStop(0, withAlpha(level.color, 0.13));
        grd.addColorStop(0.55, withAlpha(level.color2, 0.05));
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.globalAlpha = 0.13;
        ctx.strokeStyle = level.color;
        ctx.lineWidth = 1;
        const gap = 42;
        const drift = (state.time * 18) % gap;
        for (let x = -gap; x < w + gap; x += gap) {
          line(x + drift, 0, x - h * 0.18 + drift, h);
        }
        ctx.restore();
      }

      function drawIntro() {
        const l = state.levelState;
        const cx = state.width * 0.5;
        const cy = state.height * 0.54;
        const pulse = 0.5 + Math.sin(l.breathPulse * Math.PI) * 0.5;
        const inhaling = (l.phase || 0) < 0.54;
        const guide = inhaling ? (l.phase || 0) / 0.54 : 1 - ((l.phase || 0) - 0.54) / 0.46;
        const charge = inhaling ? l.inhaleCharge : l.exhaleCharge;
        drawPyramid(cx, cy + 76, 260, 210, withAlpha(LEVELS[0].color, 0.34), 1);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        if (l.missGlow > 0) {
          ctx.fillStyle = withAlpha("#ff6b6b", l.missGlow * 0.12);
          ctx.beginPath();
          ctx.arc(cx, cy, 168 + l.missGlow * 18, 0, TAU);
          ctx.fill();
        }
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, 42 + i * 28 + pulse * 8 + l.breaths * 7, 0, Math.PI * 2);
          ctx.strokeStyle = withAlpha(LEVELS[0].color, 0.26 - i * 0.045);
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.strokeStyle = withAlpha(inhaling ? LEVELS[0].color2 : LEVELS[0].color, 0.44 + charge * 0.28);
        ctx.lineWidth = inhaling ? 5 + charge * 3 : 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 48 + clamp(guide, 0, 1) * 96, 0, TAU);
        ctx.stroke();
        const cueAlpha = 0.24 + Math.sin(l.helpPulse * TAU) * 0.08;
        ctx.strokeStyle = withAlpha(inhaling ? LEVELS[0].color2 : LEVELS[0].color, cueAlpha);
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const a = i * TAU / 8 + (inhaling ? guide : -guide) * 0.6;
          const inner = inhaling ? 24 + guide * 28 : 76 - guide * 34;
          const outer = inhaling ? 58 + guide * 72 : 142 - guide * 70;
          line(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner, cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
        }
        ctx.fillStyle = withAlpha(inhaling ? LEVELS[0].color : LEVELS[0].color2, 0.08 + charge * 0.13);
        ctx.beginPath();
        ctx.arc(cx, cy, 30 + charge * 48, 0, TAU);
        ctx.fill();
        if (l.bloom > 0) {
          ctx.fillStyle = withAlpha(LEVELS[0].color2, l.bloom * 0.18);
          ctx.beginPath();
          ctx.arc(cx, cy, 38 + l.bloom * 78, 0, TAU);
          ctx.fill();
        }
        for (let i = 0; i < INTRO_BREATHS; i++) {
          const a = -Math.PI / 2 + i * TAU / INTRO_BREATHS;
          const done = i < l.breaths;
          ctx.strokeStyle = done ? LEVELS[0].color2 : withAlpha(LEVELS[0].color, 0.22);
          ctx.lineWidth = done ? 2.4 : 1.2;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * 116, cy + Math.sin(a) * 84, done ? 9 : 6, 0, TAU);
          ctx.stroke();
        }
        drawLeaf(cx, cy, 28 + l.breaths * 3 + charge * 10 + guide * 5, inhaling ? LEVELS[0].color2 : LEVELS[0].color);
        ctx.restore();
      }

      function drawBody() {
        const l = state.levelState;
        drawBasePyramid(1);
        if (l.combo > 1 && l.comboTimer > 0) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.strokeStyle = withAlpha(LEVELS[1].color2, Math.min(0.5, l.comboTimer * 0.42));
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(state.player.x, state.player.y, 34 + l.combo * 8 + l.chainPulse * 18, 0, TAU);
          ctx.stroke();
          ctx.restore();
        }
        l.items.forEach((item) => {
          if (item.collected) return;
          const pulse = 1 + Math.sin(state.time * 4 + item.phase) * 0.12;
          if (item.pull > 0) {
            softLine(item.x, item.y, state.player.x, state.player.y, item.kind === 1 ? LEVELS[1].color2 : LEVELS[1].color, 0.08 + item.pull * 0.18);
          }
          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.scale(pulse + item.pull * 0.18, pulse + item.pull * 0.18);
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = withAlpha(item.kind === 0 ? LEVELS[1].color : item.kind === 1 ? LEVELS[1].color2 : "#eef4e4", 0.18);
          ctx.beginPath();
          ctx.arc(0, 0, item.r * 1.9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = item.kind === 0 ? LEVELS[1].color : item.kind === 1 ? LEVELS[1].color2 : "#eef4e4";
          ctx.lineWidth = 2;
          if (item.kind === 0) {
            ctx.beginPath();
            ctx.moveTo(0, -item.r);
            ctx.bezierCurveTo(item.r, 0, item.r * 0.65, item.r, 0, item.r);
            ctx.bezierCurveTo(-item.r * 0.65, item.r, -item.r, 0, 0, -item.r);
            ctx.stroke();
          } else if (item.kind === 1) {
            ctx.beginPath();
            ctx.arc(0, 0, item.r * 0.74, 0, Math.PI * 2);
            ctx.moveTo(-item.r, 0);
            ctx.lineTo(item.r, 0);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(-item.r, item.r * 0.6);
            ctx.quadraticCurveTo(0, -item.r * 1.2, item.r, item.r * 0.6);
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      function drawSafety() {
        const l = state.levelState;
        const intent = state.camera.intent;
        const cx = state.width * 0.5;
        const cy = state.height * 0.52;
        drawBasePyramid(2);
        ctx.save();
        ctx.strokeStyle = withAlpha(LEVELS[2].color, 0.28);
        ctx.lineWidth = 2;
        ctx.beginPath();
        l.nodes.forEach((node, index) => {
          if (index === 0) ctx.moveTo(node.x, node.y);
          else ctx.lineTo(node.x, node.y);
        });
        ctx.closePath();
        ctx.stroke();
        l.nodes.forEach((node) => {
          ctx.fillStyle = node.active ? withAlpha(LEVELS[2].color, 0.35) : l.dangerFlash > 0 ? withAlpha("#ff6b6b", l.dangerFlash * 0.12) : "rgba(244,241,232,0.08)";
          ctx.strokeStyle = node.active ? LEVELS[2].color : "rgba(244,241,232,0.32)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.active ? 17 : 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          drawShield(node.x, node.y, node.active ? 10 : 8, node.active ? LEVELS[2].color : "rgba(244,241,232,0.7)");
        });
        const endX = cx + Math.cos(l.hazard) * Math.min(state.width, state.height) * 0.38;
        const endY = cy + Math.sin(l.hazard) * Math.min(state.width, state.height) * 0.38;
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = withAlpha("#ff6b6b", 0.64 + l.dangerFlash * 0.26);
        ctx.lineWidth = 7 + l.dangerFlash * 5;
        line(cx, cy, endX, endY);
        ctx.strokeStyle = withAlpha("#fff2de", 0.4);
        ctx.lineWidth = 1;
        line(cx, cy, endX, endY);
        if (intent && intent.source === "pose" && (intent.shield || intent.armsOpen || l.bodySealPulse > 0)) {
          const core = intent.pose && intent.pose.bodyCenter ? intent.pose.bodyCenter : state.player;
          ctx.strokeStyle = withAlpha(LEVELS[2].color2, 0.28 + l.bodySealPulse * 0.34);
          ctx.fillStyle = withAlpha(LEVELS[2].color, 0.06 + l.bodySealPulse * 0.08);
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.ellipse(core.x, core.y, 82 + l.bodySealPulse * 34, 56 + l.bodySealPulse * 24, 0, 0, TAU);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      function drawLove() {
        const l = state.levelState;
        const intent = state.camera.intent;
        drawBasePyramid(3);
        ctx.save();
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = withAlpha(LEVELS[3].color, 0.5);
        for (let i = 1; i < l.order.length; i++) {
          softLine(l.order[i - 1].x, l.order[i - 1].y, l.order[i].x, l.order[i].y, LEVELS[3].color, 0.24 + i * 0.025);
        }
        for (let i = 1; i < l.thread.length; i++) {
          const a = l.thread[i - 1];
          const b = l.thread[i];
          softLine(a.x, a.y, b.x, b.y, LEVELS[3].color2, Math.max(0.04, Math.min(a.life, b.life) * 0.18));
        }
        if (state.pointer.active || state.input.space) {
          softLine(state.player.x, state.player.y, state.pointer.seen ? state.pointer.x : state.player.x, state.pointer.seen ? state.pointer.y : state.player.y, LEVELS[3].color2, 0.34);
        }
        if (intent && intent.source === "pose" && intent.pose && intent.pose.leftWrist && intent.pose.rightWrist && (intent.armsOpen || intent.love)) {
          softLine(intent.pose.leftWrist.x, intent.pose.leftWrist.y, intent.pose.rightWrist.x, intent.pose.rightWrist.y, LEVELS[3].color2, 0.3);
        }
        if (l.snap) {
          ctx.strokeStyle = withAlpha(LEVELS[3].color2, l.snap.life * 0.56);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(l.snap.x, l.snap.y, 22 + (1 - l.snap.life) * 34, 0, TAU);
          ctx.stroke();
        }
        l.nodes.forEach((node, index) => {
          const s = node.linked ? 1.16 + Math.sin(state.time * 5 + index) * 0.08 : 1;
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.scale(s, s);
          drawHeart(0, 0, node.linked ? 17 : 13, node.linked ? LEVELS[3].color : "rgba(244,241,232,0.58)");
          ctx.restore();
        });
        ctx.restore();
      }

      function drawEsteem() {
        const l = state.levelState;
        const cx = state.width * 0.5;
        const cy = state.height * 0.52;
        const r = Math.min(132, Math.min(state.width, state.height) * 0.24);
        drawBasePyramid(4);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = withAlpha(LEVELS[4].color, 0.26);
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, r + i * 20, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.rotate(l.target);
        ctx.strokeStyle = LEVELS[4].color;
        ctx.lineWidth = 8 + l.lock * 8;
        ctx.beginPath();
        ctx.arc(0, 0, r, -0.14 - l.lock * 0.08, 0.14 + l.lock * 0.08);
        ctx.stroke();
        if (l.lock > 0) {
          ctx.strokeStyle = withAlpha(LEVELS[4].color2, l.lock * 0.6);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, r + 16 + l.lock * 22, -0.2, 0.2);
          ctx.stroke();
        }
        ctx.rotate(-l.target);
        const ox = Math.cos(l.angle) * r;
        const oy = Math.sin(l.angle) * r;
        ctx.fillStyle = withAlpha(LEVELS[4].color, 0.2);
        ctx.beginPath();
        ctx.arc(ox, oy, 25, 0, Math.PI * 2);
        ctx.fill();
        drawStar(ox, oy, 18, LEVELS[4].color, true);
        for (let i = 0; i < 6; i++) {
          drawStar(-78 + i * 31, -r - 58, 9, i < l.hits ? LEVELS[4].color : "rgba(244,241,232,0.24)", i < l.hits);
        }
        if (l.flash > 0) {
          ctx.globalAlpha = l.flash * 0.24;
          ctx.fillStyle = LEVELS[4].color;
          ctx.beginPath();
          ctx.arc(0, 0, r * (1 + l.flash), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      function drawActual() {
        const l = state.levelState;
        drawBasePyramid(5);
        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = withAlpha(LEVELS[5].color, 0.24);
        ctx.beginPath();
        l.path.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.stroke();
        l.ink.forEach((dot, index) => {
          if (index === 0) return;
          const prev = l.ink[index - 1];
          ctx.strokeStyle = withAlpha(LEVELS[5].color, Math.max(0, dot.life) * 0.32);
          ctx.lineWidth = 4 * Math.max(0.2, dot.life);
          softLine(prev.x, prev.y, dot.x, dot.y, LEVELS[5].color, Math.max(0.08, dot.life * 0.28));
        });
        if (l.path[l.next]) {
          const target = l.path[l.next];
          softLine(state.player.x, state.player.y, target.x, target.y, LEVELS[5].color2, 0.12 + l.flow * 0.22);
          ctx.strokeStyle = withAlpha(LEVELS[5].color2, 0.18);
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(target.x, target.y, 42, 0, TAU);
          ctx.stroke();
        }
        l.path.forEach((point, index) => {
          const active = index === l.next;
          const done = index < l.next;
          ctx.fillStyle = done ? withAlpha(LEVELS[5].color, 0.32) : active ? withAlpha(LEVELS[5].color2, 0.24) : "rgba(244,241,232,0.08)";
          ctx.strokeStyle = done ? LEVELS[5].color : active ? LEVELS[5].color2 : "rgba(244,241,232,0.25)";
          ctx.beginPath();
          ctx.arc(point.x, point.y, active ? 17 + Math.sin(state.time * 5) * 3 : 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          drawLeaf(point.x, point.y, done ? 11 : 8, done ? LEVELS[5].color : "rgba(244,241,232,0.58)");
        });
        ctx.restore();
      }

      function drawBeyond() {
        const l = state.levelState;
        const cx = state.width * 0.5;
        const cy = state.height * 0.52;
        drawBasePyramid(6);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        state.waves.forEach((wave) => {
          const tier = l.beacons[wave.target] ? LEVELS[l.beacons[wave.target].tierIndex] : LEVELS[6];
          ctx.strokeStyle = withAlpha(tier.color, wave.life * 0.62);
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
          ctx.stroke();
        });
        l.echoes.forEach((echo) => drawTierEcho(echo));
        l.beams.forEach((beam) => {
          const tier = LEVELS[beam.tierIndex];
          softLine(beam.x1, beam.y1, beam.x2, beam.y2, tier.color, beam.life * 0.38);
        });
        const awake = l.beacons.filter((beacon) => beacon.awake);
        for (let i = 1; i < awake.length; i++) {
          const prev = awake[i - 1];
          const next = awake[i];
          softLine(prev.x, prev.y, next.x, next.y, LEVELS[next.tierIndex].color, 0.18 + l.recapFlash * 0.08);
        }
        if (l.missFlash > 0) {
          ctx.strokeStyle = withAlpha("#ff6b6b", l.missFlash * 0.5);
          ctx.lineWidth = 2;
          ctx.beginPath();
          const missX = l.lastTap ? l.lastTap.x : state.player.x;
          const missY = l.lastTap ? l.lastTap.y : state.player.y;
          ctx.arc(missX, missY, 34 + (1 - l.missFlash) * 56, 0, TAU);
          ctx.stroke();
        }
        if (l.lastTap) {
          ctx.strokeStyle = withAlpha(l.lastTap.ok ? LEVELS[6].color2 : "#ff6b6b", l.lastTap.life * 0.72);
          ctx.lineWidth = l.lastTap.ok ? 2.4 : 1.8;
          ctx.beginPath();
          ctx.arc(l.lastTap.x, l.lastTap.y, 18 + (1 - l.lastTap.life) * 34, 0, TAU);
          ctx.stroke();
        }
        drawMandala(cx, cy, 34 + state.progress * 34 + l.centerPulse * 18, withAlpha(LEVELS[6].color2, 0.34 + l.centerPulse * 0.45));
        l.beacons.forEach((beacon, index) => {
          const angle = state.time * 0.12 + index;
          const x = beacon.x + Math.cos(angle) * 6;
          const y = beacon.y + Math.sin(angle) * 6;
          const tier = LEVELS[beacon.tierIndex];
          const active = index === l.current && l.current < l.beacons.length;
          const previous = index > 0 ? l.beacons[index - 1] : { x: cx, y: cy };
          if (active) {
            const pulse = 0.5 + Math.sin(state.time * 5) * 0.5;
            softLine(previous.x, previous.y, x, y, tier.color, 0.12 + pulse * 0.22 + l.hitFlash * 0.16);
            const source = l.lastTap && l.lastTap.life > 0 ? l.lastTap : state.player;
            softLine(source.x, source.y, x, y, tier.color, 0.06 + pulse * 0.06 + (l.lastTap && l.lastTap.ok ? l.lastTap.life * 0.12 : 0));
          }
          softLine(cx, cy, x, y, active ? tier.color : LEVELS[6].color, 0.06 + beacon.charge * 0.16 + (active ? 0.08 : 0));
          ctx.fillStyle = withAlpha(active ? tier.color : LEVELS[6].color, 0.12 + beacon.charge * 0.34);
          ctx.beginPath();
          ctx.arc(x, y, 18 + beacon.charge * 12 + (active ? Math.sin(state.time * 5) * 3 + l.hitFlash * 10 : 0), 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = withAlpha(beacon.awake ? tier.color : LEVELS[6].color2, 0.26 + beacon.charge * 0.6 + (active ? 0.22 : 0));
          ctx.lineWidth = active ? 3 : 2;
          ctx.beginPath();
          ctx.arc(x, y, 19, 0, Math.PI * 2 * Math.max(0.03, beacon.charge));
          ctx.stroke();
          if (active || beacon.pulses > 0) {
            for (let pip = 0; pip < BEYOND_BEACON_PULSES; pip++) {
              const a = -Math.PI / 2 + pip * TAU / BEYOND_BEACON_PULSES;
              ctx.fillStyle = pip < beacon.pulses ? tier.color : withAlpha(LEVELS[6].color2, 0.22);
              ctx.beginPath();
              ctx.arc(x + Math.cos(a) * 32, y + Math.sin(a) * 32, pip < beacon.pulses ? 4.2 : 2.6, 0, TAU);
              ctx.fill();
            }
          }
          if (active) {
            ctx.strokeStyle = withAlpha(tier.color, 0.42 + l.hitFlash * 0.22);
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(x, y, 36 + Math.sin(state.time * 5) * 4 + l.hitFlash * 14, 0, TAU);
            ctx.stroke();
          }
          drawMiniGlyph(beacon.glyph, x, y, beacon.awake ? tier.color : "rgba(244,241,232,0.74)");
        });
        ctx.strokeStyle = withAlpha(LEVELS[6].color2, 0.25);
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, 52 + i * 18 + Math.sin(state.time + i) * 2 + l.recapFlash * 18, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      function drawTierEcho(echo) {
        const tier = LEVELS[echo.tierIndex];
        const alpha = Math.max(0, echo.life);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = withAlpha(tier.color, alpha * 0.58);
        ctx.fillStyle = withAlpha(tier.color, alpha * 0.1);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(echo.x, echo.y, echo.r, 0, TAU);
        ctx.fill();
        ctx.stroke();
        if (tier.key === "body") {
          for (let i = 0; i < 5; i++) {
            const a = i * TAU / 5 + state.time;
            drawLeaf(echo.x + Math.cos(a) * echo.r * 0.45, echo.y + Math.sin(a) * echo.r * 0.45, 9, withAlpha(tier.color, alpha));
          }
        } else if (tier.key === "safety") {
          for (let i = 0; i < 4; i++) {
            const a = Math.PI / 4 + i * TAU / 4;
            drawShield(echo.x + Math.cos(a) * echo.r * 0.38, echo.y + Math.sin(a) * echo.r * 0.38, 10, withAlpha(tier.color, alpha));
          }
        } else if (tier.key === "love") {
          for (let i = 0; i < 5; i++) {
            const a = -Math.PI / 2 + i * TAU / 5;
            drawHeart(echo.x + Math.cos(a) * echo.r * 0.42, echo.y + Math.sin(a) * echo.r * 0.3, 9, withAlpha(tier.color, alpha));
          }
        } else if (tier.key === "esteem") {
          for (let i = 0; i < 6; i++) {
            const a = i * TAU / 6 + state.time * 0.7;
            drawStar(echo.x + Math.cos(a) * echo.r * 0.36, echo.y + Math.sin(a) * echo.r * 0.36, 9, withAlpha(tier.color, alpha), true);
          }
        } else if (tier.key === "actual") {
          for (let i = 0; i < 4; i++) {
            const a = i * TAU / 4;
            drawLeaf(echo.x + Math.cos(a) * echo.r * 0.36, echo.y + Math.sin(a) * echo.r * 0.36, 11, withAlpha(tier.color, alpha));
          }
        } else {
          drawMandala(echo.x, echo.y, echo.r * 0.42, withAlpha(tier.color, alpha));
        }
        ctx.restore();
      }

      function drawGhostPlayer(x, y, color, alpha = 0.72) {
        const previousAlpha = ctx.globalAlpha;
        ctx.save();
        ctx.globalAlpha = previousAlpha * alpha;
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = withAlpha(color, 0.18);
        ctx.beginPath();
        ctx.arc(x, y, 26, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = "#fff8ea";
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, TAU);
        ctx.fill();
        ctx.restore();
      }

      function drawCameraAffordance(key) {
        if (!state.camera.enabled || state.transitioning || !state.started || state.complete) return;
        const intent = state.camera.intent;
        if (!intent) return;
        const level = LEVELS[state.levelIndex] || LEVELS[0];
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        if (intent.source === "pose") drawPoseAffordance(key, intent, level);
        else drawHandAffordance(key, intent, level);
        ctx.restore();
      }

      function drawHandAffordance(key, intent, level) {
        const x = intent.palmX || intent.x;
        const y = intent.palmY || intent.y;
        const active = isGestureHoldDown(intent);
        const action = isGestureActionDown(intent);
        const radius = handAffordanceRadius(key, intent);
        drawActionHalo(x, y, radius, action ? level.color2 : level.color, active ? 0.34 : 0.18);

        if (key === "body" && state.levelState.items) {
          state.levelState.items.forEach((item) => {
            if (item.collected) return;
            const d = dist(item, { x, y });
            if (d < radius * 1.12) {
              softLine(x, y, item.x, item.y, item.kind % 2 ? level.color2 : level.color, clamp(0.28 * (1 - d / (radius * 1.12)), 0.04, 0.28));
              ctx.strokeStyle = withAlpha(item.kind % 2 ? level.color2 : level.color, 0.22);
              ctx.beginPath();
              ctx.arc(item.x, item.y, item.r + 9 + Math.sin(state.time * 7 + item.kind) * 3, 0, TAU);
              ctx.stroke();
            }
          });
        } else if (key === "safety" && state.levelState.nodes) {
          drawShield(x, y, 22 + (action ? 7 : 0), withAlpha(level.color2, 0.88));
          state.levelState.nodes.forEach((node) => {
            if (node.active) return;
            const d = dist(node, { x, y });
            if (d < radius * 1.04) softLine(x, y, node.x, node.y, level.color2, clamp(0.32 * (1 - d / (radius * 1.04)), 0.05, 0.32));
          });
        } else if (key === "love" && state.levelState.nodes) {
          const next = nearestNode(state.levelState.nodes.filter((node) => !node.linked), { x: intent.x, y: intent.y });
          drawHeart(x, y, 14 + (action ? 4 : 0), withAlpha(level.color2, 0.9));
          if (next) softLine(intent.x, intent.y, next.x, next.y, level.color, 0.24);
        } else if (key === "esteem") {
          drawStar(intent.x, intent.y, 14 + (action ? 5 : 0), action ? level.color2 : level.color, true);
        } else if (key === "actual" && state.levelState.path) {
          const target = state.levelState.path[state.levelState.next];
          if (target) {
            softLine(intent.x, intent.y, target.x, target.y, level.color2, 0.26);
            drawLeaf(target.x, target.y, 16 + Math.sin(state.time * 6) * 3, level.color2);
          }
        } else if (key === "beyond" && state.levelState.beacons) {
          const beacon = state.levelState.beacons[state.levelState.current];
          if (beacon) {
            softLine(x, y, beacon.x, beacon.y, LEVELS[beacon.tierIndex].color, 0.22);
            drawMiniGlyph(beacon.glyph, beacon.x, beacon.y, LEVELS[beacon.tierIndex].color);
          }
        }
      }

      function drawPoseAffordance(key, intent, level) {
        const x = intent.centerX;
        const y = intent.centerY;
        const action = isGestureActionDown(intent);
        const radius = poseAffordanceRadius(key, intent);
        drawActionHalo(x, y, radius, action ? level.color2 : level.color, action ? 0.36 : 0.2);

        if (key === "body" && state.levelState.items) {
          state.levelState.items.forEach((item) => {
            if (item.collected) return;
            const d = dist(item, { x, y });
            if (d < radius * 1.08) softLine(x, y, item.x, item.y, item.kind % 2 ? level.color2 : level.color, clamp(0.3 * (1 - d / (radius * 1.08)), 0.05, 0.3));
          });
        } else if (key === "safety" && state.levelState.nodes) {
          drawShield(x, y, 42 + intent.spread * 18, withAlpha(level.color2, 0.76));
          state.levelState.nodes.forEach((node) => {
            if (node.active) return;
            const d = dist(node, { x, y });
            if (d < radius) softLine(x, y, node.x, node.y, level.color2, clamp(0.34 * (1 - d / radius), 0.06, 0.34));
          });
        } else if (key === "love" && intent.pose?.leftWrist && intent.pose?.rightWrist) {
          softLine(intent.pose.leftWrist.x, intent.pose.leftWrist.y, intent.pose.rightWrist.x, intent.pose.rightWrist.y, level.color2, 0.42);
          if (state.levelState.nodes) {
            state.levelState.nodes.forEach((node) => {
              if (node.linked) return;
              const d = distanceToSegment(node, intent.pose.leftWrist, intent.pose.rightWrist);
              if (d < 160) {
                ctx.strokeStyle = withAlpha(level.color, clamp(0.34 * (1 - d / 160), 0.05, 0.34));
                ctx.beginPath();
                ctx.arc(node.x, node.y, 20 + Math.sin(state.time * 6) * 3, 0, TAU);
                ctx.stroke();
              }
            });
          }
        } else if (key === "esteem") {
          const l = state.levelState;
          if (l && Number.isFinite(l.target)) {
            const tx = state.width * 0.5 + Math.cos(l.target) * 118;
            const ty = state.height * 0.52 + Math.sin(l.target) * 118;
            softLine(x, y, tx, ty, level.color2, 0.22);
            drawStar(tx, ty, 18 + l.flash * 7, level.color2, true);
          }
        } else if (key === "actual" && state.levelState.path) {
          const target = state.levelState.path[state.levelState.next];
          if (target) {
            const wrist = nearestPoint([intent.pose?.leftWrist, intent.pose?.rightWrist].filter(Boolean), target) || { x: intent.x, y: intent.y };
            softLine(wrist.x, wrist.y, target.x, target.y, level.color2, 0.3);
            drawLeaf(target.x, target.y, 18 + Math.sin(state.time * 7) * 4, level.color2);
          }
        } else if (key === "beyond" && state.levelState.beacons) {
          const beacon = state.levelState.beacons[state.levelState.current];
          if (beacon) {
            const tier = LEVELS[beacon.tierIndex];
            softLine(x, y, beacon.x, beacon.y, tier.color, 0.24);
            drawActionHalo(beacon.x, beacon.y, 46 + beacon.charge * 30, tier.color, 0.42);
          }
        }
      }

      function handAffordanceRadius(key, intent) {
        if (key === "body") return 100 + intent.spread * 74 + (intent.pinch || intent.fist ? 30 : 0);
        if (key === "safety") return 88 + intent.spread * 70 + (intent.pinch || intent.fist ? 22 : 0);
        if (key === "love") return 104 + intent.spread * 58;
        if (key === "actual") return intent.point ? 122 : 96;
        if (key === "beyond") return 86;
        return 58;
      }

      function poseAffordanceRadius(key, intent) {
        if (key === "body") return intent.star ? 230 : intent.jump ? 190 : intent.crouch ? 150 : 132;
        if (key === "safety") return 150 + intent.spread * 124 + (intent.armsOpen ? 46 : 0);
        if (key === "love") return 145 + intent.spread * 84;
        if (key === "actual") return intent.star || intent.armsUp ? 172 : 132;
        if (key === "beyond") return intent.star ? 170 : 126;
        return intent.armsOpen ? 118 : 74;
      }

      function drawActionHalo(x, y, radius, color, alpha) {
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(radius)) return;
        ctx.save();
        ctx.strokeStyle = withAlpha(color, alpha);
        ctx.fillStyle = withAlpha(color, alpha * 0.13);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([8, 10]);
        ctx.lineDashOffset = -state.time * 38;
        ctx.strokeStyle = withAlpha(color, alpha * 1.35);
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.72 + Math.sin(state.time * 4) * 5, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }

      function nearestNode(nodes, point) {
        if (!nodes.length) return null;
        return nodes.reduce((best, node) => (dist(node, point) < dist(best, point) ? node : best), nodes[0]);
      }

      function nearestPoint(points, target) {
        if (!points.length) return null;
        return points.reduce((best, point) => (dist(point, target) < dist(best, target) ? point : best), points[0]);
      }

      function drawGestureCue(key, t) {
        if (t > CUE_DURATION || state.transitioning) return;
        const level = LEVELS[state.levelIndex];
        const p = clamp(t / CUE_DURATION, 0, 1);
        const fade = p < 0.68 ? 1 : ease((1 - p) / 0.32);
        const cx = state.width * 0.5;
        const cy = state.height * 0.52;
        if (state.mode === "body") {
          drawBodyGestureCue(key, p, fade, cx, cy, level);
          return;
        }
        ctx.save();
        ctx.globalAlpha = fade * 0.88;
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = level.color2;
        ctx.fillStyle = withAlpha(level.color, 0.16);
        ctx.lineWidth = 2.6;

        if (key === "intro") {
          const cycle = (p * 1.75) % 1;
          const inhaling = cycle < 0.54;
          const q = inhaling ? cycle / 0.54 : 1 - (cycle - 0.54) / 0.46;
          const r = 44 + q * 78;
          ctx.strokeStyle = withAlpha(inhaling ? level.color2 : level.color, 0.64);
          ctx.lineWidth = inhaling ? 5 : 3;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, TAU);
          ctx.stroke();
          for (let i = 0; i < 8; i++) {
            const a = i * TAU / 8 + q * 0.45;
            const inner = inhaling ? 26 + q * 22 : 80 - q * 30;
            const outer = inhaling ? 58 + q * 70 : 142 - q * 76;
            line(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner, cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
          }
          const pressY = cy + 112 + (inhaling ? 0 : 22);
          drawGhostPlayer(cx, pressY, inhaling ? level.color2 : level.color, inhaling ? 0.82 : 0.32);
          softLine(cx, pressY, cx, cy + r * 0.34, inhaling ? level.color2 : level.color, inhaling ? 0.16 : 0.06);
          drawLeaf(cx, cy, 18 + q * 12, inhaling ? level.color2 : level.color);
        } else if (key === "body") {
          const items = [
            { x: cx - 88, y: cy + 30, kind: 0 },
            { x: cx - 38, y: cy - 36, kind: 1 },
            { x: cx + 28, y: cy + 18, kind: 2 },
            { x: cx + 86, y: cy - 24, kind: 0 }
          ];
          const route = [
            { x: cx - 112, y: cy + 44 },
            { x: cx - 52, y: cy - 26 },
            { x: cx + 16, y: cy + 28 },
            { x: cx + 78, y: cy - 18 },
            { x: cx + 112, y: cy + 34 }
          ];
          const travel = p * (route.length - 1);
          const segment = Math.min(route.length - 2, Math.floor(travel));
          const local = travel - segment;
          const a = route[segment];
          const b = route[segment + 1];
          const gx = a.x + (b.x - a.x) * local;
          const gy = a.y + (b.y - a.y) * local;
          items.forEach((item, index) => {
            const pulled = index <= travel;
            const ix = pulled ? item.x + (gx - item.x) * 0.34 : item.x;
            const iy = pulled ? item.y + (gy - item.y) * 0.34 : item.y;
            if (pulled) softLine(ix, iy, gx, gy, index % 2 ? level.color2 : level.color, 0.2);
            ctx.strokeStyle = index % 2 ? level.color2 : level.color;
            ctx.beginPath();
            ctx.arc(ix, iy, pulled ? 13 : 9, 0, TAU);
            ctx.stroke();
            if (item.kind === 0) drawLeaf(ix, iy, 8, level.color);
            if (item.kind === 1) drawMiniGlyph("body", ix, iy, level.color2);
          });
          drawGhostPlayer(gx, gy, level.color2, 0.78);
        } else if (key === "safety") {
          const nodes = Array.from({ length: 4 }, (_, i) => {
            const a = -Math.PI / 2 + i * TAU / 4;
            return { x: cx + Math.cos(a) * 72, y: cy + Math.sin(a) * 52, a };
          });
          const travel = p * nodes.length;
          const current = Math.min(nodes.length - 1, Math.floor(travel));
          const next = nodes[(current + 1) % nodes.length];
          const local = travel - current;
          const from = nodes[current];
          const gx = from.x + (next.x - from.x) * local;
          const gy = from.y + (next.y - from.y) * local;
          nodes.forEach((node, index) => {
            const sealed = index <= travel;
            drawShield(node.x, node.y, sealed ? 13 : 10, sealed ? level.color : "rgba(244,241,232,0.6)");
            if (sealed) {
              ctx.strokeStyle = withAlpha(level.color, 0.32);
              ctx.beginPath();
              ctx.arc(node.x, node.y, 22, 0, TAU);
              ctx.stroke();
            }
          });
          ctx.strokeStyle = withAlpha("#ff6b6b", 0.62);
          ctx.lineWidth = 4.5;
          const sweep = -Math.PI / 2 + p * TAU * 1.35;
          line(cx, cy, cx + Math.cos(sweep) * 108, cy + Math.sin(sweep) * 82);
          drawGhostPlayer(gx, gy, level.color2, 0.78);
        } else if (key === "love") {
          const hearts = [
            { x: cx - 70, y: cy + 28 },
            { x: cx - 18, y: cy - 38 },
            { x: cx + 46, y: cy - 8 },
            { x: cx + 78, y: cy + 38 }
          ];
          const travel = p * (hearts.length - 1);
          for (let i = 1; i < hearts.length; i++) {
            const a = hearts[i - 1];
            const b = hearts[i];
            const q = clamp(travel - (i - 1), 0, 1);
            softLine(a.x, a.y, a.x + (b.x - a.x) * q, a.y + (b.y - a.y) * q, level.color, 0.34);
          }
          const i = Math.min(hearts.length - 2, Math.floor(travel));
          const q = travel - i;
          const gx = hearts[i].x + (hearts[i + 1].x - hearts[i].x) * q;
          const gy = hearts[i].y + (hearts[i + 1].y - hearts[i].y) * q;
          hearts.forEach((heart, index) => drawHeart(heart.x, heart.y, index <= travel + 0.25 ? 14 : 11, index <= travel + 0.25 ? level.color : "rgba(244,241,232,0.6)"));
          drawGhostPlayer(gx, gy, level.color2, 0.68);
        } else if (key === "esteem") {
          const r = 64;
          const angle = -0.94 + p * TAU * 1.25;
          const sx = cx + Math.cos(angle) * r;
          const sy = cy + Math.sin(angle) * r;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, TAU);
          ctx.stroke();
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(cx, cy, r, -0.18, 0.18);
          ctx.stroke();
          drawStar(sx, sy, 12, level.color, true);
          if (Math.abs(angle) < 0.42 || p > 0.76) {
            ctx.strokeStyle = withAlpha(level.color2, 0.58);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sx, sy, 22 + Math.sin(p * TAU * 6) * 4, 0, TAU);
            ctx.stroke();
          }
        } else if (key === "actual") {
          const points = [
            { x: cx - 70, y: cy + 30 },
            { x: cx - 28, y: cy - 34 },
            { x: cx + 34, y: cy - 18 },
            { x: cx + 76, y: cy + 28 }
          ];
          const travel = p * (points.length - 1);
          for (let i = 1; i < points.length; i++) {
            const a = points[i - 1];
            const b = points[i];
            const q = clamp(travel - (i - 1), 0, 1);
            softLine(a.x, a.y, a.x + (b.x - a.x) * q, a.y + (b.y - a.y) * q, i % 2 ? level.color2 : level.color, 0.3);
          }
          const i = Math.min(points.length - 2, Math.floor(travel));
          const q = travel - i;
          const gx = points[i].x + (points[i + 1].x - points[i].x) * q;
          const gy = points[i].y + (points[i + 1].y - points[i].y) * q;
          points.forEach((point, index) => {
            const active = index === Math.min(points.length - 1, Math.ceil(travel));
            ctx.strokeStyle = active ? level.color2 : index <= travel ? level.color : "rgba(244,241,232,0.45)";
            ctx.beginPath();
            ctx.arc(point.x, point.y, active ? 15 : 9, 0, TAU);
            ctx.stroke();
            drawLeaf(point.x, point.y, active ? 10 : 7, ctx.strokeStyle);
          });
          drawGhostPlayer(gx, gy, level.color2, 0.7);
        } else if (key === "beyond") {
          const activeIndex = Math.min(5, Math.floor(p * 6));
          const activeAngle = -Math.PI / 2 + activeIndex * TAU / 6;
          const activeX = cx + Math.cos(activeAngle) * 86;
          const activeY = cy + Math.sin(activeAngle) * 64;
          for (let i = 0; i < 6; i++) {
            const a = -Math.PI / 2 + i * TAU / 6;
            const lit = i < activeIndex;
            const active = i === activeIndex;
            const x = cx + Math.cos(a) * 86;
            const y = cy + Math.sin(a) * 64;
            softLine(cx, cy, x, y, lit || active ? LEVELS[i + 1].color : LEVELS[6].color, lit ? 0.24 : active ? 0.32 : 0.07);
            drawMiniGlyph(LEVELS[i + 1].key, x, y, lit || active ? LEVELS[i + 1].color : "rgba(244,241,232,0.55)");
            if (active) {
              ctx.strokeStyle = withAlpha(LEVELS[i + 1].color, 0.54);
              ctx.lineWidth = 2.6;
              ctx.beginPath();
              ctx.arc(x, y, 24 + Math.sin(p * TAU * 5) * 4, 0, TAU);
              ctx.stroke();
            }
          }
          const pulses = Math.min(BEYOND_BEACON_PULSES, Math.floor((p * 6 - activeIndex) * (BEYOND_BEACON_PULSES + 1)));
          for (let i = 0; i < BEYOND_BEACON_PULSES; i++) {
            const a = -Math.PI / 2 + i * TAU / BEYOND_BEACON_PULSES;
            ctx.fillStyle = i < pulses ? LEVELS[activeIndex + 1].color : withAlpha(LEVELS[6].color2, 0.22);
            ctx.beginPath();
            ctx.arc(activeX + Math.cos(a) * 34, activeY + Math.sin(a) * 34, i < pulses ? 4.2 : 2.8, 0, TAU);
            ctx.fill();
          }
          drawGhostPlayer(activeX, activeY, LEVELS[activeIndex + 1].color2, 0.78);
          ctx.strokeStyle = withAlpha(LEVELS[activeIndex + 1].color2, 0.5);
          ctx.beginPath();
          ctx.arc(activeX, activeY, 38 + (p * 120) % 34, 0, TAU);
          ctx.stroke();
        }

        ctx.restore();
      }

      function drawBodyGestureCue(key, p, fade, cx, cy, level) {
        ctx.save();
        ctx.globalAlpha = fade * 0.9;
        ctx.globalCompositeOperation = "lighter";
        const pulse = 0.5 + Math.sin(p * TAU * 3) * 0.5;
        const travel = ease((p * 1.25) % 1);
        const ghostY = cy + 62 + Math.sin(p * TAU) * 8;

        if (key === "intro") {
          const open = (p * 2) % 1 < 0.55;
          const radius = open ? 56 + pulse * 38 : 116 - pulse * 42;
          ctx.strokeStyle = withAlpha(open ? level.color2 : level.color, 0.42);
          ctx.lineWidth = open ? 4 : 2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, TAU);
          ctx.stroke();
          drawPoseGlyph(cx, ghostY, 1.05, open ? "open" : "together", open ? level.color2 : level.color, 0.88);
        } else if (key === "body") {
          const pose = p < 0.48 ? "crouch" : "star";
          const r = 62 + travel * 118;
          for (let i = 0; i < 8; i++) {
            const a = i * TAU / 8 + p * 1.2;
            ctx.strokeStyle = withAlpha(i % 2 ? level.color2 : level.color, 0.22);
            ctx.lineWidth = 1.6;
            line(cx + Math.cos(a) * 32, ghostY + Math.sin(a) * 22, cx + Math.cos(a) * r, ghostY + Math.sin(a) * r * 0.55);
          }
          drawPoseGlyph(cx, ghostY, 1.06, pose, pose === "star" ? level.color2 : level.color, 0.9);
        } else if (key === "safety") {
          drawPoseGlyph(cx, ghostY, 1.04, p < 0.52 ? "shield" : "open", level.color2, 0.9);
          ctx.strokeStyle = withAlpha(level.color, 0.28 + pulse * 0.22);
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(cx, ghostY + 2, 90 + pulse * 20, 58 + pulse * 14, 0, 0, TAU);
          ctx.stroke();
          drawShield(cx, ghostY + 6, 42 + pulse * 8, withAlpha(level.color, 0.72));
        } else if (key === "love") {
          drawPoseGlyph(cx, ghostY, 1.04, "open", level.color2, 0.88);
          softLine(cx - 74, ghostY - 8, cx + 74, ghostY - 8, level.color2, 0.36);
          for (let i = 0; i < 4; i++) {
            const x = cx - 72 + i * 48 + Math.sin(p * TAU + i) * 4;
            drawHeart(x, ghostY - 10 + Math.cos(p * TAU + i) * 8, i <= p * 4 ? 11 : 8, i <= p * 4 ? level.color : "rgba(244,241,232,0.5)");
          }
        } else if (key === "esteem") {
          const lift = p % 1 > 0.42;
          drawPoseGlyph(cx, ghostY - (lift ? 18 + pulse * 10 : 0), 1.02, lift ? "up" : "ready", lift ? level.color2 : level.color, 0.9);
          ctx.strokeStyle = withAlpha(level.color, 0.32);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, 82, 0, TAU);
          ctx.stroke();
          drawStar(cx + Math.cos(-0.8 + p * TAU) * 82, cy + Math.sin(-0.8 + p * TAU) * 82, 14, level.color2, true);
        } else if (key === "actual") {
          const tx = cx + 78;
          const ty = cy - 28 + Math.sin(p * TAU) * 16;
          drawPoseGlyph(cx - 38, ghostY, 1.02, "reach", level.color2, 0.9);
          softLine(cx - 8, ghostY - 46, tx, ty, level.color2, 0.28);
          drawLeaf(tx, ty, 17 + pulse * 5, level.color);
        } else {
          drawPoseGlyph(cx, ghostY, 1.08, p < 0.46 ? "up" : "star", p < 0.46 ? level.color : level.color2, 0.9);
          for (let i = 0; i < 6; i++) {
            const a = -Math.PI / 2 + i * TAU / 6;
            const x = cx + Math.cos(a) * (82 + pulse * 16);
            const y = cy + Math.sin(a) * (62 + pulse * 11);
            softLine(cx, cy, x, y, LEVELS[i + 1].color, 0.16 + pulse * 0.08);
            drawMiniGlyph(LEVELS[i + 1].key, x, y, LEVELS[i + 1].color);
          }
        }
        ctx.restore();
      }

      function drawPoseGlyph(x, y, scale, pose, color, alpha = 1) {
        const s = 34 * scale;
        const points = {
          head: { x, y: y - s * 1.75 },
          neck: { x, y: y - s * 1.08 },
          hip: { x, y: y + s * 0.18 },
          leftFoot: { x: x - s * 0.46, y: y + s * 1.42 },
          rightFoot: { x: x + s * 0.46, y: y + s * 1.42 }
        };
        if (pose === "star") {
          points.leftHand = { x: x - s * 1.45, y: y - s * 0.76 };
          points.rightHand = { x: x + s * 1.45, y: y - s * 0.76 };
          points.leftFoot = { x: x - s * 1.05, y: y + s * 1.34 };
          points.rightFoot = { x: x + s * 1.05, y: y + s * 1.34 };
        } else if (pose === "up") {
          points.leftHand = { x: x - s * 0.5, y: y - s * 2.05 };
          points.rightHand = { x: x + s * 0.5, y: y - s * 2.05 };
        } else if (pose === "open") {
          points.leftHand = { x: x - s * 1.42, y: y - s * 0.95 };
          points.rightHand = { x: x + s * 1.42, y: y - s * 0.95 };
        } else if (pose === "shield") {
          points.leftHand = { x: x + s * 0.36, y: y - s * 0.72 };
          points.rightHand = { x: x - s * 0.36, y: y - s * 0.72 };
        } else if (pose === "reach") {
          points.leftHand = { x: x - s * 0.62, y: y - s * 0.48 };
          points.rightHand = { x: x + s * 1.5, y: y - s * 1.18 };
        } else if (pose === "crouch") {
          points.neck.y += s * 0.18;
          points.hip.y += s * 0.38;
          points.leftHand = { x: x - s * 0.86, y: y + s * 0.42 };
          points.rightHand = { x: x + s * 0.86, y: y + s * 0.42 };
          points.leftFoot = { x: x - s * 0.92, y: y + s * 1.28 };
          points.rightFoot = { x: x + s * 0.92, y: y + s * 1.28 };
        } else if (pose === "together") {
          points.leftHand = { x: x - s * 0.08, y: y - s * 0.56 };
          points.rightHand = { x: x + s * 0.08, y: y - s * 0.56 };
        } else {
          points.leftHand = { x: x - s * 0.82, y: y - s * 0.52 };
          points.rightHand = { x: x + s * 0.82, y: y - s * 0.52 };
        }

        ctx.save();
        ctx.globalAlpha *= alpha;
        ctx.strokeStyle = color;
        ctx.fillStyle = withAlpha(color, 0.16);
        ctx.lineWidth = Math.max(2, s * 0.08);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.arc(points.head.x, points.head.y, s * 0.24, 0, TAU);
        ctx.fill();
        ctx.stroke();
        line(points.neck.x, points.neck.y, points.hip.x, points.hip.y);
        line(points.neck.x, points.neck.y, points.leftHand.x, points.leftHand.y);
        line(points.neck.x, points.neck.y, points.rightHand.x, points.rightHand.y);
        line(points.hip.x, points.hip.y, points.leftFoot.x, points.leftFoot.y);
        line(points.hip.x, points.hip.y, points.rightFoot.x, points.rightFoot.y);
        if (pose === "shield" || pose === "together") {
          ctx.beginPath();
          ctx.arc((points.leftHand.x + points.rightHand.x) * 0.5, (points.leftHand.y + points.rightHand.y) * 0.5, s * 0.18, 0, TAU);
          ctx.stroke();
        }
        ctx.restore();
      }

      function drawPlayer() {
        const p = state.player;
        const level = LEVELS[state.levelIndex] || LEVELS[0];
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const pulse = 1 + Math.sin(state.time * 6) * 0.08;
        ctx.fillStyle = withAlpha(level.color, 0.14);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.4 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = level.color2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = level.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      function drawHandControl() {
        if (!state.camera.enabled) return;
        if (state.camera.task === "pose") {
          drawPoseControl();
          return;
        }
        if (!state.camera.hand) return;
        const hand = state.camera.hand;
        const level = LEVELS[state.levelIndex] || LEVELS[0];
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = withAlpha(hand.pinch ? level.color2 : level.color, hand.pinch ? 0.82 : 0.42);
        ctx.fillStyle = withAlpha(hand.pinch ? level.color2 : level.color, hand.pinch ? 0.18 : 0.08);
        ctx.lineWidth = hand.pinch ? 3 : 1.8;
        ctx.beginPath();
        ctx.arc(hand.x, hand.y, hand.pinch ? 24 : 18, 0, TAU);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = withAlpha(level.color2, 0.28);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(hand.x, hand.y, 36 + Math.sin(state.time * 7) * 3, 0, TAU);
        ctx.stroke();
        if (!hand.pinch) {
          ctx.beginPath();
          ctx.moveTo(hand.x - 8, hand.y);
          ctx.lineTo(hand.x + 8, hand.y);
          ctx.moveTo(hand.x, hand.y - 8);
          ctx.lineTo(hand.x, hand.y + 8);
          ctx.stroke();
        }
        ctx.restore();
      }

      function drawPoseControl() {
        if (!state.camera.body || !state.camera.body.pose) return;
        const body = state.camera.body;
        const pose = body.pose;
        const level = LEVELS[state.levelIndex] || LEVELS[0];
        const core = pose.bodyCenter;
        const glowColor = body.star || body.jump || body.action ? level.color2 : level.color;
        const alpha = clamp(0.18 + body.confidence * 0.24, 0.18, 0.46);

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        [
          [pose.leftShoulder, pose.rightShoulder],
          [pose.leftShoulder, pose.leftElbow],
          [pose.leftElbow, pose.leftWrist],
          [pose.rightShoulder, pose.rightElbow],
          [pose.rightElbow, pose.rightWrist],
          [pose.leftShoulder, pose.leftHip],
          [pose.rightShoulder, pose.rightHip],
          [pose.leftHip, pose.rightHip],
          [pose.leftHip, pose.leftKnee],
          [pose.leftKnee, pose.leftAnkle],
          [pose.rightHip, pose.rightKnee],
          [pose.rightKnee, pose.rightAnkle]
        ].forEach(([a, b]) => drawPoseBone(a, b, level.color, alpha));

        if (body.star) {
          [pose.leftWrist, pose.rightWrist, pose.leftAnkle, pose.rightAnkle].forEach((point) => {
            if (poseVisible(point)) softLine(core.x, core.y, point.x, point.y, level.color2, 0.22);
          });
        }

        const aura = body.star ? 92 : body.jump ? 78 : body.crouch ? 44 : 58;
        ctx.strokeStyle = withAlpha(glowColor, body.action ? 0.66 : 0.34);
        ctx.fillStyle = withAlpha(glowColor, body.action ? 0.12 : 0.055);
        ctx.lineWidth = body.action ? 3 : 1.8;
        ctx.beginPath();
        ctx.ellipse(core.x, core.y, aura * (body.star ? 1.26 : 1), aura * 0.72, 0, 0, TAU);
        ctx.fill();
        ctx.stroke();
        if (body.fit) {
          const fitColor = body.fit.tooClose || body.fit.tooFar || body.fit.offCenter ? "#ff6b6b" : level.color2;
          ctx.strokeStyle = withAlpha(fitColor, 0.18 + body.fit.score * 0.22);
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.rect(core.x - 92, core.y - 148, 184, 296);
          ctx.stroke();
        }

        if (body.jump) {
          ctx.strokeStyle = withAlpha(level.color2, 0.46);
          ctx.lineWidth = 2;
          for (let i = 0; i < 4; i++) {
            const x = core.x + (i - 1.5) * 18;
            line(x, core.y + 42, x, core.y + 82 + Math.sin(state.time * 9 + i) * 10);
          }
        }

        [pose.nose, pose.leftShoulder, pose.rightShoulder, pose.leftElbow, pose.rightElbow, pose.leftWrist, pose.rightWrist, pose.leftHip, pose.rightHip, pose.leftKnee, pose.rightKnee, pose.leftAnkle, pose.rightAnkle]
          .filter(poseVisible)
          .forEach((point) => {
            ctx.fillStyle = withAlpha(level.color2, 0.62);
            ctx.beginPath();
            ctx.arc(point.x, point.y, point === pose.leftWrist || point === pose.rightWrist ? 5.2 : 3.8, 0, TAU);
            ctx.fill();
          });

        ctx.strokeStyle = withAlpha(level.color2, body.action ? 0.72 : 0.34);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.action ? 26 : 18, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }

      function drawPoseBone(a, b, color, alpha) {
        if (!poseVisible(a) || !poseVisible(b)) return;
        ctx.strokeStyle = withAlpha(color, alpha);
        ctx.lineWidth = 3.2;
        line(a.x, a.y, b.x, b.y);
      }

      function poseVisible(point) {
        return Boolean(point && point.visibility > 0.2);
      }

      function drawIdleMark() {
        const cx = state.width * 0.5;
        const cy = state.height * 0.54;
        drawPyramid(cx, cy + 90, 280, 230, withAlpha(LEVELS[0].color, 0.22), 1);
        for (let i = 0; i < 7; i++) {
          const t = state.time * 0.3 + i * Math.PI * 2 / 7;
          const r = 76 + i * 8;
          drawMiniGlyph(LEVELS[i].key, cx + Math.cos(t) * r, cy + Math.sin(t) * r, withAlpha(LEVELS[i].color, 0.82));
        }
      }

      function drawBasePyramid(activeTier) {
        const cx = state.width * 0.5;
        const baseY = state.height * 0.76;
        const height = Math.min(state.height * 0.46, state.width * 0.58);
        const width = height * 1.18;
        ctx.save();
        ctx.strokeStyle = "rgba(244,241,232,0.11)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cx, baseY - height);
        ctx.lineTo(cx - width / 2, baseY);
        ctx.lineTo(cx + width / 2, baseY);
        ctx.closePath();
        ctx.stroke();
        for (let i = 1; i < 7; i++) {
          const y = baseY - (height / 7) * i;
          const half = ((baseY - y) / height) * width / 2;
          const left = cx - width / 2 + half;
          const right = cx + width / 2 - half;
          ctx.strokeStyle = i === activeTier ? withAlpha(LEVELS[state.levelIndex].color, 0.72) : "rgba(244,241,232,0.11)";
          ctx.lineWidth = i === activeTier ? 2.3 : 1;
          line(left, y, right, y);
        }
        ctx.restore();
      }

      function drawLevelUp(kind, t) {
        const p = Math.min(1, t / (kind === "beyond" ? FINALE_TRANSITION_DURATION : LEVEL_TRANSITION_DURATION));
        const e = ease(p);
        const cx = state.width * 0.5;
        const cy = state.height * 0.52;
        const color = LEVELS[state.levelIndex].color;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        if (kind === "intro") {
          for (let i = 0; i < 8; i++) {
            ctx.strokeStyle = withAlpha(color, (1 - p) * 0.42);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, 30 + e * 420 + i * 18, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (kind === "body") {
          const waveY = state.height * (1.05 - e * 1.25);
          ctx.fillStyle = withAlpha(color, 0.24 * (1 - p));
          ctx.beginPath();
          ctx.moveTo(0, state.height);
          for (let x = 0; x <= state.width; x += 24) {
            ctx.lineTo(x, waveY + Math.sin(x * 0.025 + state.time * 6) * 22);
          }
          ctx.lineTo(state.width, state.height);
          ctx.fill();
        } else if (kind === "safety") {
          for (let i = 0; i < 6; i++) {
            const a = i * Math.PI / 3 + e * 1.1;
            drawShield(cx + Math.cos(a) * e * 180, cy + Math.sin(a) * e * 180, 28, withAlpha(color, 1 - p * 0.3));
          }
        } else if (kind === "love") {
          for (let i = 0; i < 12; i++) {
            const a = i * Math.PI * 2 / 12;
            drawHeart(cx + Math.cos(a) * e * 210, cy + Math.sin(a) * e * 150, 16 * (1 - p * 0.3), withAlpha(color, 1 - p * 0.2));
          }
        } else if (kind === "esteem") {
          for (let i = 0; i < 9; i++) {
            const a = i * Math.PI * 2 / 9 + e;
            drawStar(cx + Math.cos(a) * e * 230, cy + Math.sin(a) * e * 210, 20 * (1 - p * 0.3), withAlpha(color, 1 - p * 0.1), true);
          }
        } else if (kind === "actual") {
          for (let i = 0; i < 9; i++) {
            const a = i * Math.PI * 2 / 9 + e * 2;
            drawLeaf(cx + Math.cos(a) * e * 205, cy + Math.sin(a) * e * 205, 22 * (1 - p * 0.2), withAlpha(color, 1 - p * 0.1));
          }
        } else {
          const tiers = LEVELS.slice(1);
          tiers.forEach((tier, index) => {
            const a = -Math.PI / 2 + index * TAU / tiers.length + e * 0.45;
            const r = 76 + e * (120 + index * 18);
            softLine(cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, tier.color, (1 - p) * 0.34);
            drawMiniGlyph(tier.key, cx + Math.cos(a) * r, cy + Math.sin(a) * r, withAlpha(tier.color, 1 - p * 0.18));
          });
          for (let i = 0; i < 14; i++) {
            ctx.strokeStyle = withAlpha(i % 2 ? LEVELS[(i % 6) + 1].color : "#ffffff", (1 - p) * 0.36);
            ctx.lineWidth = i % 2 ? 2.2 : 1.2;
            ctx.beginPath();
            ctx.arc(cx, cy, 24 + e * 390 + i * 14, 0, Math.PI * 2);
            ctx.stroke();
          }
          const baseY = state.height * 0.78;
          const height = Math.min(state.height * 0.5, state.width * 0.6);
          const width = height * 1.18;
          for (let i = 1; i < 7; i++) {
            const y = baseY - (height / 7) * i;
            const half = ((baseY - y) / height) * width / 2;
            const left = cx - width / 2 + half;
            const right = cx + width / 2 - half;
            ctx.strokeStyle = withAlpha(LEVELS[i].color, clamp((e * 7 - i + 1), 0, 1) * (1 - p * 0.22));
            ctx.lineWidth = 3;
            line(left, y, right, y);
          }
          drawMandala(cx, cy, 64 + e * 210, withAlpha("#ffffff", 1 - p * 0.32));
        }
        ctx.restore();
      }

      function drawParticles() {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        state.particles.forEach((p) => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin);
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });
        ctx.restore();
      }

      function drawRipples() {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        state.ripples.forEach((r) => {
          ctx.strokeStyle = withAlpha(r.color, r.life * 0.36);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
          ctx.stroke();
        });
        ctx.restore();
      }

      function spawnParticle(x, y, color, size = 1, radial = false) {
        const angle = Math.random() * Math.PI * 2;
        const speed = radial ? 70 + Math.random() * 260 : 8 + Math.random() * 44;
        state.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: (2 + Math.random() * 4) * size,
          life: 0.45 + Math.random() * 0.7,
          decay: 0.7 + Math.random() * 0.9,
          color,
          spin: Math.random() * 6,
          twist: (Math.random() - 0.5) * 7
        });
      }

      function burst(x, y, color, count) {
        for (let i = 0; i < count; i++) spawnParticle(x, y, color, 1, true);
        pixiLayer.burst({ x, y, color, count: Math.max(8, Math.floor(count * 0.38)), kind: "hit" });
        spawnRipple(x, y, color, 80);
      }

      function spawnRipple(x, y, color, speed = 110) {
        state.ripples.push({ x, y, r: 6, life: 1, speed, color });
      }

      function drawPyramid(cx, baseY, width, height, color, alpha = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, baseY - height);
        ctx.lineTo(cx - width / 2, baseY);
        ctx.lineTo(cx + width / 2, baseY);
        ctx.closePath();
        ctx.stroke();
        for (let i = 1; i < 7; i++) {
          const y = baseY - (height / 7) * i;
          const half = ((baseY - y) / height) * width / 2;
          line(cx - width / 2 + half, y, cx + width / 2 - half, y);
        }
        ctx.restore();
      }

      function drawLeaf(x, y, s, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1.4, s * 0.1);
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.95, -s * 0.15, s * 0.6, s, 0, s);
        ctx.bezierCurveTo(-s * 0.6, s, -s * 0.95, -s * 0.15, 0, -s);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.65);
        ctx.lineTo(0, s * 0.74);
        ctx.stroke();
        ctx.restore();
      }

      function drawShield(x, y, s, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1.5, s * 0.09);
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.82, -s * 0.48);
        ctx.lineTo(s * 0.62, s * 0.45);
        ctx.quadraticCurveTo(0, s, -s * 0.62, s * 0.45);
        ctx.lineTo(-s * 0.82, -s * 0.48);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      function drawHeart(x, y, s, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = withAlpha(color, 0.16);
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1.7, s * 0.1);
        ctx.beginPath();
        ctx.moveTo(0, s * 0.68);
        ctx.bezierCurveTo(-s * 1.25, -s * 0.1, -s * 0.68, -s, 0, -s * 0.42);
        ctx.bezierCurveTo(s * 0.68, -s, s * 1.25, -s * 0.1, 0, s * 0.68);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      function drawStar(x, y, s, color, fill) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 ? s * 0.45 : s;
          const a = -Math.PI / 2 + i * Math.PI / 5;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1.5, s * 0.09);
        if (fill) {
          ctx.fillStyle = withAlpha(color, 0.2);
          ctx.fill();
        }
        ctx.stroke();
        ctx.restore();
      }

      function drawMiniGlyph(key, x, y, color) {
        if (key === "body") {
          drawLeaf(x, y, 10, color);
        } else if (key === "safety") {
          drawShield(x, y, 11, color);
        } else if (key === "love") {
          drawHeart(x, y, 10, color);
        } else if (key === "esteem") {
          drawStar(x, y, 11, color, true);
        } else if (key === "actual") {
          drawLeaf(x, y, 12, color);
          drawLeaf(x, y, 7, color);
        } else if (key === "beyond") {
          drawMandala(x, y, 12, color);
        } else {
          drawLeaf(x, y, 10, color);
        }
      }

      function drawMandala(x, y, s, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1.2, s * 0.05);
        for (let i = 0; i < 8; i++) {
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.ellipse(0, -s * 0.42, s * 0.26, s * 0.72, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      function softLine(x1, y1, x2, y2, color, alpha = 0.35) {
        ctx.save();
        ctx.strokeStyle = withAlpha(color, alpha);
        ctx.lineWidth = 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        line(x1, y1, x2, y2);
        ctx.restore();
      }

      function line(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      function dist(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
      }

      function distanceToSegment(point, start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const lengthSq = dx * dx + dy * dy || 1;
        const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq, 0, 1);
        return Math.hypot(point.x - (start.x + dx * t), point.y - (start.y + dy * t));
      }

      function distance2d(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
      }

      function midpoint(points) {
        const total = points.reduce((acc, point) => {
          acc.x += point.x;
          acc.y += point.y;
          acc.z += point.z || 0;
          return acc;
        }, { x: 0, y: 0, z: 0 });
        const count = Math.max(1, points.length);
        return { x: total.x / count, y: total.y / count, z: total.z / count };
      }

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      function isSpace(event) {
        return event.code === "Space" || event.key === " " || event.key === "Space" || event.key === "Spacebar" || event.key === "SPACE";
      }

      function ease(t) {
        return t * t * (3 - 2 * t);
      }

      function angleDelta(a, b) {
        return Math.atan2(Math.sin(a - b), Math.cos(a - b));
      }

      function withAlpha(color, alpha) {
        if (color.startsWith("rgba") || color.startsWith("rgb")) return color;
        const n = parseInt(color.slice(1), 16);
        const r = n >> 16;
        const g = (n >> 8) & 255;
        const b = n & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      function verifyGame() {
        const results = [];
        const startedBefore = state.started;
        const modeBefore = state.mode;
        const mutedBefore = state.muted;
        state.verifying = true;
        state.muted = true;
        state.started = true;
        state.mode = "classic";
        setOverlayOpen(startOverlay, false);
        setOverlayOpen(completeOverlay, false);
        gameEl.dataset.verify = "running";

        try {
          LEVELS.forEach((level, index) => {
            state.levelIndex = index;
            initLevel();
            state.transitioning = false;
            state.transitionTime = 0;
            resetVerifiedControls();
            const passed = driveVerifiedLevel(level.key);
            results.push(`${level.key}:${passed ? "pass" : "fail"}`);
            if (!passed) throw new Error(`${level.key} did not reach transition`);
          });
          verifyCameraControls();
          results.push("camera:pass");
          gameEl.dataset.verify = "pass";
          gameEl.dataset.verifyResults = results.join(",");
        } catch (error) {
          gameEl.dataset.verify = "fail";
          gameEl.dataset.verifyResults = results.concat(error.message).join(",");
          console.error(error);
        } finally {
          state.verifying = false;
          state.muted = mutedBefore;
          state.mode = modeBefore;
          state.started = startedBefore;
          resetGame();
          setOverlayOpen(startOverlay, !startedBefore);
          updateHud();
        }
      }

      function driveVerifiedLevel(key) {
        if (key === "intro") verifyIntro();
        if (key === "body") verifyBody();
        if (key === "safety") verifySafety();
        if (key === "love") verifyLove();
        if (key === "esteem") verifyEsteem();
        if (key === "actual") verifyActual();
        if (key === "beyond") verifyBeyond();
        return state.transitioning && state.progress >= 1;
      }

      function verifyCameraControls() {
        const modeBefore = state.mode;
        const enabledBefore = state.camera.enabled;
        const taskBefore = state.camera.task;
        const intentBefore = state.camera.intent;
        try {
          state.camera.enabled = true;
          verifyCameraGather("hands");
          verifyCameraGather("body");
          verifyCameraSafety();
          verifyCameraLove();
          verifyCameraActual();
          verifyCameraBeyond();
        } finally {
          state.mode = modeBefore;
          state.camera.enabled = enabledBefore;
          state.camera.task = taskBefore;
          state.camera.intent = intentBefore;
          resetVerifiedControls();
        }
      }

      function verifyCameraGather(mode) {
        state.mode = mode;
        state.camera.task = mode === "body" ? "pose" : "gesture";
        state.levelIndex = 1;
        initLevel();
        state.transitioning = false;
        resetVerifiedControls();
        state.camera.enabled = true;
        const item = state.levelState.items[0];
        state.camera.intent = mode === "body"
          ? makePoseIntent(item.x, item.y, { star: true, armsOpen: true, open: true, spread: 1 })
          : makeHandIntent(item.x, item.y, { open: true, spread: 1 });
        state.pointer.seen = true;
        state.pointer.x = item.x;
        state.pointer.y = item.y;
        tickBody(0.016);
        if (state.levelState.collected < 1) throw new Error(`${mode} gather camera control did not collect`);
      }

      function verifyCameraSafety() {
        state.mode = "body";
        state.camera.task = "pose";
        state.levelIndex = 2;
        initLevel();
        state.transitioning = false;
        resetVerifiedControls();
        state.camera.enabled = true;
        state.camera.intent = makePoseIntent(state.width * 0.5, state.height * 0.52, {
          shield: true,
          armsOpen: true,
          handsTogether: true,
          open: true,
          fist: true,
          spread: 1
        });
        tickSafety(0.016);
        if (state.levelState.sealed < state.levelState.nodes.length) throw new Error("pose safety shield did not seal shelter");
      }

      function verifyCameraLove() {
        state.mode = "hands";
        state.camera.task = "gesture";
        state.levelIndex = 3;
        initLevel();
        state.transitioning = false;
        resetVerifiedControls();
        state.camera.enabled = true;
        state.pointer.active = true;
        state.pointer.seen = true;
        state.levelState.nodes.forEach((node) => {
          if (node.linked || state.transitioning) return;
          state.player.x = node.x;
          state.player.y = node.y;
          state.pointer.x = node.x;
          state.pointer.y = node.y;
          state.camera.intent = makeHandIntent(node.x, node.y, { open: true, love: true, spread: 1 });
          tickLove(0.016);
        });
        if (state.levelState.links < state.levelState.nodes.length) throw new Error("hand love thread did not link nodes");
      }

      function verifyCameraActual() {
        state.mode = "body";
        state.camera.task = "pose";
        state.levelIndex = 5;
        initLevel();
        state.transitioning = false;
        resetVerifiedControls();
        state.camera.enabled = true;
        let guard = 0;
        while (!state.transitioning && state.levelState.path[state.levelState.next] && guard < 20) {
          const target = state.levelState.path[state.levelState.next];
          state.camera.intent = makePoseIntent(target.x, target.y, { point: true, armsUp: true, open: true, spread: 0.85 });
          tickActual(0.016);
          guard += 1;
        }
        if (!state.transitioning || state.progress < 1) throw new Error("pose actualization reach did not trace path");
      }

      function verifyCameraBeyond() {
        state.mode = "body";
        state.camera.task = "pose";
        state.levelIndex = 6;
        initLevel();
        state.transitioning = false;
        resetVerifiedControls();
        state.camera.enabled = true;
        state.camera.intent = makePoseIntent(state.width * 0.5, state.height * 0.52, {
          star: true,
          armsOpen: true,
          armsUp: true,
          jump: true,
          open: true,
          love: true,
          spread: 1,
          energy: 1
        });
        let guard = 0;
        while (!state.transitioning && guard < 980) {
          tickBeyond(0.016);
          guard += 1;
        }
        if (!state.transitioning || state.progress < 1) throw new Error("pose transcendence pulse did not awaken beacons");
      }

      function makeHandIntent(x, y, overrides = {}) {
        return {
          source: "hand",
          rawX: x,
          rawY: y,
          x,
          y,
          palmX: x,
          palmY: y,
          pinch: false,
          open: false,
          fist: false,
          point: false,
          victory: false,
          love: false,
          thumbUp: false,
          thumbDown: false,
          spread: 0.5,
          openness: 0.5,
          velocity: 0,
          swipe: { x: 0, y: 0, speed: 0 },
          confidence: 1,
          ...overrides
        };
      }

      function makePoseIntent(x, y, overrides = {}) {
        const leftWrist = { x: x - 120, y, visibility: 1 };
        const rightWrist = { x: x + 120, y, visibility: 1 };
        const center = { x, y, visibility: 1 };
        return {
          source: "pose",
          rawX: x,
          rawY: y,
          x,
          y,
          palmX: x,
          palmY: y,
          centerX: x,
          centerY: y,
          pinch: false,
          open: false,
          fist: false,
          point: false,
          victory: false,
          love: false,
          thumbUp: false,
          thumbDown: false,
          spread: 0.7,
          openness: 0.7,
          velocity: 0,
          swipe: { x: 0, y: 0, speed: 0 },
          confidence: 1,
          armsOpen: false,
          armsUp: false,
          handsTogether: false,
          crouch: false,
          jump: false,
          star: false,
          shield: false,
          energy: 0,
          pose: {
            leftWrist,
            rightWrist,
            bodyCenter: center,
            leftShoulder: { x: x - 56, y: y - 76, visibility: 1 },
            rightShoulder: { x: x + 56, y: y - 76, visibility: 1 },
            leftHip: { x: x - 44, y: y + 70, visibility: 1 },
            rightHip: { x: x + 44, y: y + 70, visibility: 1 }
          },
          ...overrides
        };
      }

      function resetVerifiedControls() {
        state.player.vx = 0;
        state.player.vy = 0;
        state.pointer.active = false;
        state.pointer.seen = false;
        state.input.left = false;
        state.input.right = false;
        state.input.up = false;
        state.input.down = false;
        state.input.space = false;
        state.input.just = false;
        state.input.pointerJust = false;
        state.camera.intent = null;
        state.camera.hand = null;
        state.camera.body = null;
      }

      function verifyIntro() {
        let guard = 0;
        while (!state.transitioning && guard < 1200) {
          const l = state.levelState;
          const inhaling = (l.phase || 0) < 0.54;
          state.pointer.active = inhaling;
          state.input.space = inhaling;
          if (inhaling && l.inhaleCharge < 0.02) state.input.just = true;
          tickIntro(0.016);
          state.input.just = false;
          guard += 1;
        }
        state.pointer.active = false;
        state.input.space = false;
      }

      function verifyBody() {
        const l = state.levelState;
        let guard = 0;
        while (!state.transitioning && l.items.some((item) => !item.collected) && guard < 80) {
          const item = l.items.find((candidate) => !candidate.collected);
          state.pointer.seen = false;
          state.player.vx = 0;
          state.player.vy = 0;
          state.player.x = item.x;
          state.player.y = item.y;
          tickBody(0.016);
          guard += 1;
        }
      }

      function verifySafety() {
        const l = state.levelState;
        state.camera.intent = { source: "verify", open: true, fist: true, shield: true, spread: 1, centerX: state.width * 0.5, centerY: state.height * 0.52 };
        l.nodes.forEach((node) => {
          if (state.transitioning) return;
          state.player.x = node.x;
          state.player.y = node.y;
          l.hazard = 100;
          tickSafety(0.016);
        });
        state.camera.intent = null;
      }

      function verifyLove() {
        const l = state.levelState;
        state.pointer.active = true;
        state.pointer.seen = true;
        state.input.space = true;
        l.nodes.forEach((node) => {
          if (state.transitioning || node.linked) return;
          state.player.x = node.x;
          state.player.y = node.y;
          state.pointer.x = node.x;
          state.pointer.y = node.y;
          tickLove(0.016);
        });
        state.pointer.active = false;
        state.input.space = false;
      }

      function verifyEsteem() {
        const l = state.levelState;
        let guard = 0;
        while (!state.transitioning && guard < 12) {
          l.angle = l.target;
          state.input.just = true;
          tickEsteem(0.016);
          state.input.just = false;
          guard += 1;
        }
      }

      function verifyActual() {
        const l = state.levelState;
        let guard = 0;
        while (!state.transitioning && l.path[l.next] && guard < 20) {
          const target = l.path[l.next];
          state.player.x = target.x;
          state.player.y = target.y;
          tickActual(0.016);
          guard += 1;
        }
      }

      function verifyBeyond() {
        const l = state.levelState;
        let guard = 0;
        while (!state.transitioning && l.current < l.beacons.length && guard < 80) {
          const active = l.beacons[l.current];
          state.pointer.seen = true;
          state.pointer.active = true;
          state.pointer.x = active.x;
          state.pointer.y = active.y;
          state.input.just = true;
          state.input.pointerJust = true;
          tickBeyond(0.016);
          state.input.just = false;
          state.input.pointerJust = false;
          guard += 1;
        }
        state.pointer.active = false;
      }

      resize();
      setOverlayOpen(startOverlay, true);
      setOverlayOpen(completeOverlay, false);
      initLevel();
      updateHud();
      loopRaf = requestAnimationFrame(loop);
      if (!verifyMode) primeTimer = window.setTimeout(primeCamera, 360);
      if (verifyMode) verifyTimer = window.setTimeout(verifyGame, 60);

      return () => {
        if (loopRaf) window.cancelAnimationFrame(loopRaf);
        if (primeTimer) window.clearTimeout(primeTimer);
        if (verifyTimer) window.clearTimeout(verifyTimer);
        stopHandControl({ skipUpdate: true });
        soundEngine.dispose();
        pixiLayer.destroy();
        riveBridge.destroy();
      };
}
