import {Text, Pressable, View} from 'react-native';
import React from 'react';
import {RecipeIngredients} from 'types';
import {hp, wp} from 'helpers/responsiveScreen';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {HomeNavigation} from 'navigation/types';

interface RecipeIngredientsCardProps {
  item: RecipeIngredients;
  index: number;
  navigation: HomeNavigation;
}

const RecipeIngredientsCard = ({
  item,
  index,
  navigation,
}: RecipeIngredientsCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .duration(600)
        .springify()
        .damping(12)}
      className="bg-white rounded-xl p-2 mb-2">
      <Pressable
        className={'w-full relative flex flex-row justify-start space-y-1'}
        onPress={() =>
          navigation.navigate('RecipeDetails', {
            id: item.id,
            image: item.image,
            name: item.name,
          })
        }>
        <Animated.Image
          source={{uri: item.image}}
          sharedTransitionTag={item.name}
          style={{
            width: wp(25),
            height: hp(10),
            borderRadius: 10,
          }}
        />
        <View className="flex flex-col ml-2 w-full" style={{maxWidth: wp(60)}}>
          <Text
            style={{fontSize: hp(1.7)}}
            className="font-bold text-neutral-600">
            {item.name.length > 35 ? item.name.slice(0, 35) + '...' : item.name}
          </Text>
          <Text style={{fontSize: hp(1.5)}} className="text-neutral-600 w-fit">
            {item.ingredients.map(i => i.split(':')[0]).join(', ')}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default RecipeIngredientsCard;
