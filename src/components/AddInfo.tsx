import {View} from 'react-native';
import React from 'react';
import {RecipeInfo} from 'types';
import RecipeBadge from './RecipeBadge';
import {
  ClockIcon,
  FireIcon,
  Square3Stack3DIcon,
  UsersIcon,
} from 'react-native-heroicons/outline';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface AddInfoProps {
  info: RecipeInfo;
  setInfo?: React.Dispatch<React.SetStateAction<RecipeInfo>>;
}

const AddInfo = ({info, setInfo}: AddInfoProps) => {
  return (
    <View className="flex-row justify-around w-full">
      <RecipeBadge
        title={info.minutes}
        setTitle={
          setInfo
            ? (title: string) => setInfo(i => ({...i, minutes: title}))
            : undefined
        }
        description="Minutes"
        icon={<ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />}
      />
      <RecipeBadge
        title={info.servings}
        setTitle={
          setInfo
            ? (title: string) => setInfo(i => ({...i, servings: title}))
            : undefined
        }
        description="Servings"
        icon={<UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252" />}
      />
      <RecipeBadge
        title={info.calories}
        setTitle={
          setInfo
            ? (title: string) => setInfo(i => ({...i, calories: title}))
            : undefined
        }
        description="Calories"
        icon={<FireIcon size={hp(4)} strokeWidth={2.5} color="#525252" />}
      />
      <RecipeBadge
        title={info.difficulty}
        setTitle={
          setInfo
            ? (title: string) => setInfo(i => ({...i, difficulty: title}))
            : undefined
        }
        description="Difficulty"
        icon={
          <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
        }
      />
    </View>
  );
};

export default AddInfo;
