import {Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {Recipe} from 'types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Animated, {BounceIn, FadeInDown} from 'react-native-reanimated';
import {Navigation} from 'navigation/types';
import {colors} from 'theme';
import IconButton from './IconButton';
import {ArrowUturnLeftIcon, TrashIcon} from 'react-native-heroicons/outline';
import useUserContext from 'helpers/useUserContext';

interface RecipeCardProps {
  item: Recipe;
  index: number;
  navigation: Navigation;
  deleteAction: (id: string) => void;
}

const RecipeCard = ({
  item,
  index,
  navigation,
  deleteAction,
}: RecipeCardProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const {user} = useUserContext();
  const imTheAuthor = user && item ? user.uid === item.author : false;
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
        onLongPress={() => imTheAuthor && setShowOptions(true)}
        onPress={() =>
          showOptions
            ? setShowOptions(false)
            : navigation.navigate('RecipeDetails', {
                id: item.id,
                image: item.image,
                name: item.name,
              })
        }>
        <Animated.Image
          source={{uri: item.image}}
          sharedTransitionTag={item.name}
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
            Author:{' '}
            {user && item.author === user.uid ? (
              <Text style={{color: colors.cta}}>You</Text>
            ) : item.authorName.length > 20 ? (
              item.authorName.slice(0, 20) + '...'
            ) : (
              item.authorName
            )}
          </Text>
        ) : null}
        {showOptions ? (
          <Animated.View
            entering={BounceIn.duration(600).springify().damping(12)}
            style={{
              height: index % 3 == 0 ? hp(25) : hp(35),
              borderRadius: 35,
              left: index % 2 == 0 ? -1 : 8,
            }}
            className="absolute w-full flex flex-row -top-1 z-10 items-center justify-evenly bg-gray-500/50">
            <IconButton
              Icon={ArrowUturnLeftIcon}
              onPress={() => setShowOptions(false)}
            />
            <IconButton
              Icon={TrashIcon}
              onPress={() => deleteAction(item.id)}
            />
          </Animated.View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export default RecipeCard;
