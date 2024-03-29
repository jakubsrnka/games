import type { UserSudokuSettings } from '$lib/types/sudoku';
import { writable, type Writable } from 'svelte/store';

export const sudokuSettings: Writable<UserSudokuSettings> = writable({
  autoCandidates: true,
  showCorrect: false,
  autoDeselect: false,
  autoDeleteCandidates: false,
  difficulty: 'medium'
});
