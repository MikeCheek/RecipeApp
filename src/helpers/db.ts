import firestore from '@react-native-firebase/firestore';
import {
  recipeImageRef,
  recipeImagesRef,
  recipeRef,
  recipesRef,
  userRecipes,
  userRef,
} from 'config/firebase';
import {Recipe, RecipeDetails, User} from 'types';

export const getRecipes = async (category: string) => {
  const q =
    category.toLowerCase() === 'all'
      ? recipesRef
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
  imageData: {
    image: string | undefined;
    imageType: string | undefined;
  },
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

  // const blob = await base64toBlob(imageData.image ?? '', imageData.imageType);
  // const res = await fetch(imageData.image ?? '');
  // const blob = await res.blob();

  await recipeImageRef(recipeDetailsDoc.id).putFile(imageData.image ?? '');
  const url = await recipeImageRef(recipeDetailsDoc.id).getDownloadURL();
  await recipeDoc.update({id: recipeDetailsDoc.id, image: url});
  await recipeDetailsDoc.update({
    id: recipeDetailsDoc.id,
    image: url,
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
