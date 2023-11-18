import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Recipe} from 'types';

type RecipeGeneral = Omit<Recipe, 'datetime' | 'author'>;

// Define a type for the slice state
interface RecipesState {
  recipes: RecipeGeneral[] | null;
  recipesLoading: boolean;
}

// Define the initial state using that type
const initialState: RecipesState = {
  recipes: null,
  recipesLoading: false,
};

export const recipesSlice = createSlice({
  name: 'recipes',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<RecipeGeneral[] | null>) => {
      state.recipes = action.payload;
    },
    setRecipesLoading: (state, action: PayloadAction<boolean>) => {
      state.recipesLoading = action.payload;
    },
  },
});

export const {setRecipes, setRecipesLoading} = recipesSlice.actions;

export default recipesSlice.reducer;
