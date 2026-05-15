<script lang="ts">
  import { onMount } from "svelte";
  import { mountNeedsGame } from "./game";

  onMount(() => mountNeedsGame());
</script>

<main class="game" aria-label="Interactive Maslow game">
  <canvas id="world"></canvas>
  <div class="pixi-layer" id="pixiLayer" aria-hidden="true"></div>
  <canvas class="rive-layer" id="riveLayer" aria-hidden="true"></canvas>
  <div class="grain"></div>
  <div class="vignette"></div>

  <section class="hud" aria-label="Game status">
    <div class="level-chip">
      <div class="chip-icon" id="chipIcon" aria-hidden="true"></div>
      <div>
        <h1 class="level-name" id="levelName">Intro</h1>
        <div class="level-hint" id="levelHint">hold</div>
      </div>
    </div>

    <div class="meter" aria-label="Level progress">
      <div class="bar">
        <div class="bar-fill" id="barFill"></div>
      </div>
    </div>

    <div class="control-pair">
      <button class="icon-button" id="cameraButton" type="button" title="Camera control" aria-label="Toggle camera control">
        <span id="cameraIcon"></span>
      </button>
      <button class="icon-button" id="soundButton" type="button" title="Sound" aria-label="Toggle sound">
        <span id="soundIcon"></span>
      </button>
      <button class="icon-button" id="restartButton" type="button" title="Restart" aria-label="Restart">
        <span id="restartIcon"></span>
      </button>
    </div>
  </section>

  <nav class="rail" id="rail" aria-label="Maslow levels"></nav>
  <div class="stage-note" id="stageNote">upper body / camera</div>
  <video class="camera-feed" id="cameraFeed" playsinline muted aria-hidden="true"></video>
  <div class="camera-status" id="cameraStatus" aria-live="polite"></div>

  <section class="overlay" id="startOverlay" data-open="true" aria-label="Start game">
    <div class="start-panel">
      <svg class="mark" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 8 91 82H9Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
        <path d="M26 82 50 39 74 82" fill="none" stroke="currentColor" stroke-width="3" />
        <path d="M38 61h24" fill="none" stroke="currentColor" stroke-width="3" />
        <circle cx="50" cy="28" r="4" fill="currentColor" />
      </svg>
      <h2 class="start-title">NEEDS</h2>
      <div class="glyph-row" id="startGlyphs" aria-hidden="true"></div>
      <div class="start-status" id="startStatus" aria-live="polite">
        <span id="startStatusIcon"></span>
        <span id="startStatusText"></span>
      </div>
      <button class="start-button" id="startButton" type="button">
        <span id="playIcon"></span>
        <span id="startButtonText">Begin</span>
      </button>
    </div>
  </section>

  <section class="overlay" id="completeOverlay" aria-label="Game complete" aria-hidden="true" inert>
    <div class="start-panel">
      <svg class="mark" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="3" />
        <path d="M50 13v74M13 50h74M24 24l52 52M76 24 24 76" fill="none" stroke="currentColor" stroke-width="2.4" />
        <circle cx="50" cy="50" r="9" fill="currentColor" />
      </svg>
      <h2 class="start-title">BEYOND</h2>
      <p class="complete-line">all tiers awake</p>
      <button class="start-button" id="againButton" type="button">
        <span id="againIcon"></span>
        <span>Again</span>
      </button>
    </div>
  </section>
</main>
