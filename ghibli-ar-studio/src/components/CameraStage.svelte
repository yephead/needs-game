<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { ui } from "../lib/state/store.svelte";
  import type { StudioController } from "../lib/state/studioController";

  let { controller }: { controller: StudioController } = $props();

  let base: HTMLCanvasElement;
  let overlay: HTMLCanvasElement;

  onMount(() => {
    controller.attach(base, overlay);
  });
  onDestroy(() => controller.dispose());
</script>

<div class="stage">
  <canvas bind:this={base}></canvas>
  <canvas class="overlay-canvas" bind:this={overlay}></canvas>

  <div class="stage-hud">
    <span class="chip"><strong>{ui.fps}</strong> fps</span>
    <span class="chip">faces <strong>{ui.faces}</strong></span>
    <span class="chip">poses <strong>{ui.poses}</strong></span>
  </div>

  {#if ui.status === "running"}
    <div class="stage-actions">
      <button class="btn icon" title="Flip camera" onclick={() => controller.flipCamera()}>🔄</button>
      <button class="btn icon" title="Stop camera" onclick={() => controller.stop()}>⏹</button>
    </div>
  {/if}

  {#if ui.status !== "running"}
    <div class="start-overlay">
      <div>
        <h2>{ui.status === "error" ? "Camera unavailable" : "Step into the frame"}</h2>
        <p>
          {#if ui.status === "error"}
            <span class="error">{ui.message}</span>
          {:else if ui.status === "starting"}
            {ui.message}
          {:else}
            Grant camera access to try products on live — and watch yourself turn into a
            hand-painted Studio Ghibli scene.
          {/if}
        </p>
        <button
          class="btn primary"
          disabled={ui.status === "starting"}
          onclick={() => controller.start()}
        >
          {#if ui.status === "starting"}<span class="spinner"></span>Starting…{:else}Start camera{/if}
        </button>
      </div>
    </div>
  {/if}
</div>
