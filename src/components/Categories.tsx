import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {hp, wp} from 'helpers/responsiveScreen';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useAppSelector} from 'redux/hooks';
import Loader from './Loader';
import {colors} from 'theme';
import {HeartIcon} from 'react-native-heroicons/solid';

interface CategoriesProps {
  active?: string;
  setActive: (cat: string) => void;
  noAll?: boolean;
}

const Categories = ({active, setActive, noAll = false}: CategoriesProps) => {
  const {categories, categoriesLoading} = useAppSelector(
    state => state.categories,
  );

  const cats = noAll
    ? categories?.filter(
        c =>
          c.name.toLowerCase() != 'all' && c.name.toLowerCase() != 'favourites',
      )
    : categories;

  return (
    <>
      {categoriesLoading ? (
        <Loader />
      ) : cats ? (
        <Animated.View entering={FadeInDown.duration(500).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-4 mt-2"
            contentContainerStyle={{paddingHorizontal: 15}}>
            {cats.map((category, key) => (
              <TouchableOpacity
                key={key}
                className="flex items-center space-y-1"
                onPress={() => setActive(category.name)}>
                <View
                  className="rounded-full p-[6px] bg-black/10"
                  style={
                    active === category.name
                      ? {
                          backgroundColor: colors.yellow,
                        }
                      : {}
                  }>
                  {category.image ? (
                    typeof category.image === 'string' ? (
                      <Animated.Image
                        source={{uri: category.image}}
                        style={{width: hp(6), height: hp(6)}}
                        className="rounded-full"
                      />
                    ) : (
                      <Animated.Image
                        source={category.image}
                        style={{width: hp(6), height: hp(6)}}
                        className="rounded-full"
                      />
                    )
                  ) : (
                    <View
                      className="flex items-center justify-center"
                      style={{width: hp(6), height: hp(6)}}>
                      <HeartIcon size={hp(5)} color={colors.heart} />
                    </View>
                  )}
                </View>
                <Text className="text-neutral-600" style={{fontSize: hp(1.6)}}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      ) : (
        <Text>Fetch Error</Text>
      )}
    </>
  );
};

export default Categories;
