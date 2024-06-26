import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { ReactNode, createContext, useContext } from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from "react-native-reanimated";
import { Iconify } from "react-native-iconify";
import { zinc } from "tailwindcss/colors";
import { Portal } from "@gorhom/portal";
import Text from "./text";
import cn from "@/utils/cn";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode | ReactNode[];
};

const CloseContext = createContext({ onClose: () => {} });

const Options = (props: Props) => {
  if (!props.visible) return;

  if (Platform.OS == "web") {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 z-30">
        <OptionsContent {...props} />
      </div>
    );
  }

  return (
    <Portal>
      <OptionsContent {...props} />
    </Portal>
  );
};

const OptionsContent = ({ children, onClose }: Props) => {
  return (
    <CloseContext.Provider value={{ onClose }}>
      <View
        style={StyleSheet.absoluteFill}
        className="relative items-center justify-end web:w-full web:h-full"
      >
        <TouchableWithoutFeedback onPress={() => onClose()}>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.33)]"
          />
        </TouchableWithoutFeedback>

        <Animated.View
          entering={FadeInDown.duration(150)}
          exiting={FadeOutDown.duration(150)}
          className="bg-zinc-950 py-3 m-4 w-full native:max-w-[380] web:max-w-[380px] min-h-52 rounded-2xl"
        >
          <View className="h-1 w-8 mb-3 bg-zinc-700 rounded-lg self-center" />
          {children}
        </Animated.View>
      </View>
    </CloseContext.Provider>
  );
};

interface OptionProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  more?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

const Option = ({
  icon,
  title,
  more,
  subtitle,
  onPress,
  disabled,
}: OptionProps) => {
  const { onClose } = useContext(CloseContext);
  return (
    <TouchableHighlight
      onPress={() => {
        onPress?.();
        onClose();
      }}
      underlayColor={zinc[900]}
      disabled={disabled}
    >
      <View
        className={cn(
          "px-6 py-3 flex-row items-center gap-4",
          disabled && "opacity-50"
        )}
      >
        {icon}
        <Text className="!text-zinc-300 flex-1 text-sm">{title}</Text>
        {subtitle && <Text className="!text-zinc-500 text-xs">{subtitle}</Text>}
        {more && (
          <Iconify
            icon="material-symbols-light:chevron-right"
            size={18}
            color={zinc[500]}
          />
        )}
      </View>
    </TouchableHighlight>
  );
};

Options.Option = Option;

export default Options;
