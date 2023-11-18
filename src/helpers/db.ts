import {
  recipeImagesRef,
  recipeRef,
  recipesRef,
  storage,
  userRecipes,
  userRef,
} from 'config/firebase';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {Recipe, RecipeDetails, User} from 'types';

export const getRecipes = async (category: string) => {
  const q =
    category.toLowerCase() === 'all'
      ? recipesRef
      : query(recipesRef, where('category', '==', category));
  const querySnapshot = await getDocs(q);
  let docs: Recipe[] = [];
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i];
    const data = doc.data();
    docs.push(data as Recipe);
  }

  return docs.sort((a, b) => b.datetime - a.datetime);
};

export const getRecipeDetails = async (recipeId: string) => {
  const q = query(recipeRef, where('id', '==', recipeId));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];
  const data = {...doc.data(), id: doc.id} as RecipeDetails;

  return {...data};
};

export const getUserPreferences = async (userId: string) => {
  const querySnapshot = await getDocs(userRef(userId));
  return querySnapshot.docs[0].data() as User;
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
  const recipeDoc = await addDoc(recipesRef, recipe);
  const recipeDetailsDoc = await addDoc(recipeRef, {
    ...recipeDetails,
  });

  // const blob = await base64toBlob(imageData.image ?? '', imageData.imageType);
  const res = await fetch(imageData.image ?? '');
  const blob = await res.blob();

  await uploadBytes(ref(recipeImagesRef, recipeDetailsDoc.id), blob);
  const url = await getDownloadURL(ref(recipeImagesRef, recipeDetailsDoc.id));
  await updateDoc(recipeDoc, {id: recipeDetailsDoc.id, image: url});
  await updateDoc(recipeDetailsDoc, {
    id: recipeDetailsDoc.id,
    image: url,
  });
};

export const likeRecipe = async (userId: string, recipeId: string) => {
  const recipesDoc = userRecipes(userId);
  const snap = await getDoc(recipesDoc);

  if (snap.exists())
    await updateDoc(recipesDoc, {
      favourites: arrayUnion(recipeId),
    });
  else await setDoc(recipesDoc, {favourites: [recipeId]});
};

export const unlikeRecipe = async (userId: string, recipeId: string) => {
  const recipesDoc = userRecipes(userId);
  const snap = await getDoc(recipesDoc);

  if (snap.exists())
    await updateDoc(recipesDoc, {
      favourites: arrayRemove(recipeId),
    });
};
