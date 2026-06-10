<script lang="ts">
  import { ui } from "./lib/state/store.svelte";
  import { StudioController } from "./lib/state/studioController";
  import CameraStage from "./components/CameraStage.svelte";
  import ProductPicker from "./components/ProductPicker.svelte";
  import GhibliControls from "./components/GhibliControls.svelte";
  import StudioPanel from "./components/StudioPanel.svelte";

  // One controller for the whole app lifetime.
  const controller = new StudioController();

  function setMode(mode: "live" | "studio") {
    ui.mode = mode;
    if (mode === "studio") ui.stylize = true; // the studio is all about the look
  }
</script>

<div class="app-shell">
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark">🎬</div>
      <div>
        <h1>Ghibli AR Studio</h1>
        <p>MediaPipe live overlays · WebGL Studio Ghibli stylization</p>
      </div>
    </div>
    <div class="tabs" role="tablist" aria-label="Mode">
      <button
        class="tab"
        role="tab"
        aria-selected={ui.mode === "live"}
        onclick={() => setMode("live")}
      >
        Live AR
      </button>
      <button
        class="tab"
        role="tab"
        aria-selected={ui.mode === "studio"}
        onclick={() => setMode("studio")}
      >
        Ghibli Studio
      </button>
    </div>
  </header>

  <div class="layout">
    <CameraStage {controller} />

    <aside>
      <ProductPicker />
      {#if ui.mode === "studio"}
        <StudioPanel {controller} />
      {/if}
      <GhibliControls />
    </aside>
  </div>
</div>
