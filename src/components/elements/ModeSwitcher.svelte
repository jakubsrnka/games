<script lang="ts">
  import { resetMode, setMode } from 'mode-watcher';
  import { Button } from '$components/ui/button/index.js';
  import * as DropdownMenu from '$components/ui/dropdown-menu/index.js';
  import { MoonStar, Sun } from 'lucide-svelte';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" size="icon" class="overflow-hidden">
      <div class="absolute origin-[50%_160%] rotate-0 transition-all dark:-rotate-90">
        <Sun size={20} />
      </div>
      <div class="absolute origin-[50%_160%] rotate-90 transition-all dark:rotate-0">
        <MoonStar size={20} />
      </div>
      <span class="sr-only">Toggle theme</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
