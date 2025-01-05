<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.pcss';
  import type { LayoutData } from './$types';
  import { user } from '$lib/client/user';
  import { ModeWatcher } from 'mode-watcher';

  export let data: LayoutData;

  onMount(() => {
    user.set(data.user?.user ?? null);
  });
</script>

<svelte:head>
  <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
  <link rel="shortcut icon" href="/favicon/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="Jakhub Games" />
  <link rel="manifest" href="/favicon/site.webmanifest" />

  <meta property="og:title" content="Jakhub Games" />
  <meta property="og:site_name" content="Jakhub Games" />
  <meta property="og:description" content="Play games online!" />
  <meta property="og:image" content="https://games.jakhub.cz/favicon/og-image.png" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://games.jakhub.cz" />

  <meta name="apple-mobile-web-app-title" content="Jakhub Games" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-wep-app-capable" content="yes" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
</svelte:head>

<ModeWatcher themeColors={{ light: '#fff', dark: '#0a0a0a' }} />
{#key $user}
  <slot />
{/key}
