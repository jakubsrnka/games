<script lang="ts">
  import { sudokuSettings } from '$lib/sudoku/stores';
  import LayoverGrid from '$components/sudoku/LayoverGrid.svelte';
  import {
    solveWithBacktracking,
    type GridIndex,
    type Digit,
    parseGrid,
    VALID_GRID_INDEXES,
    type SudokuGrid
  } from 'sudoku-master';
  import {
    decodeGrid,
    getDigit,
    getKeyValuePairsFromCandidatesString,
    getKeyValuePairsFromGridString,
    getMapFromGrid,
    stringifyCandidates,
    stringifyGrid
  } from '$lib/sudoku';
  import { getSudoku } from 'sudoku-gen';
  import Script from '$components/utils/Script.svelte';
  import { candidatesToObject, figureOutCandidates } from '$lib/sudoku/candidates';
  import Candidates from './Candidates.svelte';
  import { onMount } from 'svelte';
  import { user } from '$lib/client/user';
  import { supabase } from '$lib/shared/supabase';

  let grid: SudokuGrid | null = null;

  let solution: ReadonlyMap<GridIndex, Digit> | null = null;

  let candidates: { [key: number]: Set<Digit> } = {};

  let selected: GridIndex | null;

  let userSolution: { [key: number]: Digit } = {};

  let userCandidates: { [key: number]: Set<Digit> } = {};

  export const setDigit = (digit: Digit) => {
    if (!grid) return;
    if (selected !== null) {
      userSolution[selected] = digit;
      if ($sudokuSettings.autoCandidates) {
        candidates = figureOutCandidates(grid.candidates, userSolution);
      }
      if ($sudokuSettings.autoDeselect) {
        selected = null;
      }
    }

    updateChanges();
  };

  export const removeDigit = () => {
    if (!grid) return;
    if (selected !== null) delete userSolution[selected];
    userSolution = userSolution;
    candidates = figureOutCandidates(grid.candidates, userSolution);

    updateChanges();
  };

  export const setCandidate = (digit: Digit) => {
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

    updateChanges();
  };

  export const removeCandidates = () => {
    if (selected !== null && userCandidates[selected]) {
      delete userCandidates[selected];
    }
    userCandidates = userCandidates;

    updateChanges();
  };

  const updateChanges = async () => {
    if (!grid) return;
    if ($user) {
      await supabase
        .from('sudoku')
        .update({
          user_solution: stringifyGrid(getMapFromGrid(userSolution)),
          user_candidates: stringifyCandidates(userCandidates)
        })
        .eq('sudoku', stringifyGrid(grid.digits));
    }
  };

  onMount(async () => {
    if ($user) {
      try {
        const { data, error } = await supabase
          .from('sudoku')
          .select()
          .eq('completed', false)
          .order('created_at', { ascending: false });
        if (!error && data && data.length) {
          const result = data[0];
          grid = decodeGrid(result.sudoku, result.candidates);
          candidates = getKeyValuePairsFromCandidatesString(result.candidates);
          userCandidates = getKeyValuePairsFromCandidatesString(result.user_candidates);
          userSolution = getKeyValuePairsFromGridString(result.user_solution);
          console.log(candidates, result.candidates);
          console.log(grid);
          console.log(userCandidates, result.user_candidates);
          console.log(userSolution, result.user_solution);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    grid = parseGrid(getSudoku($sudokuSettings.difficulty).puzzle, true);

    if (!grid) {
      return;
    }

    solution = solveWithBacktracking(grid) as ReadonlyMap<GridIndex, Digit> | null;

    candidates = candidatesToObject(grid.candidates);
    console.log(candidates, grid.candidates);

    if ($user) {
      await supabase.from('sudoku').insert([
        {
          sudoku: stringifyGrid(grid.digits),
          solution: stringifyGrid(solution ?? new Map()),
          user_solution: stringifyGrid(getMapFromGrid(userSolution)),
          difficulty: $sudokuSettings.difficulty,
          candidates: stringifyCandidates(candidates),
          user_candidates: stringifyCandidates(userCandidates)
        }
      ]);
    }
  });
</script>

<div class="relative grid w-fit grid-cols-9 border border-neutral-500">
  {#if grid}
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
          if (!grid) return;
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
  {/if}
</div>

<slot {setDigit} {removeDigit} {setCandidate} {removeCandidates} />
