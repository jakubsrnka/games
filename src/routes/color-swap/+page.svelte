<script lang="ts">
  import Section from '$components/color-swap/Section.svelte';
  import Party from '$components/elements/Party.svelte';
  import { onMount } from 'svelte';

  let isSorted = false;

  let items = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' },
    { id: 10, name: '10' },
    { id: 11, name: '11' },
    { id: 12, name: '12' },
    { id: 13, name: '13' },
    { id: 14, name: '14' },
    { id: 15, name: '15' },
    { id: 16, name: '16' }
  ];

  let sourceZone: number | null = null;
  let targetZone: number | null = null;

  const handleDndConsider = (e: CustomEvent) => {
    if (sourceZone === null) {
      sourceZone = parseInt((e.srcElement as HTMLElement).getAttribute('data-zone') as string);
      console.log(sourceZone, targetZone);
    }
  };
  const handleDndFinalize = (e: CustomEvent) => {
    if (targetZone === null) {
      targetZone = parseInt((e.srcElement as HTMLElement).getAttribute('data-zone') as string);
      console.log(sourceZone, targetZone);
    }
  };

  onMount(() => {
    items = items.sort(() => Math.random() - 0.5);
  });

  $: {
    if (sourceZone !== null && targetZone !== null) {
      const sourceItems = items.filter((_, i) => i === sourceZone)[0];
      const targetItems = items.filter((_, i) => i === targetZone)[0];
      items = items.map((item, i) => {
        if (i === sourceZone) {
          return targetItems;
        } else if (i === targetZone) {
          return sourceItems;
        } else {
          return item;
        }
      });
      sourceZone = null;
      targetZone = null;

      isSorted = items.every((item, i) => item.id === i + 1);
    }
  }
</script>

<div class="grid h-64 w-64 grid-cols-4 border">
  {#each items as item, i}
    <Section items={[item]} zoneId={i} {handleDndConsider} {handleDndFinalize} />
  {/each}
</div>

{#if isSorted}
  <Party />
{/if}
