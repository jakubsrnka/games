import { type Digit, type GridIndex, type SudokuGrid } from 'sudoku-master';
import { getDigit } from '$lib/sudoku';

/**
 * Export the grid as a string where empty cells are represented by a dot. This string is always 81 characters long.
 * @param grid
 * @returns A string representation of the grid
 */
export const stringifyGrid = (grid: ReadonlyMap<GridIndex, Digit>) =>
  Array.from({ length: 81 }, (_, index) => getDigit(index, grid, '.')).join('');

export const getMapFromGridString = (grid: string): ReadonlyMap<GridIndex, Digit> => {
  const map = new Map<GridIndex, Digit>();
  for (let i = 0; i < 81; i++) {
    const digit = grid.charAt(i);
    if (digit !== '.') {
      map.set(i as GridIndex, parseInt(digit) as Digit);
    }
  }
  return map;
};

export const getKeyValuePairsFromGridString = (grid: string): { [key: number]: Digit } => {
  const pairs: { [key: number]: Digit } = {};
  for (let i = 0; i < 81; i++) {
    const digit = grid.charAt(i);
    if (digit !== '.') {
      pairs[i] = parseInt(digit) as Digit;
    }
  }
  return pairs;
};

export const stringifyCandidates = (candidates: { [key: number]: Set<Digit> }) =>
  Array.from({ length: 81 }, (_, index) => {
    const set = candidates[index];
    return set
      ? Array.from({ length: 9 }, (_, digit) =>
          set.has((digit + 1) as Digit) ? (digit + 1).toString() : '.'
        ).join('')
      : '.........';
  }).join('');

export const getKeyValuePairsFromCandidatesString = (
  candidates: string
): { [key: number]: Set<Digit> } => {
  const pairs: { [key: number]: Set<Digit> } = {};
  for (let i = 0; i < 81; i++) {
    const set = new Set<Digit>();
    const start = i * 9;
    for (let j = 0; j < 9; j++) {
      const digit = candidates.charAt(start + j);
      if (digit !== '.') {
        set.add(parseInt(digit) as Digit);
      }
    }
    if (set.size > 0) {
      pairs[i] = set;
    }
  }
  return pairs;
};

export const decodeGrid = (grid: string, candidates: string): SudokuGrid => {
  const digits = getMapFromGridString(grid);
  const candidatesMap = getKeyValuePairsFromCandidatesString(candidates);
  const candidatesMapWithArrays = new Map<GridIndex, readonly Digit[]>(
    Array.from(Object.entries(candidatesMap), ([key, value]) => [
      parseInt(key) as GridIndex,
      Array.from(value)
    ])
  );
  return { digits, candidates: candidatesMapWithArrays };
};

export const getMapFromGrid = (grid: { [key: number]: Digit }): ReadonlyMap<GridIndex, Digit> => {
  const map = new Map<GridIndex, Digit>();
  for (const [key, value] of Object.entries(grid)) {
    map.set(parseInt(key) as GridIndex, value);
  }
  return map;
};
