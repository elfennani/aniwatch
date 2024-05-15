import { ViewProps } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  visible: boolean;
  duration?: number;
} & ViewProps;

const VisibilityView = ({ visible, duration = 100, ...props }: Props) => {
  const opacity = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value ? "flex" : "none",
  }));

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration,
    });
  }, [visible]);

  return <Animated.View {...props} style={[props.style, style]} />;
};

export default VisibilityView;
