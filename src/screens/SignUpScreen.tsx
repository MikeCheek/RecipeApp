import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {colors} from 'theme';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import {auth} from 'config/firebase';
import {FirebaseError} from 'firebase/app';
import Loader from 'components/Loader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import {Navigation} from 'navigation/types';
import CustomTextInput from 'components/CustomTextInput';
import IconButton from 'components/IconButton';
import {ChevronLeftIcon} from 'react-native-heroicons/solid';
import useUserContext from 'helpers/useUserContext';

const SignUpScreen = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {userLoading, setUserLoading} = useUserContext();

  const navigation = useNavigation<Navigation>();

  const submit = () => {
    if (email && password && name) {
      setUserLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          updateProfile(result.user, {displayName: name});
          sendEmailVerification(result.user);
        })
        .catch((e: FirebaseError) =>
          showMessage({message: e.message, type: 'warning'}),
        )
        .finally(() => {
          setUserLoading(false);
          showMessage({
            message: 'Check your email',
            description:
              "We've just sent you a confirmation email! Click the link in the mail to activate your account",
            type: 'info',
          });
          navigation.navigate('SignIn');
        });
    } else {
      showMessage({
        message: 'All fields are required!',
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
              thick
              onPress={() => navigation.goBack()}
            />
          </View>
          <Text
            className="text-xl font-bold text-center"
            style={{fontSize: hp(2.5)}}>
            Sign Up
          </Text>
        </View>

        <View className="flex-row justify-center my-3 mt-5">
          <Image
            style={{width: hp(20), height: hp(20)}}
            source={require('../assets/images/signup.png')}
          />
        </View>
        <View className="space-y-2 mx-2">
          <CustomTextInput
            text="Name"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            enterKeyHint="next"
            returnKeyType="next"
          />
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
                Sign Up
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUpScreen;
