import {
  Button,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import useLinkQuery from "@/api/use-link-query";
import { Stack } from "expo-router";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";

type Props = {
  allAnimeId: string;
  episode: number;
};

const PlayerLoader = ({ allAnimeId, episode }: Props) => {
  const { height, width } = useWindowDimensions();
  const { data, isPending, isError } = useLinkQuery({
    episode: episode.toString(),
    allAnimeId,
    type: "sub",
  });

  return (
    <View style={{ position: "relative", backgroundColor: "black" }}>
      {data && (
        <Video
          source={{ uri: data }}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
        />
      )}
      <View style={{ position: "absolute", top: 16, right: 16 }}>
        <Button title="Exit" />
      </View>
    </View>
  );
};

export default PlayerLoader;

const styles = StyleSheet.create({});
