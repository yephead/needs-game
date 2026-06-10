<script lang="ts">
  import { PRODUCTS } from "../lib/overlay/products";
  import { ui, toggleProduct } from "../lib/state/store.svelte";
</script>

<div class="panel">
  <h3>Wardrobe</h3>
  <div class="product-grid">
    {#each PRODUCTS as p (p.id)}
      <button
        class="product-card"
        aria-pressed={!!ui.enabled[p.id]}
        onclick={() => toggleProduct(p.id)}
      >
        <img src={p.asset} alt={p.name} />
        <div class="brand">{p.brand}</div>
        <div class="name">{p.name}</div>
      </button>
    {/each}
  </div>
  <p class="note">
    Tap to try on. Eyewear &amp; caps track the face; sneakers, bags &amp; watches track the body
    pose. Drop real brand PNGs into <code>/assets/products</code> to replace the demo art.
  </p>
</div>
