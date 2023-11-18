// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {collection, doc, getFirestore} from 'firebase/firestore';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import {getStorage, ref} from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from '@env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const userRef = (userId: string) => collection(db, userId);
export const userRecipes = (userId: string) => doc(userRef(userId), 'recipes');
export const recipesRef = collection(db, 'recipes');
export const recipeRef = collection(db, 'recipeDetails');
export const recipeImagesRef = ref(storage, 'recipe-images');

export default app;
