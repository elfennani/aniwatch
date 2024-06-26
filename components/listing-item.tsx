import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewProps,
  useColorScheme,
} from "react-native";
import React, { ReactNode, memo, useState } from "react";
import MediaStatus from "@/interfaces/MediaStatus";
import Text from "./text";
import { Image, ImageBackground } from "expo-image";
import { purple, zinc } from "tailwindcss/colors";
import { Iconify } from "react-native-iconify";
import cn from "@/utils/cn";
import { LinearGradient } from "expo-linear-gradient";
import StatusIcon from "./status-icon";

type Props = {
  thumbnail: string;
  title: string;
  subtitle?: string;
  status?: MediaStatus;
  type: "grid" | "list" | "carousel" | "list-alt";
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  className?: string;
  trailing?: ReactNode;
  carouselWidth?: number;
  recyclingKey?: string | null;
} & ViewProps;

const ListingItem: React.FC<Props> = memo((props: Props) => {
  const scheme = useColorScheme();
  const [isPressed, setIsPressed] = useState(false);
  const dark = scheme == "dark";
  const activeOpacity = dark ? 0.8 : 0.66;

  if (props.type == "list-alt" && Platform.OS == "web")
    return (
      <TouchableWithoutFeedback
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => props.onPrimaryPress?.()}
      >
        <View
          {...props}
          className={cn(
            "flex-row gap-4 h-[80px] relative rounded-lg overflow-hidden cursor-pointer",
            props.className
          )}
        >
          <View className="rounded-lg overflow-hidden">
            <Image
              recyclingKey={props.recyclingKey}
              transition={150}
              source={{ uri: props.thumbnail }}
              style={{ aspectRatio: 16 / 9, height: 80 }}
            />
          </View>

          <View
            className="flex-row w-full items-center pr-4 gap-4"
            style={{ opacity: isPressed ? activeOpacity : 1 }}
          >
            <View className="flex-row flex-1 items-center">
              <View className="gap-2 flex-1">
                <View className="gap-1">
                  <Text numberOfLines={1} className="text-lg !font-semibold">
                    {props.title}
                  </Text>
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                    {props.subtitle}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );

  if (props.type == "list-alt")
    return (
      <TouchableWithoutFeedback
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => props.onPrimaryPress?.()}
      >
        <View
          {...props}
          className={cn(
            "flex-row gap-4 h-[80] relative rounded-lg overflow-hidden",
            props.className
          )}
        >
          <View
            className="dark:bg-zinc-700 bg-zinc-200 h-full absolute top-0 bottom-0 left-0 aspect-[20/9] "
            style={{ opacity: isPressed ? activeOpacity : 1 }}
          >
            <Image
              recyclingKey={props.recyclingKey}
              transition={150}
              source={{ uri: props.thumbnail }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View className="absolute top-0 left-0 bottom-0 aspect-[20/9] opacity-100">
            <LinearGradient
              dither={false}
              colors={["transparent", dark ? "black" : "white"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full h-full"
              style={{ opacity: 1 }}
            ></LinearGradient>
          </View>
          <View
            className="flex-row w-full items-center pr-4 gap-4"
            style={{ opacity: isPressed ? activeOpacity : 1 }}
          >
            <View className="flex-row flex-1 items-center">
              <View className="h-full aspect-[4/3]" />
              <View className="gap-2 flex-1">
                <View className="gap-1">
                  <Text numberOfLines={1} className="text-lg !font-semibold">
                    {props.title}
                  </Text>
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                    {props.subtitle}
                  </Text>
                </View>
              </View>
            </View>
            {props.trailing}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );

  if (props.type == "grid")
    return (
      <TouchableOpacity
        onPress={() => props.onPrimaryPress?.()}
        className={cn("w-[96] web:w-[96px] gap-2", props.className)}
        activeOpacity={activeOpacity}
      >
        <View className="dark:bg-zinc-700 bg-zinc-200 w-[96] aspect-[0.69] rounded-2xl overflow-hidden">
          <ImageBackground
            recyclingKey={props.recyclingKey}
            transition={150}
            source={{ uri: props.thumbnail }}
            style={{ width: "100%", height: "100%", position: "relative" }}
          >
            {props.trailing}
            {props.status && (
              <View className="p-1 rounded-full bg-purple-500 absolute top-2 left-2">
                <StatusIcon status={props.status} color="white" size={16} />
              </View>
            )}
          </ImageBackground>
        </View>
        <View className="gap-[2]">
          <Text
            numberOfLines={2}
            className="text-sm !font-semibold text-center"
          >
            {props.title}
          </Text>
          <Text className="text-xs text-zinc-600 dark:text-zinc-400 text-center w-full">
            {props.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );

  if (props.type == "carousel") {
    return (
      <TouchableOpacity
        {...props}
        onPress={() => props.onPrimaryPress?.()}
        className={cn(
          "rounded-2xl overflow-hidden dark:bg-zinc-900 bg-zinc-100",
          props.className
        )}
        activeOpacity={activeOpacity}
      >
        <View className="dark:bg-zinc-700 bg-zinc-200 aspect-video">
          <ImageBackground
            recyclingKey={props.recyclingKey}
            transition={150}
            source={{ uri: props.thumbnail }}
            style={{ width: "100%", height: "100%" }}
          >
            <View className="w-full h-full bg-[rgba(0,0,0,0.33)] items-center justify-center">
              <View className={`p-2 bg-[rgba(255,255,255,0.15)] rounded-full`}>
                <Iconify
                  icon="material-symbols-light:play-arrow-outline"
                  size={40}
                  color={"white"}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
        <View className="px-4 py-3 flex-row items-center">
          <View className="gap-[2] flex-1">
            <Text numberOfLines={2} className="text-base !font-semibold">
              {props.title}
            </Text>
            <Text className="text-xs text-zinc-600 dark:text-zinc-400">
              {props.subtitle}
            </Text>
          </View>
          <TouchableOpacity
            hitSlop={16}
            onPress={() => props.onSecondaryPress?.()}
          >
            <Iconify
              icon="material-symbols-light:info-i"
              size={24}
              color={zinc[400]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => props.onPrimaryPress?.()}
      className={cn("self-stretch flex-row gap-4", props.className)}
      activeOpacity={activeOpacity}
    >
      <View className="dark:bg-zinc-700 bg-zinc-200 w-[96] aspect-[0.69] rounded-2xl overflow-hidden">
        <Image
          recyclingKey={props.recyclingKey}
          transition={150}
          source={{ uri: props.thumbnail }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View className="py-4 gap-2 flex-1">
        <View>
          <Text numberOfLines={2} className="text-lg !font-semibold">
            {props.title}
          </Text>
          <Text className="text-sm text-zinc-600 dark:text-zinc-400">
            {props.subtitle}
          </Text>
        </View>
        {props.status && (
          <View className="flex-row items-center gap-2">
            <StatusIcon
              status={props.status}
              color={dark ? purple[400] : purple[500]}
              size={18}
            />
            <Text className="text-purple-500 dark:text-purple-400 capitalize">
              {props.status}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

export default ListingItem;

const styles = StyleSheet.create({});
