import {RecipeDetails, RecipeDetailsAPI} from 'types';

export const recipeDetailsAPIToData = (
  data: RecipeDetailsAPI,
): Partial<RecipeDetails> => {
  const r = data.meals[0];
  const ingredients = findEntries(data, 'strIngredient');
  const measures = findEntries(data, 'strMeasure');
  let ingr = [];
  for (let i = 0; i < ingredients.length; i++) {
    ingr.push(ingredients[i] + ':' + measures[i]);
  }
  return {
    area: r.strArea,
    category: r.strCategory,
    id: String(r.idMeal),
    instructions: r.strInstructions,
    name: r.strMeal,
    ingredients: ingr,
    youtube: r.strYoutube,
  };
};

export const findEntries = (data: RecipeDetailsAPI, entryName: string) => {
  const meal = data.meals[0];
  if (!meal) return [];
  let ingrArray = [];
  type ObjectKey = keyof typeof meal;
  for (let i = 0; i <= 20; i++) {
    const key = `${entryName}${i}` as ObjectKey;
    const ingr = meal[key] as string | null;
    if (ingr && ingr.length > 0) ingrArray.push(ingr);
  }
  return ingrArray;
};
