<script lang="ts">
  import Nav from '$components/elements/header/Nav.svelte';
  import { Drawer, DrawerContent, DrawerTrigger } from '$components/ui/drawer';
  import Label from '$components/ui/label/label.svelte';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue
  } from '$components/ui/select';
  import SelectItem from '$components/ui/select/select-item.svelte';
  import SelectLabel from '$components/ui/select/select-label.svelte';
  import Switch from '$components/ui/switch/switch.svelte';
  import { capitalize } from '$lib/shared/texts';
  import { difficulties } from '$lib/sudoku';
  import { sudokuSettings } from '$lib/sudoku/stores';
  import { ChevronLeft, Settings2 } from 'lucide-svelte';
</script>

<Nav>
  <a href="/">
    <ChevronLeft size={32} absoluteStrokeWidth />
  </a>
  <h1>Sudoku</h1>
  <Drawer>
    <DrawerTrigger>
      <Settings2 absoluteStrokeWidth />
    </DrawerTrigger>
    <DrawerContent>
      <div class="h-[80vh]">
        <Nav>
          <div class="m-auto">Settings</div>
        </Nav>
        <div class="flex flex-col items-start gap-2 p-4">
          <div class="mt-2 flex w-full cursor-pointer items-center gap-2">
            <Switch id="auto-deselect" bind:checked={$sudokuSettings.autoDeselect} />
            <Label class="w-full cursor-pointer" for="auto-deselect">Auto deselect</Label>
          </div>
          <div class="mt-2 flex w-full cursor-pointer items-center gap-2">
            <Switch
              id="auto-delete-candidates"
              bind:checked={$sudokuSettings.autoDeleteCandidates}
            />
            <Label class="w-full cursor-pointer" for="auto-delete-candidates">
              Auto delete candidates
            </Label>
          </div>
          <div class="mt-2 flex w-full cursor-pointer items-center gap-2">
            <Switch id="auto-show-correct" bind:checked={$sudokuSettings.showCorrect} />
            <Label class="w-full cursor-pointer" for="auto-show-correct">
              Highlight correct numbers
            </Label>
          </div>

          <div class="w-full pt-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={capitalize($sudokuSettings.difficulty)} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Difficulty</SelectLabel>
                  {#each difficulties as dif}
                    <SelectItem value={dif} on:click={() => ($sudokuSettings.difficulty = dif)}>
                      {capitalize(dif)}
                    </SelectItem>
                  {/each}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span class="text-xs">Changing difficulty reset the current game.</span>
          </div>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</Nav>
