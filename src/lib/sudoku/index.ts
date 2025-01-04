import { type Digit, type GridIndex } from 'sudoku-master';

export const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;

/**
 * Get the digit at the given index in the grid. If the cell is empty, return the replace value.
 * @param index Index of the cell, from 0 to 80
 * @param grid The grid to get the digit from
 * @param replace Missing value to return if the cell is empty
 * @returns The digit at the given index, or the replace value if the cell is empty
 */
export const getDigit = (index: number, grid: ReadonlyMap<GridIndex, Digit>, replaceMissing = '') =>
  grid.get(index as GridIndex) ?? replaceMissing;

export function checkSolution(
  grid: ReadonlyMap<GridIndex, Digit>,
  solution: ReadonlyMap<GridIndex, Digit>,
  userSolution: { [key: number]: Digit }
): boolean {
  for (let i = 0; i < 81; i++) {
    const puzzleDigit = grid.get(i as GridIndex);
    const userDigit = userSolution[i];

    const finalDigit = puzzleDigit ?? userDigit;

    if (!finalDigit) return false;

    if (finalDigit && finalDigit !== solution.get(i as GridIndex)) {
      return false;
    }
  }

  return true;
}
