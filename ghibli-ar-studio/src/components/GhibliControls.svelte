<script lang="ts">
  import { ui, ghibli } from "../lib/state/store.svelte";

  function toggleStylize() {
    ui.stylize = !ui.stylize;
  }
  function toggleMirror() {
    ui.mirror = !ui.mirror;
  }
</script>

<div class="panel">
  <h3>Ghibli Look</h3>

  <div class="toggle-row">
    <span>Stylize live preview</span>
    <div
      class="switch"
      role="switch"
      tabindex="0"
      aria-checked={ui.stylize}
      onclick={toggleStylize}
      onkeydown={(e) => (e.key === "Enter" || e.key === " ") && toggleStylize()}
    ></div>
  </div>

  <div class="field">
    <label for="g-intensity">Intensity <b>{ghibli.intensity.toFixed(2)}</b></label>
    <input id="g-intensity" type="range" min="0" max="1" step="0.01" bind:value={ghibli.intensity} />
  </div>
  <div class="field">
    <label for="g-edge">Ink edges <b>{ghibli.edge.toFixed(2)}</b></label>
    <input id="g-edge" type="range" min="0" max="1" step="0.01" bind:value={ghibli.edge} />
  </div>
  <div class="field">
    <label for="g-levels">Watercolor bands <b>{ghibli.levels.toFixed(0)}</b></label>
    <input id="g-levels" type="range" min="3" max="16" step="1" bind:value={ghibli.levels} />
  </div>
  <div class="field">
    <label for="g-sat">Saturation <b>{ghibli.saturation.toFixed(2)}</b></label>
    <input id="g-sat" type="range" min="0.5" max="1.8" step="0.01" bind:value={ghibli.saturation} />
  </div>
  <div class="field">
    <label for="g-warmth">Warmth <b>{ghibli.warmth.toFixed(2)}</b></label>
    <input id="g-warmth" type="range" min="-1" max="1" step="0.01" bind:value={ghibli.warmth} />
  </div>
  <div class="field">
    <label for="g-paper">Paper grain <b>{ghibli.paper.toFixed(2)}</b></label>
    <input id="g-paper" type="range" min="0" max="1" step="0.01" bind:value={ghibli.paper} />
  </div>
  <div class="field">
    <label for="g-smooth">Smoothing <b>{ghibli.smoothRadius.toFixed(0)}</b></label>
    <input id="g-smooth" type="range" min="1" max="4" step="1" bind:value={ghibli.smoothRadius} />
  </div>

  <h3 style="margin-top:18px">Capture &amp; Camera</h3>
  <div class="field">
    <label for="g-quality">Render quality <b>{Math.round(ui.quality * 100)}%</b></label>
    <input id="g-quality" type="range" min="0.5" max="1" step="0.05" bind:value={ui.quality} />
  </div>
  <div class="toggle-row">
    <span>Mirror (selfie)</span>
    <div
      class="switch"
      role="switch"
      tabindex="0"
      aria-checked={ui.mirror}
      onclick={toggleMirror}
      onkeydown={(e) => (e.key === "Enter" || e.key === " ") && toggleMirror()}
    ></div>
  </div>
</div>
