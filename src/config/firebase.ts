import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

export const userRef = (userId: string) => firestore().collection(userId);
export const userShopping = (userId: string) => userRef(userId).doc('shopping');
export const userRecipes = (userId: string) => userRef(userId).doc('recipes');
export const userTokens = (userId: string) => userRef(userId).doc('tokens');
export const recipesRef = firestore().collection('recipes');
export const recipeRef = firestore().collection('recipeDetails');
export const recipeImagesRef = storage().ref('recipe-images');
export const recipeImageRef = (id: String) =>
  storage().ref('recipe-images/' + id);

export const sendNotificationToAll = async (title: string, text?: string) => {
  const data = {
    to: '/topics/news',
    data: {
      message: title,
    },
  };
  const res = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'key=' + messaging().getToken(),
    },
    body: JSON.stringify(data),
  });
  return res;
};
