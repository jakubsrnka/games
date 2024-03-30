<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.pcss';
  import type { LayoutData } from './$types';
  import { user } from '$lib/client/user';

  export let data: LayoutData;

  onMount(() => {
    user.set(data.user?.user ?? null);
  });
</script>

<slot />
