import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from 'theme';
import {hp, wp} from 'helpers/responsiveScreen';
import {XMarkIcon} from 'react-native-heroicons/solid';

interface FilterBadgeProps {
  text: string;
  action?: () => void;
  active: boolean;
}

const FilterBadge = ({text, action, active}: FilterBadgeProps) => {
  return (
    <TouchableOpacity
      onPress={action}
      className="bg-black/10 rounded-full flex flex-row space-x-2 items-center justify-center px-2 py-px my-auto mr-2"
      style={active ? {backgroundColor: colors.cta} : {}}>
      <Text
        className={active ? 'text-white' : 'text-black px-2'}
        style={{fontSize: hp(1.8)}}>
        {text}
      </Text>
      {active ? <XMarkIcon size={hp(1.8)} color={'white'} /> : null}
    </TouchableOpacity>
  );
};

export default FilterBadge;
