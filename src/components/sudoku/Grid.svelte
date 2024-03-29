<script lang="ts">
  import { sudokuSettings } from '$lib/sudoku/stores';
  import LayoverGrid from '$components/sudoku/LayoverGrid.svelte';
  import {
    solveWithBacktracking,
    type GridIndex,
    type Digit,
    parseGrid,
    VALID_GRID_INDEXES
  } from 'sudoku-master';
  import { getDigit } from '$lib/sudoku';
  import { getSudoku } from 'sudoku-gen';
  import Script from '$components/utils/Script.svelte';
  import { candidatesToObject, figureOutCandidates } from '$lib/sudoku/candidates';
  import Candidates from './Candidates.svelte';

  const grid = parseGrid(getSudoku($sudokuSettings.difficulty).puzzle, true);

  if (grid === null) {
    throw new Error('Failed to parse grid');
  }

  const solution = solveWithBacktracking(grid) as ReadonlyMap<GridIndex, Digit> | null;

  let candidates = candidatesToObject(grid.candidates);

  let selected: GridIndex | null;

  let userSolution: { [key: number]: Digit } = {};

  let userCandidates: { [key: number]: Set<Digit> } = {};

  const setDigit = (digit: Digit) => {
    if (selected !== null) {
      userSolution[selected] = digit;
      if ($sudokuSettings.autoCandidates) {
        candidates = figureOutCandidates(grid.candidates, userSolution);
      }
      if ($sudokuSettings.autoDeselect) {
        selected = null;
      }
    }
  };

  const removeDigit = () => {
    if (selected !== null) delete userSolution[selected];
    userSolution = userSolution;
    candidates = figureOutCandidates(grid.candidates, userSolution);
  };

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

<div class="relative grid w-fit grid-cols-9 border border-neutral-500">
  <LayoverGrid />
  {#each Array.from({ length: 81 }) as _, i}
    {@const isCorrect =
      $sudokuSettings.showCorrect && solution && getDigit(i, solution) === userSolution[i]}
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
      {#if !userSolution[i] && $sudokuSettings.autoCandidates && candidates[i]}
        <Candidates candidates={candidates[i]} />
      {:else if userCandidates[i]}
        <Candidates candidates={userCandidates[i]} />
      {/if}
    </button>
  {/each}
</div>

<slot {setDigit} {removeDigit} {setCandidate} {removeCandidates} />
