<script lang="ts">
  import { secondsToTime } from '$lib/utils';

  export let time: number;
</script>

{#if secondsToTime(time)[0]}{secondsToTime(time)[0]}:{/if}{secondsToTime(time)[1] ??
  (secondsToTime(time)[0] ? '00' : '0')}:{secondsToTime(time)[2]}
