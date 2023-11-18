import {CategoriesAPI, RecipeDetailsAPI, RecipesAPI} from 'types';

export const fetchCategories = async () => {
  const res = await fetch(
    'https://www.themealdb.com/api/json/v1/1/categories.php',
  );
  if (res && res.ok) return (await res.json()) as CategoriesAPI;
  else throw new Error('Failed to fetch categories');
};

export const fetchRecipes = async (category: string = 'Beef') => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
  );
  if (res && res.ok) return (await res.json()) as RecipesAPI;
  else throw new Error('Failed to fetch recipes');
};

export const fetchRecipeDetails = async (id: string) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
  );
  if (res && res.ok) return (await res.json()) as RecipeDetailsAPI;
  else throw new Error('Failed to fetch recipe Details');
};
