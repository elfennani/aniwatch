import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { HlsVideoView } from "@/modules/hls-video";
import { useLocalSearchParams } from "expo-router";

type Props = {};

const WatchTest = (props: Props) => {
  const { url } = useLocalSearchParams<{ url: string }>();
  return (
    <View>
      <Text>WatchTest</Text>
      <View>
        <HlsVideoView
          url={url}
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
            backgroundColor: "black",
          }}
        />
      </View>
    </View>
  );
};

export default WatchTest;

const styles = StyleSheet.create({});
