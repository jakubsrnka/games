import type { Digit, GridIndex } from 'sudoku-master';

export const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;

export const getDigit = (index: number, grid: ReadonlyMap<GridIndex, Digit>) =>
  grid.get(index as GridIndex) ?? '';
