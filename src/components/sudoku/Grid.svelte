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
  import { checkSolution, getDigit } from '$lib/sudoku';
  import {
    decodeGrid,
    getKeyValuePairsFromCandidatesString,
    getKeyValuePairsFromGridString,
    getMapFromGrid,
    getMapFromGridString,
    stringifyCandidates,
    stringifyGrid
  } from '$lib/sudoku/database';
  import { getSudoku } from 'sudoku-gen';
  import Script from '$components/utils/Script.svelte';
  import { candidatesToObject, figureOutCandidates } from '$lib/sudoku/candidates';
  import Candidates from './Candidates.svelte';
  import { onMount } from 'svelte';
  import { user } from '$lib/client/user';
  import { supabase } from '$lib/shared/supabase';
  import { Skeleton } from '$components/ui/skeleton';
  import Party from '$components/elements/Party.svelte';
  import * as Dialog from '$components/ui/dialog';
  import { Button } from '$components/ui/button';
  import Time from '$components/elements/Time.svelte';

  let grid: SudokuGrid | null = null;

  let solution: ReadonlyMap<GridIndex, Digit> | null = null;

  let candidates: { [key: number]: Set<Digit> } = {};

  let selected: GridIndex | null;

  let userSolution: { [key: number]: Digit } = {};

  let userCandidates: { [key: number]: Set<Digit> } = {};

  let isSolved = false;
  let time = 0;

  const interval = setInterval(() => {
    time++;
  }, 1000);

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
      if (solution) {
        isSolved = checkSolution(grid.digits, solution, userSolution);
        if (isSolved) {
          clearInterval(interval);
          updateChanges();
        }
      }
    }

    updateChanges();
  };

  export const removeDigit = () => {
    if (!grid) return;
    if (selected !== null) {
      delete userSolution[selected];
      isSolved = false;
      userSolution = userSolution;
      candidates = figureOutCandidates(grid.candidates, userSolution);
    }

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
          user_candidates: stringifyCandidates(userCandidates),
          time
        })
        .eq('sudoku', stringifyGrid(grid.digits));
    }
  };

  onMount(async () => {
    if ($user) {
      try {
        // await new Promise((resolve) => setTimeout(resolve, 100000));
        const { data, error } = await supabase
          .from('sudoku')
          .select()
          .eq('completed', false)
          .eq('difficulty', $sudokuSettings.difficulty)
          .order('created_at', { ascending: false });
        if (!error && data && data.length) {
          const result = data[0];
          userSolution = getKeyValuePairsFromGridString(result.user_solution);
          userCandidates = getKeyValuePairsFromCandidatesString(result.user_candidates);
          grid = decodeGrid(result.sudoku, result.candidates);
          solution = getMapFromGridString(result.solution);
          candidates = figureOutCandidates(grid.candidates, userSolution);
          isSolved = checkSolution(grid.digits, solution, userSolution);
          time = result.time;

          if (isSolved) clearInterval(interval);
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

<Time {time} />
<div class="relative grid w-fit grid-cols-9 border border-neutral-500">
  <LayoverGrid />
  {#if grid}
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
        class:bg-violet-200={selected === i}
        class:z-[10]={selected === i}
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
          {userSolution[i] ?? getDigit(i, grid.digits)}
        </span>
        {#if !userSolution[i] && $sudokuSettings.autoCandidates && candidates[i]}
          <Candidates candidates={candidates[i]} />
        {:else if userCandidates[i]}
          <Candidates candidates={userCandidates[i]} />
        {/if}
      </button>
    {/each}
  {:else}
    {#each Array.from({ length: 81 }) as _, i}
      {#if i % 2 === 0}
        <Skeleton class="h-9 w-9 rounded-none" />
      {:else}
        <div class="h-9 w-9"></div>
      {/if}
    {/each}
  {/if}
</div>

<Dialog.Root open={isSolved}>
  <Dialog.Content>
    <div class="m-auto mb-4">
      <Party size={64} />
    </div>
    <Dialog.Header>
      <Dialog.Title class="text-center">Congratulations!</Dialog.Title>
    </Dialog.Header>
    <Dialog.Description class="text-center">
      You solved the Sudoku in <Time {time} />
    </Dialog.Description>
    <div class="grid grid-cols-2 gap-4">
      <Button variant="outline">Statistics</Button>
      <Button variant="outline">Play next</Button>
    </div>
  </Dialog.Content>
</Dialog.Root>

<slot {setDigit} {removeDigit} {setCandidate} {removeCandidates} />
