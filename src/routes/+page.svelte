<script lang="ts">
  import Game from '$components/elements/Game.svelte';
  import { Drawer, DrawerContent, DrawerTrigger } from '$components/ui/drawer';
  import { Grid3x3, User2 } from 'lucide-svelte';
  import Button from '$components/ui/button/button.svelte';
  import Input from '$components/ui/input/input.svelte';
  import Label from '$components/ui/label/label.svelte';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
  import { onMount } from 'svelte';
  import type { ActionData } from './$types';
  import { user } from '$lib/client/user';
  import { enhance } from '$app/forms';

  export let form: ActionData;

  const handleForm = () => {
    if (form && form.status === 200) {
      switch (form.action) {
        case 'login':
          user.set(form.body?.user ?? null);
          break;
        case 'logout':
          user.set(null);
          break;
      }
    }

    if (form && form.status !== 200) {
      alert(form.message);
    }
  };

  onMount(handleForm);

  $: form, handleForm();
</script>

<div class="grid grid-cols-[40px_1fr_40px] items-center border-b p-3">
  <h1 class="col-start-2 text-center text-2xl font-light">Jakhub Games</h1>
  <Drawer>
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
            {#if $user}
              <form method="post" action="?/logout" use:enhance>
                <Button type="submit" class="w-full">Logout</Button>
              </form>
            {:else}
              <form method="post" action="?/login" use:enhance>
                <div class="flex flex-col gap-3">
                  <div class="flex flex-col gap-1">
                    <Label for="email">Email</Label>
                    <Input name="email" id="email" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <Label for="password">Password</Label>
                    <Input name="password" type="password" id="password" />
                  </div>
                  <Button type="submit">Login</Button>
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
<main class="p-6">
  {#if $user}
    <h2 class="pb-4 text-center text-xl">Welcome, {$user.email}!</h2>
  {/if}
  <div class="m-auto grid w-full max-w-96 grid-cols-2 gap-4">
    <Game href="/sudoku" class="bg-violet-300">
      <h2 slot="title">Sudoku</h2>
      <Grid3x3 slot="icon" size={32} absoluteStrokeWidth />
    </Game>
  </div>
</main>
