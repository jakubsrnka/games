export const capitalize = (str: string, everyWord = false) => {
  if (everyWord) {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
