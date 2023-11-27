export const mealData = [
  {
    name: 'Shakshuka',
    image: 'https://www.themealdb.com/images/media/meals/g373701551450225.jpg',
  },
  {
    name: 'Beef Banh Mi Bowls with Sriracha Mayo',
    image: 'https://www.themealdb.com/images/media/meals/z0ageb1583189517.jpg',
  },
  {
    name: 'Chickpea Fajitas',
    image: 'https://www.themealdb.com/images/media/meals/tvtxpq1511464705.jpg',
  },
  {
    name: 'Smoky Lentil Chili with Squash',
    image: 'https://www.themealdb.com/images/media/meals/uwxqwy1483389553.jpg',
  },
  {
    name: 'Braised Beef Chilli',
    image: 'https://www.themealdb.com/images/media/meals/uuqvwu1504629254.jpg',
  },
];

export type ShoppingItem = {
  item: string;
  quantity?: string;
  checked?: boolean;
  datetime: number;
};

export type User = {
  recipes?: {favourites?: string[]};
  shopping?: {list?: ShoppingItem[]};
};

export type RecipeInfo = {
  minutes?: string;
  servings?: string;
  calories?: string;
  difficulty?: string;
};

export type Category = {
  id: string;
  name: string;
  image?: string | number;
  description: string;
};

export type Recipe = {
  id: string;
  name: string;
  image: string;
  datetime: number;
  category: string;
  author?: string;
  authorName?: string;
  area: string;
};

export type RecipeDetails = {
  id: string;
  name: string;
  image: string;
  drinkAlternate?: string | null;
  category: string;
  area: string;
  instructions: string;
  tags?: string;
  youtube?: string;
  link?: string;
  info?: RecipeInfo;
  ingredients?: string[];
  source?: string | null;
  imageSource?: string | null;
  creativeCommonsConfirmed?: string | null;
  dateModified?: number;
  datetime: number;
  author?: string;
  authorName?: string;
};

export type CategoriesAPI = {
  categories: {
    idCategory: number;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
  }[];
};

export type RecipesAPI = {
  meals: {
    idMeal: number;
    strMeal: string;
    strMealThumb: string;
  }[];
};

export type RecipeDetailsAPI = {
  meals: {
    idMeal: number;
    strMeal: string;
    strDrinkAlternate: string | null;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags: string;
    strYoutube: string;
    strIngredient1: string | null;
    strIngredient2: string | null;
    strIngredient3: string | null;
    strIngredient4: string | null;
    strIngredient5: string | null;
    strIngredient6: string | null;
    strIngredient7: string | null;
    strIngredient8: string | null;
    strIngredient9: string | null;
    strIngredient10: string | null;
    strIngredient11: string | null;
    strIngredient12: string | null;
    strIngredient13: string | null;
    strIngredient14: string | null;
    strIngredient15: string | null;
    strIngredient16: string | null;
    strIngredient17: string | null;
    strIngredient18: string | null;
    strIngredient19: string | null;
    strIngredient20: string | null;
    strMeasure1: string | null;
    strMeasure2: string | null;
    strMeasure3: string | null;
    strMeasure4: string | null;
    strMeasure5: string | null;
    strMeasure6: string | null;
    strMeasure7: string | null;
    strMeasure8: string | null;
    strMeasure9: string | null;
    strMeasure10: string | null;
    strMeasure11: string | null;
    strMeasure12: string | null;
    strMeasure13: string | null;
    strMeasure14: string | null;
    strMeasure15: string | null;
    strMeasure16: string | null;
    strMeasure17: string | null;
    strMeasure18: string | null;
    strMeasure19: string | null;
    strMeasure20: string | null;
    strSource: string | null;
    strImageSource: string | null;
    strCreativeCommonsConfirmed: string | null;
    dateModified: string | null;
  }[];
};

export type ImagePicker = {
  image: string | undefined;
  imageType: string | undefined;
};

export type RecipeIngredients = {
  id: string;
  name: string;
  ingredients: string[];
  image: string;
  score: number;
};
