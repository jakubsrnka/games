<script lang="ts">
  import { enhance } from '$app/forms';
  import Nav from '$components/elements/header/Nav.svelte';
  import Button from '$components/ui/button/button.svelte';
  import Input from '$components/ui/input/input.svelte';
  import Label from '$components/ui/label/label.svelte';
  import { ChevronLeft } from 'lucide-svelte';
</script>

<Nav>
  <a href="/" class="grid h-8 w-8 place-items-center">
    <ChevronLeft size={32} absoluteStrokeWidth />
  </a>
  <h1>Register</h1>
</Nav>

<div class="flex flex-col gap-4 p-6">
  <form method="post" action="?/register" use:enhance class="contents">
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-3">
        <Label for="fname">First Name</Label>
        <Input type="text" id="fname" name="fname" required value="Jakub" />
      </div>
      <div class="flex flex-col gap-3">
        <Label for="lname">Last Name</Label>
        <Input type="text" id="lname" name="lname" required value="Srnka" />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <Label for="email">Email</Label>
      <Input type="email" id="email" name="email" required value="jakub@srnka.net" />
    </div>
    <div class="flex flex-col gap-3">
      <Label for="password">Password</Label>
      <Input type="password" id="password" name="password" required value="adminPass" />
    </div>
    <div class="flex flex-col gap-3">
      <Label for="passwordVerify">Password verification</Label>
      <Input type="password" id="passwordVerify" name="passwordVerify" required value="adminPass" />
    </div>
    <Button type="submit">Register</Button>
  </form>
</div>
