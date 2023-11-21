import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from 'theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface CustomButtonProps {
  secondary?: boolean;
  white?: boolean;
  text: string;
  onPress: () => void;
}

const CustomButton = ({
  secondary = false,
  white = false,
  text,
  onPress,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={white ? {} : {backgroundColor: colors.cta}}
      onPress={onPress}
      className={
        white
          ? 'shadow p-3 w-48 bg-white rounded-full mb-5'
          : 'mt-4 mb-8 rounded-full p-3 shadow-sm mx-2'
      }>
      <Text
        style={{fontSize: white ? hp(2.4) : hp(2.5)}}
        className={`text-center font-bold ${
          white ? 'text-amber-800' : 'text-white'
        }`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
