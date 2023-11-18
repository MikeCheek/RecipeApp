import {View, Text} from 'react-native';
import React from 'react';
import Loader from './Loader';
import {colors} from 'theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface PageLoaderProps {
  visible: boolean;
}

const PageLoader = ({visible}: PageLoaderProps) => {
  return (
    <View
      className="bg-[#00000089] absolute left-4 top-4 pr-4 pb-4 flex items-center justify-center gap-4"
      style={
        visible
          ? {zIndex: 99999, width: wp(100), height: hp(100)}
          : {display: 'none', zIndex: -99}
      }>
      <Loader />
      <Text style={{color: colors.cta}}>Loading...</Text>
    </View>
  );
};

export default PageLoader;
