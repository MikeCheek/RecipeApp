import {Text, Pressable} from 'react-native';
import React from 'react';
import {Recipe} from 'types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {Navigation} from 'navigation/types';
import {CachedImage} from './CachedImage';
import {colors} from 'theme';

interface RecipeCardProps {
  item: Recipe;
  index: number;
  navigation: Navigation;
}

const RecipeCard = ({item, index, navigation}: RecipeCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .duration(600)
        .springify()
        .damping(12)}>
      <Pressable
        className={`w-full relative flex justify-center mb-4 space-y-1 ${
          index % 2 == 0 ? 'pr-2' : 'pl-2'
        }`}
        onPress={() =>
          navigation.navigate('RecipeDetails', {
            id: item.id,
            image: item.image,
            name: item.name,
          })
        }>
        <Animated.Image
          source={{uri: item.image}}
          sharedTransitionTag={item.id}
          style={{
            width: '100%',
            height: index % 3 == 0 ? hp(25) : hp(35),
            borderRadius: 35,
          }}
        />
        <Text
          style={{fontSize: hp(1.7)}}
          className="font-bold ml-2 text-neutral-600">
          {item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
        </Text>
        {item.authorName ? (
          <Text
            style={{fontSize: hp(1.5), color: colors.secondaryCta}}
            className={`font-semibold ml-2 text-neutral-600`}>
            {item.authorName}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export default RecipeCard;
