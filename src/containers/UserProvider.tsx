import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {UserContext} from 'helpers/useUserContext';
import messaging from '@react-native-firebase/messaging';
import React, {useState, useEffect} from 'react';
import {userTokens} from 'config/firebase';

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [cacheChecked, setCacheChecked] = useState<boolean>(false);
  const newUser = (user: FirebaseAuthTypes.User | null) => setUser(user);
  const cacheCheck = (checked: boolean) => setCacheChecked(checked);
  const changeLoadingStatus = (status: boolean) => setUserLoading(status);

  const registerMessaging = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();

    await userTokens(user!.uid).set({fcmToken: token});
  };

  useEffect(() => {
    if (user) registerMessaging().then(() => {});
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: newUser,
        cacheChecked: cacheChecked,
        setCacheChecked: cacheCheck,
        userLoading: userLoading,
        setUserLoading: changeLoadingStatus,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
