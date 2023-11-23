import {Text} from 'react-native';
import React from 'react';
import NewsBanner from 'components/NewsBanner';
import ScreenWrapper from 'components/ScreenWrapper';
import auth from '@react-native-firebase/auth';
import CustomButton from 'components/CustomButton';

const AccountScreen = () => {
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
