import {View, Text, Easing} from 'react-native';
import React, {useEffect} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from 'theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const NewsBanner = () => {
  const news = ['', ...remoteConfig().getValue('news').asString().split(',')];
  const posX = useSharedValue(wp(100));
  const duration = 20000;

  useEffect(() => {
    posX.value = withRepeat(
      withTiming(-wp(100), {
        duration: duration,
        // easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: posX.value}],
    };
  });

  return (
    <View
      className="absolute top-0 py-px px-4 overflow-hidden opacity-80 flex flex-row"
      style={{
        width: wp(100),
        maxWidth: wp(100),
        backgroundColor: colors.cta,
      }}>
      <Text
        className="px-4 text-white font-semibold border-r-2 border-white z-10 absolute left-0"
        style={{backgroundColor: colors.cta}}>
        NEWS
      </Text>
      <Animated.View
        style={animatedStyles}
        className="flex flex-row space-x-16 pl-4 z-0">
        {news.map((name, key) => (
          <Text key={key} className="text-white font-semibold">
            {name}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

export default NewsBanner;
