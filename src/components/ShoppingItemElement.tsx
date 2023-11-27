import {View, Text, Dimensions} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {ShoppingItem} from 'types';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import IconButton from './IconButton';
import {TrashIcon} from 'react-native-heroicons/outline';
import {colors} from 'theme';

interface ShoppingItemElementProps {
  item: ShoppingItem;
  check: (item: ShoppingItem) => Promise<void>;
  deleteItem: (item: ShoppingItem) => Promise<void>;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = SCREEN_WIDTH * 0.3;

const ShoppingItemElement = ({
  item,
  check,
  deleteItem,
}: ShoppingItemElementProps) => {
  const translateX = useSharedValue(0);

  const removeItem = async () => await deleteItem(item);

  const fun = () => {
    'worklet';
    runOnJS(removeItem)();
  };

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: event => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      const shouldBeDismissed = translateX.value < -TRANSLATE_X_THRESHOLD;
      if (shouldBeDismissed) {
        translateX.value = withTiming(-SCREEN_WIDTH, undefined, fun);
      } else translateX.value = withTiming(0);
    },
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const rIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      translateX.value < -TRANSLATE_X_THRESHOLD ? 1 : 0,
    );
    return {opacity};
  });

  return (
    <View className="relative">
      <Animated.View
        className="absolute right-[10%] top-[15px]"
        style={rIconStyle}>
        <TrashIcon size={30} color={colors.heart} strokeWidth={2} />
      </Animated.View>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View
          className="flex flex-row my-2 mx-6 bg-white p-2 rounded-full shadow-md shadow-black"
          style={rStyle}>
          <BouncyCheckbox
            isChecked={item.checked}
            onPress={() => check(item)}
          />
          <Text
            className="font-bold"
            style={
              item.checked
                ? {
                    textDecorationLine: 'line-through',
                    opacity: 0.5,
                  }
                : {}
            }>
            {item.item}
          </Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default ShoppingItemElement;
