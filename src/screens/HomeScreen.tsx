import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import Categories from 'components/Categories';
import Recipes from 'components/Recipes';
import {useAppDispatch} from 'redux/hooks';
import {setRecipes, setRecipesLoading} from 'redux/slices/recipes';
import {colors} from 'theme';
import {getRecipes} from 'helpers/db';
import useUserContext from 'helpers/useUserContext';
import useCategoryContext from 'helpers/useCategoryContext';
import {removeDuplicates} from 'helpers/array';
import NewsBanner from 'components/NewsBanner';

const HomeScreen = () => {
  const [clicked, setClicked] = useState<boolean>();
  const [search, setSearch] = useState<string>();
  const [searchFocus, setSearchFocus] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {user} = useUserContext();
  const {active, setActive} = useCategoryContext();

  const handleGetRecipes = async (category: string = 'Beef') => {
    dispatch(setRecipesLoading(true));
    dispatch(
      setRecipes(
        await getRecipes(category),
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
  }, [active]);

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
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 px-[6px]">
          <TextInput
            placeholder={`Search among ${active.toLowerCase()} recipes`}
            placeholderTextColor="gray"
            style={[
              {fontSize: hp(1.7)},
              searchFocus ? {width: '100%'} : {width: 10},
            ]}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocus(true)}
            enterKeyHint="search"
            returnKeyLabel="search"
          />
          <View className="bg-white rounded-full p-3">
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </View>
        </View>
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
