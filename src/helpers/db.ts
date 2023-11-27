import firestore from '@react-native-firebase/firestore';
import {
  recipeImageRef,
  recipeImagesRef,
  recipeRef,
  recipesRef,
  userRecipes,
  userRef,
  userShopping,
} from 'config/firebase';
import {
  ImagePicker,
  Recipe,
  RecipeDetails,
  RecipeIngredients,
  ShoppingItem,
  User,
} from 'types';

export const getRecipes = async (category: string, onlyThese?: string[]) => {
  const q =
    category.toLowerCase() === 'all'
      ? recipesRef
      : onlyThese && category.toLowerCase() === 'favourites'
      ? recipesRef.where('id', 'in', onlyThese)
      : recipesRef.where('category', '==', category);
  const querySnapshot = await q.get();
  let docs: Recipe[] = [];
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i];
    const data = doc.data();
    docs.push(data as Recipe);
  }

  return docs.sort((a, b) => b.datetime - a.datetime);
};

export const getRecipeDetails = async (recipeId: string) => {
  const q = recipeRef.where('id', '==', recipeId);
  const querySnapshot = await q.get();
  const doc = querySnapshot.docs[0];
  const data = {...doc.data(), id: doc.id} as RecipeDetails;

  return {...data};
};

export const getUserPreferences = async (userId: string) => {
  const querySnapshot = await userRef(userId).get();
  return querySnapshot.docs[0].data() as User;
};

export const removeRecipe = async (id: string) => {
  await recipeImageRef(id).delete();
  const recipeId = (await recipesRef.where('id', '==', id).get()).docs[0].id;
  await recipesRef.doc(recipeId).delete();
  await recipeRef.doc(id).delete();
};

export const createRecipe = async (
  recipeDetails: Omit<RecipeDetails, 'id'>,
  imageData: ImagePicker,
) => {
  const recipe: Omit<Recipe, 'id'> = {
    name: recipeDetails.name,
    author: recipeDetails.author,
    authorName: recipeDetails.authorName,
    image: '',
    datetime: recipeDetails.datetime,
    category: recipeDetails.category,
    area: recipeDetails.area,
  };
  const recipeDoc = await recipesRef.add(recipe);
  const recipeDetailsDoc = await recipeRef.add({
    ...recipeDetails,
  });

  await recipeImageRef(recipeDetailsDoc.id).putFile(imageData.image ?? '');
  const url = await recipeImageRef(recipeDetailsDoc.id).getDownloadURL();
  await recipeDoc.update({id: recipeDetailsDoc.id, image: url});
  await recipeDetailsDoc.update({
    id: recipeDetailsDoc.id,
    image: url,
  });
};

export const updateRecipe = async (
  recipeDetails: RecipeDetails,
  imageData?: ImagePicker,
) => {
  let url: string | undefined;
  if (imageData && imageData.image) {
    await recipeImageRef(recipeDetails.id).delete();
    await recipeImageRef(recipeDetails.id).putFile(imageData.image);
    url = await recipeImageRef(recipeDetails.id).getDownloadURL();
  }
  const recipe: Omit<Recipe, 'id'> = {
    name: recipeDetails.name,
    author: recipeDetails.author,
    authorName: recipeDetails.authorName,
    image: imageData && imageData.image && url ? url : recipeDetails.image,
    datetime: recipeDetails.datetime,
    category: recipeDetails.category,
    area: recipeDetails.area,
  };
  const recipeDocId = (
    await recipesRef.where('id', '==', recipeDetails.id).get()
  ).docs[0].id;
  await recipesRef.doc(recipeDocId).update(recipe);
  await recipeRef
    .doc(recipeDetails.id)
    .update(
      imageData && imageData.image && url
        ? {...recipeDetails, image: url}
        : recipeDetails,
    );
};

export const addToShoppingList = async (
  userId: string,
  items: Partial<ShoppingItem>[],
) => {
  const shoppingDoc = userShopping(userId);
  const snap = await shoppingDoc.get();
  const now = new Date(Date.now()).getTime();
  const transformed = items.map((i, k) => ({...i, datetime: now + k}));

  if (snap.exists && snap.data())
    await shoppingDoc.update({
      list: firestore.FieldValue.arrayUnion(...transformed),
    });
  else await shoppingDoc.set({favourites: transformed});
};

export const checkShoppingList = async (
  userId: string,
  item: ShoppingItem,
  check: boolean,
) => {
  const shoppingDoc = userShopping(userId);
  const snap = await shoppingDoc.get();
  const items = snap.data() as {list: ShoppingItem[]};
  const transformed = items.list?.map(i =>
    i.datetime === item.datetime ? {...i, checked: check} : i,
  );

  await shoppingDoc.update({
    list: transformed,
  });
};

export const removeFromShoppingList = async (
  userId: string,
  item: ShoppingItem,
) => {
  const shoppingDoc = userShopping(userId);
  const snap = await shoppingDoc.get();

  if (snap.exists)
    await shoppingDoc.update({
      list: firestore.FieldValue.arrayRemove(item),
    });
};

export const likeRecipe = async (userId: string, recipeId: string) => {
  const recipesDoc = userRecipes(userId);
  const snap = await recipesDoc.get();

  if (snap.exists)
    await recipesDoc.update({
      favourites: firestore.FieldValue.arrayUnion(recipeId),
    });
  else await recipesDoc.set({favourites: [recipeId]});
};

export const unlikeRecipe = async (userId: string, recipeId: string) => {
  const recipesDoc = userRecipes(userId);
  const snap = await recipesDoc.get();

  if (snap.exists)
    await recipesDoc.update({
      favourites: firestore.FieldValue.arrayRemove(recipeId),
    });
};

export const getUserData = async (userId: string) => {
  const recipesDoc = userRef(userId);
  const snap = await recipesDoc.get();

  const data: User = {
    recipes: snap.docs[0].data(),
    shopping: snap.docs[1].data(),
  };

  return data;
};

export const getAllRecipesIngredients = async () => {
  const querySnapshot = await recipeRef.get();
  let docs: RecipeIngredients[] = [];
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i];
    const data = doc.data() as RecipeIngredients;
    docs.push({
      id: data.id,
      name: data.name,
      ingredients: data.ingredients,
      image: data.image,
      score: 0,
    });
  }
  return docs;
};
