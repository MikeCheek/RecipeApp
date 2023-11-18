import {User} from 'firebase/auth';
import {createContext, useContext} from 'react';

interface IUserContext {
  user: User | null;
  userLoading: boolean;
  cacheChecked: boolean;
  // setUser: (user: User) => void;
  setUserLoading: (userLoading: boolean) => void;
  // setCacheChecked: (cacheChecked: boolean) => void;
}

const UserContext = createContext<IUserContext>({
  user: null,
  userLoading: false,
  cacheChecked: false,
  // setUser: () => null,
  setUserLoading: () => null,
  // setCacheChecked: () => null,
});

export {UserContext};
export default () => useContext(UserContext);
