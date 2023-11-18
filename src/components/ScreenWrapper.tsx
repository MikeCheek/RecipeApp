import React from 'react';
import {
  View,
  StatusBar,
  Platform,
  ViewProps,
  Dimensions,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import {
  AvoidSoftInputView,
  AvoidSoftInputViewProps,
} from 'react-native-avoid-softinput';
import {colors} from 'theme';

interface ScreenWrapperProps extends ViewProps, ScrollViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  inputs?: boolean;
}

const ScreenWrapper = ({
  children,
  scrollable = false,
  inputs = false,
  className,
  style,
  ...props
}: ScreenWrapperProps) => {
  const statusBarHeight = StatusBar.currentHeight
    ? StatusBar.currentHeight
    : Platform.OS === 'ios'
    ? 30
    : 0;
  const windowHeight = Dimensions.get('window').height;
  const avoidInputProps = {
    avoidOffset: 15,
    easing: 'easeOut',
    hideAnimationDelay: 0,
    hideAnimationDuration: 100,
    showAnimationDelay: 0,
    showAnimationDuration: 100,
  } as AvoidSoftInputViewProps;

  return (
    <>
      {scrollable ? (
        <ScrollView
          className={className}
          style={[
            style,
            {
              backgroundColor: colors.background,
              marginTop: statusBarHeight,
              // height: windowHeight - statusBarHeight,
              maxHeight: windowHeight - statusBarHeight,
            },
          ]}
          {...props}>
          {inputs ? (
            <AvoidSoftInputView {...avoidInputProps}>
              {children}
            </AvoidSoftInputView>
          ) : (
            children
          )}
        </ScrollView>
      ) : (
        <View
          className={className}
          style={[
            style,
            {
              backgroundColor: colors.background,
            },
            inputs
              ? {}
              : {
                  marginTop: statusBarHeight,
                  // height: windowHeight - statusBarHeight,
                  maxHeight: windowHeight - statusBarHeight,
                },
          ]}>
          {inputs ? (
            <AvoidSoftInputView
              {...avoidInputProps}
              style={
                inputs
                  ? {
                      marginTop: statusBarHeight,
                      // height: windowHeight - statusBarHeight,
                      maxHeight: windowHeight - statusBarHeight,
                    }
                  : {}
              }
              {...props}>
              {children}
            </AvoidSoftInputView>
          ) : (
            children
          )}
        </View>
      )}
    </>
  );
};

export default ScreenWrapper;
