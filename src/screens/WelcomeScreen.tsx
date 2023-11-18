import {View, Text, StatusBar, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useEffect} from 'react';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {Navigation} from 'navigation/types';
import {useAppDispatch} from 'redux/hooks';
import {setCategories, setCategoriesLoading} from 'redux/slices/categories';
import {setRecipes, setRecipesLoading} from 'redux/slices/recipes';
import {fetchCategories} from 'helpers/fetchers';
import {getRecipes} from 'helpers/db';
import useUserContext from 'helpers/useUserContext';

const WelcomeScreen = () => {
  const ring1Padding = useSharedValue(0);
  const ring2Padding = useSharedValue(0);

  const navigation = useNavigation<Navigation>();

  const {user, cacheChecked} = useUserContext();

  const dispatch = useAppDispatch();

  const getCategories = async () => {
    dispatch(setCategoriesLoading(true));
    const data = await fetchCategories();
    dispatch(
      setCategories([
        {
          id: '00000000',
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
    const data = await getRecipes(category);
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
    fetchData();
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
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            className="shadow p-3 w-48 bg-white rounded-full mb-5">
            <Text className="text-center text-amber-800 text-lg font-bold">
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className="shadow p-3 w-48 bg-white rounded-full mb-5">
            <Text className="text-center text-amber-800 text-lg font-bold">
              Sign Up
            </Text>
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
