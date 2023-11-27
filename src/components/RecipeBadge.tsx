import {View, Text, TextInput} from 'react-native';
import {hp, wp} from 'helpers/responsiveScreen';
import React from 'react';
import {colors} from 'theme';

interface RecipeBadgeProps {
  title?: string;
  description: string;
  icon: React.ReactNode;
  setTitle?: (title: string) => void;
  setDescription?: (description: string) => void;
}

const RecipeBadge = ({
  icon,
  title,
  description,
  setTitle,
}: RecipeBadgeProps) => {
  return (
    <View
      className="flex rounded-full p-2 items-center justify-center"
      style={{backgroundColor: colors.yellow}}>
      <View
        style={{height: hp(6.5), width: hp(6.5)}}
        className="bg-white rounded-full flex items-center justify-center">
        {icon}
      </View>
      <View className="flex items-center py-2 space-y-1">
        {setTitle ? (
          <TextInput
            style={{fontSize: hp(2)}}
            className="font-bold text-neutral-700 border-b-2 border-white"
            value={title}
            onChangeText={setTitle}
            placeholder="?"
            placeholderTextColor={'grey'}
          />
        ) : (
          <Text
            style={{fontSize: hp(2)}}
            className={`font-bold ${
              title ? 'text-neutral-700' : 'text-neutral-500'
            }`}>
            {title ?? '?'}
          </Text>
        )}
        <Text
          style={{fontSize: hp(1.3)}}
          className="font-bold text-neutral-700">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default RecipeBadge;
