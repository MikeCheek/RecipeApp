import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {hp} from 'helpers/responsiveScreen';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';

interface SearchBarProps extends TextInputProps {
  onSearch?: () => void;
}

const SearchBar = (props: SearchBarProps) => {
  return (
    <View className="mx-4 flex-row items-center rounded-full bg-black/5 px-[6px]">
      <TextInput
        {...props}
        placeholderTextColor="gray"
        style={{fontSize: hp(1.7)}}
        className="flex-1 text-base mb-1 pl-3 tracking-wider"
        enterKeyHint="search"
        returnKeyLabel="search"
      />
      <TouchableOpacity
        onPress={props.onSearch}
        className="bg-white rounded-full p-3">
        <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
