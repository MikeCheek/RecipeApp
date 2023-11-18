import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {colors} from 'theme';
import FilterBadge from './FilterBadge';

interface AreasProps {
  areas: string[];
  setArea: (a?: string) => void;
  active?: string;
}

const Areas = ({areas, setArea, active}: AreasProps) => {
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{paddingHorizontal: 15, rowGap: 4}}>
        {areas.map((area, key) => (
          <FilterBadge
            key={key}
            active={active === area}
            text={area}
            action={() =>
              area === active ? setArea(undefined) : setArea(area)
            }
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export default Areas;
