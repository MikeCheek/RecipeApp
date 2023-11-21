import React, {useEffect} from 'react';
import AppNavigation from 'navigation';
import {Provider} from 'react-redux';
import {store} from 'redux/store';
import FlashMessage from 'react-native-flash-message';
import {AvoidSoftInput} from 'react-native-avoid-softinput';
import {decode} from 'base-64';
import remoteConfig from '@react-native-firebase/remote-config';
import {NotificationProvider} from 'containers/NotificationProvider';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import UserProvider from 'containers/UserProvider';
import LoaderProvider from 'containers/LoaderProvider';
import CategoryProvider from 'containers/CategoryProvider';

const App = () => {
  const setupRemoteConfig = () => {
    remoteConfig()
      .setDefaults({
        news: '',
      })
      .then(() =>
        remoteConfig()
          .setConfigSettings({minimumFetchIntervalMillis: 3600000})
          .then(() =>
            remoteConfig()
              .fetchAndActivate()
              .then(fetchedRemotely => {
                if (fetchedRemotely) {
                  console.log(
                    '+++Configs were retrieved from the backend and activated.',
                  );
                  console.log(fetchedRemotely);
                } else {
                  console.log(
                    '+++++No configs were fetched from the backend, and the local configs were already activated',
                  );
                }
              }),
          ),
      );
  };

  useEffect(() => {
    if (typeof atob === 'undefined') {
      global.atob = decode;
    }
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    setupRemoteConfig();
  }, []);

  return (
    <NotificationProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <LoaderProvider>
            <UserProvider>
              <CategoryProvider>
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
                </Provider>
              </CategoryProvider>
            </UserProvider>
          </LoaderProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </NotificationProvider>
  );
};

export default App;
