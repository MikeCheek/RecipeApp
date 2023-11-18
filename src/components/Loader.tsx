import {View, ActivityIndicator, ActivityIndicatorProps} from 'react-native';
import React from 'react';

const Loader = (props: ActivityIndicatorProps) => {
  return (
    <View className="flex flex-row items-center justify-center mt-20">
      <ActivityIndicator size={'large'} color="rgb(251 191 36)" {...props} />
    </View>
  );
};

export default Loader;
