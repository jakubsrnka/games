<script lang="ts">
  import Game from '$components/elements/Game.svelte';
  import { Drawer, DrawerContent, DrawerTrigger } from '$components/ui/drawer';
  import { Gamepad2, Grid3x3, User } from 'lucide-svelte';
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
  import ModeSwitcher from '$components/elements/ModeSwitcher.svelte';

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

<svelte:head>
  <title>Jakhub Games</title>
</svelte:head>

<div
  class="grid grid-cols-[auto_1fr] items-center gap-4 border-b p-3 pl-6 pr-6 md:grid-cols-[1fr_auto_1fr]"
>
  <h1 class="flex items-center gap-2 text-center text-2xl font-light md:col-start-2">
    <Gamepad2 size={32} absoluteStrokeWidth /> Games
  </h1>
  <div class="flex justify-end gap-2">
    <ModeSwitcher />
    <Drawer bind:open={drawer}>
      <DrawerTrigger>
        <Button size="icon">
          <User size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div class="h-[80vh] p-4">
          <Tabs>
            <TabsList class="mb-4 w-full">
              <TabsTrigger value="profile" class="w-full">Profile</TabsTrigger>
              <TabsTrigger value="settings" class="w-full">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div class="m-auto flex max-w-3xl flex-col gap-4">
                <Error {error} />
                {#if $user}
                  <p>Logged in as {$user.email}</p>
                  <form on:submit|preventDefault={handleLogout}>
                    <Button type="submit" class="w-full">Logout</Button>
                  </form>
                {:else}
                  <form on:submit|preventDefault={handleLogin}>
                    <div class="flex flex-col gap-3">
                      <div class="flex flex-col gap-1">
                        <Label for="email">Email</Label>
                        <Input
                          name="email"
                          id="email"
                          bind:value={userData.email}
                          disabled={loading}
                        />
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
                  <a href="/register" class="block text-center text-sm">Not registered yet?</a>
                {/if}
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div class="m-auto max-w-3xl">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold">Sudoku settings</h3>
                  <Button href="/sudoku" class="h-7">Sudoku page</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</div>
<main class="m-auto flex max-w-7xl flex-col gap-4 p-6">
  {#if $user}
    <Card.Root>
      <Card.Content class="p-2">
        {#if data.onboarding}
          <p class="flex items-center justify-center gap-6">
            <Party size={32} /> Your email has been verified.<br />Welcome, {$user.email}!
          </p>
        {:else}
          <p class="text-center">Welcome back, {$user.email}!</p>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}
  <div class="m-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Game
      href="/sudoku"
      class="bg-sudoku border-sudoku-foreground/30 hover:border-sudoku-foreground/60 border hover:shadow-lg"
    >
      <h2 slot="title" class="text-sudoku-foreground">Play Sudoku</h2>
      <Grid3x3 slot="icon" class="text-sudoku-foreground" size={32} absoluteStrokeWidth />
    </Game>
  </div>
  <Separator />
  <History />
</main>
