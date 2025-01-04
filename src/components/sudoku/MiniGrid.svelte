<script lang="ts">
  export let grid: string;
</script>

<div class="w-fit border-[0.5px] border-gray-300">
  {#each Array.from({ length: 9 }) as _, i}
    <div class="flex">
      {#each Array.from({ length: 9 }) as _, j}
        <div class="h-3 w-3 border-[0.5px] border-gray-300 text-center leading-[5.5px]">
          {#if grid[i * 9 + j] !== '.'}
            <span class="text-[8px] leading-[8px]">{grid[i * 9 + j]}</span>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>
