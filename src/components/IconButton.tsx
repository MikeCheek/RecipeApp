import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {colors} from 'theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface IconButtonProps {
  Icon: typeof ChevronLeftIcon;
  onPress: () => void;
  thick?: boolean;
  thickABit?: boolean;
  big?: boolean;
  text?: string;
}

const IconButton = ({
  Icon,
  onPress,
  thick = false,
  thickABit = false,
  big = false,
  text,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-full p-2 space-x-2 flex-row items-center justify-center ${
        text ? 'pl-4' : ''
      }`}>
      {text && text.trim().length > 0 ? (
        <Text style={{color: colors.cta}}>{text}</Text>
      ) : null}
      <Icon
        size={big ? hp(4.5) : hp(3.5)}
        color={colors.cta}
        strokeWidth={thick ? 4 : thickABit ? 2 : undefined}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
