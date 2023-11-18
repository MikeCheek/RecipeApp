export const removeDuplicates = (array: string[]) => {
  let result: string[] = [];
  for (let i = 0; i < array.length; i++)
    if (!result.includes(array[i].toUpperCase()))
      result.push(array[i].toUpperCase());
  return result;
};
