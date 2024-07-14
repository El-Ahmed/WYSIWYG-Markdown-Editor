export const countHeadingHashes = (text: string) => {
  const match = text.match(/^#+(?=( |&nbsp;))/);
  if (!match) return 0;

  const count = match[0].length;
  if (count > 6) return 0;

  return count;
};
