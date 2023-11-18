import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Recipe} from 'types';
import RecipeCard from './RecipeCard';
import MasonryList from 'reanimated-masonry-list';
import {useAppSelector} from 'redux/hooks';
import Loader from './Loader';
import {useNavigation} from '@react-navigation/native';
import {Navigation} from 'navigation/types';
import FilterBadge from './FilterBadge';
import Areas from './Areas';
import {removeDuplicates} from 'helpers/array';

interface RecipesProps {
  search?: string;
  removeSearch?: () => void;
}

const Recipes = ({search, removeSearch}: RecipesProps) => {
  const {recipes, recipesLoading} = useAppSelector(state => state.recipes);
  const navigation = useNavigation<Navigation>();
  const [area, setArea] = useState<string>();

  const filteredRecipes =
    (search || area) && recipes
      ? recipes.filter(recipe => {
          let resultArea = false;
          let resultSearch = false;
          if (area && recipe.area.toUpperCase() === area) resultArea = true;
          if (
            search &&
            recipe.name.toLowerCase().includes(search.trim().toLowerCase())
          )
            resultSearch = true;
          if (area && search) return resultArea && resultSearch;
          if (area) return resultArea;
          if (search) return resultSearch;
          return false;
        })
      : recipes;

  const areas = recipes
    ? removeDuplicates(recipes.map(r => r.area))
    : undefined;

  return (
    <View className="mx-4 space-y-3">
      <Areas areas={areas ?? []} setArea={setArea} active={area} />
      <View className="flex flex-row space-x-4 w-full max-w-full items-center justify-start">
        <Text
          style={{fontSize: hp(3)}}
          className="font-semibold text-neutral-600">
          Recipes
        </Text>
        <View className="flex flex-row mt-2">
          {search ? (
            <FilterBadge text={search} action={removeSearch} active />
          ) : null}
        </View>
      </View>
      <View>
        {recipesLoading ? (
          <Loader />
        ) : filteredRecipes && filteredRecipes.length > 0 ? (
          <MasonryList
            data={filteredRecipes}
            keyExtractor={(item): string => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({item, i}) => (
              <RecipeCard
                item={item as Recipe}
                index={i}
                navigation={navigation}
              />
            )}
            // refreshing={isLoadingNext}
            // onRefresh={() => refetch({first: ITEM_CNT})}
            onEndReachedThreshold={0.1}
            // onEndReached={() => loadNext(ITEM_CNT)}
          />
        ) : (
          <Text>
            {search
              ? `No recipes found for "${search}"`
              : 'No recipes for this section yet... add one!'}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Recipes;
