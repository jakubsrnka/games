<script lang="ts">
  import Nav from '$components/elements/header/Nav.svelte';
  import { Button } from '$components/ui/button';
  import { Drawer, DrawerContent, DrawerTrigger } from '$components/ui/drawer';
  import Label from '$components/ui/label/label.svelte';
  import ScrollArea from '$components/ui/scroll-area/scroll-area.svelte';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue
  } from '$components/ui/select';
  import SelectItem from '$components/ui/select/select-item.svelte';
  import SelectLabel from '$components/ui/select/select-label.svelte';
  import Separator from '$components/ui/separator/separator.svelte';
  import Switch from '$components/ui/switch/switch.svelte';
  import { capitalize } from '$lib/shared/texts';
  import { difficulties } from '$lib/sudoku';
  import { sudokuSettings } from '$lib/sudoku/stores';
  import { ChevronLeft, Settings2 } from 'lucide-svelte';

  export let newGame: () => Promise<void>;
</script>

<Nav>
  <a href="/" class="grid h-8 w-8 place-items-center">
    <ChevronLeft size={32} absoluteStrokeWidth />
  </a>
  <h1>Sudoku</h1>
  <Drawer>
    <DrawerTrigger>
      <div class="grid h-8 w-8 place-items-center">
        <Settings2 absoluteStrokeWidth />
      </div>
    </DrawerTrigger>
    <DrawerContent>
      <div class="flex h-[80vh] flex-col">
        <Nav>
          <div class="m-auto">Settings</div>
        </Nav>
        <ScrollArea class="">
          <div class="flex flex-col items-start gap-4 p-4">
            <div class="flex w-full cursor-pointer items-center gap-2">
              <Switch id="auto-deselect" bind:checked={$sudokuSettings.autoDeselect} />
              <Label class="w-full cursor-pointer" for="auto-deselect">Auto deselect</Label>
            </div>

            <div class="flex w-full cursor-pointer items-center gap-2">
              <Switch id="auto-show-correct" bind:checked={$sudokuSettings.showCorrect} />
              <Label class="w-full cursor-pointer" for="auto-show-correct">
                Highlight correct numbers
              </Label>
            </div>
            <Separator />
            <div class="flex w-full cursor-pointer items-center gap-2">
              <Switch id="auto-candidates" bind:checked={$sudokuSettings.autoCandidates} />
              <Label class="w-full cursor-pointer" for="auto-candidates">Auto candidates</Label>
            </div>
            <div class="flex w-full cursor-pointer items-center gap-2">
              <Switch
                id="auto-delete-candidates"
                bind:checked={$sudokuSettings.autoDeleteCandidates}
                disabled={$sudokuSettings.autoCandidates}
              />
              <Label class="w-full cursor-pointer" for="auto-delete-candidates">
                Auto delete candidates
              </Label>
            </div>
            <span class="text-xs">
              This means your custom candidates will be deleted while playing the game. Disabling
              this might cause worse readabilty.
            </span>

            <Separator />

            <div class="w-full">
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
              <span class="text-xs">Changing difficulty resets the current game.</span>
            </div>

            <Separator />

            <div class="w-full">
              <Button variant="destructive" class="w-full" on:click={newGame} on:keydown={newGame}
                >New Game</Button
              >
              <span class="text-xs">This resets the current game.</span>
            </div>
          </div>
        </ScrollArea>
      </div>
    </DrawerContent>
  </Drawer>
</Nav>
