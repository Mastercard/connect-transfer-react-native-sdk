import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';

import { LoaderStyle as styles } from './ComponentStyles';

const MALoader = ({ size = 80, color = '#CF4500', strokeWidth = 8, borderRadius = 40 }) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.linear }), -1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }]
  }));

  const customStyle = {
    height: size,
    width: size,
    borderLeftColor: color,
    borderTopColor: color,
    borderWidth: strokeWidth,
    borderRadius
  };

  return (
    <View style={styles.container} testID="loader-box">
      <Animated.View style={[styles.box, animatedStyle, customStyle]} />
    </View>
  );
};

export default MALoader;
