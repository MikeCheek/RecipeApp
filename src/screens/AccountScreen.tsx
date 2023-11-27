import {Text, View} from 'react-native';
import React from 'react';
import NewsBanner from 'components/NewsBanner';
import ScreenWrapper from 'components/ScreenWrapper';
import auth from '@react-native-firebase/auth';
import CustomButton from 'components/CustomButton';
import {colors} from 'theme';
import {hp} from 'helpers/responsiveScreen';
import useUserContext from 'helpers/useUserContext';

const AccountScreen = () => {
  const {user} = useUserContext();
  return (
    <ScreenWrapper className="relative">
      <NewsBanner />
      <View className="mx-4 my-4">
        <Text
          style={{fontSize: hp(3.8)}}
          className="font-semibold text-neutral-600 text-right mt-8">
          Hi <Text style={{color: colors.yellow}}>{user?.displayName}</Text>
        </Text>
        <CustomButton
          onPress={async () => await auth().signOut()}
          text="Log out"
        />
      </View>
    </ScreenWrapper>
  );
};

export default AccountScreen;
