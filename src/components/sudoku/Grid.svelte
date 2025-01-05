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
  import {
    candidatesToObject,
    figureOutCandidates,
    removeCandidates
  } from '$lib/sudoku/candidates';
  import Candidates from './Candidates.svelte';
  import { onMount } from 'svelte';
  import { user } from '$lib/client/user';
  import { supabase } from '$lib/shared/supabase';
  import { Skeleton } from '$components/ui/skeleton';
  import Party from '$components/elements/Party.svelte';
  import * as Dialog from '$components/ui/dialog';
  import { Button } from '$components/ui/button';
  import Time from '$components/elements/Time.svelte';
  import type { Difficulty } from '$lib/types/sudoku';
  import { Badge } from '$components/ui/badge';

  export let id: string | null;

  let grid: SudokuGrid | null = null;

  let solution: ReadonlyMap<GridIndex, Digit> | null = null;

  let candidates: { [key: number]: Set<Digit> } = {};

  let selected: GridIndex | null;

  let userSolution: { [key: number]: Digit } = {};

  let userCandidates: { [key: number]: Set<Digit> } = {};

  let isSolved = false;
  let time = 0;

  let interval = setInterval(() => {
    time++;
  }, 1000);

  const startTimer = () => {
    interval = setInterval(() => {
      time++;
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(interval);
  };

  export const setDigit = (digit: Digit) => {
    if (!grid) return;
    if (selected !== null) {
      userSolution[selected] = digit;
      if ($sudokuSettings.autoCandidates) {
        candidates = figureOutCandidates(grid.candidates, userSolution);
      }
      if ($sudokuSettings.autoDeleteCandidates) {
        userCandidates = removeCandidates(userCandidates, userSolution);
      }
      if ($sudokuSettings.autoDeselect) {
        selected = null;
      }
      if (solution) {
        isSolved = checkSolution(grid.digits, solution, userSolution);
        if (isSolved) {
          stopTimer();
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

  export const removeAllCandidates = () => {
    if (selected !== null && userCandidates[selected]) {
      delete userCandidates[selected];
    }
    userCandidates = userCandidates;

    updateChanges();
  };

  const updateChanges = async () => {
    if (grid && $user) {
      await supabase
        .from('sudoku')
        .update({
          user_solution: stringifyGrid(getMapFromGrid(userSolution)),
          user_candidates: stringifyCandidates(userCandidates),
          time,
          completed: isSolved
        })
        .eq('sudoku', stringifyGrid(grid.digits))
        .eq('difficulty', $sudokuSettings.difficulty)
        .eq('user_id', $user.id);
    }
  };

  export const newGame = async () => {
    time = 0;
    isSolved = false;
    id = null;
    selected = null;
    userSolution = {};
    userCandidates = {};

    stopTimer();
    startTimer();

    history.replaceState(null, '', '/sudoku');

    grid = parseGrid(getSudoku($sudokuSettings.difficulty).puzzle, true);

    if (!grid) {
      newGame();
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
  };

  onMount(async () => {
    if ($user) {
      try {
        const { data, error } = await supabase
          .from('sudoku')
          .select()
          .eq('completed', false)
          .eq(id ? 'id' : 'difficulty', id ? parseInt(id) : $sudokuSettings.difficulty)
          .order('created_at', { ascending: false });
        if (!error && data && data.length) {
          const result = data[0];

          $sudokuSettings.difficulty = result.difficulty as Difficulty;

          userSolution = getKeyValuePairsFromGridString(result.user_solution);
          userCandidates = getKeyValuePairsFromCandidatesString(result.user_candidates);
          grid = decodeGrid(result.sudoku, result.candidates);
          solution = getMapFromGridString(result.solution);
          candidates = figureOutCandidates(grid.candidates, userSolution);
          isSolved = checkSolution(grid.digits, solution, userSolution);
          time = result.time;

          if (isSolved) stopTimer();
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    await newGame();
  });
</script>

<div class="flex w-full items-center justify-between gap-4">
  <div class="font-mono">
    <Time {time} />
  </div>
  <Badge>
    {$sudokuSettings.difficulty}
  </Badge>
</div>
<div class="relative grid w-fit grid-cols-9 border border-foreground/80">
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
        class="relative flex h-9 w-9 items-center justify-center {selected === i
          ? 'border-sudoku-foreground ring-sudoku-foreground bg-sudoku z-10 border-[1px] bg-opacity-90 ring-1'
          : 'border-[0.5px] border-foreground/40'}"
        class:text-sudoku={isCorrect}
        class:bg-foreground={grid.digits.has(VALID_GRID_INDEXES[i])}
        class:bg-opacity-10={grid.digits.has(VALID_GRID_INDEXES[i])}
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
        {:else if !userSolution[i] && userCandidates[i]}
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
      <Button variant="outline" href="/">Home</Button>
      <Button variant="outline" on:click={newGame} on:keydown={newGame}>New Game</Button>
    </div>
  </Dialog.Content>
</Dialog.Root>

<slot {setDigit} {removeDigit} {setCandidate} {removeAllCandidates} {newGame} />
