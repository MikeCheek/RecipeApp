import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {colors} from 'theme';
import {hp, wp} from 'helpers/responsiveScreen';

interface IconButtonProps {
  Icon: typeof ChevronLeftIcon;
  onPress: () => void;
  thick?: boolean;
  thickABit?: boolean;
  big?: boolean;
  small?: boolean;
  text?: string;
  dangerous?: boolean;
}

const IconButton = ({
  Icon,
  onPress,
  thick = false,
  thickABit = false,
  big = false,
  small = false,
  text,
  dangerous = false,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full p-2 space-x-2 flex-row items-center shadow-sm shadow-black justify-center ${
        text ? 'pl-4' : ''
      }`}
      style={{backgroundColor: dangerous ? colors.heart : 'white'}}>
      {text && text.trim().length > 0 ? (
        <Text style={{color: colors.cta}}>{text}</Text>
      ) : null}
      <Icon
        size={big ? hp(4.5) : small ? hp(2.8) : hp(3.5)}
        color={dangerous ? 'white' : colors.cta}
        strokeWidth={thick ? 4 : thickABit ? 2 : undefined}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
