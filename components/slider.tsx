import {
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { ReactNode, useRef } from "react";
import Text from "./text";
import Box from "./box";
import chroma from "chroma-js";

type Props = {
  /** Value between 0-100 */
  value: number;
  onChange: (callback: (value: number) => number) => void;
  icon: ReactNode;
};

const Slider = ({ icon, onChange, value }: Props) => {
  const startPos = useRef(0);
  const initialValue = useRef(0);

  const handleTouchStart = ({
    nativeEvent: { pageX },
  }: GestureResponderEvent) => {
    startPos.current = pageX;
    initialValue.current = value;
  };
  const handleTouchMove = ({
    nativeEvent: { pageX },
  }: GestureResponderEvent) => {
    onChange((value) => {
      const newVal = initialValue.current + (pageX - startPos.current);
      // console.log(newVal);

      if (newVal >= 100) return 100;
      if (newVal <= 0) return 0;

      return newVal;
    });
  };

  return (
    <TouchableWithoutFeedback>
      <Box
        row
        gap="md"
        style={{ alignItems: "center" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        hitSlop={20}
      >
        {icon}
        <Box
          height="xs"
          width="6xl"
          rounding="full"
          style={{ backgroundColor: chroma("#fff").alpha(0.25).css() }}
        >
          <Box
            height="xs"
            width="6xl"
            rounding="full"
            background="white"
            style={{ width: `${value}%` }}
          />
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default Slider;

const styles = StyleSheet.create({});
