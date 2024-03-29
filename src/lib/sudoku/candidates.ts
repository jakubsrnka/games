import type { Digit, GridIndex } from 'sudoku-master';

export const candidatesToObject = (grid: ReadonlyMap<GridIndex, readonly Digit[]>) => {
  const obj: { [key: number]: Digit[] } = {};
  for (const [index, digit] of grid) {
    obj[index] = digit as Digit[];
  }
  return obj;
};

export const figureOutCandidates = (
  originalCandidates: ReadonlyMap<GridIndex, readonly Digit[]>,
  userSolution: { [key: number]: Digit }
) => {
  // this method needs to be called after every user input. It will update the candidates object and remove the user input from the candidates of the row, column and box.

  const candidates = candidatesToObject(originalCandidates);

  Object.entries(userSolution).forEach(([key, digit]) => {
    const row = Math.floor(parseInt(key) / 9);
    const col = parseInt(key) % 9;
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);

    for (let i = 0; i < 9; i++) {
      const rowIndex = candidates[row * 9 + i]?.indexOf(digit);
      console.log(row * 9 + 1, rowIndex);
      if (rowIndex !== -1) delete candidates[row * 9 + i][rowIndex];

      const colIndex = candidates[i * 9 + col]?.indexOf(digit);
      if (colIndex !== -1) delete candidates[i * 9 + col][colIndex];
      console.log(colIndex);
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const boxIndex =
          candidates[(Math.floor(box / 3) * 3 + i) * 9 + (box % 3) * 3 + j]?.indexOf(digit);
        if (boxIndex !== -1)
          delete candidates[(Math.floor(box / 3) * 3 + i) * 9 + (box % 3) * 3 + j][boxIndex];
      }
    }
  });

  return candidates;
};
