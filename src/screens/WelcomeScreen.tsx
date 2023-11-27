import {View, Text, StatusBar, Image, TouchableOpacity} from 'react-native';
import {hp, wp} from 'helpers/responsiveScreen';
import React, {useEffect} from 'react';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {RootNavigation} from 'navigation/types';
import {useAppDispatch} from 'redux/hooks';
import {setCategories, setCategoriesLoading} from 'redux/slices/categories';
import {setRecipes, setRecipesLoading} from 'redux/slices/recipes';
import {fetchCategories} from 'helpers/fetchers';
import {getRecipes} from 'helpers/db';
import useUserContext from 'helpers/useUserContext';
import auth from '@react-native-firebase/auth';
import CustomButton from 'components/CustomButton';

const WelcomeScreen = () => {
  const ring1Padding = useSharedValue(0);
  const ring2Padding = useSharedValue(0);

  const navigation = useNavigation<RootNavigation>();

  const {user, cacheChecked, userData} = useUserContext();

  const dispatch = useAppDispatch();

  const getCategories = async () => {
    dispatch(setCategoriesLoading(true));
    const data = await fetchCategories();
    dispatch(
      setCategories([
        {
          id: '000000000',
          name: 'Favourites',
          description: 'All favourites',
        },
        {
          id: '000000001',
          name: 'All',
          image: require('assets/images/welcome.png'),
          description: 'All meals',
        },
        ...data.categories.map(cat => ({
          id: String(cat.idCategory),
          name: cat.strCategory,
          image: cat.strCategoryThumb,
          description: cat.strCategoryDescription,
        })),
      ]),
    );
    dispatch(setCategoriesLoading(false));
  };

  const handleGetRecipes = async (category: string = 'Beef') => {
    dispatch(setRecipesLoading(true));
    const data = await getRecipes(
      category,
      category.toLowerCase() === 'favourites'
        ? userData?.recipes?.favourites
        : undefined,
    );
    dispatch(
      setRecipes(
        data,
        // data.meals.map(m => ({
        //   id: String(m.idMeal),
        //   name: m.strMeal,
        //   image: m.strMealThumb,
        // })),
      ),
    );
    dispatch(setRecipesLoading(false));
  };

  const signInGuest = async () => {
    await auth().signInAnonymously();
  };

  const fetchData = () => {
    try {
      getCategories().then(
        () => user && handleGetRecipes(),
        // .then(() => navigation.navigate('Home')),
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    ring1Padding.value = 0;
    ring2Padding.value = 0;
    setTimeout(
      () => (
        (ring1Padding.value = withSpring(ring1Padding.value + hp(5))), 100
      ),
    );
    setTimeout(
      () => (
        (ring2Padding.value = withSpring(ring2Padding.value + hp(5.5))), 300
      ),
    );
    fetchData(), 300;
  }, []);

  return (
    <View className="flex-1 justify-center items-center space-y-10 bg-amber-500">
      <StatusBar barStyle="light-content" />

      <Animated.View
        className="bg-white/20 rounded-full"
        style={{padding: ring2Padding}}>
        <Animated.View
          className="bg-white/20 rounded-full"
          style={{padding: ring1Padding}}>
          <Image
            source={require('assets/images/welcome.png')}
            style={{width: hp(20), height: hp(20)}}
          />
        </Animated.View>
      </Animated.View>
      {cacheChecked && !user ? (
        <View className="flex items-center space-y-2">
          <CustomButton
            onPress={() => navigation.navigate('SignIn')}
            text="Sign In"
            white
          />
          <CustomButton
            onPress={() => navigation.navigate('SignUp')}
            text="Sign Up"
            white
          />
          <TouchableOpacity onPress={signInGuest}>
            <Text className="text-white">Sign in as a guest</Text>
          </TouchableOpacity>
          {/* <Text
          className="font-bold text-white tracking-widest"
          style={{fontSize: hp(7)}}>
          Foody
        </Text>
        <Text
          className="font-medium text-white tracking-widest"
          style={{fontSize: hp(2)}}>
          Food is always right
        </Text> */}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default WelcomeScreen;
