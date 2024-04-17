import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { ResizeMode, Video } from "expo-av";
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
  const { width } = useWindowDimensions();

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

  return (
    <View style={{ width: "100%", height: "100%", position: "relative" }}>
      <Stack.Screen
        options={{
          orientation: "landscape",
          headerShown: false,
          navigationBarHidden: true,
          presentation: "fullScreenModal",
          statusBarHidden: true,
        }}
      />
      <Pressable onPress={onPress}>
        <Video
          source={{ uri: url }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          // onPlaybackStatusUpdate={status => setStatus(() => status)}
          style={{ width: "100%", height: "100%" }}
        />
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
        <View style={styles.overlay}>
          {buffering && <ActivityIndicator color="white" size={"large"} />}
        </View>
      </Pressable>
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
