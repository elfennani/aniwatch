import {
  ActivityIndicator,
  Button,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import { HlsVideoView } from "@/modules/hls-video";
import { StatusBar } from "expo-status-bar";
import { setVisibilityAsync } from "expo-navigation-bar";
// import { OnProgressEventProps, VLCPlayer } from "react-native-vlc-media-player";

type Params = {
  url: string;
  hls: string;
};

let timer: any = null;
const TIMEOUT = 250;
const debounce = (onSingle: () => void, onDouble: () => void) => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    onDouble();
  } else {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      onSingle();
    }, TIMEOUT);
  }
};

const Watch = () => {
  const { url, hls } = useLocalSearchParams<Params>();
  const [paused, setPaused] = useState(false);
  const [seek, setSeek] = useState<number | undefined>(0);
  const [buffering, setBuffering] = useState(false);
  const [progress, setProgress] = useState<any>();
  const { width, height } = useWindowDimensions();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setVisibilityAsync("hidden");
  }, []);

  const onPress = ({ nativeEvent: { pageX } }: GestureResponderEvent) => {
    debounce(
      () => {},
      () => {
        if (pageX <= width * 0.33) {
          setSeek((progress?.currentTime ?? 0) / 1000 - 10);
          return;
        }
        if (pageX >= width * 0.66) {
          setSeek((progress?.currentTime ?? 0) / 1000 + 10);
          return;
        }

        setPaused((p) => !p);
      }
    );
  };

  if (!fullscreen) {
    return (
      <View>
        <Stack.Screen
          options={{ orientation: "portrait", presentation: "modal" }}
        />
        <HlsVideoView
          url={url}
          style={{ width: "100%", aspectRatio: 16 / 9 }}
        />
        <Button title="Fullscreen" onPress={() => setFullscreen(true)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: "relative", backgroundColor: "black" }}>
      <Stack.Screen
        options={{
          orientation: "landscape",
          presentation: "fullScreenModal",
          headerShown: false,
        }}
      />
      <HlsVideoView url={url} style={{ width: "100%", height: "100%" }} />
      <View style={{ position: "absolute", top: 32, right: 32 }}>
        <Button title="Exit" onPress={() => setFullscreen(false)} />
      </View>
    </View>
  );

  return (
    <View
      style={{
        width,
        height,
        position: "relative",
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <Pressable onPress={onPress}> */}
      <HlsVideoView url={url} style={{ width: "100%", height: "100%" }} />
      {/* <VLCPlayer
          source={{ uri: url }}
          style={{ width: "100%", height: "100%" }}
          paused={paused}
          seek={seek}
          resizeMode="contain"
          onProgress={(ev) => {
            setBuffering(false);
            setProgress(ev);
          }}
          onBuffering={() => setBuffering(true)}
          onLoad={() => setBuffering(false)}
        /> */}
      {/* <View style={styles.overlay}>
          {buffering && <ActivityIndicator color="white" size={"large"} />}
        </View>
      </Pressable> */}
      <StatusBar hidden={true} />
    </View>
  );
};

export default Watch;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
