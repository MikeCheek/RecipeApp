import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import notifee from '@notifee/react-native';
import NewsBanner from 'components/NewsBanner';
import ScreenWrapper from 'components/ScreenWrapper';
import {colors} from 'theme';
import auth from '@react-native-firebase/auth';
import CustomButton from 'components/CustomButton';

const AccountScreen = () => {
  const value = remoteConfig().getValue('news');
  return (
    <ScreenWrapper className="relative">
      <NewsBanner />
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <CustomButton
        onPress={async () => await auth().signOut()}
        text="Log out"
      />
    </ScreenWrapper>
  );
};

export default AccountScreen;
