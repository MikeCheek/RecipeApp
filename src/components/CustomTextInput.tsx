import {View, Text, TextInputProps, TextInput} from 'react-native';
import React from 'react';
import {colors} from 'theme';

interface CustomTextInputProps extends TextInputProps {
  text?: string;
  textArea?: boolean;
  fullWitdth?: boolean;
  ref?: React.RefObject<TextInput>;
}

const CustomTextInput = ({
  text,
  textArea = false,
  fullWitdth = true,
  ...props
}: CustomTextInputProps) => {
  return (
    <View className={`space-y-2 ${fullWitdth ? 'w-full' : 'w-2/3'}`}>
      {text ? (
        <Text className={`${colors.heading}  text-lg font-bold`}>{text}</Text>
      ) : null}
      <TextInput
        {...props}
        multiline={textArea}
        numberOfLines={textArea ? 8 : undefined}
        style={textArea ? {height: 150, textAlignVertical: 'top'} : {}}
        className={`${
          colors.heading
        } p-4 bg-white shadow-sm shadow-black mb-3 ${
          textArea ? 'rounded-lg' : 'rounded-full'
        }`}
      />
    </View>
  );
};

export default CustomTextInput;
