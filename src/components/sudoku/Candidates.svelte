<script lang="ts">
  import { VALID_DIGITS, type Digit } from 'sudoku-master';

  export let candidates: Set<Digit>;
</script>

<div class="absolute grid h-9 w-9 grid-cols-3 text-foreground/50">
  {#each Array(9) as _, i}
    <div class="flex h-3 w-3 items-center justify-center text-[10px]">
      {#if candidates.has(VALID_DIGITS[i])}
        {VALID_DIGITS[i]}
      {/if}
    </div>
  {/each}
</div>
