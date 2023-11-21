import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createContext, useContext} from 'react';

interface IUserContext {
  user: FirebaseAuthTypes.User | null;
  userLoading: boolean;
  cacheChecked: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setUserLoading: (userLoading: boolean) => void;
  setCacheChecked: (cacheChecked: boolean) => void;
}

const UserContext = createContext<IUserContext>({
  user: null,
  userLoading: false,
  cacheChecked: false,
  setUser: () => null,
  setUserLoading: () => null,
  setCacheChecked: () => null,
});

export {UserContext};
export default () => useContext(UserContext);
