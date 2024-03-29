import type { difficulties } from '$lib/sudoku';
import type { GridIndex, Digit } from 'sudoku-master';

export type Grid = Map<GridIndex, Digit>;

export type Difficulty = (typeof difficulties)[number];

export type UserSudokuSettings = {
  autoCandidates: boolean;
  showCorrect: boolean;
  autoDeselect: boolean;
  autoDeleteCandidates: boolean;
  difficulty: Difficulty;
};
