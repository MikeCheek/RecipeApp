import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const userRef = (userId: string) => firestore().collection(userId);
export const userRecipes = (userId: string) => userRef(userId).doc('recipes');
export const userTokens = (userId: string) => userRef(userId).doc('tokens');
export const recipesRef = firestore().collection('recipes');
export const recipeRef = firestore().collection('recipeDetails');
export const recipeImagesRef = storage().ref('recipe-images');
export const recipeImageRef = (id: String) =>
  storage().ref('recipe-images/' + id);
