import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RecipeDetailsScreen from 'screens/RecipeDetailsScreen';
import SignInScreen from 'screens/SignInScreen';
import SignUpScreen from 'screens/SignUpScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from 'theme';
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from './types';
import {
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
  PlusCircleIcon as PlusCircleIconOutline,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
} from 'react-native-heroicons/solid';
import AccountScreen from 'screens/AccountScreen';
import AddScreen from 'screens/AddScreen';
import useUserContext from 'helpers/useUserContext';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetailsScreen}
        initialParams={{}}></Stack.Screen>
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          backgroundColor: colors.navTab,
        },
      }}>
      <BottomTab.Screen
        name="HomeTab"
        component={HomeStack}
        options={({navigation}: RootTabScreenProps<'HomeTab'>) => ({
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({color, focused, size}) =>
            focused ? (
              <HomeIconSolid color={colors.navIcon} size={size + 5} />
            ) : (
              <HomeIconOutline color={colors.navIcon} size={size} />
            ),
          tabBarLabel: () => {
            return null;
          },
        })}
      />
      <BottomTab.Screen
        name="AddTab"
        component={AddScreen}
        options={({navigation}: RootTabScreenProps<'AddTab'>) => ({
          title: 'Add',
          headerShown: false,
          tabBarIcon: ({color, focused, size}) => {
            const Icon = focused ? PlusCircleIconSolid : PlusCircleIconOutline;
            return (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  padding: 10,
                  borderRadius: 50,
                  backgroundColor: colors.navTab,
                }}>
                <Icon color={colors.navSpecialIcon} size={size + 30} />
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        })}
      />
      <BottomTab.Screen
        name="AccountTab"
        component={AccountScreen}
        options={({navigation}: RootTabScreenProps<'AccountTab'>) => ({
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({color, focused, size}) =>
            focused ? (
              <UserIconSolid color={colors.navIcon} size={size + 5} />
            ) : (
              <UserIconOutline color={colors.navIcon} size={size} />
            ),
          tabBarLabel: () => {
            return null;
          },
        })}
      />
    </BottomTab.Navigator>
  );
};

const AppNavigation = () => {
  const {user, setUser, setCacheChecked, cacheChecked} = useUserContext();

  const handleAuthChange = (u: FirebaseAuthTypes.User | null) => {
    if (u) {
      if (u.emailVerified || u.isAnonymous) setUser(u);
      else
        showMessage({
          message: 'You need to verify your email first!',
          description:
            'Check your email and click the link to activate your account',
          type: 'danger',
          duration: 20000,
        });
    } else setUser(null);
    if (!cacheChecked) setCacheChecked(true);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(handleAuthChange);
    return subscriber;
  }, []);

  return (
    <NavigationContainer>
      {user && (user.isAnonymous || user.emailVerified) ? (
        <BottomTabNavigator />
      ) : (
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Welcome" component={WelcomeScreen}></Stack.Screen>
          <Stack.Screen name="SignIn" component={SignInScreen}></Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUpScreen}></Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
