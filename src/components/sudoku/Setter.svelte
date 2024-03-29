<script lang="ts">
  import Button from '$components/ui/button/button.svelte';
  import { VALID_DIGITS, type Digit } from 'sudoku-master';
  export let value: Digit | null = null;
  export let f: (value: Digit) => void;
  export let x: () => void;
</script>

{#each Array.from({ length: 9 }) as _, i}
  <Button
    class="border-neutral-700"
    on:click={() => {
      value = VALID_DIGITS[i];
      if (value) {
        f(value);
      }
    }}
  >
    {i + 1}
  </Button>
{/each}
<Button
  class="border-neutral-700"
  on:click={() => {
    value = null;
    x();
  }}
  >×
</Button>
