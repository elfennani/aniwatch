import {
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect } from "react";
import useShowQuery from "@/api/use-show-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import PlayerLoader from "@/components/player-loader";
import { StatusBar } from "expo-status-bar";
import { useKeepAwake } from "expo-keep-awake";

const WatchByEp = () => {
  const { id, ep } = useLocalSearchParams<{ id: string; ep: string }>();
  const {
    data: media,
    isPending,
    error,
    isError,
  } = useShowQuery({ id: Number(id) });
  const router = useRouter();
  useKeepAwake();

  useEffect(() => {
    if (isError) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
      if (router.canGoBack()) {
        router.back();
      }
    }
  }, [isError, error]);

  if (isPending || isError || !media.allanimeId)
    return (
      <View style={styles.background}>
        <ActivityIndicator size={40} color="white" />
      </View>
    );

  return (
    <>
      <StatusBar hidden />
      <Stack.Screen
        options={{
          navigationBarHidden: true,
          orientation: "landscape",
        }}
      />
      <PlayerLoader
        media={media}
        aniListId={media.id}
        allAnimeId={media.allanimeId}
        watched={(media.progress ?? 0) >= Number(ep)}
        episode={Number(ep)}
        dubbed={
          media.episodes?.some(
            (episode) => episode.number == Number(ep) && episode.dub
          ) ?? false
        }
      />
    </>
  );
};

export default WatchByEp;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
