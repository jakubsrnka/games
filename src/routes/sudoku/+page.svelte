<script lang="ts">
  import Nav from '$components/elements/header/Nav.svelte';
  import Candidates from '$components/sudoku/Candidates.svelte';
  import LayoverGrid from '$components/sudoku/LayoverGrid.svelte';
  import Setter from '$components/sudoku/Setter.svelte';
  import { Drawer, DrawerTrigger, DrawerContent } from '$components/ui/drawer';
  import Label from '$components/ui/label/label.svelte';
  import Switch from '$components/ui/switch/switch.svelte';
  import { Tabs, TabsList, TabsTrigger } from '$components/ui/tabs';
  import TabsContent from '$components/ui/tabs/tabs-content.svelte';
  import Script from '$components/utils/Script.svelte';
  import { candidatesToObject, figureOutCandidates } from '$lib/sudoku/candidates';
  import { ChevronLeft, Settings2 } from 'lucide-svelte';
  import { getSudoku } from 'sudoku-gen';
  import {
    parseGrid,
    type GridIndex,
    type Digit,
    solveWithBacktracking,
    VALID_GRID_INDEXES
  } from 'sudoku-master';

  const grid = parseGrid(getSudoku('medium').puzzle, true);

  if (grid === null) {
    throw new Error('Failed to parse grid');
  }

  let candidates = candidatesToObject(grid.candidates);

  const solution = solveWithBacktracking(grid) as ReadonlyMap<GridIndex, Digit> | null;

  const getDigit = (index: number, grid: ReadonlyMap<GridIndex, Digit>) =>
    grid.get(index as GridIndex) ?? '';

  let selected: GridIndex | null;

  let userSolution: { [key: number]: Digit } = {};

  const setDigit = (digit: Digit) => {
    if (selected !== null) {
      userSolution[selected] = digit;
      if (sudokuSettings.autoCandidates) {
        candidates = figureOutCandidates(grid.candidates, userSolution);
      }
      if (sudokuSettings.autoDeselect) {
        selected = null;
      }
    }
  };

  const removeDigit = () => {
    if (selected !== null) delete userSolution[selected];
    userSolution = userSolution;
    candidates = figureOutCandidates(grid.candidates, userSolution);
  };

  let value: Digit | null;

  type UserSudokuSettings = {
    autoCandidates: boolean;
    showCorrect: boolean;
    autoDeselect: boolean;
    autoDeleteCandidates: boolean;
  };

  const sudokuSettings: UserSudokuSettings = {
    autoCandidates: true,
    showCorrect: false,
    autoDeselect: false,
    autoDeleteCandidates: false
  };

  let userCandidates: { [key: number]: Set<Digit> } = {};

  const setCandidate = (digit: Digit) => {
    if (selected !== null) {
      if (!userCandidates[selected]) {
        userCandidates[selected] = new Set();
      }
      if (userCandidates[selected].has(digit)) {
        userCandidates[selected].delete(digit);
        if (userCandidates[selected].size === 0) {
          delete userCandidates[selected];
        }
      } else {
        userCandidates[selected].add(digit);
      }
    }
    userCandidates = userCandidates;
  };

  const removeCandidates = () => {
    if (selected !== null && userCandidates[selected]) {
      delete userCandidates[selected];
    }
    userCandidates = userCandidates;
  };
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
            <Switch id="auto-deselect" bind:checked={sudokuSettings.autoDeselect} />
            <Label class="w-full cursor-pointer" for="auto-deselect">Auto deselect</Label>
          </div>
          <div class="mt-2 flex w-full cursor-pointer items-center gap-2">
            <Switch
              id="auto-delete-candidates"
              bind:checked={sudokuSettings.autoDeleteCandidates}
            />
            <Label class="w-full cursor-pointer" for="auto-delete-candidates">
              Auto delete candidates
            </Label>
          </div>
          <div class="mt-2 flex w-full cursor-pointer items-center gap-2">
            <Switch id="auto-show-correct" bind:checked={sudokuSettings.showCorrect} />
            <Label class="w-full cursor-pointer" for="auto-show-correct">
              Highlight correct numbers
            </Label>
          </div>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</Nav>

<div class="m-4 ml-auto mr-auto flex w-fit flex-col items-center gap-4">
  <div class="relative grid w-fit grid-cols-9 border border-neutral-500">
    <LayoverGrid />
    {#each Array.from({ length: 81 }) as _, i}
      {@const isCorrect =
        sudokuSettings.showCorrect && solution && getDigit(i, solution) === userSolution[i]}
      {#if isCorrect}
        <Script
          f={() => {
            selected = null;
          }}
        />
      {/if}
      <button
        class="relative flex h-9 w-9 items-center justify-center border-[0.5px] border-neutral-400"
        class:border-neutral-500={selected === i}
        class:outline={selected === i}
        class:border-[1px]={selected === i}
        class:outline-[0.5px]={selected === i}
        class:outline-neutral-500={selected === i}
        class:bg-amber-300={selected === i}
        class:z-[100]={selected === i}
        class:text-green-600={isCorrect}
        class:bg-neutral-200={grid.digits.has(VALID_GRID_INDEXES[i])}
        class:cursor-default={grid.digits.has(VALID_GRID_INDEXES[i]) || isCorrect}
        on:click={() => {
          if (isCorrect) {
            selected = null;
            return;
          }
          selected = getDigit(i, grid.digits) !== '' ? null : VALID_GRID_INDEXES[i];
        }}
      >
        <span class="text-xl">
          {getDigit(i, grid.digits)}
          {userSolution[i] ?? ''}
        </span>
        {#if !userSolution[i] && sudokuSettings.autoCandidates && candidates[i]}
          <Candidates candidates={candidates[i]} />
        {:else if userCandidates[i]}
          <Candidates candidates={userCandidates[i]} />
        {/if}
      </button>
    {/each}
  </div>

  <Tabs class="w-full">
    <div class="m-auto w-fit">
      <TabsList>
        <TabsTrigger value="values">Values</TabsTrigger>
        <TabsTrigger value="candidates">Candidates</TabsTrigger>
      </TabsList>
    </div>
    <div class="w-full">
      <TabsContent value="values">
        <div class="grid w-full grid-cols-5 gap-2">
          <Setter bind:value f={setDigit} x={removeDigit} />
        </div>
      </TabsContent>
      <TabsContent value="candidates">
        <div class="grid w-full grid-cols-5 gap-2">
          <Setter bind:value f={setCandidate} x={removeCandidates} candidates />
        </div>
        <div class=" m-auto mt-2 flex w-fit cursor-pointer items-center gap-2">
          <Switch bind:checked={sudokuSettings.autoCandidates} id="auto" />
          <Label for="auto">Auto candidates</Label>
        </div>
      </TabsContent>
    </div>
  </Tabs>
</div>
