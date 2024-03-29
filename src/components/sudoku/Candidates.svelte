<script lang="ts">
  import type { Digit } from 'sudoku-master';

  export let candidates: Array<Digit>;

  const numberToDigit = (number: number): Digit => number as Digit;
</script>

<div class="absolute grid h-9 w-9 grid-cols-3 text-neutral-500">
  {#each Array(9) as _, i}
    <div class="flex h-3 w-3 items-center justify-center text-[10px]">
      {#if candidates.includes(numberToDigit(i + 1))}
        {i + 1}
      {/if}
    </div>
  {/each}
</div>
