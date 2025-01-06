<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  export let items: { id: number; name: string }[];
  export let zoneId: number;

  export let handleDndConsider: (e: CustomEvent) => void;
  export let handleDndFinalize: (e: CustomEvent) => void;
</script>

<section
  use:dndzone={{ items, flipDurationMs: 300 }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
  class="h-16 w-16 border"
  data-zone={zoneId}
>
  {#each items as item (item.id)}
    <div animate:flip={{ duration: 300 }} class="grid h-16 w-16 place-items-center">
      {item.name}
    </div>
  {/each}
</section>
