import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import VisibilityView from "./visibility-view";
import chroma from "chroma-js";
import { SafeAreaView } from "react-native-safe-area-context";
import Box from "./box";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  useDerivedValue,
} from "react-native-reanimated";
import { useTheme } from "@/ctx/theme-provider";
import Text from "./text";

export type BottomSheetProps = {
  label: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
};

const BottomSheet = ({
  children,
  onClose,
  visible,
  label,
}: BottomSheetProps) => {
  const theme = useTheme();
  const [modal, setModal] = useState(visible);
  const [height, setHeight] = useState<number>();
  const animationDistance = useMemo(
    () => (height ? height + theme.spacing.xl * 2 : 500),
    [height]
  );

  const sv = useSharedValue<number>(1);
  const opacity = useDerivedValue(() => 1 - sv.value);
  const bottom = useDerivedValue(
    () => sv.value * -animationDistance,
    [animationDistance]
  );
  const style = useAnimatedStyle(() => ({
    bottom: withSpring(bottom.value, {
      duration: 2000,
      dampingRatio: 0.7,
      stiffness: 100,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    }),

    opacity: withDelay(50, withTiming(opacity.value, { duration: 100 })),
  }));

  useEffect(() => {
    sv.value = visible ? 0 : 1;
  }, [visible]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (visible == false) {
      timeout = setTimeout(() => setModal(visible), 300);
    } else {
      setModal(visible);
    }

    return () => timeout && clearTimeout(timeout);
  }, [visible]);

  return (
    <Modal
      onRequestClose={onClose}
      transparent
      animationType="none"
      statusBarTranslucent
      visible={modal}
    >
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <VisibilityView
          duration={300}
          visible={visible}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: chroma("#000").alpha(0.33).css() },
          ]}
        >
          <SafeAreaView style={{ flex: 1, justifyContent: "flex-end" }}>
            <KeyboardAvoidingView behavior="position">
              <Box padding="xl">
                <Pressable>
                  <Box
                    animated
                    style={[{ position: "relative", elevation: 12 }, style]}
                    rounding="sm"
                    padding="lg"
                    background="background"
                    onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
                  >
                    <Box gap="md" style={{ paddingBottom: theme.spacing.md }}>
                      <Text variant="label" color="secondary">
                        {label}
                      </Text>
                      <Box background="faded" style={{ height: 1 }} />
                    </Box>
                    {children}
                  </Box>
                </Pressable>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </VisibilityView>
      </Pressable>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
