<script lang="ts">
  import Candidates from '$components/sudoku/Candidates.svelte';
  import LayoverGrid from '$components/sudoku/LayoverGrid.svelte';
  import Setter from '$components/sudoku/Setter.svelte';
  import Script from '$components/utils/Script.svelte';
  import { candidatesToObject, figureOutCandidates } from '$lib/sudoku/candidates';
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
    if (selected) {
      userSolution[selected] = digit;
      if (sudokuSettings.autoCandidates) {
        candidates = figureOutCandidates(grid.candidates, userSolution);
      }
    }
  };

  const removeDigit = () => {
    if (selected) delete userSolution[selected];
    userSolution = userSolution;
  };

  let value: Digit | null;

  type UserSudokuSettings = {
    autoCandidates: boolean;
    showCorrect: boolean;
    autoDeselect: boolean;
  };

  const sudokuSettings: UserSudokuSettings = {
    autoCandidates: true,
    showCorrect: false,
    autoDeselect: true
  };
</script>

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
        class:border-neutral-900={selected === i}
        class:outline={selected === i}
        class:border-[1px]={selected === i}
        class:outline-[0.5px]={selected === i}
        class:bg-amber-300={selected === i}
        class:z-[100]={selected === i}
        class:text-green-600={isCorrect}
        class:bg-neutral-200={grid.digits.has(VALID_GRID_INDEXES[i])}
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
        {/if}
      </button>
    {/each}
  </div>

  <div class="grid w-full grid-cols-5 gap-2">
    <Setter bind:value f={setDigit} x={removeDigit} />
  </div>
</div>
