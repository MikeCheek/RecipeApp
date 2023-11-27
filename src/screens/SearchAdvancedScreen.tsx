import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {hp} from 'helpers/responsiveScreen';
import {colors} from 'theme';
import SearchBar from 'components/SearchBar';
import {Recipe, RecipeIngredients} from 'types';
import {getAllRecipesIngredients} from 'helpers/db';
import Loader from 'components/Loader';
import MasonryList from 'reanimated-masonry-list';
import {useNavigation} from '@react-navigation/native';
import {HomeNavigation} from 'navigation/types';
import RecipeIngredientsCard from 'components/RecipeIngredientsCard';
import {ScrollView} from 'react-native-gesture-handler';
import {showMessage} from 'react-native-flash-message';

const SearchAdvancedScreen = () => {
  const [search, setSearch] = useState<string>('');
  const [recipesIngredients, setRecipesIngredients] =
    useState<RecipeIngredients[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<HomeNavigation>();

  const minSearchLength = 2;

  const searchWords = search.split(',');
  const found = recipesIngredients?.filter(r => r.score === searchWords.length);
  const related = recipesIngredients?.filter(
    r => r.score > 0 && r.score < searchWords.length,
  );

  const fetchData = () => {
    getAllRecipesIngredients().then(data => setRecipesIngredients(data));
  };

  const calculateScore = () => {
    const check = searchWords.length >= minSearchLength;
    if (check) {
      setLoading(true);
      setRecipesIngredients(v =>
        v
          ? v.map(r => {
              let score = 0;
              for (let i = 0; i < r.ingredients.length; i++) {
                const value = r.ingredients[i].split(':')[0];
                searchWords.forEach(w => {
                  if (
                    value.trim().toLowerCase().includes(w.trim().toLowerCase())
                  ) {
                    score = score + 1;
                  }
                });
              }
              return {...r, score: score};
            })
          : undefined,
      );
      setLoading(false);
    } else
      showMessage({
        message: `Insert at least ${minSearchLength} ingredients to search`,
        type: 'danger',
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScreenWrapper>
      <View className="mx-4 my-4">
        <Text
          style={{fontSize: hp(3.8)}}
          className="font-semibold text-neutral-600">
          Search for the <Text style={{color: colors.yellow}}>perfect</Text>{' '}
          recipe
        </Text>
      </View>
      <View className="px-4 mb-8">
        <Text
          className={`${colors.heading} text-base font-semibold text-center mb-2`}>
          Insert at least {minSearchLength} ingredients you have at home to find
          a recipe
        </Text>
        <SearchBar
          placeholder="Pasta, onion, potato, ..."
          value={search}
          onChangeText={setSearch}
          onSearch={calculateScore}
        />
      </View>
      <ScrollView
        contentContainerStyle={{paddingBottom: 80}}
        className="h-full px-4">
        {loading ? (
          <Loader />
        ) : recipesIngredients && recipesIngredients.length > 0 ? (
          <View>
            <Text
              style={{fontSize: hp(2.3), color: colors.cta}}
              className="font-bold text-neutral-600 mb-2">
              Found with all ingredients:
            </Text>
            {found ? (
              found.map((r, key) => (
                <RecipeIngredientsCard
                  index={key}
                  key={key}
                  item={r}
                  navigation={navigation}
                />
              ))
            ) : (
              <Text>No recipe found with all ingredients</Text>
            )}
            <Text
              style={{fontSize: hp(2.3), color: colors.cta}}
              className="font-bold text-neutral-600 mb-2 mt-4">
              Found with some ingredients:
            </Text>
            {related ? (
              related.map((r, key) => (
                <RecipeIngredientsCard
                  index={key}
                  key={key}
                  item={r}
                  navigation={navigation}
                />
              ))
            ) : (
              <Text>No recipe found with some of the ingredients</Text>
            )}
          </View>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SearchAdvancedScreen;
