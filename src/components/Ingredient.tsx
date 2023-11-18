import {View, Text, TextInput} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface IngredientProps {
  ingredient: string;
  setIngredient?: (text: string) => void;
}

const Ingredient = ({ingredient, setIngredient}: IngredientProps) => {
  const [name, measure] = ingredient.split(':');
  return (
    <View className="flex flex-row space-x-4 items-center">
      <View
        style={{height: hp(1.5), width: hp(1.5)}}
        className="bg-amber-300 rounded-full"></View>
      <View className="flex-row space-x-2">
        {setIngredient ? (
          <TextInput
            style={{fontSize: hp(1.8)}}
            className="font-medium text-neutral-600 bg-white rounded-full pl-4 pr-[20%] mb-2 w-[95%]"
            value={ingredient}
            numberOfLines={1}
            onChangeText={setIngredient}
            placeholder="Name : measure"
            placeholderTextColor="gray"
          />
        ) : (
          <Text
            style={{fontSize: hp(1.8)}}
            className="font-medium text-neutral-600">
            {name}:{' '}
            <Text
              style={{fontSize: hp(1.8)}}
              className="font-extrabold text-neutral-700">
              {measure ? measure : ''}{' '}
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

export default Ingredient;
