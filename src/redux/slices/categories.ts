import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Category} from 'types';

// Define a type for the slice state
interface CategoriesState {
  categories: Category[] | null;
  categoriesLoading: boolean;
}

// Define the initial state using that type
const initialState: CategoriesState = {
  categories: null,
  categoriesLoading: false,
};

export const categoriesSlice = createSlice({
  name: 'categories',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[] | null>) => {
      state.categories = action.payload;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.categoriesLoading = action.payload;
    },
  },
});

export const {setCategories, setCategoriesLoading} = categoriesSlice.actions;

export default categoriesSlice.reducer;
