<script lang="ts">
  import { Progress } from '$components/ui/progress';
  import { onMount } from 'svelte';

  export let grid: string;
  export let userSolution: string;

  export let progressBar = false;

  let value = 0;
  let max = grid.split('').filter((digit) => digit === '.').length;

  onMount(() => {
    grid.split('').forEach((digit, index) => {
      if (digit === '.') {
        if (userSolution[index] !== '.') {
          value++;
        }
      }
    });
  });
</script>

{#if progressBar}
  <Progress {max} {value} class="h-1" />
{/if}
{Math.round((value / max) * 100)}%
