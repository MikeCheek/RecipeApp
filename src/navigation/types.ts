import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type HomeNavigation = NativeStackNavigationProp<HomeStackParamList>;
export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  RecipeDetails: {id: string; image: string; name: string};
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  HomeTab: undefined;
  AddTab: undefined;
  AccountTab: undefined;
  SearchAdvancedTab: undefined;
  ShoppingCartTab: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
export type RecipeDetailsScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'RecipeDetails'
>;
