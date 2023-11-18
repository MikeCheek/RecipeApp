import {configureStore} from '@reduxjs/toolkit';

import categories from 'redux/slices/categories';
import recipes from 'redux/slices/recipes';

export const store = configureStore({
  reducer: {
    categories,
    recipes,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
