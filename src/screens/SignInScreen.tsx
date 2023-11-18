import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {colors} from 'theme';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from 'config/firebase';
import {FirebaseError} from 'firebase/app';
import Loader from 'components/Loader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import CustomTextInput from 'components/CustomTextInput';
import IconButton from 'components/IconButton';
import {ChevronLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {Navigation} from 'navigation/types';
import useUserContext from 'helpers/useUserContext';

const SignInScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {userLoading, setUserLoading} = useUserContext();

  const navigation = useNavigation<Navigation>();

  const submit = () => {
    if (email && password) {
      setUserLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .catch((e: FirebaseError) =>
          showMessage({message: e.message, type: 'warning'}),
        )
        .finally(() => setUserLoading(false));
    } else {
      showMessage({
        message: 'Email and Password are required!',
        type: 'warning',
      });
    }
  };

  return (
    <ScreenWrapper inputs>
      <View className="flex justify-between h-full mx-4 mt-5">
        <View className="relative">
          <View className="absolute top-0 left-0 z-10">
            <IconButton
              Icon={ChevronLeftIcon}
              onPress={() => navigation.goBack()}
            />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{fontSize: hp(2.5)}}>
            Sign In
          </Text>
        </View>

        <View className="flex-row justify-center">
          <Image
            style={{width: hp(40), height: hp(40)}}
            source={require('../assets/images/login.png')}
          />
        </View>
        <View className="space-y-2 mx-2">
          <CustomTextInput
            text="Email"
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            keyboardType="email-address"
            enterKeyHint="next"
            returnKeyType="next"
          />
          <CustomTextInput
            text="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
          />
          <TouchableOpacity className="flex-row justify-end">
            <Text className={colors.heading}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View>
          {userLoading ? (
            <Loader />
          ) : (
            <TouchableOpacity
              style={{backgroundColor: colors.cta}}
              onPress={submit}
              className="mt-4 mb-8 rounded-full p-3 shadow-sm mx-2">
              <Text
                style={{fontSize: hp(2.5)}}
                className="text-center text-white font-bold">
                Sign In
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignInScreen;
