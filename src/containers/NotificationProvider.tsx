import React, {createContext, useContext, useEffect, useState} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';

type NotificationContextData = {
  authorized: boolean;
};

const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData,
);

const NotificationProvider = ({children}: {children?: React.ReactNode}) => {
  const [authorized, setAuthorized] = useState(false);
  //To listen to messages in the foreground: When the application is open and in view.
  useEffect(() => {
    if (!authorized)
      messaging()
        .requestPermission()
        .then(authorizationStatus => {
          if (authorizationStatus > 0) setAuthorized(true);
        });
  }, []);

  useEffect(() => {
    if (authorized) {
      messaging()
        .subscribeToTopic('News')
        .then(e => console.log('FCM - Subscribed to topic: News'))
        .catch(err => console.log(err));
      messaging().onMessage(remoteMessage =>
        onForegroundMessageReceived(remoteMessage),
      );
      messaging().setBackgroundMessageHandler(remoteMessage =>
        onBackgroundMessageReceived(remoteMessage),
      );

      notifee.onBackgroundEvent(async ({type, detail}) => {
        const {notification, pressAction} = detail;
        switch (type) {
          case EventType.DISMISSED:
            console.log('BE:User dismissed notification');

            break;
          case EventType.PRESS:
            console.log('BE:User pressed notification');
            if (pressAction) console.log(pressAction.launchActivity);
            if (notification && notification.id)
              await notifee.cancelNotification(notification.id);
            break;
        }
      });
      return notifee.onForegroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.DISMISSED:
            //console.log('FE:User dismissed notification', detail.notification);
            break;
          case EventType.PRESS:
            //console.log('FE:User pressed notification', detail.notification);
            break;
        }
      });
    }
  }, [authorized]);

  //When the application is in a background or quit state

  async function onBackgroundMessageReceived(
    message: FirebaseMessagingTypes.RemoteMessage,
  ) {
    message &&
      message.notification &&
      notifee.displayNotification({
        id: message.notification.title,
        title: message.notification.title,
        body: message.notification.body,
        android: {
          channelId: 'default',
        },
      });
  }

  async function onForegroundMessageReceived(
    message: FirebaseMessagingTypes.RemoteMessage,
  ) {
    message &&
      message.notification &&
      notifee.displayNotification({
        id: message.notification.title,
        title: message.notification.title,
        body: message.notification.body,
        android: {
          channelId: 'default',
        },
      });
  }

  return (
    <NotificationContext.Provider value={{authorized}}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = (): NotificationContextData => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within an NotificationProvider',
    );
  }
  return context;
};

export {NotificationContext, NotificationProvider, useNotification};
