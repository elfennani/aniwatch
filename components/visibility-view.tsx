import { ViewProps } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  visible: boolean;
} & ViewProps;

const VisibilityView = ({ visible, ...props }: Props) => {
  const opacity = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value ? "flex" : "none",
  }));

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 100,
    });
  }, [visible]);

  return <Animated.View {...props} style={[props.style, style]} />;
};

export default VisibilityView;
