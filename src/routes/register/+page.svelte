<script lang="ts">
  import Error from '$components/elements/Error.svelte';
  import Nav from '$components/elements/header/Nav.svelte';
  import Button from '$components/ui/button/button.svelte';
  import Input from '$components/ui/input/input.svelte';
  import Label from '$components/ui/label/label.svelte';
  import type { Register } from '$lib/types/user';
  import { register } from '$lib/user';
  import { ChevronLeft } from 'lucide-svelte';
  import * as Dialog from '$components/ui/dialog';
  import Party from '$components/elements/Party.svelte';

  const user: Register = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    passwordVerify: ''
  };

  let loading = false;
  let error: null | string = null;
  let wall = false;

  const handleRegister = async () => {
    error = null;
    loading = true;
    const response = await register(user);
    loading = false;
    if (response.error) error = response.error;
    if (response.data?.success) {
      user.fname = '';
      user.lname = '';
      user.email = '';
      user.password = '';
      user.passwordVerify = '';
      wall = true;
    }
  };
</script>

<Nav>
  <a href="/" class="grid h-8 w-8 place-items-center">
    <ChevronLeft size={32} absoluteStrokeWidth />
  </a>
  <h1>Register</h1>
</Nav>

<div class="flex flex-col gap-4 p-6">
  <Error {error} />
  <form class="contents" on:submit|preventDefault={handleRegister}>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-3">
        <Label for="fname">First Name</Label>
        <Input
          type="text"
          id="fname"
          name="fname"
          required
          bind:value={user.fname}
          disabled={loading}
        />
      </div>
      <div class="flex flex-col gap-3">
        <Label for="lname">Last Name</Label>
        <Input
          type="text"
          id="lname"
          name="lname"
          required
          bind:value={user.lname}
          disabled={loading}
        />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <Label for="email">Email</Label>
      <Input
        type="email"
        id="email"
        name="email"
        required
        bind:value={user.email}
        disabled={loading}
      />
    </div>
    <div class="flex flex-col gap-3">
      <Label for="password">Password</Label>
      <Input
        type="password"
        id="password"
        name="password"
        required
        bind:value={user.password}
        disabled={loading}
      />
    </div>
    <div class="flex flex-col gap-3">
      <Label for="passwordVerify">Password verification</Label>
      <Input
        type="password"
        id="passwordVerify"
        name="passwordVerify"
        required
        bind:value={user.passwordVerify}
        disabled={loading}
      />
    </div>
    <Button type="submit" {loading}>Register</Button>
  </form>
  <Dialog.Root open={wall}>
    <Dialog.Content disableClose>
      <div class="m-auto mb-4">
        <Party size={64} />
      </div>
      <Dialog.Header>
        <Dialog.Title class="text-center">Thank you for registering to Jakhub Games!</Dialog.Title>
      </Dialog.Header>
      <Dialog.Description class="text-center"
        >Please click on the link we just sent you to verify your email address.</Dialog.Description
      >
    </Dialog.Content>
  </Dialog.Root>
</div>
