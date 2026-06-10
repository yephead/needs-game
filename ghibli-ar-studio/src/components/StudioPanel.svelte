<script lang="ts">
  import { ui } from "../lib/state/store.svelte";
  import type { StudioController } from "../lib/state/studioController";
  import { renderGhibliCloud, CloudGhibliError } from "../lib/ghibli/cloudGhibli";

  let { controller }: { controller: StudioController } = $props();

  let promptText = $state("cinematic golden hour, lush background");

  function snapshot() {
    const data = controller.capture("image/png");
    if (data) {
      ui.cloudResult = data;
      ui.cloudError = "";
    }
  }

  async function hiFi() {
    const frame = controller.capture("image/jpeg", 0.92);
    if (!frame) return;
    ui.cloudBusy = true;
    ui.cloudError = "";
    try {
      const res = await renderGhibliCloud({ image: frame, prompt: promptText, strength: 0.6 });
      ui.cloudResult = res.image;
    } catch (e) {
      ui.cloudError = e instanceof CloudGhibliError ? e.message : (e as Error).message;
    } finally {
      ui.cloudBusy = false;
    }
  }

  function download() {
    if (!ui.cloudResult) return;
    const a = document.createElement("a");
    a.href = ui.cloudResult;
    a.download = "ghibli-studio.png";
    a.click();
  }
</script>

<div class="panel">
  <h3>Studio Capture</h3>

  <div class="field">
    <label for="prompt">Hi-fi style prompt</label>
    <input
      id="prompt"
      class="btn"
      style="width:100%;text-align:left;font-weight:400;cursor:text"
      bind:value={promptText}
    />
  </div>

  <div class="row">
    <button class="btn" onclick={snapshot} disabled={ui.status !== "running"}>📸 Snapshot</button>
    <button
      class="btn primary"
      onclick={hiFi}
      disabled={ui.status !== "running" || ui.cloudBusy}
    >
      {#if ui.cloudBusy}<span class="spinner"></span>Rendering…{:else}✨ Hi-fi render{/if}
    </button>
  </div>

  {#if ui.cloudError}
    <p class="note error">{ui.cloudError}</p>
  {/if}

  {#if ui.cloudResult}
    <img class="studio-result" src={ui.cloudResult} alt="Ghibli studio render" />
    <div class="row" style="margin-top:8px">
      <button class="btn" onclick={download}>⬇ Download</button>
      <button class="btn" onclick={() => (ui.cloudResult = null)}>Clear</button>
    </div>
  {/if}

  <p class="note">
    <b>Snapshot</b> grabs the on-device WebGL Ghibli frame instantly. <b>Hi-fi render</b> sends the
    frame to a diffusion model for a true painted look (needs a server-side <code>FAL_KEY</code> or
    <code>REPLICATE_API_TOKEN</code>).
  </p>
</div>
