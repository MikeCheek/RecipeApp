import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createContext, useContext} from 'react';
import {User} from 'types';

interface IUserContext {
  user: FirebaseAuthTypes.User | null;
  userLoading: boolean;
  cacheChecked: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setUserLoading: (userLoading: boolean) => void;
  setCacheChecked: (cacheChecked: boolean) => void;
  userData?: User;
  refreshUserData: () => void;
}

const UserContext = createContext<IUserContext>({
  user: null,
  userLoading: false,
  cacheChecked: false,
  setUser: () => null,
  setUserLoading: () => null,
  setCacheChecked: () => null,
  userData: undefined,
  refreshUserData: () => null,
});

export {UserContext};
export default () => useContext(UserContext);
