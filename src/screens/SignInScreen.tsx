import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {colors} from 'theme';
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
import auth from '@react-native-firebase/auth';
import CustomButton from 'components/CustomButton';

const SignInScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {userLoading, setUserLoading} = useUserContext();

  const navigation = useNavigation<Navigation>();

  const submit = () => {
    if (email && password) {
      setUserLoading(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .catch(e => showMessage({message: e.message, type: 'warning'}))
        .finally(() => setUserLoading(false));
    } else {
      showMessage({
        message: 'Email and Password are required!',
        type: 'warning',
      });
    }
  };

  const recoverPassword = () => {
    if (email) {
      auth()
        .sendPasswordResetEmail(email)
        .then(() =>
          showMessage({
            message: 'We sent you an email to reset your password',
            type: 'success',
          }),
        )
        .catch(e => showMessage({message: e.message, type: 'warning'}));
    } else
      showMessage({
        message: 'Email is required!',
        type: 'warning',
      });
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
        <View className="space-y-2 mx-2 flex flex-col">
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
          <TouchableOpacity
            className="ml-auto flex items-end justify-end"
            onPress={recoverPassword}>
            <Text
              style={{
                color: colors.secondaryCta,
              }}
              className="text-end w-1/2">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {userLoading ? (
            <Loader />
          ) : (
            <CustomButton onPress={submit} text="Sign In" />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignInScreen;
