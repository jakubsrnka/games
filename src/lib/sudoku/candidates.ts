import type { Digit, GridIndex } from 'sudoku-master';

export const candidatesToObject = (grid: ReadonlyMap<GridIndex, readonly Digit[]>) => {
  const obj: { [key: number]: Set<Digit> } = {};
  for (const [index, digit] of grid) {
    obj[index] = new Set(digit);
  }
  return obj;
};

export const removeCandidates = (
  candidates: { [key: number]: Set<Digit> },
  userSolution: { [key: number]: Digit }
) => {
  Object.entries(userSolution).forEach(([key, digit]) => {
    const row = Math.floor(parseInt(key) / 9);
    const col = parseInt(key) % 9;
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);

    for (let i = 0; i < 9; i++) {
      candidates[row * 9 + i]?.delete(digit);
      candidates[i * 9 + col]?.delete(digit);
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        candidates[(Math.floor(box / 3) * 3 + i) * 9 + (box % 3) * 3 + j]?.delete(digit);
      }
    }
  });

  return candidates;
};

export const figureOutCandidates = (
  originalCandidates: ReadonlyMap<GridIndex, readonly Digit[]>,
  userSolution: { [key: number]: Digit }
) => {
  const candidates = candidatesToObject(originalCandidates);

  return removeCandidates(candidates, userSolution);
};
