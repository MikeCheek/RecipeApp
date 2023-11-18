import React from 'react';
import Animated from 'react-native-reanimated';
import FastImage, {FastImageProps} from 'react-native-fast-image';

export const AnimatedFastImage = Animated.createAnimatedComponent(
  FastImage as React.FunctionComponent<FastImageProps>,
);
