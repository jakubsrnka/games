<script lang="ts">
  import Game from '$components/elements/Game.svelte';
  import { Drawer, DrawerContent, DrawerTrigger } from '$components/ui/drawer';
  import { Grid3x3, User2 } from 'lucide-svelte';
  import Button from '$components/ui/button/button.svelte';
  import Input from '$components/ui/input/input.svelte';
  import Label from '$components/ui/label/label.svelte';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
  import { user } from '$lib/client/user';
  import { login } from '$lib/user';
  import type { Login } from '$lib/types/user';
  import { browser } from '$app/environment';
  import Error from '$components/elements/Error.svelte';
  import type { PageData } from './$types';
  import Party from '$components/elements/Party.svelte';
  import * as Card from '$components/ui/card';
  import History from '$components/sudoku/History.svelte';
  import { Separator } from '$components/ui/select';

  export let data: PageData;

  let drawer = false;
  let loading = false;
  let error: null | string = null;

  const userData: Login = {
    email: '',
    password: ''
  };

  const handleLogin = async () => {
    error = null;
    loading = true;
    const response = await login(userData);
    loading = false;
    if (response.error) {
      error = response.error;
      return;
    } else if (response.data) {
      const { user: userResponse, session } = response.data;
      if (browser) {
        document.cookie = `sb_session=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        document.cookie = `sb_refresh=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      user.set(userResponse);
      drawer = false;
      return;
    }
    error = 'An unknown error occurred';
  };

  const handleLogout = async () => {
    user.set(null);
    if (browser) {
      document.cookie = 'sb_session=; path=/; max-age=0';
      document.cookie = 'sb_refresh=; path=/; max-age=0';
    }
  };
</script>

<div class="grid grid-cols-[40px_1fr_40px] items-center border-b p-3">
  <h1 class="col-start-2 text-center text-2xl font-light">Jakhub Games</h1>
  <Drawer bind:open={drawer}>
    <DrawerTrigger>
      <div class="grid h-8 w-8 place-items-center">
        <User2 absoluteStrokeWidth />
      </div>
    </DrawerTrigger>
    <DrawerContent>
      <div class="h-[80vh] p-4">
        <Tabs>
          <TabsList class="mb-4 w-full">
            <TabsTrigger value="profile" class="w-full">Profile</TabsTrigger>
            <TabsTrigger value="settings" class="w-full">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Error {error} />
            {#if $user}
              <form on:submit|preventDefault={handleLogout}>
                <Button type="submit" class="w-full">Logout</Button>
              </form>
            {:else}
              <form on:submit|preventDefault={handleLogin}>
                <div class="flex flex-col gap-3">
                  <div class="flex flex-col gap-1">
                    <Label for="email">Email</Label>
                    <Input name="email" id="email" bind:value={userData.email} disabled={loading} />
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label for="password">Password</Label>
                    <Input
                      name="password"
                      type="password"
                      id="password"
                      bind:value={userData.password}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" {loading}>Login</Button>
                </div>
              </form>
              <a href="/register" class="mt-4 block text-center text-sm">Not registered yet?</a>
            {/if}
          </TabsContent>
        </Tabs>
      </div>
    </DrawerContent>
  </Drawer>
</div>
<main class="flex flex-col gap-4 p-6">
  {#if $user}
    <Card.Root>
      <Card.Content class="p-2">
        {#if data.onboarding}
          <p class="flex items-center justify-center gap-6">
            <Party size={32} /> Your email has been verified.<br />Welcome, {$user.email}!
          </p>
        {:else}
          <p class="text-center">Welcome back, {$user.email}.</p>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}
  <div class="m-auto grid w-full max-w-96">
    <Game href="/sudoku" class="bg-violet-300">
      <h2 slot="title">Play Sudoku</h2>
      <Grid3x3 slot="icon" size={32} absoluteStrokeWidth />
    </Game>
  </div>
  <Separator />
  <History />
</main>
