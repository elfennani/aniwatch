import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import useShowQuery from "@/api/use-show-query";
import { Stack, useLocalSearchParams } from "expo-router";
import PlayerLoader from "@/components/player-loader";
import { StatusBar } from "expo-status-bar";
import { useKeepAwake } from "expo-keep-awake";
import ErrorScreen from "@/components/error-screen";

type Params = {
  id: string;
  ep: string;
};

const WatchByEp = () => {
  const { id, ep } = useLocalSearchParams<Params>();
  const {
    data: media,
    isPending,
    error,
    isError,
    refetch,
    isRefetching,
    isFetching,
  } = useShowQuery({ id: Number(id) });
  useKeepAwake();

  if (isPending || (media && !media.allanimeId))
    return (
      <View style={styles.background}>
        <ActivityIndicator size={40} color="white" />
      </View>
    );

  if (isError && !media) {
    return (
      <ErrorScreen
        error={error}
        isRetrying={isFetching || isFetching || isPending}
        onRetry={refetch}
      />
    );
  }

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
        allAnimeId={media.allanimeId!}
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
