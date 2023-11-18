import React, {useEffect, useState} from 'react';
import AppNavigation from 'navigation';
import {Provider} from 'react-redux';
import {store} from 'redux/store';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {AvoidSoftInput} from 'react-native-avoid-softinput';
import {decode} from 'base-64';
import {UserContext} from 'helpers/useUserContext';
import {User, onAuthStateChanged} from 'firebase/auth';
import {auth, recipesRef} from 'config/firebase';
import PageLoader from 'components/PageLoader';
import {LoaderContext} from 'helpers/useLoaderContext';
import {CategoryContext} from 'helpers/useCategoryContext';
import {onSnapshot, query, where} from 'firebase/firestore';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [cacheChecked, setCacheChecked] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [active, setActive] = useState<string>('Beef');
  const [clicked, setClicked] = useState<boolean>(false);

  // const newUser = (user: User) => setUser(user);
  // const cacheCheck = (checked: boolean) => setCacheChecked(checked);
  const changeLoadingStatus = (status: boolean) => setUserLoading(status);

  onAuthStateChanged(auth, u => {
    if (u) {
      if (u.emailVerified) setUser(u);
      else
        showMessage({
          message: 'You need to verify your email first!',
          description:
            'Check your email and click the link to activate your account',
          type: 'danger',
          duration: 20000,
        });
    }
    if (!cacheChecked) setCacheChecked(true);
  });

  useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    if (typeof atob === 'undefined') {
      global.atob = decode;
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user,
        // setUser: newUser,
        cacheChecked: cacheChecked,
        // setCacheChecked: cacheCheck,
        userLoading: userLoading,
        setUserLoading: changeLoadingStatus,
      }}>
      <LoaderContext.Provider
        value={{visible: showLoader, setVisible: setShowLoader}}>
        <CategoryContext.Provider
          value={{
            active: active,
            setActive: setActive,
            clicked: clicked,
            setClicked: setClicked,
          }}>
          <Provider store={store}>
            <AppNavigation />
            <FlashMessage
              position="top"
              duration={5000}
              style={{
                marginTop: 40,
                borderRadius: 10,
                width: '90%',
                marginLeft: '5%',
                marginRight: '5%',
              }}
            />
            <PageLoader visible={showLoader} />
          </Provider>
        </CategoryContext.Provider>
      </LoaderContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
