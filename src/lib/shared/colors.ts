export type ColorType = keyof typeof colors;
export const colors = {
  primary: '#ffffff',
  secondary: '#ededed',
  tertiary: '#8a8a8a',
  quaternary: '#000000'
};

export const getTextColor = (hexColor: string) =>
  (((parseInt(hexColor.replace(/^#/, ''), 16) >> 16) & 255) * 299 +
    ((parseInt(hexColor.replace(/^#/, ''), 16) >> 8) & 255) * 587 +
    (parseInt(hexColor.replace(/^#/, ''), 16) & 255) * 114) /
    1000 >
  150
    ? 'black'
    : 'white';
