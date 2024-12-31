<script lang="ts">
  export let error: string | null = null;
</script>

{#if error}
  <div class="rounded-md bg-red-100 p-4 text-red-900">
    {error.charAt(0).toUpperCase() + error.slice(1)}
  </div>
{/if}
