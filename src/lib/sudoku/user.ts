export const setDigit = (digit: Digit) => {
  if (selected !== null) {
    userSolution[selected] = digit;
    if ($sudokuSettings.autoCandidates) {
      candidates = figureOutCandidates(grid.candidates, userSolution);
    }
    if ($sudokuSettings.autoDeselect) {
      selected = null;
    }
  }
};

export const removeDigit = () => {
  if (selected !== null) delete userSolution[selected];
  userSolution = userSolution;
  candidates = figureOutCandidates(grid.candidates, userSolution);
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
};

export const removeCandidates = () => {
  if (selected !== null && userCandidates[selected]) {
    delete userCandidates[selected];
  }
  userCandidates = userCandidates;
};
