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
  HomeStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from './types';
import {
  HomeIcon as HomeIconOutline,
  UserIcon as UserIconOutline,
  PlusCircleIcon as PlusCircleIconOutline,
  ShoppingCartIcon as ShoppingCartIconOutline,
  BeakerIcon as BeakerOutline,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  BeakerIcon as BeakerSolid,
} from 'react-native-heroicons/solid';
import AccountScreen from 'screens/AccountScreen';
import AddScreen from 'screens/AddScreen';
import useUserContext from 'helpers/useUserContext';
import {showMessage} from 'react-native-flash-message';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import SearchAdvancedScreen from 'screens/SearchAdvancedScreen';
import ShoppingCartScreen from 'screens/ShoppingCartScreen';

const RootStackList = createNativeStackNavigator<RootStackParamList>();
const HomeStackList = createNativeStackNavigator<HomeStackParamList>();
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const HomeStack = () => {
  return (
    <HomeStackList.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <HomeStackList.Screen
        name="Home"
        component={HomeScreen}></HomeStackList.Screen>
      <HomeStackList.Screen
        name="RecipeDetails"
        component={RecipeDetailsScreen}
        initialParams={{}}></HomeStackList.Screen>
    </HomeStackList.Navigator>
  );
};

const BottomTabNavigator = () => {
  const size = 25;
  const sizeActive = size + 5;
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
          tabBarIcon: ({color, focused}) =>
            focused ? (
              <HomeIconSolid color={colors.navIcon} size={sizeActive} />
            ) : (
              <HomeIconOutline color={colors.navIcon} size={size} />
            ),
          tabBarLabel: () => {
            return null;
          },
        })}
      />
      <BottomTab.Screen
        name="SearchAdvancedTab"
        component={SearchAdvancedScreen}
        options={({navigation}: RootTabScreenProps<'SearchAdvancedTab'>) => ({
          title: 'SearchAdvanced',
          headerShown: false,
          tabBarIcon: ({color, focused}) =>
            focused ? (
              <BeakerSolid color={colors.navIcon} size={sizeActive} />
            ) : (
              <BeakerOutline color={colors.navIcon} size={size} />
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
              // <View
              //   style={{
              //     position: 'absolute',
              //     bottom: 0,
              //     padding: 10,
              //     borderRadius: 50,
              //     backgroundColor: colors.navTab,
              //   }}>
              <Icon
                color={colors.navSpecialIcon}
                size={focused ? sizeActive + 5 : size + 5}
              />
              // </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        })}
      />
      <BottomTab.Screen
        name="ShoppingCartTab"
        component={ShoppingCartScreen}
        options={({navigation}: RootTabScreenProps<'ShoppingCartTab'>) => ({
          title: 'IDK',
          headerShown: false,
          tabBarIcon: ({color, focused}) =>
            focused ? (
              <ShoppingCartIconSolid color={colors.navIcon} size={sizeActive} />
            ) : (
              <ShoppingCartIconOutline color={colors.navIcon} size={size} />
            ),
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
          tabBarIcon: ({color, focused}) =>
            focused ? (
              <UserIconSolid color={colors.navIcon} size={sizeActive} />
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
        <RootStackList.Navigator
          initialRouteName="Welcome"
          screenOptions={{headerShown: false}}>
          <RootStackList.Screen
            name="Welcome"
            component={WelcomeScreen}></RootStackList.Screen>
          <RootStackList.Screen
            name="SignIn"
            component={SignInScreen}></RootStackList.Screen>
          <RootStackList.Screen
            name="SignUp"
            component={SignUpScreen}></RootStackList.Screen>
        </RootStackList.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
