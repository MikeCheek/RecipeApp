import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Categories from 'components/Categories';
import Recipes from 'components/Recipes';
import {useAppDispatch} from 'redux/hooks';
import {setRecipes, setRecipesLoading} from 'redux/slices/recipes';
import {colors} from 'theme';
import {getRecipes} from 'helpers/db';
import useUserContext from 'helpers/useUserContext';
import useCategoryContext from 'helpers/useCategoryContext';
import {hp} from 'helpers/responsiveScreen';
import SearchBar from 'components/SearchBar';

const HomeScreen = () => {
  const [clicked, setClicked] = useState<boolean>();
  const [search, setSearch] = useState<string>();

  const dispatch = useAppDispatch();
  const {user, userData} = useUserContext();
  const {active, setActive} = useCategoryContext();

  const handleGetRecipes = async (category: string = 'Beef') => {
    dispatch(setRecipesLoading(true));
    dispatch(
      setRecipes(
        await getRecipes(
          category,
          category.toLowerCase() === 'favourites'
            ? userData?.recipes?.favourites
            : undefined,
        ),
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
      handleGetRecipes(active);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (clicked === undefined) {
      fetchData();
      setClicked(false);
    } else if (clicked) fetchData();
  }, [active, userData?.recipes?.favourites]);

  return (
    <View className="flex-1 bg-white relative">
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}
        className="relative space-y-6 pt-8">
        <View className="absolute top-4 right-0 mx-4 flex-row justify-between items-center mb-2">
          <Image
            source={require('assets/images/avatar.png')}
            style={{height: hp(5), width: hp(5.5)}}
          />
        </View>
        <View className="mx-4 space-y-2">
          <Text style={{fontSize: hp(1.7)}} className="text-neutral-600">
            Hello, {user?.displayName ?? 'Mbare'}!
          </Text>
          <Text
            style={{fontSize: hp(3.8)}}
            className="font-semibold text-neutral-600">
            Hungry? Cook some{' '}
            <Text style={{color: colors.yellow}}>delicious</Text> food
          </Text>
        </View>
        <SearchBar
          placeholder={`Search among ${active.toLowerCase()} recipes`}
          value={search}
          onChangeText={setSearch}
        />
        <View>
          <Categories
            active={active}
            setActive={(c: string) => {
              if (!clicked) setClicked(true);
              setActive(c);
            }}
          />
        </View>
        <View className="pb-20">
          <Recipes search={search} removeSearch={() => setSearch(undefined)} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
