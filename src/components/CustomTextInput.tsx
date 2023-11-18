import {View, Text, TextInputProps, TextInput} from 'react-native';
import React from 'react';
import {colors} from 'theme';

interface CustomTextInputProps extends TextInputProps {
  text: string;
  textArea?: boolean;
  ref?: React.RefObject<TextInput>;
}

const CustomTextInput = ({
  text,
  textArea = false,
  ...props
}: CustomTextInputProps) => {
  return (
    <View className="space-y-2 w-full">
      <Text className={`${colors.heading} text-lg font-bold`}>{text}</Text>
      <TextInput
        {...props}
        multiline={textArea}
        numberOfLines={textArea ? 8 : undefined}
        style={textArea ? {height: 150, textAlignVertical: 'top'} : {}}
        className={`${colors.heading} p-4 bg-white mb-3 ${
          textArea ? 'rounded-lg' : 'rounded-full'
        }`}
      />
    </View>
  );
};

export default CustomTextInput;
