import {View, Text, TextInput} from 'react-native';
import React from 'react';
import {hp, wp} from 'helpers/responsiveScreen';
import {colors} from 'theme';
import {findNumbersRegexp} from 'helpers/regexp';

interface IngredientProps {
  ingredient: string;
  setIngredient?: (text: string) => void;
  modified?: boolean;
}

const Ingredient = ({
  ingredient,
  setIngredient,
  modified = false,
}: IngredientProps) => {
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
            {name.trim()}
            {measure ? ': ' : ''}
            {measure ? (
              <Text
                style={{
                  fontSize: hp(1.8),
                  color:
                    modified && measure.match(findNumbersRegexp)
                      ? colors.cta
                      : undefined,
                }}
                className="font-extrabold text-neutral-700">
                {measure.trim()}
              </Text>
            ) : null}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Ingredient;
